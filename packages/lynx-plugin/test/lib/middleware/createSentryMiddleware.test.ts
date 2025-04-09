

import { describe, expect, it, vi } from 'vitest';
import { createSentrySymbolicatorMiddleware, noopMiddleware, SENTRY_SYMBOLICATE_ENDPOINT } from '../../../src/middleware';
import { logger } from '@sentry/core';
import { IncomingMessage } from 'http';
import { ServerResponse } from 'node:http';
import * as rawBodyUtils from '../../../src/utils/getRawBody';
import * as symbolicator from '../../../src/symbolicator';

describe('createSentryMiddleware', () => {
  it('returns a noop middleware if no root is provided', async () => {
    const middleware = createSentrySymbolicatorMiddleware({});
    expect(middleware).toEqual(noopMiddleware);
  });

  it('warns if no root is provided', async () => {
    const warnSpy = vi.spyOn(logger, 'warn');
    createSentrySymbolicatorMiddleware({});
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No project root path provided. Symbolication will not work.'));
  });

  it('middleware ignore non sentry requests', async () => {
    const middleware = createSentrySymbolicatorMiddleware({
      root: '/path/to/project',
    });

    const req = {
      url: '/unknown',
    } as unknown as IncomingMessage;
    const res = {} as unknown as ServerResponse;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('middleware processes symbolicate request', async () => {
    vi.spyOn(rawBodyUtils, 'getRawBody').mockResolvedValueOnce(JSON.stringify({ frames: [
      {
        filename: 'main.mjs',
        lineno: 1,
        colno: 1,
      },
    ] }));
    vi.spyOn(symbolicator, 'symbolicateFrames').mockResolvedValueOnce([
      {
        filename: 'main.ts',
        lineno: 2,
        colno: 2,
      },
    ]);
    const middleware = createSentrySymbolicatorMiddleware({
      root: '/path/to/project',
      output: {
        distPath: {
          root: 'dist',
        },
      },
    });

    const req = {
      url: SENTRY_SYMBOLICATE_ENDPOINT,
    } as unknown as IncomingMessage;
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(symbolicator.symbolicateFrames).toHaveBeenCalledWith({
      frames: [{ filename: 'main.mjs', lineno: 1, colno: 1 }],
      projectRootPath: '/path/to/project',
      serverPublicPath: '/path/to/project/dist',
    });
  });

  it('middleware processes symbolicate request with absolute paths in config', async () => {
    vi.spyOn(rawBodyUtils, 'getRawBody').mockResolvedValueOnce(JSON.stringify({ frames: [] }));
    vi.spyOn(symbolicator, 'symbolicateFrames').mockResolvedValueOnce([]);
    const middleware = createSentrySymbolicatorMiddleware({
      root: '/path/to/project',
      output: {
        distPath: {
          root: '/path/to/dist',
        },
      },
    });

    const req = {
      url: SENTRY_SYMBOLICATE_ENDPOINT,
    } as unknown as IncomingMessage;
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(symbolicator.symbolicateFrames).toHaveBeenCalledWith({
      frames: [],
      projectRootPath: '/path/to/project',
      serverPublicPath: '/path/to/dist',
    });
  });

  it('returns internal server error on process request error', async () => {
    vi.spyOn(rawBodyUtils, 'getRawBody').mockRejectedValueOnce(new Error('test error'));

    const middleware = createSentrySymbolicatorMiddleware({
      root: '/path/to/project',
    });

    const req = {
      url: SENTRY_SYMBOLICATE_ENDPOINT,
    } as unknown as IncomingMessage;
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.setHeader).toHaveBeenCalledTimes(1);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith('{ "error": "Internal Server Error" }');
  });
});
