/*
 * @Author: zhudanmei
 * @Date:   2015-11-04 15:43:12
 * @Last Modified Date: 2015-12-03 15:34:23
 * @Last Modified by:  baishuang
 * tab组件
 */
;(function ($, window) {
    var starttx, startty;
    var tabClick = function (element, options) {
        this.$element = $(element);
        this.init();
    }
    tabClick.prototype = {
        init: function () {

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
        toggle: function () {
            $(this).children().addClass('active');
            $(this).siblings().children().removeClass('active');
        }
    }
    $.fn.tabclick = function (options) {
        return this.each(function () {
            this.__tabItem = new tabClick(this, options);
            return;
        });
    };
    $(function () {
        $('.tab_nav ul li').tabclick();
        if (!!$.fn.swiper) {
            
            $(".tab_nav_swipe").each(function () {
                $(this).swipeSlider({
                    visibleSlides: 'auto',
                    freeMode: true,
                    freeModeMomentum: true,
                    autoPlay: false,
                    loop: false,
                });

                var firstSlider = $(this).attr('data-first');
                if (firstSlider != '' || firstSlider != 'null') {
                    $(this).swipeSlider({
                        visibleSlides: 'auto',
                        first: firstSlider,
                        freeMode: true,
                        freeModeMomentum: true,
                        autoPlay: false,
                        loop: false,
                    });
                    $(".tab_nav_box li").eq(firstSlider).children().addClass('active').parents('.swiper-slide').siblings().children().removeClass('active');
                    active($(".tab_nav_morelist li:eq(" + firstSlider + ")"));
                }

                var typename = $(this).attr('data-autoslider-type');
                if (typename == 'auto' || typename == '') {
                    $(this).on('click', '.swiper-slide', autoslider)
                } else if (typename == 'manual') {
                    return;
                } else {
                    $(this).on('click', '.swiper-slide', autoslider)
                }

                function autoslider() {
                    var $a = $(event.target);
                    var index = $a.closest('li').index();
                    $(this).parents('.tab_nav_swipe')[0].swiper.slideTo(index - 1);
                }
                this.tab = {};
                var _this = this;
                this.tab.slideTo = function (index) {
                    $(_this)[0].swiper.slideTo(index - 1);
                    $(_this).find('.swiper-slide').forEach(function (el, idx) {
                        $(el).children().removeClass('active')
                        if (idx == index)
                            $(el).children().addClass('active')
                    })
                }
            })
        }

        if (!!$('.tab_nav_box .tab_show_more')) {
            var tab_showmore = $(".tab_show_more"),
                $tab_nav_morelist = $(".tab_nav_morelist"),
                tab_nav_morelist = $(".tab_nav_morelist")[0];

            $(".tab_nav_hasmore").on('click', 'li', function () {
                var index = $(this).index();
                active($(".tab_nav_morelist li:eq(" + index + ")"));
            })

            /*导航展开后操作*/
            $tab_nav_morelist.find("li").on('click', function () {
                var index = $(this).index();
                $tab_nav_morelist.hide();
                tab_showmore.attr('data-flag', '0').find('i').removeClass('down');
                active($(this));
                active($('.tab_nav_hasmore ul li:eq(' + index + ')'));
                $(".tab_nav_hasmore")[0].swiper.slideTo(index - 1);
            });

            /*滑动导航展示更多箭头*/
            tab_showmore.on('click', function () {
                if ($(this).attr('data-flag') == 0) {
                    $tab_nav_morelist.show();
                    $(this).find('i').addClass('down');
                    $(this).attr('data-flag', '1');
                } else {
                    $tab_nav_morelist.hide();
                    $(this).find('i').removeClass('down');
                    $(this).attr('data-flag', '0');
                }
            });


        }

        function active(ele) {
            ele.children().addClass('active').parent().siblings().children().removeClass('active')
        }
    })

})(window.Zepto, window);