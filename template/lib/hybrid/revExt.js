/*
 * @Author: zhaoye
 * @Date: 2018-02-22 13:44:13
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-22 17:05:19
 */
const path = require('path')
module.exports = function revExt (url, rev) {
    const ext = path.extname(url)
    return url.replace(ext, `.${rev}${ext}`)
}