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

```
npm i nodemon -D
```

编写`package.json`脚本

```
"scripts": {
  "dev": "nodemon ./src/main.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

执行`npm run dev`启动服务

[![image-20210521142807478](687474703a2f2f696d6167652e62726f6a69652e636e2f696d6167652d32303231303532313134323830373437382e706e67)](https://camo.githubusercontent.com/448fd08c9f07fed74bdbe756d98a901ef86f78c1edbab5365323cb92c60fdd67/687474703a2f2f696d6167652e62726f6a69652e636e2f696d6167652d32303231303532313134323830373437382e706e67)

## 2 读取配置文件

安装`dotenv`, 读取根目录中的`.env`文件, 将配置写到`process.env`中

```
npm i dotenv
```

创建`.env`文件

```
APP_PORT=8000
```

创建`src/config/config.default.js`

```
const dotenv = require('dotenv')

dotenv.config()

// console.log(process.env.APP_PORT)

module.exports = process.env
```

改写`main.js`

```
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

```
npm i @koa/router
```

### 	步骤

	1. 导入包
	2. 实例化对象
	3. 编写路由
	4. 注册中间件

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

## 5 目录解构优化

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





## 4 解析body

1安装koa-body

```
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

1 安装sequelize

```
npm i sequelize
npm i 
```

2 连接数据库

要连接数据库，必须创建一个Sequelize实例，可以通过将连接分别传递到Sequelize，构建函数或通过传递一个连接URl来完成；

```js
const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'path/to/database.sqlite'
});

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});
```



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