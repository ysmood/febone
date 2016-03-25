// 这只是个示例文件，不会被版本跟踪

import kit from 'nokit';
var proxy = kit.require('proxy');
var select = proxy.select;

/**
 * 有几个辅助函数，如select，match等的具体含义可以参考[nokit](https://github.com/ysmood/nokit)
 * @param  app  app 是中间件容器，已经监听了端口。
 * @param  opts 是输入参数，具体默认值和使用参考../nofile.js的一堆option
 *
 * app中间件方式，参考[noflow](https://github.com/ysmood/noflow)
 */
module.exports = (app) => {
    // mock
    app.push(
        // 示例 02
        select('/abc', ($) => {
            $.body = 'hello world';
        }),

        ($) => {
            $.body = '404';
        }
    );
};