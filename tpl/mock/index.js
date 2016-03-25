/**
 * 这只是个示例文件，不会被版本跟踪
 *
 * 最简单的示例，参考 simple-example.js 文件
 *
 * 一般的 mock 示例，参考 mock-exmaple.js 文件
 *
 * 认证示例，参考 auth-example.js 文件
 */

var defaultRoutes = require('mx-fe-bone-kit/lib/default-routes');

module.exports = (app, opts) => {
    // 默认路由方式，包括页面路由、图标和静态文件的路由
    defaultRoutes(app, opts);
};