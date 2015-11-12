## 脚手架定位

脚手架的职责在于规定了编译过程、目录规范、路由方式等，并不限制项目中使用何种编程开发库、编程框架和模板引擎等工具。
这是一个完全的沙盒系统，不需要也禁止是用任何全局依赖或工具。本项目的全部配置不超过 50 行代码，是高度透明的系统，
任何人都可以通过了解源代码和依赖的文档来完全掌握系统运行的每个细节。所有的配置都是标准的 js，
所以你可以轻松在配置中加入自己的业务逻辑。

## 前端项目目录结构规范

```
目录结构
├── doc                  // 项目详细文档
├── asset                // build后的文件存放位置，与src的目录结构一致
├── mock                 // mock 相关的东西存放在这里
├── page                 // 脚手架搭建测试页用的模板在这里
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


## 编辑和自动重载

系统会自动分析依赖，任何改动都会最高效率的自动重启服务或者更新浏览器内容。
系统只会在开发模式下插入 nokit 自动重载等工具函数到页面，请不用担心页面最后的那个 script 块。

### CommonJS 和 Webpack

我们默认只是用 CommonJS。

系统使用了 webpack 进行打包，加入新的前端依赖请放入 `package.json` 的 `dependencies`，
无需做任何多余操作，正常 `npm install` 后系统会自动编译打包新的依赖。

当然你也可以按需配置 `webpack.config.js` 来完成其他特殊需求。比如想加入 source map 的支持，
在文件中加入如下一行代码即可：

```
config.devtool = '#eval';
```


## 开发语言

默认情况下，语言的最高支持与 babel 的语言最高支持一致。目前是 ES3 到 ES7。我们强制规定语言的版本，
根据项目选择合适的 ES 规范即可。
脚手架会将其编译成能在 IE8>= 运行的代码，无需担心兼容性问题。

### 代码样式规范检测 ESLint

系统只会在发布模式时检测语法和风格，风格不通过是不会发布成功的，可以在发布前运行 `node_modules/.bin/no lint`，
根据命令行的提示修正风格。
详细的规范见 [ESLint Rules](http://eslint.org/docs/rules/)。

如果你想配置规范请修改 `package.json` 中的 `eslintConfig` 部分。


### 关于 polyfill

一些 ES6、ES7 语言特性的实现，需要 `polyfill`，开发者在打包的时候，需要在入口 js 文件添加依赖。

例如使用 `async` 语法，在入口 js 文件，加入如下引用：

```js
import from "babel-runtime/regenerator";
```

也可以偷懒直接引用全部的 polyfill

```js
import from "babel/polyfill"
```

但是引入的文件会稍大，需要考量具体业务场景。

了解 ES6、ES7 语言特性在 babel 编译时，哪些需要使用 polyfill，可以查看网站 [babel-learn-es2015](babel-learn-es2015)




## 如何使用模板

默认我们不是用任何三方库，直接使用 ES6 的原生模板。当然你也可使用任何其他的模版系统，
加一两行代码到 webpack 配置自己安装一个三方的即可。

例如创建一个模板文件 `home.js`：

```js
// 巧妙的使用一个返回字符串的函数就够了
export default (list) => `
<html>
    <ul>
        ${list.reduce(
            (out, el) => out + `<li>${el}</li>`,
            ''
        )}
    </ul>
</html>
`;
```

我们调用 `home.js`:

```js
import home from './home';

console.log(home(['a', 'b']));
```

它会输出：

```
<html>
    <ul>
        <li>a</li>
        <li>b</li>
    </ul>
</html>

```




## 样式文件引用

样式文件格式支持：less

在 js 文件中引用样式文件的方式

```js
import from "style_file_path.less"
```

如同引用普通的js文件

注意：

- 一定要有文件后缀名 `.less`
- 引入的 less 会被编译成 css
- 引用的样式文件会被编译成一段 js 代码
- 样式文件最终会以 style 标签的形式插入到 dom 中



## CDN 使用方式

如果要对资源使用 CDN，在资源的字符串后面使用标识 `__CDN__`，例如：

```js
"/img/favicon.ico?__CDN__"
```

注意只有被标识了 `__CDN__` 的文件才会从 `src` 文件夹编译到 `asset` 文件夹。


## 引用资源的路径

对应关系是：网址 `/` 对应本地目录 `src`。例如本地文件 `src/img/favicon.ico`，引用方式如下：

```html
<img src="/img/favicon.ico?__CDN__" alt="" />
```



## 假数据

在 [mock/index.js](mock/index.js) 文件中配置 mock 数据，里面已有一些完整示例。
这个文件夹默认是被 git ignore 的，因为每个人在调试的时候 mock 数据都可能不同，你可以运行 `git add --force`
强制让其被版本跟踪。

在返回列表里配置类似如下的代码：

```js
select(match('/api/increase/:num'), (ctx) => {
    ctx.body = +ctx.url.num + 1;
})
```

- select 的第一个参数用来匹配请求，第二个参数作为处理请求的中间件。
- 本地开发时，mock 默认是开启的。

更多具体用法参考 [noflow](https://github.com/ysmood/noflow) 的 api.

### 代理服务

本系统给出了一个代理示例 [mock/proxy-server.js](mock/proxy-server.js) 。
代理常用于调试移动设备和 virtual host 相关的调试。
用法类似 [Fiddler](http://www.telerik.com/fiddler)，但是更灵活强大。





## mx-fe-bone 的依赖

### [nokit](https://github.com/ysmood/nokit)

这个项目的核心依赖是 nokit，有任何 API 的疑惑都可以去阅读它的文档，有任何疑问或 bug 请到 Github 提交 issue。

依赖列表可以在 `package.json` 的 `devDependencies` 看到，除了 nokit 以外的依赖主要都是语言编译的库，比如 babel 或 less。换句话说本项目除了编译用的依赖是非常轻量的一个系统，架构很透明都可根据标准的开源项目模式查询文档和源代码。


### [mx-fe-bone-kit](https://github.com/ysmood/mx-fe-bone-kit)

这个是 mx-fe-bone 的核心库之一，主要用于抽象一些常见的业务功能。


## 数据 mock 服务

脚手架提供了数据 mock 服务。本地 mock 数据服务端口号。本地 mock 服务用于提供 mock 数据的数据服务。在 mock 目录 `index.js` 文件中配置的数据和路由就是针对该服务的。

使用 http://127.0.0.1:${port} 访问本地mock服务。 port 的配置在项目根目录下的 `nofile.js` 文件。

mock 服务的路由框架是 (noflow)[https://github.com/ysmood/noflow]。

具体的例子可以参考 mock 目录下得 auth-example.js 文件。里面提供的一些便捷的API， 如match、select、proxy等，具体用法可以在 [nokit](https://github.com/ysmood/nokit) 项目中查看。


## 域名代理服务

脚手架还提供了域名代理的服务。

在本地开发时，我们经常通过修改 host 文件或者使用 fiddler 等方式代理域名，实现更真实地模拟线上开发的目的。

脚手架在启动的时候，默认开启了 pac 代理服务，在 `nofile.js` 文件中，pacPort、devHost、ethernet等参数就是用来配置 pac 服务的。

可以通过 http://127.0.0.1:${pacPort}/pac 查看 pac 配置的具体内容。

[关于 pac](https://en.wikipedia.org/wiki/Proxy_auto-config)

如果使用了 VPN， pac 服务可能会失效。这时可以使用我们提供的一个 chrome 插件来实现目标。

[插件地址](https://chrome.google.com/webstore/detail/troy/pbpkpnapjoaafhdnjjnnanmdbkngpnjf?utm_source=chrome-ntp-icon)

## FAQ

- `node_modules/.bin/no` 输入起来太麻烦了。

  > 你可以将 `nokit` 安装到全局： `npm install -g nokit`，你以后就只用输入类似 `no --help` 这样的短命了就行了。
  > 当然你还需要全局安装 babel 来支持 ES7： `npm install -g babel`。


[babel-learn-es2015]: https://babeljs.io/docs/learn-es2015
