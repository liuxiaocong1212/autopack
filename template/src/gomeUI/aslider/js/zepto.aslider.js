/*
 * @Author: zhaoye-ds1
 * @Date:   2015-07-20 17:03:01
 * @Last Modified by:   zhaoye-ds1
 * @Last Modified time: 2015-11-12 16:42:36
 * 侧滑slider插件
 */
(function($, window) {
    var uc = false;
    if(window.navigator.userAgent.match(/(UCBrowser|UCWeb)/i))
        uc = true;
    var AsideSlider = function(options) {
        var aslider = options.aslider;
        var _scope = this;
        var visibleStack = [];
        this.bindArray = options.bindArray
        /**
         * @public
         * 遍历所有侧边栏，滑出隐藏当前显示的那个
         * @return {null}
         */
        this.asideSlideOut = function($el) {
            if ($el.is(":visible")) {
                var isFade = $el.data("aslider-fade");
                if (isFade === "" || isFade || $el.isFade) {
                    $el.find(".bg").removeClass("fade_in");
                    $el.find(".bg").addClass("fade_out");
                }
                $el.find(".wrapper").removeClass("slide_in");
                $el.find(".wrapper").addClass("slide_out");
            }
            visibleStack.pop();
            if(visibleStack.length === 0)
                $('body').unbind('touchmove');
        }
        this.resetScroll = function($el){
            if($el.is(":visible")) {
                var translate = "translate3d(0,0,0)";
                $el.find(".slider").css({
                    "-webkit-transform": translate,
                    "-moz-transform": translate,
                    "-ms-transform": translate,
                    "transform": translate
                });
                lastY=0;
                y=0;
            }
        }
        /**
         * 滑入显示一个侧边栏
         * @param  {zepto object} $el 侧边栏dom对象
         * @return {null}
         */
        this.asideSlideIn = function($el) {
            $el.css("display","block");
            setTimeout(function(){
                var isFade = $el.data("aslider-fade");
                if (isFade === "" || isFade || $el.isFade) {
                    $el.find(".bg").removeClass("fade_out");
                    $el.find(".bg").addClass("fade_in");
                }
                $el.find(".wrapper").removeClass("slide_out");
                $el.find(".wrapper").addClass("slide_in");
                visibleStack.push($el);
                $('body').bind('touchmove',function(e){
                    e.preventDefault();
                });
            },100);
        }
        this.__instance = function($el){
            var instance = Object.create($.aslider.instance)
            $.aslider.instanceList.push(instance);
            instance.$el = $el
            return instance;
        }

        this.instance = {
            loadmore: false,
            loadmoreCbk: new Function,
            isLoaing: false,
            _onPageEnd: function(){
                if(this.loadmore)
                    this.loadmoreCbk();
                return $.aslider.get(this.$el)
            },
            _startLoading: function(){
                if(!this.loadmore)return $.aslider.get(this.$el)
                if(this.isLoaing)return $.aslider.get(this.$el);
                this.isLoaing = true;
                this.$el.find('.slider').append('<div class="loadmore">正在加载中...</div>')
            },
            config: function(options){
                this.loadmore = options.loadmore || false;
                return $.aslider.get(this.$el)
            },
            append: function(html){
                this.$el.find('.slider').append(html)
                return $.aslider.get(this.$el)
            },
            onLoading: function(cbk){
                if(!this.loadmore)return $.aslider.get(this.$el)
                this.loadmoreCbk = cbk;
                return $.aslider.get(this.$el)
            },
            doneLoading: function(){
                if(!this.loadmore)return $.aslider.get(this.$el)
                this.$el.find('.loadmore').remove()
                this.isLoaing = false;        
                return $.aslider.get(this.$el)
            },
            noMore: function(){
                this.$el.find('.loadmore').remove()
                this.$el.find('.slider').append('<div class="loadmore">没有更多了</div>')
                var _this = this;
            }
        }
        this.instanceList = [];
        this.get = function($el){
            if(typeof $el == 'string')$el = $($el)
            var result;
            this.instanceList.forEach(function(instance,idx){
                if($el[0] == instance.$el[0]){
                    result = instance;
                }
            })
            if(result){
                return result;
            }else
                return new this.__instance($el);
        }
        /**
         * 绑定页面的侧边栏和侧边栏滑出的发起者的click事件，当点击发起者时，滑出侧边栏
         * @param  {zepto object} $initialator 发起者
         * @param  {zepto object} $slider      侧边栏
         * @return {null}
         */
        function bindAsideSlider($initialator, $slider) {
            if (typeof($initialator) == "undefined") return;
            $initialator.click(function(e) {
                _scope.asideSlideIn($slider);
            });
        }
        /**
         * 给定一个侧边栏的子节点，找到这个侧边栏
         * @param {Type} 一个html dom node
         */ 
        function findeAslider(el) {
            var theSlider;
            $("[data-aslider]").each(function(idx, aslider) {
              if(aslider == el){
                theSlider = aslider;
                return false;
              }
              $(aslider).find(".close").each(function(idx,_el){
                if(el==_el){
                    theSlider = aslider;
                    return false;
                } else {
                    return true;
                }
              });
            });
            return $(theSlider);
        }
        /**
         * 侦听侧边栏动画完成事件，如果是滑出的话，就隐藏此侧边栏
         * @param  {event}
         * @return {null}
         */
        $(aslider).bind("webkitTransitionEnd", function(e) {
            y = 0;
            lastY = 0;
            $(this).find(".slider").css({
                "-webkit-transform":"translate(0,0)",
                "-moz-transform":"translate(0,0)",
                "-ms-transform":"translate(0,0)",
                "transform":"translate(0,0)"
            });
            if($(this).find(".slide_out")[0])
                $(this).css("display","none");
        });
         $(aslider).bind("transitionEnd", function(e) {
            y = 0;
            lastY = 0;
            $(this).find(".slider").css({
                "-webkit-transform":"translate(0,0)",
                "-moz-transform":"translate(0,0)",
                "-ms-transform":"translate(0,0)",
                "transform":"translate(0,0)"
            });
            if($(this).find(".slide_out")[0])
                $(this).css("display","none");
        });
        /**
         * 侦听侧边栏的关闭按钮的点击事件，调用滑出侧边栏方法
         * @param  {event}
         * @return {null}
         */
        $(aslider).on("click",".close",function(e) {
            if (this == e.target) {
                var $aslider = findeAslider(this);
                _scope.asideSlideOut($aslider);
            }
        });
        /**
         * 侦听侧边栏点击事件，如果点击的是背景部分，调用滑出侧边栏方法
         * @param  {event}
         * @return {null}
         */
        $(document).on("click",'[data-aslider="'+$(aslider).data("aslider")+'"]',function(e) {
            if ($(this).hasClass("close")) {
                if (this == e.target) {
                    var $aslider = findeAslider(this);
                    _scope.asideSlideOut($aslider);
                }
            }
        });
        /**
         * 有关自定义滑动方法的
         */
        //上一次移动手指时的y轴位置
        var lastY = 0;
        //div的y轴位置
        var y = 0;
        /**
         * 侦听触摸事件的div
         */
        $(aslider).each(function(idx, aslider) {
            //监控
            /*setInterval(function(){
                if($(aslider).find("")){

                }
            },500);
*/
            if(!$(aslider).hasClass("aslider")){
                $(aslider).addClass("aslider");
            }
            if(uc)
                $(aslider).find(".wrapper").addClass("for_uc");
            var lastScrollTop = 0;
            //找不到slider，就创建slider
            var children = $(aslider).find(".wrapper").children();
            if($(aslider).find(".slider").length==0){
                var $slider = $("<div class='slider'></div>");
                $slider.append(children);
                $(aslider).find(".wrapper").append($slider);
            }else
                var $slider = $(aslider).find(".slider");
            if($(aslider).find(".scroll").length==0){
                var $scroll = $("<div class='scroll'></div>");
                //创建scroll
                $slider.before($scroll);
                //将slider添加到scroll
                $scroll.append($slider);
            }
            /**
             * 每次点击开始时，先重置lastY
             */
            var flag = false;
            $slider.on('mousedown',function(e){
                flag = true;
                lastY = e.pageY;
            });
            $slider.on('touchstart', function(e) {
                lastY = e.touches[0].pageY;
            });
            /**
             * 触摸移动事件
             * 通过当前的触摸Y值 - 上一次事件的y值
             * 得到两次触摸事件的差
             * y = y +deltaY使div移动
             * 如果y > 0，则div的顶部低于窗口了，所以y>0时，y=0
             * 同理y < limit是为了防止div的底部高于窗口
             * 最后让当前的触摸y值 = lastY,即对下一次触摸来说，这次的y就是lastY
             */
             $slider.on('mousemove', function(e) {
                if(!flag)return;
                var curY = e.pageY;
                var deltaY = curY - lastY;
                var height = $(this)[0].scrollHeight;
                //除了scroll的height
                var otherHeight = 0;
                $(aslider).find(".wrapper").children().each(function(idx,child){
                    if(!$(child).hasClass("scroll")){
                        otherHeight += $(child).height();
                    }
                });
                //检测实际高度
                var realHeight = 0;
                $(this).children().each(function(idx,child){
                    realHeight += $(child).height();
                });
                //超出实际高度就不滚动
                if(realHeight <= $(this).height()-otherHeight)return;
                var limit = height - $(this).parent().height();
                y = y + deltaY;
                 if(y<limit*-1) y = limit*-1;
                if(y>0) y = 0;
                var translate = "translate3d(0,"+y+"px,0)";
                $(this).css({
                    "-webkit-transform": translate,
                    "-moz-transform": translate,
                    "-ms-transform": translate,
                    "transform": translate
                });
                lastY = curY;
            });
            $slider.on('touchmove', function(e) {
                var curY = e.touches[0].pageY;
                var deltaY = curY - lastY;
                var height = $(this)[0].scrollHeight;
                //除了scroll的height
                var otherHeight = 0;
                $(aslider).find(".wrapper").children().each(function(idx,child){
                    if(!$(child).hasClass("scroll")){
                        otherHeight += $(child).height();
                    }
                });
                //检测实际高度
                var realHeight = 0;
                $(this).children().each(function(idx,child){
                    realHeight += $(child).height();
                });
                //超出实际高度就不滚动
                if(realHeight <= $(this).height()-otherHeight)return;
                var limit = height - $(this).parent().height();
                y = y + deltaY;
                 if(y<limit*-1) y = limit*-1;
                if(y>0) y = 0;
                if(y == -limit){
                    //到底了
                    if(!$.aslider.get($(aslider)).isLoaing){
                        $.aslider
                            .get($(aslider))
                            ._onPageEnd()
                            ._startLoading()
                    }
                }
                var translate = "translate3d(0,"+y+"px,0)";
                $(this).css({
                    "-webkit-transform": translate,
                    "-moz-transform": translate,
                    "-ms-transform": translate,
                    "transform": translate
                });
                lastY = curY;
            });
            $(document).on('mouseup', function(e) {
                flag = false;
            });
            $slider.on('touchend', function(e) {

            });
        });
       
        options.bindArray.forEach(function(item) {
            bindAsideSlider($(item.initialator), $(item.slider));
            if(item.options.isFade)
                $(item.slider).data("aslider-fade", item.options.isFade);
            else
                $(item.slider).find('.bg').css("opacity","0");
            $(item.slider).data("aslider-direction", item.options.direction);
            $(item.slider).find(".wrapper").addClass(item.options.direction)
        });
    }
    var init = function(entrance,aslider){
        var bindArray = [];
        var historyList = [];
        entrance = entrance || "[data-aslider-in]";
        aslider = aslider || "[data-aslider]";
        $(entrance).each(function(idx,el) {
            var array = String($(this).data("aslider-in")).split("|");
            var targetSlider = array[0];
            bindArray.push({
                initialator: this,
                slider: '[data-aslider="' + targetSlider + '"]',
                options:{
                    isFade: (function(){
                        var isFade = false;
                        array.forEach(function(value,idx){
                            if(value == "fade"){
                                isFade = true;
                                return false;
                            }
                        });
                        return isFade;
                    })(),
                    direction: (function(){
                        var direction = 'right';
                        array.forEach(function(value,idx){
                            if(value == "right" || value == "left" || value == "top" || value == "bottom"){
                                direction = value;
                                return false;
                            }
                        });
                        return direction;
                    })(),
                    size:(function(){
                        var size = "100%";
                        var direction = 'right';
                        array.forEach(function(value,idx){
                            if(value == "right" || value == "left" || value == "top" || value == "bottom"){
                                direction = value;
                                return false;
                            }
                        });
                    })(),
                    isBlock:(function(){
                        
                    })()
                }
            });
            for(var i in historyList){
              if (historyList[i] == $(el).data("aslider-in")){
                return;
              }
            }
            historyList.push($(el).data("aslider-in"));
            var $bg = $("<div class='bg close'></div>");
            $(bindArray[bindArray.length-1].slider).prepend($bg);
        });
        var options = {
            "aslider": aslider,
            "bindArray": bindArray
        }
        return options;
    };
    $(function() {
        var options = init();
        $.aslider = $.asideSlider = new AsideSlider(options);
        $.aslider.AsideSlider = AsideSlider;
        $.aslider.init = init;
        $.asideSlider.init = init;
    });
})(Zepto, window);
