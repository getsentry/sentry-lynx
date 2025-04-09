import * as path  from 'node:path';
import * as fs from 'node:fs';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { symbolicateFrames } from '../../../src/symbolicator';

// Can't be in place, as it will get recognized by the test runner as a source map
const SOURCE_MAP_URL_KEY = 'sourceMappingURL';

const TMP_FIXTURES_PATH = path.resolve(__dirname, '../tmp');

describe('symbolicateFrames', () => {
  beforeEach(async () => {
    await fs.promises.mkdir(`${TMP_FIXTURES_PATH}/bundle/dist/assets`, { recursive: true });
    await fs.promises.mkdir(`${TMP_FIXTURES_PATH}/bundle/src`, { recursive: true });
  });

  afterEach(async () => {
    await fs.promises.rm(TMP_FIXTURES_PATH, { recursive: true, force: true });
  });

  describe('all debug files available', () => {
    beforeEach(async () => {
      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs`, MAIN_MJS_FILE_CONTENTS, { encoding: 'utf-8' });
      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs.map`, MAIN_MJS_SOURCE_MAP_CONTENTS, { encoding: 'utf-8' });
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

    it('should pass unchanged properties', async () => {
      const symbolicatedFrames = await symbolicateFrames({
        frames: [
          {
            debug_id: '1c3f1d3b-5435-4e18-889b-beafdd35e68e',
            function: 'throwError',
            in_app: true,
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
          debug_id: '1c3f1d3b-5435-4e18-889b-beafdd35e68e',
          function: 'throwError',
          in_app: true,
          filename: 'src/main.ts',
          lineno: 3,
          colno: 18,
        },
      ]);
    });

    it('should pass through frames without lineno or colno', async () => {
      const symbolicatedFrames = await symbolicateFrames({
        frames: [
          {
            debug_id: '1',
            filename: 'file://view2/assets/main.mjs',
            lineno: 2,
            colno: 20,
          },
          {
            debug_id: '2',
            filename: 'file://view2/assets/main.mjs',
            lineno: 2,
          },
          {
            debug_id: '3',
            filename: 'file://view2/assets/main.mjs',
          },
        ],
        projectRootPath: path.join(TMP_FIXTURES_PATH, 'bundle'),
        serverPublicPath: path.join(TMP_FIXTURES_PATH, 'bundle/dist'),
      });

      expect(symbolicatedFrames).toEqual([
        {
          debug_id: '1',
          filename: 'src/main.ts',
          lineno: 3,
          colno: 18,
        },
        {
          debug_id: '2',
          filename: 'file://view2/assets/main.mjs',
          lineno: 2,
        },
        {
          debug_id: '3',
          filename: 'file://view2/assets/main.mjs',
        },
      ]);
    });

    it('should pass through frames without a filename', async () => {
      const symbolicatedFrames = await symbolicateFrames({
        frames: [
          {
            debug_id: '1',
            lineno: 2,
            colno: 20,
          },
        ],
        projectRootPath: path.join(TMP_FIXTURES_PATH, 'bundle'),
        serverPublicPath: path.join(TMP_FIXTURES_PATH, 'bundle/dist'),
      });

      expect(symbolicatedFrames).toEqual([
        {
          debug_id: '1',
          lineno: 2,
          colno: 20,
        },
      ]);
    });
  });

  describe('source map with relative paths', () => {
    beforeEach(async () => {
      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs`, MAIN_MJS_FILE_CONTENTS, { encoding: 'utf-8' });
      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs.map`, MAIN_MJS_SOURCE_MAP_CONTENTS_WITH_RELATIVE_PATHS, { encoding: 'utf-8' });
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
          filename: '../../src/main.ts',
          lineno: 3,
          colno: 18,
        },
      ]);
    });
  });

  function itShouldPassThroughTheUnsymbolicatedFrame() {
    it('should pass through the unsymbolicated frame', async () => {
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
          filename: 'file://view2/assets/main.mjs',
          lineno: 2,
          colno: 20,
        },
      ]);
    });
  }

  describe('missing bundle file', () => {
    beforeEach(async () => {
      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs.map`, MAIN_MJS_SOURCE_MAP_CONTENTS, { encoding: 'utf-8' });
    });

    itShouldPassThroughTheUnsymbolicatedFrame();
  });

  describe('missing source mapping url in bundle file', () => {
    beforeEach(async () => {
      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs`, MAIN_MJS_FILE_CONTENTS_WITHOUT_SOURCE_MAP_URL, { encoding: 'utf-8' });
      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs.map`, MAIN_MJS_SOURCE_MAP_CONTENTS, { encoding: 'utf-8' });
    });

    itShouldPassThroughTheUnsymbolicatedFrame();
  });

  describe('missing source map file', () => {
    beforeEach(async () => {
      await fs.promises.writeFile(`${TMP_FIXTURES_PATH}/bundle/dist/assets/main.mjs`, MAIN_MJS_FILE_CONTENTS, { encoding: 'utf-8' });
    });

    itShouldPassThroughTheUnsymbolicatedFrame();
  });
});

// Source:
//
// function throwError() {
//   throw new Error('test');
// }
//
// throwError();
//
const MAIN_MJS_FILE_CONTENTS = `function throwError() {
    throw new Error('test');
}
throwError();
//# ${SOURCE_MAP_URL_KEY}=http://localhost:3000/assets/main.mjs.map
`;

const MAIN_MJS_FILE_CONTENTS_WITHOUT_SOURCE_MAP_URL = `function throwError() {
    throw new Error('test');
}
throwError();
`;

const MAIN_MJS_SOURCE_MAP_CONTENTS = `
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
`;

const MAIN_MJS_SOURCE_MAP_CONTENTS_WITH_RELATIVE_PATHS = `
{
  "version": 3,
  "file": "main.mjs",
  "sources": [
    "../../src/main.ts"
  ],
  "sourcesContent": [
    "\\nfunction throwError() {\\n  throw new Error('test');\\n}\\n\\nthrowError();\\n"
  ],
  "names": [],
  "mappings": "AACA,SAAS,UAAU,GAAA;AACjB,IAAA,MAAM,IAAI,KAAK,CAAC,MAAM,CAAC;AACzB;AAEA,UAAU,EAAE"
}
`;
