import { Command, OptionValues } from 'commander';
import upath from 'upath';
import * as v from 'valibot';
import {
  InlineOptions,
  OutputConfig,
  ParsedVivliostyleConfigSchema,
  ParsedVivliostyleInlineConfig,
  VivliostyleInlineConfig,
} from '../config/schema.js';
import { EMPTY_DATA_URI } from '../const.js';
import { Logger } from '../logger.js';

export interface CliFlags {
  input?: string;
  config?: string;
  outputs?: Pick<OutputConfig, 'path' | 'format'>[];
  theme?: string[];
  size?: string;
  cropMarks?: boolean;
  bleed?: string;
  cropOffset?: string;
  css?: string;
  style?: string;
  userStyle?: string;
  singleDoc?: boolean;
  quick?: boolean;
  pressReady?: boolean;
  title?: string;
  author?: string;
  language?: string;
  readingProgression?: 'ltr' | 'rtl';
  timeout?: number;
  renderMode?: 'local' | 'docker';
  preflight?: 'press-ready' | 'press-ready-local';
  preflightOption?: string[];
  sandbox?: boolean;
  executableBrowser?: string;
  image?: string;
  /** @deprecated */ http?: boolean;
  viewer?: string;
  viewerParam?: string;
  browser?: 'chromium' | 'firefox' | 'webkit';
  proxyServer?: string;
  proxyBypass?: string;
  proxyUser?: string;
  proxyPass?: string;
  logLevel?: 'silent' | 'info' | 'verbose' | 'debug';
  ignoreHttpsErrors?: boolean;
}

export function parseFlagsToInlineConfig(
  argv: string[],
  setupProgram: () => Command,
): ParsedVivliostyleInlineConfig {
  const program = setupProgram();
  program.parse(argv);
  let options = program.opts<CliFlags>();
  const input = program.args?.[0];
  options = warnDeprecatedFlags(options);
  let inlineConfig: unknown = { input, ...options };
  if (
    input &&
    !options.config &&
    upath.basename(input).startsWith('vivliostyle.config')
  ) {
    // Load an input argument as a Vivliostyle config
    inlineConfig = { config: input, ...options };
  }
  return v.parse(VivliostyleInlineConfig, inlineConfig);
}

export function setupConfigFromFlags(
  flags: InlineOptions,
): ParsedVivliostyleConfigSchema {
  if (!flags.input) {
    if (flags.enableViewerStartPage) {
      return {
        tasks: [{ entry: [] }],
        inlineOptions: {
          input: { format: 'webbook', entry: EMPTY_DATA_URI },
        },
      };
    } else {
      throw new Error(
        'No input is set. Please set an appropriate entry or a Vivliostyle config file.',
      );
    }
  }
  return {
    tasks: [{ entry: [] }],
    inlineOptions: {},
  };
}

function warnDeprecatedFlags(options: OptionValues): OptionValues {
  const modifiedOptions = { ...options };

  if (options.executableChromium) {
    Logger.logWarn(
      "'--executable-chromium' option was deprecated and will be removed in a future release. Please replace with '--executable-browser' option.",
    );
    modifiedOptions.executableBrowser = options.executableChromium;
  }

  if (options.verbose) {
    Logger.logWarn(
      "'--verbose' option was deprecated and will be removed in a future release. Please replace with '--log-level verbose' option.",
    );
    modifiedOptions.logLevel = 'verbose';
  }

  if (options.sandbox === false) {
    Logger.logWarn(
      "'--no-sandbox' option was deprecated and will be removed in a future release. It is no longer necessary because the sandbox is disabled by default.",
    );
  }

  if (options.http) {
    Logger.logWarn(
      "'--http' option was deprecated and will be removed in a future release. It is unnecessary because the HTTP server starts automatically.",
    );
  }

  return modifiedOptions;
}
