const Koa = require('koa');
// koabody是一个函数，要在所有中间件处理之前注册
const KoaBody = require('koa-body')
// 引入拆分后的路由
const router = require('../router/index.js')
// 导入错误处理errhander()
const errHandler = require('./errHandler.js')
const app = new Koa()
// 是个函数 注意加括号
app.use(KoaBody())
// 注册中间件 routers()将路由对象转换为函数
app.use(router.routes())
app.use(router.allowedMethods())
// 统一错误处理
app.on('error', errHandler)

module.exports = app
