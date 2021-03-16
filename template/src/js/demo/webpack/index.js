/*
 * @Author: zhaoye 
 * @Date: 2017-07-28 12:04:55 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-08-17 19:21:10
 */
import App from './index.vue'
import Vue from 'vue'
import http from 'gome-utils-http'

http({
    url: 'http://localhost:3000/aaa',
    type: 'post',
    data: {
        ddd: '222'
    },
    payload: 'Y',
})
new Vue({
    components: {
        App,
    },
    el: '#app',
    render: h => h(App)
})