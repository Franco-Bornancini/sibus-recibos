const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new JavaScriptObfuscator(
          {
            rotateStringArray: true,
            stringArray: true,
            stringArrayEncoding: ['rc4'], // mejor seguridad
            stringArrayThreshold: 0.75,   // porcentaje de strings a ofuscar
            compact: true
          },
          ['excluded_bundle_name.js'] // excluye bundles si hace falta
        )
      );
      return webpackConfig;
    }
  }
};