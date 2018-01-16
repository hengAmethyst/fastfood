let cateList = (that) => {
		//获取菜品的种类信息
		let p = new Promise( (resolve,reject) => {
			that.$http.post(that.$store.state.merchantHttp+"/merchant/merchantDishCategory/api/pc/getMerchantDishCategoryListByMerchantId",
			JSON.stringify({"param":{"merchantId":that.$store.state.merchantId},"nickName":that.$store.state.nickName,"channel":1})
		,{emulateJSON:true})
		.then(function(res){
				console.log(res)
				that.kind = res.body.data
				that.$store.state.kinds = res.body.data
				resolve()
			})
		})
		return p
	}
export default cateList
