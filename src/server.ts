import http from 'node:http';
import { pathToFileURL, URL } from 'node:url';
import handler from 'serve-handler';
import upath from 'upath';
import * as vite from 'vite';
import { resolveTaskConfig } from './config/resolve.js';
import { ParsedVivliostyleConfigSchema } from './config/schema.js';
import { prepareViteConfig } from './config/vite.js';
import { viewerRoot } from './const.js';
import {
  beforeExitHandlers,
  debug,
  findAvailablePort,
  isValidUri,
} from './util.js';
import { vsBrowserPlugin } from './vite/vite-plugin-browser.js';
import { vsDevServerPlugin } from './vite/vite-plugin-dev-server.js';
import { vsViewerPlugin } from './vite/vite-plugin-viewer.js';

export type PageSize = { format: string } | { width: string; height: string };

export interface Server {
  server: http.Server;
  port: number;
}

export type ViewerUrlOption = {
  size?: PageSize;
  cropMarks?: boolean;
  bleed?: string;
  cropOffset?: string;
  css?: string;
  style?: string;
  userStyle?: string;
  singleDoc?: boolean;
  quick?: boolean;
  viewerParam?: string | undefined;
};

export type ServerOption = ViewerUrlOption & {
  input: string;
  workspaceDir: string;
  viewer: string | undefined;
};

let _viewerServer: Server | undefined;
let _sourceServer: Server | undefined;

export async function prepareServer(option: ServerOption): Promise<{
  viewerFullUrl: string;
}> {
  const viewerUrl = await (option.viewer && isValidUri(option.viewer)
    ? new URL(option.viewer)
    : (() => {
        const viewerUrl = new URL('file://');
        viewerUrl.pathname = upath.join(viewerRoot, 'lib/index.html');
        return viewerUrl;
      })());

  const inputUrl = isValidUri(option.input)
    ? new URL(option.input)
    : pathToFileURL(option.input);
  const sourceUrl = await (async () => {
    return inputUrl;
  })();

  return {
    viewerFullUrl: getViewerFullUrl(option, {
      viewerUrl,
      sourceUrl,
    }),
  };
}

export function teardownServer() {
  if (_viewerServer) {
    _viewerServer.server.close();
    _viewerServer = undefined;
  }
  if (_sourceServer) {
    _sourceServer.server.close();
    _sourceServer = undefined;
  }
}

export function getViewerFullUrl(
  {
    size,
    cropMarks,
    bleed,
    cropOffset,
    css,
    style,
    userStyle,
    singleDoc,
    quick,
    viewerParam,
  }: ViewerUrlOption,
  { viewerUrl, sourceUrl }: { viewerUrl: URL; sourceUrl: URL },
): string {
  const pageSizeValue =
    size && ('format' in size ? size.format : `${size.width} ${size.height}`);

  function escapeParam(url: string) {
    return url.replace(/&/g, '%26');
  }

  let viewerParams =
    sourceUrl.href === 'data:,'
      ? '' // open Viewer start page
      : `src=${escapeParam(sourceUrl.href)}`;
  viewerParams += `&bookMode=${!singleDoc}&renderAllPages=${!quick}`;

  if (style) {
    viewerParams += `&style=${escapeParam(style)}`;
  }

  if (userStyle) {
    viewerParams += `&userStyle=${escapeParam(userStyle)}`;
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

  return `${viewerUrl.href}#${viewerParams}`;
}

function startEndpoint(root: string): http.Server {
  const serve = (req: http.IncomingMessage, res: http.ServerResponse) =>
    handler(req, res, {
      public: root,
      cleanUrls: false,
      directoryListing: false,
      headers: [
        {
          source: '**',
          headers: [
            {
              key: 'access-control-allow-headers',
              value: 'Origin, X-Requested-With, Content-Type, Accept, Range',
            },
            {
              key: 'access-control-allow-origin',
              value: '*',
            },
            {
              key: 'cache-control',
              value: 'no-cache, no-store, must-revalidate',
            },
          ],
        },
      ],
    });
  return http.createServer(serve);
}

async function launchServer(root: string): Promise<Server> {
  const port = await findAvailablePort();
  debug(`Launching server... root: ${root} port: ${port}`);

  const server = startEndpoint(root);

  return await new Promise((resolve) => {
    server.listen(port, 'localhost', () => {
      beforeExitHandlers.push(() => {
        server.close();
      });
      resolve({ server, port });
    });
  });
}

export async function createViteServer({
  vivliostyleConfig,
}: {
  vivliostyleConfig: ParsedVivliostyleConfigSchema;
}) {
  // const merged = mergeInlineConfig(vivliostyleConfig, inlineConfig);
  const { tasks, inlineOptions: options } = vivliostyleConfig;
  const config = resolveTaskConfig(tasks[0], options);
  let viteConfig = await prepareViteConfig(config);
  viteConfig = vite.mergeConfig(viteConfig, {
    clearScreen: false,
    configFile: false,
    appType: 'custom',
    plugins: [
      vsDevServerPlugin({ config, options }),
      vsViewerPlugin({ config, options }),
      vsBrowserPlugin({ config, options }),
    ],
    server: viteConfig.server ?? config.server,
  } satisfies vite.InlineConfig);

  const server = await vite.createServer(viteConfig);
  return { server };
}
