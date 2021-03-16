/*
 * @Author: zhaoye
 * @Date: 2017-06-29 15:57:40
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-04-11 15:57:20
 * webpack关于loader的一些配置
 */
const argv = require('yargs').argv
const isProd = process.env.NODE_ENV.match(/production/)
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    js: [
        {
            loader: 'babel-loader',
        },
        {
            loader: 'eslint-loader',
            options: {
                failOnError: true,
            },
        }
    ],
    css: !isProd ? ['style-loader', 'css-loader']
        : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true,
                    },
                }
            ],
        }),
    less: !isProd ? ['style-loader', 'css-loader', 'less-loader']
        :  ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                },
                {
                    loader: 'less-loader',
                    options: {
                        minimize: true,
                    },
                }
            ],
        }),
    scss: !isProd ? ['style-loader', 'css-loader', 'sass-loader']
        :  ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                },
                {
                    loader: 'sass-loader',
                    options: {
                        minimize: true,
                    },
                }
            ],
        }),
}
