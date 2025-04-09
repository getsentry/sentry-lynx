import { ServerResponse } from 'node:http';
import { IncomingMessage } from 'node:http';
import * as path from 'node:path';
import { symbolicateFrames } from './symbolicator';
import { logger } from '@sentry/core';
import { PREFIX } from './prefix';
import { tryCatch } from './utils/tryCatch';
import { RsbuildConfig } from '@rsbuild/core';
import { getRawBody } from './utils/getRawBody';

export const SENTRY_SYMBOLICATE_ENDPOINT = '/__sentry__/symbolicate';

export type NextFunction = () => void;

export const createSentrySymbolicatorMiddleware = (config: RsbuildConfig) => {
  if (!config.root) {
    logger.warn(`${PREFIX} No project root path provided. Symbolication will not work.`);
    return noopMiddleware;
  }

  const projectRootPath = config.root
  const distPath = config.output?.distPath?.root ?? './'
  const serverPublicPath = path.isAbsolute(distPath)
    ? distPath
    : path.join(projectRootPath, distPath);

  return async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    if (req.url?.startsWith(SENTRY_SYMBOLICATE_ENDPOINT)) {
      try {
        await processSymbolicateRequest({ req, res, projectRootPath, serverPublicPath });
      } catch (error) {
        logger.error(`${PREFIX} Error processing symbolicate request: ${error}`);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end('{ "error": "Internal Server Error" }');
      }
    } else {
      next();
    }
  };
}

export const noopMiddleware = (_req: IncomingMessage, _res: ServerResponse, next: NextFunction) => {
  next();
};

export async function processSymbolicateRequest({
  req,
  res,
  projectRootPath,
  serverPublicPath,
}: {
  req: IncomingMessage,
  res: ServerResponse,
  projectRootPath?: string,
  serverPublicPath?: string,
}) {
  const body = await getRawBody(req);
  res.setHeader('Content-Type', 'application/json');

  const { data, error } = tryCatch(() => JSON.parse(body));
  if (error) {
    logger.error(`${PREFIX} Error parsing symbolicate request body: ${body}\nerror: ${error}`);
    res.statusCode = 400;
    res.end('{ "error": "Bad Request" }');
    return;
  }

  logger.debug(`${PREFIX} Symbolicating ${data.frames.length} frames.`);
  const { data: symbolicatedFrames, error: symbolicationError } = await tryCatch(() => symbolicateFrames({
    frames: data.frames,
    projectRootPath,
    serverPublicPath,
  }));
  if (symbolicationError) {
    logger.error(`${PREFIX} Error symbolicating frames: ${symbolicationError}`);
    res.statusCode = 500;
    res.end('{ "error": "Internal Server Error" }');
    return;
  }

  res.end(JSON.stringify({ frames: symbolicatedFrames }));
}
