module.exports = {
    // 1.0.67之后的autopack需要在项目启动的时候，手动配置domain
    // domain: '',
    path: __dirname + '/src/js',
    // 这个部分是走webpack打包的入口，路径计算从src/js为根目录开始
    entries: [
        // 'demo/webpack/index.js'
    ],
    // 这个配置，是把src中的ejs/pug, css/scss/less, js, 图片,
    // 输出到dist中，并输出标准的html, css格式
    legacy: {
        views: [
            // 'demo/legacy/**/*'
            ],
        style: [
            // 'demo/legacy/**/*'
            ],
        js: [
            // 'demo/legacy/**/*'
            ],
        images: [
            // 'demo/legacy/**/*'
            ],
    },
    // 1.2.0 之后开始支持混合app
    hybrid: {
        // devServer的时候使用的PackConfig
        devServer: {
            PLATFORM: 'WAP',
            ENV: 'UAT',
        },
        // 想要支持的sdk
        sdk: [3, 4],
        // 输出渠道，可以是app或纯wap
        channel: ['app', 'wap'],
        // 借用自php项目的环境变量，理解
        prefix: {
            app: {
                uat: {
                    '{CSS_CDN_IP}': './style',
                    '{JS_CDN_IP}': '.',
                    '{PLUS_STATIC_RESOURCES}': '.',
                    '{PLUS_ANALYSIS_JS}': '.',
                },
                live: {
                    '{CSS_CDN_IP}': './style',
                    '{JS_CDN_IP}': '.',
                    '{PLUS_STATIC_RESOURCES}': '.',
                    '{PLUS_ANALYSIS_JS}': '.',
                },
            },
            wap: {
                uat: {
                    '{CSS_CDN_IP}': './style',
                    '{JS_CDN_IP}': '.',
                    '{PLUS_STATIC_RESOURCES}': '.',
                    '{PLUS_ANALYSIS_JS}': '.',
                },
                live: {
                    '{CSS_CDN_IP}': './style',
                    '{JS_CDN_IP}': '.',
                    '{PLUS_STATIC_RESOURCES}': '.',
                    '{PLUS_ANALYSIS_JS}': '.',
                },
            },
        },
        views: [
            ],
        images: [
            ],
        
    },
}