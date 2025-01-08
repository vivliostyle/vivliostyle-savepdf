import fs from 'node:fs';
import { URL } from 'node:url';
import upath from 'upath';
import {
  createServer,
  InlineConfig,
  preview,
  PreviewServer,
  ResolvedConfig as ResolvedViteConfig,
  ViteDevServer,
} from 'vite';
import { ResolvedTaskConfig } from './config/resolve.js';
import { InlineOptions } from './config/schema.js';
import { EMPTY_DATA_URI, VIEWER_ROOT_PATH } from './const.js';
import { Logger } from './logger.js';
import { getDefaultEpubOpfPath, isValidUri, openEpub } from './util.js';
import { vsBrowserPlugin } from './vite/vite-plugin-browser.js';
import { vsDevServerPlugin } from './vite/vite-plugin-dev-server.js';
import { vsStaticServePlugin } from './vite/vite-plugin-static-serve.js';
import { vsViewerPlugin } from './vite/vite-plugin-viewer.js';

export type ViewerUrlOption = Pick<
  ResolvedTaskConfig,
  | 'size'
  | 'cropMarks'
  | 'bleed'
  | 'cropOffset'
  | 'css'
  | 'customStyle'
  | 'customUserStyle'
  | 'singleDoc'
  | 'quick'
  | 'viewerParam'
>;

export function getViewerParams(
  src: string | undefined,
  {
    size,
    cropMarks,
    bleed,
    cropOffset,
    css,
    customStyle,
    customUserStyle,
    singleDoc,
    quick,
    viewerParam,
  }: ViewerUrlOption,
): string {
  const pageSizeValue =
    size && ('format' in size ? size.format : `${size.width} ${size.height}`);

  function escapeParam(url: string) {
    return url.replace(/&/g, '%26');
  }

  let viewerParams = src ? `src=${escapeParam(src)}` : '';
  viewerParams += `&bookMode=${!singleDoc}&renderAllPages=${!quick}`;

  if (customStyle) {
    viewerParams += `&style=${escapeParam(customStyle)}`;
  }

  if (customUserStyle) {
    viewerParams += `&userStyle=${escapeParam(customUserStyle)}`;
  }

  if (pageSizeValue || cropMarks || bleed || cropOffset || css) {
    let pageStyle = '@page{';
    if (pageSizeValue) {
      pageStyle += `size:${pageSizeValue};`;
    }
    if (cropMarks) {
      pageStyle += `marks:crop cross;`;
    }
    if (bleed || cropMarks) {
      pageStyle += `bleed:${bleed ?? '3mm'};`;
    }
    if (cropOffset) {
      pageStyle += `crop-offset:${cropOffset};`;
    }
    pageStyle += '}';

    // The pageStyle settings are put between the `/*<viewer>*/` and `/*</viewer>*/`
    // in the `&style=data:,…` viewer parameter so that they are reflected in the
    // Settings menu of the Viewer. Also the custom CSS code is appended after the
    // `/*</viewer>*/` so that it is shown in the Edit CSS box in the Settings menu.
    viewerParams += `&style=data:,/*<viewer>*/${encodeURIComponent(
      pageStyle,
    )}/*</viewer>*/${encodeURIComponent(css ?? '')}`;
  }

  if (viewerParam) {
    // append additional viewer parameters
    viewerParams += `&${viewerParam}`;
  }

  return viewerParams;
}

export async function getSourceUrl({
  viewerInput,
  base,
  workspaceDir,
  rootUrl,
}: Pick<
  ResolvedTaskConfig,
  'viewerInput' | 'base' | 'workspaceDir' | 'rootUrl'
>) {
  let input: string;
  switch (viewerInput.type) {
    case 'webpub':
      input = viewerInput.manifestPath;
      break;
    case 'webbook':
      input = viewerInput.webbookEntryUrl;
      break;
    case 'epub-opf':
      input = viewerInput.epubOpfPath;
      break;
    case 'epub': {
      if (!fs.existsSync(viewerInput.epubTmpOutputDir)) {
        await openEpub(viewerInput.epubPath, viewerInput.epubTmpOutputDir);
      }
      input = getDefaultEpubOpfPath(viewerInput.epubTmpOutputDir);
      break;
    }
    default:
      input = viewerInput satisfies never;
  }
  return (
    isValidUri(input)
      ? new URL(input)
      : new URL(
          upath.posix.join(base, upath.relative(workspaceDir, input)),
          rootUrl,
        )
  ).href;
}

export async function getViewerFullUrl({
  viewerInput,
  base,
  workspaceDir,
  rootUrl,
  viewer,
  ...config
}: ViewerUrlOption &
  Pick<
    ResolvedTaskConfig,
    'viewerInput' | 'base' | 'workspaceDir' | 'rootUrl' | 'viewer'
  >) {
  const viewerUrl = viewer
    ? new URL(viewer)
    : new URL(`${VIEWER_ROOT_PATH}/index.html`, rootUrl);
  const sourceUrl = await getSourceUrl({
    viewerInput,
    base,
    workspaceDir,
    rootUrl,
  });
  const viewerParams = getViewerParams(
    sourceUrl === EMPTY_DATA_URI
      ? undefined // open Viewer start page
      : sourceUrl,
    config,
  );
  viewerUrl.hash = viewerParams;
  return viewerUrl.href;
}

export async function createViteServer(args: {
  config: ResolvedTaskConfig;
  viteConfig: ResolvedViteConfig;
  inlineOptions: InlineOptions;
  mode: 'preview';
}): Promise<ViteDevServer>;
export async function createViteServer(args: {
  config: ResolvedTaskConfig;
  viteConfig: ResolvedViteConfig;
  inlineOptions: InlineOptions;
  mode: 'build';
}): Promise<PreviewServer>;
export async function createViteServer({
  config,
  viteConfig,
  inlineOptions: options,
  mode,
}: {
  config: ResolvedTaskConfig;
  viteConfig: ResolvedViteConfig;
  inlineOptions: InlineOptions;
  mode: 'preview' | 'build';
}) {
  const inlineConfig = {
    clearScreen: false,
    configFile: false,
    appType: 'custom',
    plugins: [
      vsDevServerPlugin({ config, options }),
      vsViewerPlugin({ config, options }),
      vsBrowserPlugin({ config, options }),
      vsStaticServePlugin({ config, options }),
    ],
    server: viteConfig.server,
    preview: viteConfig.preview,
  } satisfies InlineConfig;
  Logger.debug('createViteServer > inlineConfig %O', inlineConfig);

  if (mode === 'preview') {
    return await createServer(inlineConfig);
  } else {
    return await preview(inlineConfig);
  }
}
