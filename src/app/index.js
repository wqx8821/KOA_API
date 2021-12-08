const Koa = require('koa');
// 引入拆分后的路由
const userRouter = require('../router/user.route.js')

const app = new Koa()
// 注册中间件 routers()将路由对象转换为函数
app.use(userRouter.routes())

module.exports = app
