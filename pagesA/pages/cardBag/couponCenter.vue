<template>
	<view class="couponCenterPage">

		<view class="sticky_item">
			<!-- 免费领取、积分兑换 -->
			<view class="title_change">
				<view class="top_title" v-for="(info, index) in infoData" :key="index" @tap="tapTitle(index)">
					<view class="title" :class="index==titleIndex?'active_title':''">{{info}}</view>
					<view class="img_line">
						<image v-if="index==titleIndex" :src="realmImg('cardBag/line.png')" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 免费领取券、积分兑换券列表 -->
		<coupon-part :couponData="couponData"></coupon-part>
		
		<uni-load-more v-if="couponData.length>0" iconType="snow" :iconSize="30" :status="status" :contentText="contentText"/>
		
		<!-- 数据为空 -->
		<empty-part :isShow="tipsObj.isShow" :url="tipsObj.url" :tips="tipsObj.tips" :leftText="tipsObj.leftText" :middleText="tipsObj.middleText" :rightText="tipsObj.rightText"></empty-part>

	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight+'px'; // uniapp获取手机状态栏的高度
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import couponPart from '@/components/coupon_part.vue'
	import emptyPart from '@/components/empty_part.vue'
	import tuiSticky from '@/components/tui-sticky/tui-sticky.vue';
	import { receiveCoupon } from '@/utils/request.js'
	export default {
		components: {
			uniLoadMore,
			tuiSticky,
			couponPart,
			emptyPart
		},
		data() {
			return {
				statusBarHeight: statusBarHeight,
				scrollTop: 0,
				currentPage: 1, 			// 当前页码
				total: 0, 					// 总页数
				type: 'FREE', 				// 券类型
				status: 'noMore',			// 上拉加载更多数据
				infoData: ['免费领取','积分兑换'],
				titleIndex: 0,				// 当前点击中哪个标题
				couponData: [],				// 券数据
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "-- 没有更多内容了 --"
				},
				tipsObj: {
					isShow: false,
					url: this.realmImg('couponCenter/noData.png'),
					tips: '暂无可领取的券',
					leftText: '已提醒老板尽快更新！',
					middleText: '',
					rightText: '',
				},
				isPull: false,				// 是否是页面上拉加载
				
				
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				
			}
			return {
				title: '领券中心',
			}
		},
		onLoad() {
			// 得到优惠券列表页面
			this.getVoucher();
		},
		//页面滚动执行方式
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		// 上拉加载更多,onReachBottom上拉触底函数
		onReachBottom() {
			this.status = 'noMore';
			this.currentPage++;
			if (this.currentPage <= this.total) {
				this.status = 'loading';
				this.getVoucher();
			} 
		}, 
		onPullDownRefresh() {
			this.currentPage = 1;
			this.isPull = true;
			this.getVoucher();
			setTimeout(()=> {
				uni.stopPullDownRefresh();
			}, 500);
		},
		methods: {
			// 切换标题
			tapTitle(index) {
				this.titleIndex = index;
				this.type = index === 0 ? 'FREE' : 'INTEGRAL';
				this.currentPage = 1;
				this.tipsObj.isShow = false;
				this.isPull = true;
				this.getVoucher();
			},
			// 得到优惠券列表页面
			getVoucher() {
				this.$http({
					url: this.$apis.getVoucher,
					data: {
						current: this.currentPage, 	// 页码
						type: this.type 			// 领券中心类型，FREE 免费领取、INTEGRAL 积分兑换
					},
					success: ((res) => {
						let result = res.data;
						this.total = Number(result.pages);
						let sumData = [];
						sumData = this.isPull ? sumData.concat(result.records) : sumData.concat(this.couponData).concat(result.records);
						this.couponData = sumData;
						this.tipsObj.isShow = this.couponData.length ? false : true;
						this.isPull = false;
					})
				})
			},
		}
	}
</script>

<style>
	page{
		background: #F7F7F7;
	}
</style>