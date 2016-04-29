var kit = require('nokit');
var testHome = kit.path.resolve('test/fixtures-typescript');

function mainTest (it) {

    function request (url, expected) {
        return kit.retry(20, function (url) {
            return kit.sleep(1000).then(function () {
                return kit.request(url);
            })
            .then(function (data) {
                return it.eq((data + '').indexOf(expected + '') > 0, true);
            });
        })({
            redirect: 3,
            url: 'http://127.0.0.1:8733' + url
        });
    }

    return Promise.all([

        it('home page', function () {
            return request('/', '</html>');
        }),

        it('webpack ts', function () {
            return request('/page/demo.js', 'Typescript');
        }).then(function () {
            return it('auto recompile ts', function (after) {
                var time = Date.now();
                var ts = testHome + '/src/tpl/demots.ts';
                var str = kit.readFileSync(ts);
                kit.outputFileSync(
                    ts,
                    str + '\nconsole.log("' + time + '");'
                );
                after(function () {
                    return kit.outputFileSync(ts, str);
                });
                return request('/page/demo.js', time);
            });
        }).then(function () {
            return it('auto recompile less', function (after) {
                var time = Date.now();
                var less = testHome + '/src/style/demo.less';
                var str = kit.readFileSync(less);
                kit.outputFileSync(
                    less,
                    str + '\n.test { size: ' + time + '; }'
                );

                after(function () {
                    return kit.outputFileSync(less, str);
                });

                return request('/page/demo.js', time);
            });
        }).then(function () {
            return it('build', function () {
                return kit.spawn('node_modules/.bin/no', ['build'], { cwd: testHome })
                .then(function () {
                    var hash = require(testHome + '/dist/hash-map.json');
                    return it.eq(
                        kit.fileExistsSync(testHome + '/dist/' + hash['page/demo.min.js']),
                        true
                    );
                }).then(function () {
                    return it.eq(kit.fileExists(testHome + '/dist/demo.html'), true);
                });
            });
        })
    ]);
}

var serverProcess;
function init () {
    try {
        kit.mkdirsSync(testHome);
    } catch (err) { null; }

    return kit.spawn(kit.path.resolve('bin/index.js'), ['--lang', 'typescript'], { cwd: testHome })
    .then(function () {
        serverProcess = kit.spawn(
            'node_modules/.bin/no', [
                '--port', '8733', '--pacPort', '58733',
                '--vane', 'off',
                '--pac', 'off'
            ], { cwd: testHome }
        ).process;
    });
}

module.exports = function (it) {
    return it.describe('typescript', function (it) {
        return init()
        .then(function () {
            return mainTest(it);
        }).then(function () {
            serverProcess.kill('SIGINT');
        });
    });
};
