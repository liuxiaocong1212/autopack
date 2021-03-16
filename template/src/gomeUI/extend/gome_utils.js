(function(window){
	window.Utils = {
		htmlEncode:function(text){
			return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		},
		trim:function(text){
			if (typeof(text) == "string"){
				return text.replace(/^\s*|\s*$/g, "");
			}else{
				return text;
			}
		},
		isEmpty:function(val){
			switch (typeof(val)){
				case 'string':
				  return this.trim(val).length == 0 ? true : false;
				  break;
				case 'number':
				  return val == 0;
				  break;
				case 'object':
				  return val == null;
				  break;
				case 'array':
				  return val.length == 0;
				  break;
				default:
				  return true;
			}
		},
		isNumber:function(val){
			var reg = /^[\d|\.|,]+$/;
			return reg.test(val);
		},
		isInt:function(val){
		  if (val == ""){
			return false;
		  }
		  var reg = /\D+/;
		  return !reg.test(val);
		},
		isEmail:function(email){
			var reg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
			return reg.test( email );
		},
		isTel:function (tel){
			var reg = /^[\d|\-|\s|\_]+$/; //只允许使用数字-空格等
			return reg.test( tel );
		},
		fixEvent:function(e){
		  var evt = (typeof e == "undefined") ? window.event : e;
		  return evt;
		},
		srcElement:function(e){
		  if (typeof e == "undefined") e = window.event;
		  var src = document.all ? e.srcElement : e.target;
		  return src;
		},
		isTime:function(val){
			var reg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
			return reg.test(val);
		},
		x:function(e){
			//当前鼠标X坐标
			return Browser.isIE ? event.x + document.documentElement.scrollLeft - 2 : e.pageX;
		},
		y:function(e){ 
			//当前鼠标Y坐标
			return Browser.isIE ? event.y + document.documentElement.scrollTop - 2 : e.pageY;
		},
		request:function(url, item){
			var sValue=url.match(new RegExp("[\?\&]"+item+"=([^\&]*)(\&?)","i"));
			return sValue?sValue[1]:sValue;
		},
		$:function(name){
			return document.getElementById(name);
		},
		isMobile:function (mobile){
			//手机号码验证，验证13系列和150-159(154除外)、170-179(71,72,73,74,79除外)180-189(184除外)，长度11位
			if(/^13\d{9}$/g.test(mobile) || (/^15[0-35-9]\d{8}$/g.test(mobile)) || (/^17\d{9}$/g.test(mobile)) || (/^18[0-35-9]\d{8}$/g.test(mobile)))
				return true;
			else
				return false;
		},
		isZipCode:function (code){
			//验证邮编
			var reg=/^\d{6}$/;
			return reg.test(code);
		},
		strLen:function (str){
			//计算字符串长度(可同时字母和汉字，字母占一个字符，汉字占2个字符)
			var len = 0;  
			for (var i=0; i<str.length; i++){   
				var c = str.charCodeAt(i);   
				//单字节加1   
				if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f))
					len++;
				else 
					len+=2;
			}

			return len;
		},
		isIdCardNo:function(num){
			//身份证号验证        
			num = num.toUpperCase();//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。        
			if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))){     
				alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');              
				return false;         
			}
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
			//下面分别分析出生日期和校验位 
			var len, re; len = num.length; 
			if (len == 15){ 
				re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/); 
				var arrSplit = num.match(re);  //检查生日日期是否正确
				var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]); 
				var bGoodDay; bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
				if (!bGoodDay){         
					alert('输入的身份证号里出生日期不对！');            
					return false;
				}else{
					//将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。        
					var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);         
					var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');      
					var nTemp = 0, i;            
					num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);           
					for(i = 0; i < 17; i ++){                 
						nTemp += num.substr(i, 1) * arrInt[i];        
					}
					num += arrCh[nTemp % 11]; 
					return true;
				}
			}

			if (len == 18){
				re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/); 
				var arrSplit = num.match(re);  //检查生日日期是否正确 
				var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]); 
				var bGoodDay; bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 
				if (!bGoodDay){
					alert('输入的身份证号里出生日期不对！'); 
					return false; 
				}else{
					//检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
					var valnum; 
					var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
					var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
					var nTemp = 0, i; 
					for(i = 0; i < 17; i ++){ 
						nTemp += num.substr(i, 1) * arrInt[i];
					} 
					valnum = arrCh[nTemp % 11]; 
					if (valnum != num.substr(17, 1)){ 
						alert("身份证信息不正确");
						//alert('18位身份证的校验码不正确！应该为：' + valnum); 
						return false; 
					} 
					return true; 
				} 
			}
			return false;
		},
		getIdCardAge:function(num)
		{
			//身份证号码得到年龄
			//获取年龄 
			var myDate = new Date(); 
			var month = myDate.getMonth() + 1; 
			var day = myDate.getDate();
			var age = myDate.getFullYear() - num.substring(6, 10) - 1; 
			if (num.substring(10, 12) < month || num.substring(10, 12) == month && num.substring(12, 14) <= day){ 
				age++; 
			}

			return age;
		}
	};
})(window);