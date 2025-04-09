import { describe, it, expect, vi, beforeEach } from 'vitest';
import { developmentSymbolicatorIntegration } from '../../../../src/integrations/developmentSymbolicator';
import * as environment from '../../../../src/environment';
import { UnsafeLynx } from '@lynx-js/types';
import { Client, Event } from '@sentry/core';
import * as fetchUtils from '../../../../src/utils/fetch';

describe('developmentSymbolicatorIntegration', () => {

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(environment, 'getLynx').mockReturnValue({
      getApp: () => ({
        _params: {
          srcName: 'http://localhost:3000/main.lynx.bundle',
        },
      }),
    } as unknown as UnsafeLynx);
  });

  it('should return frames as is if no fetch implementation is found', async () => {
    vi.spyOn(fetchUtils, 'getFetch').mockReturnValueOnce(undefined);

    const result = await developmentSymbolicatorIntegration().processEvent?.({
      exception: {
        values: [
          {
            stacktrace: {
              frames: getFrames(),
            },
          },
        ],
      },
    }, {}, {} as Client);

    expect(result?.exception?.values?.[0]?.stacktrace?.frames).toEqual(getFrames());
  });

  it('should return frames as is if no development server url is found', async () => {
    vi.spyOn(environment, 'getLynx').mockReturnValueOnce({
      getApp: () => ({
        _params: {},
      }),
    } as unknown as UnsafeLynx);

    const result = await developmentSymbolicatorIntegration().processEvent?.({
      exception: {
        values: [
          {
            stacktrace: {
              frames: getFrames(),
            },
          },
        ],
      },
    }, {}, {} as Client);

    expect(result?.exception?.values?.[0]?.stacktrace?.frames).toEqual(getFrames());
  });

  it('it should pass thru non error events', async () => {
    const result = await developmentSymbolicatorIntegration().processEvent?.(createTransactionEvent(), {}, {} as Client);
    expect(result).toEqual(createTransactionEvent());
  });

  it('should return frames as is if the response is not ok', async () => {
    vi.spyOn(fetchUtils, 'getFetch').mockResolvedValueOnce(vi.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    }));

    const result = await developmentSymbolicatorIntegration().processEvent?.({
      exception: {
        values: [
          {
            stacktrace: {
              frames: getFrames(),
            },
          },
        ],
      },
    }, {}, {} as Client);

    expect(result?.exception?.values?.[0]?.stacktrace?.frames).toEqual(getFrames());
  });

  it('should symbolicate exception frames', async () => {
    vi.spyOn(fetchUtils, 'getFetch').mockReturnValueOnce(vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ frames: getSymbolicatedFrames() }),
    }));

    const result = await developmentSymbolicatorIntegration().processEvent?.({
      exception: {
        values: [
          { stacktrace: { frames: getFrames() } },
        ],
      },
    }, {}, {} as Client);

    expect(result?.exception?.values?.[0]?.stacktrace?.frames).toEqual(getSymbolicatedFrames());
  });

  it('should symbolicate thread frames', async () => {
    vi.spyOn(fetchUtils, 'getFetch').mockReturnValueOnce(vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ frames: getSymbolicatedFrames() }),
    }));

    const result = await developmentSymbolicatorIntegration().processEvent?.({
      threads: {
        values: [
          { stacktrace: { frames: getFrames() } },
        ],
      },
    }, {}, {} as Client);

    expect(result?.threads?.values?.[0]?.stacktrace?.frames).toEqual(getSymbolicatedFrames());
  });

  it('should symbolicate all exceptions frames', async () => {
    vi.spyOn(fetchUtils, 'getFetch').mockReturnValue(vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ frames: getSymbolicatedFrames() }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ frames: getSymbolicatedFramesToo() }),
    }));

    const result = await developmentSymbolicatorIntegration().processEvent?.({
      exception: {
        values: [
          { stacktrace: { frames: getFrames() } },
          { stacktrace: { frames: getFramesToo() } },
        ],
      },
    }, {}, {} as Client);

    expect(result?.exception?.values?.[0]?.stacktrace?.frames).toEqual(getSymbolicatedFrames());
    expect(result?.exception?.values?.[1]?.stacktrace?.frames).toEqual(getSymbolicatedFramesToo());
  });

  it('should symbolicate all threads frames', async () => {
    vi.spyOn(fetchUtils, 'getFetch').mockReturnValue(vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ frames: getSymbolicatedFrames() }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ frames: getSymbolicatedFramesToo() }),
    }));

    const result = await developmentSymbolicatorIntegration().processEvent?.({
      threads: {
        values: [
          { stacktrace: { frames: getFrames() } },
          { stacktrace: { frames: getFramesToo() } },
        ],
      },
    }, {}, {} as Client);

    expect(result?.threads?.values?.[0]?.stacktrace?.frames).toEqual(getSymbolicatedFrames());
    expect(result?.threads?.values?.[1]?.stacktrace?.frames).toEqual(getSymbolicatedFramesToo());
  });
});

function createTransactionEvent(): Event {
  return {
    type: 'transaction',
  };
}

function getFrames() {
  return [
    {
      filename: 'file://view2/.rspeedy/main/background.js',
      function: 'publishEvent',
      in_app: true,
      lineno: 16926,
      colno: 27,
      debug_id: '1c3f1d3b-5435-4e18-889b-beafdd35e68e',
    },
    {
      filename: 'file://view2/.rspeedy/main/background.js',
      function: 'onTap',
      in_app: true,
      lineno: 19058,
      colno: 124,
      debug_id: '1c3f1d3b-5435-4e18-889b-beafdd35e68e',
    },
  ];
}

function getSymbolicatedFrames() {
  return [
    {
      filename: 'node_modules/@lynx-js/react/runtime/lib/lynx/tt.js',
      function: 'publishEvent',
      in_app: true,
      lineno: 189,
      colno: 12,
      debug_id: '1c3f1d3b-5435-4e18-889b-beafdd35e68e',
    },
    {
      filename: 'src/App.tsx',
      function: 'onTap',
      in_app: true,
      lineno: 38,
      colno: 37,
      debug_id: '1c3f1d3b-5435-4e18-889b-beafdd35e68e',
    },
  ];
}

function getFramesToo() {
  return [
    {
      filename: 'file://view123/.rspeedy/main/background.js',
      function: 'publishEvent',
      in_app: true,
      lineno: 16926,
      colno: 27,
    },
    {
      filename: 'file://view123/.rspeedy/main/background.js',
      function: 'onTap',
      in_app: true,
      lineno: 19058,
      colno: 124,
    },
  ];
}

function getSymbolicatedFramesToo() {
  return [
    {
      filename: 'package/node_modules/@lynx-js/react/runtime/lib/lynx/tt.js',
      function: 'publishEvent',
      in_app: true,
      lineno: 189,
      colno: 12,
    },
    {
      filename: 'package/src/App.tsx',
      function: 'onTap',
      in_app: true,
      lineno: 38,
      colno: 37,
    },
  ];
}
