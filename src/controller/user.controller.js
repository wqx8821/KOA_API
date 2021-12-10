const { createUser, getUserInfo } = require('../service/user.service.js')

class UserController {
	// 用户注册接口
	async register(ctx, next) {
			// 1 获取数据
			const {user_name,password} = ctx.request.body;
			// 错误处理 验证 合法性 
			if(!user_name || !password) {
				console.error('用户名或密码为空',ctx.request.body)
				ctx.status = 400
				ctx.body = {
					code: '100001',
					message: '用户名或密码为空',
					result: ''
				}
				// 若发生错误就 中断返回
				return
			}
			// 验证 合理性 (若用户存在就不调用 createUser())
			// 判断用户是否存在封装在service层 的
			if(getUserInfo({ user_name })) {
				// 409 冲突的
				ctx.status = 409,
				ctx.body = {
					code: '10002',
					message: '用户已经存在',
					result: ''
					
					
				}
				return
			}
			// 2. 操着数据库（处理拆分在 service 层）
			const res = await createUser(user_name, password);
			// console.log(result)

			// 3. 返回结果 
			ctx.body = {
				code: 0,
				message: '用户注册成功',
				result:{
					id: res.id,
					user_name: res.user_name
				}
			}
		}
		async login(ctx, next) {
			ctx.body = '用户登录接口'
		}
	}

	// 导出 实例化后的 对象
	module.exports = new UserController()
