import kit from 'nokit';
import defaultOpts from './default-opts';
import utils from './utils';

let { _ } = kit;
let br = kit.require('brush');
let jhash = kit.require('jhash');
jhash.setSymbols('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');


export default async (opts = {}) => {
    opts = _.defaults(opts, defaultOpts);

    let srcExt = {
        babel: 'js',
        typescript: 'ts'
    }[opts.lang];

    kit.require('url');

    let regCDN = /(\\?['"\(])([^'"\(]+?__CDN__[^'"\)]*?)(\\?['"\)])/g;
    let cdnPrefix = ((cdns) => () => _.sample(cdns))(opts.cdnPrefix.split(','));
    let drives = kit.require('drives');
    let hashMapStore = {};
    let preloadjs = '(function () { function f (p) { (new Image()).src = p; } ';
    let hashMap = function (key, value) {
        if (arguments.length === 2) {
            hashMapStore[key] = value;
        } else {
            if (opts.hashPath === 'on')
                return hashMapStore[key];
            else
                return key;
        }
    };

    // 将 js 文件中的带有 __CDN__ 的路径替换成 cdn 前缀和 hash 值
    let compileRes = (str, path) =>
        kit.replace(str, regCDN, async (m, left, p, right) => {
            p = kit.url.parse(p, true);
            delete p.search;
            delete p.query.__CDN__; // eslint-disable-line

            // copy 并获取 hash 值
            let buf;
            try {
                buf = await kit.readFile(opts.src + p.pathname);
            } catch (err) {
                throw new Error(br.red(`${path} 中的 __CDN__ 配置有误： ${err.message}`));
            }

            let ext = kit.path.extname(p.pathname);
            hashMap(
                p.pathname,
                kit.path.dirname(p.pathname) +
                '/' + kit.path.basename(p.pathname, ext) +
                '.' + jhash.hash(buf) +
                ext
            );

            await kit.outputFile(opts.dist + hashMap(p.pathname), buf);

            preloadjs += `f('${cdnPrefix()}${hashMap(p.pathname)}');`;
            p.pathname = cdnPrefix() + hashMap(p.pathname);
            kit.logs(br.cyan('cdn:'), p.pathname);
            p = kit.url.format(p);
            return left + p + right;
        });

    await kit.warp(`${opts.dist}/**/*.js`)
    .load(drives.reader({ isCache: false }))
    .load(async f => {
        // 算文件的 hash 值，并保存到 hash map
        let src = kit.path.relative(opts.dist, f.dest + '');

        await kit.remove(f.dest + '');

        f.dest.name += '.' + jhash.hash(f.contents);
        hashMap(src, kit.path.relative(opts.dist, f.dest + ''));
        f.dest = opts.dist + '/' + hashMap(src);

        f.set(await compileRes(f.contents, f.path));
    })
    .run(opts.dist);

    // 编译出基础页面到 dist 目录
    let list = await kit.glob(`${opts.srcPage}/**/*.${srcExt}`);
    await * list.map(async (path) => {
        let name = _.trimEnd(kit.path.relative(opts.srcPage,path), `.${srcExt}`);
        let modPath = await utils.getLayout(opts, name);
        let tpl = require(modPath)({
            vendor: utils.joinUrl(
                cdnPrefix(),
                hashMap(utils.joinUrl(opts.page, 'vendor.js'))
            ),
            page: utils.joinUrl(
                cdnPrefix(),
                hashMap(utils.joinUrl(opts.page, `${name}.js`))
            )
        });
        return kit.outputFile(`${opts.dist}/${name}.html`, await compileRes(tpl, modPath));
    });

    await kit.outputFile(opts.preload, preloadjs + ' })();');
    await kit.outputJson(opts.hashMap, hashMapStore);
};
