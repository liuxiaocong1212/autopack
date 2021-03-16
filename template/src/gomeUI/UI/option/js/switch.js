/*
 * checkbox raido select 等options的功能插件
 * @Author: baishuang
 * @Date:   2015/11/4 17:20
 * @Last Modified by:   baishuang
 * @Last Modified time: 2015-11-9
 */
/*开关按钮*/
!(function ($) {
    var Switch = function (ele, options) {
        this.$ele = $(ele);
        this.$ele.on('click', this.turn);
    }
    Switch.prototype.turn = function () {
        $(this).toggleClass("closed");
    }

    $.fn.Switch = function (options) {
        this.each(function () {
            var switch_btn = new Switch(this, options);
        });
    }
    $(function () {
        $(".switch").Switch();
    })
})(Zepto);