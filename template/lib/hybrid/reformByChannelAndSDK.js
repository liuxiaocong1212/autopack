/*
 * @Author: zhaoye
 * @Date: 2018-02-22 13:59:10
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-23 18:17:13
 */
const path = require('path')
const gulp = require('gulp')
const fs = require('fs')
const Vinyl = require('vinyl')
const rev = require('./revWhole.js')
const zip = require('gulp-zip')
const {argv} = require('yargs')
const sdkConfig = require('../../bin/version.map.js')
const through2 = require('through2')
const versionUp = require('./versionUp.js')
const versionMapCache = {}

module.exports = function ({
    basePath,
    manifest,
    config,
    channel,
}) {
    /** */
    function outputWap () {
        return new Promise(function (resolve, reject) {
            gulp.src(path.resolve(basePath, `release/_wap_/**/*`))
                .pipe(through2.obj(function (chunk, enc, cb) {
                    if (path.extname(chunk.path).match(/html$/)) {
                        let content = String(chunk.contents)
                        content = content.replace('<!--PackConfig-->', `
<script>
var PackConfig = ${JSON.stringify({
        PLATFORM: 'WAP',
        ENV: argv.env,
    }, null, 10)}
</script>
                `)
                        chunk.contents = new Buffer(content)
                    }
                    cb(null, chunk)
                }))
                .pipe(gulp.dest(path.resolve(basePath, 'release/wap')))
                .on('finish', function () {
                    resolve()
                })
        })

    }
    /** */
    function outputApp () {
        /**
         *
         * @param {*} iter
         * @param {*} cb
         */
        function recursiveOutput (iter, cb) {
            // 前置处理工作
            const curSDK = config.hybrid.sdk[iter]
            const pr = {}
            const __originHyConfig = sdkConfig[curSDK]
            if (typeof __originHyConfig.autoIncrement != 'undefined') {
                if (__originHyConfig.autoIncrement) {
                    __originHyConfig.version = versionUp(__originHyConfig.version)
                }
            }
            const hyConfig = {
                supportSdk: String(curSDK),
                plugVersion: __originHyConfig['version'],
                plugId: config.domain,
                platform: __originHyConfig['platform'] || 'all',
                isComponent: __originHyConfig['isComponent'] || 'false',
                name: config.domain,
                describe: `${config.domain}_sdk${curSDK}_${argv.env}包`,
                versionName: `v${ __originHyConfig['version']}`,
            }
            if (__originHyConfig['deps']) {
                hyConfig.deps = __originHyConfig['deps']
            }
            // 留着重新生成version.map.js用
            versionMapCache[curSDK] = __originHyConfig
            // 生成pr.mni和config.json
            gulp.src(path.resolve(basePath, `release/_app_/**/*`))
                .pipe(through2.obj(function (chunk, enc, cb) {
                    if (path.extname(chunk.path).match(/html$/)) {
                        let content = String(chunk.contents)
                        content = content.replace('<!--PackConfig-->', `
<script>
var PackConfig = ${JSON.stringify({
        PLATFORM: 'APP',
        SDK: curSDK,
        ENV: argv.env,
    }, null, 10)}
</script>
            `)
                        chunk.contents = new Buffer(content)
                    }
                    cb(null, chunk)
                }))
                .pipe(through2.obj(function (chunk, enc, cb) {
                    if (Buffer.isBuffer(chunk.contents)) {
                        const filePath = chunk.path
                            .replace(/\\/g, '/')
                            .replace(/^.*?\/src/, 'src')
                        pr[filePath] = rev(chunk.contents)
                    }
                    cb(null, chunk)
                }, function (cb) {
                    // config.json
                    const configJSON = new Vinyl({
                        cwd: '/',
                        base: '/',
                        path: '/config.json',
                        contents: new Buffer(JSON.stringify(hyConfig)),
                    })
                    // pr.mni
                    const prMni = new Vinyl({
                        cwd: '/',
                        base: '/',
                        path: '/pr.mni',
                        contents: new Buffer(JSON.stringify(pr)),
                    })
                    this.push(prMni)
                    this.push(configJSON)
                    cb()
                }))
                .pipe(zip(`${config.domain}-v${hyConfig.plugVersion}-sdk${curSDK}-${argv.env}.zip`))
                .pipe(gulp.dest(path.resolve(basePath, `release/app/sdk${curSDK}`)))
                .on('finish', function () {
                    iter++
                    if (config.hybrid.sdk[iter]) {
                        recursiveOutput(iter, cb)
                    } else {
                        fs.writeFileSync(path.resolve(basePath, './bin/version.map.js'), new Buffer(`
// this file will be changed automatically when hybrid-app is building 
module.exports = ${JSON.stringify(versionMapCache, null, 10)}
                        `))
                        cb()
                    }
                })
        }
        return new Promise(function (resolve, reject) {
            recursiveOutput(0, function () {
                resolve()
            })
        })
    }
    if (channel == 'wap') {
        return outputWap()
    } else if (channel == 'app') {
        return outputApp()
    }
}