!(function(){
    var Bubble = function(el,options){
        this.$el = $(el);
        var ua = window.navigator.userAgent;
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        if(!!ipad || !!ipod || !!iphone)
            $('html').tap($.proxy(this._toggle,this));
        else
            $('html').click($.proxy(this._toggle,this));
        this.$bubble = null;
        this.x = 0;
        this.y = 0;
        this.options = {
            template: '',
            beforeShow: new Function,
            beforeHide: new Function,
            afterShow: new Function,
            afterHide: new Function
        };
        $.extend(true,this.options,options);
    }
    Bubble.prototype = {
        constructor: Bubble,
        _is$el: function(el){
            if(this.$el.find(el).length == 0 && this.$el[0] != el)
                return false;
            else
                return true;
        },
        _is$bubble: function(el){
            if(el != this.$bubble[0] && this.$bubble.find(el).length == 0)
                return false;
            else
                return true;
        },
        _show: function(){
            this.options.template = this.options.beforeShow(this) || this.options.template;
            this.y = this.$el.offset().top + this.$el.height();
            this.x = this.$el.offset().left;
            this.$bubble = $(this._template());
            $('body').append(this.$bubble);
            this.options.afterShow(this);
        },
        _hide: function(){
            this.options.beforeHide(this);
            this.$bubble.remove();
            this.$bubble = null;
            this.options.afterHide(this);
        },
        _toggle: function(e){
            e.preventDefault();
            //如果bubble没显示，且点击的物体是我们的目标启动器，则显示bubble
            if(!this.$bubble && this._is$el(e.target)){
                this._show();
                return;
            }else if(!this.$bubble && !this._is$el(e.target)){
            //如果bubble没显示，但点击的物体不是我的目标启动器，do nothing
                return;
            }else if(!this._is$bubble(e.target)){
            //如果bubble显示了，且点击物体不是bubble，那就隐藏它
                this._hide();
            }

        },
        _template: function(){
            return      '<div style="position:absolute;top:'+this.y+'px;left:'+this.x+'px;">'
                    +   this.options.template
                    +   '</div>';
        }
    }
    $.fn.bubble = function(options){
        return this.each(function(){
            $(this).data('bubble',new Bubble(this,options));
        })
    }
})();
