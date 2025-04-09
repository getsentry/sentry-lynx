import { describe, expect, it, vi } from 'vitest';
import { processSymbolicateRequest } from '../../../src/middleware';
import * as rawBodyUtils from '../../../src/utils/getRawBody';
import * as symbolicator from '../../../src/symbolicator';
import { ServerResponse } from 'http';
import { IncomingMessage } from 'http';
import { logger } from '@sentry/core';

describe('processSymbolicateRequest', () => {
  it('throws an error on request error', async () => {
    vi.spyOn(rawBodyUtils, 'getRawBody').mockRejectedValueOnce(new Error('test error'));

    const req = {} as unknown as IncomingMessage;
    const res = {} as unknown as ServerResponse;

    await expect(processSymbolicateRequest({ req, res })).rejects.toThrow('test error');
  });

  it('responds with 400 on invalid JSON', async () => {
    vi.spyOn(rawBodyUtils, 'getRawBody').mockResolvedValueOnce('invalid json');

    const req = {} as unknown as IncomingMessage;
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    await processSymbolicateRequest({ req, res });

    expect(res.statusCode).toBe(400);
    expect(res.setHeader).toHaveBeenCalledTimes(1);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith('{ "error": "Bad Request" }');
  });

  it('error logs on invalid JSON', async () => {
    vi.spyOn(rawBodyUtils, 'getRawBody').mockResolvedValueOnce('invalid json');
    const errorSpy = vi.spyOn(logger, 'error');

    const req = {} as unknown as IncomingMessage;
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    await processSymbolicateRequest({ req, res });

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error parsing symbolicate request body: invalid json'));
  });

  it('responds with 500 on symbolicate error', async () => {
    vi.spyOn(rawBodyUtils, 'getRawBody').mockResolvedValueOnce('{ "frames": [] }');
    vi.spyOn(symbolicator, 'symbolicateFrames').mockRejectedValue(new Error('test error'));

    const req = {} as unknown as IncomingMessage;
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    await processSymbolicateRequest({ req, res });

    expect(res.statusCode).toBe(500);
    expect(res.setHeader).toHaveBeenCalledTimes(1);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith('{ "error": "Internal Server Error" }');
  });

  it('error logs on symbolicate error', async () => {
    vi.spyOn(rawBodyUtils, 'getRawBody').mockResolvedValueOnce('{ "frames": [] }');
    vi.spyOn(symbolicator, 'symbolicateFrames').mockRejectedValue(new Error('test error'));
    const errorSpy = vi.spyOn(logger, 'error');

    const req = {} as unknown as IncomingMessage;
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    await processSymbolicateRequest({ req, res });

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error symbolicating frames: Error: test error'));
  });

  it('returns the symbolicated frames', async () => {
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

    const req = {} as unknown as IncomingMessage;
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    await processSymbolicateRequest({ req, res });

    expect(res.setHeader).toHaveBeenCalledTimes(1);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({
      frames: [
        {
          filename: 'main.ts',
          lineno: 2,
          colno: 2,
        },
      ],
    }));
  });
});
