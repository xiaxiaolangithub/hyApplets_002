<template>
	<view class="check_box">
		<view class="check_main">
			<view class="check_title">
				<view class="check_left">输入买单金额</view>
				<view class="check_right check_right_act" @click="goExplain()">
					<icon type="info" size="16" color="#FF566D" />买单说明
				</view>
			</view>
			<input type="digit" v-model="userMoney" placeholder="请询问收银人员后输入" placeholder-class="plach_class"
				class="input" />
		</view>
		<view class="check_main" v-if="isCheck">
			<view class="check_title">
				<view class="check_left">买单优惠</view>
			</view>
			<view>
				<checkbox-group class="check_group">
					<view v-for="(detail,i) in userConfig" :key="i" class="detail_list">
						<view class="detail_label">
							<checkbox @click="simpleCheck()" style="transform:scale(0.8)" :value="i"
								:checked="detail.isChecked" :disabled="detail.isDisabled" />
							<view class="detail_content">
								<view>
									满{{detail.fullDeductAmount}}减{{detail.discountAmount}}元
									<text v-if="detail.maxMoney > 0">, 最高可减{{detail.maxMoney}}元</text>
								</view>
								<view class="num" v-show="reduceMoney">
									-{{reduceMoney}}
								</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
		</view>
		<view class="check_main check_main_bottom">
			<view class="check_title" style="width: 100%;">
				<view class="check_left">实付金额</view>
				<view class="check_right num" v-if="payMoney">
					￥{{payMoney}}
				</view>
			</view>
		</view>
		<button hover-class="handle_hover" class="check_main_button" @tap="saveInfo"><text
				v-if="payMoney">{{payMoney}}元, </text>确认买单</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userConfig: [],
				userMoney: null, //用户输入的买单金额
				reduceMoney: null, //用户满减金额
				payMoney: null, //用户实付金额
				payCode: {}, //微信支付参数
				isCheck: false, //授权方支持满减
			}
		},
		onShow() {},
		onLoad() {
			this.getConfig();
		},
		watch: {
			userMoney() {
				if (this.chenkMoney()) {
					this.numCalculation()
				}
			}
		},
		methods: {
			getConfig() {
				this.$http({
					url: this.$apis.getAuthorizerConfig,
					method: 'GET',
					success: ((res) => {
						let obj = res.data;
						this.isCheck = res.data.openFullDeduct;
						obj.isChecked = false; //是否选中
						obj.isDisabled = true; //是否禁用
						if (obj.maxSuperposeCount > 0) {
							obj.maxMoney = obj.discountAmount * obj.maxSuperposeCount;
						}
						this.userConfig.push(obj);
					})
				})
			},
			numCalculation() {
				if (!this.isCheck) { //授权方未打开满减
					this.payMoney = this.userMoney;
					return false;
				}
				let iMoney = Number(this.userMoney); //用户输入金额
				let confObj = this.userConfig[0] //设置的obj
				let uMoney = confObj.fullDeductAmount //商家设置满减金额门槛
				let sMoney = confObj.discountAmount //商家设置满减金额
				if (iMoney >= uMoney) {
					this.reduceMoney = null;
					confObj.isDisabled = false;
					confObj.isChecked = true;
					if (confObj.maxSuperposeCount === 0) { //判断满减叠加等于0则无限叠加
						this.reduceMoney = sMoney * parseInt(iMoney / uMoney);
					} else {
						if (parseInt(iMoney / uMoney) > confObj.maxSuperposeCount) { //设置叠加次数不等于0时才判断最高满减叠加
							this.reduceMoney = sMoney * confObj.maxSuperposeCount;
						} else {
							this.reduceMoney = sMoney * parseInt(iMoney / uMoney);
						}
					}
				} else {
					this.reduceMoney = null;
					confObj.isDisabled = true;
					confObj.isChecked = false;
				}

				this.payCalculation();

			},
			simpleCheck() {
				this.userConfig[0].isChecked = !this.userConfig[0].isChecked;
				if (!this.userConfig[0].isChecked) {
					this.reduceMoney = null;
					this.payCalculation();
				} else {
					this.numCalculation()
				}
			},
			payCalculation() {
				if (this.reduceMoney) {
					this.payMoney = ((this.userMoney * 10 - this.reduceMoney * 10) / 10).toFixed(2);
				} else {
					this.payMoney = this.userMoney;
				}
			},
			saveInfo() {
				if (!this.chenkMoney()) {
					return false
				}
				this.$http({
					url: this.$apis.orderPayTheBill,
					type: 'POST',
					data: {
						totalAmount: Number(this.userMoney),
						isFullDeduct: this.userConfig[0].isChecked
					},
					success: ((res) => {
						this.payCode = res.data;
						this.wxPay();
					})
				})
			},
			wxPay() {
				wx.requestPayment({
					provider: 'wxpay',
					timeStamp: this.payCode.timeStamp,
					nonceStr: this.payCode.nonceStr,
					package: this.payCode.packageValue,
					signType: this.payCode.signType,
					paySign: this.payCode.paySign,
					success: function(res) {
						uni.showToast({
							title: "支付成功",
							duration: 1500,
							icon: 'none',
						});
						this.userMoney = null; //用户输入的买单金额
						this.reduceMoney = null; //用户满减金额
						this.payMoney = null; //用户实付金额
					},
					fail: function(res) {
						uni.showToast({
							title: "支付失败",
							duration: 1500,
							icon: 'none',
						});
					},
					complete: function(res) {}
				})
			},
			goExplain() {
				// 买单说明页面
				uni.navigateTo({
					url: '/pagesB/pages/check/checkExplain'
				});
			},
			chenkMoney() {
				let exp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
				let oldNum = this.userMoney;
				if (exp.test(this.userMoney)) {
					return true;
				} else {
					uni.showToast({
						title: '请输入正确的金额',
						icon: 'none'
					});
					return false;
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F7F7F7;
	}

	.check_box {
		.check_main {
			background-color: #FFFFFF;
			margin: 30rpx;
			border-radius: 20rpx;
			font-size: 30rpx;

			.check_title {
				color: #979CA7;
				padding: 20rpx 30rpx;
				letter-spacing: 1px;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #E5E5E5;

				.check_right {
					display: flex;
					align-items: center;

					icon {
						margin-right: 5rpx;
					}
				}

				.check_right_act {
					color: #979CA7 !important
				}
			}

			.input {
				height: 60rpx;
				padding: 20rpx 30rpx;
				text-align: right;
				color: #EC612A
			}

			.plach_class {
				color: #cccccc;
			}

		}

		.num {
			color: #EC612A !important;
			letter-spacing: 0px !important
		}

		.check_main_bottom {
			height: 120rpx !important;
			display: flex;
			align-items: center;

			.check_title {
				border-bottom: 0px solid #E5E5E5 !important
			}
		}

		.check_main_button {
			margin: 200rpx 30rpx 30rpx 30rpx;
			background-color: #FF566D;
			color: #FFFFFF;
		}

		.check_group {
			padding: 25rpx 30rpx 25rpx 30rpx;
			box-sizing: border-box;
		}

		.detail_list {
			display: flex;
			margin-bottom: 30rpx;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.detail_label {
			width: 100%;
			display: flex;
			align-items: center;
		}

		.detail_content {
			width: 100%;
			color: $uni-text-color-grey;
			font-size: 30rpx;
			margin-left: 15rpx;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
