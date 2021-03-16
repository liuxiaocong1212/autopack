/*
 * @Author: zhudanmei
 * @Date:   2015-09-221 12:25:12
 * @Last Modified by:   zhudanmei
 * 按钮组件
 */
;(function ($,window) {
        var starttx, startty;
        var Touch = function(element,options) {
            this.$element = $(element);
            this.init();
        }
        Touch.prototype = {
            init:function(){
                this.Touchstart();
                this.Touchend();
                this.Mousedown();
                this.Mouseup();
            },
            Touchstart:function(){
                
                if(this.$element.hasClass('disabled')) return;
                this.$element.on('touchstart', function(e) {
                    $(this).addClass('active');
                });   
            },
            Touchend:function(){
                this.$element.on('touchend touchcancel', function(e) {
                    
                    $(this).removeClass('active');
                });
            },
            Mousedown:function(){
                if(this.$element.hasClass('disabled')) return;
                this.$element.on('mousedown', function(e) {
                    $(this).addClass('active');
                });
            },
            Mouseup:function(){
                this.$element.on('mouseup', function(e) {
                    
                    $(this).removeClass('active');
                });
            }
           
        };
    $.fn.touch = function(options){
        return this.each(function() {
            var touch = new Touch(this, options);
            return;
        });
    };
    
    $(function(){
        $('.btn').touch();
    })

})(window.Zepto, window);