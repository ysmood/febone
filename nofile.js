'use strict';

var kit = require('nokit');
var _ = kit._;
var Promise = kit.Promise;
var cwd = process.cwd();

module.exports = function (task, option) {
    var copyTpl, dist;

    // 防止开发 mx-fe-bone 本身时发布到当前目录
    try {
        dist = require(cwd + '/package.json').name === 'mx-fe-bone' ? 'dist' : '.';
    } catch (err) {
        dist = '.';
    }

    option('--noDemo', '不创建 demo');
    option('--output <path>', '输出目录 [' + dist + ']', dist);
    option('--lang <str>', 'demo 的预处理语言 babel 或者 typescript [babel]', 'babel');

    task('default init', ['init-repo'], '初始化项目');

    task('update', '升级脚手架', function (opts) {
        var cwd = kit.path.resolve(opts.output);
        opts.noDemo = true;

        return Promise.resolve()
        .then(function () { return copyTpl(opts); })
        .then(function () { return kit.spawn('npm', ['install'], { cwd: cwd }); });
    });

    task('init-repo', ['copy-tpl'], '初始化 git 仓库', function (opts) {
        process.chdir(opts.output);

        function gInit () { return kit.spawn('git', ['init']); }
        function addBasic () { return kit.spawn('git', ['add', '--all']); }
        function ciInit () { return kit.spawn('git', ['commit', '-m', 'mx-fe-bone init']).catch(_.noop); }

        return kit.flow([gInit, addBasic, ciInit])()
        .then(function () { return kit.spawn('npm', ['install']); })
        .then(function () { return process.chdir(cwd); });
    });

    task('copy-tpl', '拷贝初始模板文件', copyTpl = function (opts) {
        var drives = kit.require('drives');
        var baseDir = kit.path.join(__dirname, 'tpl');

        var list = [
            'page/**',
            'mock/**', 'doc/**', 'layout/**',
            'src/**/.gitkeep',
            'gitignore', 'nofile.js', 'package.json',
            'readme.md', 'webpack.config.js',
            'src/img/favicon.ico',
            'src/style/demo.less'
        ];

        var langList = {
            typescript: [
                'tsconfig.json',
                'src/page/demo.ts',
                'src/tpl/demots.ts'
            ],
            babel: [
                'src/page/demo.js',
                'src/tpl/demo.js'
            ]
        }[opts.lang];

        list = list.concat(langList);

        if (opts.noDemo)
            _.remove(list, function (p) { return p.indexOf('src/') === 0; });

        return kit.warp(
            list.map(function (p) { return baseDir + '/' + p; }),
            { all: true, baseDir: baseDir }
        )
        .load(drives.reader({ isCache: false, encoding: null }))
        .load(function (f) {
            if (f.dest + '' === 'gitignore')
                f.dest = '.gitignore';
        })
        .run(opts.output)
        .then(function () {
            var p = opts.output + '/nofile.js';
            kit.warp(p).load(function (f) {
                var reg = /(option\(.+')(babel)('\))/;
                f.set(f.contents.replace(reg, '$1' + opts.lang + '$3'));
            }).run(opts.output);
        })
        .then(function () {
            if (process.env['mx-fe-bone-dev'] === 'test') {
                var p = opts.output + '/package.json';
                return kit.readJson(p)
                .then(function (info) {
                    info.devDependencies['mx-fe-bone-kit'] = '../../kit';
                    return kit.outputJson(p, info, { space: 2 });
                });
            }
        });
    });

    task('clean', '清理项目', function (opts) {
        return kit.remove(opts.output);
    });

    task('test', '测试 mx-fe-bone 本身', function () {
        return kit.spawn('npm', ['i'], { cwd: 'kit' }).then(function () {
            process.env['mx-fe-bone-dev'] = 'test';
            return kit.spawn('junit', ['test/*.js', '-t', 1000 * 60 * 10]);
        });
    });

};
