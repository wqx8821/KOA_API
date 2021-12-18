const Router = require('@koa/router')

// 实例化对象 prefix 添加前缀
const router = new Router({
	prefix: '/goods'
})

router.post('/upload', )


// 导出路由配置 在外部注册中间件
module.exports = router