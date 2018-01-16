let dishesList = (that,tempVue) => {
		//获取菜品list信息
		var p = new Promise( (resolve,reject) => {
			that.$http.post(that.$store.state.merchantHttp+"/merchant/merchantDishesInfo/api/pc/getDishesInfoList",
			JSON.stringify({"param":{"merchantId":that.$store.state.merchantId,"inventoryNum": 0,"dishesType":1},"nickName":that.$store.state.nickName,"channel":1})
			,{emulateJSON:true})
			.then(function(res){
				console.log(res)
				//初始菜品list
				that.$store.state.originList = res.body.data
				//给菜品添加默认属性
				for(let i=0;i<that.$store.state.originList.length;i++){
					for(let j=0;j<that.$store.state.originList[i].specificationList.length;j++){
						if(that.$store.state.originList[i].specificationList[j].isDefault == 0){
							if(that.$store.state.originList[i].specificationList[j].itemPrice){
								that.$store.state.originList[i].price = Number(that.$store.state.originList[i].specificationList[j].itemPrice/100).toFixed(2)
							}else{
								that.$store.state.originList[i].price = 0
							}
							if(that.$store.state.originList[i].specificationList[j].itemMemberPrice){
								that.$store.state.originList[i].memberPrice = Number(that.$store.state.originList[i].specificationList[j].itemMemberPrice/100).toFixed(2)
							}
							else{
								that.$store.state.originList[i].memberPrice = 0
							}
							
							that.$store.state.originList[i].defaultScaleName = that.$store.state.originList[i].specificationList[j].itemName
						}
					}
					//英文搜索简写
					if(that.$store.state.originList[i].shortcutCode){
						that.$store.state.originList[i].shortcutCode = that.$store.state.originList[i].shortcutCode.toLowerCase()
					}
					//菜品属性
					//给菜品加一个值来控制菜品的属性
					that.$store.state.originList[i].dishAttr = []
					let attr = that.$store.state.originList[i].dishAttribute;
					if (attr) {
						that.$store.state.originList[i].dishAttribute = JSON.parse(attr)
						for(let j=0;j<that.$store.state.originList[i].dishAttribute.length;j++){
							let param = {
								id:j,
								index:null
							}
							that.$store.state.originList[i].dishAttr.push(param)
						}
					}
					//最小菜品数量
					if(that.$store.state.originList[i].minSaleNum==0){
						that.$store.state.originList[i].minSaleNum = 1
					}
					//配菜
					if(that.$store.state.originList[i].sideDishesInfoList.length>0){
						that.$store.state.originList[i].showSideDishes = true
					}
					else{
						that.$store.state.originList[i].showSideDishes = false
					}
					tempVue.set(that.$store.state.originList[i],'count', 0)
					//设置一个属性来保存某个菜品的上一次选中的规格/配菜/做法的class
					tempVue.set(that.$store.state.originList[i],'lastFoodClass', {})
				}
				//给nowDetailFood一个初始值,防止空值detail页面渲染报错
				that.$store.state.nowDetailFood = that.$store.state.originList[0]
				//生成一个用来按菜品种类保存的空数组
				for(let i=0;i<that.kind.length;i++){
					that.$store.state.foodsList.push([])
				}
				//菜品按种类list
				for(let i=0;i<that.$store.state.originList.length;i++){
					for(let j=0;j<that.$store.state.kinds.length;j++){
						if(that.$store.state.originList[i].categoryId==that.$store.state.kinds[j].id){
							that.$store.state.foodsList[j].push(that.$store.state.originList[i])
						}
					}
				}
				//计算菜品的菜种类名
				var cateName = []
				for(let i=0;i<that.$store.state.foodsList.length;i++){
					if(that.$store.state.foodsList[i].length>0){
						cateName.push(that.$store.state.foodsList[i][0].categoryName)
					}
					else{
						cateName.push('')
					}
				}
				that.$store.state.beforeCateName = cateName
				resolve()
			})
		})
		return p
	}
export default dishesList