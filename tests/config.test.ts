import { expect, it, onTestFinished, vi } from 'vitest';
import { VivliostyleConfigSchema } from '../src/config/schema.js';
import { getTaskConfig, maskConfig, resolveFixture } from './command-util.js';

const validConfigData = {
  title: 'title',
  author: 'author',
  theme: ['../themes/debug-theme'],
  entry: [
    'manuscript.md',
    {
      path: 'manuscript.md',
      title: 'title',
      theme: {
        specifier: 'theme.css',
      },
    },
  ],
  entryContext: '.',
  output: [
    'output1.pdf',
    {
      path: 'output2.pdf',
      format: 'pdf',
    },
  ],
  size: 'size',
  pressReady: true,
  language: 'language',
  toc: {
    title: 'TOC',
    htmlPath: './toc.html',
    sectionDepth: 6,
  },
  cover: {
    src: './cover.png',
    name: 'Cover image alt',
    htmlPath: './mycover.html',
  },
  timeout: 1,
  workspaceDir: 'workspaceDir',
  vfm: {
    hardLineBreaks: true,
    disableFormatHtml: true,
  },
  readingProgression: 'rtl',
  browser: 'firefox',
  viewerParam: 'foo=bar',
  copyAsset: {
    includes: ['xx/yy', '**/zz'],
    excludes: ['*a*'],
    includeFileExtensions: ['zip'],
    excludeFileExtensions: ['png', 'jpg'],
  },
  base: '/root/vvv/',
  server: {
    host: true,
    port: 9876,
    proxy: {
      '/api': 'http://localhost:6789',
    },
  },
  static: {
    '/static': 'path/to/static',
    '/': ['root1', 'root2'],
  },
  temporaryFilePrefix: 'vvv.',
} satisfies VivliostyleConfigSchema;

it('parse vivliostyle config', async () => {
  const validConfig1 = await getTaskConfig(
    ['build'],
    resolveFixture('config'),
    validConfigData,
  );
  maskConfig(validConfig1);
  expect(validConfig1).toMatchSnapshot('config');
});

it('override option by CLI command', async () => {
  const config = await getTaskConfig(
    [
      'build',
      '-o',
      'yuno.pdf',
      '-o',
      'yuno',
      '-f',
      'webpub',
      '-T',
      'https://myTheme.example.com',
      '-s',
      'JIS-B5',
      '--title',
      'myTitle',
      '--author',
      'myAuthor',
      '--language',
      'myLanguage',
      '--timeout',
      '42',
      '--ignore-https-errors',
      '--executable-browser',
      'myFirefox',
      // '--browser',
      // 'webkit',
      '--style',
      'https://vivlostyle.org',
      '--user-style',
      './user/style/dummy.css',
      '--http',
      '--viewer',
      'https://vivliostyle.org/viewer/',
      '--viewer-param',
      'allowScripts=false&pixelRatio=16',
      '--proxy-server',
      'http://localhost:3128',
      '--proxy-bypass',
      '.example.com',
      '--proxy-user',
      'proxy-auth-user',
      '--proxy-pass',
      'proxy-auth-password',
    ],
    resolveFixture('config'),
    validConfigData,
  );
  maskConfig(config);
  expect(config).toMatchSnapshot('config');
});

it('override option by environment variable', async () => {
  vi.stubEnv('HTTP_PROXY', 'https://localhost:9001');
  vi.stubEnv('NOPROXY', 'bypass.example.com');
  onTestFinished(() => {
    vi.unstubAllEnvs();
  });
  const validConfig1 = await getTaskConfig(
    ['build'],
    resolveFixture('config'),
    validConfigData,
  );
  expect(validConfig1.proxy?.server).toBe('https://localhost:9001');
  expect(validConfig1.proxy?.bypass).toBe('bypass.example.com');
});

it('deny invalid config', () => {
  expect(
    getTaskConfig(
      ['build'],
      resolveFixture('config'),
      // @ts-expect-error
      {
        output: {
          path: 'output',
          format: 'invalidFormat',
        },
      },
    ),
  ).rejects.toThrow();
});

it('deny config which has no entry', () => {
  expect(
    getTaskConfig(['build'], resolveFixture('config'), { entry: [] }),
  ).rejects.toThrow();
});

it('deny if any config file or input file is not set', () => {
  expect(getTaskConfig(['build'], resolveFixture('config'))).rejects.toThrow();
});

it('yields a config with single markdown', async () => {
  const config = await getTaskConfig(
    ['build', 'sample.md'],
    resolveFixture('config'),
  );
  maskConfig(config);
  expect(config).toMatchObject({
    entries: [
      {
        target:
          '__WORKSPACE__/tests/fixtures/config/__TEMPORARY_FILE_PREFIX__sample.html',
      },
    ],
    viewerInput: {
      type: 'webpub',
      manifestPath:
        '__WORKSPACE__/tests/fixtures/config/__TEMPORARY_FILE_PREFIX__publication.json',
      needToGenerateManifest: true,
    },
    exportAliases: expect.arrayContaining([
      {
        source:
          '__WORKSPACE__/tests/fixtures/config/__TEMPORARY_FILE_PREFIX__sample.html',
        target: '__WORKSPACE__/tests/fixtures/config/sample.html',
      },
      {
        source:
          '__WORKSPACE__/tests/fixtures/config/__TEMPORARY_FILE_PREFIX__publication.json',
        target: '__WORKSPACE__/tests/fixtures/config/publication.json',
      },
    ]),
  });
});

it('imports single html file', async () => {
  const config = await getTaskConfig(
    ['build', 'sample.html'],
    resolveFixture('config'),
  );
  maskConfig(config);
  expect(config).toMatchObject({
    viewerInput: {
      type: 'webbook',
      webbookEntryUrl: '/vivliostyle/sample.html',
    },
  });
});

it('yields a config with single input and vivliostyle config', async () => {
  const config = await getTaskConfig(
    ['build', 'nestedDir/01.md'],
    resolveFixture('config'),
    validConfigData,
  );
  maskConfig(config);
  expect(config).toMatchObject({
    entries: [
      {
        target: '__WORKSPACE__/tests/fixtures/config/nestedDir/vvv.01.html',
      },
    ],
    viewerInput: {
      type: 'webpub',
      manifestPath:
        '__WORKSPACE__/tests/fixtures/config/nestedDir/vvv.publication.json',
      needToGenerateManifest: true,
    },
  });
});

it('imports a EPUB file', async () => {
  const config = await getTaskConfig(
    ['build', 'adaptive.epub', '-o', 'epub.pdf'],
    resolveFixture('epubs'),
  );
  maskConfig(config);
  expect(config).toMatchObject({
    viewerInput: {
      type: 'epub',
      epubPath: '__WORKSPACE__/tests/fixtures/epubs/adaptive.epub',
      epubTmpOutputDir:
        '__WORKSPACE__/tests/fixtures/epubs/__TEMPORARY_FILE_PREFIX__adaptive.epub',
    },
  });
});

it('imports a EPUB OPF file', async () => {
  const config = await getTaskConfig(
    ['build', 'adaptive/OPS/content.opf', '-o', 'epub-opf.pdf'],
    resolveFixture('epubs'),
  );
  maskConfig(config);
  expect(config).toMatchObject({
    viewerInput: {
      type: 'epub-opf',
      epubOpfPath:
        '__WORKSPACE__/tests/fixtures/epubs/adaptive/OPS/content.opf',
    },
  });
});

it('imports a webbook compliant to W3C Web publication', async () => {
  const config = await getTaskConfig(
    ['build', 'w3c-webpub/publication.json', '-o', 'w3c-webpub'],
    resolveFixture('webbooks'),
  );
  maskConfig(config);
  expect(config).toMatchObject({
    viewerInput: {
      type: 'webpub',
      manifestPath:
        '__WORKSPACE__/tests/fixtures/webbooks/w3c-webpub/publication.json',
      needToGenerateManifest: false,
    },
  });
});

it('imports a webbook compliant to Readium Web publication', async () => {
  const config = await getTaskConfig(
    ['build', 'readium-webpub/manifest.jsonld', '-o', 'readium-webpub'],
    resolveFixture('webbooks'),
  );
  maskConfig(config);
  expect(config).toMatchObject({
    viewerInput: {
      type: 'webpub',
      manifestPath:
        '__WORKSPACE__/tests/fixtures/webbooks/readium-webpub/manifest.jsonld',
      needToGenerateManifest: false,
    },
  });
});

it('imports a https URL', async () => {
  const config = await getTaskConfig(
    [
      'build',
      'https://vivliostyle.github.io/vivliostyle_doc/ja/vivliostyle-user-group-vol1/',
    ],
    resolveFixture('config'),
  );
  maskConfig(config);
  expect(config).toMatchObject({
    viewerInput: {
      type: 'webbook',
      webbookEntryUrl:
        'https://vivliostyle.github.io/vivliostyle_doc/ja/vivliostyle-user-group-vol1/',
    },
  });
});

it('yields a config from frontmatter', async () => {
  const config = await getTaskConfig(
    ['build', 'frontmatter.md'],
    resolveFixture('config'),
  );
  maskConfig(config);
  expect(config.entries[0].title).toBe('Frontmatter');
});

it('allow a loose specifier of a theme direcory', async () => {
  const validConfig = await getTaskConfig(['build'], resolveFixture('config'), {
    entry: 'manuscript.md',
    output: 'output1.pdf',
    theme: 'themes/foo',
  });
  maskConfig(validConfig);
  expect(validConfig).toMatchObject({
    entries: [
      {
        themes: [
          {
            type: 'package',
            name: 'foo',
            specifier: '__WORKSPACE__/tests/fixtures/config/themes/foo',
            location:
              '__WORKSPACE__/tests/fixtures/config/.vivliostyle/themes/node_modules/foo',
          },
        ],
      },
    ],
  });
});
