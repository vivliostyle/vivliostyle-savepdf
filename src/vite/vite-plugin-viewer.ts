import { NextHandleFunction } from 'connect';
import fs from 'node:fs';
import sirv from 'sirv';
import upath from 'upath';
import * as vite from 'vite';
import { ResolvedTaskConfig } from '../config/resolve.js';
import { InlineOptions } from '../config/schema.js';
import { VIEWER_ROOT_PATH, viewerRoot } from '../const.js';
import { prependToHead } from './plugin-util.js';

const viewerClientId = '@vivliostyle:viewer:client';
const viewerClientRequestPath = `/${viewerClientId}`;
const viewerClientContent = /* js */ `
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', (e) => {
    location.reload();
  });
}`;

export function vsViewerPlugin(_: {
  config: ResolvedTaskConfig;
  options: InlineOptions;
}): vite.Plugin {
  const serveRootDir = upath.join(viewerRoot, 'lib');
  const serve = sirv(serveRootDir, { dev: false, etag: true });
  let cachedIndexHtml: string;

  const middleware = async function vivliostyleViewerMiddleware(
    req,
    res,
    next,
  ) {
    if (req.url === '/' || req.url === '/index.html') {
      cachedIndexHtml ??= prependToHead(
        fs.readFileSync(upath.join(serveRootDir, 'index.html'), 'utf-8'),
        `<script type="module" src="${viewerClientRequestPath}"></script>`,
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html;charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      return res.end(cachedIndexHtml);
    } else {
      return serve(req, res, next);
    }
  } satisfies NextHandleFunction;

  return {
    name: 'vivliostyle:viewer',
    config() {
      return {
        optimizeDeps: {
          exclude: ['@vivliostyle/viewer'],
        },
      } satisfies vite.UserConfig;
    },
    configureServer(viteServer) {
      viteServer.middlewares.use(VIEWER_ROOT_PATH, middleware);
    },
    configurePreviewServer(viteServer) {
      viteServer.middlewares.use(VIEWER_ROOT_PATH, serve);
    },
    load(id) {
      if (id === viewerClientRequestPath) {
        return viewerClientContent;
      }
    },
  };
}
