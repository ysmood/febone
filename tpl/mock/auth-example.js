// 这只是个示例文件，不会被版本跟踪

import kit from 'nokit';
import defaultRoutes from 'mx-fe-bone-kit/lib/default-routes';
let proxy = kit.require('proxy');
let { match, select } = proxy;

/**
 * 有几个辅助函数，如select，match等的具体含义可以参考[nokit](https://github.com/ysmood/nokit)
 * @param  app  app 是中间件容器，已经监听了端口。
 * @param  opts 是输入参数，具体默认值和使用参考../nofile.js的一堆option
 *
 * app中间件方式，参考[noflow](https://github.com/ysmood/noflow)
 */
export default (app, opts) => {
    // sso auth，校验cookie
    app.push(($) => {
        let cookie = $.req.headers.cookie;
        if (/skmtutc/.test(cookie)) {
            return $.next();
        } else {
            return proxy.url(`${opts.devHost}`)($);
        }
    });

    // 默认路由方式，包括页面路由、图标和静态文件的路由
    defaultRoutes(app, opts);

    // mock
    app.push(
        // 示例 01
        // select函数第一参数是用来匹配请求，第二个参数是处理的中间件
        select(match('/api/increase/:num'), (ctx) => {
            ctx.body = +ctx.url.num + 1;
        }),

        // 示例 02
        select('/api/readme', kit.readFile('readme.md'))
    );

    //
    app.push(
        // 剩余流量走线上域名，最后一个中间件，所以会接收剩余的全部流量
        proxy.url(`${opts.devHost}`)
    );
};