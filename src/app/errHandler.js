module.exports = (err, ctx) => {
	let status = 500
	switch (err.code) {
		case '100001':
		  status = 400
		break
		 case '100002':
		  status = 409
		break
		default:
		  status = 500
	}
	ctx.status = status
	ctx.body = err
}