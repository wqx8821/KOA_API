const app = require('./app/index.js')
// 导入 dotenv
const { APP_PORT } = require('./config/config.default.js')

 app.listen(APP_PORT , () => {
	 console.log(`server is runing on http://localhost:${APP_PORT}`);
 })
 