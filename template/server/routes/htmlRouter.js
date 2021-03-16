/*
 * @Author: zhaoye
 * @Date: 2017-07-03 17:28:56
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-04-11 15:50:32
 */
const app = require('../app.js')
const config = require('../../.entryrc.js')
const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv
const ejs = require('ejs')
const pug = require('jade')
// views的路由
module.exports = function(router) {
    router.get('/*', (req, res, next) => {
        const filename = path.resolve(__dirname, path.join('../../src/views', req.path)).replace(/\.html$/, '.ejs')
        const filenamePug = path.resolve(__dirname, path.join('../../src/views', req.path)).replace(/\.html$/, '.pug')
        // html重名优先ejs
        if (fs.existsSync(filename)) {
            const tmpl = String(fs.readFileSync(filename))
            // 配合PHP的一些全局变量的适配
            const result = tmpl.replace(/\{JS_CDN_IP\}/g, '/js')
                .replace(/\{CSS_CDN_IP\}/g, '/style')
                .replace(/{PLUS_GOMEUI_CDN_IP}/g, '/node_modules/plus-public')
                .replace(/\{PLUS_CSS\}/g, '')
                .replace(/\{PLUS_JS\}/g, '')
                .replace(/\{APP_CDN_IP\}/g, '/images')
                .replace(/\{GOMEUI_CDN_IP\}/g, '/gomeUI')
                .replace(/\{PLUS_ANALYSIS_JS\}/g, '/lsrequire.js')
                .replace(/\{PLUS_JS_T\}/g, '')
                .replace(/\{PLUS_STATIC_RESOURCES\}/g, '')
                // 给hybrid做的适配
                .replace('<!--PackConfig-->', config.hybrid ? `
<script>
    var PackConfig = ${JSON.stringify(config.hybrid.devServer, null, 10)}
</script>
` : '')
            // 编译并返回
            res.end(ejs.render(result, {
                filename,
            }))
        // 处理jade模板
        } else if (fs.existsSync(filenamePug)) {
            const tmpl = String(fs.readFileSync(filenamePug))
            const result = tmpl.replace(/\{JS_CDN_IP\}/g, '/js')
                .replace(/\{CSS_CDN_IP\}/g, '/style')
                .replace(/{PLUS_GOMEUI_CDN_IP}/g, '/node_modules/plus-public')
                .replace(/\{PLUS_CSS\}/g, '')
                .replace(/\{PLUS_JS\}/g, '')
                .replace(/\{APP_CDN_IP\}/g, '/images')
                .replace(/\{GOMEUI_CDN_IP\}/g, '/gomeUI')
                .replace(/\{PLUS_ANALYSIS_JS\}/g, '/lsrequire.js')
                .replace(/\{PLUS_JS_T\}/g, '')
                .replace(/\{PLUS_STATIC_RESOURCES\}/g, '')
            res.end(pug.render(result, {
                filename,
            }))
        // 普通html，仅仅是返回
        } else if (req.path.match(/\.html$/)) {
            res.render(req.path.replace(/^\//, ''))
        // 就没有这个文件
        } else {
            next()
        }
    })
}

