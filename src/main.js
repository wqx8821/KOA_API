const Koa = require('koa');

const { APP_PORT } = require('./config/config.default.js')

const app = new Koa()
 app.use((ctx, next) => {
	 ctx.body = '响应'
 }) 
 app.listen(APP_PORT , () => {
	 console.log(`server is runing on http://localhost:${APP_PORT}`);
 })
 