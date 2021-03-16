/*
 * counter 计数器
 * @Author: baishuang
 * @Date:   2016/3/9
 * @Last Modified by:   zhudanmei
 * @Last Modified time: 2016-10-10 14:22:16
 */
!(function ($, window, undefined) {
    var Count = function (ele, options) {
        this.settings = $.extend({}, Count.defaults, options);
        this.$ele = $(ele);
        this.init();
    };
    Count.defaults = {
        limitnum: 'null',
        addAction: 'null',
        minusAction: 'null',
    }
    Count.prototype = {
        constructor: Count,
        init: function () {
            this.$ele.find('.minus_btn').on('click', $.proxy(this.minus, this));
            this.$ele.find('.add_btn').on('click', $.proxy(this.add, this));
			this.$ele.find('.count').on('keyup', $.proxy(this.enterCheck, this));
			this.$ele.find('.count').on('blur', $.proxy(this.blur, this));
			this.loaded();
        },
		loaded:function(){
			var limitnum = Number(this.settings.limitnum),
				$add_btn = this.$ele.find('.add_btn'),
                $minus_btn = this.$ele.find('.minus_btn');
                
			if(limitnum <= 1){
				$minus_btn.addClass('disabled');
				$add_btn.addClass('disabled');
			}else{
                $minus_btn.addClass('disabled');
                $add_btn.removeClass('disabled');
            }
		},
		enterCheck:function(){
			var $count = this.$ele.find('.count'),
				enterVal = Number($count.val()),
				$add_btn = this.$ele.find('.add_btn'),
                $minus_btn = this.$ele.find('.minus_btn'),
				limitnum = Number(this.settings.limitnum);
			$count.val($count.val().replace(/\D/g,''));
			if(enterVal >= limitnum){
				$count.val(limitnum)
				$add_btn.addClass('disabled');
				$minus_btn.removeClass('disabled');
				if(limitnum == 1){
					$minus_btn.addClass('disabled');
				}
			}else if(enterVal < 1 || enterVal == 1){
				$add_btn.removeClass('disabled');
				$minus_btn.addClass('disabled');
			}else{
				$minus_btn.removeClass('disabled');
				$add_btn.removeClass('disabled');
			}
			
		},
		blur:function(){
			var $count = this.$ele.find('.count');
			if($count.val() == '' || $count.val() < 1 ){
				$count.val(1)   
			}
		},
        minus: function () {
            var $count = this.$ele.find('.count'),
                $add_btn = this.$ele.find('.add_btn'),
                $minus_btn = this.$ele.find('.minus_btn'),
                num = $count.val();
            if (Number(num) > 1) {
                var curNum = Number($count.val()) - 1;
                $count.attr('value', curNum);
                $count.val(curNum);
                $add_btn.removeClass('disabled');
                if ($.isFunction(this.settings.minusAction)) {
                    this.settings.minusAction(curNum);
                }
                if (Number(num) - 1 == 1) {
                    $minus_btn.addClass('disabled');
                }
            }

        },
        add: function () {
            var $count = this.$ele.find('.count'),
                $add_btn = this.$ele.find('.add_btn'),
                $minus_btn = this.$ele.find('.minus_btn'),
                num = $count.val(),
                limitnum = this.settings.limitnum;
            if (Number(num) < limitnum || limitnum == 'null') {
                var curNum = Number($count.val()) + 1;
                $count.attr('value', curNum);
                $count.val(curNum);
                $minus_btn.removeClass('disabled');
                if ($.isFunction(this.settings.addAction)) {
                    this.settings.addAction(curNum);
                }
                if (Number(num) == limitnum - 1) {
                    $add_btn.addClass('disabled');
                }
            }
        }
    }

    $.fn.count = function (options) {
        return this.each(function () {
            return new Count(this, options);
        })
    }
})(Zepto, window)