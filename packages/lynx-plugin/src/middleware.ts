import { ServerResponse } from 'node:http';
import { IncomingMessage } from 'node:http';
import * as path from 'node:path';
import { symbolicateFrames } from './symbolicator';
import { logger } from '@sentry/core';
import { PREFIX } from './prefix';
import { tryCatch } from './utils/tryCatch';
import { RsbuildConfig } from '@rsbuild/core';

export type NextFunction = () => void;

export const createSentryMiddleware = (config: RsbuildConfig) => {
  if (!config.root) {
    logger.warn(`${PREFIX} No project root path provided. Symbolication will not work.`);
    return noopMiddleware;
  }

  const projectRootPath = config.root
  const serverPublicPath = path.join(projectRootPath, config.output?.distPath?.root ?? '');

  return async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    if (req.url === '/__sentry__/symbolicate') {
      try {
        await processSymbolicateRequest({ req, res, projectRootPath, serverPublicPath });
      } catch (error) {
        logger.error(`${PREFIX} Error processing symbolicate request: ${error}`);
        res.statusCode = 500;
        res.end('{ "error": "Internal Server Error" }');
      }
    } else {
      next();
    }
  };
}

const noopMiddleware = (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
  next();
};

async function processSymbolicateRequest({
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
  const { data, error } = tryCatch(() => JSON.parse(body));
  if (error) {
    logger.error(`${PREFIX} Error parsing symbolicate request: ${error}`);
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

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ frames: symbolicatedFrames }));
}

function getRawBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    });
    request.on('end', () => {
      resolve(data);
    });
    request.on('error', reject);
  });
}
