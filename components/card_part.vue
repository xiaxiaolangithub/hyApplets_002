<template>
	<!-- 当前这个组件为卡包及券详情的组件 -->
	<view>
		<view v-for="(list, index) in couponData" :key="index">
			<!-- //优惠券入口 -->
			<view v-if="list.type !== 'GIFT_CARD' && isSource !== 'changeCard'" class="list" @tap="toDetail(list)">
				<img class="back_img" :src="list.backImg"></img>
				<img class="tip_img" :src="realmImg('cardBag/new_line.png')"
					v-if="list.isNew==='YES'&&navIndex==0"></img>
				<!-- 即将到期都要有标注即将到期 -->
				<img class="tip_img" :src="realmImg('cardBag/soon_line.png')" v-if="navIndex===1"></img>
				<view class="left">
					<!-- 券换券并且礼品金额为0的时候显示1张 -->
					<view class="price" style="margin-bottom: 12px;" v-if="list.type==='GIFT'&&list.amount===0">1张
					</view>
					<view class="price" v-else>
						<text class="price_icon">¥</text>
						{{list.amount || 0}}
					</view>
					<view class="type">{{list.type === 'DEDUCTION' ? '代金券' : list.type === 'GIFT' ? '兑换券' : '兑换卡'}}
					</view>
				</view>
				<view class="middle">
					<!-- 区分代金券、兑换券、失效券3种情况券名称的样式 -->
					<view class="name" v-if="navIndex!==2" :class="list.type==='DEDUCTION'?'newName':'soonName'">
						{{list.voucherName}}
					</view>
					<view class="name invalidName" v-else="navIndex===2">{{list.voucherName}}</view>

					<view class="fill" v-if="list.type==='GIFT'">{{list.giftName}}</view>
					<view class="fill" v-else>{{list.limitAmount === 0 ? '满任意金额可用' : `满${list.limitAmount}元使用`}}</view>
					<view class="date" v-if="navIndex!==1">有效期:{{list.activeDate}}</view>
					<!-- 只有即将到期才会有这个展示 只有即将到期列表展示，如果为0，则为1天内到期-->
					<view class="expire" v-if="road==='own'&&navIndex===1">{{list.remainDaysTip}}</view>
				</view>
				<view class="right">
					<!-- @click.stop="toUser" -->
					<view class="btn" hover-class="handle_hover" :class="list.type==='DEDUCTION'?'newBtn':'soonBtn'"
						v-if="navIndex!==2&&road==='own'">去使用</view>
					<view class="btn" hover-class="handle_hover" :class="list.type==='DEDUCTION'?'newBtn':'soonBtn'"
						v-if="road==='center'" @click.stop="receiveCoupon(list)">立即领取</view>
					<view class="invalid_text" v-if="navIndex===2">{{list.statusName}}</view>
				</view>
			</view>


			<!-- //卡包兑换卡入口 -->
			<view v-if="list.type === 'GIFT_CARD' && isSource !== 'cardBag'" class="list giftcard_list"
				@tap="toDetail(list)">
				<!-- 背景  -->
				<view v-if="road == 'own'">
					<img class="back_img" v-if="index % 3 === 0 && list.status === 'UNUSED'" :src="realmImg('cardBag/card_bg_01.png')"></img>
					<img class="back_img" v-if="index % 3 === 1 && list.status === 'UNUSED'" :src="realmImg('cardBag/card_bg_02.png')"></img>
					<img class="back_img" v-if="index % 3 === 2 && list.status === 'UNUSED'" :src="realmImg('cardBag/card_bg_03.png')"></img>
					<img class="back_img" v-if="list.status !== 'UNUSED'" :src="realmImg('cardBag/card_bg_04.png')"></img>
				</view>
				<view v-else>
					<img class="back_img" v-if="list.status === 'ENABLED'" :src="realmImg('cardBag/card_bg_01.png')"></img>
					<img class="back_img" v-else="list.status !== 'ENABLED'" :src="realmImg('cardBag/card_bg_04.png')"></img>
				</view>
				
				<!-- 左上角新获得和即将到期标记 -->
				<img class="tip_img" :src="realmImg('cardBag/new_line.png')"
					v-if="list.isNew==='YES'&&navIndex==0"></img>
				<img class="tip_img" :src="realmImg('cardBag/soon_line.png')" v-if="navIndex===1"></img>

				<view class="giftcard_main">
					<view class="giftcard_left">
						<view class="giftcard_title">
							<img class="main_img" :src="realmImg('cardBag/card_icon.png')"></img>
							<view>{{list.voucherName}}</view>
						</view>
						<view class="giftcard_text">
							{{list.giftName}}
						</view>
						<view class="giftcard_text">
							有效期:{{list.activeTime}} - {{list.failureTime}}
						</view>
						<view class="giftcard_text">
							使用次数:{{list.giftCount == -1 ? '无限制' : '余' + list.giftCount + '次'}}
						</view>
					</view>
					<view class="giftcard_right"
						:class="index % 3 === 0 ? 'giftcard_right_01' : index % 3 === 1 ? 'giftcard_right_02' : index % 3 === 2 ? 'giftcard_right_03' : ''">
						<view class="btn" hover-class="handle_hover" :class="list.type==='DEDUCTION'?'newBtn':'soonBtn'"
							v-if="navIndex!==2&&road==='own'">去使用</view>
						<view class="btn" hover-class="handle_hover" :class="list.type==='DEDUCTION'?'newBtn':'soonBtn'"
							v-if="road==='center'" @click.stop="receiveCoupon(list)">立即领取</view>
						<view class="invalid_text" v-if="navIndex===2">{{list.statusName}}</view>
					</view>
				</view>

				<view class="giftcard_bottom" @tap="goToBottomChild()" v-if="road !== 'center'">
					<view>
						上次使用时间：{{ list.updateTime ? list.updateTime : '暂无' }}
					</view>
					<view>
						{{ list.mileage ? list.mileage : '暂无' }}KM
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		receiveCoupon,
		goTaBar
	} from '@/utils/request.js'
	export default {
		props: {
			couponData: { // 券对象
				type: Array,
				required: true
			},
			tipImg: {
				type: String, // 当前券提示，新获得，即将到期，只有从卡包、卡包过来的详情才会有展示
			},
			navIndex: {
				type: Number, // 从卡包过来的券类型，0：未使用；1：即将到期；2：失效券
			},
			isDetail: {
				type: Boolean, // 调用该组件的是卡包页面，还是券详情页面，卡包页面有跳转到券详情提示
			},
			road: {
				type: String, // 
				required: true
			},
			isSource: {
				type: String //判断来源
			}

		},
		mounted() {
		},
		methods: {
			// 去页面详情
			toDetail(list) {
				// 从卡包过来的可以跳转到券详情页面
				if (!this.isDetail) {
					uni.navigateTo({
						url: `/pagesA/pages/cardBag/couponDetails?type=${this.navIndex}&id=${list.id}&road=own`
					})
				}
			},
			// 回到商城
			toUser() {
				goTaBar(1);
			},
			// 不是卡包过来的领取优惠券操作
			receiveCoupon(list) {
				receiveCoupon(list.id);
			},
			goToBottomChild() {
				this.$parent.goToBottom();
			}
			
		},
	}
</script>

<style lang="scss">
	.list {
		margin: 30rpx 0;
		width: 100%;
		height: 180rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		position: relative;

		.back_img {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
		}

		.tip_img {
			position: absolute;
			left: 0;
			top: 0;
			width: 90rpx;
			height: 109rpx;
			z-index: 0;
		}

	}

	.left {
		width: 192rpx;
		height: 100%;
		padding: 52rpx 0 40rpx;
		box-sizing: border-box;
		text-align: center;
		color: #fff;
		font-family: Yuanti SC;

		.price_icon {
			font-size: 30rpx;
			font-weight: normal;
		}

		.price {
			font-size: 74rpx;
			line-height: 45rpx;
			font-weight: bold;
		}

		.type {
			font-size: 24rpx;
		}
	}

	.middle {
		width: 340rpx;
		height: 100%;
		padding: 28rpx 0 0 20rpx;
		box-sizing: border-box;

		.name {
			font-size: 38rpx;
			font-weight: bold;
			font-family: Yuanti SC;
		}

		.newName {
			background: linear-gradient(0deg, #EB6152 0%, #F5D283 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			opacity: 0.84;
			color: #464646;
		}

		.soonName {
			background: linear-gradient(0deg, #5E71FF 0%, #ACDBFF 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			opacity: 0.84;
			color: #464646;
		}

		.invalidName {
			background: linear-gradient(0deg, #CBD5DC 0%, #7281A3 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			opacity: 0.84;
			color: #464646;
		}

		.fill {
			font-size: 28rpx;
			color: $uni-text-color-grey;
			margin-top: 10rpx;
			font-weight: 500;
			opacity: 0.84;
		}

		.date,
		.expire {
			font-size: 22rpx;
			font-weight: 500;
			color: #979CA7;
			opacity: 0.86;
		}

		.expire {
			color: $uni-text-color-price;
		}
	}

	.right {
		width: 158rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		.btn,
		.soonBtn {
			width: 140rpx;
			height: 80rpx;
			background: linear-gradient(0deg, #EB6152 0%, #F5D283 100%);
			border-radius: 14rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			line-height: 80rpx;
		}

		.soonBtn {
			background: linear-gradient(0deg, #5E71FF 0%, #ACDBFF 100%);
		}

		.invalid_text {
			font-size: 32rpx;
			font-weight: bold;
			color: #FFFFFF;
			background: linear-gradient(0deg, #CBD5DC 0%, #7281A3 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}

	.giftcard_list {
		height: 300rpx;
		flex-wrap: wrap;
		color: #FFFFFF;

		.giftcard_main {
			height: 240rpx;
			width: 100%;
			display: flex;
			align-items: center;

			.giftcard_left {
				font-size: 27rpx;
				width: 460rpx;
				padding-left: 60rpx;

				.giftcard_title {
					display: flex;
					font-size: 38rpx;
					padding-top: 15rpx;

					view {
						font-weight: bold;
						margin-left: 15rpx;
					}
				}

				.main_img {
					width: 50rpx;
					height: 50rpx;
				}

				.giftcard_text {
					margin: 10rpx 0;
				}
			}

			.giftcard_right {

				.btn,
				.soonBtn {
					width: 140rpx;
					height: 80rpx;
					background: linear-gradient(0deg, #EB6152 0%, #F5D283 100%);
					border-radius: 14rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #FFFFFF;
					text-align: center;
					line-height: 80rpx;
				}

				.soonBtn {
					background: linear-gradient(0deg, #5E93FF 0%, #ACDBFF 100%);
				}

				.invalid_text {
					font-size: 32rpx;
					font-weight: bold;
					color: #FFFFFF;
					background: linear-gradient(0deg, #CBD5DC 0%, #7281A3 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}
			.giftcard_right_01{
				.soonBtn {
					background: linear-gradient(0deg, #5E93FF 0%, #ACDBFF 100%);
				}
			}
			.giftcard_right_02{
				.soonBtn {
					background: linear-gradient(0deg, #EB6152 0%, #F5D283 100%);
				}
			}
			.giftcard_right_03{
				.soonBtn {
					background: linear-gradient(0deg, #3377FF 0%, #7ACBFF 100%);
				}
			}
		}

		.giftcard_bottom {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			font-size: 22rpx;
			height: 60rpx;
			width: 100%;
			background-color: #FFFFFF60;
		}
	}
</style>
