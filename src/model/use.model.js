const { DataTypes } = require('sequelize')
// 从seq文件引入Sequelize ，也可直接解构
const seq = require('../db/sequelize.js')

// 创建模型
const User = seq.define('User', {
	 // 表的字段和类型 (id会自动创建)
	  user_name: {
	    type: DataTypes.STRING, // 类型U
	    allowNull: false,   // 字段允许为空
	    unique: true,  // 唯一性er
	    comment: '用户名 唯一' // 注释
	  },
	  password: {
	    type: DataTypes.CHAR(64),
	    allowNull: false, // 字段允许为空
	    comment: '密码'
	  },
	  is_admin: { // 是否为管理员
	    type: DataTypes.BOOLEAN, 
	    allowNull: false,
	    defaultValue: 0,  // 默认值 默认为普通用户
	    comment: '是否为管理员 0不是 1是'
	  }
})
// 将数据模型同步到数据库 (参考文档模型同步)
// 创建数据表(创建完成后可注释)
// User.sync({
//   force: true, // 若表存在则删除这张表, 重新创建
// })

module.exports = User