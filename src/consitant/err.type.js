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
	}
}