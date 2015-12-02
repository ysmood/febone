import kit from 'nokit';
import { exec } from 'child_process';

let br = kit.require('brush');

export default async () => {
    try {
        await new Promise((resolve, reject) => {
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

        await kit.spawn('npm', ['i', 'mx-fe-bone@latest']);
        await kit.spawn('mx-fe-bone', ['update']);
    } catch (err) {
        console.error(br.red(err));
    }
};
