import { root } from '@lynx-js/react';
import * as Sentry from "@sentry/browser";
import { App } from './App.js';

// Create a wrapper around lynx.fetch to match the expected fetch signature
const fetchWrapper = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Cast the result to Promise<Response> to satisfy TypeScript
  return lynx.fetch(input as RequestInfo, init) as unknown as Promise<Response>;
};

if (__MAIN_THREAD__ && __BACKGROUND__) {
// Use the wrapper instead of lynx.fetch directly
Sentry.WINDOW.fetch = fetchWrapper;

Sentry.init({
  dsn: 'https://e85b375ffb9f43cf8bdf9787768149e0@o447951.ingest.sentry.io/5428562',
  integrations: [Sentry.rewriteFramesIntegration({
    iteratee: (frame) => {
      frame.filename = '/test/main.lynx.bundle'
      frame.abs_path = '/test/main.lynx.bundle'
      return frame;
    }
  })],
  defaultIntegrations: false,
  debug: true,
  release: 'rel124'
});
}


root.render(<App />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}


