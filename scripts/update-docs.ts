import { slug } from 'github-slugger';
import { exec } from 'node:child_process';
import * as fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import prettier from 'prettier';
import { JSONOutput } from 'typedoc';
import * as v from 'valibot';
import { VivliostyleConfigSchema } from '../src/config/schema.js';
import { useTmpDirectory } from '../src/util.js';

function insertDocs(
  input: string,
  docsName: string,
  insertedText: string,
): string {
  return input.replace(
    new RegExp(
      `<!-- START ${docsName}([\\w\\W]+?)<!-- END ${docsName}.*\\n`,
      'm',
    ),
    `<!-- START ${docsName} -->\n${insertedText}\n<!-- END ${docsName} -->\n`,
  );
}

async function buildConfigDocs(): Promise<string> {
  const visited = Symbol('visited');
  const definition = Symbol('definition');
  const namedDefinitionSet = new Set<string>();

  const getSchema = (
    s: v.BaseSchema<any, any, any>,
  ):
    | v.BaseSchema<any, any, any>
    | v.ArraySchema<any, any>
    | v.ObjectSchema<v.ObjectEntries, any>
    | v.LooseObjectSchema<v.ObjectEntries, any>
    | v.UnionSchema<v.UnionOptions, any>
    | v.IntersectSchema<v.IntersectOptions, any>
    | v.OptionalSchema<any, any>
    | v.NonOptionalSchemaAsync<any, any>
    | v.LazySchema<any>
    | v.RecordSchema<any, any, any>
    | v.FunctionSchema<any>
    | v.InstanceSchema<any, any>
    | v.StringSchema<any>
    | v.NumberSchema<any>
    | v.BooleanSchema<any>
    | v.LiteralSchema<any, any> => {
    let schema = s;
    while ('pipe' in schema) {
      schema = (schema as v.SchemaWithPipe<any>).pipe[0];
    }
    return schema;
  };

  const getMeta = (s: v.BaseSchema<any, any, any>) => {
    return ('pipe' in s ? (s as v.SchemaWithPipe<any>).pipe : []).reduce(
      (acc, item) => {
        if (item.kind === 'metadata') {
          if (item.type === 'title') {
            acc.title = item.title;
          } else if (item.type === 'description') {
            acc.description = item.description;
          } else if (item.type === 'metadata') {
            acc = { ...acc, ...item.metadata };
          }
        }
        return acc;
      },
      {},
    );
  };

  async function traverse(
    schemaWithPipe: v.BaseSchema<any, any, any>,
  ): Promise<string> {
    const meta = getMeta(schemaWithPipe);
    const { title, description = '' } = meta;
    const schema = getSchema(schemaWithPipe);
    if (schema[visited]) {
      if (title) {
        // should be set by a traverse of LazySchema
        schema[definition] = title;
      }
      return '';
    }
    schema[visited] = true;

    let docs = '';
    let properties: v.ObjectEntries | undefined;
    if (v.isOfType('array', schema)) {
      const item = await traverse(schema.item);
      docs += item;
      schema[definition] = `(${getSchema(schema.item)[definition]})[]`;
    } else if (
      v.isOfType('object', schema) ||
      v.isOfType('loose_object', schema)
    ) {
      const entries = await Object.values(schema.entries).reduce(
        (acc, value) =>
          acc.then(async (acc) => [...acc, await traverse(value)]),
        Promise.resolve([] as string[]),
      );
      docs += entries.filter(Boolean).join('\n\n');
      schema[definition] = `{${Object.entries<any>(schema.entries)
        .map(
          ([k, value]) =>
            `${v.isOfType('optional', value) ? `${k}?` : k}: ${getSchema(value)[definition] || 'unknown'}`,
        )
        .join('; ')}}`;
      properties = { ...schema.entries };
    } else if (v.isOfType('union', schema) || v.isOfType('intersect', schema)) {
      const out = await [...schema.options].reduce(
        (acc, option) =>
          acc.then(async (acc) => [...acc, await traverse(option)]),
        Promise.resolve([] as string[]),
      );
      docs += out.filter(Boolean).join('\n\n');
      if (
        schema.type === 'intersect' &&
        schema.options.every((option) =>
          /^{.+}$/g.test(getSchema(option)[definition]),
        )
      ) {
        // Merge plain object intersections
        schema[definition] = `{${schema.options
          .map((option) =>
            getSchema(option)[definition].replace(/^{(.+)}$/, '$1'),
          )
          .join(';')}}`;
        properties = [...schema.options].reduce(
          (acc, option) => ({
            ...acc,
            ...(option as v.ObjectSchema<v.ObjectEntries, any>).entries,
          }),
          {} as v.ObjectEntries,
        );
      } else {
        schema[definition] = schema.options
          .map((option) => getSchema(option)[definition])
          .filter(Boolean)
          .join(schema.type === 'union' ? ' | ' : ' & ');
      }
    } else if (
      v.isOfType('optional', schema) ||
      v.isOfType('non_optional', schema)
    ) {
      const out = await traverse(schema.wrapped);
      docs += out;
      schema[definition] = getSchema(schema.wrapped)[definition];
    } else if (v.isOfType('lazy', schema)) {
      const actual = schema.getter(null);
      const out = await traverse(actual);
      docs += out;
      schema[definition] = getSchema(actual)[definition];
    } else if (v.isOfType('record', schema)) {
      const key = await traverse(schema.key);
      const value = await traverse(schema.value);
      docs += key + value;
      schema[definition] =
        `{[key: (${getSchema(schema.key)[definition]})]: ${getSchema(schema.value)[definition]}}`;
    } else if (v.isOfType('function', schema)) {
      const out = await (meta.typeReferences || []).reduce(
        (acc, type) => acc.then(async (acc) => [...acc, await traverse(type)]),
        Promise.resolve([] as string[]),
      );
      docs += out.filter(Boolean).join('\n\n');
      schema[definition] = meta.typeString || 'Function';
    } else if (
      v.isOfType('instance', schema) ||
      v.isOfType('string', schema) ||
      v.isOfType('number', schema) ||
      v.isOfType('boolean', schema) ||
      v.isOfType('literal', schema)
    ) {
      schema[definition] = schema.expects;
    } else {
      schema[definition] =
        meta.typeString || `"{${schema.type}(${schema.expects})}"`;
    }

    if (!meta.title) {
      return docs;
    }
    namedDefinitionSet.add(meta.title);

    const namedDefinition = schema[definition];
    schema[definition] = meta.title;
    const tsDefinition = await prettier.format(
      `type ${meta.title} = ${namedDefinition};`,
      { parser: 'typescript', printWidth: 40 },
    );
    return [
      `### ${meta.title}`,
      description.trim(),
      ...(() => {
        if (!properties || Object.keys(properties).length === 0) {
          return [];
        }
        let ret = `- \`${title}\``;
        for (const [k, value] of Object.entries(properties)) {
          const propMeta =
            'pipe' in value
              ? getMeta(value)
              : value.type === 'optional' || value.type === 'non_optional'
                ? getMeta((value as v.OptionalSchema<any, any>).wrapped)
                : {};
          const unwrapped =
            value.type === 'optional' || value.type === 'non_optional'
              ? (value as v.OptionalSchema<any, any>).wrapped
              : value;
          const typeString = value[definition]
            ? value[definition].replace(
                new RegExp(`(${[...namedDefinitionSet].join('|')})`, 'g'),
                (v) => `[${v}](#${slug(v)})`,
              )
            : unwrapped.expects || 'unknown';
          ret += propMeta.deprecated
            ? `\n\n  - ~~\`${k}\`~~ _Deprecated_`
            : `\n\n  - \`${k}\`: ${typeString}`;
          if (propMeta.description) {
            ret += `  \n    ${propMeta.description.split('\n').join('\n    ')}`;
          }
        }
        return ['#### Properties', ret];
      })(),
      `#### Type definition`,
      `\`\`\`ts\n${tsDefinition.trim()}\n\`\`\``,
      docs,
    ]
      .filter(Boolean)
      .join('\n\n');
  }
  return await traverse(VivliostyleConfigSchema);
}

async function buildApiDocs() {
  const [tmp, removeTmpDir] = await useTmpDirectory();
  const execAsync = promisify(exec);
  const { stderr } = await execAsync(
    `npx typedoc --logLevel Error --out ${tmp} --json ${path.join(tmp, 'api.json')}`,
  );
  if (stderr) {
    throw new Error(stderr);
  }

  const json = JSON.parse(
    fs.readFileSync(path.join(tmp, 'api.json'), 'utf-8'),
  ) as JSONOutput.ProjectReflection;
  let docs = `## Exported members\n\n`;
  for (const group of json.groups || []) {
    docs += `### ${group.title}\n\n`;
    for (const memberId of group.children || []) {
      const member = json.children?.find((child) => child.id === memberId);
      if (!member) {
        continue;
      }
      docs += `- [\`${member.name}\`](#${member.name.toLowerCase()})\n`;
    }
    docs += '\n';
  }

  docs += fs.readFileSync(path.join(tmp, 'api-javascript.md'), 'utf-8');
  removeTmpDir();
  return docs;
}

async function main() {
  let configMd = fs.readFileSync('docs/config.md', 'utf-8');
  configMd = insertDocs(configMd, 'config API', await buildConfigDocs());
  fs.writeFileSync('docs/config.md', configMd);

  let apiMd = fs.readFileSync('docs/api-javascript.md', 'utf-8');
  apiMd = insertDocs(apiMd, 'JavaScript API', await buildApiDocs());
  fs.writeFileSync('docs/api-javascript.md', apiMd);
}

await main();
