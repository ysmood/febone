
export default () => {
    return {
        apply (compiler) {
            compiler.plugin('done', (com) => {
                if (com.hasErrors()) {
                    process.stdout.write('\u0007');
                }
            });
        }
    };
};
