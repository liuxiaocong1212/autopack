//0: off
//1: warning
//2: error
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 8,        
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        //4个空格
        "indent": [
            2,
            4,
            {
                'SwitchCase': 1
            }
        ],
        // 强制使用单引号
        "quotes": [
            2,
            "single",
            {"allowTemplateLiterals": true}
        ],
        // 不允许上会用分号
        "semi": [
            2,
            "never"
        ],
        //要求操作符周围有空格
        "space-infix-ops":[
            2,
            {"int32Hint": true} //允许 a|0 不带空格.
        ],
        //要求或禁止在一元操作符之前或之后存在空格 
        'space-unary-ops':[
            2,
            {
                'words': true,//适用于单词类一元操作符
                'nonwords': false   //适用于这些一元操作符: -、+、--、++、!、!!
            }
        ],
        // 用作代码块起始的左花括号
        "space-before-blocks":[
            2,
            {
                "keywords":"always",
                "functions":"always",
                "classes": "always"
            }
        ],
        //关键字后面必须带空格
        "keyword-spacing":[
            2,
            {
                "after": true
            }
        ],
        // ;前不允许有空格
        "semi-spacing": [
            2, 
            {
                "before": false,
                "after": true
            }
        ],
        // ,前不允许有空格
        "comma-spacing":[
            2,
            {
                "before": false,
                "after": true
            }
        ],
        //强制在圆括号中不适用空格
        "space-in-parens":[
            2,
            "never"
        ],
        // [强制] 行尾不得有多余的空格。
        "no-trailing-spaces":[
            2,
            // {
            //     "ignoreComments": true ,//允许在注释块中使用空白符
            //     "skipBlankLines": true //允许在空行使用空白符
            // }
        ],
        // [强制] 每个独立语句结束后必须换行。
        // "object-curly-newline": [
        //     "error",
        //     {
        //         "ObjectExpression": "always",
        //         "ObjectPattern": { "multiline": true ,"minProperties": 2}
        //     }
        // ],
        //强制使用驼峰命名
        "camelcase":[
            2,
            {
                "properties": "always" 
            }
        ],
        // [强制] 必须独占一行。// 后跟一个空格，缩进与下一行被注释说明的代码一致。
        "no-inline-comments":[
            2
        ],
        "spaced-comment":[
            2,
            "always"
        ],
        //JSDoc注释
        "require-jsdoc": [
            2, 
            {
                "require": {
                    "FunctionDeclaration": true,
                    "MethodDefinition": true,
                    "ClassDeclaration": true,
                    "ArrowFunctionExpression": true
                }
            }
        ],
        //禁用注释中的特殊语句  尴尬。
        // "no-warning-comments":[
        //     2,
        //     { "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }
        // ],
        "one-var": [
            2,
            "never"
        ],
        //禁止使用var
        "no-var":[
            2
        ],
        "prefer-const": [
            2
        ],
        // [建议] 如果函数或全局中的 else 块后没有任何语句，可以删除 else
        "no-else-return":[
            1,
        ],
        // "object-property-newline":[
        //     2
        // ],
        "no-loop-func":[
            1
        ],
        // [强制] 使用 parseInt 时，必须指定进制。
        "radix":[
            2
        ],
        //建议使用模板字符串而不是字符串链接
        "prefer-template":[
            2
        ],
        //要求对象字面量简写语法 (object-shorthand)
        "object-shorthand":[
            2,
            "always",  
            {
                "ignoreConstructors": true
            }
        ],
        //这个规则强制在对象和数组字面量中使用一致的拖尾逗号。
        "comma-dangle":[
            2,
            {
                "arrays" : "never",
                "imports": "only-multiline",
                "exports": "only-multiline",
                "functions": "never",
                "objects": "always-multiline"
            }
        ],
        // [建议] 一个函数的长度控制在 50 行以内。
        "max-statements":[
            1,
            50,
            // {
            //     "ignoreTopLevelFunctions": true //忽略顶级函数
            // }
        ],
        // [建议] 一个函数的参数控制在 6 个以内。(<=6)
        "max-params":[
            1,
            6
        ],
        // [建议] 尽量避免使用 eval 函数。
        "no-eval":[
            2
        ],
        // 尽量不要使用 with。
        "no-with":[
            1
        ],
        "no-delete-var":[
            1
        ],
        "no-multiple-empty-lines":[
            2,
            {
                "max": 1,
                "maxEOF": 1 //"maxEOF" 强制文件末尾的最大连续空行数。
                //"maxBOF" 强制文件开始的最大连续空行数。
            }
        ]
    }
};