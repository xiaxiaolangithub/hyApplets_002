<template>
	<view>
		<!-- 服务流程 -->
		<view class="page_footer_process">
			<view class="process_title text_grey">预约服务流程</view>
			<view class="list">
				<view class="process_box" v-for="(process, index) in processList" :key="index">
					<view class="box_top">
						<image :src="process.url" mode="widthFix" class="process_icon"></image>
						<image :src="realmImg('excluServices/right_icon.png')" mode="widthFix" v-if="index!==2" class="right_icon"></image>
					</view>
					<view class="box_bottom" :class="process.className">
						<image class="img" :src="process.back" mode="widthFix"></image>
						<text class="process_name">{{process.text}}</text>
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
				// 流程数据
				processList: [
					{
						url: this.realmImg('excluServices/subscribe.png'),
						back: this.realmImg('excluServices/subscribe_01.png'),
						className: 'backOne',
						text: '小程序预约'
					},
					{
						url: this.realmImg('excluServices/choice.png'),
						back: this.realmImg('excluServices/choice_02.png'),
						className: 'backTwo',
						text: '选择预约类型、时间'
					},
					{
						url: this.realmImg('excluServices/service.png'),
						back: this.realmImg('excluServices/service_03.png'),
						className: 'backThree',
						text: '享受线下服务'
					},
				],
			};
		}
	}
</script>

<style lang="scss">
	// 页面底部流程
	.page_footer_process{
		padding: 40rpx 0 30rpx;
		.list{
			display: flex;
			align-items: center;
		}
		.process_title{
			font-size:34rpx;
			padding:0 0 30rpx 30rpx;
		}
		.process_box{
			width:33.33%;
			text-align: center;
		}
		.box_top{
			width:100%;
			height: 100rpx;
			display: flex;
			justify-content: center;
			position: relative;
			.process_icon{
				width:70rpx;
				height: 70rpx;
			}
			.right_icon{
				right:-30rpx;
				width:70rpx;
				height: 30rpx;
				top:22%;
				position: absolute;
			}
		}
		.box_bottom{
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			padding-top:15rpx;
			.img{
				position: absolute;
				width:110rpx;
				height: 80rpx;
			}
		}
		.process_name{
			color:rgba(126,133,150,1);
			font-size: 25rpx;
		}
	}
	
	
</style>
