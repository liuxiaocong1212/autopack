/*
 * @Author: zhaoye
 * @Date: 2017-06-17 19:49:38
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-22 17:40:46
 */
const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const fslist = require('ls-all')
const isProd = process.env.NODE_ENV.match(/production/)
const loaderConfig = require('./bin/loadersConfig.js')

/**
 *
 * @param {*} param0
 */
function webpackConfig ({
    entries,
    domain,
}) {
    const config  = {
        resolveLoader: {
            moduleExtensions: ['-loader'],
        },
        resolve: {
            alias: {
                'zepto': 'gome-zepto',
            },
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use:  [
                        {
                            loader: 'vue-loader',
                            options: {
                                loaders: {
                                    js: loaderConfig.js,
                                    less: loaderConfig.less,
                                    css: loaderConfig.css,
                                },
                            },
                        }
                    ],
                },
                {
                    test: /\.less$/,
                    use: loaderConfig.less,
                },
                {
                    test: /\.css$/,
                    use: loaderConfig.css,
                },
                {
                    test: /\.scss$/,
                    use: loaderConfig.scss,
                },
                {
                    test: /\.ejs$|\.html$/,
                    use: [
                        {
                            loader: 'ejs-loader',
                            loader: 'ejs-compiled-loader',
                        }
                    ],
                },
                {
                    test: /\.js$/,
                    use:  loaderConfig.js,
                },
                {
                    test: /^.*(gome-ui-kit).*?\.(png|jp[e]?g|bmp|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                        }
                    ],
                },
                {
                    test: /^((?!(gome-ui-kit)).)*\.(png|jp[e]?g|bmp|gif)$/,
                    use: [
                        {
                            loader: 'url-loader?name=[path]/[name].[ext]?v=[hash]&publicPath=//img.gomein.net.cn/plus/&outputPath=images/&limit=5000',
                        }
                    ],
                }
            ],
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./node_modules/gome-vue-vendor/gomeVueVendor-full-manifest.json'),
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./node_modules/gome-vue-vendor/gomeVueVendor-manifest.json'),
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./node_modules/gome-dll-utils/gomeDLLUtils-v1-manifest.json'),
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./node_modules/gome-dll-bridge/gomeBridge-v2-manifest.json'),
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./node_modules/gome-dll-ui-kit/gomeDLLUIKit-v1-manifest.json'),
            }),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, 'node_modules/gome-vue-vendor/dist/2.3.4/vendor.full.js'),
                    to: `js/dll/${domain}/vendor.js`,
                },
                {
                    from: path.resolve(__dirname, 'node_modules/gome-dll-utils/dist/v1/utils.js'),
                    to: `js/dll/${domain}/utils.js`,
                },
                {
                    from: path.resolve(__dirname, 'node_modules/gome-dll-ui-kit/dist/v1/uiKit.js'),
                    to: `js/dll/${domain}/uiKit.js`,
                },
                {
                    from: path.resolve(__dirname, 'node_modules/gome-dll-ui-kit/dist/v1/uiKit.css'),
                    to: `style/dll/${domain}/uiKit.css`,
                },
                {
                    from: path.resolve(__dirname, 'node_modules/gome-dll-bridge/dist/v2/bridge.js'),
                    to: `js/dll/${domain}/bridge.js`,
                }
            ])
        ],
    }
    // 配置入口
    config.entry = {}

    for (const key in entries) {
        const entry = [entries[key]]
        config.entry[key.replace(/\.js/, '')] = entry
        if (!isProd) {
            // entry.unshift('./lib/hotReloadEntry.js')
        }
    }
    // 配置出口
    config.output = {
        publicPath: !isProd ? '/' : '',
        path: path.resolve(__dirname, `dist`),
        filename: `js/[name].js`,
    }
    config.devtool = 'module-source-map'

    config.plugins.push(new UglifyJSPlugin({
        sourceMap: true,
        comments: false,
    }))

    // 区别环境
    if (!isProd) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin())
        config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
        config.plugins.push(new FriendlyErrorsPlugin())
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'node_modules/gome-vue-vendor/dist/2.3.4/vendor.full.js.map'),
                to: `js/dll/${domain}/vendor.full.js.map`,
            },
            {
                from: path.resolve(__dirname, 'node_modules/gome-dll-utils/dist/v1/utils.js.map'),
                to: `js/dll/${domain}/utils.js.map`,
            },
            {
                from: path.resolve(__dirname, 'node_modules/gome-dll-ui-kit/dist/v1/uiKit.js.map'),
                to: `js/dll/${domain}/uiKit.js.map`,
            },
            {
                from: path.resolve(__dirname, 'node_modules/gome-dll-ui-kit/dist/v1/uiKit.css.map'),
                to: `style/dll/${domain}/uiKit.css.map`,
            },
            {
                from: path.resolve(__dirname, 'node_modules/gome-dll-bridge/dist/v2/bridge.js.map'),
                to: `js/dll/${domain}/bridge.js.map`,
            }
        ])
    } else {
        config.plugins.push(new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV: '\'' + `${process.env.NODE_ENV.trim()}` + '\'',
            },
        }))
        config.plugins.push(new ExtractTextPlugin({
            filename: 'style/[name].css',
            disable: false,
            allChunks: true,
        }))
        config.plugins.push(new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true,
                },
                discardOverridden: false,
                safe: true,
            },
            canPrint: true,
        }))
        config.plugins.push(new OptimizeCssAssetsPlugin({
            cssProcessor: require('autoprefixer'),
        }))
        config.plugins.push(new UglifyJSPlugin({
            sourceMap: true,
            comments: false,
        }))

    }
    return config
}
module.exports = webpackConfig