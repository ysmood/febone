// 这只是个示例文件，不会被版本跟踪

import kit from 'nokit';
import defaultRoutes from 'mx-fe-bone-kit/lib/default-routes';

// 文档 https://www.npmjs.com/package/body-parser
import bodyParser from 'body-parser';

var { select, match, midToFlow } = kit.require('proxy');

module.exports = (app, opts) => {
    // 默认路由方式，包括页面路由、图标和静态文件的路由
    defaultRoutes(app, opts);

    // mock
    app.push(
        // 把 express 的中间件转换成 noflow 的中间件
        midToFlow(bodyParser.urlencoded()),

        // 获取 post 直接返回
        select(match('/api/num'), ($) => {
            $.body = $.req.body;
        })
    );
};