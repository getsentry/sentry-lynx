import { StackFrame } from '@sentry/core';

export function symbolicateFrames(frames: StackFrame[]) {
  return frames.map((frame) => {
    return {
      ...frame,
    };
  });
}
