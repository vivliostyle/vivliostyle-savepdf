import { init } from '../core/init.js';
import { gracefulError } from '../util.js';
import { parseFlagsToInlineConfig } from './cli-flags.js';
import { setupInitParserProgram } from './init.parser.js';

try {
  const inlineConfig = parseFlagsToInlineConfig(
    process.argv,
    setupInitParserProgram,
  );
  await init(inlineConfig);
} catch (err) {
  if (err instanceof Error) {
    gracefulError(err);
  }
}
