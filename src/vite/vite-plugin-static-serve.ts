import sirv from 'sirv';
import * as vite from 'vite';
import { ResolvedTaskConfig } from '../config/resolve.js';
import { InlineOptions } from '../config/schema.js';

export function vsStaticServePlugin({
  config: _config,
  options,
}: {
  config: ResolvedTaskConfig;
  options: InlineOptions;
}): vite.Plugin {
  let config = _config;

  const createMiddlewares = () =>
    Object.entries(config.static).flatMap(([base, dirs]) =>
      dirs.map((dir) => [base, sirv(dir, { dev: true, etag: false })] as const),
    );

  return {
    name: 'vivliostyle:static-serve',
    apply: () => Boolean(options.enableStaticServe),
    configureServer(viteServer) {
      return () => {
        createMiddlewares().forEach(([base, middleware]) => {
          viteServer.middlewares.use(base, middleware);
        });
      };
    },

    configurePreviewServer(viteServer) {
      return () => {
        createMiddlewares().forEach(([base, middleware]) => {
          viteServer.middlewares.use(base, middleware);
        });
      };
    },
  };
}
