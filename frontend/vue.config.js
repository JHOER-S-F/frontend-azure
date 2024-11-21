const webpack = require('webpack');
const path = require('path');

// Definir la URL del backend según el entorno
const backendURL = process.env.NODE_ENV === 'production'
  ? 'https://jhoerprueva3000-d4b8d2fccgfhbbek.canadacentral-01.azurewebsites.net' // URL del backend en producción
  : 'http://localhost:3000'; // URL del backend en desarrollo

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
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false // Suprime advertencia de hidratación
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
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  outputDir: 'dist',
  assetsDir: 'static',
};
