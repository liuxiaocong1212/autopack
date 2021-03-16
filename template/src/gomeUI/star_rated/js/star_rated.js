/*
 * 星级 星星评论
 * @Author: baishuang
 * @Date:   2016/5/18
 */
!(function ($, window, undefined) {
    var Star = function (ele, options) {
        this.settings = $.extend({}, Star.defaults, options);
        this.ele = $(ele);
        $score = this.ele.attr('data-score').replace(/%/, "");
        this.init();
    }
    Star.defaults = {

    }
    Star.prototype = {
        init: function () {
            var score = $score;
            if (score < 20 || score == 20) {
                var html = '<i data-icon="D"></i><i data-icon = "F"> </i><i data-icon = "F" > </i><i data-icon = "F"> </i><i data-icon = "F"></i>'
                this.ele.append(html);
            } else if (score < 40 || score == 40) {
                var html = '<i data-icon="D"></i><i data-icon = "D"> </i><i data-icon = "F" > </i><i data-icon = "F"> </i><i data-icon = "F"></i>'
                this.ele.append(html);
            } else if (score < 60 || score == 60) {
                var html = '<i data-icon="D"></i><i data-icon = "D"> </i><i data-icon = "D" > </i><i data-icon = "F"> </i><i data-icon = "F"></i>'
                this.ele.append(html);
            } else if (score < 80 || score == 80) {
                var html = '<i data-icon="D"></i><i data-icon = "D"> </i><i data-icon = "D" > </i><i data-icon = "D"> </i><i data-icon = "F"></i>'
                this.ele.append(html);
            } else {
                var html = '<i data-icon="D"></i><i data-icon = "D"> </i><i data-icon = "D" > </i><i data-icon = "D"> </i><i data-icon = "D"></i>'
                this.ele.append(html);
            }

        }
    }
    $.fn.starBar = function (options) {
        this.each(function () {
            this.star = new Star(this, options);
        })
    }
    $(function(){
        $(".star_bar").starBar();
    })
})(Zepto, window);
!(function ($, window, undefined) {
    var StarScore = function (ele, options) {
        var onchange = options.onchange;
        this.ele = $(ele);
        $star_item = this.ele.find('i');
        $star_num = $star_item.length;

        $star_item.click(function () {
            var $el = $(this);
            for (var i = 0; i < $star_num; i++) {
                $(this).parent().children().eq(i).attr('data-icon', 'F');
            }
            var index = $(this).index();
            for (var i = 0; i < index + 1; i++) {
                $(this).parent().children().eq(i).attr('data-icon', 'D');
            }
            if (onchange) {
                onchange($el, index)
            }
        })
    }

    $.fn.starScore = function (options) {
        this.each(function () {
            this.starScore = new StarScore(this, options);
        })
    }
})(Zepto, window)