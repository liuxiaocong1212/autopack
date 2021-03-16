/*
 * @Author: zhaoye
 * @Date: 2018-02-06 15:57:36
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-23 11:51:11
 */
const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const mkdirp = require('mkdirp')
const rmdir = require('rmdir')
const through2 = require('through2')
const {argv} = require('yargs')
const Vinyl = require('vinyl')

const rev = require('../rev-hash.js')
const parse = require('../uselsParser.js')
const getTagUrl = require('./getTagUrl.js')
const generateTagContent = require('./generateTagContent.js')
const handlePrefixSameWithDevServer = require('./handlePrefixSameWithDevServer.js')
const revExt = require('./revExt.js')
const dllRev = require('./dllRev.js')

module.exports = function ({
    basePath,
    manifest,
    config,
}) {
    // return new Promise (function (resolve, reject) {
        return gulp.src(config
                .hybrid
                .views
                .map(p => path.resolve(basePath, 'dist/views', p))
            )
            .pipe(dllRev({
                dlls: ['vendor.js', 'uiKit.js', 'bridge.js', 'utils.js'],
                manifest,
                config,
                basePath,
            }))
        // 生成revision和输出js css
            .pipe(through2.obj(function (chunk, enc, cb) {
                const blocks = parse(chunk) || []
                blocks.forEach(block => {
                    if (block.type == 'normal') {
                        if (block.commands.path) {
                            const files = []
                            block.tags.forEach(tag => {
                                const pathname = path.resolve(basePath, 'dist', handlePrefixSameWithDevServer(getTagUrl(block.commands.compile, tag)))
                                const revision = rev(fs.readFileSync(pathname))
                                manifest[pathname] = revision
                                const obj = new Object()
                                obj['pathname'] = pathname
                                obj['rev'] = revision
                                obj['releasePathname'] = path.resolve(basePath, `release/${config.domain}/src/${handlePrefixSameWithDevServer(getTagUrl(block.commands.compile, tag)).replace(/^\//, '')}`)
                                files.push(obj)
                                tag.rev = revision
                            })
                            const file = new Vinyl({
                                base: '/',
                                cwd: `/`,
                                path: revExt(`/${handlePrefixSameWithDevServer(getTagUrl(block.commands.compile, tag)).replace(/^\//, '')}`, block.rev),
                                contents: fs.readFileSync(item.pathname)
                            })
                            this.push(file)
                            // files.forEach(item => {
                            //     mkdirp(path.dirname(item.releasePathname), () => {
                            //         fs.writeFileSync(revExt(item.releasePathname, item.rev), fs.readFileSync(item.pathname))
                            //     })
                            // })
                        } else if (block.commands.file) {
                            let comboStr = ''
                            block.tags.forEach(tag => {
                                const pathname = path.resolve(basePath, 'dist', handlePrefixSameWithDevServer(getTagUrl(block.commands.compile, tag)))
                                comboStr += `/*${tag.href}*/${  String(fs.readFileSync(pathname))}`
                            })
                            block.rev = rev(comboStr)
                            manifest[block.commands.file] = block.rev
                            const releasePathname = path.resolve(basePath, `release/${config.domain}/src/${handlePrefixSameWithDevServer(block.commands.file)}`)
                            // mkdirp(path.dirname(releasePathname), () => {
                            //     fs.writeFileSync(revExt(releasePathname, block.rev), comboStr)
                            // })
                            const file = new Vinyl({
                                base: '/',
                                cwd: `/`,
                                path: revExt(`/${handlePrefixSameWithDevServer(block.commands.file)}`, block.rev),//revExt(releasePathname, block.rev),
                                contents: new Buffer(comboStr)//fs.readFileSync(item.pathname)
                            })
                            this.push(file)
                        }
                    } else if (block.type == 'autopackDLL') {
                        const pathname = path.resolve(basePath, 'dist', block.info.dataMain.replace(/^\//, ''))
                        block.rev = rev(fs.readFileSync(pathname))
                        manifest[pathname] = block.rev
                        const releasePathname = path.resolve(basePath, `release/${config.domain}/src/${handlePrefixSameWithDevServer(block.info.dataMain).replace(/^\//, '')}`)
                        const content = String(fs.readFileSync(pathname))
                        // mkdirp(path.dirname(releasePathname), () => {
                        //     fs.writeFileSync(revExt(releasePathname, block.rev), content)
                        // })
                        const file = new Vinyl({
                            base: '/',
                            cwd: `/`,
                            path: revExt(`/${handlePrefixSameWithDevServer(block.info.dataMain).replace(/^\//, '')}`, block.rev),//revExt(releasePathname, block.rev),
                            contents: new Buffer(content)//fs.readFileSync(item.pathname)
                        })
                        this.push(file)
                    }
                })
                chunk.blocks = blocks
                cb(null, chunk)
            }))
            // .pipe(gulp.dest(path.resolve(basePath, `release/_wap_/${config.domain}/src`)))
            // .pipe(gulp.dest(path.resolve(basePath, `release/_app_/${config.domain}/src`)))
            // .on('finish', () => {
            //     resolve()
            // })
    // })
}
