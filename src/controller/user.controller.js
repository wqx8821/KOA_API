class UserController {
	async register(ctx, next) {
		ctx.body = '用户注册接口'
	}
	async login(ctx, next) {
		ctx.body = '用户登录接口'
	}
}

// 导出 实例化后的 对象
module.exports = new UserController