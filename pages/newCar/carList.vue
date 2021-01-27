<template>
	<view class="carListPage">
		<!-- 新车列表 -->
		<view class="page_inner" v-if="carData.length">
			<view class="list" v-for="(item, index) in carData" :key="index" @tap="tapDetail(item)">
				<image class="left" :src="item.pngLogo" mode="widthFix"></image>
				<view class="right">
					<view class="base">
						<view class="name">{{item.name}}</view>
						<view class="price">厂商指导价: {{item.guidePrice}}万起</view>
						<view class="discount" v-if="item.discountPrice&&item.guidePrice>=item.discountPrice">门店优惠价:
							{{item.discountPrice.toFixed(2)}}万起</view>
					</view>
					<view class="ask" hover-class="handle_hover" @click.stop="tapAsk(item)">询底价</view>
				</view>
			</view>

			<uni-load-more iconType="snow" :iconSize="30" :status="status" />
		</view>


		<!-- 数据为空 -->
		<empty-part :isShow="tipsObj.isShow" :url="tipsObj.url" :tips="tipsObj.tips" :leftText="tipsObj.leftText" :middleText="tipsObj.middleText"
		 :rightText="tipsObj.rightText"></empty-part>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import emptyPart from '@/components/empty_part.vue'
	import {
		distinct,
		tranNumber
	} from '@/static/js/tool.js'
	export default {
		components: {
			uniLoadMore,
			emptyPart
		},
		data() {
			return {
				carData: [], // 汽车列表数据
				status: 'noMore', // 上拉加载更多数据
				// currentPage: 1,			// 当前页码
				// total: 0,				// 总页数
				// pageSize: 10,			// 每页显示多少条数据
				tipsObj: {
					isShow: false,
					url: this.realmImg('carList/noCar.png'),
					tips: '暂无新车',
					leftText: '4S店正在加快上架中~！',
					middleText: '',
					rightText: '',
				},
			}
		},
		onShareAppMessage(res) {
			return {
				title: '车辆展厅',
			}
		},
		onShareTimeline() {
			return {
				title: '车辆展厅',
				url: "/pages/newCar/carList",
			}
		},
		onPullDownRefresh() {
			// 得到新车列表
			this.getCarList();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 500);
		},
		onShow() {
			// 得到新车列表
			this.getCarList();
		},
		// 上啦加载
		/* onReachBottom() {
			this.currentPage++;
			if (this.currentPage <= this.total) {
				this.getCarList();
			}
		}, */

		methods: {
			// 得到新车列表
			getCarList() {
				this.$http({
					url: this.$apis.seriesList,
					method: 'POST',
					data: {
						/* current: this.currentPage,		// 当前页码
						size: this.pageSize,			// 每页显示多少条数据 */
						appId: this.$store.state.appId
					},
					success: ((res) => {
						let result = res.data;
						// this.total = Number(result.pages);
						this.carData = result || [];
						this.status = "noMore";
						this.tipsObj.isShow = this.carData.length ? false : true;
					})
				})
			},
			// 去车型列表
			tapDetail(item) {
				uni.navigateTo({
					url: `/pagesA/pages/newCar/carModel?seriesId=${item.id}&seriesName=${item.name}&pngLogo=${item.pngLogo}&type=0`
				})
			},
			// 询问底价
			tapAsk(item) {
				uni.navigateTo({
					url: `/pagesA/pages/newCar/askPrice?seriesId=${item.id}&seriesName=${item.name}&type=0`
				})
			},
		}
	}
</script>
