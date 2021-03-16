;
(function($, window, undefined) {

    var Location = function(options) {
        this.settings = $.extend({}, Location.defaults, options);
        this.init();
        _locationThis = this.settings;
    }

    Location.prototype = {

        init: function() {
            this.getLocation();
        },

        getLocation: function() {

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this._updateLocation, this._handleLocationError);
            } else {
                alert("亲,你的浏览器太烂了哦!");
            }
        },

        _handleLocationError: function(error) {
            switch (error.code) {
                case error.TIMEOUT:
                    //console.log("请求超时，请再尝试哦!");
                    break;
                case error.POSITION_UNAVAILABLE:
                    //console.log('对不起,获取您的定位失败!');
                    break;
                case error.PERMISSION_DENIED:
                    //console.log('您的定位服务未开启!');
                    break;
                case error.UNKNOWN_ERROR:
                    //console.log('对不起,未知的错误发生了哦!');
                    break;
            }
        },

        _updateLocation: function(position) {
            var lat = position.coords.latitude,
                lng = position.coords.longitude,
                url = 'index.php?ctl=location&act=gpsLocation&latitude=' + lat + '&longitude=' + lng;

            $.get(url, function(response) {
                var datas = JSON.parse(response);
                if (datas.error == 'ok') {
                    var data = datas.data;
                    $.cookie('gps_provinceid', data.provinceId, {
                        expires: 'd3',
                        path: '/',
                        domain:_locationThis.url,
                    });
                    $.cookie('gps_cityid', data.cityId, {
                        expires: 'd3',
                        path: '/',
                        domain:_locationThis.url,
                    });
                    $.cookie('gps_districtid', data.districtId, {
                        expires: 'd3',
                        path: '/',
                        domain:_locationThis.url,
                    });
                    $.cookie('gps_townid', data.townId, {
                        expires: 'd3',
                        path: '/',
                        domain:_locationThis.url,
                    });
                }
            });
        }

    }

    Location.defaults = {
        url:'',
    }

    var getLocation = function(options) {
        return new Location(options);
    }
    window.getLocation=getLocation;
})(window.Zepto, window);