<template>
	<view class="shopPage">
		<!-- 头部背景图 -->
		<image class="header_img" :src="realmImg('shopHome/header_back.png')" mode="widthFix"></image>
		<!-- 自定义导航栏 -->
		<!-- <hx-navbar :back="false" class="shop_home_navbar" :fixed="true" transparent="auto" :background-color="[[78,132,230],[99,201,238],[190,245,228]]"
		 :pageScroll.sync="scrollData">
			<block slot="left">
				<image @tap="tapClassify" class="classify_icon" :src="realmImg('shopHome/classify.png')" mode="widthFix"></image>
			</block>
			<view class="input_view" @tap="tapSearch">
				<image class="search_icon" :src="realmImg('shopHome/search.png')" mode="widthFix"></image>
				<input class="home_input" type="text" placeholder-class="place_holder" placeholder="搜索" />
			</view>
		</hx-navbar> -->

		<!-- 新写的 -->
		<hx-navbar :back="false" class="shop_home_navbar" :fixed="true" transparent="auto" :background-color="[[78,132,230],[99,201,238],[190,245,228]]"
		 :pageScroll.sync="scrollData">
			<block slot="left"></block>
			<view class="input_view" style="width:100%; font-size: 32rpx;">
				商城
			</view>
		</hx-navbar>

		<!-- 商城无商品 -->
		<empty-part :isShow="!tipsObj.isShow" :url="tipsObj.url" :tips="tipsObj.tips" :leftText="tipsObj.leftText"
		 :middleText="tipsObj.middleText" :rightText="tipsObj.rightText"></empty-part>

		<view class="page_inner" v-if="tipsObj.isShow">
			<!-- 限时促销 -->
			<view class="group_section" v-if="promotionData.length">
				<view class="top" @tap="tapGoodsList('promotion')">
					限时促销
					<view class="all">
						<text class="text">查看全部</text>
						<text class="iconfont icon-xiangyoujiantou"></text>
					</view>
				</view>
				<view class="bottom">
					<view class="good" v-for="(item, index) in promotionData" :key="index" @tap="tapGoodDetail(item)">
						<image :src="item.mainPic" mode="widthFix" class="img"></image>
						<view class="price">
							<text class="now">¥{{item.salePrice}}</text>
							<text class="org">¥{{item.price}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="place" v-if="promotionData.length"></view>
			<!-- 精品推荐 -->
			<view class="quality_section" v-if="qualityData.length">
				<view class="top" @tap="tapGoodsList('quality')">
					精品推荐
					<view class="all">
						<text class="text">查看全部</text>
						<text class="iconfont icon-xiangyoujiantou"></text>
					</view>
				</view>
				<view class="middle">
					<view class="list" v-for="(item, index) in qualityData" :key="index" @tap="tapGoodDetail(item)">
						<image :src="item.mainPic" mode="widthFix" class="img"></image>
						<view class="name">{{item.name}}</view>
						<view class="price">¥{{item.salePrice}}</view>
					</view>
				</view>
				<view class="bottom" @tap="tapChange">
					<image :class="changeClass" class="change_icon" :src="realmImg('shopHome/change.png')" mode="widthFix"></image>
					<text class="exchange">换一批</text>
				</view>
			</view>

			<!-- 底部其他商品展示 -->
			<view class="other_section">
				<view class="list" v-for="(item, index) in otherData" :key="index" @tap="tapGoodDetail(item)">
					<image :src="item.mainPic" mode="widthFix" class="img"></image>
					<view class="bottom">
						<view class="name">{{item.name}}</view>
						<view class="price">¥{{item.salePrice}}</view>
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
	import emptyPart from '@/components/empty_part.vue'
	export default {
		components: {
			bannerPage,
			emptyPart
		},
		data() {
			return {
				scrollData: {},
				// 限时促销
				promotionData: [],
				// 精品推荐
				qualityData: [],
				// 更换精品数据
				isChange: true,
				// 底部其他商品展示
				otherData: [],
				// 换一换图标样式名
				changeClass: 'trans_change',
				// 普通商品总页面
				totalPages: 0,
				// 普通商品当前所在页面
				currentPage: 1,
				// 商城是否有商品
				tipsObj: {
					url: this.realmImg('shopHome/no_shop.png'),
					tips: '暂无商品',
					leftText: '',
					middleText: '',
					rightText: '',
				}
			}
		},
		computed: {
			'tipsObj.isShow'() {
				return this.promotionData.length > 0 || this.qualityData.length > 0 || this.otherData.length > 0
			}
		},
		//必须在页面加 onPageScroll(e){} ，才能滑动显示背景
		onPageScroll(e) {
			this.scrollData = e;
		},
		onShareAppMessage(res) {
			return {
				title: '商城',
			}
		},
		onShareTimeline() {
			return {
				title: '商城',
				url: "/pages/shop/shop",
			}
		},
		onReachBottom() {
			this.currentPage++;
			if (this.currentPage <= this.totalPages) {
				this.getCommonList(this.currentPage, 80, 'COMMON');
			}
		},
		onPullDownRefresh() {
			// 得到精品推荐数据
			this.getRandomRecommend();
			// 得到普通商品数据
			this.getCommonList(1, 80, 'COMMON');
			// 得到限时促销数据
			this.getCommonList(1, 4, 'DISCOUNT');
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 500);
		},
		onShow() {
			// 得到精品推荐数据
			this.getRandomRecommend();
			// 得到普通商品数据
			this.getCommonList(1, 80, 'COMMON');
			// 得到限时促销数据
			this.getCommonList(1, 4, 'DISCOUNT');
		},
		methods: {
			// 得到精品推荐数据
			getRandomRecommend() {
				this.$http({
					url: `${this.$apis.randomRecommend}?appId=${this.$store.state.appId}`,
					method: 'GET',
					success: ((res) => {
						this.qualityData = res.data || [];
						console.log(this.qualityData, '___')
					})
				})
			},
			// 得到普通商品和限时促销数据
			getCommonList(current, size, publishLocation) {
				this.$http({
					url: this.$apis.getGoodsList,
					method: 'POST',
					data: {
						current: current,
						size,
						publishLocation: publishLocation,
						appId: this.$store.state.appId,
					},
					success: ((res) => {
						let result = res.data;
						let pages = Number(result.pages)
						if (publishLocation === 'COMMON') {
							// 普通商品数据处理
							this.otherData = result.records || [];
							this.totalPages = pages;
						} else {
							// 限时促销商品数据处理
							this.promotionData = result.records || [];
						}
					})
				})
			},
			// 去商品列表
			tapGoodsList(index) {
				switch (index) {
					case 'promotion':
						// 限时促销
						uni.navigateTo({
							url: '/pagesA/pages/goods/goodList?type=DISCOUNT'
						})
						break;
					case 'quality':
						// 精品推荐
						uni.navigateTo({
							url: '/pagesA/pages/goods/goodList?type=RECOMMONDATION'
						})
						break;
				}
			},
			// 去商品详情页面
			tapGoodDetail(item) {
				uni.navigateTo({
					url: `/pagesA/pages/goods/goodDetail?id=${item.id}`
				})
			},
			// 换一批精品推荐
			tapChange() {
				this.changeClass = this.changeClass == 'trans_change' ? 'exchange_trans' : 'trans_change';
				this.isChange = !this.isChange;
				this.getRandomRecommend();
			},
			// 去商品分类页面
			tapClassify() {
				/* uni.navigateTo({
					url: '/pagesA/pages/goods/category'
				}) */
			},
			// 去搜索商品页面
			tapSearch() {
				/* uni.navigateTo({
					url: '/pagesA/pages/goods/shopSearch'
				}) */
			},
		}
	}
</script>


<style>
	page {
		background: #F7F7F7;
	}
</style>
