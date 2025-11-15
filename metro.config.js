const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for 3D model file extensions
config.resolver.assetExts.push(
  'glb',
  'gltf',
  'obj',
  'fbx',
  'vrx',
  'hdr'
);

module.exports = config;

