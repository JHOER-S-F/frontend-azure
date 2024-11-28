const webpack = require('webpack');
const path = require('path');

// URL del backend en producción
const backendURL = 'https://jhoer-soccerbook-cmcre0g5ffd5augt.eastus2-01.azurewebsites.net';

module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_API_URL': JSON.stringify(backendURL),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // Suprime advertencia de hidratación
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  devServer: {
    port: 8080,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: backendURL,
        changeOrigin: true,
      },
    },
  },
  lintOnSave: false,
  productionSourceMap: false,
  outputDir: 'dist',
  assetsDir: 'static',
};
