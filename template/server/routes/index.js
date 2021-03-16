/*
 * @Author: zhaoye
 * @Date: 2017-04-12 13:22:52
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-04-11 15:47:23
 */
const express = require('express')
const router = express.Router()
const babel = require('babel-core')
const path = require('path')
const fs = require('fs')
const sourceMap = require('source-map')
const argv = require('yargs').argv
const less = require('less')
const mkdirp = require('mkdirp')
const shim = require('../../lib/shim.js')
const toposort = require('../../lib/toposort/toposort.js')
const cache = require('../../lib/cache/cache.js')
const entryrc = require('../../.entryrc.js')
// 优先走自有router
const htmlRouter = require('./htmlRouter.js')
htmlRouter(router)

// 优先走less compile
const cssRouter = require('./cssRouter.js')
cssRouter(router)

const legacyHeader = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title></title>
    <link rel="stylesheet" type="text/css" href="//css.gomein.net.cn/plus/style/public/css/base.css?v=20170306">
</head>
<body>
`
const legacyFooter = `
</body>
</html>
`

router.get('/$', (req, res)  => {
    res.send('hello')
})
// eslint的node API配置
const CLIEngine = require('eslint').CLIEngine
const cli = new CLIEngine({
    envs: ['browser'],
    ignore: true,
    useEslintrc: true,
})
const Linter = require('eslint').Linter
const linter = new Linter()
const rules = require('../../.eslintrc.js')
const reporter = require('eslint-formatter-pretty')

/**
 * 自研commonjs模式下，编译js文件的方法
 * @param {*} req
 */
function compile(req) {
    let filepath
    // 为node_modules中的模块，做特殊的路径处理
    if (req.path.match('node_modules'))
        filepath = path.resolve(__dirname, '../..', req.path.replace(/^\//, ''))
    else
        filepath = path.resolve(__dirname, '../../src', req.path.replace(/^\//, ''))
    const file = fs.readFileSync(filepath)
    const shouldCache = cache.shouldCache(filepath)
    // 不在node_modules中的模块，理应进行eslint
    if (!filepath.match(/node_modules/)) {
        const report = cli.executeOnFiles([filepath])
        const log = reporter(report.results)
        report.results.map(result => {
            if (result.errorCount > 0) {
                console.log(log)
                throw new Error(JSON.stringify(report.results))
            }
        })
    }
    // 为js文件缓存编译结果的代码
    if (shouldCache) {
        if (!shim[req.path]) {
            let contents = String(file)
            // 加入了入口的判断，主要是为了，自动插入polyfill
            if (typeof req.query.entry != 'undefined') {
                contents = require('../../lib/prePolyfill.js') + contents
            }
            // babel的配置项
            const result = babel.transform(contents, {
                'presets': ['es2015', 'stage-3'],
                babelrc: false,
                sourceMaps: 'inline',
                retainLines: false,
                sourceRoot: `debug://${path.dirname(req.path)}`,
                filenameRelative:  req.path,
            })
            // 注入包裹器，搭配客户端的模块加载器使用
            contents = `__define__("${req.path.replace(/^\//, '')}",function(require, exports, module){\n${  result.code  }\n});`
            const resBuf = new Buffer(contents)
            cache.setCache(filepath, resBuf)
            return resBuf
        }
        // 需要使用垫片(shim)机制的模块
        let contents = String(file)
        contents = `__alias__(${ JSON.stringify(shim[req.path]) });\n${  contents}`
        const resBuf = new Buffer(contents)
        cache.setCache(filepath, resBuf)
        return resBuf

    }
    return cache.getCache(filepath)
}

// lsrequire.js的接口
// 关于deps的配置
router.get('*lithe.js|*lsrequire.js', (req, res, next) => {
    const file = fs.readFileSync(path.resolve(__dirname, '../../lib/define.js'))
    const result = babel.transform(file.toString(), {
        presets: ['es2015', 'stage-3'],
        babelrc: false,
    })
    res.send(result.code)
})

/**
 * require接口
 * 此接口需要判断webpack和autopack，然后走不同的编译结果
 */
router.get('*require', (req, res, next) => {
    // 判断是否跳过，然后进入webpack流程
    let shouldNext = true
    entries.forEach(entry => {
        if (req.url.match(new RegExp(entry))) {
            shouldNext = false
        }
    })
    if (!shouldNext) {
        // 返回webpack的各种引用
        const base = req.query.base.replace(/\/+$/, '')
        const content = `
        var scripts = [ "/js/node_modules/gome-vue-vendor/dist/2.3.4/vendor.full.js",
                        "/js/node_modules/gome-dll-ui-kit/dist/v1/uiKit.js",
                        "/js/node_modules/gome-dll-bridge/dist/v2/bridge.js",
                        "/js/node_modules/gome-dll-utils/dist/v1/utils.js",
                        "/${req.query.path.replace(/^\//, '')}"];
            function rec (i) {
                var node = document.createElement("script")
                node.src = "${base}" + scripts[i]
                document.body.appendChild(node)
                node.onload = function(){
                    if(i+1 < scripts.length){
                        rec(i+1)
                    }
                }
            }
            rec(0)
        `
        return res.end(content)
    }
    const sorted = toposort(req.query.path)
    const script = `__context__(${JSON.stringify(sorted.result)}, ${JSON.stringify(sorted.aliasPath)}, "${req.query.path.replace(/^\//, '')}");`
    res.end(script)

})

// 关于加载commonjs格式js文件的
// 优先判断带?commonjs的格式
router.get('/*.js|node_modules*.js', (req, res, next) => {
    if (typeof req.query.commonjs == 'undefined') {
        next()
        return
    }res.end(compile(req))
})

/**
 * autopack 的js路由
 * 如果是需要webpack支持的，就走跳过此路由，由webpack进行后续处理
 */
const entries = require('../../.entryrc.js').entries
router.get('*.js', (req, res, next) => {
    // 判断是否跳过，然后进入webpack流程
    let shouldNext = true
    entries.forEach(entry => {
        if (req.url.match(new RegExp(entry))) {
            shouldNext = false
        }
    })
    if (!shouldNext) {
        next()
        return
    }
    // 仅仅是普通的js
    let filepath
    if (req.url.match(/node_modules/)) {
        filepath = path.resolve(__dirname, '../../', req.path.replace(/^(.*)node_modules/, 'node_modules'))
    } else {
        filepath = path.resolve(__dirname, '../../src', req.path.replace(/^\//, ''))
    }
    fs.readFile(filepath, (err, file) => {
        if (!file) {
            next()
            return
        }
        res.send(file.toString())
    })
})
// 仅仅是给node_modules中的图片加路由
router.get(/.*node_modules.*\.(png|gif|jpeg|jpg|bmp|svg|ttf|woff|map)/, (req, res, next) => {
    let filepath
    if (req.url.match(/node_modules/)) {
        filepath = path.resolve(__dirname, '../../', req.path.replace(/^(.*)node_modules/, 'node_modules'))
    } else {
        filepath = path.resolve(__dirname, '../../src', req.path.replace(/^\//, ''))
    }
    fs.readFile(filepath, (err, file) => {
        if (!file) {
            next()
            return
        }
        res.send(file)
    })
})
module.exports = router
