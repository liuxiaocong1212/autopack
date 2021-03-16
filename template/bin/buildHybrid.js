/*
 * @Author: zhaoye
 * @Date: 2018-02-06 15:57:36
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-04-11 15:57:04
 * 尝试性的，把hybrid的流程集成到autopack中了，但是还有很多不完善的地方，不写注释了，估计后面没人维护了
 */
const reformDIRStructure = require('../lib/hybrid/reformDIRStructure.js')
const reformByChannelAndSDK = require('../lib/hybrid/reformByChannelAndSDK.js')
const regenerateHtml = require('../lib/hybrid/regenerateHtml.js')
const path = require('path')
const through2 = require('through2')
const {argv} = require('yargs')
const gulp = require('gulp')

const basePath = path.resolve(__dirname, '..')
let manifest = {}
const config = require('../.entryrc.js')
// 中途装填
const versionMap = require('./version.map.js')
config.hybrid.versionMap = versionMap
const rmdir = require('rmdir')

rmdir(path.resolve(basePath, 'release'), () => {
    function recusiveBuild (iter) {
        const channel = config.hybrid.channel[iter]
        reformDIRStructure({
            basePath,
            manifest,
            config,
        })
            .pipe(regenerateHtml({
                basePath,
                manifest,
                config,
                channel,
            }))
            .pipe(gulp.dest(path.resolve(basePath, `release/_${channel}_/${config.domain}/src`)))
            .on('finish', () => {
                reformByChannelAndSDK({
                    basePath,
                    manifest,
                    config,
                    channel,
                })
                    .then(() => {
                        rmdir(path.resolve(basePath, `release/_${channel}_`), () => {
                            console.log(`构建完成：${  channel}`)
                            iter++
                            if (iter >= config.hybrid.channel.length) {
                                console.log('全部构建完成')
                            } else {
                                manifest = {}
                                recusiveBuild(iter)
                            }
                        })
                    })
            })
    }
    recusiveBuild(0)
})
