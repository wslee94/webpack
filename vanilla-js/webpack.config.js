const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = (env) => {
  return {
    mode: env.build === "prod" ? "production" : "development",
    entry: {
      app: "./src/main.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    devtool: env.build === "prod" ? undefined : "eval-cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.scss?$/,
          exclude: /node_module/,
          use: [
            env.build === "prod" ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[name][ext]",
            emit: false,
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        filename: "index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/assets/images",
            to: "assets/images",
            toType: "dir",
          },
        ],
      }),
      new webpack.DefinePlugin({
        "process.env": {
          BUILD_MODE: JSON.stringify(env.build),
        },
      }),
    ],
    resolve: {
      extensions: [".js", ".json"],
    },
    optimization:
      env.build === "prod"
        ? {
            minimizer: [
              new UglifyJsPlugin({
                uglifyOptions: {
                  ie8: true,
                },
              }),
            ],
          }
        : undefined,
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      hot: true,
    },
  };
};
