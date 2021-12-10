# KOA2_API

基于Koa2搭建通用APi

搭建 使用的 npm包

* dotenv 可以将 .env文件的内容写入环境变量中
* koa2  @koa/router  koa-body 框架 路由 解析
* nodemon 自动启动服务
* seqelize  mysql2  操作数据库

# 项目基本初始化

## 1 自动重启服务

安装 nodemon 工具

```js
npm i nodemon -D
```

编写`package.json`脚本

```json
"scripts": {
  "dev": "nodemon ./src/main.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

执行`npm run dev`启动服务

[![image-20210521142807478](687474703a2f2f696d6167652e62726f6a69652e636e2f696d6167652d32303231303532313134323830373437382e706e67)](https://camo.githubusercontent.com/448fd08c9f07fed74bdbe756d98a901ef86f78c1edbab5365323cb92c60fdd67/687474703a2f2f696d6167652e62726f6a69652e636e2f696d6167652d32303231303532313134323830373437382e706e67)

## 2 读取配置文件

安装`dotenv`, 读取根目录中的`.env`文件, 将配置写到`process.env`中

```js
npm i dotenv
```

创建`.env`文件

```js
APP_PORT=8000
```

创建`src/config/config.default.js`

```js
const dotenv = require('dotenv')

dotenv.config()

// console.log(process.env.APP_PORT)

module.exports = process.env
```

改写`main.js`

```js
const Koa = require('koa')

const { APP_PORT } = require('./config/config.default')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'hello api'
})

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`)
})
```

## 3 安装路由

```js
npm i @koa/router
```

### 	步骤

```ABAP
1. 导入包
2. 实例化对象
3. 编写路由
4. 注册中间件
```

###     拆分路由

创建src/router目录 ,编写 user.route.js文件

```js
const Router = require('@koa/router')
// 实例化对象 prefix 添加前缀
const router = new Router({prefix: '/users'})
// 路由
router.get('/', (ctx, next) => {
	ctx.body = 'users'
})

// 导出路由配置 在外部注册中间件
module.exports = router
```

改写main.js

```js
const Koa = require('koa');
// 导入 dotenv
const { APP_PORT } = require('./config/config.default.js')
// 引入拆分后的路由
const userRouter = require('./router/user.route.js')
const app = new Koa()
// 注册中间件 routers()将路由对象转换为函数
 app.use(userRouter.routes())
 app.listen(APP_PORT , () => {
	 console.log(`server is runing on http://localhost:${APP_PORT}`);
 })
```

## 4 目录解构优化

### 1 将http服务和app业务拆分

创建src/app/index.js 

```js
const Koa = require('koa');
// 引入拆分后的路由
const userRouter = require('../router/user.route.js')

const app = new Koa()
// 注册中间件 routers()将路由对象转换为函数
app.use(userRouter.routes())

module.exports = app

```

拆分后的main.js

```js
const app = require('./app/index.js')
// 导入 dotenv
const { APP_PORT } = require('./config/config.default.js')

 app.listen(APP_PORT , () => {
	 console.log(`server is runing on http://localhost:${APP_PORT}`);
 })
 
```

### 2 路由与控制器进行拆分

路由： 解析URL， 分发给控制器对应的方法

控制器： 控制不同的业务程序（将路由的处理程序写在控制器内）

```js
// 控制器 controller
class UserController {
	async register(ctx, next) {
		ctx.body = '用户注册接口'
	}
	async login(ctx, next) {
		ctx.body = '用户登录接口'
	}
}

// 导出 实例化后的 对象
module.exports = new UserController
```





## 5 解析body

1安装koa-body

```js
npm i koa-body
```

2注册中间件

app/index.js 引入koa-body 并在路由处理之前引入中间件。`中间件是一个函数`

3解析请求

改写user.controller.js文件,`并将数据库操作拆分在service文件夹下` => src/service/user.service.js

```js
// 导入service层 (剥离数据库操作)
const { createUser } = require('../service/user.service')

// 控制器
class UserController {
  // 用户注册
  async register(ctx, next) {
    // 1 获取数据
    const { user_name, password } = ctx.request.body;
    // 2 操作数据库
    const result = await createUser(user_name, password);
    console.log(result)
    // 3 返回结果
    ctx.body = ctx.request.body
  }
  async login(ctx, next) {
    ctx.body = '用户登录'
  }
} 


// 导出实例化的 对象
module.exports = new UserController();
```

# 数据库操作

sequelize ORM数据库工具

ORM：对象关系映射

* 数据表映射一个类
* 数据表中的数据对象对应一个对象
* 数据表字段对应对象的属性
* 数据表的操作对应对象的方法

## 1 安装sequelize

```js
npm i sequelize
npm i mysql2 // mysql版本最低5.7
```

## 2 连接数据库

要连接数据库，必须创建一个Sequelize实例，可以通过将连接分别传递到Sequelize，构建函数或通过传递一个连接URl来完成；

```js
const { Sequelize } = require('sequelize')
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} = require('../config/config.default')
// 实例化对象
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  dialect: 'mysql'
})
// 通过authenticate函数测试连接是否成功
// seq
//   .authenticate()
//   .then(() => {
//     console.log('数据库连接成功')
//   })
//   .catch(err => {
//     console.log('数据库连接失败', err)
//   })

module.exports = seq;
```

## 创建数据模型

```js
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
```

service层处理接受数据

```js
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
}

module.exports = new UserService
```

user.controller.js 接受 设置响应结果

```js
const { createUser } = require('../service/user.service.js')

class UserController {
	// 用户注册接口
	async register(ctx, next) {
			// 1 获取数据
			const {user_name,password} = ctx.request.body;
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

```

## 处理错误







# 接口设计

注册接口

```
POST /users/register
```

​	请求参数

```
user_name, pasword
```

​	响应

```

```






<!-- echo "# KOA_API" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/wqx8821/KOA_API.git
git push -u origin main -->