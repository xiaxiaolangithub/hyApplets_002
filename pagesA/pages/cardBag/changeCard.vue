<template>
	<view class="cardBagPage">
		<view class="card_inner">
			<!-- 卡包状态 -->
			<view class="hearder">
				<view class="hearder_item" v-for="(item,index) in navList" :key="index" @click="bindNav(index)">
					<text class="hearder_text text_grey" :class="[navIndex==index?'active_index':'']">{{item}}</text>
					<view v-if="navIndex==index" class="header_line">
						<image :src="realmImg('cardBag/line.png')"></image>
					</view>
				</view>
			</view>
			
			<!-- 卡包列表 -->
			<view class="card_container">
				<card-part v-if="couponData.length>0" :isSource="isSource" :couponData="couponData" :road="road"
				:tipImg="tipImg" :navIndex="navIndex" :isDetail="false"></card-part>
	
				
				<!-- 数据为空 -->
				<empty-part :isShow="tipsObj.isShow" :url="tipsObj.url" :tips="tipsObj.tips" :leftText="tipsObj.leftText" :middleText="tipsObj.middleText" :rightText="tipsObj.rightText"></empty-part>
				
				
				<!-- 加载更多多、无更多数据 -->
				<uni-load-more v-if="couponData.length>0" :contentText="contentText"  iconType="snow" :iconSize="30" :status="status" />
							
			</view>
		</view>
		<!-- 去领券中心 -->
		<image class="footer_img" :src="realmImg('cardBag/collar.png')" mode="widthFix" @tap="toCollar"></image>
			
	</view>

</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import cardPart from '@/components/card_part.vue'
	import { goTaBar,goPages } from '@/utils/request.js'
	import emptyPart from '@/components/empty_part.vue'
	export default {
		components: {
			uniLoadMore,
			cardPart,
			emptyPart
		},
		data() {
			return {
				road: 'own',
				currentPage: 1,
				totalPages: 0,
				navList: ['有效卡', '即将到期', '失效卡'], 	// 卡包状态
				navIndex: 0,								// 当前选中哪个
				couponData: [],								// 未使用卡数据
				status: '',							// 上拉加载更多数据
				statusCoupon: 'UNUSED',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "-- 没有更多内容了 --"
				},
				tipImg: this.realmImg('cardBag/new_line.png'),		// 券提示图片
				nameClass: 'newName',								// 名称样式
				tipsObj: {
					isShow: false,
					url: this.realmImg('cardBag/noCard.png'),
					tips: '暂时没有可用券',
					leftText: '快去',
					middleText: '领券中心',
					rightText: '看看吧~',
				},
				isPull: false,				// 是否是页面上拉加载
				isSource: '', 		//给组件判断是否是兑换卡包进去的
			}
		},
		watch:{
			navIndex(val, oldVal) {
				switch(val) {
					case 0:
						// 未使用
						this.statusCoupon = 'UNUSED';
						this.nameClass = 'newName';
						break;
					case 1:
						// 即将过期
						this.statusCoupon = 'SOON_EXPIRED';
						this.tipImg = this.realmImg('cardBag/soon_line.png'),		// 券提示图片
						this.nameClass = 'soonName';
						break;
					case 2:
						// 已失效
						this.statusCoupon = 'INVALID';
						this.nameClass = 'invalidName';
						break;
						
				}
				this.currentPage = 1;
				this.getVoucherList();
			}
		},
		computed: {
			hasLogin() {
				return this.$store.state.hasLogin
			},
		},
		onLoad(e) {
			if(!this.hasLogin) {
				goPages('login')
			} else {
				this.getVoucherList();
			}
			this.isSource = e.type;
		},
		onShow() {
			// 监听从个人中心过来的优惠券到账事件
			uni.$on("handleFun", (res) => {
				this.navIndex = Number(res.navIndex);
				this.currentPage = 1;
				this.couponData = [];
				this.getVoucherList();
				// 清除监听
				uni.$off('handleFun');
			})
			
		},
		onPullDownRefresh() {
			this.currentPage = 1;
			this.isPull = true;
			this.getVoucherList();
			setTimeout(()=> {
				uni.stopPullDownRefresh();
			}, 500);
		},
		// 上拉加载
		onReachBottom() {
			this.currentPage++;
			if (this.currentPage <= this.totalPages) {
				this.status = 'loading';
				this.getVoucherList();
			} 
		},
		methods: {
			// 去登录页面
			goLogin() {
				goPages('login')
			},
			// 获取用户卡包
			getVoucherList() {
				this.$http({
					url: this.$apis.customerVoucherList,
					method: 'POST',
					data: {
						status: this.statusCoupon,
						current: this.currentPage,	// 页码
						isGiftCard: true,// 是否为兑换卡列表 - 必传
					},
					success: ((res) => {
						console.log(res.data)
						let result = res.data;
						result.records.forEach(item => {
							item.activeDate = `${item.activeTime.replace(/-/g, '.')}-${item.failureTime.replace(/-/g, '.')} `;
							// 失效券背景用灰色，未使用和即将到期根据券类型来展示背景，未使用：橙色；即将到期：蓝色
							if(this.navIndex !== 2) {
								item.backImg = item.type === 'DEDUCTION' ? this.realmImg('cardBag/new_back.png') : this.realmImg('cardBag/soon_back.png');
							} else {
								item.backImg = this.realmImg('cardBag/invalid_back.png');
							}
							if(item.remainDays !== null && this.navIndex === 1) {
								// 剩余天数，只有即将到期列表展示，如果为0，则为1天内到期
								item.remainDaysTip = item.remainDays === 0 ? `1天内到期` : `${item.remainDays}天后到期`;
							}
							switch(item.status) {
								case 'USED':
									item.statusName = '已使用';
									break;
								case 'EXPIRED':
									item.statusName = '已过期';
									break;
								case 'INVALID':
									item.statusName = '已作废';
									break;
							}
						})
						let sumData = [];
						sumData = this.isPull ? sumData.concat(result.records) : sumData.concat(this.couponData).concat(result.records);
						this.couponData = sumData;
						this.totalPages = Number(result.pages);
						this.isPull = false;
						this.tipsObj.isShow = this.couponData.length  ? false : true;
						this.status = 'noMore'; 
					})
				})
			},
			// 点击卡包状态
			bindNav(index) {
				this.currentPage = 1;
				this.totalPages = 0;
				this.navIndex = index;
				this.isPull = true;
			},
			// 去领券中心页面
			toCollar() {
				if(!this.hasLogin) {
					this.goLogin();
					return false;
				}
				uni.navigateTo({
					url: '/pagesA/pages/cardBag/couponCenter'
				})
			},
		}
	}
</script>


