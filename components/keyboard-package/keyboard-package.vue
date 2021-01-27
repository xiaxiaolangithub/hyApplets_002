<template>
	<uni-popup :custom="true" type="bottom" ref="keyboardPackage">
		<view class="keyboardbox">
			<view class="numkeyboard" v-if="type==='number'">
				<view class="num-area">
					<view class="row" v-for="(item,index) in numKeybordList" :key="index">
						<view :class="['item',ite===0?'z':'',(disableDot && ite==='.')?'disabled':'']" v-for="(ite,idx) in item"
						 hover-class="active" :hover-start-time="0" :hover-stay-time="5" :key="idx" @tap="input(ite)">{{ite}}</view>
					</view>
				</view>
				<view class="btn-area">
					<view :class="['item','del']" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="deleteVal">
						删除
					</view>
					<view class="confirem item" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="confirm">
						完成
					</view>
				</view>
			</view>

			<view class="numkeyboard" v-if="type==='idCard'">
				<view class="num-area">
					<view class="row" v-for="(item,index) in idCardList" :key="index">
						<view :class="['item',ite===0?'z':'',(disableDot && ite==='.')?'disabled':'']" v-for="(ite,idx) in item"
						 hover-class="active" :hover-start-time="0" :hover-stay-time="5" :key="idx" @tap="input(ite)">{{ite}}</view>
					</view>
				</view>
				<view class="btn-area">
					<view :class="['item','del']" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="deleteVal">
						删除
					</view>
					<view class="confirem item" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="confirm">
						完成
					</view>
				</view>
			</view>

			<view class="platenumber" v-if="type==='plateNumber'">
				<view class="header">
					<view ></view>
					<!-- <view @tap="active=active===1?2:1" hover-class="active" :hover-start-time="0" :hover-stay-time="5">{{active===1?'车牌号':'地区'}}</view> -->
					<view hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="confirm">完成</view>
				</view>
				<view class="main">
					<view class="normal" v-if="active===2">
						<view class="row" v-for="(item,index) in EngKeyBoardList" :key="index">
							<view class="item" v-for="(ite,idx) in item" :key="idx" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="input(ite)">
								{{ite}}
							</view>
							<view class="item img" v-if="index===EngKeyBoardList.length-1" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="deleteVal">
								<image src="/static/img/delete.png" mode=""></image>
							</view>
						</view>
					</view>
					<view class="area" v-if="active===1">
						<view class="row" v-for="(item,index) in areaList" :key="index">
							<view class="item" v-for="(ite,idx) in item" :key="idx" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="inputArea(ite)">
								{{ite}}
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
			active: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				numKeybordList: [
					[1, 2, 3],
					[4, 5, 6],
					[7, 8, 9],
					[0, '.']
				],
				idCardList: [
					[1, 2, 3],
					[4, 5, 6],
					[7, 8, 9],
					[0, 'X']
				],
				areaList: [
					['京', '沪', '粤', '津', '冀', '豫', '云', '辽', '黑', '湘'],
					['皖', '鲁', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '陕'],
					['蒙', '吉', '闽', '贵', '渝', '川', '青', '琼', '宁'],
					['藏', '新', '使', '港', '澳', '学']
				],
				EngKeyBoardList: [
					[1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
					['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
					['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
					['Z', 'X', 'C', 'V', 'B', 'N', 'M']
				],
			};
		},
		computed:{
			arr() {
				let newArr = [];
				for (var i = 0; i < this.areaList.length; i++) {
						for (var j = 0; j < this.areaList[i].length; j++) {
							newArr.push(this.areaList[i][j]);
						}
					}
					return newArr;
			}
		},
		methods: {
			open() {
				this.$refs.keyboardPackage.open();
			},
			confirm() {
				this.$emit('onConfirm');
				this.close();
			},
			deleteVal() {
				this.$emit('onDelete');
			},
			input(val) {
				if (val === '.' && this.disableDot) return;
				this.$emit('onInput', val);
			},
			// 选择车牌号地区
			inputArea(val) {
				this.$emit('onInputArea', val);
			},
			close() {
				this.$refs.keyboardPackage.close();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.keyboardbox {
		background: #FFFFFF;

		.numkeyboard {
			height: 432rpx;
			display: flex;
			background: #ebedf0;

			.btn-area {
				width: 180rpx;
				height: 100%;
				display: flex;
				flex-direction: column;

				.item {
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-grow: 1;
				}

				.del {
					background: #ebedf0;
					color: #333;

					&.active {
						background: #f1f3f5;
					}
				}

				.confirem {
					background: #1989fa;
					color: #FFFFFF;

					&.active {
						background: #0570db;
					}
				}
			}

			.num-area {
				flex-grow: 1;
				display: flex;
				flex-wrap: wrap;

				.row {
					width: 100%;
					height: 25%;
					display: flex;
					margin-top: 1px;

					.item {
						flex-grow: 1;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						background: #FFFFFF;
						border-right: 1px solid #ebedf0;
						width: 33.33%;
						
						&.active {
							background: #ebedf0;
						}

						&.z {
							flex-grow: 2;
							width: 66.66%;
						}

						&.disabled {
							background: #FFFFFF;
							color: #B9B9B9;
						}
					}
				}

			}
		}
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
					width: 64rpx;
					height: 94rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #FFFFFF;
					border-radius: 6rpx;
					margin: 0 7rpx;
					font-size: 32rpx;
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
