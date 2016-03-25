var kit = require('nokit');
var defaultOpts = require('./default-opts');
var utils = require('./utils');

var _ = kit._;
var br = kit.require('brush');
var jhash = kit.require('jhash');
jhash.setSymbols('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

module.exports = kit.async(function * (opts) {
    if (!opts) opts = {};

    opts = _.defaults(opts, defaultOpts);

    var srcExt = {
        babel: 'js',
        typescript: 'ts'
    }[opts.lang];

    kit.require('url');

    var regCDN = /(\\?['"\(])([^'"\(]+?__CDN__[^'"\)]*?)(\\?['"\)])/g;
    var cdnPrefix = ((cdns) => () => _.sample(cdns))(opts.cdnPrefix.split(','));
    var drives = kit.require('drives');
    var hashMapStore = {};
    var preloadjs = '(function () { function f (p) { (new Image()).src = p; } ';
    var hashExclude = new RegExp(opts.hashExclude);
    var hashMap = function (key, value) {
        if (arguments.length === 2) {
            hashMapStore[key] = value;
        } else {
            if (opts.hashPath === 'on' && !hashExclude.test(key))
                return hashMapStore[key];
            else
                return key;
        }
    };

    // 将 js 文件中的带有 __CDN__ 的路径替换成 cdn 前缀和 hash 值
    var compileRes = (str, path) => {
        return kit.replace(str, regCDN, kit.async(function * (m, left, p, right) {
            p = kit.url.parse(p, true);
            delete p.search;
            delete p.query.__CDN__; // eslint-disable-line

            // copy 并获取 hash 值
            var buf;
            try {
                buf = yield kit.readFile(opts.src + p.pathname);
            } catch (err) {
                throw new Error(br.red(`${path} 中的 __CDN__ 配置有误： ${err.message}`));
            }

            var ext = kit.path.extname(p.pathname);
            hashMap(
                p.pathname,
                kit.path.dirname(p.pathname) +
                '/' + kit.path.basename(p.pathname, ext) +
                '.' + jhash.hash(buf) +
                ext
            );

            yield kit.outputFile(opts.dist + hashMap(p.pathname), buf);

            preloadjs += `f('${cdnPrefix()}${hashMap(p.pathname)}');`;
            p.pathname = cdnPrefix() + hashMap(p.pathname);
            kit.logs(br.cyan('cdn:'), p.pathname);
            p = kit.url.format(p);
            return left + p + right;
        }));
    };

    yield kit.warp(`${opts.dist}/**/*.js`)
    .load(drives.reader({ isCache: false }))
    .load(kit.async(function * (f) {
        // 算文件的 hash 值，并保存到 hash map
        var src = kit.path.relative(opts.dist, f.dest + '');

        yield kit.remove(f.dest + '');

        f.dest.name += '.' + jhash.hash(f.contents);
        hashMap(src, kit.path.relative(opts.dist, f.dest + ''));
        f.dest = opts.dist + '/' + hashMap(src);

        f.set(yield compileRes(f.contents, f.path));
    }))
    .run(opts.dist);

    // 编译出基础页面到 dist 目录
    var list = yield kit.glob(`${opts.srcPage}/**/*.${srcExt}`);
    yield kit.all(list.map(kit.async(function * (path) {
        var name = _.trimEnd(kit.path.relative(opts.srcPage,path), `.${srcExt}`);
        var modPath = yield utils.getLayout(opts, name);
        var tpl = require(modPath)({
            vendor: utils.joinUrl(
                cdnPrefix(),
                hashMap(utils.joinUrl(opts.page, 'vendor.min.js'))
            ),
            page: utils.joinUrl(
                cdnPrefix(),
                hashMap(utils.joinUrl(opts.page, `${name}.min.js`))
            )
        });
        return kit.outputFile(`${opts.dist}/${name}.html`, yield compileRes(tpl, modPath));
    })));

    yield kit.outputFile(opts.preload, preloadjs + ' })();');
    yield kit.outputJson(opts.hashMap, hashMapStore);
});
