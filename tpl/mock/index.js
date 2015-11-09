/**
 * 这只是个示例文件，不会被版本跟踪
 *
 * 认证示例，参考auth-example.js文件
 */

import defaultRoutes from 'mx-fe-bone-kit/lib/default-routes';

export default (app, opts) => {
    // 默认路由方式，包括页面路由、图标和静态文件的路由
    defaultRoutes(app, opts);
};