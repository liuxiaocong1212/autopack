/*
* checkbox raido select 等options的功能插件
* @Author: zhaoye-ds1
* @Date:   2015/7/20 17:26:42
* @Last Modified by:   zhaoye-ds1
* @Last Modified time: 2015-12-02 11:47:00
*/
!(function($){
    var group = {};
    var Radio = function(container,options){
        var scope = this;
        var useDataAttr =  options.useDataAttr || false;
        var canToggle = options.canToggle || false;
        if(useDataAttr){
            if(!$(container).data("radio-ckd"))
                $(container).data('radio-ckd','false');
        }
        $(container).click(function(e){
            var groupName = $(this).data("radio") || $(this).attr("name");
            if(useDataAttr){
                var lastThisState = $(this).filter('[data-radio]').data('radio-ckd');
                $.each(group[groupName],function(idx,el){
                    if($(el).data("radio-ckd") == true){
                        $(el).data('radio-ckd','false');
                    }else{
                        $(this).find("[data-radio]").data("radio-ckd",'false');
                    }
                })
                if(canToggle){
                    if(!lastThisState){
                        $(this).filter('[data-radio]').data("radio-ckd",'true')
                    }else{
                        $(this).filter('[data-radio]').data("radio-ckd",'false')
                    }
                }else{
                    $(this).filter('[data-radio]').data("radio-ckd",'true')
                }
            }else{
                var lastThisState = $(this).filter('.radio').hasClass('radio_ckd')
                $.each(group[groupName],function(idx,el){
                    if($(el).hasClass("radio")){
                        $(el).removeClass("radio_ckd");
                    }else{
                        $(el).find(".radio").removeClass("radio_ckd");
                    }
                })
                if(canToggle){
                    if(!lastThisState){
                        $(this).filter(".radio").addClass("radio_ckd");
                    }else{
                        $(this).filter('.radio').removeClass('radio_ckd');
                    }
                }else{
                    $(this).filter(".radio").addClass("radio_ckd");
                }
            }
            if(!options)return;
            if(options.callback)
                options.callback($(this).val() || $(this).text().trim(),this,group);
            if(options.onChange){
                var curGroup = group;
                for(var key in group){
                    for(var i=0; i<group[key].length; i++){
                        if(this == group[key][i]){
                            curGroup = group[key];
                            break;
                        }
                    }
                }
                if(!useDataAttr)
                    options.onChange($(this).val() || $(this).text().trim(),$(this).filter('.radio_ckd') ? this : null,curGroup);
                else
                    options.onChange($(this).val() || $(this).text().trim(),$(this).filter('[data-radio]').data('radio-ckd') ? this : null,curGroup);
            }
        });
    };
    $.fn.radio = function(options){
        this.each(function(idx,value){
            if(this.__radio)return;
            var groupName = $(this).data("radio") || $(this).attr("name");
            if(group[groupName]){
                group[groupName].push(this);
            }else{
                group[groupName] = [];
                group[groupName].push(this);
            }
            this.__radio = new Radio(this,options);
        });
    };
})(Zepto);
