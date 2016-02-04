import kit from 'nokit';

let br = kit.require('brush');
let cwd = process.cwd();
let { _ } = kit;

export default {
    accessLog: name => ($) => {
        kit.logs(br.grey(`${name} ${$.req.url}`));
        return $.next();
    },

    checkPort (port) {
        if (!/^\d+$/.test(port))
            throw new Error(br.red(`invalid port: ${port}`));
    },

    joinUrl () {
        let isFirst = true;
        let ret = '';

        for (let p of arguments) {
            if (isFirst) {
                isFirst = false;
                ret += _.trimRight(p, '/');
            } else {
                ret += '/' + _.trimLeft(p, '/');
            }
        }
        return ret;
    },

    async getLayout (opts, page) {
        let defaultLayout = `${cwd}/${opts.layout}/default.js`;
        let layoutPath = `${cwd}/${opts.layout}/${page}.js`;
        return (await kit.exists(layoutPath)) ? layoutPath : defaultLayout;
    }
};
