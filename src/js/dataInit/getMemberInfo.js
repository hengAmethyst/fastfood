export default (that) => {
	return new Promise((resolve,reject)=>{
		that.$http.post(that.$store.state.accountHttp+'/jinghan-account/api/user/queryByOpenId',
			JSON.stringify({"param":{"openId":that.$store.state.openId,
							"merchantId":that.$store.state.merchantId},
							"nickName":that.$store.state.nickName,
							"channel":1})
		,{emulateJSON:true})
		.then(
			function(res){
				console.log(res)
				if(res.body.data.phone == 0){
						that.$store.state.phoneNumber = null
				}
				else{
					//会员电话
					that.$store.state.phoneNumber = res.body.data.phone
					//会员Id
					that.$store.state.memberUserId = res.body.data.member.id
					//用户Id
					that.$store.state.userId = res.body.data.member.userId
					if(typeof(res.body.data.member.balance)=='undefined' | typeof(res.body.data.member.balance)==null){
						that.$store.state.memberBalance = 0
					}
					else{
						//会员余额
						that.$store.state.memberBalance = res.body.data.member.balance/100
					}
					//用户性别
					that.$store.state.userGender = res.body.data.member.sex
					//会员生日
					that.$store.state.memberBir = res.body.data.member.birthday
					//会员名字
					that.$store.state.memberName = res.body.data.member.name
					//会员region
					if(res.body.data.member.region){
						that.$store.state.memberRegion = res.body.data.member.region
					}
					//会员memberAddress
					that.$store.state.memberAddress = res.body.data.member.address
					//查询充值和消费记录
					that.$http.post(that.$store.state.accountHttp+"/jinghan-account/api/user/queryMemberRecharge",
					JSON.stringify({"param":{"userId":that.$store.state.memberUserId,"merchantId":that.$store.state.merchantId}})
					,{emulateJSON:true})
					.then(function(res){
						console.log(res)
						if(res.body.data){
							that.$store.state.memberChargeRecord = res.body.data.memberRechargeList
							//时间转换
							for(let i=0;i<that.$store.state.memberChargeRecord.length;i++){
								//type=0消费，type!=0 充值
								if(that.$store.state.memberChargeRecord[i].type==0){
									that.$store.state.memberChargeRecord[i].rechargeMoney = '-' + (that.$store.state.memberChargeRecord[i].rechargeMoney/100)
									that.$store.state.memberChargeRecord[i].class = 'del' 
								}
								else{
									that.$store.state.memberChargeRecord[i].rechargeMoney = '+' + (that.$store.state.memberChargeRecord[i].rechargeMoney/100)
									that.$store.state.memberChargeRecord[i].class = 'add'
								}
								//如果createTime存在
								if(that.$store.state.memberChargeRecord[i].createTime){
									that.$store.state.memberChargeRecord[i].createTime = getCurrentTime(that.$store.state.memberChargeRecord[i].createTime)
								}
								else{
									that.$store.state.memberChargeRecord[i].createTime = 0
								}
							}
						}
					})
				}
				resolve()
			})
	})
}
