# Sentry Lynx Production Sample for iOS, Android and Web

This repository contains a sample application demonstrating how to use Sentry Lynx with React for iOS, Android, and Web platforms.

## Prerequisites

- [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)
- A Sentry account with an auth token
- For mobile development: appropriate iOS/Android development environment

## Installation

Install the dependencies:

```bash
yarn install
```

## Configuration

1. In `lynx.config.ts`, configure your Sentry organization and project:

```ts
org: 'sentry-sdks',
project: 'sentry-lynx',
authToken: process.env.SENTRY_AUTH_TOKEN,
```

2. Set up your Sentry authentication token:

```bash
export SENTRY_AUTH_TOKEN=<your-sentry-auth-token>
```

## Building the Application

Build the Lynx bundle (this will copy it to the `android` and `ios` directories):

```bash
yarn build
```

## Running the Application

### Mobile

- **iOS**: Open the iOS project in Xcode and run the app on your device or simulator
- **Android**: Open the Android project in Android Studio and run the app on your device or emulator

### Web

Navigate to the web directory and start the development server:

```bash
cd web
yarn dev
```
