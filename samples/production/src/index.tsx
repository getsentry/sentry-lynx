import { root } from '@lynx-js/react';
import { App } from './App.js';

// TODO: Sentry.init

root.render(<App />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}


