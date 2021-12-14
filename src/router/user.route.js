const Router = require('@koa/router')
// 导入自定义中间件 进行 用户验证
const {
	userValidator,
	userVerify,
	cryptPassword,
	verifyLogin
} = require('../middleware/user.middleware.js')
// 实例化对象 prefix 添加前缀
const router = new Router({
	prefix: '/users'
})
// 导入 controller 解构
const {
	register,
	login
} = require('../controller/user.controller.js')
// 路由 将路由处理函数拆分到controller中
router.get('/', (ctx, next) => {
	ctx.body = '用户接口'
})
router.post('/register', userValidator, userVerify, cryptPassword, register)
router.post('/login', userValidator, verifyLogin, login)

// 导出路由配置 在外部注册中间件
module.exports = router
