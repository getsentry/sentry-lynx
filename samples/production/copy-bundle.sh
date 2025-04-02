#!/bin/bash

# Define source and destination paths
SOURCE_BUNDLE="./dist/example.lynx.bundle"
ANDROID_DEST="./android/KotlinEmptyProject/app/src/main/assets/main.lynx.bundle"
IOS_DEST="./ios/HelloLynxSwift/main.lynx.bundle"

# Check if source file exists
if [ ! -f "$SOURCE_BUNDLE" ]; then
  echo "Error: Source bundle not found at $SOURCE_BUNDLE"
  exit 1
fi

# Create directories if they don't exist
mkdir -p "$(dirname "$ANDROID_DEST")"
mkdir -p "$(dirname "$IOS_DEST")"

# Copy the bundle to Android assets
cp "$SOURCE_BUNDLE" "$ANDROID_DEST"
echo "✅ Copied bundle to Android: $ANDROID_DEST"

# Copy the bundle to iOS project
cp "$SOURCE_BUNDLE" "$IOS_DEST"
echo "✅ Copied bundle to iOS: $IOS_DEST"

echo "Bundle deployment complete!" 
