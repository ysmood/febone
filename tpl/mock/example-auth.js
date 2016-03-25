/**
 * 这只是个示例文件，不会被版本跟踪
 *
 * - 本示例适用场景条件
 *
 *   1.  线上域名已经代理到 mock 服务了。（这个可以用一些代理工具实现，脚手架可以自动实现，参考 nofile 配置情况）
 *
 *   1.  想要一部分请求直接获取线上（也可以是测试机等）的接口和数据。
 *
 *   2.  项目有类似 cookie 认证等的接口。
 *
 *
 * - 示例逻辑说明：
 *
 * ```
 * 请求经过mock 服务 （也就是到了这个服务)，经历如下的流程
 *
 *         ->  验证中间件 （示例的第一中间件）
 *
 *         ->  默认路由方式
 *
 *         ->  mock 一些接口，让这些接口不走线上
 *
 *         ->  剩余流量代理到线上
 *
 * ```
 *
 * - 其他说明
 *
 *     1. 有几个辅助函数，如select，match等的具体含义可以参考[nokit](https://github.com/ysmood/nokit)
 *
 *     2. app中间件方式，参考[noflow](https://github.com/ysmood/noflow)
 */

var kit = require('nokit');
var defaultRoutes = require('mx-fe-bone-kit/lib/default-routes');
var proxy = kit.require('proxy');
var match = proxy.match;
var select = proxy.select;

/**
 * @param  app  app 是中间件容器，已经监听了端口。
 * @param  opts 是输入参数，具体默认值和使用参考../nofile.js的一堆option
 */
module.exports = (app, opts) => {
    // 权限校验中间件，``在最前面``，防止出现请求接口返回没有权限的情况
    // 例如 sso auth，校验 cookie 中是否含有字段 skmtutc
    // 没有的话建议跳转到登录页面，如示例中，流量直接走线上，没有登录自然会被重定向到登录页面。
    app.push(($) => {
        var cookie = $.req.headers.cookie;
        if (/skmtutc/.test(cookie)) {
            return $.next();
        } else {
            return proxy.url(`${opts.devHost}`)($);
        }
    });

    // 默认路由方式，包括页面路由、图标和静态文件的路由
    defaultRoutes(app, opts);

    // 在这里 mock 一些接口，让一些数据接口不走线上
    app.push(
        // 示例 01
        // select函数第一参数是用来匹配请求，第二个参数是处理的中间件
        select(match('/api/increase/:num'), ($) => {
            $.body = +$.url.num + 1;
        }),

        // 示例 02
        select('/api/readme', kit.readFile('readme.md'))
    );

    // 这里把剩余的流量导到了线上去请求，也可以不这么做
    app.push(
        // 剩余流量走线上域名，最后一个中间件，所以会接收剩余的全部流量
        proxy.url(`${opts.devHost}`)
    );
};