这个是 mx-fe-bone 的核心库之一。

它的唯一对外接口是 `src/public-config.js`。

## API

整个项目共享一个 options 对象：

```js
{
    cdnPrefix: 'http://demo.com',
    port: '8732',
    pacPort: '58732',
    devHost: 'demo.com',
    ethernet: 'Wi-Fi',
    mock: 'mock/index.js',
    layout: 'src/layout.js',
    dist: 'dist',
    page: 'page',
    src: 'src',
    srcPage: 'src/page',
    favicon: 'src/img/favicon.ico',
    hashMap: 'dist/hash-map.json',
    webpack: 'off',
    pac: 'off',
    liveReload: 'on',
    lang: 'babel'
};
```

如启动开发的服务：

```
import dev from 'mx-fe-bone-kit/lib/dev';

dev();
```