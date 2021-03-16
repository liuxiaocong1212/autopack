/*
 * @Author: zhaoye
 * @Date: 2018-02-22 13:46:29
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-22 17:05:14
 */
module.exports = function getTagUrl (ext, tag) {
    if (ext.match(/css$/)) {
        return tag.href
    }
    if (ext.match(/js$/)) {
        return tag.src
    }
}