/*
 * @Author: zhaoye
 * @Date: 2018-02-22 15:02:01
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-22 17:05:21
 */
/**
 * 版本号自动升级
 * @param {string} version
 */
module.exports = function versionUp (version) {
    const integer = Number(version.split('.')[0])
    const float   = Number(version.split('.')[1])
    let newFloat = float
    let newInteger = integer
    if (float < 99) {
        newFloat++
    } else {
        newInteger++
        newFloat = 0
    }
    let result = ''
    if (newFloat < 10) {
        result = `${newInteger}.0${newFloat}`
    } else {
        result = `${newInteger}.${newFloat}`
    }
    return result
}