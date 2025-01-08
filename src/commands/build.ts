import process from 'node:process';
import { build } from '../core/build.js';
import { Logger } from '../logger.js';
import { gracefulError, isInContainer } from '../util.js';
import { setupBuildParserProgram } from './build.parser.js';
import { parseFlagsToInlineConfig } from './cli-flags.js';

try {
  let inlineConfig = parseFlagsToInlineConfig(
    process.argv,
    setupBuildParserProgram,
  );
  if (isInContainer()) {
    inlineConfig = JSON.parse(process.env.VS_CLI_BUILD_PDF_OPTIONS!);
    Logger.debug('bypassedPdfBuilderOption %O', inlineConfig);
  }
  await build(inlineConfig);
} catch (err) {
  if (err instanceof Error) {
    gracefulError(err);
  }
}
