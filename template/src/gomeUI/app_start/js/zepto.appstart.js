/*
* @Author: lizhiyang
* @Date:   2015
* @Last Modified by: zhaoye
* @Last modified time: 2016-6-13 15:43;
*/
;(function ($, window, undefined) {
    var AppStart = function (element, options) {
        this.settings = $.extend({}, AppStart.defaults, options);
        this.$element = $(element);
        this.openState = false;
        this.init();
        }
    //下载的url
    var dUrl = 'http://shouji.gomeplus.com/kd/PWAP.html';
    AppStart.prototype = {
        init: function () {
            if(this.settings && this.settings.type == 'auto'){
                //this.$element.on('click',$.proxy(this.autoAppStart, this)); 
                //this.$element.trigger('click')
                this.autoAppStart();
            }else{
                this.$element.on('click', $.proxy(this.appStart, this))
            }
        },
        //普通唤醒，之后又下载的
        appStart: function () {
            //定义唤醒scheme url
            //在线
            if(window.location.host.match(/gome\.com\.cn|atguat\.com\.cn/)){
                var search = location.search ? location.search : '?browserSkipType=10&cmpid=wap_banner';
                //var ios_native_url = 'GomeEShop://home' + search;
                //var andriod_native_url = 'gomeeshop://home' + search;
                
                var ios_native_url = 'gomeplusapp://m.gomeplus.com/index.html';
                var andriod_native_url = 'gomeplusapp://m.gomeplus.com/index.html';
            }else{
            //美信
                var ios_native_url = 'gomeplusapp://m.gomeplus.com/index.html';
                var andriod_native_url = 'gomeplusapp://m.gomeplus.com/index.html';
            }
            //微信唤醒url就是下载url
            var weinxin_native_url = dUrl;
            //只下载模式
            var andriod_download_url = dUrl;
            var ios_download_url = dUrl;
            if(this.settings && this.settings.url){
            //自定义url模式
                var andriod_download_url = this.settings.url;
                var ios_download_url = this.settings.url;
            }
            config_obj = {
                iosInstallUrl: ios_download_url,
                androidInstallUrl: andriod_download_url,
                iosNativeUrl: ios_native_url,
                andriodNativeUrl: andriod_native_url,
                packages: 'com.gome.eshopnew',
                weixinNativeUrl: weinxin_native_url
            };
            this.redirectToNative(config_obj);
        },
        //唤醒不下载
        autoAppStart: function(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua && ua.match(/gome/i)){return};
            if(ua.indexOf('ucbrowser')>-1
                ||ua.indexOf('mqqbrowser')>-1
                ||ua.indexOf('iphone')>-1
                ||ua.indexOf('sogoumobilebrowser')>-1){
                    if( ua.indexOf('micromessenger')>-1
                        || ua.indexOf('mqqbrowser qq')>-1){
                        return
                    };
                var href = location.href;
                var realHref = location.pathname;
                if(window.location.host.match(/gome\.com\.cn|atguat\.com\.cn/)){
                    var ios_native_url = "gomeplusapp://" + href.split(/http[s]?:\/\//)[1];
                    var andriod_native_url = "gomeplusapp://" + href.split(/http[s]?:\/\//)[1];
                }else{
                    var ios_native_url = "gomeplusapp://" + href.split(/http[s]?:\/\//)[1];
                    var andriod_native_url = "gomeplusapp://" + href.split(/http[s]?:\/\//)[1];
                }
                
                if(this.settings && this.settings.url){
                //自定义url模式
                    var ios_native_url = this.settings.url;
                    var andriod_native_url = this.settings.url;
                }
                var andriod_download_url = '';
                var ios_download_url = '';
                config_obj = {
                    iosInstallUrl: ios_download_url,
                    androidInstallUrl: andriod_download_url,
                    iosNativeUrl: ios_native_url,
                    andriodNativeUrl: andriod_native_url,
                    packages: "com.gome.eshopnew"
                };
                this.redirectToNative(config_obj);
            }else{
                return
            }         
        },
        //唤醒
        redirectToNative: function (config) {
            var userAgent = this._UA();

            if (!userAgent) {
                return
            }
            if (userAgent == 'ios') {
                this.installUrl = config.iosInstallUrl;
                this.nativeUrl = config.iosNativeUrl;
                this.openTime = config.iosOpenTime || 3000;
            } else if (userAgent == 'weixin') {
                this.nativeUrl = config.weixinNativeUrl;
            } else {
                this.installUrl = config.androidInstallUrl;
                this.nativeUrl = config.andriodNativeUrl;
                this.openTime = config.androidOpenTime || 3000;
                this.packages = config.packages || 'com.gome.eshopnew';
            }
            //只有android下的chrome要用intent协议唤起native
            this._gotoNative();
            
        },
        _UA: function () {
            var ua = navigator.userAgent;
            var ua_low = navigator.userAgent.toLowerCase();
            if (ua_low.match(/MicroMessenger/i) == 'micromessenger') {
                return 'weixin';
            } else {
                if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    return 'ios';
                } else if (!!ua.match(/Android/i)) {
                    return 'android';
                } else {
                    return '';
                }
            }

        },
        //唤醒？
        _gotoNative: function () {
            //设置cookie
            function setCookie(name,value,domain)
            {
                var Days = 7;
                var exp = new Date();
                exp.setTime(exp.getTime() + Days*24*60*60*1000);
                document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/;domain="+domain;
            }
            //获取cookie
            function getCookie(name)
            {
                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg)){
                    return unescape(arr[2]);
                }else{
                    return null;
                }
            }

            if (this.settings && this.settings.type == 'download') {
                var _this = this,
                    startTime = Date.now(),
                    iframe = document.createElement('iframe');
                var a = document.createElement('a');
                iframe.id = 'J_redirectNativeFrame';
                iframe.style.display = 'none';
                iframe.src = this.nativeUrl;
                /*a.href = this.nativeUrl;;
                a.click();*/
                $('body').append(iframe);
                setTimeout(function () {
                    document.body.removeChild(iframe);
                    _this._gotoDownload(startTime);
                }, this.openTime);
            }else {
                if(this.settings && this.settings.type == "auto"){
                    var awaken = getCookie('awaken');
                    if(!!awaken){
                        return;
                    }
                    
                    if(location.hostname.indexOf('.gome.com.cn') != -1){
                        setCookie('awaken','true','.gome.com.cn');
                    }else if(location.hostname.indexOf('.gomeplus.com') != -1){
                        setCookie('awaken','true','.gomeplus.com');
                    }else if(location.hostname.indexOf('.uatplus.com') != -1){
                        setCookie('awaken','true','.uatplus.com');
                    }else if(location.hostname.indexOf('.atguat.com.cn') != -1){
                        setCookie('awaken','true','.atguat.com.cn');
                    }else if(location.hostname.indexOf('.plus.com.cn') != -1){
                        setCookie('awaken','true','.plus.com.cn');
                    }else if(location.hostname.indexOf('.tslive.com.cn') != -1){
                        setCookie('awaken','true','.tslive.com.cn');
                    }
                }

                var _this = this,
                    startTime = Date.now(),
                    iframe = document.createElement('iframe');
                iframe.id = 'J_redirectNativeFrame';
                iframe.style.display = 'none';
                iframe.src = this.nativeUrl;
                if(navigator.userAgent.match(/android/i)){
                    $('body').append(iframe);
                }else{
                    location.href = this.nativeUrl;
                }
                setTimeout(function () {
                    if(navigator.userAgent.match(/android/i))
                        $(iframe).remove();
                    //唤醒模式也会进来这个方法
                    //屏蔽下
                    if(_this.settings && _this.settings.type == "auto"){
              
                        //do nothing
                    }
                    else{
                        _this._gotoDownload(startTime);
                    }
                }, this.openTime);
            }
        },

        _gotoDownload: function (startTime) {
            var endTime = Date.now();
            if (endTime - startTime < this.openTime + 500) {
                window.location.href = dUrl;
            }
        }

    }

    AppStart.defaults = {}

    $.fn.appstart = function (options) {
        return this.each(function () {
            var appstart = new AppStart(this, options);
            return;
        });
    };
})(window.Zepto, window);