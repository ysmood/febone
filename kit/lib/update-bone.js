var kit = require('nokit');
var exec = require('child_process').exec;

var br = kit.require('brush');

module.exports = kit.async(function * () {
    try {
        yield new Promise((resolve, reject) => {
            exec('git status -s', (code, stdout, stderr) => {
                if (code) return reject(stderr);

                stdout = (stdout + '').trim();

                if (stdout) {
                    return reject(
                        '你有如下未 commit 的文件，升级前请 git commit 这些改动，不必 push:\n' +
                        stdout
                    );
                }

                resolve();
            });
        });

        yield kit.spawn('npm', ['i', 'febone@latest']);
        yield kit.spawn('febone', ['update']);
    } catch (err) {
        console.error(br.red(err));
    }
});
