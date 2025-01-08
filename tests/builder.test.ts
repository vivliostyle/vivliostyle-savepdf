import jsdom, { JSDOM } from '@vivliostyle/jsdom';
import fs from 'node:fs';
import { glob } from 'tinyglobby';
import { expect, it } from 'vitest';
import { resolveFixture, runCommand } from './command-util.js';

// function assertManifestPath(
//   config: MergedConfig,
// ): asserts config is MergedConfig & { manifestPath: string } {
//   assert(!!config.manifestPath);
// }

it('generate workspace directory', async () => {
  await runCommand(['build', '-c', 'workspace.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const fileList = await glob('**', {
    cwd: resolveFixture('builder/.vs-workspace'),
  });
  expect(new Set(fileList)).toEqual(
    new Set([
      'index.html',
      'cover.html',
      'manuscript/cover.png',
      'manuscript/cover2.png',
      'manuscript/sample-theme.css',
      'manuscript/soda.html',
      'publication.json',
      'themes/node_modules/debug-theme/additional-theme.css',
      'themes/node_modules/debug-theme/package.json',
      'themes/node_modules/debug-theme/theme.css',
      'themes/package-lock.json',
      'themes/package.json',
    ]),
  );
  const { default: manifest } = await import(
    resolveFixture('builder/.vs-workspace/publication.json')
  );
  expect(manifest.resources[0]).toEqual({
    encodingFormat: 'image/png',
    rel: 'cover',
    url: 'manuscript/cover.png',
    name: 'Cover image',
  });
  expect(manifest.readingOrder[0]).toEqual({
    rel: 'cover',
    name: 'title',
    type: 'LinkedResource',
    url: 'cover.html',
  });
  expect(manifest.readingOrder[1]).toEqual({
    rel: 'contents',
    name: 'Table of Contents',
    type: 'LinkedResource',
    url: 'index.html',
  });

  const tocHtml = new JSDOM(
    fs.readFileSync(resolveFixture('builder/.vs-workspace/index.html'), 'utf8'),
  );
  expect(tocHtml.window.document.documentElement.lang).toBe('ja');
  expect(
    tocHtml.window.document.querySelector(
      'link[rel="stylesheet"][href="themes/node_modules/debug-theme/theme.css"]',
    ),
  ).toBeTruthy();

  const manuscriptHtml = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-workspace/manuscript/soda.html'),
      'utf8',
    ),
  );
  expect(
    manuscriptHtml.window.document.querySelector(
      'link[rel="stylesheet"][href="sample-theme.css"]',
    ),
  ).toBeTruthy();

  const coverHtml = new JSDOM(
    fs.readFileSync(resolveFixture('builder/.vs-workspace/cover.html'), 'utf8'),
    { virtualConsole: new jsdom.VirtualConsole() }, // Disable JSDOM console
  );
  expect(coverHtml.window.document.documentElement.lang).toBe('ja');
  expect(
    coverHtml.window.document.querySelector(
      'link[rel="stylesheet"][href="themes/packages/debug-theme/theme.css"]',
    ),
  ).not.toBeTruthy();
  expect(
    coverHtml.window.document.querySelector(
      '[aria-label="Cover"] > img[src="manuscript/cover.png"][alt="Cover image"][role="doc-cover"]',
    ),
  ).toBeTruthy();
});

it('generate files with entryContext', async () => {
  await runCommand(['build', '-c', 'entryContext.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const fileList = await glob('**', {
    cwd: resolveFixture('builder/.vs-entryContext'),
  });
  expect(new Set(fileList)).toEqual(
    new Set([
      'cover.png',
      'cover2.png',
      'covercover.html',
      'manuscript/sample-theme.css',
      'publication.json',
      'soda.html',
      't-o-c.html',
    ]),
  );
  const { default: manifest } = await import(
    resolveFixture('builder/.vs-entryContext/publication.json')
  );
  expect(manifest.resources[0]).toEqual({
    encodingFormat: 'image/png',
    rel: 'cover',
    url: 'cover.png',
    name: 'Cover image',
  });
  expect(manifest.readingOrder[0]).toEqual({
    rel: 'cover',
    name: 'title',
    type: 'LinkedResource',
    url: 'covercover.html',
  });
  expect(manifest.readingOrder[1]).toEqual({
    rel: 'contents',
    name: 'Table of Contents',
    type: 'LinkedResource',
    url: 't-o-c.html',
  });
  expect(manifest.inLanguage).toBeUndefined();

  const tocHtml = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-entryContext/t-o-c.html'),
      'utf8',
    ),
  );
  expect(
    tocHtml.window.document.querySelector(
      'link[rel="stylesheet"][href="manuscript/sample-theme.css"]',
    ),
  ).toBeTruthy();
  const manuscriptHtml = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-entryContext/soda.html'),
      'utf8',
    ),
  );
  expect(
    manuscriptHtml.window.document.querySelector(
      'link[rel="stylesheet"][href="manuscript/sample-theme.css"]',
    ),
  ).toBeTruthy();
});

it('generate from various manuscript formats', async () => {
  await runCommand(['build', '-c', 'variousManuscriptFormat.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const fileList = await glob('**', {
    cwd: resolveFixture('builder/.vs-variousManuscriptFormat'),
  });
  expect(new Set(fileList)).toEqual(
    new Set([
      'manuscript/cover.png',
      'manuscript/cover2.png',
      'manuscript/sample-html.html',
      'manuscript/sample-xhtml.xhtml',
      'manuscript/soda.html',
      'publication.json',
      'themes/node_modules/debug-theme/additional-theme.css',
      'themes/node_modules/debug-theme/package.json',
      'themes/node_modules/debug-theme/theme.css',
      'themes/package-lock.json',
      'themes/package.json',
    ]),
  );
  const { default: manifest } = await import(
    resolveFixture('builder/.vs-variousManuscriptFormat/publication.json')
  );
  expect(manifest.readingOrder).toEqual([
    {
      name: 'SODA',
      url: 'manuscript/soda.html',
    },
    {
      name: 'ABCDEF',
      url: 'manuscript/sample-html.html',
    },
    {
      encodingFormat: 'application/xhtml+xml',
      name: 'Sample XHTML',
      url: 'manuscript/sample-xhtml.xhtml',
    },
  ]);
  expect(manifest.inLanguage).toBe('ja');
  const doc1 = new JSDOM(
    fs.readFileSync(
      resolveFixture(
        'builder/.vs-variousManuscriptFormat/manuscript/soda.html',
      ),
      'utf8',
    ),
  );
  expect(
    doc1.window.document.querySelector(
      'link[rel="stylesheet"][href="https://example.com"]',
    ),
  ).toBeTruthy();
  expect(doc1.window.document.querySelector('title')?.text).toEqual('SODA');
  expect(
    doc1.window.document.querySelector('html')?.getAttribute('lang'),
  ).toEqual('ja');
  const doc2 = new JSDOM(
    fs.readFileSync(
      resolveFixture(
        'builder/.vs-variousManuscriptFormat/manuscript/sample-html.html',
      ),
      'utf8',
    ),
  );
  expect(
    doc2.window.document.querySelector(
      'link[rel="stylesheet"][href="../themes/node_modules/debug-theme/theme.css"]',
    ),
  ).toBeTruthy();
  expect(doc2.window.document.querySelector('title')?.text).toEqual('ABCDEF');
  expect(
    doc2.window.document.querySelector('html')?.getAttribute('lang'),
  ).toEqual('en');
  const doc3 = new JSDOM(
    fs.readFileSync(
      resolveFixture(
        'builder/.vs-variousManuscriptFormat/manuscript/sample-xhtml.xhtml',
      ),
      'utf8',
    ),
    { contentType: 'application/xhtml+xml' },
  );
  expect(
    doc3.window.document.querySelector(
      'link[rel="stylesheet"][href="https://example.com"]',
    ),
  ).toBeTruthy();
  expect(
    doc3.window.document.querySelector('html')?.getAttribute('lang'),
  ).toEqual('ja');
  expect(
    doc3.window.document.querySelector('html')?.getAttribute('xml:lang'),
  ).toEqual('ja');
});

it('generate with VFM options', async () => {
  await runCommand(['build', '-c', 'workspace.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const output1 = fs.readFileSync(
    resolveFixture('builder/.vs-workspace/manuscript/soda.html'),
    'utf8',
  );
  expect(output1).toMatch('hardLineBreaks option test foo');

  await runCommand(['build', '-c', 'vfm.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const { default: manifest } = await import(
    resolveFixture('builder/.vs-vfm/publication.json')
  );
  expect(manifest.readingOrder).toEqual([
    {
      url: 'index.html',
      name: 'Table of Contents',
      rel: 'contents',
      type: 'LinkedResource',
    },
    {
      name: 'SODA',
      url: 'manuscript/soda.html',
    },
    {
      name: 'Hello',
      url: 'manuscript/frontmatter.html',
    },
  ]);
  const output2 = fs.readFileSync(
    resolveFixture('builder/.vs-vfm/manuscript/soda.html'),
    'utf8',
  );
  expect(output2).toMatch(/hardLineBreaks option test<br \/>\s*foo/g);
  const doc1 = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-vfm/manuscript/frontmatter.html'),
      'utf8',
    ),
  );
  expect(doc1.window.document.querySelector('title')?.textContent).toBe(
    'Hello',
  );
  expect(doc1.window.document.documentElement.lang).toBe('la');
  expect(doc1.window.document.documentElement.className).toBe('Foo');
  expect(
    doc1.window.document
      .querySelector('meta[name="author"]')
      ?.getAttribute('content'),
  ).toBe('Bar');
});

it('generate from multiple config entries', async () => {
  await runCommand(['build', '-c', 'multipleEntry.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const { default: manifest1 } = await import(
    resolveFixture('builder/.vs-multipleEntry/one/publication.json')
  );
  expect(manifest1.readingOrder).toEqual([
    {
      name: 'SODA',
      url: 'manuscript/soda.html',
    },
  ]);
  const { default: manifest2 } = await import(
    resolveFixture('builder/.vs-multipleEntry/two/publication.json')
  );
  expect(manifest2.readingOrder).toEqual([
    {
      url: 'manuscript/frontmatter.html',
      name: 'Hello',
    },
    {
      url: 'index.html',
      name: 'Table of Contents',
      rel: 'contents',
      type: 'LinkedResource',
    },
  ]);
});

it('generate files with multiple cover pages', async () => {
  await runCommand(['build', '-c', 'multipleCoverPages.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const { default: manifest } = await import(
    resolveFixture('builder/.vs-multipleCoverPages/publication.json')
  );
  expect(manifest.readingOrder).toEqual([
    {
      url: 'cover.html',
      name: 'title',
      rel: 'cover',
      type: 'LinkedResource',
    },
    {
      url: 'index.html',
      name: 'Table of Contents',
      rel: 'contents',
      type: 'LinkedResource',
    },
    {
      url: 'manuscript/soda.html',
      name: 'SODA',
    },
    {
      url: 'another-cover.html',
      name: 'title',
      rel: 'cover',
      type: 'LinkedResource',
    },
  ]);

  const tocHtml = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-multipleCoverPages/index.html'),
      'utf8',
    ),
    { virtualConsole: new jsdom.VirtualConsole() }, // Disable JSDOM console
  );
  expect(
    tocHtml.window.document.querySelector('style')?.innerHTML,
  ).toMatchSnapshot();
  expect(
    tocHtml.window.document.querySelector(
      'link[rel="stylesheet"][href="manuscript/sample-theme.css"]',
    ),
  ).toBeTruthy();

  const coverHtml = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-multipleCoverPages/cover.html'),
      'utf8',
    ),
    { virtualConsole: new jsdom.VirtualConsole() }, // Disable JSDOM console
  );
  expect(
    coverHtml.window.document.querySelector(
      'img[src="manuscript/cover.png"][alt="Cover image"][role="doc-cover"]',
    ),
  ).toBeTruthy();

  const anotherCoverHtml = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-multipleCoverPages/another-cover.html'),
      'utf8',
    ),
    { virtualConsole: new jsdom.VirtualConsole() }, // Disable JSDOM console
  );
  expect(
    anotherCoverHtml.window.document.querySelector('style')?.innerHTML,
  ).toMatchSnapshot();
  expect(
    coverHtml.window.document.querySelector(
      'link[rel="stylesheet"][href="themes/packages/debug-theme/theme.css"]',
    ),
  ).not.toBeTruthy();
  expect(
    anotherCoverHtml.window.document.querySelector(
      'link[rel="stylesheet"][href="manuscript/sample-theme.css"]',
    ),
  ).toBeTruthy();
  expect(
    anotherCoverHtml.window.document.querySelector(
      'img[src="manuscript/cover2.png"][alt="yuno"][role="doc-cover"]',
    ),
  ).toBeTruthy();
});

it('check overwrite violation', async () => {
  await expect(
    runCommand(['build', '-c', 'overwriteViolation.1.config.js'], {
      cwd: resolveFixture('builder'),
    }),
  ).rejects.toThrow(
    'The output path is set to "..", but this will overwrite the original manuscript file. Please specify a different path.',
  );
  await expect(
    runCommand(['build', '-c', 'overwriteViolation.2.config.js'], {
      cwd: resolveFixture('builder'),
    }),
  ).rejects.toThrow(
    'The output path is set to ".vs-overriddenWorkspace", but this will overwrite the working directory of Vivliostyle. Please specify a different path.',
  );
});

it('install local themes', async () => {
  await runCommand(['build', '-c', 'localTheme.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const fileList = await glob('**', {
    cwd: resolveFixture('builder/.vs-localTheme'),
  });
  expect(new Set(fileList)).toEqual(
    new Set([
      'manuscript/cover.png',
      'manuscript/cover2.png',
      'manuscript/soda.html',
      'manuscript/theme-reference.html',
      'publication.json',
      'sample-theme.css',
      'themes/node_modules/debug-theme/additional-theme.css',
      'themes/node_modules/debug-theme/package.json',
      'themes/node_modules/debug-theme/theme.css',
      'themes/package-lock.json',
      'themes/package.json',
    ]),
  );
  // checking symlink-referenced directory
  const themePackageFileList = await glob('**', {
    cwd: resolveFixture(
      'builder/.vs-localTheme/themes/node_modules/debug-theme',
    ),
  });
  expect(new Set(themePackageFileList)).toEqual(
    new Set(['additional-theme.css', 'package.json', 'theme.css']),
  );

  const doc1 = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-localTheme/manuscript/soda.html'),
      'utf8',
    ),
  );
  expect(
    doc1.window.document.querySelector(
      'link[rel="stylesheet"][href="../themes/node_modules/debug-theme/theme.css"]',
    ),
  ).toBeTruthy();
  const doc2 = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-localTheme/manuscript/theme-reference.html'),
      'utf8',
    ),
  );
  expect(
    doc2.window.document.querySelector(
      'link[rel="stylesheet"][href="../sample-theme.css"]',
    ),
  ).toBeTruthy();
});

it('install remote themes', async () => {
  await runCommand(['build', '-c', 'remoteTheme.config.js'], {
    cwd: resolveFixture('builder'),
  });
  const fileList = await glob('**', {
    cwd: resolveFixture('builder/.vs-remoteTheme'),
  });
  expect(fileList).toContain(
    'themes/node_modules/@vivliostyle/theme-base/package.json',
  );

  const doc = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-remoteTheme/manuscript/soda.html'),
      'utf8',
    ),
  );
  expect(
    doc.window.document.querySelector(
      'link[rel="stylesheet"][href="../themes/node_modules/@vivliostyle/theme-base/theme-all.css"]',
    ),
  ).toBeTruthy();
}, 300000); // Longer timeout to ensure installing remote themes

it('use multiple themes', async () => {
  await runCommand(['build', '-c', 'multipleTheme.config.js'], {
    cwd: resolveFixture('builder'),
  });

  const doc1 = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-multipleTheme/manuscript/soda.html'),
      'utf8',
    ),
  );
  expect(
    [...doc1.window.document.querySelectorAll('link[rel="stylesheet"]')].map(
      (e) => e.getAttribute('href'),
    ),
  ).toEqual([
    '../themes/node_modules/debug-theme/theme.css',
    '../themes/node_modules/debug-theme/additional-theme.css',
    'sample-theme.css',
  ]);
  const doc2 = new JSDOM(
    fs.readFileSync(
      resolveFixture('builder/.vs-multipleTheme/index.html'),
      'utf8',
    ),
  );
  expect(
    [...doc2.window.document.querySelectorAll('link[rel="stylesheet"]')].map(
      (e) => e.getAttribute('href'),
    ),
  ).toEqual([
    'themes/node_modules/@vivliostyle/theme-academic/theme.css',
    'manuscript/sample-theme.css',
  ]);
}, 300000); // Longer timeout to ensure installing remote themes

it('fail to install if package does not exist', async () => {
  await expect(
    runCommand(['build', '-c', 'nonExistTheme.config.js'], {
      cwd: resolveFixture('builder'),
    }),
  ).rejects.toThrow('An error occurred during the installation of the theme');
});

it('reject trying import theme that is not vivliostyle theme', async () => {
  await expect(
    runCommand(['build', '-c', 'invalidTheme.config.js'], {
      cwd: resolveFixture('builder'),
    }),
  ).rejects.toThrow('Could not find a style file for the theme: invalid-theme');
});

it('reject import style file that is not exist', async () => {
  await expect(
    runCommand(['build', '-c', 'nonExistImport.config.js'], {
      cwd: resolveFixture('builder'),
    }),
  ).rejects.toThrow(
    'Could not find a style path not-exist.css for the theme: debug-theme',
  );
});
