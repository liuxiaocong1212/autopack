/*
 * @Author: zhaoye 
 * @Date: 2017-04-17 16:42:41 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-10-16 11:22:44
 */
const fs = require('fs')
const path = require('path')

const modules = [
    {
        id: 'zepto',
        alias: '$',
    }
]

const shim = {

}

modules.forEach((module) => {
    if (fs.existsSync(path.resolve(__dirname, '../node_modules', module.id))) {
        const pkgJSONPath = path.resolve(__dirname, '..', 'node_modules', module.id, 'package.json')
        const config = JSON.parse(String(fs.readFileSync(pkgJSONPath)))
        let filepath = ''
        if (config.main) {
            filepath = `/node_modules/${  module.id  }/${  config.main}`
        } else {
            filepath = `/node_modules/${  module.id  }/index.js`
        }
        shim[filepath] = module
    }
})

module.exports = shim