import kit from 'nokit';
import pacSetter from './pac-set';

let proxy = kit.require('proxy');
let { select } = proxy;
let br = kit.require('brush');

export default async (opts) => {
    let app = proxy.flow();

    app.push(
        // provide proxy auto config.
        // graphic tutorials: http://www.artica.fr/download/Proxy_Configuration_Mac_OSX_Leopard.pdf
        // see https://support.apple.com/kb/PH10934?locale=en_US
        // see https://en.wikipedia.org/wiki/Proxy_auto-config
        select(/^\//, async $ => {
            $.body = `
                function FindProxyForURL(url, host) {
                    if (shExpMatch(host, "${opts.devHost}")) {
                        return "PROXY 127.0.0.1:${opts.pacPort}";
                    }
                    return "DIRECT";
                }`;
        }),

        proxy.url(`127.0.0.1:${opts.port}`)
    );

    await app.listen(opts.pacPort);

    kit.logs('dev proxy:', br.cyan(opts.devHost), '->', br.cyan(`127.0.0.1:${opts.port}`));

    await pacSetter.on(opts);
};
