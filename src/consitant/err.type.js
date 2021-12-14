// 错误统一处理
module.exports =  {
	// 定义错误类型
	userFormateError: {
		code: '100001',
		message: '用户名或密码为空',
		result: ''
	},
	userAlreadyExited: {
		code: '100002',
		message: '用户已存在',
		result: ''
	},
	userRegisterError: {
		code: '100003',
		message: '用户注册错误',
		result: ''
	},
	userDoesNotExist: {
		code: 100004,
		message: '用户名不存在',
		result: ''
	},
	userLoginError: {
		code: 100005,
		message: '用户登录失败',
		result: ''
	},
	invalidPassword: {
		code: 100006,
		message: '密码不匹配',
		result: ''
	}
}