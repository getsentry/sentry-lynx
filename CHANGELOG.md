# Changelog

## 0.1.0-preview.2

### Various fixes & improvements

- deps: Bump Sentry Javascript from `9.10.1` to `10.4.0` (#33) by @buenaflor
- chore(deps): Bump vite from 6.2.6 to 6.3.4 (#30) by @dependabot
- chore(deps): Bump form-data from 4.0.2 to 4.0.4 (#31) by @dependabot
- chore(deps): Bump vite from 6.2.4 to 6.2.6 (#29) by @dependabot
- Enable registry target in `.craft.yml` (#27) by @buenaflor

## 0.1.0-preview.1

### Changes

- Update the SDK name to `sentry.javascript.lynx.react` ([#26](https://github.com/getsentry/sentry-lynx/pull/26))

## 0.1.0-preview.0

Initial preview release of the Sentry Lynx SDK. This release focuses on error monitoring
of the background JavaScript thread of Lynx React mobile applications.

To get started, install the `@sentry/lynx-react` package in your project.
Then add the Sentry Lynx Plugin to upload source maps and see readable stacktraces in Sentry.

```js
// App.tsx
import * as Sentry from '@sentry/lynx-react';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
});
```

```js
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

To build the app with source maps, run:

```bash
# DEBUG='*' will ensure source maps are generated (and not deleted), so they can be uploaded to Sentry
DEBUG='*' rspeedy build
```

### Features

- Automatic upload of background thread source maps when building the app ([#8](https://github.com/getsentry/sentry-lynx/pull/8))
- Automatic report caught unhandled errors in the background thread to Sentry ([#18](https://github.com/getsentry/sentry-lynx/pull/18))
- Local symbolication of background thread stacktraces in debug mode ([#24](https://github.com/getsentry/sentry-lynx/pull/24))
- API for manually reporting errors with `Sentry.captureException` ([#21](https://github.com/getsentry/sentry-lynx/pull/21))

### Support

If you encounter any bugs or have feature requests, please:

- Open an issue at https://github.com/getsentry/sentry-lynx/issues
- Join the discussion on [Sentry Discord](https://discord.gg/sentry)
