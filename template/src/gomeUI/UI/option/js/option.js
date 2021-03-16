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
/*复选框*/
!(function ($) {
    var group = {};
    var iCheck = function (ele, options) {
        $(ele).on('click', function () {
            if ($(this).hasClass('disabled')) {
                return;
            } else {
                $(this).toggleClass('checked');
            }
            if (!options) return;
            if (options.callback)
                options.callback($(this).val() || $(this).text().trim(), this, group);
            if (options.onChange) {
                var curGroup = group;
                for (var key in group) {
                    for (var i = 0; i < group[key].length; i++) {
                        if (this == group[key][i]) {
                            curGroup = group[key];
                            break;
                        }
                    }
                }
                options.onChange($(this).val() || $(this).text().trim(), $(this).filter('.checked') ? this : null, curGroup);
            }
        });
    }

    $.fn.iCheck = function (options) {
        this.each(function () {
            var groupName = $(this).data("checkbox") || $(this).attr("name");
            if (group[groupName]) {
                group[groupName].push(this);
            } else {
                group[groupName] = [];
                group[groupName].push(this);
            }
            var checkbox = new iCheck(this, options);
        });
    }
})(Zepto);