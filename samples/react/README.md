## Sentry Lynx Production Sample

This is a ReactLynx project bootstrapped with `create-rspeedy`.

## Getting Started

First, install the dependencies:

```bash
npm install
```

In `lynx.config.ts`, configure the org and project:

```ts
org: 'sentry-sdks',
project: 'sentry-lynx',
```

Then, set up your `SENTRY_AUTH_TOKEN` environment variable:

```bash
export SENTRY_AUTH_TOKEN=<your-sentry-auth-token>
```

Run the build:

```bash
npm run build
```

This will build the Lynx bundle and copy it to the `android` and `ios` directories.

Then you can run the Android or iOS app on your phone or the simulator.