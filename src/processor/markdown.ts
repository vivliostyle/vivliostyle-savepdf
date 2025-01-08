import {
  Metadata,
  readMetadata,
  StringifyMarkdownOptions,
} from '@vivliostyle/vfm';
import fs from 'node:fs';
import vfile, { VFile } from 'vfile';
import { DocumentProcessorFactory } from '../config/resolve.js';

export interface VSFile extends VFile {
  data: {
    title?: string;
    theme?: string;
  };
}

function safeReadMetadata(content: string): Metadata {
  // The input assumes VFM format, but errors during metadata extraction
  // should be suppressed to allow processing of non-VFM files as well.
  try {
    return readMetadata(content);
  } catch {
    return {};
  }
}

export async function processMarkdown(
  documentProcessorFactory: DocumentProcessorFactory,
  filepath: string,
  options: StringifyMarkdownOptions = {},
): Promise<VSFile> {
  const markdownString = fs.readFileSync(filepath, 'utf8');
  const processor = documentProcessorFactory(
    options,
    safeReadMetadata(markdownString),
  );
  const processed = (await processor.process(
    vfile({ path: filepath, contents: markdownString }),
  )) as VSFile;
  return processed;
}

export function readMarkdownMetadata(filepath: string): Metadata {
  return safeReadMetadata(fs.readFileSync(filepath, 'utf8'));
}
