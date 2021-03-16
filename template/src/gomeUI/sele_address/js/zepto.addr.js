/*
 * addrSelect四级地址功能插件
 * @Author: baishuang
 * @Date:   2016/5/25 14:20:00
 * @Last Modified by:lichengjuan
 * @Last Modified time:2017/1/3 16:20:00
 */
/**
 *四级地址调用说明
 *@param String url 接口地址
 *@param boolen isdefault   是否有默认地址 1有默认地址，0无默认地址
 *@param String level1      一级地址code码
 *@param String level2      二级地址code码
 *@param String level3      三级地址code码
 *@param String level4      四级地址code码
 *@param String addr_type   业务配置，1节能补贴(isdefault置0)，2退换货，0普通四级,默认0；
 *@param Function callback  回调函数,回调参数sele_attr，json形式，四级名字及code码；
 
 *demo调用
 $('.sele_addr_btn').addrSelect({
    url: '/public/addressArea',
    isdefault: isdefault,
    level1: _NPAD.pid,
    level2: _NPAD.cid,
    level3: _NPAD.did,
    level4: _NPAD.tid,
    addr_type: _NPAD.addr,
    callback: function (sele_attr) {
        console.log(sele_attr)
    }
})
**/


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

    var cbList = [];


    function GetAddress(ele, options) {
        return  function(){
            var isLastSelected=0;//是否选择到了最后一级，0没有选择到，1选择到；
            var back_sign = 3;
            var seled_value = {
                prov: {},
                city: {},
                county: {},
                town: {}
            };

            var this_ele = $(this);
            //var $addr_aslider = $(".addr_aslider"),
            var $addr_aslider = options.addr_enter || $(".addr_aslider");
            var $loading = $addr_aslider.find('.loading'),
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
            //var isdefault = (isLastSelected=='1')?0:options.isdefault; //是否有默认地址  1有，0无
            var isdefault = options.isdefault; //是否有默认地址  1有，0无
            var addr_type = (options.addr_type) ? options.addr_type : 0; //业务配置，1节能补贴，2退换货，0普通四级
            var availableLevel = options.availableLevel || 4
            var level1 = options.level1,
                level2 = options.level2,
                level3 = options.level3,
                level4 = options.level4;
            var url = options.url;
            if ($addr_aslider.data('flag') == 0) {
                // console.log($addr_aslider);
                tabChange($addr_list_box, availableLevel-1);
            }
            var firstTime = false;
            if ($addr_aslider.data('flag') == 1 ) {
                if (isdefault == '1') {
                    $loading.css('display', 'block');
                    var data = {
                        pid: "",
                        addr_type:addr_type,
                        lv_one: level1,
                        lv_two: level2,
                    };
                    switch(availableLevel){
                        case 3:
                            data.lv_thr = level3
                            break;
                        case 4:
                            data.lv_thr = level3
                            data.lv_fou = level4
                            break;
                    }
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: data,
                        dataType: 'json',
                        success: function (data) {
                            $loading.hide();
                            load(data);
                            var firstSlider = availableLevel - 1; //$addr_swipe.attr('data-first');
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
                //console.log('knfksnfksd');
                if (data.isSuccess == 'Y') {
                    $addr_aslider.data('flag', '0');
                    for (var j = 1; j < data.levels.split(',').length + 1; j++) {
                        var node='';
                        for (var i = 0; i < data['areaLv' + j].length; i++) {
                            if (data['areaLv' + j][i].current == true) {
                                var name;
                                if(addr_type == '4' && j ==  data.levels.split(',').length){
                                    name = data['areaLv' + j][i].title;
                                    node +=   '<li data-radio="1" class="shop_info_list">'
                                        +'<span class="shop_name" data-code=' + data['areaLv' + j][i].code + ' data-current=' + data['areaLv' + j][i].current + '>'
                                        + data['areaLv' + j][i].name
                                        +'</span>'
                                        +'<p class="number">'
                                        + data['areaLv' + j][i].phone
                                        +'</p>'
                                        +'<p class="shop_info_address">'
                                        + data['areaLv' + j][i].address
                                        +'</p>'
                                        +'</li>'

                                    seledValue(j - 1, data['areaLv' + j][i].name, data['areaLv' + j][i].code, data['areaLv' + j][i].phone, data['areaLv' + j][i].address);
                                }else{
                                    name = data['areaLv' + j][i].name;
                                    node+= '<li class="active flexbox v_center">'
                                        +'<span class="flex1" data-code=' + data['areaLv' + j][i].code + ' data-current=' + data['areaLv' + j][i].current + '>'
                                        + data['areaLv' + j][i].name
                                        +'</span>'
                                        +'<i data-icon="&#x0041;"></i>'
                                        +'</li>'

                                    seledValue(j - 1, data['areaLv' + j][i].name, data['areaLv' + j][i].code);
                                }

                                $addr_aslider.find('.areaLv' + j + ' a').html(name);
                                //seledValue(j - 1, data['areaLv' + j][i].name, data['areaLv' + j][i].code);

                            } else {
                                if(addr_type == '4' && j ==  data.levels.split(',').length){
                                    node +=   '<li data-radio="0" class="shop_info_list">'
                                        +'<span class="shop_name" data-code=' + data['areaLv' + j][i].code + ' data-current=' + data['areaLv' + j][i].current + '>'
                                        + data['areaLv' + j][i].name
                                        +'</span>'
                                        +'<p class="number">'
                                        + data['areaLv' + j][i].phone
                                        +'</p>'
                                        +'<p class="shop_info_address">'
                                        + data['areaLv' + j][i].address
                                        +'</p>'
                                        +'</li>'
                                }else{
                                    node+= '<li class="flexbox v_center">'
                                        +'<span class="flex1" data-code=' + data['areaLv' + j][i].code + ' data-current=' + data['areaLv' + j][i].current + '>'
                                        +data['areaLv' + j][i].name
                                        +'</span>'
                                        +'</li>'
                                }

                            }
                        }
                        if( data['areaLv' + j].length == '0'){
                            node +=  '<a onclick="window.history.go(-1)" href="javascript:;" class="logistics_distribution">'
                                +'<p>所在地区没有门店</p>'
                                +'<p>您可以改为物流配送，将直接送货上门</p>'
                                +'<button>改为物流配送</button>'
                                +'</a>'
                        }
                        $addr_aslider.find('.areaLv' + j + '_list').html(node);
                    }
                    for(var i = availableLevel+1; i <= 4; i++){
                        //$('.addr_selected_list .areaLv'+i).remove()
                        $addr_selected_list.find('.areaLv'+i).remove();
                    }
                }
            }

            /*函数 tab切换*/
            function tabChange(ele, num) {
                addrSlider(ele, num);
                newSwiper(num, $addr_swipe);
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
                var index = ele.parent().index();
                var sele_name = ele.find('span').html(),
                    sele_code = String(ele.find('span').data('code'));

                if(ele.hasClass('shop_info_list')){
                    var sele_phone = ele.find('.number').html(),
                        sele_address = ele.find('.shop_info_address').html();
                    ele.attr('data-radio','1');
                    ele.siblings().attr('data-radio','0');
                    $addr_selected_item.eq(index).html('门店');
                    seledValue(index, sele_name, sele_code, sele_phone, sele_address);
                }else{
                    var sele_node = '<i data-icon="&#x0041;"></i>';
                    ele.parent().children('li').removeClass('active').children('i').remove();
                    ele.addClass('active').append(sele_node);
                    $addr_selected_item.eq(index).html(sele_name);
                    seledValue(index, sele_name, sele_code);
                }

                ele.find('span').attr('data-current', 'true').parent().siblings().find('span').attr('data-current', 'false');
                //seledValue(index, sele_name, sele_code);

                for (var i = 4; i > index; i--) {
                    $addr_selected_item.eq(i).html('');
                    $addr_list.eq(i).html('');
                }
                if (index < availableLevel-1) {
                    $addr_selected_item.eq(index + 1).html('请选择');
                    newSwiper(0);
                    $addr_swipe.get(0).swiper.slideNext();
                    bindAreaLv(code, index + 1, $loading);
                    $addr_list.css('height', '1px');
                    $addr_list.eq(index + 1).css('height', 'auto');
                }
                if (index == availableLevel-1) {
                    isLastSelected=1;

                    back_sign = availableLevel-1;
                    if (options.callback){

                        var returnVal = {};
                        returnVal.prov ={
                            code: seled_value.prov.code,
                            name: seled_value.prov.name
                        }
                        returnVal.city ={
                            code: seled_value.city.code,
                            name: seled_value.city.name
                        }
                        switch(availableLevel){
                            case 3:
                                returnVal.county ={
                                    code: seled_value.county.code,
                                    name: seled_value.county.name
                                }
                                break;
                            case 4:
                                returnVal.county ={
                                    code: seled_value.county.code,
                                    name: seled_value.county.name
                                }
                                returnVal.town ={
                                    code: seled_value.town.code,
                                    name: seled_value.town.name
                                }
                                if(addr_type == '4'){
                                    returnVal.town.shop = {
                                        phone: seled_value.town.phone,
                                        address: seled_value.town.address,
                                    }
                                }
                                break;
                        }
                        /*console.log(availableLevel);
                         console.log(returnVal);
                         console.log(this_ele);*/
                        options.callback(returnVal,this_ele);
                    }
                    $(".addr_aslider .close").click();
                    //$.aslider.asideSlideOut($('.addr_aslider'));
                }
            }

            /*函数 选中元素添加进seled_value*/
            function seledValue(num, sele_name, sele_code, sele_phone, sele_address) {
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
                        seled_value.town.phone = sele_phone;
                        seled_value.town.address = sele_address;
                        break;
                }
            }

            /*函数 接口读取下一级数据*/
            function bindAreaLv(code, num, $loading) {
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
                        var number = num+1;
                        if (data.isSuccess == 'Y') {
                            _loadLv(lvnode, lv, number);
                        }
                    },
                    error: function () {
                        alert("请求数据失败");
                    }
                })

                /*函数 渲染加载下级数据*/
                function _loadLv(ele, lv, number) {
                    ele.html(" ");
                    $loading.hide();
                    var node='';
                    if(addr_type == '4' && number == availableLevel){
                        if(lv.length != '0'){
                            for (var i = 0; i < lv.length; i++) {
                                node += '<li data-radio="0" class="shop_info_list">'
                                    + '<span class="shop_name" data-code=' + lv[i].code + ' data-current=' + lv[i].current + '>'
                                    + lv[i].name
                                    + '</span>'
                                    + '<p class="number">'
                                    + lv[i].phone
                                    + '</p>'
                                    + '<p class="shop_info_address">'
                                    + lv[i].address
                                    + '</p>'
                                    + '</li>'
                            }

                        }else{
                            node +=  '<a onclick="window.history.go(-1)" href="javascript:;" class="logistics_distribution">'
                                +'<p>所在地区没有门店</p>'
                                +'<p>您可以改为物流配送，将直接送货上门</p>'
                                +'<button>改为物流配送</button>'
                                +'</a>'
                        }

                    }else{
                        for (var i = 0; i < lv.length; i++) {
                            node+= '<li class="flexbox v_center">'
                                + '<span class="flex1" data-code=' + lv[i].code + ' data-current=' + lv[i].current + '>'
                                + lv[i].name
                                + '</span>'
                                + '</li>'

                        }
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
            function newSwiper(num,$addr_swipe) {
                new Swiper($addr_swipe, {
                    slidesPerView: 'auto',
                    initialSlide: num,
                    freeMode: true,
                    freeModeMomentum: true,
                    autoPlay: false,
                    loop: false,
                })
            }

        }
    }
    var Addr = function (ele, options) {
        var sele_ele = ele;
        var getAddress = new GetAddress(ele, options);
        if(cbList.length > 0){
            cbList.forEach(function(item){
                if(item.el == ele){
                    $(ele).unbind('click',item.cb)
                }
            });
        }
        cbList.push({
            el: ele,
            cb: getAddress,
        })
        $(ele).bind('click',getAddress);
    }

    $.fn.addrSelect = function (options) {
        this.each(function (idx, value) {
            new Addr(this, options);
        });
    };

})(Zepto, window);