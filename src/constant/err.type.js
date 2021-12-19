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
	},
	tokenExpiredError: {
		code: 100101,
		message: 'token已过期',
		result:''
	},
	jsonWebTokenError: {
		code: 100102,
		message: '无效token',
		result: ''
	},
	hasNotAdminpermission: {
		code: 100103,
		message: '无管理员权限',
		result: ''
	},
	fileuploadError: {
		code: 100204,
		message: '图片上传错误',
		result: ''
	}
}