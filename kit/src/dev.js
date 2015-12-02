import kit from 'nokit';
import defaultOpts from './default-opts';
import autoUpdate from './auto-update';

let br = kit.require('brush');
let proxy = kit.require('proxy');
let { _ } = kit;
let webpack;

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
export default async (opts = {}) => {
    opts = _.defaults(opts, defaultOpts);

    await autoUpdate();

    // Get sudo permission
    if (opts.pac === 'on')
        await kit.spawn('sudo', ['-p', '请输入 sudo 密码: ', '-v']);

    process.env['mx-fe-bone-opts'] = JSON.stringify(opts);

    let watchReceiver = proxy.flow();
    await watchReceiver.listen(0);
    let { stop: stopMonitor, watch } = kit.monitorApp({
        bin: 'babel-node',
        args: [require.resolve('./dev-server'), opts],
        opts: {
            env: _.extend({}, process.env, {
                nokitMonitorAppPort: watchReceiver.server.address().port
            })
        },
        watchList: [opts.layout + '**/*.js']
    });
    watchReceiver.push(proxy.body(), $ => watch($.reqBody + ''));

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
        stopMonitor();
        watchReceiver.close();
        if (webpack) { webpack.kill(); }
    }

    process.on('exit', stop);

    return stop;
};
