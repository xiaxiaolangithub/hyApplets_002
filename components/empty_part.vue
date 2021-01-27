<template>
	<!-- 无数据时显示 -->
	<view class="nodata_coupon" v-if="isShow">
		<view class="top">
			<image :src="url" mode="widthFix"></image>
			<view @tap="tapClick">
				<view v-if="tips.length>0">{{tips}}</view>
				<view>{{leftText}} <text class="middle_text">{{middleText}}</text> {{rightText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['isShow', 'url', 'tips', 'leftText', 'middleText', 'rightText'],
		
		methods:{
			tapClick() {
				switch(this.middleText) {
					case '领券中心':
						uni.navigateTo({
							url: '/pagesA/pages/cardBag/couponCenter'
						})
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	
	.nodata_coupon{
		text-align: center;
		font-size: 30rpx;
		font-weight: 500;
		color: #9A9A9A;
		line-height: 60rpx;
		padding-top:60rpx;
		image{
			width:414rpx;
			height: 266rpx;
		}
		.middle_text{
			margin: 0 3rpx;
			color:$uni-color-main;
		}
	}
</style>
