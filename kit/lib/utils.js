var kit = require('nokit');

var br = kit.require('brush');
var cwd = process.cwd();
var _ = kit._;

module.exports = {
    accessLog: name => ($) => {
        kit.logs(br.grey(`${name} ${$.req.url}`));
        return $.next();
    },

    checkPort (port) {
        if (!/^\d+$/.test(port))
            throw new Error(br.red(`invalid port: ${port}`));
    },

    joinUrl () {
        var isFirst = true;
        var ret = '';

        for (var p of arguments) {
            if (isFirst) {
                isFirst = false;
                ret += _.trimEnd(p, '/');
            } else {
                ret += '/' + _.trimStart(p, '/');
            }
        }
        return ret;
    },

    getLayout: kit.async(function * (opts, page) {
        var defaultLayout = `${cwd}/${opts.layout}/default.js`;
        var layoutPath = `${cwd}/${opts.layout}/${page}.js`;
        return (yield kit.exists(layoutPath)) ? layoutPath : defaultLayout;
    })
};
