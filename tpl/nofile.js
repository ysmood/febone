var kit = require('nokit');

/**
 * option 收录了 no 命令主要的参数。函数 option 接收三个参数，最后一个是默认值。
 * 例如，启动时修改基础模板页配置：`no --port 12345`.
 *
 * 请阅读每个 option 配置，具体说明几个配置。
 *
 * - port
 *
 * 本地 mock 数据服务端口号。本地 mock 服务用于提供 mock 数据的数据服务。在 mock 目录 index.js
 * 配置的数据和路由就是针对该服务的。使用 127.0.0.1:${port} 访问。
 *
 * - pacPort
 *
 * 用作 PAC 代理的服务器端口号，PAC 代理是指 proxy auto configuration,
 * 其详细含义可以参考： [PAC](https://en.wikipedia.org/wiki/Proxy_auto-config)
 *
 * 在用no命令启动后，可以通过地址 http://127.0.0.1:${pacPort} 查看PAC配置具体内容。
 *
 * - devHost
 *
 * 用于配置PAC方式要代理掉得域名。例如要代理掉本地访问 www.demo.com 地址的数据时，需要配置
 * devHost 为 demo.com。
 *
 * - ethernet
 *
 * 在使用PAC方式代理的时候，需要指定网络配置，默认是WI-FI。命令行输入 networksetup -listallnetworkservices
 * 可以查看安装的网络配置，选择你正在使用的作为配置内容。
 *
 */

module.exports = (task, option) => {
    /*
     * option('参数表达式', '注释', '默认值');
     */
    option('--port <num>', '本地 mock 数据服务端口号', '8732');
    option('--devHost <host>', '线上域名，结合 pac 代理', 'demo.com');
    option('--pacPort <num>', '代理服务器端口', '58732');
    option('--pac <on|off>', '是否动设置全局 pac 代理: on 或 off', 'on');
    option('--ethernet <str>', '网络设置', 'Wi-Fi');

    option('--cdnPrefix <url>', 'CDN 前缀，多个用逗号', 'http://c1.demo.com,http://c2.demo.com');
    option('--mock <path>', 'mock 配置入口', 'mock/index.js');
    option('--vane <on|off>', '是否开启 vane', 'on');
    option('--vaneToken <str>', 'vane mock 的 token', 'mock');
    option('--layout <path>', '页面模板文件夹', 'layout');
    option('--dist <path>', '编译输出文件夹', 'dist');
    option('--page <path>', '页面的编译输出文件夹', 'page');
    option('--src <path>', '源代码所在的文件夹', 'src');
    option('--srcPage <path>', '入口页面源代码所在的文件夹', 'src/page');
    option('--favicon <path>', 'favicon 路径', 'src/img/favicon.ico');
    option('--hashMap <path>', '编译的 hashmap 输出路径', 'dist/hash-map.json');
    option('--preload <path>', '编译出的图片预载器文件路径', 'dist/preload.js');
    option('--hashPath <on|off>', '编译时是否 hash 路径', 'on');
    option('--hashExclude <regex>', '匹配的路径将不被 hash', '$ ^');
    option('--lang <str>', '选择主语言与处理器 js, babel 或 typescript', 'babel');
    option('--webpack <on|off>', '是否开启 webpack', 'on');
    option('--liveReload <on|off>', '是否启动自动刷新页面: on 或 off', 'on');

    task('default dev', ['clean'], '启动调试服务器和 API 代理', require('mx-fe-bone-kit/lib/dev'));

    task('build', ['build-js'], '以产品模式编译项目到 dist 文件夹',
        require('mx-fe-bone-kit/lib/build')
    );

    task('build-js', ['clean'], '编译 js', (opts) => {
        opts.isWebpackProduction = true;
        process.env['mx-fe-bone-opts'] = JSON.stringify(opts);
        return kit.spawn('webpack');
    });

    task('clean', '清理缓存和 build，有任何编译报错都可以先试试它', opts =>
        kit.remove(opts.dist)
    );

    task('lint', '检测代码风格是否符合规范', opts =>
        kit.spawn('eslint', [`${opts.src}/**/*.js`])
    );

    task('pac-off', '关闭 pac 代理配置', require('mx-fe-bone-kit/lib/pac-set').off);

    task('update-bone', '升级脚手架', require('mx-fe-bone-kit/lib/update-bone'));
};