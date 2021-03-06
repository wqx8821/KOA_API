// 导入数据模型
const User = require('../model/use.model.js')
// 操作数据库
class UserService {
	async createUser(user_name, password) {
		// 插入数据
		const result = await User.create({user_name,password})
		// 返回数据
		return result.dataValues
	}
	// 错误处理 判断用户是否存在
	async getUserInfo({id, user_name, password, is_admin}) {
		const whereOpt = {}
		// 短路运算技巧 若参数存在就 将参数拷贝whereOpt中
		id && Object.assign(whereOpt, { id })
		user_name && Object.assign(whereOpt, { user_name })
		password && Object.assign(whereOpt, { password })
		is_admin && Object.assign(whereOpt, { is_admin })
		
		// findOne 获取查询到的第一个满足的字段
		const res = await User.findOne({
			// 要查询的字段
			attributes: ['id', 'user_name', 'password', 'is_admin'],
			where: whereOpt
		})
		// 如果查询到结果 就返回 res.dataValues
		return res ? res.dataValues : null
	}
	// 更新用户信息
	async updataByid({id, user_name, password, is_admin}) {
		const whereOpt = {id}
		const newUser = {}
		user_name && Object.assign(newUser, { user_name })
		password && Object.assign(newUser, { password })
		is_admin && Object.assign(newUser, { is_admin })
		
		const res = await User.update(newUser, {where: whereOpt})
		return res[0] > 0 ? true : false
	}
}

module.exports = new UserService()