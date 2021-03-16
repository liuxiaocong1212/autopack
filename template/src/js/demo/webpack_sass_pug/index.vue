/*
 * @Author: zhaoye 
 * @Date: 2017-07-28 12:16:50 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-28 12:25:00
 */
<template lang="pug">
    div#app
        div {{content}}
</template>
<script>
export default {
    data () {
        return {
            content: 'this is a pug sass demo'
        }
    }
}
</script>
<style lang="scss">
    $a: #ff5c5c;
    #app {
        color: $a;
    }
</style>

