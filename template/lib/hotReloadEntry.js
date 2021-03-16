/*
 * @Author: zhaoye 
 * @Date: 2017-07-03 16:28:57 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-10-16 11:23:51
 */
const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
hotClient.subscribe(function (event) {
    if (event.action === 'reload') {
        window.location.reload()
    }
})
