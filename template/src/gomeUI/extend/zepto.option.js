/* 
* @Author: zhaoye-ds1
* @Date:   2015/7/20 17:26:42
* @Last Modified by:   zhaoye-ds1
* @Last Modified time: 2015-08-14 13:13:29
* checkbox raido select 等options的功能插件
*/
!(function($){
    var group = {};
    var Radio = function(container,options){
        var scope = this;
        $(container).click(function(e){
            var groupName = $(this).data("radio") || $(this).attr("name");
            $.each(group[groupName],function(idx,el){
                if($(el).hasClass("radio")){
                    $(el).removeClass("radio_ckd");
                }else{
                    $(el).find(".radio").removeClass("radio_ckd");
                }
            })
            if($(this).hasClass("radio"))
                $(this).addClass("radio_ckd");
            else{
                $(this).find(".radio").addClass("radio_ckd");
            }
            if(!options)return;
            if(options.callback)
                options.callback($(this).val() || $(this).text().replace(/^\s*/,"").replace(/\s*$/,""),this,group);
        });
    };
    $.fn.radio = function(options){
        this.each(function(idx,value){
            var groupName = $(this).data("radio") || $(this).attr("name");
            if(group[groupName]){
                group[groupName].push(this);
            }else{
                group[groupName] = [];
                group[groupName].push(this);
            }
            var radio = new Radio(this,options);
        });
    };
})(Zepto);