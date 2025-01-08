import {
  InlineOptions,
  ParsedBuildTask,
  ParsedVivliostyleConfigSchema,
  ParsedVivliostyleInlineConfig,
} from './schema.js';

const pruneObject = <T extends Record<string, unknown>>(obj: T) => {
  const ret = { ...obj };
  for (const key in ret) {
    if (ret[key] === undefined || ret[key] === null) {
      delete ret[key];
    }
  }
  return ret as { [K in keyof T]: NonNullable<T[K]> };
};

export function mergeConfig(
  base: ParsedVivliostyleConfigSchema,
  override: Partial<ParsedBuildTask>,
): ParsedVivliostyleConfigSchema {
  return {
    tasks: base.tasks.map((task, i) => ({
      ...pruneObject(task),
      ...pruneObject(override),
    })),
    inlineOptions: base.inlineOptions,
  };
}

export function mergeInlineConfig(
  { tasks, inlineOptions }: ParsedVivliostyleConfigSchema,
  inlineConfig: ParsedVivliostyleInlineConfig,
): ParsedVivliostyleConfigSchema {
  const {
    theme,
    size,
    pressReady,
    title,
    author,
    language,
    readingProgression,
    timeout,
    image,
    viewer,
    viewerParam,
    browser,
    output,
    renderMode,
    preflight,
    preflightOption,
    // InlineOptions
    cwd,
    config,
    input,
    cropMarks,
    bleed,
    cropOffset,
    css,
    style,
    userStyle,
    singleDoc,
    quick,
    sandbox,
    executableBrowser,
    proxyServer,
    proxyBypass,
    proxyUser,
    proxyPass,
    logLevel,
    ignoreHttpsErrors,
    openViewer,
    enableStaticServe,
    enableViewerStartPage,
  } = inlineConfig;

  return {
    tasks: tasks.map((task) => ({
      ...pruneObject(task),
      ...pruneObject({
        theme,
        size,
        pressReady,
        title,
        author,
        language,
        readingProgression,
        timeout,
        image,
        viewer,
        viewerParam,
        browser,
      }),
      output: (output?.length ? output : task.output)?.map((o) => ({
        ...pruneObject(o),
        ...pruneObject({
          renderMode,
          preflight,
          preflightOption,
        }),
      })),
    })),
    inlineOptions: {
      ...pruneObject(inlineOptions),
      ...pruneObject({
        cwd,
        config,
        input,
        cropMarks,
        bleed,
        cropOffset,
        css,
        style,
        userStyle,
        singleDoc,
        quick,
        sandbox,
        executableBrowser,
        proxyServer,
        proxyBypass,
        proxyUser,
        proxyPass,
        logLevel,
        ignoreHttpsErrors,
        openViewer,
        enableStaticServe,
        enableViewerStartPage,
      } satisfies {
        [K in keyof Required<InlineOptions>]: InlineOptions[K];
      }),
    },
  };
}
