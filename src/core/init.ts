import fs from 'node:fs';
import upath from 'upath';
import { cyan, yellow } from 'yoctocolors';
import { ParsedVivliostyleInlineConfig } from '../config/schema.js';
import { CONTAINER_IMAGE } from '../container.js';
import { Logger } from '../logger.js';
import { cwd, runExitHandlers } from '../util.js';

export async function init(inlineConfig: ParsedVivliostyleInlineConfig) {
  Logger.setLogLevel(inlineConfig.logLevel);

  const vivliostyleConfigPath = upath.join(
    inlineConfig.cwd ?? cwd,
    'vivliostyle.config.js',
  );

  if (fs.existsSync(vivliostyleConfigPath)) {
    runExitHandlers();
    return Logger.log(
      `${yellow('vivliostyle.config.js already exists. aborting.')}`,
    );
  }

  // prettier-ignore
  const vivliostyleConfig = `// @ts-check
/** @type {import('@vivliostyle/cli').VivliostyleConfigSchema} */
const vivliostyleConfig = {
  title: '${ inlineConfig.title || 'Principia'}', // populated into 'publication.json', default to 'title' of the first entry or 'name' in 'package.json'.
  author: '${inlineConfig.author || 'Isaac Newton'}', // default to 'author' in 'package.json' or undefined
  ${inlineConfig.language ? '' : '// '}language: '${inlineConfig.language || 'la'}',
  // readingProgression: 'rtl', // reading progression direction, 'ltr' or 'rtl'.
  ${inlineConfig.size ? '' : '// '}size: '${inlineConfig.size || 'A4'}',
  ${inlineConfig.theme ? '' : '// '}theme: '${inlineConfig.theme?.[0].specifier || ''}', // .css or local dir or npm package. default to undefined
  image: '${CONTAINER_IMAGE}',
  entry: [ // **required field**
    // 'introduction.md', // 'title' is automatically guessed from the file (frontmatter > first heading)
    // {
    //   path: 'epigraph.md',
    //   title: 'おわりに', // title can be overwritten (entry > file),
    //   theme: '@vivliostyle/theme-whatever' // theme can be set individually. default to root 'theme'
    // },
    // 'glossary.html' // html is also acceptable
  ], // 'entry' can be 'string' or 'object' if there's only single markdown file
  // entryContext: './manuscripts', // default to '.' (relative to 'vivliostyle.config.js')
  // output: [ // path to generate draft file(s). default to '{title}.pdf'
  //   './output.pdf', // the output format will be inferred from the name.
  //   {
  //     path: './book',
  //     format: 'webpub',
  //   },
  // ],
  // workspaceDir: '.vivliostyle', // directory which is saved intermediate files.
  // toc: {
  //   title: 'Table of Contents',
  //   htmlPath: 'index.html',
  //   sectionDepth: 3,
  // },
  // cover: './cover.png', // cover image. default to undefined.
  // vfm: { // options of VFM processor
  //   replace: [ // specify replace handlers to modify HTML outputs
  //     {
  //       // This handler replaces {current_time} to a current local time tag.
  //       test: /{current_time}/,
  //       match: (_, h) => {
  //         const currentTime = new Date().toLocaleString();
  //         return h('time', { datetime: currentTime }, currentTime);
  //       },
  //     },
  //   ],
  //   hardLineBreaks: true, // converts line breaks of VFM to <br> tags. default to 'false'.
  //   disableFormatHtml: true, // disables HTML formatting. default to 'false'.
  // },
};

module.exports = vivliostyleConfig;
`;

  fs.mkdirSync(upath.dirname(vivliostyleConfigPath), { recursive: true });
  fs.writeFileSync(vivliostyleConfigPath, vivliostyleConfig);

  runExitHandlers();
  Logger.log(`Successfully created ${cyan('vivliostyle.config.js')}`);
}
