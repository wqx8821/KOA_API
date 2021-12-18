const Router = require('@koa/router')
const {auth, hadAdminPermission} = require('../middleware/auth.middleware.js')
const {upload} = require('../controller/goods.controller.js')
// 实例化对象 prefix 添加前缀
const router = new Router({
	prefix: '/goods'
})

router.post('/upload', auth, hadAdminPermission, upload)


// 导出路由配置 在外部注册中间件
module.exports = router