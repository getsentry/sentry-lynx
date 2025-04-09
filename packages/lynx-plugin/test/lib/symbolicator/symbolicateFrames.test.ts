import * as path  from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { symbolicateFrames } from '../../../src/symbolicator';

describe('symbolicateFrames', () => {
  it('should return the symbolicated frames', async () => {
    const symbolicatedFrames = await symbolicateFrames({
      frames: [
        {
          filename: 'file://view2/bundle/dist/main.mjs',
          lineno: 2,
          colno: 20,
        },
      ],
      projectRootPath: path.resolve(__dirname, '../fixtures'),
    });

    expect(symbolicatedFrames).toEqual([
      {
        filename: '/User/dev/project/src/main.ts',
        lineno: 3,
        colno: 18,
      },
    ]);
  });
});

// [
//   {
//     filename: "file://view2/.rspeedy/main/background.js",
//     function: "publishEvent",
//     in_app: true,
//     lineno: 16926,
//     colno: 27,
//     debug_id: "1c3f1d3b-5435-4e18-889b-beafdd35e68e",
//   },
//   {
//     filename: "file://view2/.rspeedy/main/background.js",
//     function: "onTap",
//     in_app: true,
//     lineno: 19058,
//     colno: 124,
//     debug_id: "1c3f1d3b-5435-4e18-889b-beafdd35e68e",
//   },
// ]