<template>
	<view>
		<view v-show="show" class="uni-mask" :style="{ top: offsetTop + 'px' }" @touchmove.stop.prevent="maskMoveHandle"></view>
		<view v-show="show" class="prompt-content contentFontColor" :class="'uni-prompt-' + position + ' ' + 'uni-prompt-' + mode">
			<view class="prompt-title">{{title}}</view>
			<input class="prompt-input" type="text" :placeholder="text" @input="_input" :value="cost" />
			<view class="prompt-btn-group">
				<text class="btn-item prompt-cancel-btn contentFontColor" @tap="_cancel">{{btn_cancel}}</text>
				<text class="btn-item prompt-certain-btn" @tap="_confirm">{{btn_certain}}</text>
			</view>
		</view>
		<view v-if="position === 'middle' && mode === 'insert'" :class="{'uni-close-bottom': buttonMode === 'bottom','uni-close-right': buttonMode === 'right'}"
		 class=" uni-icon uni-icon-close" @click="_cancel" />
	</view>
	</view>
</template>
<script>
	export default {
		name: 'prompt',
		data() {
			return {
				offsetTop: 0,
				multipleSlots: true, // 在组件定义时的选项中启用多slot支持
				cost: ''
			};
		},
		props: {
			/**
			 * 页面显示
			 */
			show: {
				type: Boolean,
				default: false
			},
			/**
			 * 对齐方式
			 */
			position: {
				type: String,
				// top - 顶部， middle - 居中, bottom - 底部
				default: 'middle'
			},
			/**
			 * 显示模式
			 */
			mode: {
				type: String,
				default: 'insert'
			},
			/**
			 * h5遮罩是否到顶
			 */
			h5Top: {
				type: Boolean,
				default: false
			},


			title: {
				type: String,
				default: '提示'
			},
			text: {
				type: String,
				default: '请输入内容'
			},
			btn_cancel: {
				type: String,
				default: '取消'
			},
			btn_certain: {
				type: String,
				default: '确定'
			},
			buttonMode: {
				type: String,
				default: 'bottom'
			}
		},
		watch: {
			h5Top(newVal) {
				if (newVal) {
					this.offsetTop = 44
				} else {
					this.offsetTop = 0
				}
			}
		},
		created() {
			let offsetTop = 0
			// #ifdef H5
			if (!this.h5Top) {
				offsetTop = 44
			} else {
				offsetTop = 0
			}
			// #endif
			this.offsetTop = offsetTop
		},
		methods: {
			maskMoveHandle() {},

			/*
			 * 内部私有方法建议以下划线开头
			 * triggerEvent 用于触发事件
			 */
			_cancel() {
				//触发cancel事件
				this.cost = '';
				this.$emit('onCancel');
			},
			_confirm() {
				this.$emit('onConfirm', this.cost);
				this.cost = '';
			},
			_input(e) {
				this.cost = e.detail.value;
			}
		}
	}
</script>

<style>
	/* components/vas-prompt/vas-prompt.wxss */
	.uni-mask {
		position: fixed;
		z-index: 998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.uni-prompt-middle {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.uni-prompt-middle.uni-prompt-insert {
		transform: translate(-50%, -65%);
		box-shadow: none;
	}

	.uni-prompt-middle.uni-prompt-fixed {
		border-radius: 10upx;
		padding: 30upx;
	}

	.uni-close-bottom,
	.uni-close-right {
		position: absolute;
		bottom: -180upx;
		text-align: center;
		border-radius: 50%;
		color: #f5f5f5;
		font-size: 60upx;
		font-weight: bold;
		opacity: 0.8;
		z-index: -1;
	}

	.uni-close-bottom {
		margin: auto;
		left: 0;
		right: 0;
	}

	.uni-close-right {
		right: -60upx;
		top: -80upx;
	}

	.uni-close-bottom:after {
		content: '';
		position: absolute;
		width: 0px;
		border: 1px #f5f5f5 solid;
		top: -200upx;
		bottom: 56upx;
		left: 50%;
		transform: translate(-50%, -0%);
		opacity: 0.8;
	}

	.prompt-content {
		position: fixed;
		z-index: 999;
		background-color: #ffffff;
		width: 540upx;
		border-radius: 20upx;
	}

	.prompt-title {
		width: 100%;
		padding: 26upx 0 26upx 0;
		text-align: center;
		font-size: 32upx;
		position: relative;
	}

	.prompt-title::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.prompt-input {
		margin: 13% 0;
		width: 86%;
		height: 75upx;
		border: 1px solid #efefef;
		border-radius: 10rpx;
		padding-left: 10upx;
		font-size: 28upx;
		font-weight: 100;
	}

	.prompt-input:-moz-placeholder,
	textarea:-moz-placeholder {
		color: #000!important
	}

	.prompt-input:-ms-input-placeholder,
	textarea:-ms-input-placeholder {
		color: #000!important	}

	.prompt-input::-webkit-input-placeholder,
	textarea::-webkit-input-placeholder {
		color: #000!important	}

	.prompt-btn-group {
		width: 100%;
		position: relative;
		height: 95upx;
	}

	.prompt-btn-group::before {
		position: absolute;
		z-index: 3;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-item {
		width: 50%;
		display: inline-block;
		text-align: center;
		position: relative;
		height: 95upx;
		line-height: 95upx;
	}

	.prompt-cancel-btn::after {
		position: absolute;
		z-index: 3;
		right: 0;
		top: 0;
		bottom: 0;
		width: 1px;
		content: '';
		-webkit-transform: scaleX(.5);
		transform: scaleX(.5);
		background-color: #c8c7cc;
	}

	.dividing-line {
		width: 1upx;
		height: 100%;
		background-color: #d5d5d6;
	}

	.contentFontColor {
		color: #868686;
	}

	.uni-close-bottom,
	.uni-close-right {
		position: absolute;
		bottom: -180upx;
		text-align: center;
		border-radius: 50%;
		color: #f5f5f5;
		font-size: 60upx;
		font-weight: bold;
		opacity: 0.8;
		z-index: -1;
	}

	.uni-close-bottom {
		margin: auto;
		left: 0;
		right: 0;
	}

	.uni-close-right {
		right: -60upx;
		top: -80upx;
	}

	.uni-close-bottom:after {
		content: '';
		position: absolute;
		width: 0px;
		border: 1px #f5f5f5 solid;
		top: -200upx;
		bottom: 56upx;
		left: 50%;
		transform: translate(-50%, -0%);
		opacity: 0.8;
	}
</style>
