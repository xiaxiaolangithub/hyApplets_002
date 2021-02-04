<template>
	<view class="apponitRecordsPage">
		<view class="header">
			<view class="item" v-for="(item,index) in navList" :key="index" @click="bindNav(index)">
				<view class="text" :class="[navIndex==index?'active':'']">{{item}}</view>
				<view class="line">
					<image :src="realmImg('cardBag/line.png')" v-if="navIndex==index"></image>
					<image v-else></image>
				</view>
			</view>
		</view>
		<!-- 订单列表 -->
		<view class="order_section" v-if="isOrder">
			<view class="page_inner">
				<view class="list" v-for="(item, index) in orderData" :key="index">
					<view class="order_info">
						<view class="order_num"> 预约单号 {{ item.orderSn }} </view>
						<view class="order_status" v-if="item.status == 'WAIT_CONSUME'">待到店消费</view>
						<view class="order_status" v-else-if="item.status == 'COMPLETED'">已完成</view>
						<view class="order_status" v-else-if="item.status == 'CANCELED'">已取消</view>
						<view class="order_status" v-else>已超时</view>
					</view>
					<!-- 主商品 -->
					<view class="order_good">
						<view class="img" @tap="toDetail(item, index)">
							<!-- 保养 -->
							<image v-if="item.type == 'MAINTAIN'" :src="realmImg('order/order_maintain.png')" mode="widthFix"></image>
							<!-- 洗车 -->
							<image v-else-if="item.type == 'WASH'" :src="realmImg('order/order_wash.png')" mode="widthFix"></image>
							<!-- 专属服务 -->
							<image v-else-if="item.type == 'DS'" :src="realmImg('order/order_ds.png')" mode="widthFix"></image>
							<!-- 商品 -->
							<image v-else mode="widthFix"></image>
						</view>
						<view class="good_info">
							<view class="name" v-if="item.type == 'MAINTAIN'" @tap="toDetail(item, index)">{{ item.item }}</view>
							<view class="name" v-if="item.type == 'WASH'" @tap="toDetail(item, index)">常规洗车</view>
							<view class="name" v-if="item.type == 'DS'" @tap="toDetail(item, index)">{{item.item}}</view>
							<view style="display: flex; justify-content: space-between">
								<view>
									<view v-if="item.type == 'MAINTAIN'" @tap="toDetail(item, index)" class="order_date">
										预约时间：{{ item.reachTime.substring(0, 10) }}
									</view>
									<view v-if="item.type == 'MAINTAIN'" @tap="toDetail(item, index)" class="order_date">
										{{ item.reachStartTime }} - {{ item.reachEndTime }}
									</view>
									<view v-else @tap="toDetail(item, index)" class="order_date">预约时间：{{ item.reachTime }}
									</view>
								</view>
								<view class="total_num" v-if="item.detail[0].length > 0" @tap="seeMore(item, index)">
									共{{ item.detail.length }}件
									<text v-if="!item.isShow" class="iconfont icon-xiangxiajiantou"></text>
									<text v-else class="iconfont icon-xiangshangjiantou"></text>
								</view>
							</view>
						</view>
					</view>
					<!-- 占位 -->
					<view class="place" v-if="item.detail[0].length > 0 && item.isShow"></view>
					<!-- 子商品 -->
					<view class="chid_goods" v-if="item.isShow" @tap="toDetail(item, index)">
						<view class="child" v-for="(child, i) in item.detail" :key="i">
							<view class="child_info">
								<view class="child_name">{{ child }}</view>
							</view>
						</view>
					</view>
					<!-- 取消预约和编辑 -->
					<view class="order_footer" v-if="item.status == 'WAIT_CONSUME'">
						<!-- 取消预约和编辑只有我的预约订单里有 -->
						<view class="cancel" v-if="item.status == 'WAIT_CONSUME'" @tap="tapCancel(item)">取消预约</view>
						<!-- <view class="edit" v-if="item.status == 'WAIT_CONSUME'" @tap="tapEdit(item.id)">编辑</view> -->
					</view>
				</view>
			</view>
		</view>

		<!-- 数据为空 -->
		<empty-part :isShow="!isOrder" :url="tipsObj.url" :tips="tipsObj.tips" :leftText="tipsObj.leftText" :middleText="tipsObj.middleText"
		 :rightText="tipsObj.rightText"></empty-part>

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
				// 是否显示预约列表
				isOrder: false,
				// 订单状态
				navList: ['全部', '待消费', '已完成', '已取消','已超时'],
				navIndex: 0,
				// 待预约数据
				orderData: [],
				current: 1,
				tipsObj: {
					url: this.realmImg('order/no_yuyue.png'),
					tips: '暂无预约记录',
					leftText: '',
					middleText: '',
					rightText: '',
				},
				status: null,
			};
		},
		onShow() {
			this.getReserveList();
		},
		methods: {
			// 查看更多子商品
			seeMore(item, index) {
				item.isShow = !item.isShow;
			},
			// 取消当前预约 我的预约订单列表
			tapCancel(item) {
				uni.showModal({
					title: "",
					content: "确认取消该预约吗？",
					cancelText: "确认",
					cancelColor: "#141E34",
					confirmText: "返回",
					confirmColor: "#3377FF",
					success: (res) => {
						if (!res.confirm) {
							this.$http({
								url: this.$apis.appointmentCancel + "?id=" + item.id + "&type=" + item.type,
								method: "GET",
								success: (res) => {
									uni.showToast({
										title: "取消成功",
									});
									this.getReserveList();
								},
							});
						}
					},
				});
			},
			// 预约订单 编辑订单
			tapEdit(item, index) {
				uni.showToast({
					title: "编辑订单待开发...",
					icon: "none",
				});
			},
			// 订单付款 待付款订单
			payOrder(item, index) {
				this.orderData.splice(index, 1);
				uni.showToast({
					title: "支付成功",
				});
				if (this.orderData.length == 0) {
					this.isOrder = false;
				}
			},
			// 查看订单详情
			toDetail(item) {
				uni.navigateTo({
					url: "./recordsDetail?type=" + item.id + "&current=" + this.current,
				});
			},
			//获取预约单列表
			getReserveList() {
				this.$http({
					url: this.$apis.appointmentList,
					data: {
						current: this.current, //	页码
						status: this.status, //	订单状态 全部 null, WAIT_CONSUME 待消费，COMPLETED 已完成，CANCELED 已取消，TIMEOUT 已超时
						size: 10000, //	每页条数	-	非必传，不传默认10条
					},
					success: (res) => {
						res.data.forEach((item, index) => {
							item.isShow = false;
						});
						this.orderData = res.data;
						this.orderData.length > 0 ? this.isOrder = true : this.isOrder = false;
					},
				});
			},
			// 点击订单状态
			bindNav(index) {
				let status;
				if (index === 0) {
					status = null
				} else if (index === 1) {
					status = 'WAIT_CONSUME'
				} else if (index === 2) {
					status = 'COMPLETED'
				} else if (index === 3) {
					status = 'CANCELED'
				} else {
					status = 'TIMEOUT'
				}
				this.status = status;
				this.navIndex = index;
				// 准备去请求订单
				this.getReserveList();
			},
		},
	};
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
		height: 100%;
	}

	.apponitRecordsPage {
		top: 95rpx;
	}

	.orderPage .order_section {
		padding-top: 0rpx;
	}

	.orderPage .order_section .order_box .chid_goods .child {
		margin-bottom: 0;
	}

	.header {
		top: 0rpx;
		height: 90rpx;
		padding-top: 20rpx;
		background: #ffffff;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		position: fixed;
		z-index: 2;
		padding-left: 40rpx;
		padding-bottom: 15rpx;
		box-sizing: border-box;

		.item {
			padding-right: 60rpx;
		}

		.text {
			font-size: 28rpx;
		}

		.active {
			color: $uni-color-main;
		}

		.line {
			display: flex;
			justify-content: center;
			margin: 26rpx 0 15rpx 0;

			image {
				width: 34rpx;
				height: 10rpx;
			}
		}
	}
</style>
