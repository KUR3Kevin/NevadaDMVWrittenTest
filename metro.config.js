const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Zustand's ESM middleware currently contains import.meta.env, which Metro
// leaves in its classic web bundle. Prefer the compatible CommonJS entry.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
