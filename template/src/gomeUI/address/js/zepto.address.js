/* 
* @Author: zhaoye-ds1
* @Date:   2015-08-14 19:06:49
* @Last Modified by:   zhaoye-ds1
* @Last Modified time: 2015-08-18 16:58:43
*/
!(function($,window){
    var Address = function(options){
        var _this = this;
        var cache = [];
        this.address = {
            province: "北京",
            city: "北京",
            area: "朝阳区（五环里）",
            county: "全部区域"
        };
        this.addressCache = {
            province: "北京",
            city: "北京",
            area: "朝阳区（五环里）",
            county: "全部区域"  
        };
        this.did = {
            province: "",
            city: "",
            area: "",
            county: ""
        };
        this.didCache = {
            province: "",
            city: "",
            area: "",
            county: ""  
        };
        this.cid = {
            province: "",
            city: "",
            area: "",
            county: ""    
        };
        this.cidCache = {
            province: "",
            city: "",
            area: "",
            county: ""      
        };
        this.level = 1;
        this.itemFlag = options.itemFlag;
        this.goodsNo = options.goodsNo;
        this.skuID = options.skuID || options.skuId;
        this.$el = $("[data-aslider='address']");
        this.timestamp = Date.parse(new Date());
        this.url = "http://10.144.35.22/index.php?ctl=product&act=getAddress";

        this.store = {
            address: "",
            did: "",
            cid: ""
        }

        this.change = options.change || new Function;
        this.end = options.end || new Function;
        
        $('[data-aslider-in]').each(function(idx,el){
            if($(el).data("aslider-in").match("address")){
                //地址的滚动栏入口
                $(el).click(function(e){
                    _this.aslider.resetScroll(_this.$el);
                    _this.$el.find(".slider").empty();
                    //请求一级地址，省
                    _this.level = 1;
                    if(_this.cache){
                        //从缓存读取
                        _this.cache.forEach(function(value,idx){
                            var cid = value.divisionCode.replace(/0{2,6}\b/,"");
                            var item ='<li class="item address" data-did=' + value.divisionCode + ' data-cid=' + cid + '>' + value.divisionName + '</li>';
                            _this.$el.find(".slider").append(item);
                        });
                        _this.level++;
                    }else
                        _this.getAddress(_this.level,_this.itemFlag);
                });
            }
        });
        this.$el.find(".close").click($.proxy(function(e){
            this.level = 1;
            $.extend(this.address,this.addressCache);
            $.extend(this.did,this.didCache);
            $.extend(this.cid,this.cidCache);
            this.$el.find(".tag_province").text(this.address.province);
            this.$el.find(".tag_city").text(this.address.city);
            this.$el.find(".tag_area").text(this.address.area);
            this.$el.find(".tag_county").text(this.address.county);
        },this));
        this.$el.on("click","li.address",$.proxy(function(e){
            var $target = $(e.target);
            var callbackParam = {
                level: this.level,
                textLevel: "",
                address: $target.text(),
                did: $target.data("did"),
                cid: $target.data("cid")
            };
            //同步地址
            switch (_this.level){
                case 2:
                    //选择省
                    _this.$el.find(".tag_province").text($target.text());
                    _this.did.province = $target.data("did");
                    _this.cid.province = $target.data("cid");
                    _this.address.province = $target.text();
                    callbackParam.textLevel = "province";
                    _this.change(callbackParam);
                break;
                case 3:
                    //选择市
                    _this.$el.find(".tag_city").text($target.text());
                    _this.did.city = $target.data("did");
                    _this.cid.city = $target.data("cid");
                    _this.address.city = $target.text();
                    callbackParam.textLevel = "city";
                    _this.change(callbackParam);
                break;
                case 4:
                    //选择区
                    _this.$el.find(".tag_area").text($target.text());
                    _this.did.area = $target.data("did");
                    _this.cid.area = $target.data("cid");
                    _this.address.area = $target.text();
                    callbackParam.textLevel = "area";
                    _this.change(callbackParam);
                break;
                case 5:
                    //选择片
                    _this.$el.find(".tag_county").text($target.text());
                    _this.did.area = $target.data("did");
                    _this.cid.area = $target.data("cid");
                    _this.address.county = $target.text();
                    callbackParam.textLevel = "county";

                    _this.change(callbackParam);
                    _this.end({
                        address: this.address,
                        did: this.did,
                        cid: this.cid
                    })
                    
                    _this.aslider.asideSlideOut(_this.$el);
                    $.extend(_this.addressCache,_this.address);
                    $.extend(_this.didCache,_this.did);
                    $.extend(_this.cidCache,_this.cid);
                break;
            }
            if(this.level==5){
                
                return;
            }
            this.getAddress(this.level,this.itemFlag,$target.data("did"),this.skuID,this.goodsNo);
        },this));
    };
    Address.prototype.getUrl = function(level,itemFlag,code,skuID,goodsNo){
        if(level!=1)
            return this.url + "&level="+level+"&itemFlag="+itemFlag+"&dotime="+this.timestamp+"&code="+code+"&skuID="+skuID+"&goodsNo="+goodsNo;
        else
            return this.url + "&level="+level+"&itemFlag="+itemFlag+"&dotime="+this.timestamp;
    };
    Address.prototype.getAddress = function(level,itemFlag,code,skuID,goodsNo){
        var _this = this;
        $.ajax({
            type:"get",
            url: this.getUrl(level,itemFlag,code,skuID,goodsNo),
            complete: function(xhr,status){
                if(status=="success"){
                    _this.$el.find(".slider").empty();
                    _this.aslider.resetScroll(_this.$el);
                    var json = JSON.parse(xhr.responseText);
                    var divisionList = json.data.divisionList;
                    if(_this.level == 1){
                        _this.cache = divisionList;
                    }
                    divisionList.forEach(function(value,idx){
                        var cid = value.divisionCode.replace(/0{2,6}\b/,"");
                        var item ='<li class="item address" data-did=' + value.divisionCode + ' data-cid=' + cid + '>' + value.divisionName + '</li>';
                        _this.$el.find(".slider").append(item);
                    });
                    _this.level++;
                }else{
                    console.log("加载失败了啊");
                }
            }
        });
    };
    Address.prototype.getInfoDom = function(){
        return this.$el.find(".info");
    };
    var htmlStr = '';
    htmlStr += '<aside class="address" data-aslider="address" style="display:none;">'
    htmlStr += '        <div class="wrapper">'
    htmlStr += '            <div class="flexbox title">'
    htmlStr += '                <div class="flex1 left">'
    htmlStr += '                    <h3>当前地址：</h3>'
    htmlStr += '                    <div class="grid address_tags">'
    htmlStr += '                        <div class="row">'
    htmlStr += '                            <div class="column_4">'
    htmlStr += '                                <span class="tag tag_province first ellipsis">北京</span>'
    htmlStr += '                            </div>'
    htmlStr += '                            <div class="column_4">'
    htmlStr += '                                <span class=" tag tag_city ellipsis">北京市</span>'
    htmlStr += '                            </div>'
    htmlStr += '                            <div class="column_4">'
    htmlStr += '                                <span class=" tag tag_area ellipsis">朝阳区（五环里）</span>'
    htmlStr += '                            </div>'
    htmlStr += '                        </div>'
    htmlStr += '                        <div class="row">'
    htmlStr += '                            <div class="column_8">'
    htmlStr += '                                <span class=" tag tag_county first ellipsis">全部区域</span>'
    htmlStr += '                            </div>'
    htmlStr += '                            <div class="column_4">'
    htmlStr += '                                <span class="info"></span>'
    htmlStr += '                            </div>'
    htmlStr += '                        </div>'
    htmlStr += '                    </div>'
    htmlStr += '                    <h3>请选择地区</h3>'
    htmlStr += '                </div>'
    htmlStr += '                <div class="right">'
    htmlStr += '                    <button class="close" data-icon="&#x003f"></button>'
    htmlStr += '                </div>'
    htmlStr += '            </div>'
    htmlStr += '            <div class="scroll">'
    htmlStr += '                <ul class="slider list">'
    htmlStr += '                </ul>'
    htmlStr += '            </div>'
    htmlStr += '        </div>'
    htmlStr += '    </aside>';
    $(function(){
        $("body").append(htmlStr);
        var options = $.aslider.init("[data-aslider-in='address|fade']","[data-aslider='address']");
        Address.prototype.aslider = new $.aslider.AsideSlider(options);
        $.address = function(options){
            /**
             * options{
             *     itemFlag,
             *     skuId || skuID,
             *     goodsNo
             *     change:function(info){
             *         info:{
             *              level: this.level,
                            textLevel: "",
                            address: $target.text(),
                            did: $target.data("did"),
                            cid: $target.data("cid")
             *         }
             *     },
             *     end: funtion(info){
             *         info:{
             *             address: this.address,
             *             did: this.did,
             *             cid: this.cid
             *         }
             *     }
             * }
             */
            return new Address(options);
        }
    });
    
})(Zepto,window);