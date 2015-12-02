import kit from 'nokit';
import devProxy from './dev-proxy';

let br = kit.require('brush');
let proxy = kit.require('proxy');
let opts = JSON.parse(process.argv[2]);
let mock = `${process.cwd()}/${opts.mock}`;

// dynamically send tell the monitor which file is required
require.extensions['.js'] = kit._.wrap(require.extensions['.js'], (fn, ...args) => {
    if (args[1].indexOf('/node_modules/') < 0)
        kit.request({
            url: 'http://127.0.0.1:' + process.env.nokitMonitorAppPort,
            reqData: args[1]
        });

    return fn(...args);
});

// main http server
let app = proxy.flow();

// load mock modules
let isLoadMock = true;
try {
    require.resolve(mock);
    kit.logs(`load module "${mock}"`);
} catch (err) {
    isLoadMock = false;
    kit.logs(br.yellow(`skip module "${mock}"`));
}
if (isLoadMock) require(mock)(app, opts);

(async() => {

    await app.listen(opts.port);

    // start proxy server
    await devProxy(opts);

})().catch(kit.throw);
