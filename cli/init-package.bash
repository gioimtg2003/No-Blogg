#!/usr/bin/env bash

PKG_NAME=$1

if [ -z "$PKG_NAME" ]; then
  echo "❌  Please provide a package name!"
  echo "👉  Usage: ./create-package.sh config"
  exit 1
fi

PKG_PATH="packages/$PKG_NAME"

# Create package directory
mkdir -p $PKG_PATH

# Initialize package.json
pnpm init -y -C $PKG_PATH

# Log
echo "🎉 Package '$PKG_NAME' has been created at $PKG_PATH"