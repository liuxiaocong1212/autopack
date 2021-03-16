/*
 * 输入框、下拉输入框功能插件
 * @Author: baishuang
 * @Date:   2016/4/28 16:20
 * @Last Modified by: liuxiaocong
 * @Last Modified time: 2017-03-30 16:18:23
 */
!(function ($, window, undefined) {
    var DropDownList = function (ele, options) {
        this.$ele = $(ele);
        this.$choose = this.$ele.parents('.select_box').find('.choose');
        this.$choose_default_txt = this.$choose.html();
        this.$ele.on('change', $.proxy(this.select, this));
    }
    DropDownList.prototype.select = function () {
        var opt_txt = this.$ele.val();
        this.$choose.html(opt_txt).css('color', '#333');
        if (opt_txt == this.$choose_default_txt) {
            this.$choose.css('color', '#999');
        }
    }

    $.fn.DropDownList = function (options) {
        this.each(function () {
            var Dropdown = new DropDownList(this, options);
        });
    }
})(Zepto, window);
!(function ($, window, undefined) {
    var Input = function (ele, options) {
        this.settings = $.extend({}, Input.defaults, options);
        this.$elebox = $(ele);
        this.$ele = $(ele).find('input');
        this.del = $(ele).find('.del');
        this.init();
    }
    Input.defaults = {
        color: '#333',
        focusAction: 'null',
        blurAction: 'null',
    }
    Input.prototype = {
        init: function () {
            this.$ele.on('focus', $.proxy(this.focus, this));
            this.$ele.on('input', $.proxy(this.input, this));
            this.del.on('click', $.proxy(this.clear, this));
            this.$ele.on('blur', $.proxy(this.blur, this));
        },
        focus: function () {
            if (this.$ele.val() != '') {
                this.del.show();
            }
            if($.isFunction(this.settings.focusAction)){
                this.settings.focusAction();
            }
        },
        input: function () {
            this.del.show();
            this.$ele.css('color',this.settings.color);
            if(this.$ele.val() == ''){
                this.del.hide();
            }
        },
        clear: function () {
            this.$ele.val('');
            this.del.hide();
            this.$ele.focus();
            if($.isFunction(this.settings.focusAction)){
                this.settings.focusAction();
            }
        },
        blur: function () {
            var del = this.del;
            if($.isFunction(this.settings.blurAction)){
                this.settings.blurAction();
            }
            setTimeout(function () {
                del.hide();
            }, 300)
        }
    }
    $.fn.input = function (options) {
        this.each(function () {
            var input = new Input(this, options);
        });
    }
})(Zepto, window);