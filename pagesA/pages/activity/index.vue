<template>
	<view class="activity_index">
		<view class="activity_box">
			<view class="activity_item" v-for="item in dataList" @tap="goDetail(item)" :key="item">
				<view class="activity_text">{{ item.activityName }}</view>
				<image class="activity_img" :src="item.pic"></image>
			</view>
		</view>
		
		<!-- 数据为空 -->
		<empty-part :isShow="tipsObj.isShow" :url="tipsObj.url" :tips="tipsObj.tips" :leftText="tipsObj.leftText" :middleText="tipsObj.middleText" :rightText="tipsObj.rightText"></empty-part>
		
	</view>
</template>

<script>
	import emptyPart from '@/components/empty_part.vue'
	export default {
		components: {
			emptyPart
		},
		data() {
			return {
				dataList: [],
				tipsObj: {
					isShow: false,
					url: this.realmImg('info/no_info.png'),
					tips: '暂无活动',
					leftText: '',
					middleText: '',
					rightText: '',
				},
			}
		},
		onLoad() {
			this.getList();
		},
		onShareAppMessage(res) {
			return {
				title: '热门活动',
			}
		},
		onShareTimeline() {
			return {
				title: '热门活动',
				url: "/pagesA/pages/activity/index",
			}
		},
		methods: {
			goDetail(item) {
				uni.navigateTo({
					url: '/pagesA/pages/activity/detail?id=' + item.id
				})
			},
			getList() {
				this.$http({
					url: this.$apis.activityList,
					method: 'POST',
					data: {
						current: 1, //	页码    -   必传
						size: 10000, //	每页条数	-	非必传，不传默认10条
						appId: this.$store.state.appId //  小程序appId
					},
					success: ((res) => {
						let result =  res.data.records;
						this.tipsObj.isShow = result.length > 0 ? false : true;
						this.dataList = result;
					})
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F6F9;
	}

	.activity_index {
		padding: 30rpx;
	}

	.activity_box {
		background-color: #FFFFFF;
		border-radius: 25rpx;
	}

	.activity_box .activity_item:last-child {
		border-bottom: 0px solid #E5E5E5;
	}

	.activity_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #E5E5E5;
		padding: 30rpx;
	}

	.activity_text {
		width: 55%;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.activity_img {
		width: 232rpx;
		height: 144rpx;
		background-color: #dedede;
		border-radius: 10rpx;
	}
</style>
