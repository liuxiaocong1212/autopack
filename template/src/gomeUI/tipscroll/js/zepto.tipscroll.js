;(function (window, $) {
    var scroll = function (ele, value) {
        value = $.extend({
            line: 1,
            auto: true,
            speed: 500,
            timeout: 2000
        }, value);
        var timer = null;
        var $list = $(ele);
        var line = value.line;
        var h = $(ele).find('li:first').height();
        var speed = value.speed;
        var count = $(this).find('li').size() - line;
        var autoStop = function () {
            if (timer) {
                clearInterval(timer);
            }
        };
        timer = setInterval(scrollUp, value.timeout);

        function scrollUp() {
            $list.animate({
                'marginTop': -h * line
            }, speed, function () {
                $list.find('li').slice(0, line).appendTo($list);
                $list.css('marginTop', 0);
            })
        }
    };
    $.fn.scroll = function (options) {
        var scroller = new scroll(this, options);
    };
})(window, Zepto);