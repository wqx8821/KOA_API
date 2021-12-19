const jwt = require('jsonwebtoken')
const { createUser, getUserInfo, updataByid } = require('../service/user.service.js')
const {userRegisterError} = require('../constant/err.type.js')
const {JWT_SECEET} = require('../config/config.default.js')
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
		// 用户登录接口
		async login(ctx, next) {
			const {user_name} = ctx.request.body
			ctx.body = `欢迎回来, ${user_name}`
			// 1、 获取用户信息(在token的payload中 记录 id user_name is_admin)
			try{
				// 剔除password token不携带密码，剩下的属性存放到res中
				const {password, ...res} = await getUserInfo({user_name})
				ctx.body = {
					code: 0,
					message: '登录成功',
					result: {
						token: jwt.sign(res, JWT_SECEET, {expiresIn: '7d'})
					}
				}
				
			}catch(err){
				console.error('用户登陆失败', err)
			}
		}
		// 更改密码
		async changePassword(ctx, next) {
			// 获取数据
			const {id}= ctx.state.user
			const password = ctx.request.body.password
			// console.log(id, password);
			// 操作数据库
			try{
				if(await updataByid({id, password})) {
					ctx.body = {
						code: 0,
						message: '修改成功',
						result: ''
					}
				} else {
					ctx.body = {
						code: 100703,
						message: '修改不成功',
						result: ''
					}
				}
			}catch(err){
				console.error(err)
			}
			// 返回结果
		}
	}

	// 导出 实例化后的 对象
	module.exports = new UserController()
