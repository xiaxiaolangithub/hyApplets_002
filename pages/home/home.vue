<template>
	<view class="homePage">
		<!-- 底部导航 -->
		<rwj-tabbar></rwj-tabbar>
		<!-- 自定义导航栏 -->

		<view class="page_inner">
			<!-- banner部分 -->
			<banner-page :swiperList="swiperList" @tapSwiper="tapSwiper"></banner-page>
			<!-- 首页卡片 -->
			<view class="active_box">
				<view class="active_box_left" @tap='goShop'>
					<view class="title">{{returnText(shopData.aliasName, 12)}}</view>
					<view class="title_text">
						<image class="position_icon" mode="widthFix" :src="realmImgTwo('shopHome/position.png')"></image>
						{{returnText(shopData.address, 15)}}
					</view>
				</view>
				<view class="active_box_right" @tap='exclusive'>
					<image class="phone" mode="widthFix" :src="realmImgTwo('shopHome/phone.png')"></image>
					<view class="title_text">
						一键呼叫专属服务
					</view>
				</view>
			</view>
			<view class="fun_section">
				<view class="list" v-for="(item, index) in funData" :key="index" @tap="tapFun(index)">
					<image :src="item.url" mode="widthFix" class="img"></image>
					<view class="fun_text">{{item.title}}</view>
				</view>
			</view>

			<view class="exclusive_service_team">
				<view class="service_team_title">
					<text>服务团队</text>为您提供专业的汽车全流程服务。
				</view>
				<view class="service_team_main">
					<scroll-view class="scroll-view_H service_team_main_menu" scroll-x="true">
						<view :class="{active : active == item.key}" :key="item.key" v-for="(item) in menuList" @tap="clickMenu(item.key,item.name)">
							<text>{{ item.name }}</text>
						</view>
					</scroll-view>
					<view class="service_team_data" scroll-y="true">
						<view class="service_people" :key="index" v-for="(list,index) in showExclusiveList" @tap="goExclusive()">
							<image class="bg" :src="list.url" mode="widthFix" @tap="lookImg(index)"></image>
							<view class="service_people_text">
								<text>
									<text>{{ list.name }}</text>{{ list.user }}
								</text>
								<text>{{ (list.phone).replace(/(^\d{3}|\d{4}\B)/g,"$1 ") }}</text>
							</view>
							<image @tap.stop="callPerson(list.phone)" class="phone" mode="widthFix" :src="realmImgTwo('shopHome/phone.png')"></image>
						</view>
						<!-- 加载更多多、无更多数据 -->
						<!-- <uni-load-more iconType="snow" :iconSize="30" :status="status" /> -->
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import bannerPage from '@/components/banner-page.vue'
	import {
		goTaBar,
		goPages
	} from '@/utils/request.js'
	export default {
		components: {
			bannerPage
		},
		data() {
			return {
				// banner数据
				swiperList: [
					this.realmImgTwo('shopHome/zixun-banner.png'),
				],
				// 保养、洗车、领券中心、新车列表、异业联盟
				funData: [{
						url: this.realmImgTwo('shopHome/box-baoyang.png'),
						title: '预约保养'
					},
					{
						url: this.realmImgTwo('shopHome/box-jiuyuan.png'),
						title: '道路救援'
					},
					{
						url: this.realmImgTwo('shopHome/box-baoxian.png'),
						title: '保值服务'
					},
					{
						url: this.realmImgTwo('shopHome/box-huodong.png'),
						title: '热门活动'
					},
					{
						url: this.realmImgTwo('shopHome/box-dangan.png'),
						title: '爱车档案'
					},
					{
						url: this.realmImgTwo('shopHome/box-yhq.png'),
						title: '优惠券'
					},
					{
						url: this.realmImgTwo('shopHome/box-qiandao.png'),
						title: '签到福利'
					},
					{
						url: this.realmImgTwo('shopHome/box-yylm.png'),
						title: '异业联盟'
					},
				],
				// 菜单
				menuList: [],
				// 名片数据
				exclusiveList: [],
				showExclusiveList: [],
				// 上拉加载更多数据
				status: 'more',
				// 总页数
				total: 2,
				active: '',
				shopData: {},
			}
		},
		//必须在页面加 onPageScroll(e){} ，才能滑动显示背景
		onPageScroll(e) {
			this.scrollData = e;
		},
		computed: {
			hasLogin() {
				return this.$store.state.hasLogin
			},
		},
		onShareAppMessage(res) {
			return {
				title: this.shopData.aliasName,
			}
		},
		onShareTimeline() {
			return {
				title: this.shopData.aliasName,
				url: "/pages/home/home",
			}
		},
		onShow() {
			this.getShopInfo();
			this.getPositionList();
			this.clickMenu(0, '全部');
			//获取店铺活动
			this.getActivity();
		},
		onPullDownRefresh() {
			this.getShopInfo();
			this.getPositionList();
			this.clickMenu(0, '全部');
			//获取店铺活动
			this.getActivity();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 500);
		},
		methods: {
			getShopInfo() {
				this.$http({
					url: `${this.$apis.shopInfo}?appId=${this.$store.state.appId}`,
					method: 'GET',
					success: ((res) => {
						this.shopData = res.data;
						uni.setNavigationBarTitle({
							title: this.shopData.aliasName
						})
					})
				})
			},
			// 查看服务人员大图
			lookImg(index) {
				/* let arr = this.showExclusiveList.map(ele => ele.url)
				uni.previewImage({
				    current: index, 
				    urls: arr
				}) */
			},
			// 获取用户配置活动
			getActivity() {
				this.$http({
					url: this.$apis.advertisementList,
					method: 'POST',
					data: {
						appId: this.$store.state.appId, //  小程序appId
						position: 1 //  广告位置：1 首页
					},
					success: ((res) => {
						if (res.data.length > 0) {
							this.swiperList = res.data;
						} else {
							this.swiperList = [{
								img: this.realmImgTwo('shopHome/zixun-banner.png')
							}]
						}

					})
				})
			},
			// 去登录页面
			goLogin() {
				goPages('login')
			},
			// 点击banner 图片
			tapSwiper(data) {
				if (data.type == 2) {
					//跳转新车
					uni.navigateTo({
						url: '/pagesA/pages/newCar/carDetail?modelId=' + data.jumpContent
					})
				} else if (data.type == 3) {
					uni.navigateTo({
						url: '/pagesA/pages/activity/detail?id=' + data.jumpContent
					})
				}
			},
			//  保养、洗车、领券中心、新车列表、异业联盟
			tapFun(index) {
				switch (index) {
					case 0:
						// // 预约保养
						// if (this.shopData.rescuePhone) {
						// 	uni.showModal({
						// 		title: '提示',
						// 		content: `是否拨打预约保养电话: ${this.shopData.reservationPhone}`,
						// 		cancelColor: '#979CA7',
						// 		confirmColor: '#3377FF',
						// 		cancelText: '取消',
						// 		confirmText: '拨打',
						// 		success: (res) => {
						// 			if (res.confirm) {
						// 				uni.makePhoneCall({
						// 					phoneNumber: `${this.shopData.reservationPhone}` //仅为示例
						// 				});
						// 			} else if (res.cancel) {}
						// 		}
						// 	});
						// } else {
						// 	uni.showToast({
						// 		title: '抱歉，暂无预约保养电话！',
						// 		icon: 'none'
						// 	});
						// }
						if (!this.hasLogin) {
							this.goLogin();
							return false;
						}
						uni.navigateTo({
							url: '/pagesA/pages/reserve/selectMaintain'
						})
						break;
					case 1:
						// 道路救援
						if (this.shopData.rescuePhone) {
							uni.showModal({
								title: '提示',
								content: `是否拨打救援电话: ${this.shopData.rescuePhone}`,
								cancelColor: '#979CA7',
								confirmColor: '#3377FF',
								cancelText: '取消',
								confirmText: '马上拨打',
								success: (res) => {
									if (res.confirm) {
										uni.makePhoneCall({
											phoneNumber: `${this.shopData.rescuePhone}` //仅为示例
										});
									} else if (res.cancel) {}
								}
							});
						} else {
							uni.showToast({
								title: '抱歉，暂无救援电话！',
								icon: 'none'
							});
						}
						break;
					case 2:
						// 保险保障
						if (!this.hasLogin) {
							this.goLogin();
							return false;
						}
						uni.navigateTo({
							url: '/pagesA/pages/shop/insurance/index'
						})
						break;
					case 3:
						if (!this.hasLogin) {
							this.goLogin();
							return false;
						}
						// 热门活动
						uni.navigateTo({
							url: '/pagesA/pages/activity/index'
						})
						break;
					case 4:
						if (!this.hasLogin) {
							this.goLogin();
							return false;
						}
						// 爱车档案
						goPages('carDossier')
						break;
					case 5:
						if (!this.hasLogin) {
							this.goLogin();
							return false;
						}
						// 优惠券
						goPages('cardBag');
						break;
					case 6:
						// 签到福利
						if (!this.hasLogin) {
							this.goLogin();
							return false;
						}
						goPages('integral');
						break;
					case 7:
						// 异业联盟
						uni.showToast({
							title: '异业联盟，待开发...',
							icon: 'none'
						});
						return false;
						goPages('pointsMall');
						break;
				}
			},
			// 拨打电话
			callPerson(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			// 去聊天页面
			goExclusive(list) {},
			// 服务团队菜单筛选
			clickMenu(key, name) {
				this.getStaffList(name);
				this.active = key;
			},
			// 拨打道路救援电话
			callPhone() {
				this.$http({
					url: this.$apis.getRescuePhone,
					method: 'GET',
					success: ((response) => {
						this.rescuePhone = response.data;
						if (response.data && response.data !== '') {
							uni.showModal({
								title: '提示',
								content: `是否拨打救援电话: ${this.rescuePhone}`,
								cancelColor: '#979CA7',
								confirmColor: '#3377FF',
								cancelText: '取消',
								confirmText: '马上拨打',
								success: (res) => {
									if (res.confirm) {
										uni.makePhoneCall({
											phoneNumber: `${this.rescuePhone}` //仅为示例
										});
									} else if (res.cancel) {}
								}
							});
							return false;
						}
						uni.showToast({
							title: '抱歉，暂无救援电话！',
							icon: 'none'
						});
					})
				})
			},
			// 获取职位列表
			getPositionList() {
				this.$http({
					url: `${this.$apis.staffListPosition}?appId=${this.$store.state.appId}`,
					method: 'GET',
					success: ((res) => {
						let arrList = [];
						res.data.forEach((item, index) => {
							arrList.push({
								name: item,
								key: index,
							})
						})
						this.menuList = arrList;
					})
				})
			},
			//获取人员列表
			getStaffList(name) {
				this.$http({
					url: this.$apis.staffListDS,
					data: {
						"current": 1, //	页码 -   必传
						"size": 100, //	每页条数	-	非必传，不传默认10条
						"appId": this.$store.state.appId, //  小程序appid -   必传
						"position": name //  职位
					},
					method: 'POST',
					success: ((res) => {
						let arrList = [];
						res.data.forEach((item, index) => {
							arrList.push({
								url: item.img || this.realmImg('exclusive/header_url.png'),
								name: item.name,
								user: item.position,
								phone: item.phone,
								id: item.id
							})
						})
						this.showExclusiveList = arrList;
					})
				})
			},
			exclusive() {
				if (this.shopData.servicePhone) {
					uni.makePhoneCall({
						phoneNumber: `${this.shopData.servicePhone}` //仅为示例
					});
				} else {
					uni.showToast({
						title: '抱歉，暂无专属服务电话！',
						icon: 'none'
					});
				}
			},
			goShop() {
				uni.openLocation({
					latitude: this.shopData.lat, //要去的纬度-地址       
					longitude: this.shopData.lng, //要去的经度-地址
					name: this.shopData.address, //地址名称
					address: this.shopData.address, //详细地址名称
					success: function() {},
					fail: function(error) {}
				});
			},
			returnText(text, num) {
				let text1 = String(text);
				if (text1.length > num) {
					return text1.slice(0, num) + '...'
				} else {
					return text1;
				}
			}
		}
	}
</script>


<style>
	page {
		background: #ffffff;
	}
</style>
