const { createUser, getUserInfo } = require('../service/user.service.js')
const {userRegisterError} = require('../consitant/err.type.js')
class UserController {
	// 用户注册接口
	async register(ctx, next) {
			// 1 获取数据
			const {user_name,password} = ctx.request.body;

			// 2. 操着数据库（处理拆分在 service 层）
			try {
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
			} catch(err) {
				console.log(err);
				ctx.app.emit('error', userRegisterError, ctx)
			}
		}
		async login(ctx, next) {
			ctx.body = '用户登录接口'
		}
	}

	// 导出 实例化后的 对象
	module.exports = new UserController()
