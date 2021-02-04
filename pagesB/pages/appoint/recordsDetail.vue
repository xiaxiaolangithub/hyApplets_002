<template>
	<view class="apponitDetailPage">

		<view class="page_inner">
			<!-- 订单信息 -->
			<view class="basic">
				<view class="date">预约时间:{{date}}</view>
				<view class="status">{{status}}</view>
			</view>
			<!-- 门店地址 -->
			<view class="address">
				<view class="left">
					<view class="goStore">前往门店</view>
					<view class="store_name">{{storeName}}</view>
					<view class="store_address">{{storeAdress}}</view>
				</view>
				<view class="right" @tap="toStore">
					<view class="address_icon">
						<image :src="realmImg('orderDetail/adress.png')" mode="widthFix"></image>
					</view>
					<text class="go_to">导航前往</text>
				</view>
			</view>

			<!-- 订单商品信息 -->
			<view class="order_box">
				<view class="top">预约单号 {{orderNum}}</view>
				<view class="goods">
					<view class="left">
						<!-- 保养 -->
						<image v-if="getData.type == 'MAINTAIN'" :src="realmImg('order/order_maintain.png')" mode="widthFix"></image>
						<!-- 洗车 -->
						<image v-else-if="getData.type == 'WASH'" :src="realmImg('order/order_wash.png')" mode="widthFix"></image>
						<!-- 专属服务 -->
						<image v-else-if="getData.type == 'DS'" :src="realmImg('order/order_ds.png')" mode="widthFix"></image>
						<!-- 商品 -->
						<image v-else mode="widthFix"></image>
					</view>
					<view class="right">
						<view v-if="getData.type == 'MAINTAIN'" class="name">{{goodName}}</view>
						<view v-if="getData.type == 'WASH'" class="name">常规洗车</view>
						<view v-if="getData.type == 'DS'" class="name">{{getData.item}}</view>
					</view>
				</view>
				<view class="detail" v-for="(item,index) in getData.detail" :key='index'>
					{{ item }}
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="other_info">
				<view class="top">订单信息</view>
				<view class="other_list">
					<view class="item">
						<view class="title">预约单号</view>
						<text>{{orderNum}}</text>
					</view>
					<view class="item">
						<view class="title">下单时间</view>
						<text>{{postTime}}</text>
					</view>
					<view class="item">
						<view class="title">预约到店时间</view>
						<text>{{date}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 客服、电话联系 -->
		<view class="page_footer">
			<view class="left">
				<view class="kefu">
					<image :src="realmImg('orderDetail/kefu.png')" mode="widthFix"></image>
					<button class="contact" open-type='contact'>在线客服</button>
				</view>
				<view class="kefu">
					<image :src="realmImg('orderDetail/phone.png')" mode="widthFix"></image>
					<text @tap="callPhone">电话联系</text>
				</view>
			</view>
			<view class="right">
				<!-- 预约订单详情有 取消预约和编辑 -->
				<view class="cancel" v-if="getData.status == 'WAIT_CONSUME'" @tap="cancelOrder">取消预约</view>
				<view class="cancel" v-if="getData.status == 'COMPLETED' || getData.status == 'CANCELED'" @tap="deleteOrder">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 当前详情属性哪种 待预约、待付款、已完成
				type: 0,
				// 订单当前基本状态
				basicText: '',
				// 订单简单状态说明
				status: '',
				// 当前订单时间
				date: '',
				// 门店地址
				storeAdress: '',
				// 门店名称
				storeName: '',
				// 订单号
				orderNum: '',
				storeImg: this.realmImg('orderDetail/adress.png'),
				// 订单商品图
				imgUrl: this.realmImg('orderDetail/goods.png'),
				// 商品名
				goodName: '',
				// 商品价格
				goodPrice: '',
				// 商品数量 
				goodNum: '1',
				// 优惠券金额
				couponPrice: 100,
				// 下单时间
				orderTime: '',
				// 预约到店时间         
				arrivalTime: '',
				//页码
				current: null,
				appId: '',
				getData: [],
				postTime: '',
				lng: null,
				lat: null,
				phone: '',
			}
		},
		onLoad(option) {
			// 去判断当前页面导航标题
			if (option.type) {
				this.type = Number(option.type); //预约ID
			} else {
				this.type = Number(option.id);
			}
			this.current = Number(option.current);

			let accountInfo = wx.getAccountInfoSync();
			this.appId = accountInfo.miniProgram.appId;

			this.getShopAddress(); // 获取当前预约信息
		},
		methods: {
			// 获取当前预约信息
			getShopAddress() {
				this.$http({
					url: this.$apis.appointmentDetail + '?id=' + this.type,
					method: 'GET',
					success: ((res) => {
						this.getData = res.data;
						if (res.data.type == 'MAINTAIN') {
							this.date =
								`${res.data.reachTime.substring(0,10)} ${res.data.reachStartTime}-${res.data.reachEndTime}`;
						} else {
							this.date = res.data.reachTime;
						}
						this.status = this.retType(res.data.status);
						this.orderNum = res.data.orderSn;
						this.goodName = res.data.item;
						this.goodNum = res.data.detail.length > 0 ? res.data.detail.length : 1;
						this.storeName = res.data.name;
						this.storeAdress = res.data.address;
						if (res.data.image !== []) {
							this.store = res.data.image;
						}
						this.postTime = res.data.createTime;
						this.lng = res.data.lng;
						this.lat = res.data.lat;
						this.phone = res.data.reservationPhone;
					})
				});
			},
			//判断类型
			retType(type) {
				switch (type) {
					case 'MAINTAIN':
						return '保养'
						break;
					case 'WASH':
						return '洗车'
						break;
					case 'DS':
						return '专属服务'
						break;
					case 'PRODUCT':
						return '商品'
						break;
					case 'WAIT_CONSUME':
						return '待消费'
						break;
					case 'COMPLETED':
						return '已完成'
						break;
					case 'CANCELED':
						return '已取消'
						break;
					case 'TIMEOUT':
						return '已超时'
						break;
				}
			},
			// 查看更多子商品
			seeMore() {
				this.getData.isShow = !this.getData.isShow;
			},
			// 去判断当前页面导航标题
			// getNavTitle() {
			// 	switch(this.type) {
			// 		case 0:
			// 			this.pageTitle = '待预约订单详情';
			// 			this.basicText = '已成功预约';
			// 			this.status = '待到店消费';
			// 			break;
			// 		case 1:
			// 			this.pageTitle = '待付款订单详情';
			// 			this.basicText = '已成功到店消费';
			// 			this.status = '待付款';
			// 			break;
			// 		case 2:
			// 			this.pageTitle = '已完成订单详情';
			// 			this.basicText = '已成功到店消费';
			// 			this.status = '已完成订单';
			// 			break;
			// 	}
			// },
			// 导航去门店
			toStore() {
				uni.openLocation({
					latitude: this.lat, //要去的纬度-地址       
					longitude: this.lng, //要去的经度-地址
					name: this.storeAdress, //地址名称
					address: this.storeAdress, //详细地址名称
					success: function() {},
					fail: function(error) {}
				});
			},
			// 拨打电话
			callPhone() {
				uni.makePhoneCall({
					phoneNumber: this.phone
				});
			},
			// 取消预约订单
			cancelOrder() {
				uni.showModal({
					title: "",
					content: "确认取消该预约吗？",
					cancelText: "确认",
					cancelColor: "#141E34",
					confirmText: "返回",
					confirmColor: "#3377FF",
					success: (res) => {
						if (!res.confirm) {
							this.$http({
								url: this.$apis.appointmentCancel + '?id=' + this.type + "&type=" + this.getData.type,
								method: 'GET',
								success: ((res) => {
									uni.showToast({
										title: '取消预约成功'
									});
									this.getShopAddress();
								})
							})
						}
					},
				});
			},
			// 编辑预约订单
			editOrder() {
				uni.showToast({
					title: '编辑预约订单，待开发...',
					icon: 'none'
				})
			},
			// 删除订单
			deleteOrder(){
				uni.showModal({
					title: "",
					content: "确认删除该预约吗？",
					cancelText: "确认",
					cancelColor: "#141E34",
					confirmText: "返回",
					confirmColor: "#3377FF",
					success: (res) => {
						if (!res.confirm) {
							this.$http({
								url: this.$apis.appointmentDelete + '?id=' + this.type,
								method: 'GET',
								success: ((res) => {
									uni.showToast({
										title: '删除预约成功'
									});
									setTimeout(()=>{
										uni.redirectTo({
											url: '/pagesB/pages/appoint/records'
										});
									},1000)
								})
							})
						}
					},
				});
			},
			// 支付待付款订单
			payOrder() {
				uni.showToast({
					title: '支付成功！'
				})
			}
		}
	}
</script>

<style>
	page {
		background: #F7F7F7;
	}
</style>
