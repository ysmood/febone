import webpack from 'webpack';
import kit from 'nokit';


let isProduction = process.env.NODE_ENV === 'production';
let { _ } = kit;
let opts = JSON.parse(process.env['mx-fe-bone-opts']);
let srcExt = { babel: '.js', 'typescript': '.ts' }[opts.lang];
let extensions = ['', '.js'];

let entry = kit.globSync(`${opts.srcPage}/**/*${srcExt}`).reduce((ret, p) => {
    let out = kit.path.relative(
        opts.srcPage,
        kit.path.dirname(p) + '/' + kit.path.basename(p, srcExt)
    );

    ret[out] = './' + p;
    return ret;
}, {});

entry.vendor = _.keys(require(`${process.cwd()}/package.json`).dependencies);

if (opts.lang === 'typescript')
    extensions.push('.ts');

let self = {
    entry: entry,

    plugins: [
        new webpack.optimize.CommonsChunkPlugin(
            'vendor',
            isProduction ? 'vendor.min.js' : 'vendor.js'
        ),
        require('./webpack-notifier')()
    ],

    output: {
        filename: isProduction ? '[name].min.js' : '[name].js',
        path: kit.path.join(opts.dist, opts.page)
    },

    resolve: {
        extensions: extensions
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            {
                babel: {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    loader: 'babel?optional[]=runtime&loose=all'
                },
                typescript: {
                    test: /\.ts?$/,
                    loader: 'ts-loader'
                }
            }[opts.lang]
        ]
    }
};

if (isProduction) {

    self.plugins.push(new webpack.optimize.UglifyJsPlugin());

    // eslint
    self.module.preLoaders = [
        {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'eslint'
        }
    ];
    self.eslint = {
        failOnError: true
    };

} else {

    self.output.pathinfo = true;
    self.debug = true;

}

export default self;
