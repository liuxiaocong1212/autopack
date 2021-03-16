/*
 * @Author: zhaoye 
 * @Date: 2017-06-17 19:49:27 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-10-16 11:23:31
 */
// const fslist = require('ls-all')
const fs = require('fs')
const path = require('path')

// const srcPath = path.resolve(__dirname, '../src')
// module.exports = function() {
//     return fslist([srcPath], {recurse: true, flatten: true})
//         .then(files => {
//             const result = {}
//             files.forEach(file => {
//                 const isFile = fs.lstatSync(file.path).isFile()
//                 if(!isFile)return
//                 if(!file.path.match(/\.entry\.js$/))return
//                 if(path.extname(file.path) != '.js')return
//                 const filepath = file.path.replace(srcPath, '').replace(/\\{1,2}/g, '/').replace(/(\/|\\)?/,'')
//                 result[filepath] = file.path
//             })
//             return result
//         })
//     }
const entryConfig = require('../.entryrc.js')

module.exports = function () {
    return new Promise((resolve, reject) => {
        const result = {

        }
        entryConfig.entries.forEach((entry) => {
            result[entry] = path.resolve(entryConfig.path, entry)
        })
        if (entryConfig.entries.length > 0) {
            resolve({
                entries: result,
                domain: entryConfig.domain,
            })
        } else {
            console.log('no webpack entry')
            resolve({
                entries: null,
            })
        }
    })
}