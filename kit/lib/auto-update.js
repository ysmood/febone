var kit = require('nokit');

var cwd = process.cwd();
var semver = kit.require('semver');
var br = kit.require('brush');

module.exports = kit.async(function * () {
    var packInfo = yield kit.readJson(`${cwd}/package.json`);

    var deps = kit._.assign({}, packInfo.dependencies, packInfo.devDependencies);

    yield kit.all(kit._.map(deps, kit.async(function * (ver, name) {
        var target = `${name}@${ver}`;
        try {
            var version = (yield kit.readJson(`${cwd}/node_modules/${name}/package.json`)).version;

            if (!semver.valid(ver)) return;

            if (!semver.satisfies(version, ver)) {
                kit.logs(
                    br.cyan('update dependency:'),
                    `${name}@${version}`, br.grey('->'), target
                );

                yield kit.spawn('npm', ['i', target]);
            }
        } catch (err) {
            kit.logs(
                br.cyan('install missed dependency:'),
                target
            );
            yield kit.spawn('npm', ['i', target]);
        }
    })));

    kit.logs('dependencies ok');
});
