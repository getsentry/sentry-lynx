import { StackFrame } from '@sentry/core';

export function symbolicateFrames(frames: StackFrame[]) {
  return frames.map((frame) => {
    return {
      ...frame,
    };
  });
  
  // Use plugin dev server middleware to do the symbolication https://rsbuild.dev/guide/basic/server#register-middlewares
  // the source-map plugin requires wasm 
  // TODO: 1. get the source file for each file from the rawFrames
  // TODO: 2. get the source map for each file from the rawFrames
  // TODO: 3. await new SourceMapConsumer(sm)
  // TODO: 4. get the original line and column number from the source map (https://www.npmjs.com/package/source-map)
  // TODO: 5. map to sentry event stack frame format
}

// https://github.com/lynx-family/lynx/blob/94d6e77ecd378b7772cb214f8754957670bab98b/devtool/lynx_devtool/resources/lynx-logbox/src/parser/btsErrorParser.ts#L11
function resourceNameMapping(name: string): string {
  if (name.indexOf('lynx_core.js') !== -1) {
    return 'core.js';
  }
  const lastSlashIndex: number = name.lastIndexOf('/');
  return name.substring(lastSlashIndex + 1);
}

// https://github.com/lynx-family/lynx/blob/c9ba416cd90ef6d04565385a399dc245e616cced/devtool/lynx_devtool/resources/lynx-logbox/src/utils/getSourceMap.ts#L69
function extractSourceMapUrl(fileUri: string, fileContents: string): string {
  const regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
  let match: RegExpExecArray | null = null;
  for (;;) {
    let next = regex.exec(fileContents);
    if (next == null) {
      break;
    }
    match = next;
  }
  if (!(match && match[1])) {
    // return Promise.reject(`Cannot find a source map directive for ${fileUri}.`);
    return '';
  }
  // return Promise.resolve(match[1].toString());
  return match[1].toString();
}
