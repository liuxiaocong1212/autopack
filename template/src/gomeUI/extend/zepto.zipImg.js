/* 
* @Author: zhaoye-ds1
* @Date:   2015-09-07 10:12:14
* @Last Modified by:   zhaoye-ds1
* @Last Modified time: 2015-09-08 15:14:55
*/

/*common*/
/**
 * canvas图片压缩
 * @param  {[Object]} opt [配置参数]
 * @param  {[Function]} cbk [回调函数]
 * @return {[Void]}
 * example:
 * var opt = {
    'type' : 1,//为1为预览，建议不为1或后期进行改进
    'file' : "#loadFile"//文件上传控件
},_compress = require('app/compress');
_compress(opt,function (result) {
    console.log(result)
});
 */
!(function($,window){
    /*common*/
    var canvasSupported = isCanvasSupported()

    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string 
        var byteString;
        var mimestring;

        if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
            byteString = atob(dataURI.split(',')[1])
        } else {
            byteString = decodeURI(dataURI.split(',')[1])
        }
        mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]

        var content = new Array();
        for (var i = 0; i < byteString.length; i++) {
            content[i] = byteString.charCodeAt(i)
        }
       // return new Blob([new Uint8Array(content)], {type: mimestring});
    }

    function imgScale (src,limit,cbk) {
        if (!src) return cbk(false)
        var scale = 1;
        var _canvas = document.createElement('canvas');
        var tImg = new Image;
        tImg.onload = function(){
            if(tImg.width > tImg.height){
                scale = limit/tImg.width;
            }else{
                scale = limit/tImg.height;
            }
            _canvas.width = tImg.width * scale;
            _canvas.height = tImg.height *scale;
            var _context = _canvas.getContext('2d');
            _context.drawImage(tImg,0,0,tImg.width * scale,tImg.height *scale);
            var type = 'image/jpeg';
            src = _canvas.toDataURL(type , scale)
            cbk(src)
        };
        tImg.src = src
    }

    function isCanvasSupported(){
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    }

    $.support = canvasSupported 

    /* opt {scale :0-1}*/
    $.zipImg = function(file,limit,cbk){
        if (!canvasSupported) return cbk(file)
        var fReader = new FileReader();
        fReader.onload = function (e){
            var result = e.target.result;
            imgScale(result,limit,function(src){
                cbk(src);
            });
        };
        fReader.readAsDataURL(file);
    }
})($,window);
