<template>
	<view class="goodListPage">
		<view class="box">
			<view class="list" v-for="(item, index) in goodData" :key="index" @tap="tapDetail(item)">
				<image :src="item.mainPic" mode="widthFix" class="img"></image>
				<view class="info">
					<view class="name">{{item.name}}</view>
					<!-- <progress :percent="item.percent" show-info stroke-width="15rpx" 
					 backgroundColor="#FFF4EF" active="true" border-radius="12"
					 v-if="item.percent < 100" />
					<view class="nothing" v-else>已抢完</view> -->
					<view class="other" :class="title==='精品推荐'?'special':''">
						<view class="price">
							<view class="now">
								<text>¥</text>{{item.salePrice}}
							</view>
							<view class="org" v-if="title==='限时促销'">
								<text>¥</text> {{item.price}}
							</view>
						</view>
						<view class="handle">
							<view class="shop" hover-class="handle_hover" v-if="item.stock >0">去抢购</view>
							<view class="shop end" v-else>已抢完</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',		// 页面标题
				objData: {
					current: 1,
					size: 20,
					publishLocation: '',
					appId: this.$store.state.appId,
				},
				totalPages: 0,
				goodData: [],
				isPull: false,				// 是否是页面上拉加载
				type: '',
			}
		},
		onLoad(e) {
			// 页面基本信息
			this.getBasic(e);
		},
		onPullDownRefresh() {
			this.objData.current = 1;
			this.isPull = true;
			this.getList();
			setTimeout(() =>  {
				uni.stopPullDownRefresh();
			}, 500);
		},
		// 上拉加载
		onReachBottom() {
			this.objData.current++;
			if (this.objData.current <= this.totalPages) {
				this.getList();
			} 
		},
		onShareAppMessage(res) {
			return {
				title: this.title,
				path: `/pagesA/pages/goods/goodList?type=${this.type}`
			}
		},
		onShareTimeline() {
			return {
				title: this.title,
				url: "/pagesA/pages/goods/goodList",
				query: `type=${this.type}`
			}
		},
		methods:{
			// 页面基本信息
			getBasic(e) {
				this.type = e.type;
				this.title = this.type === 'DISCOUNT' ? '限时促销' : '精品推荐';
				uni.setNavigationBarTitle({
					title: this.title
				});
				this.objData.publishLocation = e.type;
				this.getList();
			},
			// 得到商品列表
			getList() {
				this.$http({
					url: this.$apis.getGoodsList,
					method: 'POST',
					data: this.objData,
					success: ((res) => {
						let result = res.data;
						let sumData = [];
						sumData = this.isPull ? sumData.concat(result.records): sumData.concat(this.goodData).concat(result.records);
						this.goodData = sumData;
						this.isPull = false;
						this.totalPages = Number(result.pages);
					})
				})
			},
			// 去商品详情
			tapDetail(item) {
				uni.navigateTo({
					url: `./goodDetail?id=${item.id}`
				})
			}
		}
	}
</script>

