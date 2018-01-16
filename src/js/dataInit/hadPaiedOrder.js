export default (that) => {
	return new Promise((resolve,reject)=>{
		that.$http.post(that.$store.state.orderHttp+"/jinghan-order/api/snack/v2/order/searchOrder",
			JSON.stringify({"param":{"merchantId":that.$store.state.merchantId,"openId":that.$store.state.openId,"orderStatus":2,"queryDetail":1,"page":{"currentPage":1,"pageSize":5}},"nickName":that.$store.state.nickName,"channel":1})
		,{emulateJSON:true})
		.then(function(res){
			console.log(res)
			//历史的订单list
			that.$store.state.historyList = res.body.data.orderList
			for(let i=0;i<that.$store.state.historyList.length;i++){
				//计算该订单的总数量
				that.$store.state.historyList[i].orderCount = 0
				//订单的时间
				that.$store.state.historyList[i].orderTime = getCurrentTime(that.$store.state.historyList[i].createTime)
				for(let j=0;j<that.$store.state.historyList[i].snackOrderDishes.length;j++){
					//每个菜的价格/100
					that.$store.state.historyList[i].snackOrderDishes[j].dishesPrice = (that.$store.state.historyList[i].snackOrderDishes[j].dishesPrice/100).toFixed(2)
					that.$store.state.historyList[i].snackOrderDishes[j].memberPrice = (that.$store.state.historyList[i].snackOrderDishes[j].memberPrice/100).toFixed(2)
					//做法价格/100
					that.$store.state.historyList[i].snackOrderDishes[j].cuisinePrice = (that.$store.state.historyList[i].snackOrderDishes[j].cuisinePrice/100).toFixed(2)
					//每个订单每个菜品的小菜价格
					if(that.$store.state.historyList[i].snackOrderDishes[j].sideDishes){
						let sideDishesPrice = 0 
						let sideMemberPrice = 0
						for(let k=0;k<that.$store.state.historyList[i].snackOrderDishes[j].sideDishes.length;k++){
							sideDishesPrice += that.$store.state.historyList[i].snackOrderDishes[j].sideDishes[k].dishesPrice + that.$store.state.historyList[i].snackOrderDishes[j].sideDishes[k].cuisinePrice
							sideMemberPrice += that.$store.state.historyList[i].snackOrderDishes[j].sideDishes[k].memberPrice + that.$store.state.historyList[i].snackOrderDishes[j].sideDishes[k].cuisinePrice
						}
						that.$store.state.historyList[i].snackOrderDishes[j].sideDishesPrice = (sideDishesPrice/100).toFixed(2)
						that.$store.state.historyList[i].snackOrderDishes[j].sideMemberPrice = (sideMemberPrice/100).toFixed(2)
					}
					else{
						that.$store.state.historyList[i].snackOrderDishes[j].sideDishesPrice = 0
						that.$store.state.historyList[i].snackOrderDishes[j].sideMemberPrice = 0
					}
					that.$store.state.historyList[i].orderCount += that.$store.state.historyList[i].snackOrderDishes[j].dishesCount
				}
			}
			resolve()
		})
	})
}
