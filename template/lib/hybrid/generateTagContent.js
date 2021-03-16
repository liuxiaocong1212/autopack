/*
 * @Author: zhaoye
 * @Date: 2018-02-22 13:46:08
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-22 17:05:13
 */

module.exports = function generateTagContent (ext, url) {
    if (ext.match(/css$/)) {
        return `<link rel="stylesheet" href="${url}">`
    }
    if (ext.match(/js$/)) {
        return `<script src="${url}"></script>`
    }
}