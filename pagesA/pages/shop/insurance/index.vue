<template>
	<view class="insurance_index">
		<view class="box">
			<view class="insurance_top" style="font-size:25rpx;">
				<view @click="goType1"><text>全损换新
					补偿服务</text></view>
				<view @click="goType2"><text>大事故降价损失
					补偿服务</text></view>
			</view>
			<view class="insurance_list">
				<!-- 正常数据 -->
				<view v-if="dataList.length > 0">
					<view class="insurance_box" v-for="item in dataList" :key='item'>
						<view class="list_title">
							<view v-if="item.type == 'TOTAL_LOSS'">
								<view class="act"></view>全损换新补偿服务
							</view>
							<view v-if="item.type == 'ACCIDENT_PROTECT'">
								<view class="act"></view>大事故降价损失补偿服务
							</view>
							<view v-if="item.status == 'PROTECTING'">保障中</view>
							<view v-else-if="item.status == 'CANCELED'" style="color: #a0a0a0;">已取消</view>
							<view v-else-if="item.status == 'PAID'" style="color: #007AFF;">已支付</view>
							<view v-else-if="item.status == 'WAIT_PAY'" style="color: #EC612A;">待支付</view>
							<view v-else style="color: #a0a0a0;">已失效</view>
						</view>
						<view class="list_text">
							<view>
								<text>车牌号码</text>
								<text v-if="item.plateNo">{{item.plateNo}}</text>
								<text v-else>暂无</text>
							</view>
							<view>
								<text>保单号码</text>
								<text>{{item.code}}</text>
							</view>
							<view>
								<text>保障期限</text>
								<text v-if="item.insuranceDate">{{item.insuranceDate}}</text>
								<text v-else>暂无</text>
							</view>
						</view>
						<view class="list_button">
							<view @click="showDetail(item.id)">查看保单</view>
						</view>
					</view>
				</view>
				<!-- 缺省页 -->
				<view class="none" v-else>
					<image class="img" :src="realmImg('shopHome/none.png')" mode="widthFix"></image>
					<text>暂时没有保单</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 1,
				dataList: [],
			}
		},
		onShow() {
			this.getList();
		},
		onLoad() {

		},
		methods: {
			goType1() {
				uni.navigateTo({
					url: '/pagesA/pages/shop/insurance/detail?type=1'
				})
			},
			goType2() {
				uni.navigateTo({
					url: '/pagesA/pages/shop/insurance/detail?type=2'
				})
			},
			showDetail(id) {
				uni.navigateTo({
					url: '/pagesA/pages/shop/insurance/order?id=' + id
				})
			},
			getList() {
				this.$http({
					url: this.$apis.insuranceList,
					method: 'POST',
					data: {
						current: this.current, // 页码
						size: 10000 // 每页展示的记录数
					},
					success: ((res) => {
						this.dataList = res.data.records
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

	.none {
		padding-top: 200rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		.img {
			width: 415rpx;
		}
		text {
			text-align: center;
			width: 100%;
			display: block;
			color: #999999;
		}
	}
</style>
