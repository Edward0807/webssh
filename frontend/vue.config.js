const path = require('path');
const proxyTarget = 'http://127.0.0.1:8888';
const wsTarget = proxyTarget.replace('http', 'ws');

module.exports = {
  publicPath: '/',
  outputDir: '../public',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1,

  devServer: {
    disableHostCheck: false,
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8257,
    https: false,
    hotOnly: false,
    open: true,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/ws': {
        target: wsTarget,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/ws': ''
        }
      }
    }
  },

  configureWebpack: (config) => {
    config.performance = {
      hints: false
    };

    // 生产环境优化配置
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 512000,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          automaticNameDelimiter: '-',
          cacheGroups: {
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial'
            },
            elementUI: {
              name: 'chunk-elementUI',
              priority: 20,
              test: /[\\/]node_modules[\\/]element-ui[\\/]/
            },
            common: {
              name: 'chunk-common',
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true
            }
          }
        }
      };

      //  Gzip 压缩
      try {
        const CompressionPlugin = require('compression-webpack-plugin');
        config.plugins.push(
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
          })
        );
      } catch (e) {
        console.warn('compression-webpack-plugin 未安装，跳过 Gzip 压缩');
      }
    }
  },

  chainWebpack: (config) => {
    config.plugins.delete('prefetch');

    // 拷贝 public/img 到 ../public/static/img
    config.plugin('copy').tap(() => {
      return [
        [
          {
            from: path.resolve(__dirname, 'public/img'),
            to: path.resolve(__dirname, '../public/static/img')
          }
        ]
      ];
    });

    // 生产环境不生成 source map
    if (process.env.NODE_ENV === 'production') {
      config.devtool(false);
    }
  }
};
