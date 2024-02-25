const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExposeRuntimeCssAssetsPlugin = require('single-spa-css/ExposeRuntimeCssAssetsPlugin.cjs');

const stylesHeadler = MiniCssExtractPlugin.loader;

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "home";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new ExposeRuntimeCssAssetsPlugin({
        filename: '[name].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [stylesHeadler, 'css-loader'],
        },
        {
          test: /\.(css|sass|scss)$/i,
          use: [
            stylesHeadler,
            'css-loader',
            'resolve-url-loader',
            'sass-loader',
          ],
        },
        {
          type: 'asset',
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
        },
      ],
    },
  });
};
