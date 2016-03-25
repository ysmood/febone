var kit = require('nokit');

module.exports = (task) => {
    task('default build', () => {
        kit.logs('build');
    });
};
