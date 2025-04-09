<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280" height="84">
  </a>
</p>

_Bad software is everywhere, and we're tired of it. Sentry is on a mission to help developers write better software faster, so we can get back to enjoying technology. If you want to join us [<kbd>**Check out our open positions**</kbd>](https://sentry.io/careers/)_

# Sentry SDK for Lynx

The Sentry SDK for [Lynx](https://lynxjs.org/) is a crash reporting and error monitoring solution specifically designed for Lynx applications. This SDK is currently under active development and has not been officially released yet. Stay tuned for the official release. In the meantime, you can follow the development progress and contribute to the project on GitHub.

## 🚧 Features (in-development)

- Automatic JS Error Tracking (using [@sentry/browser](https://github.com/getsentry/sentry-javascript))
- Automatic Native Crash Error Tracking (using [sentry-cocoa](https://github.com/getsentry/sentry-cocoa) & [sentry-android](https://github.com/getsentry/sentry-java) under the hood)
- Offline storage of events
- On Device symbolication for JS (in Debug)

## 🚧 Installation and Usage (in-development)

To install the package and setup your project:

```sh
npm install --save @sentry/lynx-react
```

How to use it:

```javascript
import * as Sentry from "@sentry/lynx-react";

Sentry.init({
  dsn: "__DSN__",
});

Sentry.setTag("myTag", "tag-value");
Sentry.setContext("myContext", {"key": "value"});
Sentry.addBreadcrumb({ message: "test" });

Sentry.captureMessage("Hello Sentry!");
```

To get readable errors and uploaded source maps add:

```javascript
// lynx.config.ts
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginSentryLynx } from '@sentry/lynx-react/plugin';

export default defineConfig({
  plugins: [
    // ... other plugins
    pluginSentryLynx({
      org: 'your-sentry-organization-slug',
      project: 'your-sentry-project-slug',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  output: {
    sourceMap: {
      js: 'source-map',
    },
  },
});
```

Build Lynx for release with source maps:

```bash
# DEBUG='*' will ensure source maps are generated (and not deleted), so they can be uploaded to Sentry
DEBUG='*' rspeedy build
```

## Resources

- 🚧 [![Documentation](https://img.shields.io/badge/documentation-sentry.io-green.svg)](https://docs.sentry.io/platforms/lynx/)
- [![Discussions](https://img.shields.io/github/discussions/getsentry/sentry-react-native.svg)](https://github.com/getsentry/sentry-lynx/discussions)
- [![Discord Chat](https://img.shields.io/discord/621778831602221064?logo=discord&logoColor=ffffff&color=7389D8)](https://discord.gg/PXa5Apfe7K)
- [![Stack Overflow](https://img.shields.io/badge/stack%20overflow-sentry-green.svg)](http://stackoverflow.com/questions/tagged/sentry)
- [![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-sentry-green.svg)](https://github.com/getsentry/.github/blob/main/CODE_OF_CONDUCT.md)
- [![Twitter Follow](https://img.shields.io/twitter/follow/getsentry?label=getsentry&style=social)](https://twitter.com/intent/follow?screen_name=getsentry)
