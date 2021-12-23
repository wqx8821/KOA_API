const {goodsFormatError} = require('../constant/err.type.js')
const validator = async (ctx, next) => {
	try{
		ctx.verifyParams({
			goods_name: {type: 'string', required: true},
			goods_price: {type: 'number', required: true},
			goods_num: {type: 'number', required: true},
			goods_img: {type: 'string', resuire: true}
		})
	}catch(err){
		goodsFormatError.result = err
		return ctx.app.emit('error', goodsFormatError, ctx)
	}
	await next()
}

module.exports = {
	validator
}