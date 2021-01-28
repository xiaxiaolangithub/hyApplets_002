<template>
	<view class="orderDetailPage">
		<view class="top_box" :class="topClass">
			<!-- 自定义导航栏 -->
			<uni-nav-bar :fixed="true" background-color="transparent"
			 leftIcon="arrowleft" @clickLeft="goBack"
			 :status-bar="true" color="#fff" class="interBar" :title="title"></uni-nav-bar>
			 
			<view class="tip" v-if="road==='已完成'">
				<image :src="realmImg('orderDetail/hasStar.png')" class="icon"></image>
				<view class="right">已到店使用，</br>欢迎您下次光临</view>
			</view>
			<view class="hasPay_tip" v-if="road==='已支付'" @tap="goShop">
				<view class="top">
					<image :src="realmImg('orderDetail/payed_icon.png')" class="icon"></image>
					已支付，待到店使用
				</view>
				<view class="address">
					<image :src="realmImg('orderDetail/address_icon.png')" class="address_icon"></image>
					{{shopData.address}}
				</view>
			</view>
			<view class="noPay_tip noPay_tip_order" v-if="road==='待付款'">
				<view class="right">
					<image :src="realmImg('orderDetail/noPay_icon.png')" class="icon"></image>
					等待您付款</br>
				</view>
				<view class="surplus" v-if="Number(remainMin)>0">剩{{remainHour}}小时{{remainMin}}分自动关闭</view>
			</view>
			<view class="noPay_tip" v-if="road==='商品详情'">
				<view class="right">
					<image :src="realmImg('orderDetail/goodsPay_icon.png')" class="icon"></image>
					请确认订单内容
				</view>
			</view>
			<view class="tip cancel_tip" v-if="road==='已取消'">
				<view class="right">
					<image :src="realmImg('orderDetail/cancelled_icon.png')" class="icon"></image>
					订单已取消
				</view>
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="goods">
			<view class="info" @tap="toGoodsDetail">
				<image :src="goods.productMainPic" class="img"></image>
				<view class="right">
					<view class="name">{{goods.productName}}</view>
					<view class="middle">
						<view class="attr">
							<text class="text" v-for="(item, index) in goods.productAttr" :key="index">{{item}}</text>
						</view>
						x{{goods.productQuantity}}
					</view>
					<view class="bottom">
						<text class="yuan">¥</text>
						{{goods.productSalePrice}}
					</view>
				</view>
			</view>
			<view class="price">
				<view class="total">
					<text class="text">商品总额</text>
					<view class="price_num">
						<text class="yuan">¥</text>
						{{order.totalAmount}}
					</view>
				</view>
				<view class="pay total">
					<text class="text">{{title==='订单详情'?'实付金额':'需付款'}}</text>
					<view class="price_num">
						<text class="yuan">¥</text>
						{{order.payAmount}}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 占位 -->
		<view class="place"></view>
		
		<!-- 订单信息 -->
		<view class="order" v-if="road!=='商品详情'">
			<view class="list">订单编号: {{order.orderSn}}</view>
			<view class="list">提交时间: {{order.createTime}}</view>
			<view class="list" v-show="road!=='待付款'&&road!=='已取消'">支付时间: {{order.payTime}}</view>
			<view class="bottom">
				<view class="refund" hover-class="hover" v-if="road==='待付款'" @tap="cancelReady">取消订单</view>
				<!-- <view class="refund" v-if="road==='已支付'">申请退款</view> -->
				<view class="kefu" v-if="road!=='商品详情'" hover-class="hover" @tap="tapPhone">
					<image :src="realmImgTwo('goods/kefu.png')" class="kefu_icon" mode="widthFix"></image>
					咨询
				</view>
			</view>
		</view>
		
		<button class="goPay" @click="$noMultipleClicks(payReady)" v-if="road==='待付款'||road==='商品详情'"
		 hover-class="handle_hover" :class="road==='待付款'? 'waitHandle':''" v-preventReClick>
			{{road==='商品详情'? '提交订单 ':'微信支付'}}
		</button>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default{
		components: {
			uniNavBar,
		},
		data() {
			return { 
				title: '',
				noClick:true,
				road: '已取消',
				backImg: this.realmImg('user/my-top-bg.png'),
				topClass: 'cancelled',
				type: '',
				// 商品信息
				goods: {
					productMainPic: this.realmImg('shopHome/p6.png'),
					productName: '人体工学腰垫 汽车腰靠腰枕 护腰舒适全棉 上班族必备神器',
					productAttr: ['黄色', '长款'],
					productQuantity: 2,
					productSalePrice: 449,
				},
				// 订单信息
				order: {
					orderSn: '',				// 订单编号
					createTime: '',				// 提交时间
					payTime: '',				// 支付时间(非已支付为null)
					totalAmount: '',			// 总额
					payAmount:'',				// 支付金额
				},
				// 待付款订单列表里来的展示剩余几小时自动关闭
				remainHour: 23,
				// 待付款订单列表里来的展示剩余几分钟自动关闭
				remainMin: 59,
				// 已支付有4S店地址信息
				shopData: {},
				// 请求编号(请求编号接口获取)
				reqSn: '',
				// 支付需要的参数，包含
				payParams: {},
				// 商品详情需要的商品信息
				e: {},
				// 返回列表页面是否需要更新订单列表
				isUpdate: false,
			}
		},
		onLoad(e) {
			this.type = e.type;
			if(this.type !== '商品详情') {
				this.order.orderSn = e.orderSn;
			} else {
				// 商品详情需要的商品信息
				this.e = e;
			}
			this.switchType();
		},
		methods:{
			// 判断是从哪个页面进来的
			switchType() {
				switch(this.type) {
					case '商品详情':
						this.topClass = 'goodsPay';
						this.title = '订单确认';
						this.road = '商品详情';
						// 把商品详情过来参数渲染到当前页面
						this.showGoodsDetail();
						this.getReqSn();
						break;
					case '待付款':
						this.topClass = 'noPay';
						this.title = '订单确认';
						this.road = '待付款';
						this.getOrderDetail();
						break;
					case '已支付':
						this.topClass = 'payed';
						this.title = '订单详情';
						this.road = '已支付';
						this.shopData = this.$store.state.shopData;
						this.getOrderDetail();
						break;
					case '已完成':
						this.topClass = 'hasPay';
						this.title = '订单详情';
						this.road = '已完成';
						this.getOrderDetail();
						break;
					case '已取消':
						this.topClass = 'cancelled';
						this.title = '订单详情';
						this.road = '已取消';
						this.getOrderDetail();
						break;
					
				}
			},
			// 把商品详情过来参数渲染到当前页面
			showGoodsDetail() {
				let goods = JSON.parse(this.e.goods);
				this.goods =  {
					productMainPic: goods.productMainPic,
					productName: goods.productName,
					productAttr: goods.productAttr.map(ele => ele.value),
					productQuantity: goods.productQuantity,
					productSalePrice: goods.productSalePrice,
					id: goods.id,								// 商品ID
					specGroupId: goods.specGroupId,				// 规格组ID
				}
				this.order = {
					totalAmount: goods.totalAmount,			// 总额
					payAmount:goods.payAmount,				// 支付金额
				}
			},
			// 商品详情过来的得到下单编号
			getReqSn() {
				this.$http({
					url: this.$apis.getReqSn,
					method: 'GET',
					success: ((res) => {
						this.reqSn = res.data;
					})
				})
			},
			// 获取请求下单编号
			payReady() {
				if(this.road === '待付款') {
					// 待付款订单直接拿订单号去支付
					this.waitOrderPay();
				} else {
					// 商品详情来的先下单，再付款
					this.createOrder();
				}
				
			},
			// 待付款订单直接拿订单号去支付
			waitOrderPay() {
				this.$http({
					url: `${this.$apis.waitOrderPay}?orderSn=${this.order.orderSn}`,
					method: 'GET',
					success: ((res) => {
						this.payParams = res.data;
						this.goPay();
					})
				})
			},
			// 商品详情来的先下单
			createOrder() {
				let data = {
					reqSn: this.reqSn,								// 请求编号(请求编号接口获取)
					specGroupId: this.goods.specGroupId,			// 规格组id
					productQuantity : this.goods.productQuantity	// 购买数量
				}
				this.$http({
					url: this.$apis.createOrder,
					method: 'POST',
					data,
					success: ((res) => {
						this.payParams = res.data;
						this.order.orderSn = res.data.number;
						this.goPay();
					})
				})
			},
			// 返回前一个页面
			goBack() {
				console.log(true, '返回到订单页面')
				
				uni.navigateBack({
					delta:1
				})
			},
			// 待付款订单取消订单
			cancelReady() {
				uni.showModal({
					title: '取消订单',
					content: `你即将取消该订单`,
					cancelColor: '#141E34',
					confirmColor: '#3377FF',
					cancelText: '确认',
					confirmText: '返回',
					success: (res) => {
						if (res.confirm) {
							
						} else if (res.cancel) {
							// 取消订单接口请求
							this.cancelOrder();
						}
					}
				});
			},
			// 取消订单
			cancelOrder() {
				this.$http({
					url: `${this.$apis.cancelOrder}?orderSn=${this.order.orderSn}`,
					method: 'GET',
					success: ((res) => {
						if(res.code === 1) {
							uni.showToast({
								title: '取消成功。',
								icon: 'none',
								duration: 1500
							});
							this.type = '已取消';
							this.switchType();
							// 及时告知全局 funUpdate ,我已经更新 isUpdate 值为 true 了。
							uni.$emit("funUpdate", {
								isUpdate: true
							});
						}
					})
				})
			},
			// 待付款订单去微信支付
			goPay() {
				// https://blog.csdn.net/weixin_42164539/article/details/106551541
				// https://blog.csdn.net/z1010017573/article/details/105864415
				
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: this.payParams.timeStamp,
					nonceStr: this.payParams.nonceStr,
					package: this.payParams.packageValue,
					signType: this.payParams.signType,
					paySign: this.payParams.paySign,
					success: (res)=> {
						uni.showToast({
							title: "支付成功",
							duration: 1500,
							icon: 'none',
						});
						this.type = '已支付';
						uni.$emit("funUpdate", {
							isUpdate: true
						});
						this.switchType();
					},
					fail:(err) =>{
						uni.showToast({
							title: "支付失败",
							duration: 1500,
							icon: 'none',
						});
						if(this.road === '商品详情') {
							this.type = '待付款';
							this.switchType();
						}
					}
				});
			},
			// 得到订单详情
			getOrderDetail() {
				this.$http({
					url: `${this.$apis.orderDetail}?orderSn=${this.order.orderSn}`,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.order.createTime = result.createTime;				// 提交时间
						this.order.payAmount = result.payAmount;				// 支付金额 
						this.order.totalAmount = result.totalAmount;			// 总额
						if(this.road === '已支付' || this.road === '已完成' ) {
							this.order.payTime = result.payTime;				// 支付时间(非已支付为null)
						}
						if(this.road === '待付款') {
							this.remainHour = result.remainHour;
							this.remainMin = result.remainMin;
						}
						let productList = result.productList[0];
						this.goods.productMainPic = productList.productMainPic;
						this.goods.productName = productList.productName;
						this.goods.productAttr = productList.productAttrList;
						this.goods.productQuantity = productList.productQuantity;
						this.goods.productSalePrice = productList.productSalePrice;
						this.goods.id = productList.productId;
					})
				})
			},
			// 咨询客服
			tapPhone() {
				uni.showModal({
					title: '提示',
					content: `是否拨打客服电话: ${this.$store.state.shopData.servicePhone}`,
					cancelColor: '#141E34',
					confirmColor: '#3377FF',
					cancelText: '取消',
					confirmText: '拨打',
					success: (res) => {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: `${this.$store.state.shopData.servicePhone}`
							});
						} else if (res.cancel) {}
					}
				});
			},
			// 已支付订单详情 去门店导航
			goShop() {
				uni.openLocation({
					latitude: this.shopData.lat, 		// 要去的纬度-地址       
					longitude: this.shopData.lng, 		// 要去的经度-地址
					name: this.shopData.address, 		// 地址名称
					address: this.shopData.address, 	// 详细地址名称
					success: function() {},
					fail: function(error) {}
				});
			},
			// 去商品详情
			toGoodsDetail() {
				// 商品详情来的订单确认不用跳转到商品详情
				if(this.road !== '商品详情') {
					uni.navigateTo({
						url: `/pagesA/pages/goods/goodDetail?id=${this.goods.id}`
					})
				}
			},
 		}
	}
</script>
