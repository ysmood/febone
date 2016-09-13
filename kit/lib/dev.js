var kit = require('nokit');
var defaultOpts = require('./default-opts');
var autoUpdate = require('./auto-update');

var br = kit.require('brush');
var proxy = kit.require('proxy');
var _ = kit._;
var webpack;

function runWebpack () {
    kit.logs(br.cyan('reload webpack'));
    if (webpack) { webpack.kill(); }
    webpack = kit.spawn(
        'webpack', ['--watch', '--progress', '--colors']
    ).process;
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

    var watchReceiver = proxy.flow();
    yield watchReceiver.listen(0);
    var monitor = kit.monitorApp({
        args: [require.resolve('./dev-server'), opts],
        opts: {
            env: _.extend({}, process.env, {
                nokitMonitorAppPort: watchReceiver.server.address().port
            })
        },
        watchList: [opts.layout + '**/*.js']
    });

    watchReceiver.push(proxy.body(), $ => monitor.watch($.reqBody + ''));

    if (opts.webpack === 'on') {
        runWebpack();
        kit.watchFiles(
            ['webpack.config.js', 'package.json'],
            { handler: runWebpack }
        );
        kit.watchDir(opts.srcPage, {
            patterns: '*.js',
            handler: (type) => {
                if (type === 'modify') { return; }
                runWebpack();
            }
        });
    }

    function stop () {
        monitor.stop();
        watchReceiver.close();
        if (webpack) { webpack.kill(); }
    }

    process.on('exit', stop);

    return stop;
});
