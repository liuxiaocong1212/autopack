/*
 * @Author: zhaoye 
 * @Date: 2018-02-23 13:29:20 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-23 13:32:29
 */
const {argv} = require('yargs')
const through2 = require('through2')
const revExt = require('./revExt.js')
const generateTagContent = require('./generateTagContent.js')
module.exports = function ({
    basePath,
    manifest,
    config,
    channel,
}) {
    return through2.obj(function (chunk, enc, cb) {
        const prefixies = config.hybrid.prefix[channel][argv.env]
        let content = String(chunk.contents)
        const blocks = chunk.blocks || []
        blocks.forEach(block => {
            let newCode = ''
            if (block.type == 'normal') {
                const ext = block.commands.compile
                // 合并
                if (block.commands.file) {
                    let outputUrl
                    Object.keys(prefixies).map(key => {
                        if (block.commands.file.match(new RegExp(key))) {
                            outputUrl = block.commands.file.replace(key, prefixies[key])
                        }
                    })
                    newCode = generateTagContent(ext, revExt(outputUrl, block.rev))
                }
                // 不合并
                if (block.commands.path) {
                    let tagContents = ''
                    // 输出combo形式的标签
                    if (block.commands.combo) {
                        Object.keys(prefixies).map(key => {
                            if (block.commands.path.match(new RegExp(key))) {
                                tagContents = `${block.commands.path.replace(key, prefixies[key])}??`
                            }
                        })
                    }
                    block.tags.forEach(tag => {
                        let outputUrl
                        const tagUrl = getTagUrl(block.commands.compile, tag)
                        Object.keys(prefixies).map(key => {
                            if (tagUrl.match(new RegExp(key))) {
                                if (block.commands.combo) {
                                    outputUrl = `${tagUrl.replace(key, '').replace(/^\//, '')  },`
                                    tagContents += revExt(outputUrl, tag.rev)
                                } else {
                                    outputUrl = revExt(tagUrl.replace(key, prefixies[key]), tag.rev)
                                    tagContents += `${generateTagContent(block.commands.compile, outputUrl)  }\n`
                                }
                            }
                        })
                    })
                    if (block.commands.combo)
                        newCode = generateTagContent(block.commands.compile, tagContents.replace(/,$/, ''))
                }
            } else if (block.type == 'autopackDLL') {
                const rootUrl = prefixies[block.info.dataBase]
                const jsUrl = revExt(block.info.dataMain.replace(/^\//, ''), block.rev)
                newCode = `
                <script src="${rootUrl}/js/dll/${config.domain}/vendor.${manifest['vendor.js']}.js"></script>
                <script src="${rootUrl}/js/dll/${config.domain}/utils.${manifest['utils.js']}.js"></script>
                <script src="${rootUrl}/js/dll/${config.domain}/bridge.${manifest['bridge.js']}.js"></script>
                <script src="${rootUrl}/js/dll/${config.domain}/uiKit.${manifest['uiKit.js']}.js"></script>
                <script src="${rootUrl}/${jsUrl}"></script>
            `
            }
            if (newCode)
                content = content.replace(block.code, newCode)
        })
        chunk.contents = new Buffer(content)
        cb(null, chunk)
    })
}