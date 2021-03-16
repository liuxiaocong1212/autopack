;(function($, window, undefined) {
    "use strict";
		
	var Progress = function(element, options){
		
		this.settings = $.extend({}, Progress.defaults, options);
		this.$element = $(element);

        var canvas = document.createElement("canvas");
		this.canvas = canvas;
		
		this.$element.append(canvas);
        this.ctx = canvas.getContext('2d');
		
        this.current_value = this.settings.initValue || this.settings.minValue || 0;
    }

    Progress.prototype = {
		
        constructor: progress,
		
        init: function (){
            var options = this.settings,
                canvas = this.canvas,
                ctx = this.ctx,
                d = (options.radius + options.barWidth) * 2, //直径
                o = d / 2; //圆心

            this._formatter = typeof(options.format) == "function" ? options.format : this._formatter(options.format);
            this.maxLength = options.percentage ? 4 : this._formatter(options.maxValue).length;

			//draw
            canvas.width = d;
            canvas.height = d;
            ctx.strokeStyle = options.barBgColor;
            ctx.lineWidth = options.barWidth;
            ctx.beginPath();
            ctx.arc(o, o, options.radius, 0, 2 * Math.PI);
            ctx.stroke();

            this.imgData = ctx.getImageData(0, 0, d, d);
            this._value(this.current_value);

            return this;
        },
		
		_formatter : function(pattern){
			return function (num){
				if(!pattern){
					return num.toString()
				}
				num = num || 0;
				var numRev = num.toString().split('').reverse(),
					output = pattern.split('').reverse(),
					i = 0,
					lastHashReplaced = 0;

				for (var ln=output.length; i<ln; i++){
					if (!numRev.length) break;
					if (output[i] == '#'){
						lastHashReplaced = i;
						output[i] = numRev.shift();
					}
				}

				output.splice(lastHashReplaced+1, output.lastIndexOf('#') - lastHashReplaced, numRev.reverse().join(''));

				return output.reverse().join('');
			}
		},
		
        _value: function(val){
            if (val === undefined || isNaN(val)) {
                return this.current_value;
            }
			val = parseInt(val);
            var ctx = this.ctx,
                options = this.settings,
                curColor = options.barColor,
				circ = Math.PI * 2,
				quart = Math.PI / 2,
                d = (options.radius + options.barWidth) * 2,
                minVal = options.minValue,
                maxVal = options.maxValue,
                o = d / 2;

            val = val < minVal ? minVal : val > maxVal ? maxVal : val;

            var perVal = Math.round(((val - minVal) * 100 / (maxVal - minVal)) * 100) / 100,
                dispVal = options.percentage ? perVal + '%' : this._formatter(val); //format

            this.current_value = val;

            ctx.putImageData(this.imgData, 0, 0);
            ctx.strokeStyle = curColor;
            if (options.roundCorner){
				ctx.lineCap = 'round'
			}
            ctx.beginPath();
            ctx.arc(o, o, options.radius, -(quart), ((circ) * perVal / 100) - quart, false);
            ctx.stroke();

            if (options.displayNumber) {
                var cFont = ctx.font.split(' '),
                    weight = options.fontWeight,
                    fontSize = options.fontSize || (d / (this.maxLength - (Math.floor(this.maxLength*1.4/4)-1)));

                cFont = options.fontFamily || cFont[cFont.length - 1];
				
                ctx.fillStyle = options.fontColor || curColor;
                ctx.font = weight +" "+ fontSize + "px " + cFont;
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx.fillText(dispVal, o, o);
            }

            return this;
        },

        drawAnimate: function (value) {
            var options = this.settings,
                counter = this.current_value || options.minValue,
                self = this,
                incBy = Math.ceil((options.maxValue - options.minValue) / (options.frameNum || (options.percentage ? 100 : 500))),
                back = value < counter;

            if (this.intvFunc){
				clearInterval(this.intvFunc)
			} 
			
            this.intvFunc = setInterval(function () {
                if ((!back && counter >= value) || (back && counter <= value)) {
                    if (self.current_value == counter) {
                        clearInterval(self.intvFunc);
                        return;
                    } else {
                        counter = value;
                    }
                }
                self._value(counter);
                if (counter != value) {
                    counter = counter + (back ? -incBy : incBy)
                };
            }, options.frameTime);

            return this;
        },

    };

    Progress.defaults = {
        radius: 50,
        barWidth: 5,
		roundCorner: true,
        barBgColor: '#ccc',
        barColor: '#ff5c5c',
		percentage: true,
		initValue: 0,
		minValue: 0,
        maxValue: 100,
        displayNumber: true,
		fontFamily: null,
		fontColor: '#000',
        fontWeight: 'bold',
		fontSize : null,
		//非百分比情况
		format: null,
		// 帧动画
        frameTime: 10,
        frameNum: null
    };
	
    function progress(element, options) {
        var progObj = new Progress(element, options);
        progObj.init();
        return progObj;
    }

	$.fn.progress = function (options) {
		return this.each(function () {
			var newPCObj = progress(this, options);
			//$.data(this, 'radialIndicator', newPCObj);
		});
	};
	
	window.progress = progress;

})(window.Zepto, window);