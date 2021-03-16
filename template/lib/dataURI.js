const postcss = require('postcss')
const fs = require('fs')
const path = require('path')
module.exports = postcss.plugin('postcss-base64-uri', rr => {
    return (root, result) => {
        root.walkDecls(decl => {
            if (decl.value.match(/data-uri/)) {
                const imgPath = path.resolve(path.dirname(root.source.input.file), decl.value.replace(/\'|\"/g, '').replace(/data-uri/g, '').replace(/\(|\)/g, ''))
                const bitmap = fs.readFileSync(imgPath)
                const base64Str = new Buffer(bitmap).toString('base64')
                const ext = path.extname(imgPath)
                decl.value = `url(data:image/${ext};base64,${base64Str})`
            }
        })
    }
})