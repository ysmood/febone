var kit = require('nokit');
var utils = require('./utils');
var vaneClient = require('vane-client');

kit.require('url');
var _ = kit._;
var proxy = kit.require('proxy');
var serverHelper = proxy.serverHelper();

var select = proxy.select;
var cwd = process.cwd();

module.exports = (app, opts) => {
    var srcExt = {
        js: 'js',
        babel: 'js',
        typescript: 'ts'
    }[opts.lang];

    // 日志和帮助服务
    app.push(
        utils.accessLog('access:'),
        serverHelper
    );

    // vane mock
    if (opts.vane === 'on') {
        app.push(vaneClient({ dir: opts.vaneToken }).middlewares.noflow);
    }

    // 默认路由服务
    app.push(select(/^\/$/, kit.async(function * ($) {
        if(!(yield kit.exists(`${opts.srcPage}/demo.${srcExt}`)))
            return $.next();

        $.res.setHeader('Location', '/demo.html');
        $.res.statusCode = 302;
    })));

    // favicon
    app.push(select('/favicon.ico', kit.readFile(opts.favicon)));

    // 入口页面路由
    app.push(kit.async(function * ($) {
        var name = kit.url.parse($.req.url).pathname;

        if (_.endsWith(name, '.html'))
            name = name.replace(/\.html$/, '');
        else
            name = utils.joinUrl(name, 'index');

        if (!(yield kit.fileExists(`${opts.srcPage}/${name}.${srcExt}`))) {
            return $.next();
        }

        var tpl = require(yield utils.getLayout(opts, name))({
            vendor: utils.joinUrl('/', opts.page, 'vendor.js'),
            page: utils.joinUrl('/', opts.page, `${name}.js`)
        });

        $.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        $.body = tpl;

        // 输出 html 文件
        kit.outputFile(utils.joinUrl(opts.dist, `${name}.html`), tpl);

        // 插入自动重载等工具函数到页面
        if (opts.liveReload === 'on')
            $.body += kit.browserHelper();
    }));

    // 如果 src 里的文件新一些就将其复制到 dist
    app.push(select(`/`, kit.async(function * ($) {
        var url = $.url;

        var query = url.indexOf('?');
        var path = query < 0 ? url : url.slice(0, query);
        var src = opts.src + '/' + path;
        var dist = opts.dist + '/' + path;

        if (kit.path.extname(path) === '.' + srcExt) {
            return $.next();
        }

        if (yield kit.fileExists(src)) {
            if (yield kit.fileExists(dist)) {
                var srcTime = (yield kit.stat(src)).mtime;
                var distTime = (yield kit.stat(dist)).mtime;

                if (srcTime > distTime)
                    yield kit.copy(src, dist);
            } else {
                yield kit.copy(src, dist);
            }
        }

        return $.next();
    })));

    // 将 dist 文件夹作为静态文件夹
    app.push(select('/', proxy.static({
        root: opts.dist,
        onFile: (p) => serverHelper.watch(kit.path.relative(cwd, p))
    })));

};