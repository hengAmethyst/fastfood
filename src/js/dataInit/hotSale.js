//查询热销时间
import {getCurrentDay} from '../lib/getCurrentTime'
	let fromDate = getCurrentDay(new Date().getTime()-86400000*7)
	let toDate = getCurrentDay(new Date().getTime())
	//查询热销
	let hotList = (that) => {
		var p = new Promise( (resolve,reject) => {
			that.$http.post(that.$store.state.orderHttp+"/jinghan-order/api/order/report/v2/hotSaleRank",
			JSON.stringify({"param":{"merchantId":that.$store.state.merchantId,
									"openId":that.$store.state.openId,
									"fromDate":fromDate,
									"toDate":toDate,
									"fromTime":"00:00",
									"toTime":"00:00"
									},
									"nickName":that.$store.state.nickName,
									"channel":1})
									
			,{emulateJSON:true})
			.then(function(res){
				console.log(res)
				that.$store.state.hotList = res.body.data
				for(let i=0;i<that.$store.state.originList.length;i++){
					if(that.$store.state.hotList){
						for(let j=0;j<that.$store.state.hotList.length;j++){
							if(that.$store.state.originList[i].id == that.$store.state.hotList[j].dishesId){
								that.$store.state.hotList[j] = that.$store.state.originList[i]
							}
						}
					}
				}
			})
			resolve()
		})
		return p
	}
export default hotList