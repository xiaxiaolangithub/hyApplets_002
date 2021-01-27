<template>
	<view class="insurance_order">

		<view class="order-box">
			<view class="data_title">
				<view v-if="dataList.type == 'ACCIDENT_PROTECT'">
					<view class="act"></view>大事故降价损失补偿服务
				</view>
				<view v-if="dataList.type == 'TOTAL_LOSS'">
					<view class="act"></view>全损换新补偿服务
				</view>
				<view v-if="dataList.status == 'PROTECTING'">保障中</view>
				<view v-else-if="dataList.status == 'CANCELED'" style="color: #a0a0a0;">已取消</view>
				<view v-else-if="dataList.status == 'PAID'" style="color: #007AFF;">已支付</view>
				<view v-else-if="dataList.status == 'WAIT_PAY'" style="color: #EC612A;">待支付</view>
				<view v-else style="color: #a0a0a0;">已失效</view>
			</view>
			<view class="data-list">
				<view>车牌号码</view>
				<view v-if="dataList.plateNo">{{ dataList.plateNo }}</view>
				<view v-else>暂无</view>
			</view>
			<view class="data-list">
				<view>保单号码</view>
				<view>{{ dataList.code }}</view>
			</view>
			<view class="data-list">
				<view>保障期限</view>
				<view v-if="dataList.insuranceDate">{{ dataList.insuranceDate }}</view>
				<view v-else>暂无</view>
			</view>
			<view class="data-list">
				<view>车辆价格</view>
				<view>￥{{ dataList.custCarPrice }}</view>
			</view>
			<view class="data-list">
				<view>投保费用</view>
				<view>￥{{ dataList.price }}</view>
			</view>
			<view class="data-list" v-if="dataList.compensation">
				<view>保障最高费用</view>
				<view>￥{{ dataList.compensation }}</view>
			</view>

			<view class="data-list data-list-margin">
				<view>车主姓名</view>
				<view>{{ dataList.custName }}</view>
			</view>
			<view class="data-list">
				<view>身份证号</view>
				<view>{{ dataList.custIdentityCard }}</view>
			</view>
			<view class="data-list">
				<view>发动机号</view>
				<view>{{ dataList.engineModel }}</view>
			</view>
			<view class="data-list">
				<view>车架号</view>
				<view>{{ dataList.vinNo }}</view>
			</view>
			<view class="data-list">
				<view>注册时间</view>
				<view>{{ dataList.registerTime }}</view>
			</view>
			<view class="data-list">
				<view style="width: 200rpx;">品牌车系车型</view>
				<view>{{ dataList.custCarName }}</view>
			</view>
			<view class="data-button">
				<view class="pay" v-if="dataList.status == 'WAIT_PAY'" @click.stop="$noMultipleClicks(pay)">支付保费</view>
				<view v-if="dataList.status == 'WAIT_PAY'" @click="cancelOrder">取消订单</view>
				<view v-if="dataList.status == 'CANCELED'" @click="deleteOrder">删除保单</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				id: '',
				reqSnL: '',
				noClick:true,
			}
		},
		onLoad(option) {
			this.id = option.id;
			this.getOrderData();
		},
		onShow() {
			this.getReqsn(); //获取下单编号
		},
		methods: {
			getOrderData() {
				this.$http({
					url: this.$apis.insuranceDetail + '?id=' + this.id,
					method: 'GET',
					success: ((res) => {
						this.dataList = res.data;
					})
				})
			},
			cancelOrder() {
				uni.showModal({
					title: '提示',
					content: '确定取消该保单吗?',
					confirmColor: '#3277FE',
					cancelColor: '#979CA7',
					success: (res) => {
						if (res.confirm) {
							this.$http({
								url: this.$apis.insuranceCancel + '?id=' + this.id,
								method: 'GET',
								success: ((res) => {
									uni.showToast({
										title: '取消成功',
										icon: 'none'
									});
									this.getOrderData();
								})
							})
						} else if (res.cancel) {}
					}
				});
			},
			deleteOrder() {
				uni.showModal({
					title: '提示',
					content: '确定删除该保单吗?',
					confirmColor: '#3277FE',
					cancelColor: '#979CA7',
					success: (res) => {
						if (res.confirm) {
							this.$http({
								url: this.$apis.insuranceDelete + '?id=' + this.id,
								method: 'GET',
								success: ((res) => {
									uni.showToast({
										title: '删除成功',
										icon: 'none'
									});
									setTimeout(() => {
										uni.redirectTo({
											url: '/pagesA/pages/shop/insurance/index'
										})
									}, 2000)
								})
							})
						} else if (res.cancel) {}
					}
				});
			},
			getReqsn() {
				this.$http({
					url: this.$apis.reqSnGetReqSnL,
					method: 'GET',
					success: ((res) => {
						this.reqSnL = res.data;
					})
				})
			},
			pay() {
				this.$http({
					url: this.$apis.waitOrderPay + '?orderSn=' + this.dataList.orderSn,
					method: 'GET',
					success: ((res) => {
						//发起支付
						let _ = this;
						wx.requestPayment({
							timeStamp: res.data.timeStamp,
							nonceStr: res.data.nonceStr,
							package: res.data.packageValue,
							signType: res.data.signType,
							paySign: res.data.paySign,
							success: function(res) {
								uni.showToast({
									title: '投保成功，保单即将生效',
									duration: 2000,
									icon: 'none'
								});
								_.getOrderData();
							},
							fail: function(res) {
								uni.showToast({
									title: "支付失败",
									duration: 2000,
									icon: 'none',
								});
								_.getOrderData();
							}
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F8F6F9;
	}

	.order-box {
		margin: 30rpx;
		padding: 30rpx;
		border-radius: 15rpx;
		background-color: #FFFFFF;

		.data_title {
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;

			view {
				display: flex;
				align-items: center;

				.act {
					width: 8rpx;
					height: 30rpx;
					background: linear-gradient(0deg, #3975E9, #69ACFF);
					border-radius: 5rpx;
					margin-right: 15rpx;
				}
			}

			view:last-child {
				color: #007AFF;
			}
		}

		.data-list {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			view:first-child {
				margin-right: 40rpx;
			}

			view:last-child {
				color: #7E8596;
			}
		}

		.data-list-margin {
			margin-top: 100rpx;
		}

		.data-button {
			display: flex;
			justify-content: flex-end;
			margin-top: 20rpx;

			view {
				border-radius: 15rpx;
				padding: 10rpx 20rpx;
				background-color: #CDD5DB;
				color: #FFFFFF;
				margin-right: 15rpx;
			}

			.pay {
				background-color: #007AFF;
				color: #FFFFFF;
			}
		}
	}
</style>
