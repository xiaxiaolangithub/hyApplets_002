<template>
	<view>
		<!-- 自定义导航栏  返回上一页面、返回到商城-->
		<uni-nav-bar :fixed="true"  @tap="goBack" :background-color="backgroundColor" :status-bar="true" color="#1A1A1A" class="interBar" :title="title">
		    <view slot="left" class="navBar_left">
				<image src="/static/img/go_back.png" mode="widthFix"></image>
			</view>
		</uni-nav-bar>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import { goTaBar } from '@/utils/request.js'
	export default {
		components:{
			uniNavBar
		},
		props:["title", "backgroundColor"],
		methods: {
			// 返回上一级
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
		
	}
</script>

