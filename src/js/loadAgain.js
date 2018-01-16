//加载基本信息，菜品list等所有需要的基本的信息均使用此函数
import Vue from 'vue'
import {getCurrentTime,getCurrentDay} from './lib/getCurrentTime.js'
import mustChoose from './dataInit/mustChoose.js'
import getMemberInfo from './dataInit/getMemberInfo.js'
import orderList from './dataInit/getOrderList.js'
import hadPaiedOrder from './dataInit/hadPaiedOrder.js'
import buiedDishes from './dataInit/buiedDishes.js'
import dishesList from './dataInit/getDishesList.js'
import hotSale from './dataInit/hotSale.js'
import cateList from './dataInit/getDishesCates.js'
import ifBindPhone from './dataInit/ifBindPhone.js'
let loadAgain = (that,tempVue) => {
	
	
	
	
	let tempPro = 
		cateList(that).then(orderList(that)).then(dishesList(that,Vue)).then(hotSale(that))
	
	
	Promise.all( [
		//必选项查询
		// mustChoose(that),
		// //根据openId获取手机号，判断是否为会员
		// getMemberInfo(that),
		// //查询这个openId是否有绑定的电话
		// ifBindPhone(that),
		//买过的菜,用于indent订单,已结账
		hadPaiedOrder(that),
		//买过的菜,用点过的菜一栏
		buiedDishes(that),
		tempPro
	] ).then(()=>{
		that.$store.state.indexShow = true
	});
}
export default loadAgain