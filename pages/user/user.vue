<template>
	<view class="userPage">
		<view class="login_section">
			<!-- 自定义导航栏 -->
			<uni-nav-bar :fixed="true" background-color="transparent" :status-bar="true" color="#333333" class="interBar" title="个人中心"></uni-nav-bar>

			<view class="user_info_box">
				<image class="portrait" @tap="settingUser" :src="userinfo.avatarUrl || realmImg('user/header.png')"></image>
				<view class="go_login" v-if="!hasLogin" @tap="goLogin">
					立即登录
					<text class="iconfont icon-xiangyoujiantou"></text>
				</view>
				<view class="username" v-else>{{userinfo.nickName}}</view>
			</view>
			<view class="coupon_integral">
				<view class="left" @tap="goCoupon">
					<image class="image2" mode="widthFix" :src="realmImgTwo('user/coupon.png')"></image>
					<view>优惠券</view>
				</view>
				<view class="right" @tap="goIntegral">
					<image class="image2" mode="widthFix" :src="realmImgTwo('user/integral.png')"></image>
					<view>积分</view>
				</view>
			</view>
		</view>

		<!-- 我的爱车 -->
		<view class="car_section">
			<view class="title">我的爱车</view>
			<view class="car_list">
				<view class="list" v-for="(car, index) in carList" :key="index" @tap=" tapCar(index)">
					<image class="image3" mode="widthFix" :src="car.url"></image>
					<view>{{car.title}}</view>
				</view>
			</view>
		</view>

		<!-- 我的订单 -->
		<view class="car_section" style="margin-top: 30rpx;">
			<view class="car_top" @tap="tapAllOrder">
				<view class="title">我的订单</view>
				<text class="all_btn">
					全部订单
					<text class="iconfont icon-xiangyoujiantou"></text>
				</text>
			</view>
			<view class="order_list">
				<view class="item_list" v-for="(order, index) in orderList" :key="order" @tap="goList(order)">
					<image :src="order.url" mode="widthFix"></image>
					<view class="order_title">{{order.title}}</view>
					<view class="num" v-if="index===0&&waitPayOrderCount>0">{{waitPayOrderCount}}</view>
				</view>
			</view>
		</view>

		<!-- 账号信息 -->
		<view class="feedback">
			<view class="feedback_inner" @tap="settingUser">
				<view class="feedback_text">账号信息</view>
				<text class="iconfont icon-xiangyoujiantou"></text>
			</view>
		</view>



	</view>
</template>
<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import {
		goTaBar,
		goPages
	} from '@/utils/request.js'
	import {
		checkValue
	} from '@/static/js/tool.js'
	export default {
		components: {
			uniNavBar,
		},
		data() {
			return {
				carList: [ // 爱车档案、预约记录
					{
						url: this.realmImgTwo('user/car_01.png'),
						title: '爱车档案'
					},
					{
						url: this.realmImgTwo('user/yuyue-bg.png'),
						title: '预约记录'
					},
					{
						url: this.realmImgTwo('user/huodong-bg.png'),
						title: '我的活动'
					},
				],
				orderList: [ // 订单数据
					{
						url: this.realmImgTwo('user/order-pay.png'),
						title: '待付款'
					},
					{
						url: this.realmImgTwo('user/order-complete.png'),
						title: '已支付'
					},
					{
						url: this.realmImgTwo('user/hasPayOrder.png'),
						title: '已完成'
					},
					//  {
					// 	url: this.realmImgTwo('user/order-tuikuan.png'),
					// 	title: '退款'
					// }, 
				],
				waitPayOrderCount: 0,
			}
		},
		computed: {
			userinfo() {
				return this.$store.state.userinfo
			},
			hasLogin() {
				return this.$store.state.hasLogin
			},
		},
		onShow() {
			// 已经登录授权的情况下
			if (this.hasLogin) {
				// 去请求发放优惠券信息
				this.getDirectVoucher();
				// 请求用户订单数量信息
				this.getMineInfo();
			}
		},
		methods: {
			// 如果已经登录，去请求发放优惠券信息
			getDirectVoucher() {
				this.$http({
					url: this.$apis.getDirectVoucher,
					method: 'GET',
					success: ((res) => {
						if (res.data > 0) {
							uni.showModal({
								title: '优惠券到账通知',
								content: `您已收到${res.data}张优惠券，您可前往【卡券】查看使用`,
								cancelText: '知道了',
								confirmText: '前往查看',
								confirmColor: '#3377FF',
								cancelColor: '#979CA7',
								success: (res) => {
									if (res.confirm) {
										uni.$emit("handleFun", {
											navIndex: 0
										});
										goPages('cardBag')
									} else if (res.cancel) {}
								}
							});
						}
					})
				})
			},
			// 如果登录的情况下，请求用户订单待付款数量信息
			getMineInfo() {
				this.$http({
					url: this.$apis.getMineInfo,
					method: 'GET',
					success: ((res) => {
						this.waitPayOrderCount = Number(res.data.waitPayOrderCount);
					}),
				})
			},
			// 去登录页面
			goLogin() {
				goPages('login')
			},
			// 去查看我所有的订单
			tapAllOrder() {
				if (!this.hasLogin) {
					this.goLogin();
					return false;
				}
				// 我的订单
				goPages('orderList')
			},
			// 去对应订单
			goList(item) {
				if (!this.hasLogin) {
					this.goLogin();
					return false;
				}
				uni.navigateTo({
					url: `/pagesB/pages/order/orderList?status=${item.title}`
				})
			},
			// 点击 爱车档案、预约记录
			tapCar(index) {
				if (!this.hasLogin) {
					this.goLogin();
					return false;
				}
				switch (index) {
					case 0:
						// 爱车档案
						goPages('carDossier')
						break;
					case 1:
						// 预约记录
						goPages('records')
						break;
				}
			},
			// 个人设置
			settingUser() {
				if (!this.hasLogin) {
					this.goLogin();
					return false;
				}
				uni.navigateTo({
					url: '/pagesB/pages/setting/userSet'
				})
			},
			// 去优惠券页面
			goCoupon() {
				if (!this.hasLogin) {
					this.goLogin();
					return false;
				}
				goPages('cardBag')
			},
			// 去积分页面
			goIntegral() {
				if (!this.hasLogin) {
					this.goLogin();
					return false;
				}
				goPages('integral');
			}
		}
	}
</script>


<style>
	page {
		background-color: #F8F6F9;
	}
</style>
