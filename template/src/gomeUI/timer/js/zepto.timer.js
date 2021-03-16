;
(function ($) {
    var Timer = function (element, options) {
        this.settings = $.extend({}, Timer.defaults, options);
        this.$element = $(element);
        this.init();
    };
    Timer.prototype = {
        init: function (options) {
            this.$element.each(function (_index, timerDom) {
                var self = $(timerDom);
                self.on('complete', function () {
                    clearInterval(self.intervalId);
                    self.addClass('timeout');
                    self.onComplete(self);
                });
                return this.startCountdown(self, options);
            }.bind(this));
            return this;
        },

        fetchSecondsLeft: function (element) {
            var secondsLeft = element.data('seconds-left');
            if (secondsLeft) {
                return parseInt(secondsLeft, 10);
            }/* else {
                throw 'err';
            }*/
        },

        startCountdown: function (element, options) {
            options = options || {};

            var intervalId = null,
                secondsLeft = this.fetchSecondsLeft(element),
                refreshRate = options.refreshRate || 1000,
                endTime = secondsLeft + this.currentTime(),
                timeLeft = endTime - this.currentTime();
            var defaultComplete = function () {
                clearInterval(intervalId);
                return this.clearTimer(element);
            }.bind(this);
            element.onComplete = this.settings.onComplete || defaultComplete;


            this.setFinalValue(this.formatTimeLeft(timeLeft), element);


            intervalId = setInterval((function () {
                timeLeft = endTime - this.currentTime();
                this.setFinalValue(this.formatTimeLeft(timeLeft), element);
            }.bind(this)), refreshRate);
            element.intervalId = intervalId;
        },

        clearTimer: function (element) {
            element.html('<span class="time_end">已结束</span>');
        },

        currentTime: function () {
            return Math.round((new Date()).getTime() / 1000);
        },

        formatTimeLeft: function (timeLeft) {
            var days, hours, minutes, remaining, seconds, type;
            var lpad = function (n, width, idx) {
                var padded = null;
                width = width || 2;
                n = n + '';
                n.length >= width ? padded = n :
                    padded = Array(width - n.length + 1).join(0) + n;
                return padded;
            };
            remaining = new Date(timeLeft * 1000);
            days = Math.floor(timeLeft / 86400);
            hours = remaining.getUTCHours();
            minutes = remaining.getUTCMinutes();
            seconds = remaining.getUTCSeconds();

            type = this.$element.data('type');
            if ((+days === 0 && +hours === 0 && +minutes === 0 && +seconds === 0)||timeLeft<=-1) {
                return [];
            } else {
                var day = parseInt(lpad(days)),
                    timeStr = '',
                    timeArr = new Array();
                if (day >= 3) {
                    if(type == "cms" || type == "under3" || type=="day" || type == "day2"){
                        timeStr = '3天以上'
                    }else{
                        timeStr = '三天以上'
                    }
                    /*timeStr = type == 'cms' ? '3天以上' : '三天以上';*/
                /*} else if (day <3 && type == "under3") {*/
                }  else if (day < 3 ) {

                    if(day >=1){
                        if (type == "cms") {
                            if (day >= 1 && day < 2) {
                                timeStr = '1天以上'
                            } else {
                                timeStr = '2天以上'
                            }
                        } else {
                            timeStr = '两天'
                        }
                    }
                    if(day < 1){
                        this.settings.format == 'hh时mm分ss秒' ?
                        timeStr = lpad(hours) + '时' + lpad(minutes) + '分' + lpad(seconds) + '秒' :
                        timeStr = lpad(hours) + ':' + lpad(minutes) + ':' + lpad(seconds) + ' ';
                    }

                    if( type == "under3"){
                        hours = Math.floor(remaining/(1000*60*60));
                        minutes = Math.floor(remaining/(1000*60))%60;
                        seconds = Math.floor(remaining/1000)%60;
                        this.settings.format == 'hh时mm分ss秒' ?
                        timeStr = lpad(hours) + '时' + lpad(minutes) + '分' + lpad(seconds) + '秒' :
                        timeStr = lpad(hours) + ':' + lpad(minutes) + ':' + lpad(seconds) + ' ';
                    }
                    if( type == "day2"){
                       this.settings.format == 'dd天hh时mm分ss秒' ?
                        timeStr = lpad(days)+'天' + lpad(hours) + '时' + lpad(minutes) + '分' + lpad(seconds) + '秒' :
                        timeStr = lpad(days)+'天' + lpad(hours) + ':' + lpad(minutes) + ':' + lpad(seconds) + ' ';
                    }

                    else if(type == "day" && day>=1){

                        this.settings.format == 'dd天hh时mm分ss秒' ?
                        timeStr = lpad(days)+'天' + lpad(hours) + '时' + lpad(minutes) + '分' + lpad(seconds) + '秒' :
                        timeStr = lpad(days)+'天' + lpad(hours) + ':' + lpad(minutes) + ':' + lpad(seconds) + ' ';
                    }
                }

                timeArr = timeStr.split('');
                return timeArr;
            }
        },

        setFinalValue: function (finalValues, element) {
            var timeDom = '';
            var reg = new RegExp("^[0-9]*$");
            if (finalValues.length === 0) {
                this.clearTimer(element);
                element.trigger('complete');
                return false;
            } else if (finalValues.length > 6) {
                for (var i = 0; i < finalValues.length; i++) {
                    if (!(reg.test(finalValues[i]))) {
                        if ($(element).attr('data-separate') == 'both') {
                            timeDom += '<div class="timebox differ" style="display:inline-block;">'
                            timeDom +='<span class="timedom">' + finalValues[i - 2] + '</span>'
                            timeDom +='<span class="timedom">' + finalValues[i - 1] + '</span>'
                            timeDom +='</div>' + finalValues[i];
                        } else {
                            timeDom += '<div class="timebox" style="display:inline-block;">'
                            timeDom +='<span class="timedom">' + finalValues[i - 2] + '</span>'
                            timeDom += '<span class="timedom">' + finalValues[i - 1] + '</span>'
                            timeDom +='</div>' + finalValues[i];
                        }
                    }
                }
                element.html(timeDom)
            } else {
                for (var i = 0; i < finalValues.length; i++) {
                    if (reg.test(finalValues[i])) {
                        finalValues[i] = '<span class="timedom">' + finalValues[i] + '</span>';
                    }
                    timeDom += finalValues[i];
                }
                element.html(timeDom)
            }
        }
    };

    Timer.defaults = {
        format: 'hh:mm:ss',
        onComplete: function () {}
    };

    $.fn.timer = function (options) {
        return this.each(function () {
            var timer = new Timer(this, options);
            return;
        });
    };

})(Zepto); 