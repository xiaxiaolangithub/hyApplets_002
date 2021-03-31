<template>
	<!-- 当前为领券中心、保养、洗车的券展示及领取操作 -->
	<view class="coupon_box" >
		<view class="list" v-for="(item, index) in couponData" :key="index">
			<view class="top" @tap="toDetail(item)">
				<view class="left">
					<view class="money">
						{{item.amount}}
						<text class="yuan">元</text>
					</view>
				</view>
				<view class="title">— <text>{{item.name}}</text> — </view>
			</view>
			<view class="bottom">
				<view class="bottom_info">
					<text class="fill">满{{item.limitAmount || '任意金额'}}可用</text>
					<text class="integral" v-if="item.exchangeIntegral">{{item.exchangeIntegral}}积分</text>
				</view>
				<view class="receive" hover-class="handle_hover" :hover-stay-time="150" @tap="tapReceive(item)">立即领取</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { receiveCoupon } from '@/utils/request.js'
	export default {
		props: ['couponData'],
		methods: {
			// 去优惠券详情页面
			toDetail(item) {
				uni.navigateTo({
					url: `/pagesA/pages/cardBag/couponDetails?id=${item.id}&type=${0}&road=center`
				})
			},
			// 领取优惠券
			tapReceive(item) {
				receiveCoupon(item.id);
			},
		}
	}
</script>

<style lang="scss">
	.coupon_box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding:0 30rpx;
		box-sizing: border-box;
		
	}
	.list{
		width:330rpx;
		margin-bottom: 30rpx;
	}
	.top{
		width:330rpx;
		height:311rpx;
		background: url('https://img.hangzhouhuiyao.cn/images/hycar/pointsMall/point_back.png') center center no-repeat;
		background-size: 100% 100%;
		padding-top:100rpx;
		padding-left:100rpx;
		box-sizing: border-box;
	}
	.money{
		text-shadow: 2px 3px 0px rgba(189, 65, 45, 0.62);
		font-size: 60rpx;
		color:#fff;
	}
	.yuan{
		font-size: 30rpx;
		margin-left: 8rpx;
	}
	.title{
		color:#fff;
		font-size: 16rpx;
		padding-left: 10rpx;
		text{
			margin:0 15rpx;
		}
	}
	.bottom{
		background:#fff;
		border-radius: 0 0 12rpx 12rpx;
		padding:20rpx 15rpx 30rpx 15rpx;
		box-sizing: border-box;
	}
	.bottom_info{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;
	}
	.fill{
		color:$uni-text-color-memo;
		font-size: 28rpx;
	}
	.integral{
		font-size: 24rpx;
		color:$uni-text-color-grey;
	}
	.receive{
		width:300rpx;
		height:56rpx;
		background:linear-gradient(-90deg,rgba(51,119,255,1),rgba(122,203,255,1));
		border-radius:10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color:#fff;
		font-size: 28rpx;
	}
</style>
