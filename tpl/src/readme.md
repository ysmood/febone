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

注意只有被标识了 `__CDN__` 的文件才会从 `src` 文件夹编译到 `dist` 文件夹。


## 引用资源的路径

对应关系是：网址 `/` 对应本地目录 `src`。例如本地文件 `src/img/favicon.ico`，引用方式如下：

```html
<img src="/img/favicon.ico?__CDN__" alt="" />
```
