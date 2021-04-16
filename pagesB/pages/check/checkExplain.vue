<template>
	<view>
		<view class="check_box">
			<view class="check_main">
				<view class="check_title">
					<view class="check_left">买单说明</view>
				</view>
				<view class="check_text">
					<view>
						买单仅限到店支付，请勿提前购买,
					</view>
					<view>
						如需发票/收据，请您在消费时向商户咨询。
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

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
				color: #141E34;
				padding: 20rpx 30rpx;
				letter-spacing: 1px;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #E5E5E5;

			}

			.check_text {
				color: #979CA7;
				padding: 20rpx 30rpx 100rpx 30rpx;
			}
		}
	}
</style>
