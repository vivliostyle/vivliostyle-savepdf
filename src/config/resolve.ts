import { Metadata, StringifyMarkdownOptions, VFM } from '@vivliostyle/vfm';
import { lookup as mime } from 'mime-types';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { Processor } from 'unified';
import upath from 'upath';
import { ResolvedConfig as ResolvedViteConfig, UserConfig } from 'vite';
import { getExecutableBrowserPath } from '../browser.js';
import {
  ArticleEntryConfig,
  BrowserType,
  ContentsEntryConfig,
  CoverEntryConfig,
  EntryConfig,
  InputFormat,
  StructuredDocument,
  StructuredDocumentSection,
  ThemeConfig,
} from '../config/schema.js';
import {
  COVER_HTML_FILENAME,
  COVER_HTML_IMAGE_ALT,
  EPUB_OUTPUT_VERSION,
  MANIFEST_FILENAME,
  TOC_FILENAME,
  TOC_TITLE,
} from '../const.js';
import { CONTAINER_IMAGE, CONTAINER_LOCAL_HOSTNAME } from '../container.js';
import { Logger } from '../logger.js';
import { readMarkdownMetadata } from '../processor/markdown.js';
import { parsePackageName } from '../processor/theme.js';
import {
  cwd as defaultCwd,
  getEpubRootDir,
  isInContainer,
  isValidUri,
  pathContains,
  pathEquals,
  readJSON,
  statFileSync,
  touchTmpFile,
} from '../util.js';
import { InlineOptions, ParsedBuildTask } from './schema.js';

export type ParsedTheme = UriTheme | FileTheme | PackageTheme;

export interface UriTheme {
  type: 'uri';
  name: string;
  location: string;
}

export interface FileTheme {
  type: 'file';
  name: string;
  source: string;
  location: string;
}

export interface PackageTheme {
  type: 'package';
  name: string;
  specifier: string;
  location: string;
  importPath?: string | string[];
}

export type EntrySource = FileEntrySource | UriEntrySource;

export interface FileEntrySource {
  type: 'file';
  pathname: string;
  contentType: ManuscriptMediaType;
}

export interface UriEntrySource {
  type: 'uri';
  href: string;
  rootDir: string;
}

export const manuscriptMediaTypes = [
  'text/markdown',
  'text/html',
  'application/xhtml+xml',
] as const;
export type ManuscriptMediaType = (typeof manuscriptMediaTypes)[number];

export interface ManuscriptEntry {
  contentType: ManuscriptMediaType;
  title?: string;
  themes: ParsedTheme[];
  source: EntrySource;
  template?: undefined;
  target: string;
  rel?: string | string[];
}

export interface ContentsEntry {
  rel: 'contents';
  title?: string;
  themes: ParsedTheme[];
  source?: undefined;
  template?: EntrySource;
  target: string;
  tocTitle: string;
  sectionDepth: number;
  transform: {
    transformDocumentList:
      | ((
          nodeList: StructuredDocument[],
        ) => (propsList: { children: any }[]) => any)
      | undefined;
    transformSectionList:
      | ((
          nodeList: StructuredDocumentSection[],
        ) => (propsList: { children: any }[]) => any)
      | undefined;
  };
  pageBreakBefore?: 'left' | 'right' | 'recto' | 'verso';
  pageCounterReset?: number;
}

export interface CoverEntry {
  rel: 'cover';
  title?: string;
  themes: ParsedTheme[];
  source?: undefined;
  template?: EntrySource;
  target: string;
  coverImageSrc: string;
  coverImageAlt: string;
  pageBreakBefore?: 'left' | 'right' | 'recto' | 'verso';
}

export type ParsedEntry = ManuscriptEntry | ContentsEntry | CoverEntry;

export interface WebPublicationManifestConfig {
  type: 'webpub';
  manifestPath: string;
  needToGenerateManifest: boolean;
}

export interface EpubEntryConfig {
  type: 'epub';
  epubPath: string;
  epubTmpOutputDir: string;
}

export interface EpubOpfEntryConfig {
  type: 'epub-opf';
  epubOpfPath: string;
}

export interface WebBookEntryConfig {
  type: 'webbook';
  webbookEntryUrl: string;
}

export type ViewerInputConfig =
  | WebPublicationManifestConfig
  | EpubEntryConfig
  | EpubOpfEntryConfig
  | WebBookEntryConfig;

export interface PdfOutput {
  format: 'pdf';
  path: string;
  renderMode: 'local' | 'docker';
  preflight: 'press-ready' | 'press-ready-local' | undefined;
  preflightOption: string[];
}

export interface WebPublicationOutput {
  format: 'webpub';
  path: string;
}

export interface EpubOutput {
  format: 'epub';
  path: string;
  version: '3.0'; // Reserved for future updates
}

export type OutputConfig = PdfOutput | WebPublicationOutput | EpubOutput;

export type PageSize = { format: string } | { width: string; height: string };

export type DocumentProcessorFactory = (
  options: StringifyMarkdownOptions,
  metadata: Metadata,
) => Processor;

export type ResolvedTaskConfig = {
  context: string;
  entryContextDir: string;
  workspaceDir: string;
  themesDir: string;
  entries: ParsedEntry[];
  input: {
    format: InputFormat;
    entry: string;
  };
  viewerInput: ViewerInputConfig;
  outputs: OutputConfig[];
  themeIndexes: Set<ParsedTheme>;
  copyAsset: {
    includes: string[];
    excludes: string[];
    fileExtensions: string[];
  };
  exportAliases: {
    source: string;
    target: string;
  }[];
  temporaryFilePrefix: string;
  size: PageSize | undefined;
  cropMarks: boolean;
  bleed: string | undefined;
  cropOffset: string | undefined;
  css: string | undefined;
  customStyle: string | undefined;
  customUserStyle: string | undefined;
  singleDoc: boolean;
  quick: boolean;
  title: string | undefined;
  author: string | undefined;
  language: string | undefined;
  readingProgression: 'ltr' | 'rtl' | undefined;
  documentProcessorFactory: DocumentProcessorFactory;
  vfmOptions: {
    hardLineBreaks: boolean;
    disableFormatHtml: boolean;
  };
  cover:
    | {
        src: string;
        name: string;
      }
    | undefined;
  timeout: number;
  sandbox: boolean;
  executableBrowser: string;
  browserType: BrowserType;
  proxy:
    | {
        server: string;
        bypass: string | undefined;
        username: string | undefined;
        password: string | undefined;
      }
    | undefined;
  image: string;
  viewer: string | undefined;
  viewerParam: string | undefined;
  logLevel: 'silent' | 'info' | 'verbose' | 'debug';
  ignoreHttpsErrors: boolean;
  base: string;
  server: Required<
    Pick<ResolvedViteConfig['server'], 'host' | 'port' | 'proxy'>
  >;
  static: Record<string, string[]>;
  rootUrl: string;
  viteConfig: UserConfig | undefined;
  viteConfigFile: string | boolean;
};

const DEFAULT_ASSET_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'svg',
  'gif',
  'webp',
  'apng',
  'ttf',
  'otf',
  'woff',
  'woff2',
];

function isManuscriptMediaType(
  mediaType: string | false,
): mediaType is ManuscriptMediaType {
  return !!(
    mediaType && manuscriptMediaTypes.includes(mediaType as ManuscriptMediaType)
  );
}

export function isWebPubConfig(
  config: ResolvedTaskConfig,
): config is ResolvedTaskConfig & {
  viewerInput: WebPublicationManifestConfig;
} {
  return config.viewerInput.type === 'webpub';
}

// parse theme locator
export function parseTheme({
  theme,
  context,
  workspaceDir,
  themesDir,
}: {
  theme: string | ThemeConfig;
  context: string;
  workspaceDir: string;
  themesDir: string;
}): ParsedTheme {
  const { specifier, import: importPath } =
    typeof theme === 'string' ? { specifier: theme, import: undefined } : theme;

  // url
  if (isValidUri(specifier)) {
    return {
      type: 'uri',
      name: upath.basename(specifier),
      location: specifier,
    };
  }

  // bare .css file
  const stylePath = upath.resolve(context, specifier);
  if (fs.existsSync(stylePath) && stylePath.endsWith('.css')) {
    const sourceRelPath = upath.relative(context, stylePath);
    return {
      type: 'file',
      name: upath.basename(specifier),
      source: stylePath,
      location: upath.resolve(workspaceDir, sourceRelPath),
    };
  }

  // node_modules, local pkg
  const parsed = parsePackageName(specifier, context);

  if (!parsed) {
    throw new Error(`Invalid package name: ${specifier}`);
  }
  // To security reason, Vivliostyle CLI disallow other than npm registry or local file as download source
  // TODO: Add option that user can allow an unofficial registry explicitly
  if (!parsed.registry && parsed.type !== 'directory') {
    throw new Error(`This package specifier is not allowed: ${specifier}`);
  }
  let name = parsed.name;
  let resolvedSpecifier = specifier;
  if (parsed.type === 'directory' && parsed.fetchSpec) {
    const pkgJsonPath = upath.join(parsed.fetchSpec, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      name = packageJson.name;
      resolvedSpecifier = parsed.fetchSpec;
    }
  }
  if (!name) {
    throw new Error(`Could not determine the package name: ${specifier}`);
  }
  return {
    type: 'package',
    name,
    specifier: resolvedSpecifier,
    location: upath.join(themesDir, 'node_modules', name),
    importPath,
  };
}

function parsePageSize(size: string): PageSize {
  const [width, height, ...others] = `${size}`.split(',');
  if (!width || others.length) {
    throw new Error(`Cannot parse size: ${size}`);
  } else if (width && height) {
    return {
      width,
      height,
    };
  } else {
    return {
      format: width,
    };
  }
}

function parseFileMetadata({
  contentType,
  sourcePath,
  workspaceDir,
  themesDir,
}: {
  contentType: ManuscriptMediaType;
  sourcePath: string;
  workspaceDir: string;
  themesDir?: string;
}): { title?: string; themes?: ParsedTheme[] } {
  const sourceDir = upath.dirname(sourcePath);
  let title: string | undefined;
  let themes: ParsedTheme[] | undefined;
  if (contentType === 'text/markdown') {
    const metadata = readMarkdownMetadata(sourcePath);
    title = metadata.title;
    if (metadata.vfm?.theme && themesDir) {
      themes = [metadata.vfm.theme]
        .flat()
        .filter(
          (entry) =>
            !!entry && (typeof entry === 'string' || typeof entry === 'object'),
        )
        .map((theme) =>
          parseTheme({
            theme,
            context: sourceDir,
            workspaceDir,
            themesDir,
          }),
        );
    }
  } else {
    const content = fs.readFileSync(sourcePath, 'utf8');
    title = content.match(/<title>([^<]*)<\/title>/)?.[1] || undefined;
  }
  return { title, themes };
}

export function resolveTaskConfig(
  config: ParsedBuildTask,
  options: InlineOptions,
): ResolvedTaskConfig {
  const context = options.cwd ?? defaultCwd;
  Logger.debug('resolveTaskConfig > context %s', context);

  const entryContextDir = config.entryContext
    ? upath.resolve(context, config.entryContext)
    : context;
  const language = config.language;
  const readingProgression = config.readingProgression;
  const size = config.size ? parsePageSize(config.size) : undefined;
  const cropMarks = options.cropMarks ?? false;
  const bleed = options.bleed;
  const cropOffset = options.cropOffset;
  const css = options.css;
  const customStyle =
    options.style &&
    (isValidUri(options.style)
      ? options.style
      : pathToFileURL(options.style).href);
  const customUserStyle =
    options.userStyle &&
    (isValidUri(options.userStyle)
      ? options.userStyle
      : pathToFileURL(options.userStyle).href);
  const singleDoc = options.singleDoc ?? false;
  const quick = options.quick ?? false;
  const temporaryFilePrefix =
    config.temporaryFilePrefix ?? `.vs-${Date.now()}.`;

  const documentProcessorFactory = config?.documentProcessor ?? VFM;

  const vfmOptions = {
    ...config?.vfm,
    hardLineBreaks: config?.vfm?.hardLineBreaks ?? false,
    disableFormatHtml: config?.vfm?.disableFormatHtml ?? false,
  };

  const timeout = config.timeout ?? 120_000; // 2 minutes
  const sandbox = options.sandbox ?? false;
  const browserType = config.browser ?? 'chromium';
  const proxyServer =
    options.proxyServer ?? process.env.HTTP_PROXY ?? undefined;
  const proxy = proxyServer
    ? {
        server: proxyServer,
        bypass: options.proxyBypass ?? process.env.NOPROXY ?? undefined,
        username: options.proxyUser,
        password: options.proxyPass,
      }
    : undefined;
  const executableBrowser =
    options.executableBrowser ?? getExecutableBrowserPath(browserType);
  const image = config.image ?? CONTAINER_IMAGE;
  const viewer = config.viewer ?? undefined;
  const viewerParam = config.viewerParam ?? undefined;
  const logLevel = options.logLevel ?? 'silent';
  const ignoreHttpsErrors = options.ignoreHttpsErrors ?? false;
  const base = config.base ?? '/vivliostyle';
  const staticRoutes = config.static ?? {};
  const viteConfig = config.vite;
  const viteConfigFile = config.viteConfigFile ?? true;

  const outputs = ((): OutputConfig[] => {
    const defaultPdfOptions: Omit<PdfOutput, 'path'> = {
      format: 'pdf',
      renderMode: 'local',
      preflight: config.pressReady ? 'press-ready' : undefined,
      preflightOption: [],
    };
    if (config.output) {
      return config.output.map((target): OutputConfig => {
        const outputPath = upath.resolve(context, target.path);
        const format = target.format;
        switch (format) {
          case 'pdf':
            return {
              ...defaultPdfOptions,
              ...target,
              format,
              path: outputPath,
            };
          case 'epub':
            return {
              ...target,
              format,
              path: outputPath,
              version: EPUB_OUTPUT_VERSION,
            };
          case 'webpub':
            return {
              ...target,
              format,
              path: outputPath,
            };
          default:
            return format satisfies never;
        }
      });
    }
    // Outputs a pdf file if any output configuration is not set
    const filename = config.title ? `${config.title}.pdf` : 'output.pdf';
    return [
      {
        ...defaultPdfOptions,
        path: upath.resolve(context, filename),
      },
    ];
  })();

  const { server, rootUrl } = (() => {
    let host = config.server?.host ?? false;
    const port = config.server?.port ?? 13000;
    if (
      outputs.some(
        (target) => target.format === 'pdf' && target.renderMode === 'docker',
      )
    ) {
      // Docker render mode requires wildcard host to allow access from the container
      host = true;
    }
    const rootHostname = isInContainer()
      ? CONTAINER_LOCAL_HOSTNAME
      : !host
        ? 'localhost'
        : host === true
          ? '0.0.0.0'
          : host;
    return {
      server: {
        host,
        port,
        proxy: config.server?.proxy ?? {},
      } satisfies ResolvedTaskConfig['server'],
      rootUrl: `http://${rootHostname}:${port}`,
    };
  })();

  const cover = config.cover && {
    src: upath.resolve(entryContextDir, config.cover.src),
    name: config.cover.name || COVER_HTML_IMAGE_ALT,
  };

  const copyAsset = {
    includes: config.copyAsset?.includes ?? config.includeAssets ?? [],
    excludes: config.copyAsset?.excludes ?? [],
    fileExtensions: [
      ...new Set([
        ...DEFAULT_ASSET_EXTENSIONS,
        ...(config.copyAsset?.includeFileExtensions ?? []),
      ]),
    ].filter(
      (ext) => !(config.copyAsset?.excludeFileExtensions ?? []).includes(ext),
    ),
  };

  const themeIndexes = new Set<ParsedTheme>();
  const projectConfig =
    !options.config && options.input
      ? resolveSingleInputConfig({
          config,
          input: options.input!,
          context,
          temporaryFilePrefix,
          themeIndexes,
          base,
        })
      : resolveComposedProjectConfig({
          config,
          context,
          entryContextDir,
          outputs,
          temporaryFilePrefix,
          themeIndexes,
          rootUrl,
          cover,
        });

  // Check overwrites
  for (const output of outputs) {
    const relPath = upath.relative(context, output.path);
    if (
      pathContains(output.path, entryContextDir) ||
      pathEquals(output.path, entryContextDir)
    ) {
      throw new Error(
        `The output path is set to "${relPath}", but this will overwrite the original manuscript file. Please specify a different path.`,
      );
    }
    if (
      pathContains(output.path, projectConfig.workspaceDir) ||
      pathEquals(output.path, projectConfig.workspaceDir)
    ) {
      throw new Error(
        `The output path is set to "${relPath}", but this will overwrite the working directory of Vivliostyle. Please specify a different path.`,
      );
    }
  }

  const resolvedConfig = {
    ...projectConfig,
    context,
    entryContextDir,
    outputs,
    themeIndexes,
    copyAsset,
    temporaryFilePrefix,
    size,
    cropMarks,
    bleed,
    cropOffset,
    css,
    customStyle,
    customUserStyle,
    singleDoc,
    quick,
    language,
    readingProgression,
    documentProcessorFactory,
    vfmOptions,
    cover,
    timeout,
    sandbox,
    executableBrowser,
    browserType,
    proxy,
    image,
    viewer,
    viewerParam,
    logLevel,
    ignoreHttpsErrors,
    base,
    server,
    static: staticRoutes,
    rootUrl,
    viteConfig,
    viteConfigFile,
  } satisfies ResolvedTaskConfig;
  return resolvedConfig;
}

type ProjectConfig = Pick<
  ResolvedTaskConfig,
  | 'workspaceDir'
  | 'themesDir'
  | 'entries'
  | 'input'
  | 'viewerInput'
  | 'exportAliases'
  | 'title'
  | 'author'
>;

function resolveSingleInputConfig({
  config,
  input,
  context,
  temporaryFilePrefix,
  themeIndexes,
  base,
}: Pick<
  ResolvedTaskConfig,
  'context' | 'temporaryFilePrefix' | 'themeIndexes' | 'base'
> & {
  config: ParsedBuildTask;
  input: NonNullable<InlineOptions['input']>;
}): ProjectConfig {
  Logger.debug('entering single entry config mode');

  let sourcePath: string;
  let workspaceDir: string;
  const inputFormat = input.format;
  const title = config?.title;
  const author = config?.author;
  const entries: ParsedEntry[] = [];
  const exportAliases: { source: string; target: string }[] = [];

  if (isValidUri(input.entry)) {
    sourcePath = input.entry;
    workspaceDir = context;
  } else {
    sourcePath = upath.resolve(context, input.entry);
    // Check file exists
    statFileSync(sourcePath);
    switch (input.format) {
      case 'webbook':
      case 'markdown':
      case 'pub-manifest':
      case 'epub':
        workspaceDir = upath.dirname(sourcePath);
        break;
      case 'epub-opf': {
        const rootDir = getEpubRootDir(sourcePath);
        if (!rootDir) {
          throw new Error(
            `Could not determine the EPUB root directory for the OPF file: ${sourcePath}`,
          );
        }
        workspaceDir = rootDir;
        break;
      }
      default:
        return input.format satisfies never;
    }
  }
  const themesDir = upath.resolve(workspaceDir, 'themes');

  if (input.format === 'markdown') {
    // Single input file; create temporary file
    const contentType = 'text/markdown';
    const metadata = parseFileMetadata({
      contentType,
      sourcePath,
      workspaceDir,
    });
    const target = upath
      .resolve(
        workspaceDir,
        `${temporaryFilePrefix}${upath.basename(sourcePath)}`,
      )
      .replace(/\.md$/, '.html');
    touchTmpFile(target);
    const themes =
      metadata.themes ??
      config.theme?.map((theme) =>
        parseTheme({
          theme,
          context,
          workspaceDir,
          themesDir,
        }),
      ) ??
      [];
    themes.forEach((t) => themeIndexes.add(t));
    entries.push({
      contentType,
      source: {
        type: 'file',
        pathname: sourcePath,
        contentType,
      },
      target,
      title: metadata.title,
      themes,
    });
    exportAliases.push({
      source: target,
      target: upath.resolve(
        upath.dirname(target),
        upath.basename(sourcePath).replace(/\.md$/, '.html'),
      ),
    });
  }

  let fallbackTitle: string | undefined;
  let viewerInput: ViewerInputConfig;

  if (inputFormat === 'markdown') {
    // create temporary manifest file
    const manifestPath = upath.resolve(
      workspaceDir,
      `${temporaryFilePrefix}${MANIFEST_FILENAME}`,
    );
    touchTmpFile(manifestPath);
    exportAliases.push({
      source: manifestPath,
      target: upath.resolve(workspaceDir, MANIFEST_FILENAME),
    });
    fallbackTitle =
      entries.length === 1 && entries[0].title
        ? (entries[0].title as string)
        : upath.basename(sourcePath);
    viewerInput = {
      type: 'webpub',
      manifestPath,
      needToGenerateManifest: true,
    };
  } else if (inputFormat === 'webbook') {
    let webbookEntryUrl: string;
    if (isValidUri(sourcePath)) {
      const url = new URL(sourcePath);
      // Ensures trailing slash or explicit HTML extensions
      if (
        /^https?:/i.test(url.protocol) &&
        !url.pathname.endsWith('/') &&
        !/\.html?$/.test(url.pathname)
      ) {
        url.pathname = `${url.pathname}/`;
      }
      webbookEntryUrl = url.href;
    } else {
      const rootFileUrl = pathToFileURL(workspaceDir).href;
      const urlPath = pathToFileURL(sourcePath).href.slice(rootFileUrl.length);
      webbookEntryUrl = `${base}${urlPath}`;
    }
    viewerInput = { type: 'webbook', webbookEntryUrl };
  } else if (inputFormat === 'pub-manifest') {
    viewerInput = {
      type: 'webpub',
      manifestPath: sourcePath,
      needToGenerateManifest: false,
    };
  } else if (inputFormat === 'epub-opf') {
    viewerInput = { type: 'epub-opf', epubOpfPath: sourcePath };
  } else if (inputFormat === 'epub') {
    viewerInput = {
      type: 'epub',
      epubPath: sourcePath,
      epubTmpOutputDir: upath.join(
        sourcePath,
        `../${temporaryFilePrefix}${upath.basename(sourcePath)}`,
      ),
    };
  } else {
    return inputFormat satisfies never;
  }

  return {
    workspaceDir,
    themesDir,
    entries,
    input: {
      format: inputFormat,
      entry: sourcePath,
    },
    viewerInput,
    exportAliases,
    title: title || fallbackTitle,
    author,
  };
}

function resolveComposedProjectConfig({
  config,
  context,
  entryContextDir,
  outputs,
  temporaryFilePrefix,
  themeIndexes,
  rootUrl,
  cover,
}: Pick<
  ResolvedTaskConfig,
  | 'context'
  | 'entryContextDir'
  | 'outputs'
  | 'temporaryFilePrefix'
  | 'themeIndexes'
  | 'rootUrl'
  | 'cover'
> & { config: ParsedBuildTask }): ProjectConfig {
  Logger.debug('entering composed project config mode');

  const workspaceDir = upath.resolve(
    context,
    config.workspaceDir ?? '.vivliostyle',
  );
  const themesDir = upath.resolve(workspaceDir, 'themes');
  const pkgJsonPath = upath.resolve(entryContextDir, 'package.json');
  const pkgJson = fs.existsSync(pkgJsonPath)
    ? readJSON(pkgJsonPath)
    : undefined;
  if (pkgJson) {
    Logger.debug('located package.json path', pkgJsonPath);
  }
  const exportAliases: { source: string; target: string }[] = [];

  const rootThemes =
    config.theme?.map((theme) =>
      parseTheme({
        theme,
        context,
        workspaceDir,
        themesDir,
      }),
    ) ?? [];
  rootThemes.forEach((t) => themeIndexes.add(t));
  const tocConfig = {
    tocTitle: config.toc?.title ?? config?.tocTitle ?? TOC_TITLE,
    target: upath.resolve(workspaceDir, config.toc?.htmlPath ?? TOC_FILENAME),
    sectionDepth: config.toc?.sectionDepth ?? 0,
    transform: {
      transformDocumentList: config.toc?.transformDocumentList,
      transformSectionList: config.toc?.transformSectionList,
    },
  };
  const coverHtml =
    config.cover &&
    ('htmlPath' in config.cover && !config.cover.htmlPath
      ? undefined
      : upath.resolve(
          workspaceDir,
          config.cover?.htmlPath || COVER_HTML_FILENAME,
        ));

  const ensureCoverImage = (src?: string) => {
    const absPath = src && upath.resolve(entryContextDir, src);
    if (absPath) {
      statFileSync(absPath, {
        errorMessage: 'Specified cover image does not exist',
      });
    }
    return absPath;
  };

  const projectTitle: string | undefined = config?.title ?? pkgJson?.name;
  const projectAuthor: string | undefined = config?.author ?? pkgJson?.author;

  const isContentsEntry = (entry: EntryConfig): entry is ContentsEntryConfig =>
    entry.rel === 'contents';
  const isCoverEntry = (entry: EntryConfig): entry is CoverEntryConfig =>
    entry.rel === 'cover';
  const isArticleEntry = (entry: EntryConfig): entry is ArticleEntryConfig =>
    !isContentsEntry(entry) && !isCoverEntry(entry);

  function parseEntry(entry: EntryConfig): ParsedEntry {
    const getInputInfo = (
      entryPath: string,
    ):
      | (FileEntrySource & { metadata: ReturnType<typeof parseFileMetadata> })
      | (UriEntrySource & { metadata?: undefined }) => {
      if (/^https?:/.test(entryPath)) {
        return {
          type: 'uri',
          href: entryPath,
          rootDir: upath.join(workspaceDir, new URL(entryPath).host),
        };
      } else if (entryPath.startsWith('/')) {
        return {
          type: 'uri',
          href: `${rootUrl}${entryPath}`,
          rootDir: upath.join(workspaceDir, 'localhost'),
        };
      }
      const pathname = upath.resolve(entryContextDir, entryPath);
      statFileSync(pathname);
      const contentType = mime(pathname);
      if (!isManuscriptMediaType(contentType)) {
        throw new Error(
          `Invalid manuscript type ${contentType} detected: ${entry}`,
        );
      }

      return {
        type: 'file',
        pathname,
        contentType,
        metadata: parseFileMetadata({
          contentType,
          sourcePath: pathname,
          workspaceDir,
          themesDir,
        }),
      };
    };

    const getTargetPath = (source: EntrySource) => {
      switch (source.type) {
        case 'file':
          return upath.resolve(
            workspaceDir,
            upath
              .relative(entryContextDir, source.pathname)
              .replace(/\.md$/, '.html'),
          );
        case 'uri': {
          const url = new URL(source.href, 'a://dummy');
          let pathname = url.pathname;
          if (!/\.html?$/.test(pathname)) {
            pathname = `${pathname.replace(/\/$/, '')}/index.html`;
          }
          return upath.join(source.rootDir, pathname);
        }
        default:
          return source satisfies never;
      }
    };

    if ((isContentsEntry(entry) || isCoverEntry(entry)) && entry.path) {
      const source = upath.resolve(entryContextDir, entry.path);
      try {
        statFileSync(source);
        /* v8 ignore next 10 */
      } catch (error) {
        // For backward compatibility, we allow missing files then assume that option as `output` field.
        Logger.logWarn(
          `The "path" option is set but the file does not exist: ${source}\nMaybe you want to set the "output" field instead.`,
        );
        entry.output = entry.path;
        entry.path = undefined;
      }
    }

    if (isContentsEntry(entry)) {
      const inputInfo = entry.path ? getInputInfo(entry.path) : undefined;
      const { metadata, ...template } = inputInfo || {};
      let target = entry.output
        ? upath.resolve(workspaceDir, entry.output)
        : inputInfo && getTargetPath(inputInfo);
      const themes = entry.theme
        ? [entry.theme].flat().map((theme) =>
            parseTheme({
              theme,
              context,
              workspaceDir,
              themesDir,
            }),
          )
        : (metadata?.themes ?? [...rootThemes]);
      themes.forEach((t) => themeIndexes.add(t));
      target ??= tocConfig.target;
      if (
        inputInfo?.type === 'file' &&
        pathEquals(inputInfo.pathname, target)
      ) {
        const tmpPath = upath.resolve(
          upath.dirname(target),
          `${temporaryFilePrefix}${upath.basename(target)}`,
        );
        exportAliases.push({ source: tmpPath, target });
        touchTmpFile(tmpPath);
        target = tmpPath;
      }
      const parsedEntry: ContentsEntry = {
        rel: 'contents',
        ...tocConfig,
        target,
        title: entry.title ?? metadata?.title ?? projectTitle,
        themes,
        pageBreakBefore: entry.pageBreakBefore,
        pageCounterReset: entry.pageCounterReset,
        ...('type' in template && { template }),
      };
      return parsedEntry;
    }

    if (isCoverEntry(entry)) {
      const inputInfo = entry.path ? getInputInfo(entry.path) : undefined;
      const { metadata, ...template } = inputInfo || {};
      let target = entry.output
        ? upath.resolve(workspaceDir, entry.output)
        : inputInfo && getTargetPath(inputInfo);
      const themes = entry.theme
        ? [entry.theme].flat().map((theme) =>
            parseTheme({
              theme,
              context,
              workspaceDir,
              themesDir,
            }),
          )
        : (metadata?.themes ?? []); // Don't inherit rootThemes for cover documents
      themes.forEach((t) => themeIndexes.add(t));
      const coverImageSrc = ensureCoverImage(entry.imageSrc || cover?.src);
      if (!coverImageSrc) {
        throw new Error(
          `A CoverEntryConfig is set in the entry list but a location of cover file is not set. Please set 'cover' property in your config file.`,
        );
      }
      target ??= upath.resolve(
        workspaceDir,
        entry.path || coverHtml || COVER_HTML_FILENAME,
      );
      if (
        inputInfo?.type === 'file' &&
        pathEquals(inputInfo.pathname, target)
      ) {
        const tmpPath = upath.resolve(
          upath.dirname(target),
          `${temporaryFilePrefix}${upath.basename(target)}`,
        );
        exportAliases.push({ source: tmpPath, target });
        touchTmpFile(tmpPath);
        target = tmpPath;
      }
      const parsedEntry: CoverEntry = {
        rel: 'cover',
        target,
        title: entry.title ?? metadata?.title ?? projectTitle,
        themes,
        coverImageSrc,
        coverImageAlt: entry.imageAlt || cover?.name || COVER_HTML_IMAGE_ALT,
        pageBreakBefore: entry.pageBreakBefore,
        ...('type' in template && { template }),
      };
      return parsedEntry;
    }

    if (isArticleEntry(entry)) {
      const inputInfo = getInputInfo(entry.path);
      const { metadata, ...source } = inputInfo;
      const target = entry.output
        ? upath.resolve(workspaceDir, entry.output)
        : getTargetPath(inputInfo);
      const themes = entry.theme
        ? [entry.theme]
            .flat()
            .map((theme) =>
              parseTheme({ theme, context, workspaceDir, themesDir }),
            )
        : (metadata?.themes ?? [...rootThemes]);
      themes.forEach((t) => themeIndexes.add(t));

      const parsedEntry: ManuscriptEntry = {
        contentType:
          inputInfo.type === 'file' ? inputInfo.contentType : 'text/html',
        source,
        target,
        title: entry.title ?? metadata?.title ?? projectTitle,
        themes,
        ...(entry.rel && { rel: entry.rel }),
      };
      return parsedEntry;
    }

    /* v8 ignore next */
    return entry satisfies never;
  }

  const entries = config.entry.map(parseEntry);

  let fallbackProjectTitle: string | undefined;
  if (!projectTitle) {
    if (entries.length === 1 && entries[0].title) {
      fallbackProjectTitle = entries[0].title;
    } else {
      fallbackProjectTitle = upath.basename(outputs[0].path);
    }
  }
  if (!!config?.toc && !entries.find(({ rel }) => rel === 'contents')) {
    entries.unshift({
      rel: 'contents',
      ...tocConfig,
      themes: [...rootThemes],
    });
  }
  if (cover && coverHtml && !entries.find(({ rel }) => rel === 'cover')) {
    entries.unshift({
      rel: 'cover',
      target: coverHtml,
      title: projectTitle,
      themes: [], // Don't inherit rootThemes for cover documents
      coverImageSrc: ensureCoverImage(cover.src)!,
      coverImageAlt: cover.name,
    });
  }

  return {
    workspaceDir,
    themesDir,
    entries,
    input: {
      format: 'pub-manifest',
      entry: upath.join(workspaceDir, MANIFEST_FILENAME),
    },
    viewerInput: {
      type: 'webpub',
      manifestPath: upath.join(workspaceDir, MANIFEST_FILENAME),
      needToGenerateManifest: true,
    },
    exportAliases,
    title: projectTitle || fallbackProjectTitle,
    author: projectAuthor,
  };
}
