import debug from 'debug';
import yoctoSpinner, { Spinner } from 'yocto-spinner';
import {
  blueBright,
  gray,
  greenBright,
  red,
  redBright,
  yellow,
  yellowBright,
} from 'yoctocolors';
import { isInContainer } from './util.js';

export const isUnicodeSupported =
  process.platform !== 'win32' || Boolean(process.env.WT_SESSION);

export const randomBookSymbol = ['📕', '📗', '📘', '📙'][
  Math.floor(Math.random() * 4)
];

const infoSymbol = blueBright('INFO');
const successSymbol = greenBright('SUCCESS');
const warnSymbol = yellowBright('WARN');
const errorSymbol = redBright('ERROR');

export class Logger {
  /**
   * 0: silent 1: info 2: verbose 3: debug
   */
  static #logLevel: 0 | 1 | 2 | 3 = 0;
  static #loggerInstance: Logger | undefined;
  static #nonBlockingLogPrinted = false;

  static debug = debug('vs-cli');

  static get #spinner() {
    return this.#loggerInstance && this.#loggerInstance.#_spinner;
  }

  static get isInteractive() {
    return Boolean(
      process.stderr.isTTY &&
        process.env.TERM !== 'dumb' &&
        !('CI' in process.env) &&
        !import.meta.env?.VITEST &&
        !debug.enabled('vs-cli') &&
        // Prevent stream output in docker container so that not to spawn process
        !isInContainer(),
    );
  }

  static startLogging(text: string) {
    if (this.#logLevel === 0) {
      return;
    }
    if (!this.isInteractive) {
      this.logInfo(text);
      return;
    }
    if (this.#loggerInstance) {
      this.#loggerInstance.#_spinner.text = text;
      return this.#loggerInstance;
    }
    this.#loggerInstance = new Logger();
    this.#loggerInstance.#_spinner.start(text);
    return this.#loggerInstance;
  }

  static suspendLogging(text: string) {
    if (this.#logLevel === 0) {
      return;
    }
    if (!this.#spinner || !this.isInteractive) {
      this.logInfo(text);
      return;
    }
    const currentMsg = this.#spinner?.text;
    this.logUpdate(currentMsg);
    this.#spinner.stop(`${infoSymbol} ${text}\n`);
    return {
      [Symbol.dispose]() {
        if (Logger.isInteractive) {
          console.log('');
          Logger.#spinner?.start(currentMsg);
          Logger.#nonBlockingLogPrinted = true;
        }
      },
    };
  }

  static log(...messages: any[]) {
    if (this.#logLevel < 1) {
      return;
    }
    console.log(...messages);
  }

  static logUpdate(...messages: any[]) {
    if (!this.#spinner || !this.isInteractive) {
      this.logInfo(...messages);
      return;
    }
    this.#spinner.stop(
      this.#nonBlockingLogPrinted
        ? undefined
        : `${infoSymbol} ${this.#spinner.text}`,
    );
    this.#spinner.start(messages.join(' '));
    this.#nonBlockingLogPrinted = false;
  }

  static #nonBlockingLog(
    fallback: (...messages: any[]) => void,
    message: string,
  ) {
    if (!this.#spinner || !this.isInteractive) {
      if (isInContainer()) {
        message = `${gray('[Docker]')} ${message}`;
      }
      this.#logLevel >= 3 ? this.debug(message) : fallback(message);
      return;
    }
    this.logUpdate(this.#spinner.text);
    this.#nonBlockingLogPrinted = true;
    this.#spinner.stop(message);
    this.#spinner.start();
  }

  static logSuccess(...messages: any[]) {
    if (this.#logLevel < 1) {
      return;
    }
    this.#nonBlockingLog(console.log, `${successSymbol} ${messages.join(' ')}`);
  }

  static logError(...messages: any[]) {
    if (this.#logLevel < 1) {
      return;
    }
    this.#nonBlockingLog(
      console.error,
      `${errorSymbol} ${red(messages.join(' '))}`,
    );
  }

  static logWarn(...messages: any[]) {
    if (this.#logLevel < 1) {
      return;
    }
    this.#nonBlockingLog(
      console.warn,
      `${warnSymbol} ${yellow(messages.join(' '))}`,
    );
  }

  static logInfo(...messages: any[]) {
    if (this.#logLevel < 1) {
      return;
    }
    this.#nonBlockingLog(console.info, `${infoSymbol} ${messages.join(' ')}`);
  }

  static logVerbose(...messages: any[]) {
    if (this.#logLevel < 2) {
      return;
    }
    this.#nonBlockingLog(console.log, messages.join(' '));
  }

  static setLogLevel(level?: 'silent' | 'info' | 'verbose' | 'debug') {
    if (!level) {
      return;
    }
    this.#logLevel = (
      {
        silent: 0,
        info: 1,
        verbose: 2,
        debug: 3,
      } as const
    )[level];
    if (this.#logLevel >= 3) {
      debug.enable('vs-cli');
    }
  }

  #_spinner: Spinner;

  constructor() {
    this.#_spinner = yoctoSpinner({
      spinner: {
        frames: isUnicodeSupported
          ? ['▁▁╱ ', '▁║▁ ', '╲▁▁ ', '▁▁▁ ', '▁▁▁ ', '▁▁▁ ']
          : ['-   ', '\\   ', '|   ', '/   '],
        interval: 80,
      },
      color: 'gray',
    });
    return this;
  }

  [Symbol.dispose]() {
    this.#_spinner.stop(
      Logger.#nonBlockingLogPrinted
        ? undefined
        : `${infoSymbol} ${this.#_spinner.text}`,
    );
    Logger.#loggerInstance = undefined;
  }
}
