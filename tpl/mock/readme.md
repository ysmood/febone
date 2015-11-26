## 假数据

使用 `http://127.0.0.1:${port}` 访问本地mock服务。 port 的配置在项目根目录下的 `nofile.js` 文件。

在 [mock/index.js](mock/index.js) 文件中配置 mock 数据，里面已有一些完整示例。
`mock/index.js` 文件是唯一入口点，其它的 example 文件重命名成 `index.js` 就可以演示示例。
这个文件夹默认是被 git ignore 的，因为每个人在调试的时候 mock 数据都可能不同，你可以运行 `git add --force`
强制让其被版本跟踪。

更多具体用法参考 [noflow](https://github.com/ysmood/noflow) 的 api.


#### 域名代理服务

脚手架还提供了域名代理的服务。

在本地开发时，我们经常通过修改 host 文件或者使用 fiddler 等方式代理域名，实现更真实地模拟线上开发的目的。

脚手架在启动的时候，默认开启了 pac 代理服务，在 `nofile.js` 文件中，pacPort、devHost、ethernet 等参数就是用来配置 pac 服务的。

可以通过 http://127.0.0.1:${pacPort}/pac 查看 pac 配置的具体内容。

[关于 pac](https://en.wikipedia.org/wiki/Proxy_auto-config)

如果使用了 VPN， pac 服务可能会失效。这时可以使用我们提供的一个 chrome 插件来实现目标。

[插件地址](https://chrome.google.com/webstore/detail/troy/pbpkpnapjoaafhdnjjnnanmdbkngpnjf?utm_source=chrome-ntp-icon)
