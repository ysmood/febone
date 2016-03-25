var kit = require('nokit');
var devProxy = require('./dev-proxy');

var _ = kit._;
var br = kit.require('brush');
var proxy = kit.require('proxy');
var opts = JSON.parse(process.argv[2]);
var mock = `${process.cwd()}/${opts.mock}`;

// dynamically tell the monitor which file is required
require.extensions['.js'] = kit._.wrap(require.extensions['.js'], _.rest((fn, args) => {
    if (args[1].indexOf('/node_modules/') < 0)
        kit.request({
            url: 'http://127.0.0.1:' + process.env.nokitMonitorAppPort,
            reqData: args[1]
        });

    return fn.apply(null, args);
}));

// main http server
var app = proxy.flow();

// load mock modules
var isLoadMock = true;
try {
    require.resolve(mock);
    kit.logs(`load module "${mock}"`);
} catch (err) {
    isLoadMock = false;
    kit.logs(br.yellow(`skip module "${mock}"`));
}
if (isLoadMock) require(mock)(app, opts);

(kit.async(function * () {

    yield app.listen(opts.port);

    // start proxy server
    yield devProxy(opts);

}))().catch(kit.throw);
