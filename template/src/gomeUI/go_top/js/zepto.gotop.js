;
(function($, window, undefined) {

    var Gotop = function(element, options) {
        this.settings = $.extend({}, Gotop.defaults, options);
        this.$element = $(element);
        this.init();
    }

    Gotop.prototype = {

        init: function() {
            this.$element.hide();
            window.addEventListener('scroll', $.proxy(this.detect, this));
        },

        detect: function() {
            var height = window.screen.height,
                scrollY = window.scrollY,
                userAgent = this._UA();
            if (scrollY > height) {
                this._render();
            } else {
                this.$element.hide();
               // this._render();
            }
        },

        _UA: function() {
            var ua = navigator.userAgent;
            if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                return 'ios';
            } else {
                return '';
            }

        },

        _render: function() {
            this.$element.css({
                'display': 'block',
                'position': 'fixed',
                'bottom': this.settings.bottom,
                'right': this.settings.right,
                'width': this.settings.width,
                'height': this.settings.height,
                'text-align': 'center',  
                'line-height': this.settings.lineHeight,
                'transform': 'rotate(0deg)',
                '-webkit-transform': 'rotate(0deg)',
                'background': 'rgba(255, 255, 255, .8)',
                'borderRadius': '2rem',
                'color': '#999',
                'font-size': '0.9rem',
                'border': '1px solid #ccc',
                'box-sizing':'border-box',
                'z-index': '999'
            });
            if (this.$element.attr('data-icon') == '' || this.$element.attr('data-icon') == '&#xe801'||this.$element.attr('data-icon') == '0'||this.$element.attr('data-icon') == '&#x0030') {
                this.$element.attr('data-icon', '†') || this.$element.attr('data-icon', '&#x2020');
            }
            if (this.$element.html() == '') {
                this.$element.html('顶部');
            }
            
            if(typeof(this.$element.attr("data-gotop-type"))=="undefined"||this.$element.attr("data-gotop-type")==null){
                this.$element.css({
                    'padding-top':'.8rem',
                })
            }else{
                this.$element.css({
                    'padding-top':'0',
                })
                
            }
            this.$element.on('click', $.proxy(this.scrollTop, this))
        },

        scrollTop: function() {
            window.scrollTo(0, 0)
        }

    }

    Gotop.defaults = {
        width: '4rem',
        height: '4rem',
        bottom: '1.5rem',
        right: '0.5rem',
        lineHeight: 'none',
    }

    $.fn.gotop = function(options) {
        return this.each(function() {
            var gotop = new Gotop(this, options);
            return;
        });
    };

    $(function() {
        $('[data-gotop]').gotop();
    })

})(window.Zepto, window);