var kit = require('nokit');
var br = kit.require('brush');

module.exports = {
    on: kit.async(function * (opts) {
        var host = '127.0.0.1';
        var pacUrl = `http://${host}:${opts.pacPort}`;
        kit.logs(`pac url:`, br.cyan(pacUrl));

        if (opts.pac === 'on')
            yield kit.spawn('sudo' , [
                'networksetup', '-setautoproxyurl', opts.ethernet,
                `${pacUrl}?_=${Date.now()}`
            ]);
    }),
    off: kit.async(function * (opts) {
        if (opts.pac === 'on')
            yield kit.spawn('sudo' , ['networksetup', '-setautoproxystate', opts.ethernet, 'off']);
    })
};