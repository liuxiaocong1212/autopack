;(function($, window, undefined) {

    var Msgbox = function(options) {
        this.settings = $.extend({}, Msgbox.defaults, options);
        this.init();
    }

    Msgbox.prototype = {

        init : function() {
            this.create();
			if (!isNaN(this.settings.time)&&this.settings.time!=null) {
                this.time();
            }
            $('body').on('touchstart','.confirm, .cancel',function(){
                $(this).addClass('active');
            });
            $('body').on('touchend touchcancel','.confirm, .cancel',function(){
                $('.msgbox .btn_bar a').removeClass('active');
            });
        },

        create : function() {
			var _this = this;
			//alert方式
			if(this.settings.type == 'alert'){
				var title = (this.settings.title==null) ? '' : '<h4 class="title">' + this.settings.title + '</h4>',
					closeBtn = (!this.settings.closeBtn) ? '':'<div class="close_btn" data-icon="&#x0042"></div>',
					templates = '<div class="msgbox">' + title + '<div class="content">'+ this.settings.content +'</div>' + '<div class="btn_bar"></div>' + '</div>',
                    backBtn = (!this.settings.backBtn) ? '':'<div class="back_btn" data-icon="&#x0030"></div>'
				this.dialog = $('<div>').addClass('msgbox_masker').css({ zIndex : this.settings.zIndex}).html(templates).prependTo('body');
                this.dialog.find('.title').append(closeBtn);
				this.dialog.find('.title').prepend(backBtn);

				$('.close_btn').on('click',function(){
					_this.close();
				})

				if ($.isFunction(this.settings.cancel)) {
				   this.cancel();
				}
                $('.back_btn').on('click',function(){
                    var cbk = _this.settings.back();
                    if (cbk == undefined || cbk) {
                        _this.close();
                    }
                });
				if ($.isFunction(this.settings.confirm)) {
					this.confirm();
				}
			}
			//toast方式
			else if(this.settings.type == 'toast'){
				var templates = '<div class="content">'+ this.settings.content +'</div>';
				this.dialog = $('<div class="toast_box">').css({ zIndex : this.settings.zIndex}).html(templates).prependTo('body');
			}//loading
			else if(this.settings.type == 'loading'){
				var templates = '<i data-icon="&#x20AC"></i><p style="margin-top:.5rem;font-size:1.2rem;">'+ (this.settings.content || '请稍等...')+'</p>';
				this.dialog = $('<div class="loading">').addClass('msgbox_masker').css({ zIndex : this.settings.zIndex}).html(templates).prependTo('body');
			}
        },

        confirm : function() {
            var _this = this,
                btn_bar = this.dialog.find('.btn_bar');

            $('<a>', {
                text : this.settings.confirmText
            }).on("click", function() {
				var confirmCallback = _this.settings.confirm();
				if (confirmCallback == undefined || confirmCallback) {
					_this.close();
				}
            }).addClass( !!this.settings.confirmType ? 'confirm '+this.settings.confirmType :'confirm').appendTo(btn_bar);
        },

        cancel : function() {
            var _this = this,
                btn_bar = this.dialog.find('.btn_bar');
            function onClick(){
                 var cancelCallback = _this.settings.cancel();
                if (cancelCallback == undefined || cancelCallback) {
                    _this.close();
                }
            }
            
            $('<a>', {
                text : this.settings.cancelText
            },'.back_btn').on("click",onClick).addClass('cancel').prependTo(btn_bar);
        },

        close : function() {
            this.dialog.remove();
        },


		time : function() {
            var _this = this;
            this.closeTimer = setTimeout(function() {
                _this.close();
                if(_this.settings.finish)
                    _this.settings.finish();
            }, this.settings.time);
        }

    }

    Msgbox.defaults = {
		type: 'alert',
        title: '',
		content: '',
		closeBtn: false,
        confirm: null,
        cancel: null,
        confirmText: '',
        cancelText: '',
		time: null,
        finish:null,
        zIndex: 9999
    }

    var alert = function(options) {
		if(typeof(options)=='string'){
			Msgbox.defaults.content = options;
			Msgbox.defaults.closeBtn = true;
		}
        return new Msgbox(options);
    }

    window.alert = $.alert = alert;

})(window.Zepto, window);
