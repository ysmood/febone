这是快速开始文档，详细文档见 [book.md](book.md)。

## 调试服务

`node_modules/.bin/no`

### 查看命令行帮助

`node_modules/.bin/no --help`



### 路由和入口文件

测试服务的路由规则是 `/:name.html` 对应 `src/page/:name.js`，这里访问的 `:name.html` 是一一对应的。
比如启动服务后访问示例的 `http://127.0.0.1:8080/demo.html` 页面，这里的 `demo` 对应的就是 `src/page/demo.js`。

你可以在 `src/page` 文件夹里创建新的 `js` 文件，项目会自动为它生成对应的路由。


### 预览效果

0. 非常容易执行 `node_modules/.bin/no --cdnPrefix '.' build`
0. 用浏览器直接打开编译好的 html 页面，如 `dist/demo.html`



### 编译和自动刷新

当你修改源代码时，源文件会被自动编译，浏览器会自动刷新。当浏览器没有及时呈现改动时，请在命令行检查下是否有语法和风格错误提示。
