import kit from 'nokit';

let br = kit.require('brush');
let cwd = process.cwd();

export default {
    accessLog: name => ($) => {
        kit.logs(br.grey(`${name} ${$.req.url}`));
        return $.next();
    },

    checkPort (port) {
        if (!/^\d+$/.test(port))
            throw new Error(br.red(`invalid port: ${port}`));
    },

    async getLayout (opts, page) {
        let defaultLayout = `${cwd}/${opts.layout}/default.js`;
        let layoutPath = `${cwd}/${opts.layout}/${page}.js`;
        return (await kit.exists(layoutPath)) ? layoutPath : defaultLayout;
    }
};
