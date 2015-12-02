
export default () => {
    return {
        apply (compiler) {
            compiler.plugin('done', (com) => {
                if (com.hasErrors()) {
                    process.stdout.write('\u0007');

                    if (process.env.NODE_ENV === 'production')
                        process.on('exit', () => {
                            process.exit(1);
                        });
                }
            });
        }
    };
};
