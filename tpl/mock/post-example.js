// 这只是个示例文件，不会被版本跟踪

import kit from 'nokit';
import defaultRoutes from 'mx-fe-bone-kit/lib/default-routes';
let { body, select, match } = kit.require('proxy');

export default (app, opts) => {
    // 默认路由方式，包括页面路由、图标和静态文件的路由
    defaultRoutes(app, opts);

    // mock
    app.push(
        // 将 post body 的 buffer 保存到 $.reqBody
        body(),

        // 获取 json 的 post 数据，并直接返回
        select(match('/api/num'), ($) => {
            $.body = JSON.parse($.reqBody + '');
        })
    );
};