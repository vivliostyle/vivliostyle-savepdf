import './mocks/fs.js';

import { vol } from 'memfs';
import { beforeEach, expect, it, vi } from 'vitest';
import { resolveFixture, runCommand } from './command-util.js';

const fs = await vi.importActual<typeof import('node:fs')>('node:fs');

beforeEach(() => vol.reset());

it('test the init command', async () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  await runCommand(['init'], { cwd: '/tmp/dir', logLevel: 'info' });
  expect(logSpy).toHaveBeenLastCalledWith(
    'Successfully created vivliostyle.config.js',
  );
  expect(vol.existsSync('/tmp/dir/vivliostyle.config.js')).toBe(true);

  await runCommand(['init'], { cwd: '/tmp/dir', logLevel: 'info' });
  expect(logSpy).toHaveBeenLastCalledWith(
    'vivliostyle.config.js already exists. aborting.',
  );
});

it('test the init command with long option', async () => {
  await runCommand(
    [
      'init',
      '--title',
      'Sample Document',
      '--author',
      'Author Name <author@example.com>',
      '--language',
      'en',
      '--size',
      'A5',
      '--theme',
      'style.css',
    ],
    { cwd: '/tmp/long' },
  );
  expect(vol.existsSync('/tmp/long/vivliostyle.config.js')).toBe(true);

  // Change file extension and load Common JS
  const tmpConfigPath = resolveFixture('.vs-init-config-long.cjs');
  fs.writeFileSync(
    tmpConfigPath,
    vol.readFileSync('/tmp/long/vivliostyle.config.js'),
    'utf8',
  );
  const { default: config } = await import(tmpConfigPath);
  expect(config.title).toBe('Sample Document');
  expect(config.author).toBe('Author Name <author@example.com>');
  expect(config.language).toBe('en');
  expect(config.size).toBe('A5');
  expect(config.theme).toBe('style.css');
});

it('test the init command with short option', async () => {
  await runCommand(
    [
      'init',
      '--title',
      'Sample Document2',
      '--author',
      'Author Name2 <author@example.com>',
      '-l',
      'jp',
      '-s',
      'A3',
      '-T',
      'theme.css',
    ],
    { cwd: '/tmp/short' },
  );
  expect(vol.existsSync('/tmp/short/vivliostyle.config.js')).toBe(true);

  // Change file extension and load Common JS
  const tmpConfigPath = resolveFixture('.vs-init-config-short.cjs');
  fs.writeFileSync(
    tmpConfigPath,
    vol.readFileSync('/tmp/short/vivliostyle.config.js'),
    'utf8',
  );
  const { default: config } = await import(tmpConfigPath);
  expect(config.title).toBe('Sample Document2');
  expect(config.author).toBe('Author Name2 <author@example.com>');
  expect(config.language).toBe('jp');
  expect(config.size).toBe('A3');
  expect(config.theme).toBe('theme.css');
});
