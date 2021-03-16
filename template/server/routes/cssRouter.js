/*
 * @Author: zhaoye
 * @Date: 2017-07-04 17:02:36
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-04-11 15:55:28
 */
const express = require('express')
const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv
const less = require('less')
const sass = require('node-sass')
const doPostCSSWork = require('../../lib/postcssWork.js')
// css/less/sass的路由
module.exports = function(router) {
    router.get('*.css|*.css.map', (req, res, next) => {
        let filename
        let filenameSass
        filename = path.resolve(__dirname, '../../src', req.path.replace(/^\//, '').replace('.css', '.less'))
        filenameSass = path.resolve(__dirname, '../../src', req.path.replace(/^\//, '').replace('.css', '.scss'))
        // node_modules里的需要重定位
        if (req.url.match(/node_modules/)) {
            filename = path.resolve(__dirname, '../../', req.path.replace(/^(.*)node_modules/, 'node_modules'))
            filenameSass = path.resolve(__dirname, '../../', req.path.replace(/^(.*)node_modules/, 'node_modules'))
        }
        // 优先less
        if (fs.existsSync(filename)) {
            fs.readFile(filename, (err, chunk) => {
                const content = String(chunk)
                // TODO: 还没搞定lint，有机会的话可以再试试
                // const result = lesshint.checkString(content, filename)
                // less
                // 加载less插件
                const options = {
                    filename,
                    // TOOD: 忘了为啥注释了，可能是没搞定
                    // sourceMap: {
                    //     sourceMapRootpath: 'debug:///',
                    //     sourceMapFileInline: true
                    // },
                    plugins: require('../../lib/lessPlugins.js'),
                }
                // 编译并输出less文件
                less.render(content, options)
                    .then((result) => {
                        // postcss，autoprefixer和data-uri
                        return doPostCSSWork(result.css, filename)
                    })
                    .then((result) => {
                        res.append('Content-Type', 'text/css')
                        res.send(result.css)
                    })
                    .catch((err) => {
                        // res.end(err.message)
                        next(err)
                        // throw new Error(err)
                    })
            })
        // 编译sass文件
        } else if (fs.existsSync(filenameSass)) {
            sass.render({
                file: filenameSass,
                importer (url, prev, done) {
                    if (url.match(/^~/)) {
                        url = path.resolve(__dirname, '../../node_modules', url.replace(/^~/, ''))
                    }
                    done({
                        file: url
                        ,
                    })
                },
            }, function(err, result) {
                if (err) {
                    next(err)
                    return
                }
                // postcss，autoprefixer和data-uri
                doPostCSSWork(result.css, filenameSass)
                    .then((result) => {
                        res.append('Content-Type', 'text/css')
                        res.send(result.css)
                    })
            })
        } else {
            next()
        }
    })
}

