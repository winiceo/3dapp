var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var env = process.env.NODE_ENV === 'testing' ? require('../config/test.env') : config.build.env
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var CopyWebpackPlugin = require('copy-webpack-plugin');
var chunks =Object.keys(baseWebpackConfig.entry) ;

module.exports = merge(baseWebpackConfig, {
    module: {
        loaders: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    vue: {
        loaders: utils.cssLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    plugins: [

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'lodash',
            Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
            fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),

        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendors', // 公共模块的名称
        //     chunks: chunks,  // chunks是需要提取的模块
        //     minChunks: chunks.length
        // }),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        ),
        // http://vuejs.github.io/vue-loader/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        // extract css into its own file
        new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),


        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        // new HtmlWebpackPlugin({
        //     filename: process.env.NODE_ENV === 'testing' ? 'index.html' : config.build.index,
        //     template: 'index.html',
        //     inject: true,
        //     minify: {
        //         removeComments: true,
        //         collapseWhitespace: true,
        //         removeAttributeQuotes: true
        //             // more options:
        //             // https://github.com/kangax/html-minifier#options-quick-reference
        //     },
        //     // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        //     chunksSortMode: 'dependency'
        // }),
        // split vendor js into its own file

    ]
})


var pages = utils.getEntry('./src/app/**/*.html');

for (var pathname in pages) {
    console.log(pathname);
    // 配置生成的html文件，定义路径等
    var conf = {
        // filename: pathname + '.html',
        filename: pathname + '.html',
        template: pages[pathname], // 模板路径
        
        // minify: {
        //     removeComments: true,
        //     collapseWhitespace: true,
        //     removeAttributeQuotes: true
        //         // more options:
        //         // https://github.com/kangax/html-minifier#options-quick-reference
        // },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        //chunksSortMode: 'dependency'
    };


    if (pathname in module.exports.entry) {
        conf.chunks = ['vendor', pathname];
        conf.hash = false;
    }

   //if(/b|c/.test(pathname)) conf.chunks.splice(2, 0, 'common-b-c')
    // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}


module.exports.plugins.push(

    // new CommonsChunkPlugin({
    //     name: 'vender',
    //     chunks: ['common']
    // })
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor',
    //     minChunks: function(module, count) {
    //         // any required modules inside node_modules are extracted to vendor
    //         return (
    //             module.resource &&
    //             /\.js$/.test(module.resource) &&
    //             module.resource.indexOf(
    //                 path.join(__dirname, '../node_modules')
    //             ) === 0
    //         )
    //     }
    // }),
    // // extract webpack runtime and module manifest to its own file in order to
    // // prevent vendor hash from being updated whenever app bundle is updated
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'manifest',
    //     chunks: ['vendor']
    // })
    // ,
    new CopyWebpackPlugin([
        { from: '../front/**/*', to: './dist/' },

    ])




)
