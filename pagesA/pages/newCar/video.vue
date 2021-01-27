<template>
	<view class="videoPage">
		<video class="video" id="demoVideo"  autoplay="true" :src="url" ></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(e) {
			this.url = e.url;
			uni.setNavigationBarTitle({
			　　title: e.name
			})
		}
	}
</script>

<style>
	page{
		width:100%;
		height: 100%;
	}
	.videoPage,#demoVideo{
		width:100%;
		height: 100%;
	}
</style>
