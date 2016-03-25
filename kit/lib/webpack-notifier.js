var opts = JSON.parse(process.env['mx-fe-bone-opts']);

module.exports = () => {
    return {
        apply (compiler) {
            compiler.plugin('done', (com) => {
                if (com.hasErrors()) {
                    process.stdout.write('\u0007');

                    if (opts.isWebpackProduction)
                        process.on('exit', () => {
                            process.exit(1);
                        });
                }
            });
        }
    };
};
