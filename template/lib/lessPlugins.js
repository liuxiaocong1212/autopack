/*
 * @Author: zhaoye 
 * @Date: 2017-07-04 19:22:03 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-12-12 11:26:01
 */

const NpmImportPlugin = require('less-plugin-npm-import')
const LessPluginAutoPrefix = require('less-plugin-autoprefix')

const npmImportPlugin = new NpmImportPlugin({
    prefix: '~',
})
const autoprefixPlugin = new LessPluginAutoPrefix({
    browsers: ['iOS >= 8', 'Chrome >= 46', 'Firefox >= 41', 'Android >= 4.1'],
    flexbox: true,
})

const Lesshint = require('lesshint').Lesshint
const lesshint = new Lesshint()
lesshint.configure()

const plugins = [autoprefixPlugin, npmImportPlugin]

module.exports = plugins