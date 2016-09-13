var webpack = require('webpack');
var kit = require('nokit');


var _ = kit._;
var opts = JSON.parse(process.env['febone-opts']);
var srcExt = { js: '.js', babel: '.js', 'typescript': '.ts' }[opts.lang];
var extensions = ['', '.js'];

var entry = kit.globSync(`${opts.srcPage}/**/*${srcExt}`).reduce((ret, p) => {
    var out = kit.path.relative(
        opts.srcPage,
        kit.path.dirname(p) + '/' + kit.path.basename(p, srcExt)
    );

    ret[out] = './' + p;
    return ret;
}, {});

entry.vendor = _.keys(require(`${process.cwd()}/package.json`).dependencies);

if (opts.lang === 'typescript')
    extensions.push('.ts');

var self = {
    entry: entry,

    plugins: [
        new webpack.optimize.CommonsChunkPlugin(
            'vendor',
            opts.isWebpackProduction ? 'vendor.min.js' : 'vendor.js'
        ),
        require('./webpack-notifier')()
    ],

    output: {
        filename: opts.isWebpackProduction ? '[name].min.js' : '[name].js',
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
            }
        ]
    }
};

var jsLoader = {
    babel: {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
    },
    typescript: {
        test: /\.ts?$/,
        loader: 'ts-loader'
    }
}[opts.lang];

if (jsLoader) {
    self.module.loaders.push(jsLoader);
}


if (opts.isWebpackProduction) {

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

module.exports = self;
