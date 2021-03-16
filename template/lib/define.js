/*
 * @Author: zhaoye 
 * @Date: 2017-04-17 16:42:36 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-10-16 11:24:45
 */
const __alias__ = function(alias) {
    __context__.alias[alias.id] = alias.alias
}
const __context__ = function(deps, aliasPath, entryPoint) {
    // hashmap
    window.__define__ = function(id, block) {
        __context__.modules[id] = {
            block,
            exports: {

            },
            excuted: false,
        }
    }
    const Require = function(from) {
        return function(dep) {
            const id = path(from, dep)
            const module = __context__.modules[id]
            if (!module && __context__.alias[dep]) {
                return window[__context__.alias[dep]]
            }
            if (!module) {
                console.log(from, dep)
            }
            if (!module.excuted) {
                const require = new Require(id)
                const exports = module.exports
                module.excuted = true
                module.block(require, exports, module)
                return module.exports
            }
            return module.exports

        }
    }
    const path = function(from, dep) {
        // from 先去掉绝对路径
        from = from.replace(/^\//, '')
        // from 有/ 则最后一个/和最后的文件名去掉
        // from 无/ 则记为 空字符''
        // a.js => ''
        // dir/dir2/a.js => dir/dir2/ => dir/ => ''
        /**
         * 
         */
        function optimizeFrom() {
            if (from.match(/\/.*\.js$/)) {
                // 只执行第一次
                // 反前瞻，匹配 / 后不跟 / 的规则
                from = from.replace(/\/(.(?!\/))+$/, '')
            } else if (from.match(/\/(.(?!\/))+$/)) {
                // dir/dir2(/a.js) or dir(/dir2/)
                from = from.replace(/\/(.(?!\/))+$/, '')
            } else {
                from = ''
            }
        }
        optimizeFrom()
        /**
         * 
         */
        function optimizeDep() {
            if (aliasPath[dep]) {
                dep = aliasPath[dep]
            }
            if (!dep.match(/^\./)) {
                from = ''
                dep = `node_modules/${  dep}`
            }
            // dep  有./则 dep去掉.，其余不变
            if (dep.match(/^\.\//)) {
                dep = dep.replace(/^\.\//, '')
            // dep  有../则 from上移，dep去掉../
            } else if (dep.match(/^\.\.\//)) {
                optimizeFrom()
                dep = dep.replace(/^\.\.\//, '')
            // dep  无.，则为node_modules
            }
            if (dep.match(/^\./)) {
                optimizeDep()
            }

        }
        optimizeDep()
        return (!!from ? (`${from  }/`) : from) + dep
    }
    /**
     * 
     */
    function evalCode () {
        for (const id in __context__.entries) {
            const module = __context__.modules[id]
            if (!module.excuted) {
                const require = new Require(id)
                const exports = module.exports
                module.excuted = true
                module.block(require, exports, module)
            }
        }
    }
    const cnt = 0
    /**
     * 
     */
    function checkIsAllDepsLoaded () {
        let result = true
        for (const dep in __context__.deps) {
            if (!__context__.deps[dep].loaded) {
                result = false
            }
        }
        return result
    }
    deps.forEach(function(dep) {
        if (!__context__.deps[dep]) {
            __context__.deps[dep] = {
                fetched: false,
                loaded: false,
            }
        }
    })
    deps.forEach(function(dep, index) {
        if (index == 0) {
            __context__.entries[dep] = true
        }
        if (!__context__.deps[dep].fetched) {
            __context__.deps[dep].fetched = true
        } else {
            return
        }
        const script = document.createElement('script')
        const base =  document.querySelector('[data-main]').getAttribute('data-base') || ''
        script.src = `${base  }/${  dep  }?commonjs`
        // 加入了入口的判断，主要是为了，自动插入polyfill
        if (entryPoint == dep) {
            script.src += '&entry'
        }
        document.body.appendChild(script);
        (function(dep) {
            script.onload = function() {
                __context__.deps[dep].loaded = true
                if (checkIsAllDepsLoaded()) {
                    evalCode()
                }
            }
        })(dep)
    })
}
__context__.modules = {

}
__context__.alias = {

}
__context__.deps = {

}
__context__.entered = 0
__context__.entries = {

};
(function() {
    const els = document.querySelectorAll('[data-main]')
    for (let i = 0; i < els.length; i++) {
        const el = els[i]
        const base = el.getAttribute('data-base') || ''
        const entry = el.getAttribute('data-main')
        const dom = document.createElement('script')
        dom.src = `${base  }/require?path=${entry}&base=${base}`
        document.body.appendChild(dom)
    }
})()