const jwt = require('jsonwebtoken')
const {
	tokenExpiredError,
	jsonWebTokenError,
	hasNotAdminpermission
} = require('../consitant/err.type.js')
const {
	JWT_SECEET
} = require('../config/config.default.js')
// 判断用户是否登录 中间件
const auth = async (ctx, next) => {
	const {
		authorization
	} = ctx.request.header
	const token = authorization.replace('Bearer ', '')
	// console.log(token)
	// 使用 jwt库函数验证 token
	try {
		// 需要两个参数 token 和 私钥
		const user = jwt.verify(token, JWT_SECEET)
		// 将用户信息保存在 state中
		ctx.state.user = user
	} catch (err) {
		// token过期 过期token
		switch (err.name) {
			case 'TokenExpiredError':
				console.error('token已过期', err);
				return ctx.app.emit('error', tokenExpiredError, ctx)
			case 'JsonWebTokenError':
				console.error('无效token');
				return ctx.app.emit('error', jsonWebTokenError, ctx)
		}
	}
	await next()
}
// 判断用户是否拥有管理员权限
const hadAdminPermission = async (ctx, next) => {
	const {is_admin} = ctx.state.user
	if (!is_admin) {
		console.error('用户权限不足', ctx.state.user)
		return ctx.app.emit('error', hasNotAdminpermission, ctx)
	}
	await next()
}
module.exports = {
	auth,
	hadAdminPermission
}
