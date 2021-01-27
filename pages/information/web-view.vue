<template>
	<view @tap="tap">
		<web-view :src="web_url"></web-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				web_url: '',
				title: '',
			}
		},
		onLoad(e) {
			// 获取传递过来的链接
			this.web_url = e.url;
			this.title = e.title;
			uni.setNavigationBarTitle({
				title: this.title
			});
		},
		onShareAppMessage(options) {
			return {
				title: this.title,
				path: `/pages/information/web-view?url=${this.web_url}&title=${this.title}`,
			}
		},


	}
</script>
