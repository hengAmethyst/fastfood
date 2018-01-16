export default (that) => {
	return new Promise((resolve,reject)=>{
		that.$http.post(that.$store.state.accountHttp+"/jinghan-account/api/user/insertUserByOpenId",
		JSON.stringify({"param":{"openId":that.$store.state.openId,"kind":1},"nickName":that.$store.state.nickName})
		,{emulateJSON:true})
		.then(function(res){
			console.log(res)
			if(res.body.data.phone){
				that.$store.state.hasPhoneNumber = res.body.data.phone
				if(res.body.data.phone==0){
					that.$store.state.hasPhoneNumber = null
				}
			}
			resolve()
		})
	})
}
