********************************* init *********************************
*                                                                      *
*       创建模板文件目录结构  ex:$ autopack --init project             *
*                  input :$ autopack --init <filename>                 *
*                                                                      *
************************************************************************

***************************** start server *****************************
*                                                                      *
*                      进入项目  ex:$ cd project                       *
*            step.1 input :$ cd <fileName>                             *
*                    安装项目依赖  ex:$ npm install                    *
*            step.2 input :$ npm install                               *
*                开启服务  ex:$ autopack --server --port 3000          *
*            step.3 input :$ autopack --server --port <port>           *
*                                                                      *
************************************************************************

## 1.0.60

* 加入了devserver的autoprefixer的支持，目前仅支持commonjs方案下的sass和less
* 更新了eslint的规则
* 人为规避了`gome-bridge-core`库和`crequire`冲突的bug
* 加入了`cross-env`，支持Mac环境开发

## 1.0.61

* 加入了build时对autoprefixer的支持
* 源码格式优化
* 加入了base64图片的支持
* 加入了plus-public的支持
* 加入了PLUS_CSS PLUS_JS的支持

## 1.0.62

* 修复了一个导致autopack启动失败的语法bug

## 1.0.63

* 修复了不能build的bug

## 1.0.64

* 修复了plus-public图片和字体不能加载的问题

## 1.0.65

* webpack build 修复不压缩js的问题

## 1.0.66 

* 修复build时scss不输出的问题

## 1.0.69

* 修复开发server不支持dll的问题
* 修复不能使用--port指定端口启动的问题
* 新增webpack支持zepto的配置项

## 1.0.72

* 统一了webpack和commonjs开发风格，js引用的问题
* 修复了data-base不为空时，js报错的问题

## 1.0.73

* 修复了服务端webpack-copy不更新的问题
* 修复了eslint不支持async/await的问题
* 修复了cssnano篡改z-index的问题
* 删除了部分无用的库
* 锁死了devDependencies依赖

## 1.0.74

* 锁死了autopack的依赖

## 1.0.75

* 修复了误删除webpack.config.js里面的webpack依赖的问题
* 修复了没有uglify-js的依赖的问题


## 1.0.76

* npm切换到yarn

## 1.1.0 - 1.1.4

* 修复部分迁移yarn后，node-sass引起的bug

## 1.1.5 - 1.1.6

* autopack优化代码顺序，优化log，优化性能
* 加入了一个变量支持PLUS_STATIC_RESOURCES

## 1.1.7

* 优化了demo

## 1.1.8 next

* 加入了karma的启动模板

## 1.1.9 next hot-fix

* 加入了chai的依赖

## 1.1.10 next hot-fix

* 加入了webpack的依赖

## 1.1.11-1.1.12 next hot-fix

* 加入了babel-loader的依赖

## 1.1.13 next 

* 优化了coverage的覆盖率不准的问题

## 1.1.14 next hot-fix

* 修复了当package.json当中没有devDependencies的时候的bug 

## 1.2.0 next

* 初步支持了混合app
* 支持vue组件的单元测试

## 1.2.1 next hot-fix

* 补充了package.json里的build-hybrid脚本

## 1.2.2 - 1.2.9 next hot-fix

* 修复了.npmrc的不生成的问题

## 1.2.10 - 1.2.11 next hot-fix

* 修复了nise最新版本引用私有库导致的不能安装的问题

## 1.2.12 next hot-fix

* 处于sinon的不可抗力=。= 换回了npm，且回头需要强制大家升级到npm5

## 1.2.13 - 1.2.14 next 

* 强制用户升级到npm v5

## 1.2.15 next

* 混合app支持输出针对wap和app两个平台的不同环境的prefix

## 1.2.16 next

* 解决了因sinon使用私有scope导致yarn不能更新的问题
* 回到yarn，抛弃npm

## 1.2.17 next

* 完善了混合app包的config.json的配置

## 1.2.18 release

* 优化了autopack初始化项目时的体验

## 1.2.19 release hot-fix

* 修复了config.hybrid.devServer导致的问题

## 1.2.20 release hot-fix

* .npmrc配置scope的registry，在linux下失败，伪造了一个4.99.99的sinon版本

更新版本