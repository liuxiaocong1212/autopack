(function($, window) {
    var starttx, startty;
    var tabClick = function(element, options) {
        this.$element = $(element);
        this.init();
    }
    tabClick.prototype = {
        init: function() {

            var tabDiv = this.$element.parent().parent();
            if (tabDiv.hasClass('tab_nav_swipe')) {
                this.$element.on('click', this.toggle);
            } else {
                this.$element.on('touchstart', this.toggle);
                this.$element.on('touchend', this.toggle);
                this.$element.on('mousedown', this.toggle);
                this.$element.on('mouseup', this.toggle);
            }
        },
        toggle: function() {
            $(this).find('a').addClass('active');
            $(this).siblings().find('a').removeClass('active');
        }
    }
    $.fn.tabclick = function(options) {
        return this.each(function() {
            this.__tabItem = new tabClick(this, options);
            return;
        });
    };
})(window.Zepto, window);
/*
 * addrSelect四级地址功能插件
 * @Author: baishuang
 * @Date:   2016/5/25 14:20:00
 * @Last Modified by:   zhaoye-ds1
 * @Last Modified time: 2016-10-26 13:41:47
 */
(function($, window) {
    var starttx, startty;
    var tabClick = function(element, options) {
        this.$element = $(element);
        this.init();
    }
    tabClick.prototype = {
        init: function() {

            var tabDiv = this.$element.parent().parent();
            if (tabDiv.hasClass('tab_nav_swipe')) {
                this.$element.on('click', this.toggle);
            } else {
                this.$element.on('touchstart', this.toggle);
                this.$element.on('touchend', this.toggle);
                this.$element.on('mousedown', this.toggle);
                this.$element.on('mouseup', this.toggle);
            }
        },
        toggle: function() {
            $(this).find('a').addClass('active');
            $(this).siblings().find('a').removeClass('active');
        }
    }
    $.fn.tabClick = function(options) {
        return this.each(function() {
            this.__tabItem = new tabClick(this, options);
            return;
        });
    };
})(window.Zepto, window);
!(function ($, window, undefined) {
    var seled_value = {
            prov: {},
            city: {},
            county: {},
            town: {}
        };
        back_sign = 3;
    var isLastSelected=0;//是否选择到了最后一级，0没有选择到，1选择到；
    var seleData;
    var Addr = function (ele, options) {
        var sele_ele=ele;
        $(ele).click(function () {
            this_ele=$(this);   
            var $addr_aslider = $(".addr_aslider"),
                $loading = $addr_aslider.find('.loading'),
                $addr_list_box = $addr_aslider.find('.addr_list_box'),
                $addr_list = $addr_list_box.find('.addr_list'),
                $addr_swipe = $addr_aslider.find(".tab_addr_swipe"),
                $addr_selected_list = $addr_swipe.find(".addr_selected_list"),
                $addr_selected_item = $addr_selected_list.find('li a');
            $addr_aslider.css('display','block');
            $addr_selected_list.find("li").tabClick();
            $addr_selected_list.on('click', 'li', autoSlider);

            var addr_list_num = $addr_list.length,
                addr_list_width = $addr_aslider.find('.wrapper').width();
            $addr_list.css('width', addr_list_width);
            $addr_list_box.css('width', addr_list_num * addr_list_width);

            window.addEventListener('orientationchange', function (event) {
                addr_list_num = $addr_list.length;
                addr_list_width = $addr_aslider.find('.wrapper').width();
                $addr_list.css('width', addr_list_width);
                $addr_list_box.css('width', addr_list_num * addr_list_width);

            });
            var isdefault = (isLastSelected=='1')?0:options.isdefault; //是否有默认地址  1有，0无
            var addr_type = (options.addr_type) ? options.addr_type : 0; //业务配置，1节能补贴，2退换货，0普通四级
            var level1 = options.level1,
                level2 = options.level2,
                level3 = options.level3,
                level4 = options.level4;
            var url = options.url;

            if ($addr_aslider.data('flag') == 0) {
                //load(seleData);
                tabChange($addr_list_box, 3);
            }
            if ($addr_aslider.data('flag') == 1) {
                if (isdefault == '1') {
                    $loading.css('display', 'block');
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {
                            pid: "",
                            lv_one: level1,
                            lv_two: level2,
                            lv_thr: level3,
                            lv_fou: level4,
                            addr_type:addr_type
                        },
                        dataType: 'json',
                        success: function (data) {
                            $loading.hide();
                            load(data);
                            var firstSlider = $addr_swipe.attr('data-first');
                            if (firstSlider != '' || firstSlider != 'null') {
                                tabChange($addr_list_box, firstSlider);
                            }
                        },
                        error: function () {
                            alert("请求数据失败");
                        }
                    })
                } else {
                    $loading.css('display', 'block');
                    for(var i=0;i<addr_list_num;i++){
                        $addr_selected_item.eq(i).html('');
                        $addr_list.eq(i).html('');
                    }
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {
                            pid: "",
                            addr_type:addr_type
                        },
                        dataType: 'json',
                        success: function (data) {
                            $loading.hide();
                            if (data.isSuccess == 'Y') {
                                $addr_aslider.data('flag', '0');
                                $addr_selected_item.eq(0).html('请选择');
                                tabChange($addr_list_box, 0);
                                var node='';
                                for (var i = 0; i < data.areaLv1.length; i++) {
                                    node+= '<li class="flexbox v_center">' + '<span class="flex1" data-code=' + data.areaLv1[i].code + ' data-current=' + data.areaLv1[i].current + '>' + data.areaLv1[i].name + '</span>' + '</li>'
                                    
                                }
                                $addr_aslider.find('.areaLv1_list').html(node);
                            }
                        },
                        error: function () {
                            alert("请求数据失败");
                        }
                    })

                }

                /*选择省市区操作*/
                $addr_list.on('click', 'li', function () {
                    if ($(this).find('span').data('current')==false) {
                         var parent_code = $(this).find('span').attr('data-code');
                        active(parent_code, $(this))
                        addrSlider($(this).parents('ul').next());
                    }
                })

                /*tab导航点击操作*/
                $addr_selected_list.on('click', 'li', function () {
                    var index = $(this).index();
                    addrSlider($(this));
                    $addr_list.css('height', '1px');
                    $addr_list.eq(index).css('height', 'auto');
                })

                /*选择不完全操作*/
                $addr_aslider.find('.close').click(function () {
                    if(isLastSelected=='0'){
                        $addr_aslider.data('flag', '1');
                    }else{
                        $addr_aslider.data('flag', '0');
                    }
                    
                })
            }

            /*函数 默认加载*/
            function load(data) {
                if (data.isSuccess == 'Y') {
                    $addr_aslider.data('flag', '0');
                    for (var j = 1; j < data.levels.split(',').length + 1; j++) {
                        var node='';
                        for (var i = 0; i < data['areaLv' + j].length; i++) {
                            if (data['areaLv' + j][i].current == true) {
                                var name = data['areaLv' + j][i].name;
                                $addr_aslider.find('.areaLv' + j + ' a').html(name);
                                node+= '<li class="active flexbox v_center">' + '<span class="flex1" data-code=' + data['areaLv' + j][i].code + ' data-current=' + data['areaLv' + j][i].current + '>' + data['areaLv' + j][i].name + '</span>' + '<i data-icon="&#x0041;"></i>' + '</li>'
                                seledValue(j - 1, data['areaLv' + j][i].name, data['areaLv' + j][i].code);
                            } else {
                                node+= '<li class="flexbox v_center">' + '<span class="flex1" data-code=' + data['areaLv' + j][i].code + ' data-current=' + data['areaLv' + j][i].current + '>' + data['areaLv' + j][i].name + '</span>' + '</li>'
                            }
                        }
                        $addr_aslider.find('.areaLv' + j + '_list').html(node);
                    }
                }
            }

            /*函数 tab切换*/
            function tabChange(ele, num) {
                addrSlider(ele, num);
                newSwiper(num);
                $addr_swipe.get(0).swiper.slideTo(num);
                $addr_list.css('height', '1px');
                $addr_list.eq(num).css('height', 'auto');
            }

            /*函数 四级主体切换滑动效果*/
            function addrSlider(ele, num) {
                var index = ele.index();
                var dd = addr_list_width * index;
                var translate = "translate3d(-" + dd + "px,0,0)";
                $addr_selected_item.removeClass('active');
                if (num) {
                    var translate = "translate3d(-" + addr_list_width * num + "px,0,0)";
                    $addr_selected_item.eq(num).addClass('active');
                } else {
                    $addr_selected_item.eq(index).addClass('active');
                }
                $addr_list_box.css({
                    "-webkit-transform": translate,
                    "-moz-transform": translate,
                    "-ms-transform": translate,
                    "transform": translate,
                })
            }

            /*函数 选中效果*/
            function active(code, ele) {
                var sele_node = '<i data-icon="&#x0041;"></i>';
                ele.parent().children('li').removeClass('active').children('i').remove();
                ele.addClass('active').append(sele_node);
                ele.find('span').attr('data-current', 'true').parent().siblings().find('span').attr('data-current', 'false');

                var index = ele.parent().index();
                var sele_name = ele.find('span').html(),
                    sele_code = String(ele.find('span').data('code'));
                $addr_selected_item.eq(index).html(sele_name);
                seledValue(index, sele_name, sele_code);
                for (var i = 4; i > index; i--) {
                    $addr_selected_item.eq(i).html('');
                    $addr_list.eq(i).html('');
                }
                if (index < 3) {
                    $addr_selected_item.eq(index + 1).html('请选择');
                    newSwiper(0);
                    $addr_swipe.get(0).swiper.slideNext();
                    bindAreaLv(code, index + 1);
                    $addr_list.css('height', '1px');
                    $addr_list.eq(index + 1).css('height', 'auto');
                }
                if (index == 3) {
                    isLastSelected=1;
//                    $.ajax({
//                        type: "POST",
//                        url: url,
//                        data: {
//                            pid: "",
//                            lv_one: seled_value.prov.code,
//                            lv_two: seled_value.city.code,
//                            lv_thr: seled_value.county.code,
//                            lv_fou: seled_value.town.code,
//                            addr_type:addr_type
//                        },
//                        dataType: 'json',
//                        success: function (data) {
//                            seleData=data;
//                            console.log(seleData)
//                        },
//                        error: function () {
//                            alert("请求数据失败");
//                        }
//                    })
                    back_sign = 3;
                    if (options.callback)
                        options.callback(seled_value,this_ele);
                    $(".addr_aslider .close").click();
                }

            }

            /*函数 选中元素添加进seled_value*/
            function seledValue(num, sele_name, sele_code) {
                switch (num) {
                case 0:
                    seled_value.prov.code = sele_code;
                    seled_value.prov.name = sele_name;
                    break;
                case 1:
                    seled_value.city.code = sele_code;
                    seled_value.city.name = sele_name;
                    break;
                case 2:
                    seled_value.county.code = sele_code;
                    seled_value.county.name = sele_name;
                    break;
                case 3:
                    seled_value.town.code = sele_code;
                    seled_value.town.name = sele_name;
                    break;
                }
            }

            /*函数 接口读取下一级数据*/
            function bindAreaLv(code, num) {
                var lv_arr = ['pid', 'one', 'two', 'thr', 'fou'];
                var lv_num = 'lv_' + lv_arr[num];
                var post_data = {addr_type:addr_type};
                post_data[lv_num] = code;
                $loading.css('display', 'block');
                $.ajax({
                    type: "POST",
                    url: url,
                    data: post_data,
                    dataType: 'json',
                    success: function (data) {
                        var lv = data['areaLv' + (num + 1)];
                        var lvnode = $addr_aslider.find('.areaLv' + (num + 1) + '_list');
                        _loadLv(lvnode, lv);
                    },
                    error: function () {
                        alert("请求数据失败");
                    }
                })

                /*函数 渲染加载下级数据*/
                function _loadLv(ele, lv) {
                    ele.html(" ");
                    $loading.hide();
                    var node='';
                    for (var i = 0; i < lv.length; i++) {
                       node+= '<li class="flexbox v_center">' + '<span class="flex1" data-code=' + lv[i].code + ' data-current=' + lv[i].current + '>' + lv[i].name + '</span>' + '</li>'
                       
                    }
                    ele.html(node);
                    ele.css('visibility','hidden');
                    setTimeout(function(){
                        ele.html(node);
                        ele.css('visibility','visible');
                    },50)
                     
                }

            }

            /*函数 tab导航自动滑动效果*/
            function autoSlider(event) {
                var $a = $(event.target);
                var index = $a.closest('li').index();
                $(this).parents('.tab_addr_swipe')[0].swiper.slideTo(index - 0.5);
            }

            /*函数 swiper重新加载*/
            function newSwiper(num) {
                new Swiper($addr_swipe, {
                    slidesPerView: 'auto',
                    initialSlide: num,
                    freeMode: true,
                    freeModeMomentum: true,
                    autoPlay: false,
                    loop: false,
                })
            }
        })
    }
    $.fn.addrSelect = function (options) {
        this.each(function (idx, value) {           
            new Addr(this, options);
        });
    };
})(Zepto, window);
$(function(){
    if(_NPAD.titleStr)
    {
        $('#publuc_address_area_div .addr_aslider_title').html(_NPAD.titleStr);
    }
    window.addressClick = function (){
        var isdefault = 1;
        if(!(/^\d+$/.test(_NPAD.pid)) || _NPAD.pid <= 0){
            isdefault = 0;
        }
        _NPAD.addr = _NPAD.addr == undefined ? 0 : _NPAD.addr;

        for (var i in _NPAD.classArr) {
            $('.' + _NPAD.classArr[i]).addrSelect({
                url: '/public/addressArea',
                isdefault: isdefault,
                level1: _NPAD.pid,
                level2: _NPAD.cid,
                level3: _NPAD.did,
                level4: _NPAD.tid,
                addr_type: _NPAD.addr,
                callback: function(sele_attr, obj) {
                    _NPAD.check = sele_attr;
                    if(_NPAD.callback == 'ContentModule')
                    {
                        ContentModule.callback(sele_attr);
                        $('.' + _NPAD.classArr[i]).removeClass('addr_tip');
                    }
                    else if(_NPAD.callback)
                    {
                        sele_attr.obj = obj;
                        _NPAD.callback(sele_attr);
                    }
                }
            })                
        };      
    }
    if(_NPAD.isInit == undefined || _NPAD.isInit == true)
    {
        addressClick();
    }
});