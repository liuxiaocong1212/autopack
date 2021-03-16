/*
 * @Author: zhaoye
 * @Date: 2018-02-22 13:53:09
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-23 11:33:41
 */
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const rev = require('../rev-hash.js')
const through2 = require('through2')
const Vinyl = require('vinyl')
// 处理dll
module.exports = function dllRev ({
    basePath,
    dlls,
    manifest,
    config,
}) {
    return through2.obj(function (chunk, enc, cb) {
        dlls.forEach(dllName => {
            const pathname = path.resolve(basePath, `dist/js/dll/${config.domain}/${dllName}`)
            const revision = rev(fs.readFileSync(pathname))
            manifest[dllName] = revision
            const releasePathname = path.resolve(basePath, `release/${config.domain}/src/js/dll/${config.domain}/${dllName}`)
            // mkdirp(path.dirname(releasePathname), () => {
            //     fs.writeFileSync(releasePathname.replace(/\.js$/, `.${revision}.js`), fs.readFileSync(pathname))
            // })
            const file = new Vinyl({
                base: '/',
                cwd: '/',
                path: `/js/dll/${config.domain}/${dllName.replace(/\.js$/, `.${revision}.js`)}`,
                contents: fs.readFileSync(pathname),
            })
            this.push(file)
        })
        cb(null, chunk)
    })
}
