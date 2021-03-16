/* 
* @Author: zhaoye-ds1
* @Date:   2015-08-31 15:52:42
* @Last Modified by:   zhudanmei
* @Last Modified time: 2016-04-21 11:10:04
*/
!(function($,window,undefined){
    var store = [];
    var FlexTextarea = function(options){
        this.chineseAsTwo = options.chineseAsTwo;
        this.callback = options.leftLength || new Function;
        this.callback_new = options.length || new Function;
        /*this.callback = options.length || new Function;*/
        this.maxLength = options.maxLength;
        this.$el = $(options.el);
        this.$el.css('overflow','hidden');
        this.initHeight = this.$el.height();
        if(this.maxLength)
            this.$el.attr('maxlength',this.maxLength);
        this.$dummy = $(document.createElement('pre'));
        this.$dummy.css({
            'white-space': 'pre-wrap',
            'white-space': '-moz-pre-wrap',
            'white-space': '-pre-wrap',
            'white-space': '-o-pre-wrap',
            'word-wrap'  : 'break-word',
            'font-size'  : this.$el.css('font-size'),
            'width'      : this.$el.css('width'),
            'line-height': this.$el.css('line-height'),
            'text-indent': this.$el.css('text-indent'),
            'position'   : 'absolute',
            'z-index'    : '-999',
            'visibility' : 'hidden',
            'top'        : 0,
            'left'       : 0
        });
        $('body').append(this.$dummy);
        var entered = false;
        this.$el.on('input',$.proxy(this.checkHeight,this));
        //init
        this.checkHeight();
    };
    FlexTextarea.prototype.checkHeight = function(){
        var targetLength = this.native2ascii();
        if(this.maxLength)
            var leftLength = this.maxLength - targetLength;
        this.callback(leftLength);
        this.callback_new(targetLength);
    };
    FlexTextarea.prototype.native2ascii = function(){
        var val = this.$el.val();
        val = val.replace(/\n$/,'\n占位');
        this.$dummy.text(val+'');
        if(this.initHeight <= this.$dummy.height())
            this.$el.height(this.$dummy.height() + "px");
        else
            this.$el.height(this.initHeight + "px");
        var nativecode = val.replace(/[\n]/g,"\s\s").replace(/占位$/,"").split("");
        var len = 0;
        for ( var i = 0; i < nativecode.length; i++)
        {
            var code = Number (nativecode[i].charCodeAt (0));
            if (code > 127 && !!this.chineseAsTwo){
                len += 2;
            }else{
                len++;
            }
        }
        return len;
    };
    $.fn.flexTextarea = function(options){
        return this.each(function(idx,el){
            options.el = el;
            store.push(new FlexTextarea(options));
        });
    };
})($,window);

/*
使用方法
$(function(){
    $("#textarea").flexTextarea({
        //字长限制
        maxLength: 120,
        //剩余字长回调
        leftLength: function(value){
            console.log(value)
        }
    });
});
 */