// craco.config.js
const path = require("path");
const { when } = require("@craco/craco");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    alias: {
      'pdfjs-dist' : path.join(__dirname, './node_modules/pdfjs-dist/legacy/build/pdf'),
      // 'botui' : path.join(__dirname, './node_modules/botui/dist/botui.js'),
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.optimization = {
        runtimeChunk: false,
        splitChunks: {
          chunks(chunk) {
            return false;
          },
        },
      }

      const shouldInstrumentCode = when(process.env.REACT_APP_INSTRUMENT_CODE, () => true);

      if (!shouldInstrumentCode) {
        return webpackConfig;
      }

      webpackConfig.module.rules.push({
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-typescript"],
            plugins: ["istanbul"]
          }
        }
      });
      return webpackConfig;
    }
  },
};
