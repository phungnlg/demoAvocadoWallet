const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const extraNodeModules = require('node-libs-react-native');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        extraNodeModules,
        sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs'], // Add 'cjs' as a source extension
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
