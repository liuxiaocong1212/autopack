/**
 * 返回上一页
 * @author lizhiyang
 * @last-modefied-date 2015/9/8 17:32:58
 * @last-modefied-by zhaoye
 */
;(function($, window, undefined) {
	var curHost;
    var Back = function(element,options) {
        this.settings = $.extend({}, Back.defaults, options);
		this.$element = $(element);
        this._init();
    }
    
    Back.prototype = {
        
        _init : function() {
			var _this = this;
            //域名替换兼容
            var _host=window.location.host;
            if(_host.indexOf("gome.com.cn") > 0){
                curHost='gome.com.cn';
            }else{
                curHost='gomeplus.com'
            }
			this.$element.on('click',function(){		
				if(_this.settings.callBack == null || _this.settings.callBack == 'undefined'){
					_this._historyBack()
				}
				else{
					_this.settings.callBack();
				}
			});
			this._navMore();
        },
        
        _historyBack : function() {
		   if (typeof gome_spurl == 'undefined' || gome_spurl == '') {
				if(document.referrer=='' || document.referrer == window.location.href){
					window.location.href='//m.'+curHost+'/';
                    //window.location.href='//m.gome.com.cn/';
				}else{
					history.back();
				}
		   }else {
			   window.location.href = gome_spurl;
		   }
        },
		
		_navMore : function() {
			var _this = this;
			this.settings.navMore.on('click',function(){
				_this.settings.navList.toggle();
			})
		}
		
    }

    Back.defaults = {
		navMore  : $('#navmore'),
		navList  : $('.nav_ulist'),
		callBack : null
	}
    
   	$.fn.goback = function(options){
		return this.each(function() {
			var goback = new Back(this, options);
			return;
		});
    };
	
	$(function(){
		$('#goback').goback();
		$('#nav_return').goback();
	})
    
})(window.Zepto, window);