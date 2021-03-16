/*
 * @Author: zhaoye
 * @Date: 2017-11-02 11:46:01
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-22 17:03:53
 */

// 修改自 https://github.com/sindresorhus/rev-hash/
// 把版本号10字符改为12字符
'use strict'
const crypto = require('crypto')

module.exports = input => {
    if (typeof input !== 'string' && !Buffer.isBuffer(input)) {
        throw new TypeError('Expected a Buffer or string')
    }

    return crypto.createHash('md5').update(input).digest('hex').slice(0, 10)
}