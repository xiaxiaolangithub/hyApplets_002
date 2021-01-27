<template>
	<view class="carModelPage">
		<view class="main">
			<image :src="pngLogo" mode="widthFix"></image>
			<view class="name">{{seriesName}}</view>
		</view>
		<view class="box">
			<view class="list" v-for="(item, index) in modelData" :key="index" @tap="toDetail(item)">
				<view class="left">
					<view class="name">{{item.name}}</view>
					<view class="discount" v-if="item.discountPrice&&item.guidePrice>=item.discountPrice">门店优惠价: {{item.discountPrice.toFixed(2)}}万</view>
				</view>
				<view class="right">
					<view class="guide">厂商指导价: {{item.guidePrice}}万</view>
					<view class="ask" hover-class="handle_hover ask_hover" @click.stop="tapAsk(item)">询底价</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modelData: [],		
				seriesId: null,
				seriesName: '',
				pngLogo: '',		// 车图片
				obj: {}
				
			}
		},
		onLoad(e) {
			this.seriesId = Number(e.seriesId);
			this.seriesName = e.seriesName;
			this.pngLogo = e.pngLogo;
			console.log(this.obj)
			// 得到车型列表
			this.getModelList();
		},
		onShareAppMessage(res) {
			return {
				title: this.seriesName,
				path: `/pagesA/pages/newCar/carModel?seriesId=${this.seriesId}&seriesName=${this.seriesName}&pngLogo=${this.pngLogo}&type=0`
			}
		},
		onShareTimeline() {
			return {
				title: this.seriesName,
				url: "/pagesA/pages/newCar/carModel",
				query: `seriesId=${this.seriesId}&seriesName=${this.obj.seriesName}&pngLogo=${this.pngLogo}&type=0`
			}
		},
		methods:{
			// 得到车型列表
			getModelList() {
				this.$http({
					url: this.$apis.getCarList,
					method: 'POST',
					data: {
						series: this.seriesId,
						appId: this.$store.state.appId,
						current: 1, 
						size: 1000
					},
					success: ((res) => {
						this.modelData = res.data.records;
					})
				})
			},
			// 看详情
			toDetail(item) {
				uni.navigateTo({
					url:`./carDetail?modelId=${item.id}`
				})
			},
			// 询问底价
			tapAsk(item) {
				uni.navigateTo({
					url: `./askPrice?seriesId=${this.seriesId}&seriesName=${this.seriesName}&modelId=${item.id}&type=1`
				})
			},
		}
	}
</script>


