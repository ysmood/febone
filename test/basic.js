var kit = require('nokit');
var testHome = kit.path.resolve('test/fixtures');

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
            url: 'http://127.0.0.1:8732' + url
        });
    }

    return Promise.all([

        it('home page', function () {
            return request('/', '</html>');
        }),

        it('webpack js', function () {
            return request('/page/demo.js', 'Babel');
        }).then(function () {
            return it('auto recompile js', function (after) {
                var time = Date.now();
                var js = testHome + '/src/tpl/demo.js';
                var str = kit.readFileSync(js);
                kit.outputFileSync(
                    js,
                    str + '\nconsole.log("' + time + '");'
                );
                after(function () {
                    return kit.outputFileSync(js, str);
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

    return kit.spawn(kit.path.resolve('bin/index.js'), [], { cwd: testHome })
    .then(function () {
        serverProcess = kit.spawn(
            'node_modules/.bin/no', ['--pac', 'off'], { cwd: testHome }
        ).process;
    });
}

module.exports = function (it) {
    return it.describe('basic', function (it) {
        return init()
        .then(function () {
            return mainTest(it);
        }).then(function () {
            serverProcess.kill('SIGINT');
        });
    });
};
