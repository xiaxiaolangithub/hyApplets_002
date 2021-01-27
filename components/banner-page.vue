<template>
	<view>
		<!-- 轮播组件 https://ext.dcloud.net.cn/plugin?id=284-->
		<view class="home_banner">
			<uni-swiper-dot :info="swiperList" @change="change" :current="current" mode="default" :dots-styles="dotsStyles" class="banner_dot">
				<swiper class="swiper-box"  :circular="true"  @change="changeSwiper" :autoplay="true" >
					<swiper-item v-for="(swiper, index) in swiperList" :key="index"   @tap="tapSwiper(swiper)" >
						<image class="image" :src="swiper.img" mode="widthFix" />
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view> 
	</view>
</template>

<script>
	export default {
		props: ['swiperList'],
		data() {
			return {
				// 当前点击到哪一个banner
				current: 0,
				// banner背景样式
				dotsStyles: {
					backgroundColor: '#999',
					border: '1px solid transparent',
					color: '#fff',
					selectedBackgroundColor: '#356AD2',
					selectedBorder: '1px solid #356AD2'
				},	
			};
		},
		methods:{
			// 切换banner 图片
			tapSwiper(item) {
				this.$emit('tapSwiper', item)
			},
			// 切换轮播点
			changeSwiper(e) {
				this.current = e.detail.current;
			}
		}
	}
</script>

<style lang="scss">
	.home_banner{
		display: flex;
		width:750rpx;
		.uni-swiper__warp,.swiper-box{
			height: 400rpx;
			border-radius: 0;
			overflow: hidden;
		}
		.banner_dot{
			width:750rpx;
			height:400rpx;
			margin: 0 auto;
			
			.image{
				width:750rpx;
			}
		}
	}
</style>
