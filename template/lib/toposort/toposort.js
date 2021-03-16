
const crequire = require('crequire')
const fs = require('fs')
const path = require('path')

const cwd = path.join(__dirname, '../..')

const aliasPath = {

}

module.exports = function(filepath) {
    const depsTree = {

    }
    const depIdx = 0
    // 顶点表
    const vertexList = []
    /**
     * 
     * @param {*} node 
     */
    function getLastLinkNode (node) {
        if (!node.next) return node
        return getLastLinkNode(node.next)
    }

    // 已经访问过的文件的set，防止重复访问
    const visitedFileList = {

    }
    let fileCnt = 0

    // 排序栈 
    const stack = []

    // 排好序的队列
    const queue = []
    /**
     * 
     * @param {*} filepath 
     * @param {*} base 
     * @param {*} isEntry 
     */
    function parse (filepath, base, isEntry) {
        let contents = fs.readFileSync(filepath, 'utf-8')
        // 加入了入口的判断，主要是为了，自动插入polyfill
        if (isEntry) {
            contents = require('../prePolyfill.js') + contents
        }
        let deps
        if (!filepath.match(/gome-bridge-core/)) {
            deps = crequire(contents)
        } else {
            deps = []
        }
        if (!visitedFileList[filepath]) {
            visitedFileList[filepath] = fileCnt
            fileCnt++
            deps.forEach((dep, index) => {
                let _filepath
                // 相对路径咯
                if (dep.path.match(/^\./)) {
                    if (dep.path.match(/\.js$/)) {
                        _filepath = path.resolve(path.dirname(filepath), dep.path)
                    } else {
                        let nodeModule = ''
                        if (dep.path.match(/node_modules/)) {
                            nodeModule = 'node_modules/'
                        }
                        if (fs.existsSync(path.resolve(path.dirname(filepath), `${dep.path}.js`))) {
                            _filepath = path.resolve(path.dirname(filepath), `${dep.path}.js`)
                            aliasPath[dep.path] = `${nodeModule + dep.path  }.js`
                        } else {
                            _filepath = path.resolve(path.dirname(filepath), dep.path, 'index.js')
                            aliasPath[dep.path] = `${nodeModule + dep.path  }/index.js`
                        }
                    }
                // node_modules直接引用咯
                } else if (!dep.path.match(/^\./) && dep.path.match(/\.js$/)) {
                    _filepath = path.resolve(cwd, 'node_modules', dep.path)
                // node_modules自己从package.json里找入口咯
                } else {
                    const pkgJSONPath = path.resolve(cwd, 'node_modules', dep.path, 'package.json')
                    /**
                     * 
                     */
                    function getNodeModuleDefault() {
                        if (fs.existsSync(path.resolve(cwd,  'node_modules', `${dep.path}.js`))) {
                            _filepath = path.resolve(cwd,  'node_modules', `${dep.path }.js`)
                            aliasPath[dep.path] = `${dep.path  }.js`
                        } else {
                            _filepath = path.resolve(cwd,  'node_modules', dep.path, 'index.js')
                            aliasPath[dep.path] = `${dep.path  }/index.js`
                        }
                    }
                    const pkgJSONExist = fs.existsSync(pkgJSONPath)
                    // console.log(pkgJSONExist)
                    if (pkgJSONExist) {
                        const config = JSON.parse(String(fs.readFileSync(pkgJSONPath)))
                        if (config.main) {
                            _filepath = path.resolve(cwd, 'node_modules', dep.path, config.main)
                            aliasPath[dep.path] = `${dep.path  }/${  config.main}`
                        } else {
                            getNodeModuleDefault()
                        }
                    } else {
                        getNodeModuleDefault()
                    }

                }
                parse(_filepath, path.dirname(_filepath))
            })
        }

    }

    parse(path.resolve(cwd, 'src', filepath.replace(/^\//, ''))
        , path.resolve(cwd, 'src')
        , true)
    const arr = []
    for (const key in visitedFileList) {
        arr.push(key)
    }
    return {
        result: arr.map(item => {return item.replace(path.resolve(cwd, 'src'), '').replace(/^.*node_modules/, 'node_modules').replace(/\\/g, '/').replace(/^\//, '')}),
        aliasPath,
    }
}
