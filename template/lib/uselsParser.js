'use strict'
const autopackDLLScriptToken = /<.*?script/
const scriptToken = /<.*?script.*?>[\s\S]*?<\/.*?script.*?>/g
const linkToken = /(<.*?link[\s\S^<]*?>)/
const commentToken = /<!--[\s\S]*?-->/g
// compare link or other tag
const tagToken = /(<.*?link[\s\S^<]*?>)|(<[\s\S]+?>[\s\S]*?<\/[\s\S]+?>)/g
const startToken = /<!--.*?@start.*?-->/
const endToken = /<!--.*?@end.*?-->/
const methods = {
    targetToken: /<!--\s*?@compile\s*?\:\s*?(.*?)\s*?-->/,
    mtdToken: /<!--\s*?@([a-zA-z0-9_$]+)\s*?\:\s*?(.*?)\s*?-->/g,
}
const ii = 0
const getAutopackDLLScriptBlocks = function (source) {
    return getScriptTag(source).map(script => {
        // console.log(script)
        if (script.content.match(/data-base|data-main/)) {
            const dataBase = script.content.match(/data-base\s*=\s*['"](.*?)['"]/)[1]
            const dataMain = script.content.match(/data-main\s*=\s*['"](.*?)['"]/)[1]
            const src = script.content.match(/src\s*=\s*['"](.*?)['"]/)[1]
            return {
                start: script.start,
                end: script.end,
                dataBase,
                dataMain,
                src,
                content: script.content,
            }
        }
    }).filter(item => item)
}
/**
 *
 * @param {*} source
 */
function getScriptTag (source) {
    const scripts = []
    let content = source
    let script
    /**
     *
     * @param {*} length
     */
    function blockTokenString (length) {
        let str = ''
        for (let i = 0; i < length; i++) {
            str += '-'
        }
        return str
    }
    do {
        script = scriptGetter(content)
        if (script) {
            scripts.push(script)
            // 补位
            const cover = 1
            content = content.substring(0, script.start) + blockTokenString(script.end - script.start + cover) + content.substring(script.end + cover)
        }
    } while (script)
    return scripts
}
/**
 *
 * @param {*} source
 */
function scriptGetter(source) {
    const result = source.match(autopackDLLScriptToken)
    let buffer = ''
    let start = 0
    let end = 0
    let i
    if (result) {
        i = result.index
        start = result.index
        for (i; i < source.length; i++) {
            buffer += source[i]
            if (buffer.match(/<\/.*?script.*?>/)) {
                break
            }
        }
    } else {
        return false
    }
    end = i
    return {
        start,
        end,
        content: buffer,
    }
}
const Block = function Block(opt) {
    // compile target
    this.cplTar = opt.cplTar
    // compile method
    this.cplMtd = opt.cplMtd
}

const Scope = function Scope({code = '', subBlocks = [], type = 'normal', info = {}}) {
    this.code = code
    this.subBlocks = subBlocks
    this.type = type
    this.info = info
}
const getBlocks = function getBlocks(source) {
    const preBlocks = []
    // string cache
    let cache = ''
    // recoder
    const code = ''
    // stack counter
    let cnt = -1
    // parse
    for (let i = 0; i < source.length; i++) {
        cache += source[i]
        if (cnt >= 0) {
            setBlockCode(cnt, preBlocks, source[i])
        }
        if (startToken.test(cache)) {
            cnt++
            makeBlock(cnt, preBlocks)
            setBlockCode(cnt, preBlocks, cache.match(startToken)[0])
            cache = ''
            // dirty code
            // mark where subBlocks should be replaced
            if (cnt > 0) preBlocks[preBlocks.length - 1].code = preBlocks[preBlocks.length - 1].code.replace(/<!--.*?@start.*?-->$/, '<!--THIS_IS_WHERE_SUB_BLOCKS_NEED_TO_BE_REPLACED-->')
        } else if (endToken.test(cache)) {
            cache = ''
            cnt--
        }
    }
    // 标记块类型
    preBlocks.forEach(block => block.type == 'normal')
    // 开始检测是否有autopack的dll类型
    const autopackDLLScripts = getAutopackDLLScriptBlocks(source)
    autopackDLLScripts.forEach(script => {
        preBlocks.push(new Scope({
            type: 'autopackDLL',
            code: script.content,
            subBlocks: [],
            info: {
                start: script.start,
                end: script.end,
                dataBase: script.dataBase,
                dataMain: script.dataMain,
                src: script.src,
            },
        }))
    })
    return preBlocks
}
/**
 *
 * @param {*} cnt
 * @param {*} blocks
 */
function makeBlock(cnt, blocks) {
    if (cnt == 0) {
        blocks.push(new Scope({}))
    } else {
        cnt--
        makeBlock(cnt, blocks[blocks.length - 1].subBlocks)
    }
}
/**
 *
 * @param {*} cnt
 * @param {*} blocks
 * @param {*} code
 * @param {*} parent
 */
function setBlockCode(cnt, blocks, code, parent) {
    if (cnt == 0) {
        blocks[blocks.length - 1].code += code
        if (parent) {
            blocks[blocks.length - 1].parent = parent
        }
        // blocks[blocks.length-1].code = blocks[blocks.length-1].code//.replace(startToken,'').replace(endToken,'')
    } else {
        const _cnt = cnt - 1
        setBlockCode(_cnt, blocks[blocks.length - 1].subBlocks, code, blocks)
    }
}
/**
 *
 * @param {*} block
 */
function parseBlock(block) {
    let cplTar
    let cplMtd
    if (block.type == 'normal') {
        block.commands = {}
        if (methods.targetToken.test(block.code)) {
            cplTar = RegExp.$1
            block.commands['compile'] = cplTar.trim()
        } else {
            console.error(block.code)
            throw new Error('缺少编译目标语言')
        }
        block.code.match(methods.mtdToken).forEach(function (f) {
            methods.mtdToken.test(block.code)
            block.commands[RegExp.$1.trim()] = RegExp.$2.trim()
        })
        const tags = block.code.match(tagToken)
        if (tags) {
            block.tags = tags.map(function (tag) {
                if (block.commands.compile == 'js' && !tag.match(methods.mtdToken) && tag.match(linkToken)) {
                    throw new Error('编译目标语言错误，js中混杂css')
                } else if (block.commands.compile == 'css' && !tag.match(methods.mtdToken) && tag.match(scriptToken)) {
                    throw new Error('编译目标语言错误，css中混杂js')
                }
                return parseTag(tag)
            })
        }
        if (block.subBlocks.length > 0) {
            block.subBlocks.map(function (block) {
                return parseBlock(block)
            })
        }
    } else if (block.type == 'autopackDLL') {
    }
    // block.code is useless so delete it
    return block
}
/**
 *
 * @param {*} tagCode
 */
function parseTag(tagCode) {
    try {
        const tag = {}
        tag.tagName = /<\s*?([\w\d]+)/.test(tagCode) ? RegExp.$1 : null
        const attrToken = /<\s*?[a-zA-Z0-9]+\s*?([\w\d]+\=["'].*?["'])*?\s*?>/
        const attrs = tagCode.match(attrToken)[1] ? tagCode.match(attrToken)[1].match(/[\w\d]+\=["'].*?["']/g) : []
        attrs.forEach(function (attr) {
            const key = attr.match(/^([\w\d]+)/)[1].trim()
            const value = attr.match(/["'](.*?)["']/)[1].trim()
            tag[key] = value
        })
        if (!tag.href && !tag.src) {
            // pure code
            tag.code = tagCode.replace(/<[\s\S]*?>/, '').replace(/<\/[\s\S]*?>/, '')
        }
        return tag
    } catch (e) {
        console.error('打包语法错误')
        console.log(tagCode)
        console.log('文件: ', f.path)
        throw new Error(e)
    }
}
let f
module.exports = function (file) {
    f = file
    return getBlocks(String(file.contents)).map(function (block) {
        return parseBlock(block)
    })
}