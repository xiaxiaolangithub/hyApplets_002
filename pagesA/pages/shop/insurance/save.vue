<template>
	<view class="insurance_save">
		<view class="save_top">
			<view class="top_title">
				<view class="act"></view>保费计算
			</view>
			<view class="top_text">
				<view>车辆价格</view>
				<input v-model="carNumber" type="number" />
			</view>
			<view class="top_button" @click="calculation">计算保费</view>
		</view>

		<view class="save_bottom">
			<view class="top_title top_title2" style="padding-top: 65rpx;">
				<view class="act"></view>所需保费
			</view>
			<view class="top_text2">
				<view>{{ retNumber(number1) }}</view>
				<view>所需保费 = 车辆价格*{{ Number(this.premiumRatio)*100 }}%</view>
			</view>
			<view class="top_title top_title2" style="padding-top: 35rpx;" v-if="postData.type == 2">
				<view class="act"></view>最高保障费用
			</view>
			<view class="top_text2" v-if="postData.type == 2">
				<view>{{ retNumber(number2) }}</view>
				<view>最高保障费用 = 车辆价格*15%</view>
			</view>
		</view>

		<view class="save_button" @click="$noMultipleClicks(save)">立即投保</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				carNumber: null,
				number1: '',
				number2: '',
				postData: {},
				premiumRatio: null, //保费比例
				reqSnL: '', //下单编号
				noClick:true,
				detailId: '',
			}
		},
		onLoad(option) {
			this.postData = JSON.parse(option.data);
			this.premiumRatio = option.premiumRatio; //保费比例
		},
		onShow() {
			this.getReqsn(); //获取下单编号
		},
		methods: {
			calculation() {
				if (this.carNumber) {
					this.number1 = Number(this.carNumber * Number(this.premiumRatio));
					this.number2 = this.carNumber * 0.15;
				}
			},
			save() {
				if (this.carNumber) {
					console.log(this.postData)
					this.$http({
						url: this.$apis.insuranceSave,
						method: 'POST',
						data: {
							custCarId: Number(this.postData.id), // 用户车辆id(必填)
							custCarPrice: Number(this.carNumber), // 用户车辆价格(必填)
							custType: this.postData.carType, // 用户类型，PERSON 个人、COMPANY 企业(必填)
							custName: this.postData.name, // 用户姓名或企业名称(必填)
							custIdentityCard: this.postData.idcard, // 用户身份证号或企业税号(必填)
							type: this.postData.type == 1 ? 'TOTAL_LOSS' : 'ACCIDENT_PROTECT', // 保单类型，ACCIDENT_PROTECT 大事故降价损失补偿服务、TOTAL_LOSS 全损换新补偿服务(必填)
							reqSn: this.reqSnL, //请求编号
						},
						success: ((res) => {
							let _ = this;
							//发起支付
							_.detailId = res.data.number;
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
									setTimeout(() => {
										uni.navigateTo({
											url: '/pagesA/pages/shop/insurance/order?id=' + _.detailId
										})
									}, 2000)
								},
								fail: function(res) {
									uni.showToast({
										title: "支付失败",
										duration: 2000,
										icon: 'none',
									});
									setTimeout(() => {
										uni.navigateTo({
											url: '/pagesA/pages/shop/insurance/order?id=' + _.detailId
										})
									}, 2000)
								}
							})
						})
					})
				} else {
					uni.showToast({
						title: '请填写车辆价格',
						icon: 'none'
					});
				}
			},
			retNumber(num) {
				let num2 = Number(num)
				return num2.toFixed(2)
			},
			getReqsn() {
				this.$http({
					url: this.$apis.reqSnGetReqSnL,
					method: 'GET',
					success: ((res) => {
						this.reqSnL = res.data;
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

	.insurance_save {
		font-size: 35rpx;

		.save_top {
			height: 410rpx;
			margin: 30rpx;
			margin-bottom: 0;
			border-radius: 15rpx;
			background: url('https://img.hangzhouhuiyao.cn/images/hycar/shopHome/insurance-bg-top.png') no-repeat;
			background-size: 100%;

			.top_title {
				padding: 30rpx 30rpx 0 30rpx;
			}

			.top_text {
				view {
					padding: 0 30rpx;
				}
			}
		}

		.save_bottom {
			height: 500rpx;
			margin: 30rpx;
			margin-top: 0;
			border-radius: 15rpx;
			background: url('https://img.hangzhouhuiyao.cn/images/hycar/shopHome/insurance-bg-bottom.png') no-repeat;
			background-size: 100%;
		}

		.top_title {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			padding: 40rpx 30rpx 0 30rpx;

			.act {
				width: 8rpx;
				height: 30rpx;
				background: linear-gradient(0deg, #3975E9, #69ACFF);
				border-radius: 5rpx;
				margin-right: 15rpx;
			}
		}

		.top_text {
			font-size: 32rpx;
			margin-bottom: 49rpx;

			view {
				font-size: 32rpx;
				margin-bottom: 20rpx;
			}

			input {
				border-bottom: 1px solid #E5E5E5;
				padding: 0 19rpx;
				width: 92%;
				margin: 0 auto;
			}
		}

		.save_input {
			font-size: 32rpx;

			view {
				padding: 30rpx;
			}
		}

		.top_button {
			width: 85%;
			margin: 0 auto;
			color: #007AFF;
			text-align: center;
			border-radius: 15rpx;
			padding: 20rpx 0;
			border: 1px solid #007AFF;
		}

		.top_title2 {
			margin-bottom: 25rpx;
		}

		.top_text2 {
			view:first-child {
				padding: 0 19rpx;
				margin-bottom: 14rpx;
				border-bottom: 1px solid #E5E5E5;
				width: 98%;
				margin: 0 auto;
				height: 46rpx;
			}

			view:last-child {
				padding: 0 19rpx;
				margin-top: 18rpx;
				font-size: 32rpx;
				color: #7E8596;
			}
		}

		.save_button {
			margin: 0 5%;
			padding: 25rpx 0;
			position: fixed;
			bottom: 20px;
			width: 90%;
			border-radius: 15rpx;
			background-color: #3377FF;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
