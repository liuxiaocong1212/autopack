/**
 * @Author: zhaoye 
 * @Date: 2017-10-17 17:03:27 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2018-02-22 17:01:06
 */
// Karma configuration
// Generated on Tue Oct 17 2017 16:00:58 GMT+0800 (中国标准时间)
const path = require('path')
module.exports = function(config) {
    config.set({
        autoWatch: true,
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        // customContextFile: './ss.html',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon-chai'],
        // list of files / patterns to load in the browser
        files: [
            'test/*.js'
        ],
        webpack: {
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        use: [
                            {
                                loader: 'vue-loader',
                            }
                        ],
                    },
                    {test: /\.less$/, loaders: ['style-loader', 'css-loader', 'less-loader']},
                    {test: /\.html$/, loaders: ['html-loader']},
                    { test: /\.hbs$/, loaders: ['handlebars-loader'] },
                    {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
                    {
                        test: /\.(png|jp[e]?g|bmp|gif)$/,
                        loaders: [
                            'url-loader'
                        ],
                    },
                    // instrument only testing sources with Istanbul 
                    {
                        //  不包含test.js结尾的正则 /^((?!\.test).)*\.js$/,
                        test:  /\.js$/,
                        use: {
                            loader: 'babel-loader',
                        },
                    }
                ],
            },
        },

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/*.js': ['webpack'],
        },
        coverageIstanbulReporter: {
            reports: [ 'text-summary', 'html'],
            fixWebpackSourcePaths: true,
            dir : 'coverage/',
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'html', 'coverage-istanbul'],

        // web server port
        port: 9876,
        // example configuration 
        // the default configuration 
        htmlReporter: {
            // where to put the reports
            outputDir: 'karma_html',
            // set if you moved jasmine_template.html
            templatePath: null,
            // reports show failures on start
            focusOnFailures: true,
            // name files instead of creating sub-directories
            namedFiles: false,
            // page title for reports; browser info by default
            pageTitle: null,
            // simply replaces spaces with _ for files/dirs
            urlFriendlyName: false,
            // report summary filename; browser info by default 
            reportName: 'report-summary-filename',
            // experimental 
            // folded suites stay folded
            preserveDescribeNesting: false,
            // reports start folded (only with preserveDescribeNesting)
            foldAll: false,
        },
        // optionally, configure the reporter 
        coverageReporter: {
            type : 'html',
            dir : 'coverage/',
        },
        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS_custom'],
        // you can define custom flags 
        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    windowName: 'test',
                    viewportSize: {
                        width: '375px',
                        height: '667px',
                    },
                },
                flags: ['--load-images=true'],
                debug: true,
            },
        },
        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom) 
            exitOnResourceError: true,
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
    })
}