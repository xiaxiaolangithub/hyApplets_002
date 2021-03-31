<template>
	<view class="couponDetailsPage">
		<view class="inner">
			<!-- 当前优惠券展示  -->
			<view class="car">
				<card-part :couponData="couponData" :backImg="backImg" :road="road" class="coupon_components"
					:tipImg="tipImg" :navIndex="type" :isDetail="true"></card-part>


				<!-- <image v-if="type==0" class="car_back" :src="realmImg('cardBag/noUsed.png')" mode="widthFix"></image>
				<image v-if="type==1" class="car_back" :src="realmImg('cardBag/soon.png')" mode="widthFix"></image>
				<image v-if="type==2" class="car_back" :src="realmImg('cardBag/invalid.png')" mode="widthFix"></image>
				<view class="left">
					<view class="left_title text_grey">{{couponObj.name}}</view>
					<view class="left_fill" v-if="couponObj.type === 'DEDUCTION'">{{couponObj.fill}}</view>
					<view class="left_fill"  v-if="couponObj.type === 'GIFT'">{{couponObj.giftName}}</view> -->
				<!-- 优惠券失效时间区间 -->
				<!-- <text class="left_date">{{couponObj.activeTime}}</text>
				</view>
				<view class="car_right" :style="road==='own'?'': 'padding-top:70rpx;'">
					<view class="right_top">
						<text class="price_icon">¥</text>
						<text class="price">{{couponObj.amount}}</text>
					</view> -->
				<!-- 卡包过来展示已失效和去使用，其他页面过来展示立即领取 -->
				<!-- <view class="right_bottom"  @tap="toUser(1)" v-if="road==='own'">
						<text class="coupon_text">{{type == 2 ? '已失效':'去使用'}}</text>
						<text class="iconfont icon-xiangyoujiantou" v-if="type!==2"></text>
					</view>
				</view> -->
			</view>
			<!-- 优惠券详情 -->
			<view class="detail_section">
				<view class="title">
					<text class="line"></text>
					{{couponObj.name}}
				</view>
				<view class="detail" v-if="road==='own'">
					<view class="detail_title">【优惠券码】</view>
					<text class="explain">{{couponObj.code}}</text>
				</view>
				<view class="detail" v-if="road==='center'">
					<view class="detail_title">【领取条件】</view>
					<text class="explain">所有登录用户。</text>
				</view>
				<view class="detail">
					<view class="detail_title">【适用门店】</view>
					<text class="explain">{{couponObj.applyShopName}}</text>
				</view>
				<view class="detail" v-if="road==='center'">
					<view class="detail_title">【领取期限】</view>
					<text class="explain">{{couponObj.getBeginTime}}</text>
				</view>
				<view class="detail">
					<view class="detail_title">【使用说明】</view>
					<view class="explain" v-html="couponObj.detail"></view>
				</view>
				<view class="detail" v-if="couponObj.custCarInfoList.length">
					<view class="detail_title">【该券仅限以下车辆使用】</view>
					<view class="detail_item" v-for="(item, index) in couponObj.custCarInfoList" :key="index">
						<image :src="realmImg('cardBag/star.png')" mode=""></image>
						{{item}}
					</view>
				</view>
				<!-- 从卡包过来的并且没有失效的券可以展示二维码 -->
				<view class="detail" v-if="road==='own'&&type!==2">
					<view class="detail_title">【券二维码】</view>
					<canvas canvas-id="qrcode" id="qrcode" class="qrcode" style="width: 180px; height: 180px"></canvas>
				</view>
				<view class="detail detail_list" v-if="couponObj.voucherVerifyRecordList.length > 0 && road !== 'center'">
					<view class="detail_title">【使用记录】</view>
					<scroll-view style="height: 450rpx;" scroll-y="true" class="scroll-Y">
						<view v-for="orderlist,index in couponObj.voucherVerifyRecordList" :key="index"
							:class="index%2 == 1 ? 'detail_order_02' : 'detail_order'">
							<text>{{ orderlist.verifyTime }}</text>
							<text>里程： {{ orderlist.mileage }}KM</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<!-- 底部详情 -->
		<!-- <cover-view class="coupon_footer" :class="couponObj.type==='DEDUCTION'?'':'special_footer'" v-if="road==='center'"  hover-class="handle_hover" :hover-stay-time="150" @tap="toUser(2)">
			<cover-view>立即领取</cover-view>
		</cover-view> -->
		<view class="coupon_footer" :class="couponObj.type==='DEDUCTION'?'':'special_footer'" v-if="road==='center'"
			hover-class="handle_hover" :hover-stay-time="150" @tap="toUser(2)">
			<view>立即领取</view>
		</view>
	</view>

</template>

<script>
	const qrCode = require('@/static/js/weapp-qrcode.js');
	import {
		receiveCoupon,
		goTaBar
	} from '@/utils/request.js'
	import {
		mapMutations
	} from 'vuex';
	import cardPart from '@/components/card_part.vue'
	export default {
		components: {
			cardPart
		},
		data() {
			return {
				road: '', // 从哪里跳转到当前页面 center是从领券中心来的，own是从当前卡包过来的 
				type: 0, // 优惠券属于哪种类型:0 未使用 、1 即将过期 、2 失效郑
				couponObj: {}, // 优惠券信息
				url: '', // 详情请求接口地址
				couponData: [],
				tipImg: this.realmImg('cardBag/new_line.png'), // 券提示图片	
				nameClass: 'newName', // 名称样式
			}
		},
		watch: {
			type(val, oldVal) {
				switch (val) {
					case 0:
						// 未使用
						this.nameClass = 'newName';
						break;
					case 1:
						// 即将过期
						this.tipImg = this.realmImg('cardBag/soon_line.png'), // 券提示图片
							this.nameClass = 'soonName';
						break;
					case 2:
						// 已失效
						this.nameClass = 'invalidName';
						break;

				}
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: couponObj.name,
			}
		},
		onLoad(e) {
			this.type = Number(e.type); // 0：未使用和road过来的；1：即将过期；2：已失效
			this.couponObj.id = Number(e.id); // 券ID
			this.road = e.road; // 从哪到券详情来的
			this.url = this.road === 'own' ? this.$apis.customerVoucherDetail : this.$apis.voucherCenterDetail;
			this.getCardDetail();
		},
		methods: {
			goToBottom() {
				uni.pageScrollTo({
				    scrollTop: 600,
				    duration: 200
				});
			},
			// 优惠券详情
			getCardDetail() {
				this.$http({
					url: this.url,
					method: 'GET',
					data: {
						id: this.couponObj.id
					},
					success: ((res) => {
						// if (res.data.type === 'GIFT_CARD') {
						// 	this.couponData[0] = res.data;
						// } else {
						this.transData(res.data);
						// }
					})
				})
			},
			// 详情数据处理
			transData(result) {
				let detail = result.detail;
				if (detail.charAt(detail.length - 1) === '\n') {
					detail = detail.slice(0, detail.length - 1)
				}
				this.couponObj = {
					name: result.name, // 名称
					fill: result.limitAmount === 0 ? '满任意金额可用' : `满${result.limitAmount}减${result.amount}`,
					amount: result.amount || 0,
					detail: detail.replace(/\n/g, '<br>'),
					code: result.code,
					id: this.couponObj.id,
					type: result.type,
					giftName: result.giftName,
					custCarInfoList: result.custCarInfoList || [],
					applyShopName: result.applyShopName,
					voucherVerifyRecordList: result.voucherVerifyRecordList
				}
				let statusName = '';
				switch (result.status) {
					case 'USED':
						statusName = '已使用';
						break;
					case 'EXPIRED':
						statusName = '已过期';
						break;
					case 'INVALID':
						statusName = '已作废';
						break;
				}
				this.couponData = [{
					amount: this.couponObj.amount,
					type: result.type,
					voucherName: result.name,
					giftName: result.giftName,
					limitAmount: result.limitAmount,
					id: this.couponObj.id,
					isNew: result.isNew === 'YES' ? 'YES' : 'NO',
					id: this.couponObj.id,
					statusName: statusName
				}]
				// 失效券背景用灰色，未使用和即将到期根据券类型来展示背景，未使用：橙色；即将到期：蓝色
				if (this.type !== 2) {
					this.couponData[0].backImg = result.type === 'DEDUCTION' ? this.realmImg('cardBag/new_back.png') : this
						.realmImg('cardBag/soon_back.png');
				} else {
					this.couponData[0].backImg = this.realmImg('cardBag/invalid_back.png');
				}



				if (this.road === 'center') {
					this.couponObj.getBeginTime =
						`${result.getBeginTime.replace(/-/g, '.')}-${result.getEndTime.replace(/-/g, '.')} `
					this.couponObj.activeDate = result.duration !== 0 ?
						`领取${result.activeInterval}天后生效，有效期${result.duration}天` :
						`${result.activeTime.replace(/-/g, '.')}-${result.failureTime.replace(/-/g, '.')} `
				} else {
					this.couponObj.activeDate =
						`${result.activeTime.replace(/-/g, '.')}-${result.failureTime.replace(/-/g, '.')} `
					if (result.remainDays !== null && this.type === 1) {
						this.couponData[0].remainDaysTip = result.remainDays === 0 ? `1天内到期` : `${result.remainDays}天后到期`
					}
				}
				console.log('result',result)
				if (this.road === 'center') {
					this.couponData[0].getBeginTime = this.couponObj.getBeginTime;
					this.couponData[0].activeDate = this.couponObj.activeDate;
					if (result.type === 'GIFT_CARD') {
						this.couponData[0].activeTime = result.activeTime;
						this.couponData[0].failureTime = result.failureTime;
						this.couponData[0].giftCount = result.giftCount;
						this.couponData[0].status = result.status;
					}
					console.log('deta',this.couponData)
				} else {
					this.couponData[0].getBeginTime = this.couponObj.getBeginTime;
					this.couponData[0].activeDate = this.couponObj.activeDate;
					if (result.type === 'GIFT_CARD') {
						this.couponData[0].activeTime = result.activeTime;
						this.couponData[0].failureTime = result.failureTime;
						this.couponData[0].giftCount = result.giftCount;
						this.couponData[0].status = result.status;
						if(result.voucherVerifyRecordList[0]){
							this.couponData[0].updateTime = result.voucherVerifyRecordList[0].verifyTime;
							this.couponData[0].mileage = result.voucherVerifyRecordList[0].mileage;
						}
					}
				}
				
				// 从卡包里来的券且不失效去展示二维码
				if (this.road === 'own' && this.type !== 2) {
					this.couponQrCode()
				}
			},
			// 二维码生成工具
			couponQrCode() {
				new qrCode('qrcode', {
					text: this.couponObj.code,
					width: 180,
					height: 180,
					colorDark: '#333333',
					colorLight: '#FFFFFF',
					correctLevel: qrCode.CorrectLevel.H
				});
			},

			//	去使用优惠券
			toUser(info) {
				if (this.type == 2) {
					return false;
				}
				if (info === 1) {
					goTaBar(1);
					return false;
				}
				// 不是卡包过来的领取优惠券操作
				receiveCoupon(this.couponObj.id);
			}
		}
	}
</script>
<style>
	.detail_order {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70rpx;
		padding: 10rpx 30rpx;
		background-color: #f7f7f7;
		color: #7E8596;
	}

	.detail_order_02 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70rpx;
		padding: 10rpx 30rpx;
		background-color: #FFFFFF;
		color: #7E8596;
	}
</style>
