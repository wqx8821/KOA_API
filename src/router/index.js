const fs = require('fs')

const Router = require('@koa/router')

const router = new Router()

fs.readdirSync(__dirname).forEach(file => { 
	if(file != 'index.js') {
		let name = require('./' + file)
		router.use(name.routes())
	}
})

module.exports = router