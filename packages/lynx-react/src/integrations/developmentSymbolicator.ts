import { Integration, logger, StackFrame } from '@sentry/core';
import { getFetch } from '../utils/fetch';
import { getLynx } from '../environment';

const NAME = 'DevelopmentSymbolicator';
const PREFIX = `[${NAME}]`;

export function developmentSymbolicatorIntegration(): Integration {
  return {
    name: NAME,
    processEvent: async (event) => {
      if (event.type !== undefined) {
        // Not an error event
        return null;
      }

      for (const exception of event.exception?.values ?? []) {
        await symbolicateFrames(exception.stacktrace?.frames);
      }

      for (const thread of event.threads?.values ?? []) {
        await symbolicateFrames(thread.stacktrace?.frames);
      }

      return event;
    },
  };
}

async function symbolicateFrames(frames: StackFrame[] | undefined): Promise<StackFrame[] | undefined> {
  if (!frames) {
    return undefined;
  }

  if (frames.length === 0) {
    return frames;
  }

  try {
    const fetch = getFetch();
    if (!fetch) {
      logger.warn('No fetch implementation found');
      return frames;
    }

    logger.debug(`${PREFIX} Symbolicating ${frames.length} frames.`);
    const response = await fetch('http://localhost:3000/__sentry__/symbolicate', {
      method: 'POST',
      body: JSON.stringify({ frames }),
    });

    const data = await response.json();
    return data.frames;
  } catch (error) {
    logger.error('Error symbolicating frames', error);
    return frames;
  }
}

function getDevelopmentServerUrl(): string | undefined {
  const lynx = getLynx();
  if (!lynx) {
    return undefined;
  }

  const sourceName = lynx.getApp?.()?._params?.srcName;
  if (!sourceName) {
    return undefined;
  }

  return parseUrlFromSourceName(sourceName);
}


/**
 * SourceName example: http://192.168.0.94:3000/main.lynx.bundle?fullscreen=true
 */
function parseUrlFromSourceName(sourceName: string): undefined | string {
  const match = sourceName.match(/@http:\/\/([^\/]+)/);
  return match ? match[1] : undefined;
}