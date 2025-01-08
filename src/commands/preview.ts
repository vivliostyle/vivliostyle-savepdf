import { preview } from '../core/preview.js';
import { gracefulError } from '../util.js';
import { parseFlagsToInlineConfig } from './cli-flags.js';
import { setupPreviewParserProgram } from './preview.parser.js';

try {
  const inlineConfig = parseFlagsToInlineConfig(
    process.argv,
    setupPreviewParserProgram,
  );
  await preview(inlineConfig);
} catch (err) {
  if (err instanceof Error) {
    gracefulError(err);
  }
}
