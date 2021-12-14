const bcrypt = require('bcryptjs')

const {
	getUserInfo
} = require('../service/user.service.js')
// 导入错误统一处理文件 解构错误类型
const {
	userAlreadyExited,
	userFormateError,
	userRegisterError,
	userDoesNotExist,
	userLoginError,
	invalidPassword
} = require('../consitant/err.type.js')
// 中间件 验证器
const userValidator = async (ctx, next) => {
	const {
		user_name,
		password
	} = ctx.request.body;
	// 错误处理 验证 合法性
	if (!user_name || !password) {
		console.error('用户名或密码为空', ctx.request.body)
		ctx.app.emit('error', userFormateError, ctx)
		return
	}
	await next()
}
// 验证用户 中间件
const userVerify = async (ctx, next) => {
	const {
		user_name
	} = ctx.request.body;
	// 验证 合理性 (若用户存在就不调用 createUser())
	// 判断用户是否存在封装在service层 的
	try {
		const res = await getUserInfo({
			user_name
		})
		if (res) {
			console.error('用户已经存在', {
				user_name
			})
			ctx.app.emit('error', userAlreadyExited, ctx)
			return
		}
	} catch (err) {
		console.error('获取用户信息错误', err)
		ctx.app.emit('error', userRegisterError, ctx)
		return
	}

	await next()
}
// 密码加密函数
const cryptPassword = async (ctx, next) => {
	// 解构出密码
	const {password} = ctx.request.body
	// 加密(加盐)
	const salt = bcrypt.genSaltSync(10)
	// hash保存的是 密文
	const hash = bcrypt.hashSync('password', salt)
	// 密文将明文覆盖
	
	
	ctx.request.body.password = hash
	
	await next()
}
// 登录模块
// 验证用户
const verifyLogin = async (ctx, next) => {
	const {user_name,password} = ctx.request.body
	
	  try {
	    const res = await getUserInfo({ user_name })
	
	    if (!res) {
	      console.error('用户名不存在', { user_name })
	      ctx.app.emit('error', userDoesNotExist, ctx)
	      return
	    }
	
	    // 2. 密码是否匹配(不匹配: 报错)
	    if (!bcrypt.compareSync('password', res.password)) {
	      ctx.app.emit('error', invalidPassword, ctx)
	      return
	    }
	  } catch (err) {
	    console.error(err)
	    return ctx.app.emit('error', userLoginError, ctx)
	  }

	await next()
}

module.exports = {
	userValidator,
	userVerify,
	cryptPassword,
	verifyLogin
}
