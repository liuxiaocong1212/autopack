/*
 * @Author: zhaoye
 * @Date: 2018-02-22 13:47:10
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-22 17:05:15
 */
module.exports = function handlePrefixSameWithDevServer (url) {
    return url.replace(/\{JS_CDN_IP\}/g, '/js')
        .replace(/\{CSS_CDN_IP\}/g, '/style')
        .replace(/{PLUS_GOMEUI_CDN_IP}/g, '/node_modules/plus-public')
        .replace(/\{PLUS_CSS\}/g, '')
        .replace(/\{PLUS_JS\}/g, '')
        .replace(/\{APP_CDN_IP\}/g, '/images')
        .replace(/\{GOMEUI_CDN_IP\}/g, '/gomeUI')
        .replace(/\{PLUS_ANALYSIS_JS\}/g, '/lsrequire.js')
        .replace(/\{PLUS_JS_T\}/g, '')
        .replace(/\{PLUS_STATIC_RESOURCES\}/g, '')
        .replace(/^\//, '')
}