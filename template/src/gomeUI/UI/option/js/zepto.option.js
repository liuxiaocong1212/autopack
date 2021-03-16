/*
 * checkbox raido select 等options的功能插件
 * @Author: zhaoye-ds1
 * @Date:   2015/7/20 17:26:42
 * @Last Modified by: baishuang
 * @Last Modified time: 2016-05-03 18:00:00
 */
!(function($) {
    var group = {};
    var Radio = function(container, options) {
        var scope = this;
        var useDataAttr = options.useDataAttr || false;
        var canToggle = options.canToggle || false;
        var checkedClass = options.checkedClass || 'radio_ckd';
        if (useDataAttr) {
            if (!$(container).data("radio-ckd"))
                $(container).data('radio-ckd', 'false');
        }
        $(container).click(function(e) {
            var $this = $(this);
            if (!($(this).data("radio"))) {
                if ($(this).find(".radio").length == 0) {
                    return;
                } else {
                    $this = $(this).find(".radio");
                }
            }
            var groupName = $this.data("radio") || $this.attr("name");
            if (useDataAttr) {
                var lastThisState = $this.filter('[data-radio]').data('radio-ckd');
                if ($this.filter('[data-radio]').hasClass("disabled")) return;
                $.each(group[groupName], function(idx, el) {
                    if ($(el).data("radio-ckd") == true) {
                        $(el).data('radio-ckd', 'false');
                    } else {
                        $this.find("[data-radio]").data("radio-ckd", 'false');
                    }
                })
                if (canToggle) {
                    if (!lastThisState) {
                        $this.filter('[data-radio]').data("radio-ckd", 'true')
                    } else {
                        $this.filter('[data-radio]').data("radio-ckd", 'false')
                    }
                } else {
                    $this.filter('[data-radio]').data("radio-ckd", 'true')
                }
            } else {
                var lastThisState = $this.filter('.radio').hasClass(checkedClass);
                if ($this.filter('.radio').hasClass("disabled")) return;
                $.each(group[groupName], function(idx, el) {
                    if ($(el).hasClass("radio")) {
                        $(el).removeClass(checkedClass);
                    } else {
                        $(el).find(".radio").removeClass(checkedClass);
                    }

                })
                if (canToggle) {
                    if (!lastThisState) {
                        $this.filter(".radio").addClass(checkedClass);
                    } else {
                        $this.filter('.radio').removeClass(checkedClass);
                    }
                } else {
                    $this.filter(".radio").addClass(checkedClass);
                }
            }
            if (!options) return;
            if (options.callback)
                options.callback($this.val() || $this.text().trim(), this, group);
            if (options.onChange) {
                var curGroup = group;

                for (var key in group) {
                    for (var i = 0; i < group[key].length; i++) {
                        if (this == group[key][i]) {
                            curGroup = group[key];
                            break;
                        }
                    }
                }
                if (!useDataAttr)
                    options.onChange($this.val() || $this.text().trim(), $this.filter('.checkedClass') ? this : null, curGroup);
                else
                    options.onChange($this.val() || $this.text().trim(), $this.filter('[data-radio]').data('radio-ckd') ? this : null, curGroup);
            }
        });
    };
    $.fn.radio = function(options) {
        this.each(function(idx, value) {
            if (this.__radio) return;
            var $this = $(this);
            if (!($(this).data("radio"))) {
                $this = $(this).find(".radio");
            }
            var groupName = $this.data("radio") || $this.attr("name");
            if (group[groupName]) {
                group[groupName].push(this);
            } else {
                group[groupName] = [];
                group[groupName].push(this);
            }
            this.__radio = new Radio(this, options);
        });
    };
})(Zepto);
!(function($) {
    var group = {};
    var iCheck = function(ele, options) {
        $(ele).on('click', function() {
            $this = $(this);
            if (!($(this).data("checkbox"))) {
                if ($(this).find(".checkbox").length == 0) {
                    return;
                } else {
                    $this = $(this).find(".checkbox");
                }
            }
            if ($this.hasClass('disabled')) {
                return;
            } else {
                $this.toggleClass('checked');
            }
            if (!options) return;
            if (options.callback)
                options.callback($this.val() || $this.text().trim(), this, group);
            if (options.onChange) {
                var curGroup = group;
                for (var key in group) {
                    for (var i = 0; i < group[key].length; i++) {
                        if (this == group[key][i]) {
                            curGroup = group[key];
                            break;
                        }
                    }
                }
                options.onChange($this.val() || $this.text().trim(), $this.filter('.checked') ? this : null, curGroup);
            }
        });
    }

    $.fn.iCheck = function(options) {
        this.each(function() {
            var groupName = $(this).data("checkbox") || $(this).attr("name");
            if (group[groupName]) {
                group[groupName].push(this);
            } else {
                group[groupName] = [];
                group[groupName].push(this);
            }
            var checkbox = new iCheck(this, options);
        });
    }
})(Zepto);