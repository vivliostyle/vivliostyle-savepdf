import { copy, remove } from 'fs-extra/esm';
import { lookup as mime } from 'mime-types';
import fs from 'node:fs';
import { glob } from 'tinyglobby';
import upath from 'upath';
import {
  EpubOutput,
  ResolvedTaskConfig,
  WebPublicationOutput,
} from '../config/resolve.js';
import { ArticleEntryConfig } from '../config/schema.js';
import { MANIFEST_FILENAME } from '../const.js';
import { Logger } from '../logger.js';
import {
  getDefaultIgnorePatterns,
  getIgnoreAssetPatterns,
  globAssetFiles,
} from '../processor/compile.js';
import {
  createVirtualConsole,
  fetchLinkedPublicationManifest,
  getJsdomFromUrlOrFile,
  ResourceLoader,
} from '../processor/html.js';
import type {
  PublicationLinks,
  PublicationManifest,
  URL as PublicationURL,
  ResourceCategorization,
} from '../schema/publication.schema.js';
import {
  assertPubManifestSchema,
  DetailError,
  pathEquals,
  useTmpDirectory,
} from '../util.js';
import { exportEpub } from './epub.js';

function sortManifestResources(manifest: PublicationManifest) {
  if (!Array.isArray(manifest.resources)) {
    return;
  }
  manifest.resources = [...manifest.resources].sort((a, b) =>
    (typeof a === 'string' ? a : a.url) > (typeof b === 'string' ? b : b.url)
      ? 1
      : -1,
  );
}

export async function prepareWebPublicationDirectory({
  outputDir,
}: {
  outputDir: string;
}): Promise<void> {
  if (fs.existsSync(outputDir)) {
    Logger.debug('going to remove existing webpub', outputDir);
    await remove(outputDir);
  }
  fs.mkdirSync(outputDir, { recursive: true });
}

function transformPublicationManifest(
  entity: PublicationManifest,
  transformer: { url: (str: string) => string },
): PublicationManifest {
  const { url: transformUrl } = transformer;
  const transformUrlOrPublicationLinks = (
    e: PublicationURL | PublicationLinks,
  ) => {
    if (typeof e === 'string') {
      return transformUrl(e);
    }
    const ret = { ...e };
    ret.url = transformUrl(e.url);
    return ret;
  };
  const ret = { ...entity };
  for (const [key, tr] of Object.entries({
    conformsTo: transformUrl,
    url: transformUrl,
    readingOrder: transformUrlOrPublicationLinks,
    resources: transformUrlOrPublicationLinks,
    links: transformUrlOrPublicationLinks,
  })) {
    if (key in ret) {
      ret[key] = Array.isArray(ret[key])
        ? ret[key].map(tr)
        : tr(ret[key] as string);
    }
  }
  return ret;
}

export function decodePublicationManifest(input: PublicationManifest) {
  return transformPublicationManifest(input, {
    url: decodeURI,
  });
}

function encodePublicationManifest(input: PublicationManifest) {
  return transformPublicationManifest(input, {
    url: encodeURI,
  });
}

// https://www.w3.org/TR/pub-manifest/
export function writePublicationManifest(
  output: string,
  options: {
    title?: string;
    author?: string;
    language?: string;
    readingProgression?: 'ltr' | 'rtl';
    modified: string;
    entries: ArticleEntryConfig[];
    cover?: {
      url: string;
      name: string;
    };
    links?: (PublicationURL | PublicationLinks)[];
    resources?: (PublicationURL | PublicationLinks)[];
  },
): PublicationManifest {
  const entries: PublicationLinks[] = options.entries.map((entry) => ({
    url: entry.path,
    ...(entry.title && { name: entry.title }),
    ...(entry.encodingFormat && { encodingFormat: entry.encodingFormat }),
    ...(entry.rel && { rel: entry.rel }),
    ...((entry.rel === 'contents' || entry.rel === 'cover') && {
      type: 'LinkedResource',
    }),
  }));
  const links: (PublicationURL | PublicationLinks)[] = [
    options.links || [],
  ].flat();
  const resources: (PublicationURL | PublicationLinks)[] = [
    options.resources || [],
  ].flat();

  if (options.cover) {
    const mimeType = mime(options.cover.url);
    if (mimeType) {
      resources.push({
        rel: 'cover',
        url: options.cover.url,
        name: options.cover.name,
        encodingFormat: mimeType,
      });
    } else {
      Logger.logWarn(
        `Cover image "${options.cover}" was set in your configuration but couldn’t detect the image metadata. Please check a valid cover file is placed.`,
      );
    }
  }

  const publication: PublicationManifest = {
    '@context': ['https://schema.org', 'https://www.w3.org/ns/pub-context'],
    type: 'Book',
    conformsTo: 'https://github.com/vivliostyle/vivliostyle-cli',
    ...(options.title && { name: options.title }),
    ...(options.author && { author: options.author }),
    ...(options.language && { inLanguage: options.language }),
    ...(options.readingProgression && {
      readingProgression: options.readingProgression,
    }),
    dateModified: options.modified,
    readingOrder: entries,
    resources,
    links,
  };

  const encodedManifest = encodePublicationManifest(publication);
  Logger.debug(
    'writePublicationManifest path: %s content: %O',
    output,
    encodedManifest,
  );
  try {
    assertPubManifestSchema(encodedManifest);
  } catch (error) {
    const thrownError = error as Error | string;
    throw new DetailError(
      `Validation of publication manifest failed. Please check the schema: ${output}`,
      typeof thrownError === 'string'
        ? thrownError
        : (thrownError.stack ?? thrownError.message),
    );
  }
  fs.mkdirSync(upath.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(encodedManifest, null, 2));
  return publication;
}

export async function retrieveWebbookEntry({
  webbookEntryUrl,
  outputDir,
}: {
  webbookEntryUrl: string;
  outputDir: string;
}): Promise<{
  entryHtmlFile: string;
  manifest: PublicationManifest | undefined;
}> {
  if (/^https?:/i.test(webbookEntryUrl)) {
    Logger.logUpdate('Fetching remote contents');
  }
  const resourceLoader = new ResourceLoader();
  const dom = await getJsdomFromUrlOrFile({
    src: webbookEntryUrl,
    resourceLoader,
  });
  const { manifest, manifestUrl } =
    (await fetchLinkedPublicationManifest({
      dom,
      resourceLoader,
      baseUrl: webbookEntryUrl,
    })) || {};
  const rootUrl = /^https?:/i.test(webbookEntryUrl)
    ? new URL('/', webbookEntryUrl).href
    : new URL('.', webbookEntryUrl).href;
  const pathContains = (url: string) =>
    !upath.relative(rootUrl, url).startsWith('..');
  const retriever = new Map(resourceLoader.fetcherMap);

  if (manifest && manifestUrl) {
    [manifest.resources || []].flat().forEach((v) => {
      const url = typeof v === 'string' ? v : v.url;
      const fullUrl = new URL(encodeURI(url), manifestUrl).href;
      if (!pathContains(fullUrl) || retriever.has(fullUrl)) {
        return;
      }
      const fetchPromise = resourceLoader.fetch(fullUrl);
      if (fetchPromise && !retriever.has(fullUrl)) {
        retriever.set(fullUrl, fetchPromise);
      }
    });
    for (const v of [manifest.readingOrder || []].flat()) {
      const url = typeof v === 'string' ? v : v.url;
      if (
        !/\.html?$/.test(url) &&
        !(typeof v === 'string' || v.encodingFormat === 'text/html')
      ) {
        continue;
      }
      const fullUrl = new URL(encodeURI(url), manifestUrl).href;
      if (!pathContains(fullUrl) || fullUrl === webbookEntryUrl) {
        continue;
      }
      const subpathResourceLoader = new ResourceLoader();
      await getJsdomFromUrlOrFile({
        src: fullUrl,
        resourceLoader: subpathResourceLoader,
        virtualConsole: createVirtualConsole((error) => {
          Logger.logError(`Failed to fetch webbook resources: ${error.detail}`);
        }),
      });
      subpathResourceLoader.fetcherMap.forEach(
        (v, k) => !retriever.has(k) && retriever.set(k, v),
      );
    }
  }

  const fetchedResources = await ResourceLoader.saveFetchedResources({
    fetcherMap: retriever,
    rootUrl: webbookEntryUrl,
    outputDir,
    /* v8 ignore next 4 */
    onError: (error) => {
      Logger.debug(error);
      Logger.logError(`Failed to fetch webbook resources: ${error}`);
    },
  });

  if (manifest) {
    const referencedContents = [
      ...[manifest.readingOrder || []].flat(),
      ...[manifest.resources || []].flat(),
    ].map((v) => (typeof v === 'string' ? v : v.url));
    manifest.resources = [
      ...[manifest.resources || []].flat(),
      ...fetchedResources.filter(
        ({ url }) => !referencedContents.includes(url),
      ),
    ];
    sortManifestResources(manifest);
  }

  Logger.debug(
    'Saved webbook resources',
    fetchedResources.map((v) => v.url),
  );
  Logger.debug(
    'Publication manifest from webbook',
    manifest && JSON.stringify(manifest, null, 2),
  );

  return {
    entryHtmlFile: upath.join(
      outputDir,
      upath.extname(webbookEntryUrl)
        ? upath.basename(webbookEntryUrl)
        : 'index.html',
    ),
    manifest,
  };
}

export async function supplyWebPublicationManifestForWebbook({
  entryHtmlFile,
  outputDir,
  ...config
}: Pick<
  ResolvedTaskConfig,
  'language' | 'title' | 'author' | 'readingProgression'
> & {
  entryHtmlFile: string;
  outputDir: string;
}): Promise<PublicationManifest> {
  Logger.debug(`Generating publication manifest from HTML: ${entryHtmlFile}`);
  const dom = await getJsdomFromUrlOrFile({ src: entryHtmlFile });
  const { document } = dom.window;
  const language =
    config.language || document.documentElement.lang || undefined;
  const title = config.title || document.title || '';
  const author =
    config.author ||
    document.querySelector('meta[name="author"]')?.getAttribute('content') ||
    '';

  const entry = upath.relative(outputDir, entryHtmlFile);
  const allFiles = await glob('**', {
    cwd: outputDir,
  });

  const manifest = writePublicationManifest(
    upath.join(outputDir, MANIFEST_FILENAME),
    {
      title,
      author,
      language,
      readingProgression: config.readingProgression,
      modified: new Date().toISOString(),
      entries: [{ path: entry }],
      resources: allFiles.filter((f) => f !== entry),
    },
  );
  sortManifestResources(manifest);
  const link = document.createElement('link');
  link.setAttribute('rel', 'publication');
  link.setAttribute('type', 'application/ld+json');
  link.setAttribute(
    'href',
    upath.relative(
      upath.dirname(entryHtmlFile),
      upath.join(outputDir, MANIFEST_FILENAME),
    ),
  );
  document.head.appendChild(link);
  await fs.promises.writeFile(entryHtmlFile, dom.serialize(), 'utf8');

  Logger.debug(
    'Generated publication manifest from HTML',
    JSON.stringify(manifest, null, 2),
  );
  return manifest;
}

export async function copyWebPublicationAssets({
  exportAliases,
  outputs,
  copyAsset,
  themesDir,
  manifestPath,
  input,
  outputDir,
  entries,
}: Pick<
  ResolvedTaskConfig,
  'exportAliases' | 'outputs' | 'copyAsset' | 'themesDir' | 'entries'
> & {
  input: string;
  outputDir: string;
  manifestPath: string;
}): Promise<{ manifest: PublicationManifest; actualManifestPath: string }> {
  const relExportAliases = exportAliases
    .map(({ source, target }) => ({
      source: upath.relative(input, source),
      target: upath.relative(input, target),
    }))
    .filter(({ source }) => !source.startsWith('..'));
  const allFiles = new Set([
    ...(await globAssetFiles({
      copyAsset,
      cwd: input,
      outputs,
      themesDir,
      entries,
    })),
    ...(await glob(
      [
        `**/${upath.relative(input, manifestPath)}`,
        '**/*.{html,htm,xhtml,xht,css}',
      ],
      {
        cwd: input,
        ignore: [
          ...getIgnoreAssetPatterns({
            cwd: input,
            outputs,
            entries,
          }),
          ...getDefaultIgnorePatterns({
            cwd: input,
            themesDir,
          }),
          // only include dotfiles starting with `.vs-`
          '**/.!(vs-*)/**',
        ],
        // follow symbolic links to copy local theme packages
        followSymbolicLinks: true,
        dot: true,
      },
    )),
  ]);
  // Exclude files that will overwrite alias targets
  for (const alias of relExportAliases) {
    allFiles.delete(alias.target);
  }

  Logger.debug(
    'webbook files',
    JSON.stringify(
      [...allFiles].map((file) => {
        const alias = relExportAliases.find(({ source }) => source === file);
        return alias ? `${file} (alias: ${alias.target})` : file;
      }),
      null,
      2,
    ),
  );
  const resources: string[] = [];
  let actualManifestPath = upath.join(
    outputDir,
    upath.relative(input, manifestPath),
  );
  for (const file of allFiles) {
    const alias = relExportAliases.find(({ source }) => source === file);
    const relTarget = alias?.target || file;
    resources.push(relTarget);
    const target = upath.join(outputDir, relTarget);
    fs.mkdirSync(upath.dirname(target), { recursive: true });
    await copy(upath.join(input, file), target);
    if (alias && pathEquals(upath.join(input, alias.source), manifestPath)) {
      actualManifestPath = target;
    }
  }

  Logger.debug('webbook publication.json', actualManifestPath);
  // Overwrite copied publication.json
  const manifest = decodePublicationManifest(
    JSON.parse(fs.readFileSync(actualManifestPath, 'utf8')),
  );
  for (const entry of relExportAliases) {
    const rewriteAliasPath = (e: PublicationLinks | string) => {
      if (typeof e === 'string') {
        return pathEquals(e, entry.source) ? entry.source : e;
      }
      if (pathEquals(e.url, entry.source)) {
        e.url = entry.target;
      }
      return e;
    };
    if (manifest.links) {
      manifest.links = Array.isArray(manifest.links)
        ? manifest.links.map(rewriteAliasPath)
        : rewriteAliasPath(manifest.links);
    }
    if (manifest.readingOrder) {
      manifest.readingOrder = Array.isArray(manifest.readingOrder)
        ? manifest.readingOrder.map(rewriteAliasPath)
        : rewriteAliasPath(manifest.readingOrder);
    }
    if (manifest.resources) {
      manifest.resources = Array.isArray(manifest.resources)
        ? manifest.resources.map(rewriteAliasPath)
        : rewriteAliasPath(manifest.resources);
    }
  }

  // List copied files to resources field
  const normalizeToUrl = (val?: ResourceCategorization) =>
    [val || []].flat().map((e) => (typeof e === 'string' ? e : e.url));
  const preDefinedResources = [
    ...normalizeToUrl(manifest.links),
    ...normalizeToUrl(manifest.readingOrder),
    ...normalizeToUrl(manifest.resources),
  ];
  manifest.resources = [
    ...[manifest.resources || []].flat(),
    ...resources.flatMap((file) => {
      if (
        preDefinedResources.includes(file) ||
        // Omit publication.json itself
        pathEquals(file, upath.relative(outputDir, actualManifestPath))
      ) {
        return [];
      }
      return file;
    }),
  ];
  sortManifestResources(manifest);
  fs.writeFileSync(
    actualManifestPath,
    JSON.stringify(encodePublicationManifest(manifest), null, 2),
  );
  return { manifest, actualManifestPath };
}

export async function buildWebPublication({
  target,
  config,
}: {
  target: WebPublicationOutput | EpubOutput;
  config: ResolvedTaskConfig;
}): Promise<string> {
  let outputDir: string;
  if (target.format === 'webpub') {
    outputDir = target.path;
    await prepareWebPublicationDirectory({ outputDir });
  } else {
    [outputDir] = await useTmpDirectory();
  }

  let entryHtmlFile: string | undefined;
  let manifest: PublicationManifest;
  let actualManifestPath: string | undefined;
  if (config.viewerInput.type === 'webpub') {
    const ret = await copyWebPublicationAssets({
      ...config,
      input: config.workspaceDir,
      outputDir,
      manifestPath: config.viewerInput.manifestPath,
    });
    manifest = ret.manifest;
    actualManifestPath = ret.actualManifestPath;
    if (config.input.format === 'markdown') {
      const entry = [manifest.readingOrder].flat()[0];
      if (entry) {
        entryHtmlFile = upath.join(
          outputDir,
          typeof entry === 'string' ? entry : entry.url,
        );
      }
    }
  } else if (config.viewerInput.type === 'webbook') {
    const ret = await retrieveWebbookEntry({
      webbookEntryUrl: config.viewerInput.webbookEntryUrl,
      outputDir,
    });
    entryHtmlFile = ret.entryHtmlFile;
    manifest =
      ret.manifest ||
      (await supplyWebPublicationManifestForWebbook({
        ...config,
        entryHtmlFile: ret.entryHtmlFile,
        outputDir,
      }));
  } else {
    throw new Error('No entry specified');
  }

  if (target.format === 'epub') {
    await exportEpub({
      webpubDir: outputDir,
      entryHtmlFile,
      manifest,
      relManifestPath:
        actualManifestPath && upath.relative(outputDir, actualManifestPath),
      target: target.path,
      epubVersion: target.version,
    });
  }
  return target.path;
}
