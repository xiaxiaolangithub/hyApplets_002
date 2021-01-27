<template>
	<view class="activity_index">
		<view class="activity_box">
			<image class="activity_img" :src="dataList.pic"></image>
			<view class="activity_text">
				<view class="activity_top">
					<view class="activity_title">
						<view class="act"></view>
						<view>{{ dataList.activityName }}</view>
					</view>
					<view class="activity_item">
						<view></view>
						<view>
							<image class="icon" :src="realmImg('activity/01.png')" mode="widthFix"></image>
							{{ dataList.startDate }} - {{ dataList.endDate }}
						</view>
					</view>
					<view class="activity_item" @tap="goShop">
						<view></view>
						<image class="icon" :src="realmImg('activity/02.png')" mode="widthFix"></image>
						<view>{{ dataList.address }}</view>
						<text class="iconfont icon-xiangyoujiantou"></text>
					</view>
					<view class="activity_item">
						<view></view>
						<image class="icon" :src="realmImg('activity/03.png')" mode="widthFix"></image>
						<view>已报名{{ dataList.reallyApplyCount + dataList.virtualApplyCount }}人 | 限{{ dataList.applyLimit + dataList.virtualApplyCount }}人</view>
					</view>
				</view>
				<view class="activity_bottom">
					<view class="activity_title">
						<view class="act"></view>
						<view>活动详情</view>
					</view>
					<view class="activity_detail">
						<view>
							<jyf-parser class="news_content" :html="dataList.detail" ref="article"></jyf-parser>
						</view>
					</view>
				</view>
				<view class="activity_button" v-if="dataList.needApply == 1" @tap="saveUser">报名</view>
				<view class="activity_button activity_button2" v-if="dataList.reallyApplyCount >= dataList.applyLimit">报名人数已满</view>
				<view class="activity_button activity_button2" v-else-if="dataList.isApply == true">已报名</view>
			</view>
		</view>
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
			jyfParser
		},
		data() {
			return {
				dataList: {},
				id: null,
			}
		},
		onLoad(option) {
			this.id = option.id;
			this.getDetail();
		},
		onShareAppMessage(res) {
			return {
				title: this.dataList.activityName,
				path: `/pagesA/pages/activity/detail?id=${this.id}`
			}
		},
		onShareTimeline() {
			return {
				title: this.dataList.activityName,
				url: "/pagesA/pages/activity/detail",
				query: `id=${this.id}`
			}
		},
		methods: {
			getDetail() {
				this.$http({
					url: `${this.$apis.activityDetail}?id=${this.id}`,
					method: 'GET',
					success: ((res) => {
						this.dataList = res.data;
					})
				})
			},
			goShop() {
				uni.openLocation({
					latitude: this.dataList.lat, //要去的纬度-地址       
					longitude: this.dataList.lng, //要去的经度-地址
					name: this.dataList.address, //地址名称
					address: this.dataList.address, //详细地址名称
					success: function() {},
					fail: function(error) {}
				});
			},
			saveUser() {
				this.$http({
					url: `${this.$apis.activityApplyApply}?activityId=${this.id}`,
					method: 'GET',
					success: ((res) => {
						uni.showToast({
							title: '报名成功',
							icon: 'none'
						});
						this.getDetail();
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.activity_index{
		.activity_img {
			width: 100%;
			height: 400rpx;
			background-color: #00BFFF;
		}
		.icon-xiangyoujiantou{
			margin-top: 5rpx;
		}
		.icon{
			width:32rpx;
			height: 32rpx;
			margin-right: 20rpx;
		}
		.activity_text {
			background-color: #FFFFFF;
			border-radius: 12px 12px 0 0;
			width: 100%;
		}
		.iconfont{
			margin-left: 20rpx;
		}
		.activity_button {
			position: fixed;
			bottom: 35rpx;
			width: 90%;
			margin: 0 38rpx;
			text-align: center;
			border-radius: 15rpx;
			padding: 20rpx 0;
			background-color: #007AFF;
			color: #FFFFFF;
		}
		
		.activity_button2{
			background-color: #a0a0a0 !important
		}
		
		.activity_top {
			padding: 30rpx 0;
		}
		
		.activity_item {
			padding: 0 30rpx;
			color: #7E8596;
			margin-bottom: 15rpx;
			display: flex;
			align-items: center;
		}
		
		.activity_title {
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			margin-bottom: 30rpx;
			font-size: 32rpx;
		}
		
		.act {
			width: 8rpx;
			height: 30rpx;
			background: linear-gradient(0deg, #3975E9, #69ACFF);
			border-radius: 5rpx;
			margin-right: 15rpx;
		}
		
		.activity_bottom {
			padding: 30rpx 0;
		}
		
		.activity_detail {
			padding: 0 30rpx;
			color: #7E8596;
		}
		
		.activity_detail view {
			line-height: 55rpx;
			padding-bottom: 120rpx;
		}
	}
	
</style>
