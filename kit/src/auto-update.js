import kit from 'nokit';

let cwd = process.cwd();
let semver = kit.require('semver');
let br = kit.require('brush');

export default async () => {
    let packInfo = await kit.readJson(`${cwd}/package.json`);

    let deps = kit._.assign({}, packInfo.dependencies, packInfo.devDependencies);

    await * kit._.map(deps, async (ver, name) => {
        let target = `${name}@${ver}`;
        try {
            let { version } = await kit.readJson(`${cwd}/node_modules/${name}/package.json`);
            if (!semver.satisfies(version, ver)) {
                kit.logs(
                    br.cyan('update dependency:'),
                    `${name}@${version}`, br.grey('->'), target
                );

                await kit.spawn('npm', ['i', target]);
            }
        } catch (err) {
            kit.logs(
                br.cyan('install missed dependency:'),
                target
            );
            await kit.spawn('npm', ['i', target]);
        }
    });

    kit.logs('dependencies ok');
};
