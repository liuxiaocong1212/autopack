/*
 * @Author: zhaoye 
 * @Date: 2017-07-28 12:04:55 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-28 12:29:44
 */
import App from './index.vue'
import Vue from 'vue'
new Vue({
    components: {
        App,
    },
    el: '#app',
    render: h => h(App)
})