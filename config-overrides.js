const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins.push(
      new JavaScriptObfuscator({
        rotateStrings: true,
        stringArray: true,
        stringArrayThreshold: 0.75
      })
    );
  }
  return config;
};