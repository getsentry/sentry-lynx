import { ServerResponse } from 'http';
import { IncomingMessage } from 'http';
import { symbolicateFrames } from './symbolicator';
import { logger } from '@sentry/core';
import { PREFIX } from './prefix';
import { tryCatch } from './utils/tryCatch';

export type NextFunction = () => void;

export const createSentryMiddleware = (
  {
    projectRootPath,
  }: {
    projectRootPath?: string;
  },
) => async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
  if (req.url === '/__sentry__/symbolicate') {
    try {
      await processSymbolicateRequest({ req, res, projectRootPath });
    } catch (error) {
      logger.error(`${PREFIX} Error processing symbolicate request: ${error}`);
      res.statusCode = 500;
      res.end('{ "error": "Internal Server Error" }');
    }
  } else {
    next();
  }
}

async function processSymbolicateRequest({
  req,
  res,
  projectRootPath,
}: {
  req: IncomingMessage,
  res: ServerResponse,
  projectRootPath?: string,
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
  const { data: symbolicatedFrames, error: symbolicationError } = tryCatch(() => symbolicateFrames(data.frames));
  if (symbolicationError) {
    logger.error(`${PREFIX} Error symbolicating frames: ${symbolicationError}`);
    res.statusCode = 500;
    res.end('{ "error": "Internal Server Error" }');
    return;
  }

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
