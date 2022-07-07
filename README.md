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

`'production': 'none' | 'development' | 'production’`

---

<br />

## devtool

devtool에서 소스맵을 지정하면 번들링 시 .map이라는 파일이 포함되는데 이는 번들링 했을 때 디버깅을 용이하게한다. 만약 소스맵을 지정하지 않아 압축한 파일에서 디버깅할 생각을 하면 끔찍하다.

> 주의! <br />
> 운영환경 배포 시 소스맵은 제외시킨다. 코드 보안 목적(개발자 도구에서 코드가 그대로 노출됨)

---

<br />

## path vs publicPath

### `output.path`

Webpack bundling output 저장 경로 지정

> Example <br /> 
> `output.path = path.join(__dirname, "build/")` <br />
> Webpack은 bundling output을 `localdisk/path-to-your-project/build/` 에 저장한다.

### `output.publicPath`

Browser에서 실행될 때 bundling output에 접근하기 위한 경로를 지정, webpack 번들링 중 만나는 모든 URL에 publicPath가 붙어서 re-written된다.

> Example <br />
> `Server URL = http://server/` <br /> 
> `output.publicPath = "/assets/"` <br />
> src="picture.jpg" Re-writes ➡ src="/assets/picture.jpg" <br />
> Accessed by: (`http://server/assets/picture.jpg`) <br />

---

<br />

## Loader

Loader는 Webpack이 번들링할 때 Javacript 파일이 아닌 다른 리소스들을 변환할 수 있도록 도와준다.

> Webpack은 기본적으로 Javascript와 JSON 파일만 이해합니다. Loader를 사용하면 Webpack이 다른 유형의 파일을 처리하거나, 그들을 유효한 모듈로 변환하여 애플리케이션에서 사용하거나 디펜던시 그래프에 추가합니다.

<br />

### babel-loader

구버전의 브라우저에서 지원하지 않는 자바스크립트 코드(문법, 객체 등)를 트랜스파일링하여 구버전에서도 문제없이 돌아가도록 한다. 프로젝트 루트 경로에 .babelrc 파일에서 babel 관련 설정을 할 수 있다.

관련 의존성 모듈 <br />
`@babel/core`: babel의 핵심 기능 <br />
`@babel/preset-env`: babel plugin 번들로 트랜스파일링에 사용되는 plugin들이 포함되어있다.

<br />

### Asset Modules

웹 애플리케이션은 HTML, CSS, Javascript와 더불어 아이콘, 사진, 비디오 등 다양한 에셋을 추가한다. 애셋 모듈은 로더를 추가로 구성하지 않아도 애셋 파일(이미지, 폰트, 아이콘 등)을 사용할 수 있도록 해주는 모듈이다.

`asset/resource` <br />
별도의 파일을 내보내고 URL을 추출한다. 이전에는 `file-loader`를 사용하여 처리할 수 있었다.

`asset/inline` <br />
애샛의 data URI를 내보낸다. 이전에는 `url-loader`를 사용하여 처리할 수 있었다.

`asset/source` <br />
애샛의 소스 코드를 내보낸다. 이전에는 `raw-loader`를 사용하여 처리할 수 있었다.

`asset` <br />
data URI와 별도의 파일 내보내기 중에서 자동으로 선택한다, 이전에는 애샛 크기 제한이 있는 `url-loader`를 사용하여 처리할 수 있었다.

<br />

### style-loader

css-loader를 통해 웹팩 의존성 트리에 추가된 문자열을 html `<style>`안에 넣어준다.

<br />

### css-loader

css 파일을 js파일에 포함시키기위해 js 코드로 변경

<br />

### sass-loader

CSS 전처리 도구를 사용하기 위한 Loader, scss → css로 트랜스파일링

관련 의존성 모듈 <br />
`sass`

> 주의! <br />
> use의 배열 실행은 역순으로 진행하므로 sass-loader → css-loader → style-loader 순으로 적용되야 한다. <br />
> 즉, [’style-loader’, ‘css-loader’, ‘sass-loader’]

---

<br />

## Plugin

### html-webpack-plugin

- Webpack 번들을 포함하는 HTML5 파일을 생성(`template` 으로 지정한 html 파일 기준)
- Webpack 번들을 `<script>` 태그안에 포함시킨다.
- Webpack 엔트리 포인트가 여러 개인 경우, 생성된 HTML에 모두 `<script>` 태그로 포함
- webpack 출력에 CSS 애셋이 있다면([MiniCssExtractPlugin](https://webpack.kr/plugins/mini-css-extract-plugin/)으로 추출된 CSS 와 같이) 이들은 생성된 HTML 파일의 `<head>` 요소 안에 `<link>` 태그로 포함

<br />

### clean-webpack-plugin

- Webpack 실행 시 `output.path`로 지정한 디렉터리를 모두 삭제한 후 번들 수행

<br />

### mini-css-extract-plugin

- 번들 결과에 CSS를 별도의 파일로 추출
- Javascript파일 당 CSS파일을 생성 → On-Demand-Loading of CSS

<br />

style-loader vs mini-css-extract-plugin

- style-loader는 개발환경에서 사용
  - hmr에서는 캐시가 의미가 없기 때문에 html `<header>` 내부 `<style>` 태그를 이용하는 것이 네트워크 트래픽을 발생시키지 않아서 더 빠르다.
- mini-css-extract-plugin은 운영환경에서 사용
  - 캐시 기능을 이용하기에 별도 css파일로 관리하는게 더 효율적이다.

<br />

### copy-webpack-plugin

- 파일 혹은 디렉터리를 복사해 빌드 경로에 붙혀넣는다. (이미지, 폰트 파일)

<br />

### uglifyjs-webpack-plugin

- javascript 난독화, 압축 파일로 빌드, 운영환경에 적용하자!

<br />

### webpack.DefinePlugin

- 빌드 시점에 전역 상수 변수를 초기화 시켜준다.
- 빌드되는 공간과 파일을 내려받아 실행되는 공간은 다르다. 따라서, 환경변수를 사용하려면 해당 플러그인을 사용한다.

---

<br />

## resolve

### resolve.extensions

- 모듈 import 시 생략하고 싶은 파일의 확장자명을 배열로 입력한다.

<br />

### resolve.alias

- 파일 경로의 별칭(alias)을 지정해 모듈 import 시 full path 대신 별칭을 사용할 수 있다.

---

<br />

## webpack 실행 환경 별 분리하기

**`webpack-merge`** 라이브러리를 이용해 config 파일을 분리할 수 있다.

---

<br />

## 배포환경의 publicPath와, 로컬환경의 publicPath가 다를 경우

webpack devServer의 devMiddleware를 이용하자!

`output.publicPath = ‘/wslee94/webpack/’` <br />
`devServer.devMiddleware.publicPath = ‘/wslee94/webpack/’` <br />
`devServer.devMiddleware.writeToDisk = true`

위의 코드를 통해 배포환경, 로컬환경의 publicPath를 통일시킬 수 있다.
