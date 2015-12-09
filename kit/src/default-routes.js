import kit from 'nokit';
import utils from './utils';

let proxy = kit.require('proxy');
let serverHelper = proxy.serverHelper();

let { select } = proxy;
let cwd = process.cwd();

export default (app, opts) => {
    let srcExt = {
        babel: 'js',
        typescript: 'ts'
    }[opts.lang];

    // 日志和帮助服务
    app.push(
        utils.accessLog('access:'),
        serverHelper
    );

    // 默认路由服务
    app.push(select(/^\/$/, async $ => {
        if(!await kit.exists(`${opts.srcPage}/demo.${srcExt}`))
            return $.next();

        $.res.setHeader('Location', '/demo.html');
        $.res.statusCode = 302;
    }));

    // favicon
    app.push(select('/favicon.ico', kit.readFile(opts.favicon)));

    // 入口页面路由
    app.push(select(/^\/([\/-\w]+)\.html/, async $ => {
        let name = $.url[1];

        if (!await kit.fileExists(`${opts.srcPage}/${name}.${srcExt}`)) {
            return $.next();
        }

        let tpl = require(await utils.getLayout(opts, name))({
            vendor: `/${opts.page}/vendor.js`,
            page: `/${opts.page}/${name}.js`
        });

        $.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        $.body = tpl;

        // 输出 html 文件
        kit.outputFile(`${opts.dist}/${name}.html`, tpl);

        // 插入自动重载等工具函数到页面
        if (opts.liveReload === 'on')
            $.body += kit.browserHelper();
    }));

    // 如果 src 里的文件新一些就将其复制到 dist
    app.push(select(`/`, async $ => {
        let url = $.url;

        let query = url.indexOf('?');
        let path = query < 0 ? url : url.slice(0, query);
        let src = opts.src + '/' + path;
        let dist = opts.dist + '/' + path;

        if (kit.path.extname(path) === '.' + srcExt) {
            return $.next();
        }

        if (await kit.fileExists(src)) {
            if (await kit.fileExists(dist)) {
                let { mtime: srcTime } = await kit.stat(src);
                let { mtime: distTime } = await kit.stat(dist);

                if (srcTime > distTime)
                    await kit.copy(src, dist);
            } else {
                await kit.copy(src, dist);
            }
        }

        return $.next();
    }));

    // 将 dist 文件夹作为静态文件夹
    app.push(select('/', proxy.static({
        root: opts.dist,
        onFile: (p) => serverHelper.watch(kit.path.relative(cwd, p))
    })));

};