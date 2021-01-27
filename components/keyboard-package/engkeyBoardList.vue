<template>
	<uni-popup :custom="true" type="bottom" ref="numEnBoard">
		<view class="keyboardbox">
			<view class="platenumber">
				<view class="header">
					<view ></view>
					<view hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="confirm">完成</view>
				</view>
				<view class="main">
					<view class="normal">
						<view class="row" v-for="(item,index) in EngKeyBoardList" :key="index">
							<view class="item" v-for="(ite,idx) in item" :key="idx" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="input(ite)">
								{{ite}}
							</view>
							<view class="item img" v-if="index===EngKeyBoardList.length-1" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="deleteVal">
								<image src="/static/img/delete.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="safe-area" v-if="safeAreaInsetBottom"></view>
	</uni-popup>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniPopup
		},
		props: {
			type: {
				type: String,
				default: 'number'
			},
			safeAreaInsetBottom: { //是否设置安全区
				type: Boolean,
				default: false
			},
			disableDot: { //数字键盘是否禁止点击.仅type为number生效
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				EngKeyBoardList: [
					[1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
					['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
					['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
					['Z', 'X', 'C', 'V', 'B', 'N', 'M']
				],
			};
		},
		methods: {
			open() {
				this.$refs.numEnBoard.open();
			},
			close() {
				this.$refs.numEnBoard.close();
			},
			confirm() {
				this.close();
				this.$emit('onConfirm');
			},
			deleteVal() {
				this.$emit('onDelete');
			},
			input(val) {
				if (val === '.' && this.disableDot) return;
				this.$emit('onInputNo', val);
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.keyboardbox {
		background: #FFFFFF;
	}

	.safe-area {
		padding-bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.platenumber {
		background: #f5f5f5;

		.header {
			height: 76rpx;
			background: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;
			border-top: 1px solid #f5f5f5;

			&>view {
				padding: 0 45rpx;
				color: $uni-color-main;
				height: 100%;
				display: flex;
				align-items: center;
				&.active {
					background: #ebedf0;
				}
			}
		}

		.main {
			height: 435rpx;

			.row {
				margin: 13rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;

				.item {
					width: 60rpx;
					height: 94rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #FFFFFF;
					border-radius: 6rpx;
					margin: 0 7rpx;
					font-size: 36rpx;
					&.active {
						background: #ebedf0;
					}

					&.img {
						background: #c2cacc;
						width: 94rpx;

						&.active {
							background: #ddd;
						}

						&>image {
							width: 49rpx;
							height: 48rpx;
						}
					}
				}
			}

		}
	}
</style>
