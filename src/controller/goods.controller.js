const path = require('path')
const {fileuploadError} = require('../constant/err.type.js')
class GoodsController {
	// 图片上传
	async upload(ctx, next) {
		// console.log(ctx.request.files.file);
		const {file} = ctx.request.files
		
		if(file) {
			ctx.body = {
				code: 0,
				message: '图片上传成功',
				result: {
					goods_img: path.basename(file.path)
				}
			}
		} else {
			return ctx.app.emit('error', fileuploadError, ctx)
		}
	}
	r
}

module.exports = new GoodsController();