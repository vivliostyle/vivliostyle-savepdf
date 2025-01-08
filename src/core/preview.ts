import terminalLink from 'terminal-link';
import { blueBright, cyan, dim } from 'yoctocolors';
import { setupConfigFromFlags } from '../commands/cli-flags.js';
import { loadVivliostyleConfig, warnDeprecatedConfig } from '../config/load.js';
import { mergeInlineConfig } from '../config/merge.js';
import { resolveTaskConfig } from '../config/resolve.js';
import { ParsedVivliostyleInlineConfig } from '../config/schema.js';
import { resolveViteConfig } from '../config/vite.js';
import { cliVersion } from '../const.js';
import { isUnicodeSupported, Logger, randomBookSymbol } from '../logger.js';
import { createViteServer, getViewerFullUrl } from '../server.js';

export async function preview(inlineConfig: ParsedVivliostyleInlineConfig) {
  Logger.setLogLevel(inlineConfig.logLevel);
  Logger.debug('preview > inlineConfig %O', inlineConfig);

  let vivliostyleConfig =
    (await loadVivliostyleConfig({
      configPath: inlineConfig.config,
      configObject: inlineConfig.configData,
      cwd: inlineConfig.cwd,
    })) ?? setupConfigFromFlags(inlineConfig);
  warnDeprecatedConfig(vivliostyleConfig);
  vivliostyleConfig = mergeInlineConfig(vivliostyleConfig, inlineConfig);
  const { tasks, inlineOptions } = vivliostyleConfig;
  Logger.debug('preview > vivliostyleConfig %O', vivliostyleConfig);

  // Only show preview of first entry
  const config = resolveTaskConfig(tasks[0], inlineOptions);
  Logger.debug('preview > config %O', config);

  {
    using _ = Logger.startLogging('Start preview');
    const viteConfig = await resolveViteConfig({
      ...config,
      mode: 'preview',
    });
    const server = await createViteServer({
      config,
      viteConfig,
      inlineOptions,
      mode: 'preview',
    });
    await server.listen();
  }

  const url = await getViewerFullUrl(config);
  Logger.log(`
${cyan(`Vivliostyle CLI v${cliVersion}`)}
${blueBright('║')} ${isUnicodeSupported ? `${randomBookSymbol} ` : ''}Up and running (press Ctrl+C to quit)
${blueBright('╙─')} ${dim(`Preview URL: ${terminalLink(url, url, { fallback: () => url })}`)}
`);
}
