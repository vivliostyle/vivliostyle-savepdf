import fs from 'node:fs';
import * as playwright from 'playwright-core';
import { registry } from 'playwright-core/lib/server';
import { ResolvedTaskConfig } from './config/resolve.js';
import type { BrowserType } from './config/schema.js';
import { Logger } from './logger.js';
import { beforeExitHandlers, isInContainer, pathEquals } from './util.js';

export async function launchBrowser({
  browserType,
  proxy,
  executablePath,
  headless,
  noSandbox,
  disableWebSecurity,
  disableDevShmUsage,
}: {
  browserType: BrowserType;
  proxy:
    | {
        server: string;
        bypass: string | undefined;
        username: string | undefined;
        password: string | undefined;
      }
    | undefined;
  executablePath: string;
  headless: boolean;
  noSandbox?: boolean;
  disableWebSecurity?: boolean;
  disableDevShmUsage?: boolean;
}): Promise<playwright.Browser> {
  const options =
    browserType === 'chromium'
      ? {
          executablePath,
          chromiumSandbox: !noSandbox,
          headless,
          args: [
            '--allow-file-access-from-files',
            disableWebSecurity && '--disable-web-security',
            disableDevShmUsage && '--disable-dev-shm-usage',
            // #357: Set devicePixelRatio=1 otherwise it causes layout issues in HiDPI displays
            headless && '--force-device-scale-factor=1',
            // set Chromium language to English to avoid locale-dependent issues (e.g. minimum font size)
            '--lang=en',
            // ...(!headless && process.platform === 'darwin'
            //   ? ['-AppleLanguages', '(en)']
            //   : []),
          ].filter((value): value is string => Boolean(value)),
          env: { ...process.env, LANG: 'en.UTF-8' },
          proxy: proxy,
        }
      : // TODO: Investigate appropriate settings on Firefox & Webkit
        { executablePath, headless };
  const browser = await playwright[browserType].launch(options);
  beforeExitHandlers.push(() => {
    browser.close();
  });
  return browser;
}

export function getExecutableBrowserPath(browserType: BrowserType): string {
  return playwright[browserType].executablePath();
}

export function getFullBrowserName(browserType: BrowserType): string {
  return {
    chromium: 'Chromium',
    firefox: 'Firefox',
    webkit: 'Webkit',
  }[browserType];
}

export function checkBrowserAvailability(path: string): boolean {
  return fs.existsSync(path);
}

export function isPlaywrightExecutable(path: string): boolean {
  return [playwright.chromium, playwright.firefox, playwright.webkit].some(
    (exe) => pathEquals(exe.executablePath() ?? '', path),
  );
}

export async function downloadBrowser(
  browserType: BrowserType,
): Promise<string> {
  const executable = registry.findExecutable(browserType);
  {
    using _ = Logger.suspendLogging(
      'Rendering browser is not installed yet. Downloading now.',
    );
    await registry.install([executable], false);
  }
  return executable.executablePath()!;
}

export async function launchPreview({
  mode,
  url,
  onBrowserOpen,
  onPageOpen,
  config: { browserType, proxy, executableBrowser, sandbox, ignoreHttpsErrors },
}: {
  mode: 'preview' | 'build';
  url: string;
  onBrowserOpen?: (browser: playwright.Browser) => void | Promise<void>;
  onPageOpen?: (page: playwright.Page) => void | Promise<void>;
  config: Pick<
    ResolvedTaskConfig,
    | 'browserType'
    | 'proxy'
    | 'executableBrowser'
    | 'sandbox'
    | 'ignoreHttpsErrors'
  >;
}) {
  Logger.debug(`Executing browser path: ${executableBrowser}`);
  if (!checkBrowserAvailability(executableBrowser)) {
    if (isPlaywrightExecutable(executableBrowser)) {
      // The browser isn't downloaded first time starting CLI so try to download it
      await downloadBrowser(browserType);
    } else {
      // executableBrowser seems to be specified explicitly
      throw new Error(
        `Cannot find the browser. Please check the executable browser path: ${executableBrowser}`,
      );
    }
  }

  const browser = await launchBrowser({
    browserType,
    proxy,
    executablePath: executableBrowser,
    headless: mode === 'build',
    noSandbox: !sandbox,
    disableDevShmUsage: isInContainer(),
  });
  await onBrowserOpen?.(browser);

  const page = await browser.newPage({
    viewport:
      mode === 'build'
        ? // This viewport size important to detect headless environment in Vivliostyle viewer
          // https://github.com/vivliostyle/vivliostyle.js/blob/73bcf323adcad80126b0175630609451ccd09d8a/packages/core/src/vivliostyle/vgen.ts#L2489-L2500
          {
            width: 800,
            height: 600,
          }
        : null,
    ignoreHTTPSErrors: ignoreHttpsErrors,
  });
  await onPageOpen?.(page);

  // Prevent confirm dialog from being auto-dismissed
  page.on('dialog', () => {});

  await page.goto(url);

  return { browser, page };
}
