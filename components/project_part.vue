<template>
	<view class="project">
		<view class="list" v-for="(item, index) in projectData" :key="index">
			<image :src="item.url" mode="widthFix" class="img"></image>
			<view class="title">{{item.title}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['projectData']
	}
</script>

<style lang="scss">
	.project{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0;
		padding: 35rpx 0 35rpx;
		.list{
			width:25%;
			text-align: center;
		}
		.img{
			width:70rpx;
			height: 70rpx;
			margin-bottom: 12rpx;;
		}
		.title{
			color:$uni-text-color-grey;
			font-size: 24rpx;
		}
	}
</style>
