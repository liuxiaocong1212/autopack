/*
 * @Author: zhaoye 
 * @Date: 2017-07-28 11:40:14 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-10-13 18:47:30
 */
<template>
    <Page>
        <Button class="default" @click.native="onClick">打开侧滑层</Button>  
        <CImage :src="'//gfs17.gomein.net.cn/T1MHEvB4xv1RCvBVdK_400.jpg'"></CImage>
        <Aside ref="aslider">
            <Button @click.native="onClick2" class="default ff">modal</Button>
        </Aside>
    </Page>
</template>
<script>
import {Page, CImage, Aside, Button} from 'gome-ui-kit'
export default {
    components: {
        CImage,
        Page,
        Aside,
        Button,
    },
    methods: {
        onClick () {
            this.$refs.aslider.in()
        },
        onClick2 () {
            this.$Modal({
                content: 'modal',
                ok: 'ok',
                cancel: 'cancel'
            })
        }
    }
}
</script>
<style>
    .ff {
        width: 2rem;
    }
</style>
