# <b>Webpack In Vanilla Javascript Repository<b>

## webpack.config.js

```javascript
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
    devtool: env.build === "prod" ? undefined : "source-map",
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
        }
      }),
    ],
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
```

<br />

## mode

`'production': 'none' | 'development' | 'production???`

---

<br />

## devtool

devtool?????? ???????????? ???????????? ????????? ??? .map????????? ????????? ??????????????? ?????? ????????? ?????? ??? ???????????? ??????????????????. ?????? ???????????? ???????????? ?????? ????????? ???????????? ???????????? ????????? ?????? ????????????.

> ??????! <br />
> ???????????? ?????? ??? ???????????? ???????????????. ?????? ?????? ??????(????????? ???????????? ????????? ????????? ?????????)

---

<br />

## path vs publicPath

### `output.path`

Webpack bundling output ?????? ?????? ??????

> Example <br /> 
> `output.path = path.join(__dirname, "build/")` <br />
> Webpack??? bundling output??? `localdisk/path-to-your-project/build/` ??? ????????????.

### `output.publicPath`

Browser?????? ????????? ??? bundling output??? ???????????? ?????? ????????? ??????, webpack ????????? ??? ????????? ?????? URL??? publicPath??? ????????? re-written??????.

> Example <br />
> `Server URL = http://server/` <br /> 
> `output.publicPath = "/assets/"` <br />
> src="picture.jpg"??Re-writes ?????src="/assets/picture.jpg" <br />
> Accessed by: (`http://server/assets/picture.jpg`) <br />

---

<br />

## Loader

Loader??? Webpack??? ???????????? ??? Javacript ????????? ?????? ?????? ??????????????? ????????? ??? ????????? ????????????.

> Webpack??? ??????????????? Javascript??? JSON ????????? ???????????????. Loader??? ???????????? Webpack??? ?????? ????????? ????????? ???????????????, ????????? ????????? ????????? ???????????? ???????????????????????? ??????????????? ???????????? ???????????? ???????????????.

<br />

### babel-loader

???????????? ?????????????????? ???????????? ?????? ?????????????????? ??????(??????, ?????? ???)??? ???????????????????????? ?????????????????? ???????????? ??????????????? ??????. ???????????? ?????? ????????? .babelrc ???????????? babel ?????? ????????? ??? ??? ??????.

?????? ????????? ?????? <br />
`@babel/core`: babel??? ?????? ?????? <br />
`@babel/preset-env`: babel plugin ????????? ????????????????????? ???????????? plugin?????? ??????????????????.

<br />

### Asset Modules

??? ????????????????????? HTML, CSS, Javascript??? ????????? ?????????, ??????, ????????? ??? ????????? ????????? ????????????. ?????? ????????? ????????? ????????? ???????????? ????????? ?????? ??????(?????????, ??????, ????????? ???)??? ????????? ??? ????????? ????????? ????????????.

`asset/resource` <br />
????????? ????????? ???????????? URL??? ????????????. ???????????? `file-loader`??? ???????????? ????????? ??? ?????????.

`asset/inline` <br />
????????? data URI??? ????????????. ???????????? `url-loader`??? ???????????? ????????? ??? ?????????.

`asset/source` <br />
????????? ?????? ????????? ????????????. ???????????? `raw-loader`??? ???????????? ????????? ??? ?????????.

`asset` <br />
data URI??? ????????? ?????? ???????????? ????????? ???????????? ????????????, ???????????? ?????? ?????? ????????? ?????? `url-loader`??? ???????????? ????????? ??? ?????????.

<br />

### style-loader

css-loader??? ?????? ?????? ????????? ????????? ????????? ???????????? html `<style>`?????? ????????????.

<br />

### css-loader

css ????????? js????????? ????????????????????? js ????????? ??????

<br />

### sass-loader

CSS ????????? ????????? ???????????? ?????? Loader, scss ??? css??? ??????????????????

?????? ????????? ?????? <br />
`sass`

> ??????! <br />
> use??? ?????? ????????? ???????????? ??????????????? sass-loader ??? css-loader ??? style-loader ????????? ???????????? ??????. <br />
> ???, [???style-loader???, ???css-loader???, ???sass-loader???]

---

<br />

## Plugin

### html-webpack-plugin

- Webpack ????????? ???????????? HTML5 ????????? ??????(`template` ?????? ????????? html ?????? ??????)
- Webpack ????????? `<script>` ???????????? ???????????????.
- Webpack ????????? ???????????? ?????? ?????? ??????, ????????? HTML??? ????????`<script>`??????????? ??????
- webpack ????????? CSS ????????? ?????????([MiniCssExtractPlugin](https://webpack.kr/plugins/mini-css-extract-plugin/)?????? ????????? CSS ??? ??????) ????????? ????????? HTML ???????????`<head>`???????? ????????`<link>`??????????? ??????

<br />

### clean-webpack-plugin

- Webpack ?????? ??? `output.path`??? ????????? ??????????????? ?????? ????????? ??? ?????? ??????

<br />

### mini-css-extract-plugin

- ?????? ????????? CSS??? ????????? ????????? ??????
- Javascript?????? ??? CSS????????? ?????? ??? On-Demand-Loading of CSS

<br />

style-loader vs mini-css-extract-plugin

- style-loader??? ?????????????????? ??????
  - hmr????????? ????????? ????????? ?????? ????????? html `<header>` ?????? `<style>` ????????? ???????????? ?????? ???????????? ???????????? ??????????????? ????????? ??? ?????????.
- mini-css-extract-plugin??? ?????????????????? ??????
  - ?????? ????????? ??????????????? ?????? css????????? ??????????????? ??? ???????????????.

<br />

### copy-webpack-plugin

- ?????? ?????? ??????????????? ????????? ?????? ????????? ???????????????. (?????????, ?????? ??????)

<br />

### uglifyjs-webpack-plugin

- javascript ?????????, ?????? ????????? ??????, ??????????????? ????????????!

<br />

### webpack.DefinePlugin

- ?????? ????????? ?????? ?????? ????????? ????????? ????????????.
- ???????????? ????????? ????????? ???????????? ???????????? ????????? ?????????. ?????????, ??????????????? ??????????????? ?????? ??????????????? ????????????.

---

<br />

## resolve

### resolve.extensions

- ?????? import ??? ???????????? ?????? ????????? ??????????????? ????????? ????????????.

<br />

### resolve.alias

- ?????? ????????? ??????(alias)??? ????????? ?????? import ??? full path ?????? ????????? ????????? ??? ??????.

---

<br />

## webpack ?????? ?????? ??? ????????????

**`webpack-merge`** ?????????????????? ????????? config ????????? ????????? ??? ??????.

---

<br />

## ??????????????? publicPath???, ??????????????? publicPath??? ?????? ??????

webpack devServer??? devMiddleware??? ????????????!

`output.publicPath = ???/wslee94/webpack/???` <br />
`devServer.devMiddleware.publicPath = ???/wslee94/webpack/???` <br />
`devServer.devMiddleware.writeToDisk = true`

?????? ????????? ?????? ????????????, ??????????????? publicPath??? ???????????? ??? ??????.
