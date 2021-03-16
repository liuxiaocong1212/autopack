(function(window){
    window.gomeBase={
      //dom指html目录dom标签
      clicks:'click',
      /**
       * 写cookie 1day = 24*60*60*1000
       *name:cookie名称,value:内容,expire_time:过期时间
       */
      setCookie:function(name, value, expire_time){
        var exp = new Date();
        exp.setTime(exp.getTime() + expire_time);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
      },
      /**
       *读cookie 
       */
      getCookie:function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
          return (arr[2]);
        else
          return null;
      },
      /*
      *key:localstorage名称
      *value:localstorage内容
      */
      setStorage:function(key,value){
    	  try{
    		  window.localStorage[key] = value;
    	  }catch(e){
    		  
    	  }
        
      },
      getStorage:function(key){
        return window.localStorage.getItem(key)
      },
      clearStorage:function(key){
        if(key){
          window.localStorage.removeItem(key);
        }else{
          window.localStorage.clear();
        }
      },
      //后退键
      hrefBack:function (dom){
        dom.addEventListener(gomeBase.clicks,function (){
          history.back();
        },false);
      },
      //获取当前页面的url中的参数
      getUrlParam:function(paramName){
          var paramValue = "";
          var isFound = false;
          if (document.location.search.indexOf("?") == 0 && document.location.search.indexOf("=")>1){
              arrSource = unescape(document.location.search).substring(1,document.location.search.length).split("&");
              i = 0;
              while (i < arrSource.length && !isFound){
                  if (arrSource[i].indexOf("=") > 0){
                       if (arrSource[i].split("=")[0].toLowerCase()==paramName.toLowerCase()){
                          paramValue = arrSource[i].split("=")[1];
                          isFound = true;
                       }
                  }
                  i++;
              }   
          }
          return paramValue;
      },
      //获取上个兄弟节点
      prevChild:function(dom){
        if(dom.previousSibling.nodeType==3){
          return dom.previousSibling.previousSibling;
        }else if(dom.previousSibling.nodeType==1){
          return dom.previousSibling;
        }else{
          return dom.previousSibling;
        }
      },
      //获取下个兄弟节点
      nextChild:function(dom){
        if(dom.nextSibling.nodeType==3){
          return dom.nextSibling.nextSibling;
        }else if(dom.nextSibling.nodeType==1){
          return dom.nextSibling;
        }else{
          return dom.nextSibling;
        }
      },
      //添加class名字
      addClass: function( obj,value ) {
          if(!gomeBase.hasClass(obj,value))
              obj.className = obj.className?obj.className+" "+value:value;
      },
      //判断是否有class名字
      hasClass: function( obj,value ) {
          var arr = obj.className.split(/\s/);
          for(var i in arr){
              if(arr[i] === value)
                  return true;
          }
          return false;
      },
      //移出class名字
      removeClass: function( obj,value ) {
          var cur = obj.className;
          cur = cur.split(' ');
          for(var i = 0;i<cur.length;i++){
              gomeBase.lrReplace(cur[i]);
              if(cur[i] == value){
                delete cur[i];
                cur.length-=1;
              }
          }
          if(cur.length>1){
            obj.className = cur.join(' ');
          }else if(cur.length==1){
            obj.className =cur[0];
          }else if(cur.length==0){
             obj.className='';
          }
      },
      /*
      *获取上层标签
      *通过标签名
      *dom当前节点,val要获取节点的nodeName
      */
      getParent:function (dom,val){
        var getParentnum=5;
        function getP(dom,val){
          if(dom.nodeName!=val&&getParentnum>0){
            getParentnum--;
            return getP(dom.parentNode,val);
          }else if(dom.nodeName==val){
            return dom;
          }
        }
        return getP(dom,val);
      },
      /*
      *获取上层标签
      *通过标签class名
      *dom当前节点,val要获取节点的class名字
      */
      getParentClass:function (dom,val){
        var getParentnum=5;
        function getP(dom,val){
          if(!gomeBase.hasClass(dom,val)&&getParentnum>0){
            getParentnum--;
            return getP(dom.parentNode,val);
          }else if(gomeBase.hasClass(dom,val)){
            return dom;
          }
        }
        return getP(dom,val);
      },
      //去除字符串左右两边的空格
      lrReplace:function (text){
        if (typeof(text) == "string")
        {
          return text.replace(/^\s*|\s*$/g, "");
        }
        else
        {
          return text;
        }
      },
      //获得字符串实际长度，中文2，英文1
      getLength:function(str) {
          var realLength = 0, len = str.length, charCode = -1;
          for (var i = 0; i < len; i++) {
              charCode = str.charCodeAt(i);
              if (charCode >= 0 && charCode <= 128) realLength += 1;
              else realLength += 2;
          }
          return realLength;
      },
      //把json格式转换成字符串
      json2String:function (jsonData) {
        var strArr = [];
        for(var k in jsonData) {
            strArr.push(k + "=" + jsonData[k]);    
        }
        return strArr.join("&");
      },
      /*
      *删除数组里面的特定值
      *array操作的数组
      *string删除的值
      */
      delArray:function (array,string){
        if(array[array.length-1]==string){
          array.pop();
        }else{
          for(var i=0;i<(array.length-1);i++){
            if(array[i]==string){
              for(var k=i;k<array.length;k++){
                if(k==(array.length-1)){
                  array.pop();
                }else{
                  array[k]=array[k+1];
                }
              }
              i--;
            }
          }
        }
        return array;
      },
      /*
        ajaxs={
            url:,
            type:get/post,
            dataType:json/formData,
            data:{username:123,password:23}username=abc&password=123,
            formData:{form:form,ipts:[{name:key,value:value}]},ipts:name是传后台的key名称,value是input
            success:function (){},
            error:function (){},
            callback:function (){}
        }
      */
      ajax:function(ajaxs){
        var xmlhttp;
        if(window.XMLHttpRequest){
          xmlhttp=new XMLHttpRequest();
        }else{
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
          if (xmlhttp.readyState==4&&xmlhttp.status==200){
                ajaxs.success(xmlhttp.response);
            }else if(xmlhttp.readyState==4&&xmlhttp.status==404){
                ajaxs.error();
            }
          }
        xmlhttp.open(ajaxs.type,ajaxs.url,true);
        if(ajaxs.data!=undefined){
          if(ajaxs.dataType=='json'){
            xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            var str='',num=0;
            for(var i in ajaxs.data){
              if(num==0){
                str=i+'='+ajaxs.data[i];   
              }
              else{
                str+='&'+i+'='+ajaxs.data[i];
              }
              num++;
            }
            xmlhttp.send(str);
          }else if(ajaxs.dataType=='formData'){
            var formData= new FormData(ajaxs.formData.form);
            var a_ipts=ajaxs.formData.ipts;
            for(var i=0;i<a_ipts.length;i++){
              formData.append(a_ipts[i].name,a_ipts[i].value);
            }
          }
        }else{
            xmlhttp.send();
        }
        xmlhttp.upload.onprogress=function(){
          if(callback!=undefined){
            callback();
          }
        }
      },
      /*
        triggers={
            evet:'click',
            cont:,
            obj:obj/document
        }
      */
      trigger:function(triggers){
          var event = document.createEvent('HTMLEvents');
          event.initEvent(triggers.evet, true, true);
          event.eventType = 'message';
          event.cont =  triggers.cont;
          var objs = triggers.obj?triggers.obj:document;
          objs.dispatchEvent(event);
      },
      //css3动画支持测试
      fx :{
          off:true,
          prefix : '',
          eventPrefix : '',
          endEventName : '', 
          endAnimationName: '',
          vendors : { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
          document : window.document, 
          testEl : document.createElement('div'),
          supportedTransforms : /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
          transform : '',
          transitionProperty : '',
          transitionDuration : '', 
          transitionTiming : '',
          animationName : '', 
          animationDuration : '', 
          animationTiming : '',
          cssReset : {},
          speeds: { _default: 400, fast: 200, slow: 600 },
          cssPrefix :'',
          transitionEnd : '',
          animationEnd : '',
          dasherize : function(str) { return this.downcase(str.replace(/([a-z])([A-Z])/, '$1-$2')) },
          downcase : function(str) { return str.toLowerCase() },
          normalizeEvent : function(name) { return this.eventPrefix ? this.eventPrefix + name : this.downcase(name) },
          
          init :function(){
              for(var i in this.vendors){
                  if (this.testEl.style[this.vendors[i] + 'TransitionProperty'] !== undefined) {
                    this.prefix = '-' + this.downcase(this.vendors[i]) + '-'
                    this.eventPrefix = this.downcase(this.vendors[i])
                  }
                }
            this.transform = this.prefix + 'transform'
            this.cssReset[this.transitionProperty = this.prefix + 'transition-property'] =
            this.cssReset[this.transitionDuration = this.prefix + 'transition-duration'] =
            this.cssReset[this.transitionTiming   = this.prefix + 'transition-timing-function'] =
            this.cssReset[this.animationName      = this.prefix + 'animation-name'] =
            this.cssReset[this.animationDuration  = this.prefix + 'animation-duration'] =
            this.cssReset[this.animationTiming    = this.prefix + 'animation-timing-function'] = ''

            this.off = (this.eventPrefix === undefined && this.testEl.style.transitionProperty === undefined);
            this.cssPrefix = this.prefix;
            this.transitionEnd = this.normalizeEvent('TransitionEnd');
            this.animationEnd = this.normalizeEvent('AnimationEnd');
            this.testEl = null;
          }
            
      },
      /*animate({
          el:ps[m],
          properties:{width:W},
          duration:1000,
          ease:'ease-In',
          callback:function (){}
      });
      */
      animate : function(animation){
          if(animation.duration){
            animation.duration = (typeof animation.duration == 'number' ? animation.duration :
                          (this.fx.speeds[animation.duration]||this.fx.speeds._default))/1000;
          } 
          var key, cssValues = {}, cssProperties, transforms = '',
              that = this, wrappedCallback, endEvent = this.fx.transitionEnd;
          if (animation.duration===undefined){
            animation.duration = 0.4;
          }
          if(this.fx.off){
            animation.duration=0;
          }
          var css='';
          if (typeof animation.properties=='string'){
            cssValues[animationName]=animation.properties;
            cssValues[animationDuration]=animation.duration + 's';
            cssValues[animationTiming]=(animation.ease || 'linear');
            endEvent=this.fx.animationEnd;
          } else {
            cssProperties=[];
            for (key in animation.properties){
              if (this.fx.supportedTransforms.test(key)){
                transforms+=key + '(' + animation.properties[key] + ') ';
              }else{
                cssValues[key] = animation.properties[key], cssProperties.push(this.fx.dasherize(key));
              }
            }
            if (transforms){cssValues[transforms] = transforms, cssProperties.push(transforms);}
            if (animation.duration > 0 && typeof animation.properties === 'object') {
              cssValues[this.fx.transitionProperty] = cssProperties.join(', ');
              cssValues[this.fx.transitionDuration] = animation.duration + 's';
              cssValues[this.fx.transitionTiming] = (animation.ease || 'linear');
            }
          }
          wrappedCallback = function(event){
            if(typeof event!=='undefined'){
              if(event.target!==event.currentTarget) return
              event.target.removeEventListener(endEvent, wrappedCallback);
            }
            var css = '';
            for (key in gomeBase.fx.cssReset){
              css += key + ':' + gomeBase.fx.cssReset[key] + ';';
            }
            this.style.cssText += ';' + css;
            animation.callback && animation.callback.call(this);
          }
          if (animation.duration>0){
            animation.el.addEventListener(endEvent, wrappedCallback,false);
          }
          for (key in cssValues){
            if (!cssValues[key] && cssValues[key] !== 0){
              animation.el.style.removeProperty(dasherize(key));
            }else{
              css += this.fx.dasherize(key) + ':' + cssValues[key] + ';';
            } 
          }
          animation.el.style.cssText += ';' + css;
        },
      /*tween算法
       *Tween.Quad.easeOut(t,b,c,d)
       *t: current time（当前时间）；b: beginning value（初始值）；c: change in value（变化量）；d: duration（持续时间）
      */
      tween:{
            Linear:function(t,b,c,d){returnc*t/d+b;},
            Quad:{
              easeIn:function(t,b,c,d){
                return c * (t /= d) * t + b;
              },
              easeOut:function(t,b,c,d){
                return -c *(t /= d)*(t-2) + b;
              },
              easeInOut:function(t,b,c,d) {
                if((t/=d/2)<1){
                  return c/2*t*t+b;
                }
                return -c/2*((--t)*(t-2)-1)+b;
              }
            },
            Cubic:{
              easeIn:function(t,b,c,d){
                return c*(t/=d)*t*t+b;
              },
              easeOut:function(t,b,c,d){
                return c*((t=t/d-1)*t*t+1)+b;
              },
              easeInOut:function(t,b,c,d){
                if((t/=d/2)<1){
                  return c/2*t*t*t+b;
                }
                return c/2*((t-=2)*t*t+2)+b;
              }
            },
            Quart:{
              easeIn:function(t,b,c,d){
                return c*(t/=d)*t*t*t+b;
              },
              easeOut:function(t,b,c,d){
                return -c*((t=t/d-1)*t*t*t-1)+b;
              },
              easeInOut:function(t,b,c,d){
                if((t/=d/2)<1){
                  return c/2*t*t*t*t+b;
                }
                return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
              }
            },
            Quint:{
              easeIn:function(t,b,c,d){
                return c*(t/=d)*t*t*t*t+b;
              },
              easeOut:function(t,b,c,d){
                return c*((t=t/d-1)*t*t*t*t+1)+b;
              },
              easeInOut:function(t,b,c,d){
                if((t/=d/2)<1){
                  return c/2*t*t*t*t*t+b;
                }
                return c/2*((t-=2)*t*t*t*t+2)+b;
              }
            },
            Sine:{
              easeIn:function(t,b,c,d){
                return -c*Math.cos(t/d*(Math.PI/2))+c+b;
              },
              easeOut:function(t,b,c,d){
                return c*Math.sin(t/d*(Math.PI/2))+b;
              },
              easeInOut:function(t,b,c,d){
                return -c/2*(Math.cos(Math.PI*t/d)-1)+b;
              }
            },
            Expo:{
              easeIn:function(t,b,c,d){
                return (t==0)?b:c*Math.pow(2,10*(t/d-1))+b;
              },
              easeOut: function(t, b, c, d) {
                return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;
              },
              easeInOut:function(t,b,c,d){
                if(t==0){
                  return b;
                }
                if(t==d){
                  return b+c;
                }
                if((t/=d/2)<1){
                  return c/2*Math.pow(2,10*(t-1))+b;
                } 
                return c/2*(-Math.pow(2,-10*--t)+2)+b;
              }
            },
            Circ:{
              easeIn:function(t,b,c,d){
                return -c*(Math.sqrt(1-(t/=d)*t)-1)+b;
              },
              easeOut:function(t,b,c,d){
                return c*Math.sqrt(1-(t=t/d-1)*t)+b;
              },
              easeInOut:function(t,b,c,d){
                if((t/=d/2)<1){
                  return -c/2*(Math.sqrt(1-t*t)-1)+b;
                }
                return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;
              }
            },
            Elastic:{
              easeIn:function(t,b,c,d,a,p){
                var s;
                if(t==0){
                  return b;
                }
                if((t/=d)==1){
                  return b+c;
                }
                if(typeof p=="undefined"){
                  p=d*0.3;
                }
                if(!a||a<Math.abs(c)){
                  s=p/4;
                  a=c;
                }else{
                  s=p/(2*Math.PI)*Math.asin(c/a);
                }
                return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
              },
              easeOut:function(t,b,c,d,a,p){
                var s;
                if(t==0){
                  return b;
                }
                if((t/=d)==1){
                  return b+c;
                }
                if(typeof p=="undefined"){
                  p=d*0.3;;
                } 
                if(!a||a<Math.abs(c)){
                  a=c; 
                  s=p/4;
                }else{
                  s=p/(2*Math.PI)*Math.asin(c/a);
                }
                return (a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b);
              },
              easeInOut:function(t,b,c,d,a,p){
                var s;
                if(t==0){
                  return b;
                }
                if((t/=d/2)==2){
                  return b+c;
                }
                if(typeof p=="undefined"){
                  p=d*(0.3*1.5);
                } 
                if(!a||a<Math.abs(c)){
                  a=c; 
                  s=p/4;
                }else{
                  s=p/(2*Math.PI)*Math.asin(c/a);
                }
                if(t<1){
                  return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
                } 
                return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b;
              }
            },
            Back:{
                easeIn:function(t,b,c,d,s){
                  if(typeof s=="undefined"){
                    s=1.70158;
                  }
                  return c*(t/=d)*t*((s+1)*t-s)+b;
                },
                easeOut:function(t,b,c,d,s){
                  if (typeof s=="undefined"){
                    s=1.70158;
                  }
                  return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
                },
                easeInOut:function(t,b,c,d,s){
                  if (typeof s=="undefined"){
                    s=1.70158;
                  } 
                  if((t/=d/2)<1){
                    return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;
                  }
                  return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;
                }
            },
            Bounce:{
                easeIn:function(t,b,c,d){
                  return c-gomeBase.tween.Bounce.easeOut(d-t,0,c,d)+b;
                },
                easeOut: function(t, b, c, d) {
                  if((t/=d)<(1/2.75)){
                      return c*(7.5625*t*t)+b;
                  }else if(t<(2/2.75)){
                    return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b;
                  }else if(t<(2.5/2.75)){
                    return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b;
                  }else{
                    return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b;
                  }
                },
                easeInOut:function(t,b,c,d){
                    if(t<d/2){
                      return gomeBase.tween.Bounce.easeIn(t*2,0,c,d)*0.5+b;
                    }else{
                      return gomeBase.tween.Bounce.easeOut(t*2-d,0,c,d)*0.5+c*0.5+b;
                    }
                }
            }
      },
      /*
      *运动函数
      *start:开始时间
      *end:结束时间
      *step:一共多少步完成
      *每一步执行的事件
      *最后结束执行的事件
      */
      moveTrack:function(start,end,step,callback1,callback2,callback3){
          var t=0,b=start,c=end-start,d=step,x,time,bool=true;
          function moveOn(){
              if(t<d&&bool){
                  t++;
                  if(callback3!=undefined&&callback3!=''){
                    x=callback3(t,b,c,d);
                  }else{
                    x=gomeBase.tween.Bounce.easeInOut(t,b,c,d);
                  }
                  callback1(x);
                  requestAnimFrame(moveOn);
              }else{
                if(callback2!=undefined&&callback2!=''){
                  callback2();
                }
              }
          }
          document.addEventListener('moveboolstop',function (){
            bool=false;
          },false);
          document.addEventListener('moveboolgoon',function (){
            bool=true;
          },false);
          moveOn();
      },
      /*
      *数组随机排列
      *array操作的数组
      *[0,1,2,3,4,5]
      *nummax:5
      *nummin:0
      */
      getNum:function (arrays,nummax,nummin){
        var array=arrays,
            arraynew=[],
            array_num=[],
            array_bool=true;
        for(var i=0;i<array.length;i++){
          if(arraynew.length==0){
            var n=Math.round(Math.random()*nummax)+nummin;
            arraynew[0]=array[n];
            array_num[0]=n;
          }else{
            array_bool=true;
            while(array_bool){
              var n=Math.round(Math.random()*nummax)+nummin;
              for(var k=0;k<array_num.length;k++){
                if(n==array_num[k]){
                  break;
                }else if(n!=array_num[k]&&k==(array_num.length-1)){
                  arraynew[array_num.length]=array[n];
                  array_num[array_num.length]=n
                  array_bool=false;
                }
              }
            }
          }
        }
        return arraynew;
      },
      /*
       *获取dom节点高度
      */
      getHeight:function (dom){
        var heights=[],
            style_past=dom.getAttribute('style');
        if(dom.length>1){
          for(var i=0;i<dom.length;i++){
            dom[i].style.opacity=0;
            dom[i].style.display='block';
            dom[i].style.overflow='hidden';
            heights[i]=dom[i].offsetHeight;
            dom[i].style.opacity=1;
          }
        }else{
          dom.style.opacity=0;
          dom.style.display='block';
          dom.style.overflow='hidden';
          heights[0]=dom.offsetHeight;
          dom.style.opacity=1;
        }
        dom.setAttribute('style',style_past);
        return heights;
      },
      /*
      *获取节点的各个属性
      */
      getProperty:function (dom){
        var property={
          height:[],
          width:[],
          marginTop:[],
          marginBottom:[],
          marginLeft:[],
          marginRight:[],
          paddingTop:[],
          paddingBottom:[],
          paddingLeft:[],
          paddingRight:[],
        }
        if(dom.length>1){
          for(var i=0;i<dom.length;i++){
            dom[i].style.opacity=0;
            dom[i].style.display='block';
            dom[i].style.overflow='hidden';
            property.height[i]=window.getComputedStyle(dom[i],null).height;
            property.width[i]=window.getComputedStyle(dom[i],null).width;
            property.marginTop[i]=window.getComputedStyle(dom[i],null).marginTop;
            property.marginBottom[i]=window.getComputedStyle(dom[i],null).marginBottom;
            property.marginLeft[i]=window.getComputedStyle(dom[i],null).marginLeft;
            property.marginRight[i]=window.getComputedStyle(dom[i],null).marginRight;
            property.paddingTop[i]=window.getComputedStyle(dom[i],null).paddingTop;
            property.paddingBottom[i]=window.getComputedStyle(dom[i],null).paddingBottom;
            property.paddingLeft[i]=window.getComputedStyle(dom[i],null).paddingLeft;
            property.paddingRight[i]=window.getComputedStyle(dom[i],null).paddingRight;
            dom[i].style.opacity=1;
          }
        }else{
          dom.style.opacity=0;
          dom.style.display='block';
          dom.style.overflow='hidden';
          property.height[0]=window.getComputedStyle(dom,null).height;
          property.width[0]=window.getComputedStyle(dom,null).width;
          property.marginTop[0]=window.getComputedStyle(dom,null).marginTop;
          property.marginBottom[0]=window.getComputedStyle(dom,null).marginBottom;
          property.marginLeft[0]=window.getComputedStyle(dom,null).marginLeft;
          property.marginRight[0]=window.getComputedStyle(dom,null).marginRight;
          property.paddingTop[0]=window.getComputedStyle(dom,null).paddingTop;
          property.paddingBottom[0]=window.getComputedStyle(dom,null).paddingBottom;
          property.paddingLeft[0]=window.getComputedStyle(dom,null).paddingLeft;
          property.paddingRight[0]=window.getComputedStyle(dom,null).paddingRight;
          dom.style.opacity=1;
        }
        return property;
      },
      /*
      *显示节点
      *dom:标签
      *time:多久显示
      *callback1:显示完成执行的方法
      *callback2:显示前执行的方法
      */
      show:function (dom,time,callback1,callback2){
        if(time==undefined){
          time=350;
        }
        if(callback2!=undefined&&callback2!=''){
          callback2();
        }
        var style_past=dom.getAttribute('style');
        dom.style.opacity=0;
        dom.style.display='block';
        setTimeout(function (){
          gomeBase.animate({
            el:dom,
            properties:{opacity:1},
            duration:time,
            ease:'ease-In',
            callback:function (){
              dom.setAttribute('style',style_past);
              dom.style.display='block';
              if(callback1!=undefined&&callback1!=''){
                callback1();
              }
            }
          });
        },17);
      },
      /*
      *隐藏节点
      *dom:标签
      *time:多久隐藏
      *callback1:隐藏完成执行的方法
      *callback2:隐藏前执行的方法
      */
      hide:function (dom,time,callback1,callback2){
        if(time==undefined){
          time=350;
        }
        if(callback2!=undefined&&callback2!=''){
          callback2();
        }
        var style_past=dom.getAttribute('style');
        setTimeout(function (){
          gomeBase.animate({
            el:dom,
            properties:{opacity:0},
            duration:time,
            ease:'ease-In',
            callback:function (){
              dom.setAttribute('style',style_past);
              dom.style.display='none';
              if(callback1!=undefined&&callback1!=''){
                callback1();
              }
            }
          });
        },17);
      },
      /*
      *卷起
      *dom:标签
      *time:多久卷起
      *callback:卷起完成执行的方法
      */
      slideUp:function (dom,time,callback,h){
        if(time==undefined){
          time=350;
        }
        var style_past=dom.getAttribute('style');
        if(h!=undefined&&h!=''){
          var prpty={height:h+'px'};
        }else{
          prpty={height:0,paddingTop:0,paddingBottom:0,marginTop:0,marginBottom:0};
        }
        setTimeout(function (){
          gomeBase.animate({
            el:dom,
            properties:prpty,
            duration:time,
            ease:'ease-In',
            callback:function (){
              dom.setAttribute('style',style_past);
              if(h==undefined||h==''){
                dom.style.display='none';
              }else{
                dom.style.height=h+'px';
              }
              if(callback!=undefined&&callback!=''){
                callback();
              }
            }
          });
        },17);
      },
      /*
      *向下展开
      *dom:标签
      *time:多久收起
      *callback:收起完成执行的方法
      */
      slideDown:function (dom,time,callback){
        var dom_property=gomeBase.getProperty(dom);
        if(time==undefined){
          time=350;
        }
        var style_past=dom.getAttribute('style');
        dom.style.height=0;
        dom.style.paddingTop=0;
        dom.style.paddingBottom=0;
        dom.style.marginTop=0;
        dom.style.marginBottom=0;
        dom.style.display='block';
        setTimeout(function (){
          gomeBase.animate({
            el:dom,
            properties:{height:dom_property.height[0],paddingTop:dom_property.paddingTop[0],paddingBottom:dom_property.paddingBottom[0],marginTop:dom_property.marginTop[0],marginBottom:dom_property.marginBottom[0]},
            duration:time,
            ease:'ease-In',
            callback:function (){
              dom.setAttribute('style',style_past);
              dom.style.display='block';
              if(callback!=undefined&&callback!=''){
                callback();
              }
            }
          });
        },17);
      },
      /*
      *向左卷起
      *dom:标签
      *time:多久卷起
      *callback:卷起完成执行的方法
      */
      slideLeft:function (dom,time,callback,w){
        if(time==undefined){
          time=350;
        }
        var style_past=dom.getAttribute('style');
        if(w!=undefined&&w!=''){
          var prpty={width:w+'px'};
        }else{
          prpty={width:0,paddingLeft:0,paddingRight:0,marginLeft:0,marginRight:0};
        }
        setTimeout(function (){
          gomeBase.animate({
            el:dom,
            properties:prpty,
            duration:time,
            ease:'ease-In',
            callback:function (){
              dom.setAttribute('style',style_past);
              if(w==undefined||w==''){
                dom.style.display='none';
              }else{
                dom.style.height=w+'px';
              }
              if(callback!=undefined&&callback!=''){
                callback();
              }
            }
          });
        },17);
      },
      /*
      *向右展开
      *dom:标签
      *time:多久收起
      *callback:收起完成执行的方法
      */
      slideRight:function (dom,time,callback){
        var dom_property=gomeBase.getProperty(dom);
        if(time==undefined){
          time=350;
        }
        var style_past=dom.getAttribute('style');
        dom.style.width=0;
        dom.style.paddingLeft=0;
        dom.style.paddingRight=0;
        dom.style.marginLeft=0;
        dom.style.marginRight=0;
        dom.style.display='block';
        setTimeout(function (){
          gomeBase.animate({
            el:dom,
            properties:{width:dom_property.width[0],paddingLeft:dom_property.paddingLeft[0],paddingRight:dom_property.paddingRight[0],marginLeft:dom_property.marginLeft[0],marginRight:dom_property.marginRight[0]},
            duration:time,
            ease:'ease-In',
            callback:function (){
              dom.setAttribute('style',style_past);
              dom.style.display='block';
              if(callback!=undefined&&callback!=''){
                callback();
              }
            }
          });
        },17);
      },
      /*
        下拉动画
        pull:下拉点击的按钮，
        up：上拉点击的按钮，
        contents:上拉下拉的内容，
        allcontents:同一级所有contents，
        incons:下一级所有的contents，
        outcontents:上一级contents，
        callback1:点击下拉时候的回调函数，
        callback2:点击上拉时候的回调函数
      */
      pullUp:(function (){
        var my={};
        function pullup(pull,up,contents){
          var that=this;           
          this.contents=contents;
          this.pull=pull;
          this.up=up;
          this.conheight=[];
        }
        pullup.prototype.getheight=function (){
            var that=this;
            that.contents.style.opacity=0;
            that.contents.style.display='block';
            that.contents.style.overflow='hidden';
            that.conheight=that.contents.offsetHeight+'px';
            that.contents.style.display='none';
            that.contents.style.opacity=1; 
        }
        pullup.prototype.pullfctn=function(contents,cheight,callback,mheight){
            var minheight;
            if(mheight!=undefined){
              minheight=mheight;
            }else{
              minheight=0;
            }
            contents.style.height=minheight;
            contents.style.display='block';
            setTimeout(function (){
              gomeBase.animate({
                el:contents,
                properties:{height: cheight},
                duration:150,
                ease:'linear',
                callback:function(){if(callback!=undefined)callback()}
              });
            },20);
        }
        pullup.prototype.upfctn=function (hide_contents,cheight,callback,mheight){
            if(hide_contents.style.display=='block'||hide_contents.style.display=='inline-block'){
                var minheight;
                if(mheight!=undefined){
                  minheight=mheight;
                }else{
                  minheight=0;
                }
                gomeBase.animate({
                  el:hide_contents,
                  properties:{height: minheight},
                  duration:150,
                  ease:'linear',
                  callback:function(){
                    if(callback!=undefined){
                      callback();
                    }
                    if(parseInt(minheight)>0){
                    }else{
                      hide_contents.style.display='none';
                      hide_contents.style.height=cheight;
                    }
                  }
                });
            }
        }
        //展开和隐藏按钮一个按钮
        function pullupBase(pull,up,contents,callback1,callback2){
            pullup.call(this,pull,up,contents);
            var that=this;
            this.getheight();
            this.clicknum=0;
            this.pull.addEventListener(gomeBase.clicks,function(e){
                if(that.clicknum%2==0){
                  if(callback1!=undefined){
                    callback1();
                  }
                  that.pullfctn(that.contents,that.conheight);
                }else if(that.clicknum%2!=0){
                  if(callback2!=undefined){
                    callback2();
                  }
                    that.upfctn(that.contents,that.conheight);
                }
                that.clicknum++;
            },false);
        }
        for(var pbasei in pullup.prototype){
            pullupBase.prototype[pbasei]=pullup.prototype[pbasei];
        }
        /*
          普通的下拉
          {
            pull:'',
            up:'',
            contents:'',
            callback1:'',
            callback2:''
          }
        */
        my.execute1=function(agmt_execute1){
          var example=new pullupBase(agmt_execute1.pull,agmt_execute1.up,agmt_execute1.contents,agmt_execute1.callback1,agmt_execute1.callback2);
        }
        return my;
      }()),
      /**
       * 导航返回和点击更多
      */
      navReturn:function(callback){
          var nav_return=$id('nav_return');
          if(callback==undefined){
               if(nav_return && nav_return.addEventListener && nav_return.addEventListener != '') {
                   nav_return.addEventListener(gomeBase.clicks, function () {
                       if (typeof gome_spurl == 'undefined') {
                           if (document.referrer == '' || document.referrer == window.location.href) {
                               window.location.href = '/index.html';
                           } else {
                               history.back();
                           }
                       } else {
                           window.location.href = gome_spurl;
                       }
                   }, false);
               }
          }else{
			  if(nav_return != null){
                  nav_return.addEventListener(gomeBase.clicks,callback,false);
			  }
              
              if(typeof(weixin_flag) != "undefined"){
      			if(weixin_flag == 1){
      				if(document.getElementById("wap_address")){
                  	  document.getElementById("wap_address").style.display='block';
                    }
      			}
      		}  
          }
      },
      navOther:function(){
          var  nav_more=$id('nav_more'),
              nav_list=$id('nav_list'),
              clicknum=0;
          if(typeof(nav_home) != 'undefined' && nav_home && nav_home.addEventListener && nav_home.addEventListener != ''){
              nav_more.addEventListener(gomeBase.clicks,function (){
                  if(clicknum%2==0){
                      nav_list.style.display='block';
                  }else{
                      nav_list.style.display='none';
                  }
                  clicknum++;
              },false);
          }

      },
       //回到顶部
      goBack:function(dom){
        var go_back=dom,
          body_h=window.screen.height,
          click_bool=false,
          show_bool=true;
        function windowScroll(){
          if(window.scrollY>body_h){
            if(show_bool){
              show_bool=false;
              click_bool=true;
              go_back.style.display='block';
              setTimeout(function (){
                gomeBase.animate({
                  el:go_back,
                  properties:{opacity:1},
                  duration:500,
                  ease:'ease-In',
                  callback:function (){go_back.style.opacity=1;}
                });
              },17);
            }
          }else{
            if(!show_bool){
              click_bool=false;
              show_bool=true;
              gomeBase.animate({
                el:go_back,
                properties:{opacity:0},
                duration:500,
                ease:'ease-In',
                callback:function (){go_back.style.display='none';show_bool=true;}
              });
            }
          }
        }
        function goBackMove(){
          if(click_bool){
            show_bool=true;
            click_bool=false;
            goOn();
            gomeBase.moveTrack(window.scrollY,0,10,function (x){
              window.scrollTo(0,x);
            });
            setTimeout(function (){
              gomeBase.animate({
                el:go_back,
                properties:{opacity:0},
                duration:500,
                ease:'ease-In',
                callback:function (){go_back.style.display='none';show_bool=true;}
              });
            },17);
          }
        }
        function stop(){
          gomeBase.trigger({evet:'moveboolstop'});
        }
        function goOn(){
          gomeBase.trigger({evet:'moveboolgoon'});
        }
        document.addEventListener('touchstart',stop,false);
        document.addEventListener('touchmove',stop,false);
        document.addEventListener('touchend',goOn,false);
        document.addEventListener('mousewheel',stop,false);
        window.addEventListener('scroll',windowScroll,false);
        go_back.addEventListener(gomeBase.clicks,goBackMove,false);
      },
      //地理定位
      getlocation:function(){
        function getLocation(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
            }else{
                alert("亲,你的浏览器太烂了哦!");
            }
        }
        function locationError(error){
            switch(error.code){
                case error.TIMEOUT:
                    //alert("请求超时，请再尝试哦!");
                    break;
                case error.POSITION_UNAVAILABLE:
                    //alert('对不起,获取您的定位失败!');
                    break;
                case error.PERMISSION_DENIED:
                    //alert('您的定位服务未开启!');
                    break;
                case error.UNKNOWN_ERROR:
                    //alert('对不起,未知的错误发生了哦!');
                    break;
            }
        }
        function locationSuccess(position){
            var coords = position.coords;
          var url = 'index.php?ctl=location&act=gpsLocation&latitude='+coords.latitude+'&longitude='+coords.longitude;
          $.get(url,function (response){
            var datas=JSON.parse(response);
            if(datas.error=='ok'){
              var data = datas.data;
              var expire_time = 3*24*60*60*1000;
              gomeBase.setCookie('gps_provinceid', data.provinceId, expire_time);
              gomeBase.setCookie('gps_cityid', data.cityId, expire_time);
              gomeBase.setCookie('gps_districtid', data.districtId, expire_time);
              gomeBase.setCookie('gps_townid', data.townId, expire_time);
            }
          });
        }
        getLocation();
      },
      /*
        滚动到最底部执行的方法
      */
      scrollEnd:function (callback){
          window.addEventListener('load',function (){
              var scrl_height=document.body.scrollHeight,
                  client_height=document.documentElement.clientHeight,
                  scroll_num=scrl_height-client_height,
                  scroll_bool=true,
                  scroll_height=scroll_num-150;
              window.addEventListener('scroll',function (){
                  if(document.body.scrollHeight>scrl_height){
                      scrl_height=document.body.scrollHeight,
                      client_height=document.documentElement.clientHeight,
                      scroll_num=scrl_height-client_height;
                  }
                  if(scroll_num>0&&document.body.scrollTop+document.documentElement.scrollTop>0){
                      if(document.body.scrollTop+document.documentElement.scrollTop>=(scroll_num-150)&&scroll_bool){
                          scroll_height=document.body.scrollTop+document.documentElement.scrollTop+250;
                          scroll_bool=false;
                          callback();
                      }else if(document.body.scrollTop+document.documentElement.scrollTop>scroll_height){
                          scroll_height=document.body.scrollHeight-document.documentElement.clientHeight-150;
                          scroll_bool=true;
                      }
                  }
              },false);
              function refresh(){
                  scrl_height=document.body.scrollHeight,
                  client_height=document.documentElement.clientHeight,
                  scroll_num=scrl_height-client_height,
                  scroll_bool=true,
                  scroll_height=scroll_num-150;
                  //document.body.scrollTop=0;
              }
              window.addEventListener('scrollrefresh',refresh,false);
          },false);
      },
      scrollRefresh:function (){
        blues.trigger({
           evet: 'scrollrefresh',
            obj:window
        });
      },
      /**
       * APP下载事件
       */
      redirect_to_native:{
        init: function(config) {
          var self = this;
            self.platform = self._UA();
          if(!self.platform) return;
          if (self.platform == 'ios') {
            self.installUrl = config.iosInstallUrl;
            self.nativeUrl = config.iosNativeUrl;
            self.openTime = config.iosOpenTime || 800;
          } else {
            self.installUrl = config.androidInstallUrl;
            self.nativeUrl = config.andriodNativeUrl;
            self.openTime = config.androidOpenTime || 3000;
            self.packages = config.packages || 'com.gome.eshopnew';
          }
          //只有android下的chrome要用intent协议唤起native
          if (self.platform != 'ios' && !!navigator.userAgent.match(/Chrome/i)) {
            self._hackChrome();
          } else {
            self._gotoNative();
          }
        },
        _hackChrome: function() {
          var self = this;
          var startTime = Date.now();
          var paramUrlarr = self.nativeUrl.split('://'),
            scheme = paramUrlarr[0],
            schemeUrl = paramUrlarr[1];
          window.location = 'intent://' + schemeUrl + '#Intent;scheme=' + scheme + ';package=' + self.packages + ';end';
          setTimeout(function() {
            self._gotoDownload(startTime);
          }, self.openTime);
        },
        _gotoNative: function() {
          var self = this;
          var startTime = Date.now(),
            doc = document,
            body = doc.body,
            iframe = doc.createElement('iframe');
            iframe.id = 'J_redirectNativeFrame';
            iframe.style.display = 'none';
            iframe.src = self.nativeUrl;
          //运行在head中
          if(!body) {
            setTimeout(function(){
              doc.body.appendChild(iframe);
            }, 0);
          } else {
            body.appendChild(iframe);
          }
          
          setTimeout(function() {
            doc.body.removeChild(iframe);
            self._gotoDownload(startTime);
          }, self.openTime);
        },
        _gotoDownload: function(startTime) {
          var self = this;
          var endTime = Date.now();
          if (endTime - startTime < self.openTime + 500) {
            window.location = self.installUrl;
          }
        },
        _UA: function() {
          var ua = navigator.userAgent;
          // ios
          if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            return 'ios';
          } else if (!!ua.match(/Android/i)) {
            return 'android';
          } else {
            return '';
          }
        }
      },
      appStart:function(){
        var search = location.search,
        ios_native_url = 'GomeEShop://home' + search,
        andriod_native_url = 'gomeeshop://home' + search,
        andriod_download_url = '/m' + search,
        ios_download_url='/m' + search;
        config_obj = {
          iosInstallUrl: ios_download_url,
          androidInstallUrl: andriod_download_url,
          iosNativeUrl: ios_native_url,
          andriodNativeUrl: andriod_native_url,
          packages: 'com.gome.eshopnew'
        };
        gomeBase.redirect_to_native.init(config_obj);
      },
      appDownloadIdxTop:function(href){
        var spt_close=$id('spt_close'),
            spt=$id('spt');
        if(href==undefined){
          spt.addEventListener(gomeBase.clicks,function (e){
            if(e.target!=spt_close){
              gomeBase.appStart();
            }
          },false);
          spt_close.addEventListener(gomeBase.clicks,function (){
            spt.style.display='none';
            var isfloat = $('#float_id').val();
            gomeBase.setCookie(isfloat,'1');
          },false);
        }else{
          spt.addEventListener(gomeBase.clicks,function (e){
            if(href!=undefined&&e.target!=spt_close){
              window.location.href=href;
            }
          },false);
          spt_close.addEventListener(gomeBase.clicks,function (){
            spt.style.display='none';
            var isfloat = $('#float_id').val();
            gomeBase.setCookie(isfloat,'1');
          },false);
        }
      },
      appDownload:function(dom){
        dom.addEventListener(gomeBase.clicks,gomeBase.appStart,false);
      }
    };
    gomeBase.fx.init();
    window.$s=function(dom){
      return document.querySelector(dom);
    }
    window.$a=function(dom){
      return document.querySelectorAll(dom);
    }
    window.$id=function(dom){
      return document.getElementById(dom);
    }
    /*
     *；类似于计时器的脚本动画
    */
    window.requestAnimFrame=(function(){
      return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {setTimeout(callback, 1000 / 60);}
    }());
    /*
        1.引入alert.js,在head最优先引入。
        2.如果本页面所有alert都想使用此效果，引用后立马运行wAlert()，
          若还想使用原来效果，则在你想使用本效果前运行wAlert()。
        3.alert弹出框的内容控制在手机一屏幕以内（100字以内）。
        4.android系统2.0以下的样式会乱掉。
        5.callback点击确定后执行的方法
        6.title标题参数
    */
    function bluesalert(){
        var shield=[];
        var alertFram=[];
        var alertnum=0;
        window.alert = function(str,callback,title){
            if(title==undefined){
                title='提示';
            }
            shield[alertnum] = document.createElement("DIV");
            shield[alertnum].id = "shield";
            shield[alertnum].style.position = "fixed";
            shield[alertnum].style.left = "0px";
            shield[alertnum].style.top = "0px";
            shield[alertnum].style.width = "100%";
            shield[alertnum].style.height = document.body.scrollHeight+"px";
        //弹出对话框时的背景颜色
            shield[alertnum].style.background = "rgba(0,0,0,0.5)";
            shield[alertnum].style.textAlign = "center";
            shield[alertnum].style.zIndex = "999999";
            alertFram[alertnum] = document.createElement("DIV");
            alertFram[alertnum].id="alertFram";
            alertFram[alertnum].style.position = "fixed";
            alertFram[alertnum].style.left = '7.5%';
            alertFram[alertnum].style.top = '50%';
            alertFram[alertnum].style.margin = "auto";
            alertFram[alertnum].style.width = "85%";
            alertFram[alertnum].style.overflow = "hidden";
            alertFram[alertnum].style.background = "#fff";
            alertFram[alertnum].style.textAlign = "center";
            alertFram[alertnum].style.zIndex = "99999999";
            alertFram[alertnum].style.borderRadius='3px';
            strHtml = "<ul style=\"list-style:none;margin:0px;padding:0px;width:100%;background:#fff;border-radius: 3px;display:-webkit-box;display:-moz-box;display:box;-moz-box-orient:vertical;-webkit-box-orient:vertical;box-orient:vertical;\">\n";
            strHtml += " <li style=\"text-align:center;font-size:16px;line-height:45px;color:#666;border-bottom:1px #e6e6e6 solid;background:#f2f2f2;\">"+title+"</li>\n";
            strHtml += " <li style=\"width: 90%;margin:10px auto;padding:10px 0px;text-align:center;font-size:14px;;color:#666;line-height:20px;\" >"+str+"</li>\n";
            strHtml += " <li style='line-height:40px;width: 90%;border-radius:2px;text-align: center;font-size:16px;cursor: pointer;background:#ff5c5c;color:#fff;margin:0 auto 20px;'  onclick='doOk("+alertnum+")'>确 定</li>\n";
            strHtml += "</ul>\n";
            alertFram[alertnum].innerHTML = strHtml;
            document.body.appendChild(alertFram[alertnum]);
            document.body.appendChild(shield[alertnum]);
            alertFram[alertnum].style.marginTop=-alertFram[alertnum].clientHeight/2+'px';
            this.doOk=function(anum) {
                alertFram[anum].style.display='none';
                shield[anum].style.display='none';
                document.body.removeChild(alertFram[anum]);
                document.body.removeChild(shield[anum]);
          if(callback!=undefined&&callback!=''){
            callback();
          }
            }
            document.body.onselectstart = function(){return false;};
            alertnum++;
        }
    }
    /*
        confirm函数，callback1:确定的回调方法，callback2:取消的回调方法,标题内容,btn1左边按钮内容,btn2右边按钮内容
    */
    function bluesconfirm(){
        var shield=[];
        var alertFram=[];
        var alertnum=0;
        window.gomeWapConfirm = function(str,callback1,callback2,title,btn1,btn2){
            if(title==undefined){
                title='提示';
            }
            if(btn1==undefined){
                btn1='确定';
            }
            if(btn2==undefined){
                btn2='取消';
            }
            shield[alertnum] = document.createElement("DIV");
            shield[alertnum].id = "shield";
            shield[alertnum].style.position = "absolute";
            shield[alertnum].style.left = "0px";
            shield[alertnum].style.top = "0px";
            shield[alertnum].style.width = "100%";
            shield[alertnum].style.height = document.body.scrollHeight+"px";
        //弹出对话框时的背景颜色
            
            shield[alertnum].style.background = "rgba(0,0,0,0.5)";
            shield[alertnum].style.textAlign = "center";
            shield[alertnum].style.zIndex = "999999";
            alertFram[alertnum] = document.createElement("DIV");
            alertFram[alertnum].id="alertFram";
            alertFram[alertnum].style.position = "fixed";
            alertFram[alertnum].style.left = '7.5%';
            alertFram[alertnum].style.top = '50%';
            alertFram[alertnum].style.margin = "auto";
            alertFram[alertnum].style.width = "85%";
            alertFram[alertnum].style.overflow = "hidden";
            alertFram[alertnum].style.background = "#fff";
            alertFram[alertnum].style.textAlign = "center";
            alertFram[alertnum].style.zIndex = "99999999";
            alertFram[alertnum].style.borderRadius='3px';
            strHtml = "<ul style=\"list-style:none;margin:0px;padding:0px;width:100%;background:#fff;border-radius: 3px;\">\n";
            strHtml += " <li style=\"text-align:center;font-size:16px;line-height:45px;color:#666;border-bottom:1px #e6e6e6 solid;background:#f2f2f2;\">"+title+"</li>\n";
            strHtml += " <li style=\"width: 90%;margin:10px auto;text-align:center;font-size:14px;;color:#666;line-height:40px;\" >"+str+"</li>\n";
            strHtml += " <li style='float:left;line-height:40px;height:40px;width: 42.5%;box-sizing:border-box;border-radius:3px;text-align: center;font-size:16px;cursor: pointer;background:#ffffff;color:#666;border:1px #e6e6e6 solid;margin:0 0 20px 5%;' id='cancle' data-value="+alertnum+">"+btn2+"</li>\n";
            strHtml += " <li style='float:left;line-height:40px;width: 42.5%;border-radius:3px;text-align: center;font-size:16px;cursor: pointer;background:#ff5c5c;color:#fff;margin:0 5% 20px 5%;'  onclick='doOk("+alertnum+")'>"+btn1+"</li>\n";
            strHtml += "</ul>\n";
            alertFram[alertnum].innerHTML = strHtml;

            shield[alertnum].setAttribute('data-value',alertnum);
            document.body.appendChild(alertFram[alertnum]);
            document.body.appendChild(shield[alertnum]);
            function cancles(){
                var anum=this.getAttribute('data-value');
                alertFram[anum].style.display='none';
                shield[anum].style.display='none';
                document.body.removeChild(alertFram[anum]);
                document.body.removeChild(shield[anum]);
                if(callback2!==undefined&&callback2!=''){
                    callback2();
                }
            }
            document.getElementById('cancle').onclick=cancles;
            alertFram[alertnum].style.marginTop=-alertFram[alertnum].clientHeight/2+'px';
            this.doOk=function(anum) {
                alertFram[anum].style.display='none';
                shield[anum].style.display='none';
                document.body.removeChild(alertFram[anum]);
                document.body.removeChild(shield[anum]);
                if(callback1!=undefined&&callback1!=''){
                    callback1();
                }
            }
            document.body.onselectstart = function(){return false;};
            alertnum++;
        }
    }
    /*
        小部分阴影显示
      fbool没有特殊事件直接空就可以
    */
    function bluesfloats(){
        var time;
        window.blues_midFloats=function (str,fbool,letter){
            if(document.querySelector('.floatdiv')!=null){
                var event = document.createEvent('HTMLEvents');
                event.initEvent('timeout', true, true);
                event.eventType = 'message';
                document.querySelector('.floatdiv').dispatchEvent(event);
                clearTimeout(time);
            }
            if(letter==undefined||letter==''){
              var letter='center';
            }
            var floatdiv=document.createElement('Div');
            floatdiv.className='floatdiv';
            floatdiv.style.width='60%';
            floatdiv.style.position='fixed';
            floatdiv.style.left='15%';
            floatdiv.style.top='45%';
            floatdiv.style.textAlign=letter;
            floatdiv.style.padding='20px';
            floatdiv.style.borderRadius='3px';
            floatdiv.style.lineHeight='20px';
            floatdiv.style.background='rgba(0,0,0,0.7)';
            floatdiv.style.color='#fff';
            floatdiv.style.fontSize='14px';
            floatdiv.style.zIndex = "99999990";
            floatdiv.innerHTML=str;
            document.body.appendChild(floatdiv);
        function removefloat(){
          floatdiv.style.display='none';
          document.body.removeChild(floatdiv);
        }
        floatdiv.addEventListener('timeout',removefloat,false);
        if(fbool==undefined||fbool){
          time=setTimeout(removefloat,2000);
        }
        }
    }
    /* 
	    自定义class选择器
	*/
	function getClassName(ParentId,NewClassName){
	    var AllClassElem = ParentId.getElementsByTagName('*');
	    var AllClass = [];
	    var i=0;
	    for(var i=0; i<AllClassElem.length; i++){
	        if(AllClassElem[i].className==NewClassName){
	            AllClass.push(AllClassElem[i]);
	        }
	    }
	    return AllClass;
	}
	/* 
	    微信浏览器导航适配
	*/
	function isWeixin(){
	    var account=4,//购物车数量
	        fixNav=document.createElement('section'),
	        clicknum=0;
	    fixNav.className="fix_nav";
	    fixNav.id="fix_nav";
        //fixNav.style.display = 'none';
	    document.getElementById("wap_address").style.display='none';
	    strHtml = "<ul>\n<li id=\"switch_bar\">\n<div id=\"switch\">\n</div>\n</li>\n<li class=\"nav\">\n<a href=\""+home_url+"\"><div class=\"home\">\n</div>\n</a>\n</li>\n<li class=\"nav\">\n<a href=\""+class_url+"\"><div class=\"classify\">\n</div>\n</a>\n</li>\n<li class=\"nav\">\n<a href=\""+shopping_cart_url+"\"><div class=\"trolley\">\n</div>\n</a>\n</li>\n<li class=\"nav\">\n<a href=\""+my_gome_url+"\"><div class=\"mygome\">\n</div>\n</a>\n</li>\n</ul>\n";
	    fixNav.innerHTML = strHtml;
	    document.body.appendChild(fixNav);
	    document.getElementById("switch").addEventListener("click",kaiguan);
	  
	    function kaiguan(){
	        var navs = getClassName(fixNav,"nav");
	        if(clicknum%2==0){  
	            gomeBase.addClass($id('switch'),'close');
	            setTimeout(function (){
                    fixNav.style.width = "100%";
					document.getElementById("switch_bar").setAttribute("style","width:20%;float:left;");
	                for (var i=0; i<navs.length; i++) {
						navs[i].setAttribute("style","display:block;float:left;width:20%;");
	                }
	            },300);
	        }else{
	            gomeBase.removeClass($id('switch'),'close');
	            setTimeout(function (){
                    fixNav.style.width = "20%";
					document.getElementById("switch_bar").setAttribute("style","");
	                for (var i=0; i<navs.length; i++) {
	                    navs[i].setAttribute("style","display:none;");
	                }
	            },100);
	        }
	        clicknum++;
	    }
	}
	//if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' && location.href.indexOf("ttp://m.gome.com.cn") != -1){
	if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){
		if(typeof(weixin_flag) != "undefined"){
			if(weixin_flag == 1){
				if(modelId != '' && ctl == 'product'){
					ctl = 'gift';
				}
				if(ctl != 'gift'){
					isWeixin();
				}
                document.getElementById("wap_address").style.display='none';
			}
		}
	}
	
	/* 引流浮层下载app */
	if(typeof(lead_appdown) != "undefined"){
		if(lead_appdown == '1'){
			$id('app_ad').addEventListener(gomeBase.clicks,appDownloadDetail);
			$id('spt_close').addEventListener(gomeBase.clicks,function (e){
				$id('spt').style.display='none';
	          },false);
			
			function appDownloadDetail() {
			    app_loc = "gomeeshop://home";
			    wap_loc = "/m";
			    iframe = document.createElement('iframe');
			    iframe.id = 'J_redirectNativeFrame';
			    iframe.style.display = 'none';
			    iframe.src = app_loc;
			    document.body.appendChild(iframe);
			    var loadDateTime = new Date();
			    window.setTimeout(function () {
			            var timeOutDateTime = new Date();
			            if (timeOutDateTime - loadDateTime < 6000) {
			                window.location = wap_loc;
			            } else {
			                window.close();
			            }
			        },
			        300);
			}
		}
	}
	
    bluesalert();
    bluesconfirm();
    bluesfloats();
})(window);