import * as v from 'valibot';
import { setupConfigFromFlags } from './commands/cli-flags.js';
import { loadVivliostyleConfig, warnDeprecatedConfig } from './config/load.js';
import { mergeInlineConfig } from './config/merge.js';
import { resolveTaskConfig } from './config/resolve.js';
import { VivliostyleInlineConfig } from './config/schema.js';
import { Logger } from './logger.js';
import { vsBrowserPlugin } from './vite/vite-plugin-browser.js';
import { vsDevServerPlugin } from './vite/vite-plugin-dev-server.js';
import { vsStaticServePlugin } from './vite/vite-plugin-static-serve.js';
import { vsViewerPlugin } from './vite/vite-plugin-viewer.js';

export async function createVitePlugin(
  inlineConfig: VivliostyleInlineConfig = {},
): Promise<import('vite').Plugin[]> {
  const parsed = v.parse(VivliostyleInlineConfig, inlineConfig);
  Logger.debug('inlineConfig %O', parsed);
  const vivliostyleConfig =
    (await loadVivliostyleConfig({
      configPath: parsed.config,
      configObject: inlineConfig.configData,
      cwd: parsed.cwd,
    })) ?? setupConfigFromFlags(parsed);
  warnDeprecatedConfig(vivliostyleConfig);
  const { tasks, inlineOptions: options } = mergeInlineConfig(
    vivliostyleConfig,
    parsed,
  );
  const config = resolveTaskConfig(tasks[0], options);
  Logger.debug('config %O', config);

  return [
    vsDevServerPlugin({ config, options }),
    vsViewerPlugin({ config, options }),
    vsBrowserPlugin({ config, options }),
    vsStaticServePlugin({ config, options }),
  ];
}
