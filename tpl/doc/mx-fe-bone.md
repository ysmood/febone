# mx-fe-bone

每个目录都会有一个 readme 文件，用于说明这个目录文件的做法。

脚手架的职责在于规定了编译过程、目录规范、路由方式等，并不限制项目中使用何种编程开发库、编程框架和模板引擎等工具。
这是一个完全的沙盒系统，不需要也禁止是用任何全局依赖或工具。本项目的全部配置不超过 50 行代码，是高度透明的系统，
任何人都可以通过了解源代码和依赖的文档来完全掌握系统运行的每个细节。所有的配置都是标准的 js，
所以你可以轻松在配置中加入自己的业务逻辑。


# 快速开始

## 调试服务

`node_modules/.bin/no`

### 查看命令行帮助

`node_modules/.bin/no --help`


# 脚手架升级

在项目文件夹执行 `node_modules/.bin/no update-bone`。


＃ 开发

## 路由和入口文件

测试服务的路由规则是 `/:name.html` 对应 `src/page/:name.js`，这里访问的 `:name.html` 是一一对应的。
比如启动服务后访问示例的 `http://127.0.0.1:8080/demo.html` 页面，这里的 `demo` 对应的就是 `src/page/demo.js`。

你可以在 `src/page` 文件夹里创建新的 `js` 文件，项目会自动为它生成对应的路由。


## 预览效果

0. 非常容易执行 `node_modules/.bin/no --cdnPrefix '.' build`
0. 用浏览器直接打开编译好的 html 页面，如 `dist/demo.html`



## 编译和自动刷新

当你修改源代码时，源文件会被自动编译，浏览器会自动刷新。当浏览器没有及时呈现改动时，请在命令行检查下是否有语法和风格错误提示。


## 前端项目目录结构规范

```
目录结构
├── doc                  // 项目详细文档
├── dist                 // build后的文件存放位置，与src的目录结构一致
├── mock                 // mock 相关的东西存放在这里
├── layout               // 脚手架搭建测试页用的模板在这里
├── readme.md            // 项目说明
├── nofile.js            // no 的任务配置
├── pre-deploy.sh        // 线上编译引导脚本
├── package.json         // 项目package信息及依赖的模块信息配置
├── webpack.config.js    // webpack 的配置文件
└── src
    ├── img            // 图片
    ├── page           // 与页面对应的入口文件，加载general中实现的各业务功能
    ├── res            // 资源目录，如 flash 等
    ├── style          // 样式文件目录
    │   ├── base
    │   └── common
    │         └── page
    ├── tpl            // 模板文件
    └── js
        ├── common     // 通用可复用的组件基本功能，与业务无关(复杂功能可在里面再自建目录进行分类)
        ├── conf       // 配置相关
        ├── general    // 与业务有关的组件功能或零碎的功能(复杂功能可在里面再自建目录进行分类)
        ├── lib        // 与业务无关的底层库
        └── util       // 其它各零碎小功能

```


说明：
    目录名及文件名的默认命名规则为字母小写，复合单词用-号分隔的形式，如：dialog.js, alert-dialog.js


## mx-fe-bone 的依赖

## [nokit](https://github.com/ysmood/nokit)

这个项目的核心依赖是 nokit，有任何 API 的疑惑都可以去阅读它的文档，有任何疑问或 bug 请到 Github 提交 issue。

依赖列表可以在 `package.json` 的 `devDependencies` 看到，除了 nokit 以外的依赖主要都是语言编译的库，比如 babel 或 less。换句话说本项目除了编译用的依赖是非常轻量的一个系统，架构很透明都可根据标准的开源项目模式查询文档和源代码。


## [mx-fe-bone-kit](https://github.com/ysmood/mx-fe-bone-kit)

这个是 mx-fe-bone 的核心库之一，主要用于抽象一些常见的业务功能。

## FAQ

- `node_modules/.bin/no` 输入起来太麻烦了。

  > 你可以将 `nokit` 安装到全局： `npm install -g nokit`，你以后就只用输入类似 `no --help` 这样的短名了就行了。
  > 当然你还需要全局安装 babel 来支持 ES7： `npm install -g babel`。

- 我怎么把当前库当成一个 npm package 呢？

  很简单，在 nofile 里把 `src` 的路径改成 `test`，自己创建一个空 `src` 文件夹，然后利用 `babel` 编译 `src` 到 `lib` 即可，
  发布的时候只发布 `lib` 文件夹。


[babel-learn-es2015]: https://babeljs.io/docs/learn-es2015
