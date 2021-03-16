/*
 * @Author: zhaoye
 * @Date: 2017-04-12 13:22:56
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-04-11 15:37:56
 */
const express = require('express')
const app = new express
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv

const webpackEntries = require('../lib/ls-entries.js')
const router = require('./routes/index')

const lessMiddleware = require('less-middleware')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('../webpack.config.js')

const fslist = require('ls-all')
const hasha = require('hasha')
// const Server = require('socket.io')
const deep = require('deep-diff')
const del = require('delete')
const mkdirp = require('mkdirp')

// 存储src目录下全部的文件的md5戳，稍后会被下面的函数填满
const manifest = {

}
// utils-获取所有文件的md5码，生成manifest
fslist([path.resolve(__dirname, '../src')], {
    recurse: true,
    flatten: true,
})
    .then((files) => {
        files.forEach((item) => {
            const isFile = fs.lstatSync(item.path).isFile()
            if (!isFile) {
                return
            }
            // 给文件生成md5码
            hasha.fromFile(path.resolve(__dirname, item.path))
                .then((hash) => {
                    manifest[item.path] = hash
                })
        })
        return true
    })
    .then(() => {
        // 获取webpack项目的所有入口
        return webpackEntries()
    })
    .then(({
        // webpack项目的入口文件
        // type: Array
        entries,
        // .entryrc中配置的domain配置项
        domain,
    }) => {
        // 普通的express的配置项
        app.use(logger('dev', {
            skip (req, res) { return res.statusCode < 400 },
        }))
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({
            extended: false,
        }))
        app.use(cookieParser())

        // 指定模板目录，需要包含src中的views下的所有的ejs
        app.set('views', [path.resolve(__dirname, 'views'), path.resolve(__dirname, '../src/views')])
        app.set('view engine', 'ejs')
        app.engine('html', require('ejs').renderFile)

        // 路由的配置
        app.use('/', router)

        // 如果有webpack的入口
        if (entries) {
            // 开始webpack的构建
            const webpackConfigResult = webpackConfig({
                entries,
                domain,
            })
            const compiler = webpack(webpackConfigResult)
            // 挂载webpack-dev-server中间件
            app.use(webpackMiddleware(
                compiler
                , {
                    quiet: true,
                    // noInfo: true,
                    // watchOptions: {
                    //     aggregateTimeout: 300,
                    //     poll: true
                    // },
                    publicPath: webpackConfigResult.output.publicPath,
                    // reporter: null,
                    // // headers: { "X-Custom-Header": "yes" },
                    stats: {
                        colors: true,
                    },
                    // serverSideRender: false,
                }
            ))
            // 挂载热更新中间件
            app.use(require('webpack-hot-middleware')(compiler))
        }
        // src最基本上来说，也是静态服务器
        app.use(express.static(path.resolve(__dirname, '../src')))

        // 下面的代码没啥用
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            const err = new Error('Not Found')
            err.status = 404
            next(err)
        })
        // error handler
        app.use(function(err, req, res, next) {
        // set locals, only providing error in development
            res.locals.message = err.message
            res.locals.error = req.app.get('env') !== 'production' ? err : {

            }

            // render the error page
            res.status(err.status || 500)
            res.render('error')
        })

        // port是3000或输入进来的
        app.listen(argv.port || '3000', () => {
            console.log(`server running on ${argv.port || '3000'}`)
        })

    })

/**
 * utils-删除
 * @param {*} filepath
 */
function deleteFileAndPath(filepath) {
    del(filepath, {
        force: true,
    }, () => {
        try {
            fs.rmdirSync(path.dirname(filepath))
        } catch (e) {
            // 正常，就是强制试着删除一下为空文件夹
        }
    })
}

module.exports = app