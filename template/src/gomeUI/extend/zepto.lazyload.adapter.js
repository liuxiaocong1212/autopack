/* 
* @Author: zhaoye-ds1
* @Date:   2016-02-24 10:53:45
* @Last Modified by:   zhaoye-ds1
* @Last Modified time: 2016-02-24 12:07:43
*/
!(function($){
    $.lazyload = {
        'apapterList':[]
    }
    $.lazyload.adapt = function(id,matches,rule){
        $.lazyload.apapterList.push({
            'id': id,
            'matches': matches,
            'rule': rule,
        })
    }
    //在这里配置
    //TODO 模块化之后将数据分离
    $.lazyload.adapt('product',[
        {
            'range': {
                'start': 0,
                'end': 320,
            },
            'resolution': "_260",
        },
        {
            'range': {
                'start': 320,
                'end': 414,
            },
            'resolution': '_360',
        },
        {
            'range': {
                'start': 414,
                'end': Number.MAX_VALUE
            },
            'resolution': '_400',
        }
    ],{
        'regex': /\/.[^\/_]+(_\d*)+\.(bmp|jpg|gif|png|webp)$/,
        'pos': '$1',
    })
})($);
