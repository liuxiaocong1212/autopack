(function(window){
    window.gomeEffects={
      clicks:'click',
      /*
      *Tab切换
      *tabdiv
      *condiv
      *class_click
      *class_con
      */
      Tab:function (tab_json){
        function tabs (liid,divid) {
          var that=this;
          this.toplis=liid;
          this.divs=divid;
          for(var i=0;i<this.toplis.length;i++){
            (function (inum){
              that.toplis[inum].addEventListener(gomeEffects.clicks,function () {
                that.qiehuan(that.divs,inum);
              },false);
            }(i));
          }
        }
        tabs.prototype.qiehuan=function (divs1,num) {
          for(var i=0;i<divs1.length;i++){
              if(i==num){
                gomeBase.addClass(divs1[num],tab_json.class_con);
                gomeBase.addClass(this.toplis[num],tab_json.class_click);
              }else{
                gomeBase.removeClass(divs1[i],tab_json.class_con);
                gomeBase.removeClass(this.toplis[i],tab_json.class_click);
              }
            }
        }
        var tab=new tabs(tab_json.tabdiv,tab_json.condiv);
      },
      /*
      *倒计时结束
      *dom:秒的dom节点
      */
      timeEnd:function (dom){
        gomeBase.trigger({
          evet:'cancle',
          obj:dom
        })
      },
      /*
        {
          deadline:101245152,//最终结束的时间戳,
          callback:function (){},//时间结束后的方法,
          secdom:secdom,//秒的dom节点,
        }
      */
      timerSecond:function(agmt_time){  
        var t,second,bools,dates=new Date(),nowtime=Math.round(agmt_time.deadline-dates.getTime()/1000);
        init();
        function init(){
          if(nowtime<1){
            nowtime=0;
          }
          second=nowtime;
          bools=[false];
          if(second<10){
            agmt_time.secdom.innerHTML='0'+second;
          }
          t=setTimeout(secondRun,1000);
          agmt_time.secdom.addEventListener('cancle',cancleTime,false);
        }
        function secondRun(){
            if(second>0){
              if(nowtime-(agmt_time.deadline-Math.round(new Date().getTime()/1000))<3){
                second--;
                nowtime--;
                if(second<10){
                  agmt_time.secdom.innerHTML='0'+second;
                }else{
                  agmt_time.secdom.innerHTML=second;
                }
                t=setTimeout(secondRun,1000);
              }else{
                nowtime=agmt_time.deadline-Math.round(new Date().getTime()/1000);
                agmt_time.secdom.removeEventListener('cancle',cancleTime,false);
                init();
              }
            }else{
              bools[0]=true;
              doThing();
            }
        }
        function doThing(){
          if(bools[0]){
            if(agmt_time.callback!=''&&agmt_time.callback!=undefined){
              agmt_time.callback();
            }
          }
        }
        function cancleTime(){
          agmt_time.secdom.removeEventListener('cancle',cancleTime,false);
          if(agmt_time.callback!=''&&agmt_time.callback!=undefined){
            agmt_time.callback();
          }
          clearTimeout(t);
        }
      },
      /*
        {
          deadline:101245152,//最终结束的时间戳,
          callback:function (){},//时间结束后的方法,
          secdom:secdom,//秒的dom节点,
          mintdom:mintdom,//分钟的dom节点,
        }
      */
      timerHour:function(agmt_time){  
        var hour,minute,second,bools,dates=new Date(),nowtime=Math.round(agmt_time.deadline-dates.getTime()/1000);
        init();
        function init(){
          if(nowtime<1){
            nowtime=0;
          }
          hour=Math.floor((nowtime%86400)/3600);
          minute=Math.floor(((nowtime%86400)%3600)/60);
          second=Math.floor(((nowtime%86400)%3600)%60);
          bools=[false,false,false,false]; 
          if(second<10){
            agmt_time.secdom.innerHTML='0'+second;
          }else{
            agmt_time.secdom.innerHTML=second;
          }
          if(minute<10){
            agmt_time.mintdom.innerHTML='0'+minute;
          }else{
            agmt_time.mintdom.innerHTML=minute;
          }
          if(hour<10){
            agmt_time.hourdom.innerHTML='0'+hour;
          }else{
            agmt_time.hourdom.innerHTML=hour;
          }
          t=setTimeout(secondRun,1000);
          agmt_time.secdom.addEventListener('cancle',cancleTime,false);
        }
        function secondRun(){
            if(second>0){
              if(nowtime-(agmt_time.deadline-Math.round(new Date().getTime()/1000))<3){
                second--;
                nowtime--;
                if(second<10){
                  agmt_time.secdom.innerHTML='0'+second;
                }else{
                  agmt_time.secdom.innerHTML=second;
                }
                t=setTimeout(secondRun,1000);
              }else{
                nowtime=agmt_time.deadline-Math.round(new Date().getTime()/1000);
                agmt_time.secdom.removeEventListener('cancle',cancleTime,false);
                init();
              }
            }else{
              bools[0]=true;
              minuteRun();
            }
        }
        function minuteRun(){
          if(minute>0){
              minute--;
              if(minute<10){
                agmt_time.mintdom.innerHTML='0'+minute;
              }else{
                agmt_time.mintdom.innerHTML=minute;
              }
              bools[0]=false;
              second=60;
              secondRun();
            }else{
              bools[1]=true;
              hourRun();
            }
        }
        function hourRun(){
          if(hour>0){
            hour--;
            if(hour<10){
              agmt_time.hourdom.innerHTML='0'+hour;
            }else{
              agmt_time.hourdom.innerHTML=hour;
            }
            bools[1]=false;
            minute=60;
            minuteRun();
          }else{
            bools[2]=true;
            doThing();
          }
        }
        function doThing(){
          if(bools[0]&&bools[1]&&bools[2]){
            if(agmt_time.callback!=''&&agmt_time.callback!=undefined){
              agmt_time.callback();
            }
          }
        }
        function cancleTime(){
          agmt_time.secdom.removeEventListener('cancle',cancleTime,false);
          if(agmt_time.callback!=''&&agmt_time.callback!=undefined){
            agmt_time.callback();
          }
          clearTimeout(t);
        }
      },
      /*
        {
          deadline:101245152,//最终结束的时间戳,
          callback:function (){},//时间结束后的方法,
          secdom:secdom,//秒的dom节点,
          mintdom:mintdom,//分钟的dom节点,
          hourdom:,hourdom,//小时的dom节点,
          daydom:daydom,//天的dom节点
        }
      */
      timer:function(agmt_time){  
        var t,day,hour,minute,second,bools,dates=new Date(),nowtime=Math.round(agmt_time.deadline-dates.getTime()/1000);
        init();
        function init(){
          if(nowtime<1){
            nowtime=0;
          }
          day=Math.floor(nowtime/86400);
          hour=Math.floor((nowtime%86400)/3600);
          minute=Math.floor(((nowtime%86400)%3600)/60);
          second=Math.floor(((nowtime%86400)%3600)%60);
          bools=[false,false,false,false]; 
          if(second<10){
            agmt_time.secdom.innerHTML='0'+second;
          }else{
            agmt_time.secdom.innerHTML=second;
          }
          if(minute<10){
            agmt_time.mintdom.innerHTML='0'+minute;
          }else{
            agmt_time.mintdom.innerHTML=minute;
          }
          if(hour<10){
            agmt_time.hourdom.innerHTML='0'+hour;
          }else{
            agmt_time.hourdom.innerHTML=hour;
          }
          if(day<10){
            agmt_time.daydom.innerHTML='0'+day;
          }else{
            agmt_time.daydom.innerHTML=day;
          }
          t=setTimeout(secondRun,1000);
          agmt_time.secdom.addEventListener('cancle',cancleTime,false);
        }
        function secondRun(){
            if(second>0){
              if(nowtime-(agmt_time.deadline-Math.round(new Date().getTime()/1000))<3){
                second--;
                nowtime--;
                if(second<10){
                  agmt_time.secdom.innerHTML='0'+second;
                }else{
                  agmt_time.secdom.innerHTML=second;
                }
                t=setTimeout(secondRun,1000);
              }else{
                nowtime=agmt_time.deadline-Math.round(new Date().getTime()/1000);
                agmt_time.secdom.removeEventListener('cancle',cancleTime,false);
                init();
              }
            }else{
              bools[0]=true;
              minuteRun();
            }
        }
        function minuteRun(){
          if(minute>0){
              minute--;
              if(minute<10){
                agmt_time.mintdom.innerHTML='0'+minute;
              }else{
                agmt_time.mintdom.innerHTML=minute;
              }
              bools[0]=false;
              second=60;
              secondRun();
            }else{
              bools[1]=true;
              hourRun();
            }
        }
        function hourRun(){
          if(hour>0){
            hour--;
            if(hour<10){
              agmt_time.hourdom.innerHTML='0'+hour;
            }else{
              agmt_time.hourdom.innerHTML=hour;
            }
            bools[1]=false;
            minute=60;
            minuteRun();
          }else{
            bools[2]=true;
            dayRun();
          }
        }
        function dayRun(){
          if(day>0){
              day--;
              if(day<10){
                agmt_time.daydom.innerHTML='0'+day;
              }else{
                agmt_time.daydom.innerHTML=day;
              }
              agmt_time.daydom.innerHTML=day;
              bools[2]=false;
              hour=12;
              hourRun();
          }else{
            bools[3]=true;
            doThing();
          }
        }
        function doThing(){
          if(bools[0]&&bools[1]&&bools[2]&&bools[3]){
            if(agmt_time.callback!=''&&agmt_time.callback!=undefined){
              agmt_time.callback();
            }
          }
        }
        function cancleTime(){
          agmt_time.secdom.removeEventListener('cancle',cancleTime,false);
          if(agmt_time.callback!=''&&agmt_time.callback!=undefined){
            agmt_time.callback();
          }
          clearTimeout(t);
        }
      },
    };
})(window)
