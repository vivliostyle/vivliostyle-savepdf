import * as v from 'valibot';
import { VivliostyleInlineConfig } from './config/schema.js';
import { build as _build } from './core/build.js';
import { init as _init } from './core/init.js';
import { preview as _preview } from './core/preview.js';
import type { PublicationManifest as _PublicationManifest } from './schema/publication.schema.js';

export type {
  StructuredDocument,
  StructuredDocumentSection,
  VivliostyleConfigSchema,
} from './config/schema.js';
export { createVitePlugin } from './vite-adapter.js';
/** @hidden */
export type PublicationManifest = _PublicationManifest;

/**
 * Build publication file(s) from the given configuration.
 *
 * ```ts
 * import { build } from '@vivliostyle/cli';
 * build({
 *   configPath: './vivliostyle.config.js',
 *   logLevel: 'silent',
 * });
 * ```
 *
 * @param options
 * @returns
 */
export async function build(options: VivliostyleInlineConfig) {
  const parsed = v.parse(VivliostyleInlineConfig, options);
  return await _build(parsed);
}

/**
 * Initialize a new vivliostyle.config.js file.
 *
 * @param options
 * @returns
 */
export async function init(options: VivliostyleInlineConfig) {
  const parsed = v.parse(VivliostyleInlineConfig, options);
  return await _init(parsed);
}

/**
 * Open a browser for previewing the publication.
 *
 * @param options
 * @returns
 */
export async function preview(options: VivliostyleInlineConfig) {
  const parsed = v.parse(VivliostyleInlineConfig, options);
  return await _preview(parsed);
}
