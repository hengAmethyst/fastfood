export default (that) => {
	return new Promise((resolve,reject)=>{
		that.$http.post(that.$store.state.orderHttp+"/jinghan-order/api/snack/v2/order/searchOrder",
			JSON.stringify({"param":{"merchantId":that.$store.state.merchantId,"openId":that.$store.state.openId,"queryDetail":2,"page":{"currentPage":1,"pageSize":5}},"nickName":that.$store.state.nickName,"channel":1})
		,{emulateJSON:true})
		.then(function(res){
			console.log(res)
			//用于买过栏的加减菜，处理相关的数据
			for(let i=0;i<res.body.data.orderList.length;i++){
				if(res.body.data.orderList[i].snackOrderDishes){
					for(let j=0;j<res.body.data.orderList[i].snackOrderDishes.length;j++){
						//数量置为1
						res.body.data.orderList[i].snackOrderDishes[j].dishesCount = 1
						//价格除于100
						res.body.data.orderList[i].snackOrderDishes[j].dishesPrice = (res.body.data.orderList[i].snackOrderDishes[j].dishesPrice/100).toFixed(2)
						res.body.data.orderList[i].snackOrderDishes[j].memberPrice = (res.body.data.orderList[i].snackOrderDishes[j].memberPrice/100).toFixed(2)
						res.body.data.orderList[i].snackOrderDishes[j].cuisinePrice = (res.body.data.orderList[i].snackOrderDishes[j].cuisinePrice/100).toFixed(2)
						var tempSideName = ''
						var sideDishesPrice = 0
						var sideMemberPrice = 0
						//如果有配菜
						if(res.body.data.orderList[i].snackOrderDishes[j].sideDishes){
							var tempSideName = ''
							var sideDishesPrice = 0 
							var sideMemberPrice = 0
							//配菜名字·价格
							for(let k=0;k<res.body.data.orderList[i].snackOrderDishes[j].sideDishes.length;k++){
								tempSideName += res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].dishesName+' '
								sideDishesPrice += Number((res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].dishesPrice + res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].cuisinePrice)/100)
									sideMemberPrice += Number((res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].memberPrice + res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].cuisinePrice)/100)
									res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].dishesCount = 1
							}
						}
						let tempData = res.body.data.orderList[i].snackOrderDishes[j]
						//foodTip按照顺序排列   做法，配菜，规格
						res.body.data.orderList[i].snackOrderDishes[j].foodTip = tempData.cuisineName+' '+tempSideName+tempData.unitName
						res.body.data.orderList[i].snackOrderDishes[j].sideDishesPrice = sideDishesPrice
						res.body.data.orderList[i].snackOrderDishes[j].sideMemberPrice = sideMemberPrice
						//该菜品的全部总价
						res.body.data.orderList[i].snackOrderDishes[j].oneAllPrice = (Number(sideDishesPrice) + Number(res.body.data.orderList[i].snackOrderDishes[j].cuisinePrice) + Number(res.body.data.orderList[i].snackOrderDishes[j].dishesPrice)).toFixed(2)
						//该菜品的会员总价
						res.body.data.orderList[i].snackOrderDishes[j].oneAllMemberPrice = (Number(sideMemberPrice) + Number(res.body.data.orderList[i].snackOrderDishes[j].cuisinePrice) + Number(res.body.data.orderList[i].snackOrderDishes[j].memberPrice)).toFixed(2)
						
						that.$store.state.boughtList.push(res.body.data.orderList[i].snackOrderDishes[j])
					}
				}
			}
			//去重
			let newArry = []
			for(let i=0;i<that.$store.state.boughtList.length;i++){
				if(newArry.length>0){
					for(let j=0;j<newArry.length;j++){
						if(that.$store.state.boughtList[i].foodTip == newArry[j].foodTip){
							break;
						}
						else{
							newArry.push(that.$store.state.boughtList[i])
						}
					}
				}
				else{
					newArry.push(that.$store.state.boughtList[i])
				}
			}
			that.$store.state.boughtList = newArry
			resolve()
		})
	})
}
