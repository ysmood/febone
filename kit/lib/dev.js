var kit = require('nokit');
var defaultOpts = require('./default-opts');
var autoUpdate = require('./auto-update');
var Webpack = require('webpack');
var proxy = kit.require('proxy');
var _ = kit._;

function runWebpack (opts) {
    var defer = kit.Deferred();

    var webpackConfig = require(
        kit.path.join(process.cwd(), 'webpack.config.js')
    );
    var webpack = Webpack(webpackConfig);

    if (opts.webpackWatchPoll !== 'off')
        var poll = +opts.webpackWatchPol

    webpack.watch({
        poll,
        aggregateTimeout: 10
    }, function (err, stats) {
        console.log(stats.toString({
            colors: true,

            hash: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: false,
            cached: false,
            reasons: false,
            source: false,
            errorDetails: true,
            chunkOrigins: false
        }));

        defer.resolve();
    });

    return defer.promise;
}

/**
 * 启动调试服务
 * @param  {Object} opts 见 `src/default-opts.js` 文件
 * @return {Function} stop 用于关闭服务
 */
module.exports = kit.async(function * (opts) {
    if (!opts) opts = {};

    opts = _.defaults(opts, defaultOpts);

    yield autoUpdate();

    // Get sudo permission
    if (opts.pac === 'on')
        yield kit.spawn('sudo', ['-p', '请输入 sudo 密码: ', '-v']);

    process.env['febone-opts'] = JSON.stringify(opts);

    if (opts.webpack === 'on') {
        yield runWebpack(opts);
    }

    var watchReceiver = proxy.flow();
    yield watchReceiver.listen(0);
    var monitor = kit.monitorApp({
        args: [require.resolve('./dev-server'), opts],
        onWatchFiles: function () {},
        opts: {
            env: _.extend({}, process.env, {
                nokitMonitorAppPort: watchReceiver.server.address().port
            })
        },
        watchList: [opts.layout + '**/*.js']
    });

    watchReceiver.push(proxy.body(), $ => monitor.watch($.reqBody + ''));

    function stop () {
        monitor.stop();
        watchReceiver.close();
    }

    process.on('exit', stop);

    if (opts.autoOpen === 'on') {
        var pageUrl = 'http://127.0.0.1:' + opts.port;
        kit.retry(30, 100, kit.request)(pageUrl)
        .then(function () {
            kit.xopen(pageUrl);
        }, _.noop);
    }

    return stop;
});
