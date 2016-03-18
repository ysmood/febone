// nofile-pre-require: babel-core/register

import kit from 'nokit';

export default (task) => {
    task('default build', async () => {
        await kit.spawn('babel', [
            '--optional', 'runtime',
            '-d', 'lib', 'src'
        ]);
    });

    task('test', () => kit.spawn('junit', ['test/basic.js']));
};
