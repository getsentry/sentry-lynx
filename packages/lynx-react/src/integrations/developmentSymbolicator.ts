import { Integration, logger, StackFrame } from '@sentry/core';
import { getFetch } from '../utils/fetch';
import { getLynx } from '../environment';

const NAME = 'DevelopmentSymbolicator';
const PREFIX = `[${NAME}]`;
const SYMBOLICATOR_ENDPOINT = '/__sentry__/symbolicate';

export function developmentSymbolicatorIntegration(): Integration {
  return {
    name: NAME,
    processEvent: async (event) => {
      if (event.type !== undefined) {
        // Not an error event
        return event;
      }

      for (const exception of event.exception?.values ?? []) {
        const newFrames = await symbolicateFrames(exception.stacktrace?.frames);
        if (exception.stacktrace) {
          exception.stacktrace.frames = newFrames;
        }
      }

      for (const thread of event.threads?.values ?? []) {
        const newFrames = await symbolicateFrames(thread.stacktrace?.frames);
        if (thread.stacktrace) {
          thread.stacktrace.frames = newFrames;
        }
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

    const developmentServerUrl = getDevelopmentServerUrl();
    if (!developmentServerUrl) {
      logger.warn('No development server url found');
      return frames;
    }

    logger.debug(`${PREFIX} Symbolicating ${frames.length} frames.`);
    const response = await fetch(`${developmentServerUrl}${SYMBOLICATOR_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify({ frames }),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error(`${PREFIX} Error symbolicating frames`, data);
      return frames;
    }

    return data.frames;
  } catch (error) {
    logger.error('Error symbolicating frames', error);
    return frames;
  }
}

/**
 * Returns the development server base url, e.g. http://192.168.0.94:3000
 *
 * Only works in development and on mobile platforms
 */
export function getDevelopmentServerUrl(): string | undefined {
  const lynx = getLynx();
  if (!lynx) {
    return undefined;
  }

  const sourceName = lynx.getApp?.()?._params?.srcName;
  if (typeof sourceName !== 'string') {
    return undefined;
  }

  return parseUrlFromSourceName(sourceName);
}

/**
 * Converts http://192.168.0.94:3000/main.lynx.bundle?fullscreen=true to http://192.168.0.94:3000
 */
export function parseUrlFromSourceName(sourceName: string): undefined | string {
  const url = new URL(sourceName);
  return `${url.protocol}//${url.host}`;
}