/**
 *支付成功页面 
 */
<template>
	<div class="paySucceed">
		<!--nav-->
		<div class="navs">
			<p>
				{{information.name}}
			</p>
		</div>
		<!--支付成功显示栏-->
		<div class="succeed-view">
			<p>
				<img src="../../../assets/icons/支付成功@3x.png" v-if="this.$store.state.payStatus"/>
				<img src="../../../assets/icons/支付失败@3x.png" v-if="!this.$store.state.payStatus"/>
			</p>
			<p>
				<span>
				<img src="../../../assets/icons/wechatPay.png" v-if="wayImgStatus==1"/>
				<img src="../../../assets/icons/aliPay.png" v-if="wayImgStatus==2"/>
					<i>{{this.$store.state.payResult}}</i>
				</span>
			</p>
		</div>
		<!--按钮-->
		<router-link to="/order/buy" class="rating">继续点餐</router-link>
		<alert :showMsg="showMsg" v-if="showAlert"></alert>
	</div>
</template>
<script>
import {getURLParam} from '../../../js/lib/splitInfo.js'
import cookie from '../../../js/lib/cookie.js'
import loadAgain from '../../../js/loadAgain.js'
import getLocal from '../../../js/lib/getLocal.js'
import Vue from 'vue'
	export default{
		data(){
			return{
       			information:{name:'支付完成',ifShowReload:false,ifShowMenu:true},
       			//微信
       			weCaht:false,
       			//支付宝
       			aliPay:false,
       			//显示微信或者支付宝图片
        			wayImgStatus:null,
        			showMsg:'',
        			showAlert:false
			}
		}
		,
		created(){
			//判断用什么浏览器方式打开
			var userWay = navigator.userAgent
			if(userWay.indexOf('MicroMessenger') >= 0){
				this.$store.state.payStatus = true
				this.weChat = true
				this.wayImgStatus = 1
				this.$store.state.ifShowWillPay = false
			}
			if(userWay.indexOf('AlipayClient') >= 0){
				this.aliPay = true
				this.wayImgStatus = 2
			}
			//如果是支付宝支付
			if(this.aliPay){
				//取本地数据
				getLocal(this,'needInfo')
				//分解Url,获取弹框需要展示的内容
				var localUrl = window.location.href
				this.showMsg = getURLParam('msg',localUrl)
				this.showMsg = decodeURI(this.showMsg)
				//支付宝支付成功,由于外网跳进,需要重新加载数据
				if(localUrl.indexOf('out_trade_no') >= 0){
					this.$store.state.payResult = '支付成功'
					//支付状态
					this.$store.state.payStatus = true
					//支付成功后发短信
		           	this.$http.post(this.$store.state.accountHttp+"/jinghan-account/api/user/sendSmsCodeByMerchant",
						JSON.stringify({"reqId":1,
										"param":{
											"phone":this.$store.state.hasPhoneNumber,
											"merchantId":this.$store.state.merchantId,
											"type":1,
											"childType":112,
											//短信的内容
											"context":'您的取餐码是'+this.$store.state.serialNumber
										}
									})
					,{emulateJSON:true})
					.then(function(res){
						console.log(res)
					})
					//重新加载数据
					loadAgain(this,Vue)
				}
			}	
		}
	}
</script>
<style lang="scss">
	.paySucceed{
		position:relative;
		display: flex;
		flex-direction: column;
		width:100%;
		height:100%;
		.navs{
			display: flex;
			align-content: center;
			justify-content: center;
			p{
				font-size:0.2rem;
			}
		}
		.succeed-view{
			display: flex;
			width:100%;
			flex-direction: column;
			align-items: center;
			p:nth-child(1){
				margin-top:0.38rem;
				img{
					width:1.56rem;
					height:1.27rem;
				}
			}
			p:nth-child(2){
				margin-top:0.3rem;
				span{
					display:flex;
					justify-content: center;
					align-items: center;
					width:1.4rem;
					img{
						width:0.2rem;
						height:0.2rem;
					}
					i{
						margin-left:0.08rem;
						font-style:normal;
						font-size:0.2rem;
					}
				}
			}
		}
		/*去评价按钮*/
		.rating{
			position:absolute;
			bottom:2rem;
			left:20%;
			width:2.2rem;
			height:0.4rem;
			text-align: center;
			line-height:0.4rem;
			font-size:0.2rem;
			color: #fff;
			background: #30BFBE;
			border-radius: 6px;
		}
		/*去打赏按钮*/
		.reward{
			position:absolute;
			bottom:1.2rem;
			left:20%;
			width:2.2rem;
			height:0.4rem;
			text-align: center;
			line-height:0.4rem;
			font-size:0.2rem;
			color: #30BFBE;
			opacity: 0.5;
			border: 2px solid #30BFBE;
			border-radius: 6px;
		}
	}
</style>