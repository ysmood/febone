var kit = require('nokit');
var pacSetter = require('./pac-set');

var proxy = kit.require('proxy');
var select = proxy.select;
var br = kit.require('brush');

module.exports = kit.async(function * (opts) {
    var app = proxy.flow();

    app.push(
        // provide proxy auto config.
        // graphic tutorials: http://www.artica.fr/download/Proxy_Configuration_Mac_OSX_Leopard.pdf
        // see https://support.apple.com/kb/PH10934?locale=en_US
        // see https://en.wikipedia.org/wiki/Proxy_auto-config
        select(/^\//, kit.async(function * ($) {
            $.body = `
                function FindProxyForURL(url, host) {
                    if (shExpMatch(host, "${opts.devHost}")) {
                        return "PROXY 127.0.0.1:${opts.pacPort}";
                    }
                    return "DIRECT";
                }`;
        })),

        proxy.url(`127.0.0.1:${opts.port}`)
    );

    yield app.listen(opts.pacPort);

    kit.logs('dev proxy:', br.cyan(opts.devHost), '->', br.cyan(`127.0.0.1:${opts.port}`));

    yield pacSetter.on(opts);
});
