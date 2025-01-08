import { Command, Option } from 'commander';

export function setupBuildParserProgram(): Command {
  // Provide an order-sensitive command parser
  // ex: "-o foo -o bar -f baz"
  //    → [{path: "foo"}, {path:"bar", format: "baz"}]
  // ex: "-f foo -o bar -o baz -f piyo"
  //    → [{path: "bar", format: "foo"}, {path: "baz", format: "piyo"}]
  const targets: {
    path?: string;
    format?: string;
  }[] = [];
  const outputOptionProcessor = (
    value: string,
    previous?: string[],
  ): string[] => {
    if (targets.length === 0 || 'path' in targets[targets.length - 1]) {
      targets.push({ path: value });
    } else {
      targets[targets.length - 1].path = value;
    }
    return [...(previous || []), value];
  };
  const formatOptionProcessor = (
    value: string,
    previous?: string[],
  ): string[] => {
    if (targets.length === 0 || 'format' in targets[targets.length - 1]) {
      targets.push({ format: value });
    } else {
      targets[targets.length - 1].format = value;
    }
    return [...(previous || []), value];
  };

  const program = new Command();
  program
    .name('vivliostyle build')
    .description('build and create PDF file')
    .arguments('[input]')
    .option(
      '-c, --config <config_file>',
      'path to vivliostyle.config.js [vivliostyle.config.js]',
    )
    .option(
      '-o, --output <path>',
      `specify output file name or directory [<title>.pdf]
This option can be specified multiple, then each -o options can be supplied one -f option.
ex: -o output1 -f webpub -o output2.pdf -f pdf`,
      outputOptionProcessor,
    )
    .option(
      '-f, --format <format>',
      `specify output format corresponding output target
If an extension is specified on -o option, this field will be inferenced automatically.`,
      formatOptionProcessor,
    )
    .option(
      '-s, --size <size>',
      `output pdf size
preset: A5, A4, A3, B5, B4, JIS-B5, JIS-B4, letter, legal, ledger
custom(comma separated): 182mm,257mm or 8.5in,11in`,
    )
    .option('-m, --crop-marks', 'print crop marks')
    .option(
      '--bleed <bleed>',
      'extent of the bleed area for printing with crop marks [3mm]',
    )
    .option(
      '--crop-offset <offset>',
      'distance between the edge of the trim size and the edge of the media size. [auto (13mm + bleed)]',
    )
    .option(
      '--css <CSS>',
      'custom style CSS code. (ex: ":root {--my-color: lime;}")',
    )
    .option('--style <stylesheet>', 'additional stylesheet URL or path')
    .option('--user-style <user_stylesheet>', 'user stylesheet URL or path')
    .option('-d, --single-doc', 'single HTML document input')
    .option(
      '-p, --press-ready',
      `make generated PDF compatible with press ready PDF/X-1a [false]
This option is equivalent with "--preflight press-ready"`,
    )
    .option(
      '-t, --timeout <seconds>',
      `timeout limit for waiting Vivliostyle process [120]`,
      validateTimeoutFlag,
    )
    .option('-T, --theme <theme...>', 'theme path or package name')
    .option('--title <title>', 'title')
    .option('--author <author>', 'author')
    .option('-l, --language <language>', 'language')
    .addOption(
      new Option(
        '--reading-progression <direction>',
        'Direction of reading progression',
      ).choices(['ltr', 'rtl']),
    )
    .addOption(
      new Option(
        '--render-mode <mode>',
        'if docker is set, Vivliostyle try to render PDF on Docker container [local]',
      ).choices(['local', 'docker']),
    )
    .addOption(
      new Option(
        '--preflight <mode>',
        'apply the process to generate PDF for printing',
      ).choices(['press-ready', 'press-ready-local']),
    )
    .option(
      '--preflight-option <options...>',
      `options for preflight process (ex: gray-scale, enforce-outline)
Please refer the document of press-ready for further information.
https://github.com/vibranthq/press-ready`,
    )
    .addOption(new Option('--sandbox', `launch chrome with sandbox`).hideHelp())
    .addOption(
      new Option('--no-sandbox', `launch chrome without sandbox`).hideHelp(),
    )
    .option(
      '--executable-browser <path>',
      'specify a path of executable browser you installed',
    )
    .option('--image <image>', 'specify a docker image to render')
    .option(
      '--viewer <URL>',
      `specify a URL of displaying viewer instead of vivliostyle-cli's one
It is useful that using own viewer that has staging features. (ex: https://vivliostyle.vercel.app/)`,
    )
    .option(
      '--viewer-param <parameters>',
      `specify viewer parameters. (ex: "allowScripts=false&pixelRatio=16")`,
    )
    // Hide --browser option for now. There's no choice other than Chromium.
    //     .addOption(
    //       new commander.Option(
    //         '--browser <browser>',
    //         `Specify a browser type to launch Vivliostyle viewer [chromium]
    // Currently, Firefox and Webkit support preview command only!`,
    //       ).choices(['chromium', 'firefox', 'webkit']),
    //     )
    .addOption(
      new Option(
        '--proxy-server <proxyServer>',
        `HTTP/SOCK proxy server url for underlying Playwright`,
      ),
    )
    .addOption(
      new Option(
        '--proxy-bypass <proxyBypass>',
        `optional comma-separated domains to bypass proxy`,
      ),
    )
    .addOption(
      new Option(
        '--proxy-user <proxyUser>',
        `optional username for HTTP proxy authentication`,
      ),
    )
    .addOption(
      new Option(
        '--proxy-pass <proxyPass>',
        `optional password for HTTP proxy authentication`,
      ),
    )
    .addOption(
      new Option(
        '--log-level <level>',
        'specify a log level of console outputs',
      )
        .choices(['silent', 'info', 'verbose', 'debug'])
        .default('info'),
    )
    .addOption(
      new Option(
        '--ignore-https-errors',
        `true to ignore HTTPS errors when Playwright browser opens a new page`,
      ),
    )
    .option('--no-enable-static-serve', 'disable static file serving')
    // TODO: Remove it in the next major version up
    .addOption(new Option('--executable-chromium <path>').hideHelp())
    .addOption(new Option('--verbose').hideHelp())
    .addOption(new Option('--http').hideHelp())
    .action((_arg, option) => {
      let invalid = targets.find((it) => !('path' in it));
      if (invalid) {
        // -f is an optional option but -o is required one
        throw new Error(
          `Couldn't find the output option corresponding --format ${invalid.format} option. Please check the command options.`,
        );
      }
      option.output = targets;
    });

  return program;
}

function validateTimeoutFlag(val: string) {
  return Number.isFinite(+val) && +val > 0 ? +val * 1000 : undefined;
}
