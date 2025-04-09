import { URL } from 'node:url';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

import { SourceMapConsumer } from 'source-map';
import { logger, StackFrame } from '@sentry/core';

import { PREFIX } from './prefix';
import { tryCatch } from './utils/tryCatch';

export async function symbolicateFrames({
  frames,
  projectRootPath = process.cwd(),
  serverPublicPath = path.join(projectRootPath, 'dist'),
}: {
  frames: StackFrame[],
  projectRootPath?: string,
  serverPublicPath?: string,
}) {
  const symbolicatedFrames: StackFrame[] = [];

  for (const frame of frames) {
    const { lineno, colno, filename } = frame;
    if (!lineno || !colno) {
      logger.warn(`${PREFIX} Frame ${filename} has a lineno ${lineno} or colno ${colno}`);
      symbolicatedFrames.push(frame);
      continue;
    }

    const filepath = lynxUrlToPath(filename);
    if (!filepath) {
      logger.warn(`${PREFIX} Frame ${filename} does not have a valid filepath.`);
      symbolicatedFrames.push(frame);
      continue;
    }

    const resolvedPath = path.resolve(serverPublicPath, filepath);
    const { data: fileContents, error } = await tryCatch(() => fs.promises.readFile(resolvedPath, 'utf8'));
    if (error) {
      logger.warn(`${PREFIX} Failed to read file ${filepath}: ${error}`);
      symbolicatedFrames.push(frame);
      continue;
    }

    const sourceMapUrl = extractSourceMapUrl(filepath, fileContents);
    if (!sourceMapUrl) {
      logger.warn(`${PREFIX} No source map url found in ${filepath}`);
      symbolicatedFrames.push(frame);
      continue;
    }

    const sourceMapPath = urlToPath(sourceMapUrl)?.slice(1); // remove leading '/';;
    if (!sourceMapPath) {
      logger.warn(`${PREFIX} Source map url ${sourceMapUrl} is not a valid path`);
      symbolicatedFrames.push(frame);
      continue;
    }

    const resolvedSourceMapPath = path.resolve(serverPublicPath, sourceMapPath);
    const { data: sourceMapContents, error: sourceMapError } = await tryCatch(() => fs.promises.readFile(resolvedSourceMapPath, 'utf8'));
    if (sourceMapError) {
      logger.warn(`${PREFIX} Failed to read source map ${sourceMapPath}: ${sourceMapError}`);
      symbolicatedFrames.push(frame);
      continue;
    }

    const sourceMap = await new SourceMapConsumer(sourceMapContents);
    const originalLine = sourceMap.originalPositionFor({
      line: lineno,
      column: colno,
    });

    const originalSourcePath = originalLine.source ? urlToPath(originalLine.source) : undefined;
    const relativeSourcePath = originalSourcePath && path.isAbsolute(originalSourcePath)
      ? path.relative(projectRootPath, originalSourcePath)
      : undefined;

    symbolicatedFrames.push({
      ...frame,
      filename: relativeSourcePath || originalSourcePath,
      lineno: originalLine.line || undefined,
      colno: originalLine.column || undefined,
    });
  }

  return symbolicatedFrames;
}

export function lynxUrlToPath(filename: string | undefined): string | undefined {
  if (!filename) {
    return undefined;
  }

  if (!filename.startsWith('file://')) {
    logger.warn(`${PREFIX} Filename ${filename} does not start with file://`);
  }

  return urlToPath(filename)?.slice(1); // remove leading '/';
}

export function urlToPath(filename: string | undefined): string | undefined {
  if (!filename) {
    return undefined;
  }

  const { data: url, error } = tryCatch(() => new URL(filename));
  if (error) {
    logger.warn(`${PREFIX} Filename ${filename} is not a valid URL`);
    return filename;
  }

  return url.pathname;
}

// https://github.com/lynx-family/lynx/blob/c9ba416cd90ef6d04565385a399dc245e616cced/devtool/lynx_devtool/resources/lynx-logbox/src/utils/getSourceMap.ts#L69
function extractSourceMapUrl(_fileUri: string, fileContents: string): string | undefined {
  const regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
  let match: RegExpExecArray | null = null;
  for (;;) {
    let next = regex.exec(fileContents);
    if (next == null) {
      break;
    }
    match = next;
  }
  if (!(match && match[1])) {
    return undefined;
  }
  return match[1].toString();
}
