import * as path  from 'node:path';
import * as fs from 'node:fs';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { symbolicateFrames } from '../../../src/symbolicator';

// Can't be in place, as it will get recognized by the test runner as a source map
const SOURCE_MAP_URL_KEY = 'sourceMappingURL';

const TMP_FIXTURES_PATH = path.resolve(__dirname, '../tmp');

describe('symbolicateFrames', () => {
  describe('', () => {
    beforeEach(async () => {
      await fs.promises.mkdir(`${TMP_FIXTURES_PATH}/bundle/dist/assets`, { recursive: true });
      await fs.promises.mkdir(`${TMP_FIXTURES_PATH}/bundle/src`, { recursive: true });

      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs`, `function throwError() {
    throw new Error('test');
}
throwError();
//# ${SOURCE_MAP_URL_KEY}=http://localhost:3000/assets/main.mjs.map
`, { encoding: 'utf-8' });

      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs.map`, `
{
  "version": 3,
  "file": "main.mjs",
  "sources": [
    "file://${path.join(TMP_FIXTURES_PATH, 'bundle/src/main.ts')}"
  ],
  "sourcesContent": [
    "\\nfunction throwError() {\\n  throw new Error('test');\\n}\\n\\nthrowError();\\n"
  ],
  "names": [],
  "mappings": "AACA,SAAS,UAAU,GAAA;AACjB,IAAA,MAAM,IAAI,KAAK,CAAC,MAAM,CAAC;AACzB;AAEA,UAAU,EAAE"
}
`, { encoding: 'utf-8' });

      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/src/main.ts`, `
function throwError() {
  throw new Error('test');
}

throwError();
`, { encoding: 'utf-8' });

    });

    afterEach(async () => {
      await fs.promises.rm(TMP_FIXTURES_PATH, { recursive: true, force: true });
    });

    it('should return the symbolicated frames', async () => {
      const symbolicatedFrames = await symbolicateFrames({
        frames: [
          {
            filename: 'file://view2/assets/main.mjs',
            lineno: 2,
            colno: 20,
          },
        ],
        projectRootPath: path.join(TMP_FIXTURES_PATH, 'bundle'),
        serverPublicPath: path.join(TMP_FIXTURES_PATH, 'bundle/dist'),
      });

      expect(symbolicatedFrames).toEqual([
        {
          filename: 'src/main.ts',
          lineno: 3,
          colno: 18,
        },
      ]);
    });
  })
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