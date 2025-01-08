import {
  ConfigEnv,
  InlineConfig,
  mergeConfig as mergeViteConfig,
  resolveConfig,
  ResolvedConfig as ResolvedViteConfig,
} from 'vite';
import { ResolvedTaskConfig } from './resolve.js';

// Be careful not to confuse the preview/build commands of Vivliostyle CLI with Vite's mode.
// In Vivliostyle CLI, "preview" command starts the dev server in Vite,
// and "build" command starts the preview server in Vite.
const defaultConfigEnv: Record<'preview' | 'build', ConfigEnv> = {
  preview: { command: 'serve', mode: 'development', isPreview: false },
  build: { command: 'serve', mode: 'production', isPreview: true },
};

export async function resolveViteConfig({
  context,
  server,
  viteConfig,
  viteConfigFile,
  mode,
}: Pick<
  ResolvedTaskConfig,
  'context' | 'server' | 'viteConfig' | 'viteConfigFile'
> & {
  mode: 'preview' | 'build';
}): Promise<ResolvedViteConfig> {
  const finalUserConfig = mergeViteConfig(viteConfig || {}, {
    server,
    preview: server,
    configFile: viteConfigFile === true ? undefined : viteConfigFile,
    root: context,
  } satisfies InlineConfig);
  return await resolveConfig(
    finalUserConfig,
    defaultConfigEnv[mode].command,
    defaultConfigEnv[mode].mode,
    'development',
    defaultConfigEnv[mode].isPreview,
  );
}
