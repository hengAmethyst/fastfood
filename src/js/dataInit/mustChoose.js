let mustChoose = (that) => {
	return new Promise((resolve,reject)=>{
		that.$http.post(that.$store.state.merchantHttp+"/merchant/merchantObligatoryContent/api/pc/getMerchantObligatoryContentByMerchantId",
			JSON.stringify({"param":
								{"merchantId":that.$store.state.merchantId,"type":1},
								"channel": 1,
								"nickName":that.$store.state.nickName})
			,{emulateJSON:true})
			.then(function(res){
				console.log(res)
				if(res.body.data){
					for(let i=0;i<res.body.data.length;i++){
						if(res.body.data[i].categoryId ==3){
							//categoryId
							that.$store.state.boxWay.categoryId = 3
							//主键id
							that.$store.state.boxWay.obligatoryId = res.body.data[i].id
							//计算时单价
							that.$store.state.boxWay.price = (res.body.data[i].cost/100).toFixed(2)
							//传给后台单价
							that.$store.state.boxWay.cost = res.body.data[i].cost
							//是否展示必选项
							that.$store.state.boxWay.showTip = false
						}
						if(res.body.data[i].categoryId == 4){
							//categoryId
							that.$store.state.boxWay.categoryId = 4
							//主键id
							that.$store.state.boxWay.obligatoryId = res.body.data[i].id
							//计算时单价
							that.$store.state.boxWay.price = (res.body.data[i].cost/100).toFixed(2)
							//传给后台单价
							that.$store.state.boxWay.cost = res.body.data[i].cost
							that.$store.state.boxWay.showTip = false
						}
					}
				}
				resolve()
			})
	})
}
export default mustChoose