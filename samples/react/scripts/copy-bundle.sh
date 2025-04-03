#!/bin/bash

# Define source and destination paths
SOURCE_BUNDLE="./dist/main.lynx.bundle"
ANDROID_DEST_DIR="./android/app/src/main/assets"
ANDROID_DEST="$ANDROID_DEST_DIR/main.lynx.bundle"
IOS_DEST="./ios/main.lynx.bundle"

# Check if source file exists
if [ ! -f "$SOURCE_BUNDLE" ]; then
  echo "Error: Source bundle not found at $SOURCE_BUNDLE"
  exit 1
fi

if [ ! -d "$(dirname "$IOS_DEST")" ]; then
  echo "Error: iOS destination directory not found at $(dirname "$IOS_DEST")"
  exit 1
fi

# Copy the bundle to Android assets
mkdir -p "$ANDROID_DEST_DIR"
cp "$SOURCE_BUNDLE" "$ANDROID_DEST"
echo "✅ Copied bundle to Android: $ANDROID_DEST"

# Copy the bundle to iOS project
cp "$SOURCE_BUNDLE" "$IOS_DEST"
echo "✅ Copied bundle to iOS: $IOS_DEST"

echo "Bundle copy completed!"