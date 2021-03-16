/*
 * @Author: zhaoye 
 * @Date: 2017-10-13 17:25:18 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-10-16 11:41:16
 */

const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const dataURI = require('./dataURI.js')
/**
 * 
 * @param {*} content 
 * @param {*} filename 
 */
module.exports = (content, filename) => {
    return postcss([autoprefixer({
        browsers: ['Android >= 4.1', 'iOS >= 7'],
    }),
    dataURI]).process(content, {
        from: filename,
    })
}
