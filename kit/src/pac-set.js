import kit from 'nokit';
let br = kit.require('brush');

export default {
    on: async (opts) => {
        let host = '127.0.0.1';
        let pacUrl = `http://${host}:${opts.pacPort}`;
        kit.logs(`pac url:`, br.cyan(pacUrl));

        if (opts.pac === 'on')
            await kit.spawn('sudo' , [
                'networksetup', '-setautoproxyurl', opts.ethernet,
                `${pacUrl}?_=${Date.now()}`
            ]);
    },
    off: async (opts) => {
        if (opts.pac === 'on')
            await kit.spawn('sudo' , ['networksetup', '-setautoproxystate', opts.ethernet, 'off']);
    }
};