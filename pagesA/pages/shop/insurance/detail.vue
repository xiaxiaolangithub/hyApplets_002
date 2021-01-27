<template>
	<view class="insurance_detail">

		<view class="box">
			<view class="detail_top" v-for="(item,index) in insuranceData" :key="index">
				<image class="img" :src="realmImg(item.img)" mode="widthFix"></image>
				<view class="detail_top_title">
					<view></view>
					<view v-if="type == 1">全损换新补偿服务</view>
					<view v-else>大事故降价损失补偿服务</view>
				</view>
				<view class="detail_top_text">
					<view>合同期限</view>
					<view style="color:#7E8596;">{{ item.year }}年</view>
				</view>
				<view class="detail_top_text">
					<view>等待期</view>
					<view style="color:#7E8596;">{{ item.day }}天</view>
				</view>
				<view class="detail_top_title2">
					<view>保障详情</view>
				</view>
				<view>
					<view style="color:#7E8596;">{{ item.detail }}</view>
				</view>
			</view>

			<view class="detail_main" v-if="type == 1">
				<view class="detail_main_title">
					<view></view>
					<view>购买要求</view>
				</view>
				<text>1.新车销售之日起 36 个月内的车辆（非二手车）；</text>
				<text>2.车辆必须按照厂家车辆使用手册、厂家说明书等相关规定使用；</text>
				<text>3.车辆使用性质为非营运、非公共服务用途车辆、非比赛竞赛用车，座位在 9 座以下；</text>
				<text>4.车辆为非试乘试驾车、非租赁公司车辆；</text>
				<text>5.满足“全损换新服务的前提条件”且不存在“全损换新服务除外情形”。</text>
			</view>

			<view class="detail_main" v-else>
				<view class="detail_main_title">
					<view></view>
					<view>购买要求</view>
				</view>
				<text>1.与汽车经销商签订服务合同车主的机动车辆；</text>
				<text>2.已投保《机动车辆商业保险示范条例》车损险，且投保时车辆必须持有还处于保险期限内的商业车险保单；商业险投保公司无限制；</text>
				<text>3.车辆必须按照厂家车辆使用手册、厂家说明书等相关规定使用；</text>
				<text>4.车辆使用行者为非营运、非公共服务用途车辆和非比赛竞赛用车；</text>
				<text>5.车辆为非试乘试驾车、非租赁公司车辆；</text>
				<text>6.车龄为0~36个月以内的非营运车辆。</text>
			</view>

			<view class="detail_bottom">
				<label class="radio detail_tadio" @click="clickRadio" v-if="isRead == false">
					<radio value="r1" />请确认已仔细阅读<view @click.stop="goRead">{{ title }}</view>
				</label>
				<label class="radio detail_tadio" @click="clickRadio" v-if="isRead == true">
					<radio value="r2" checked='true' />请确认已仔细阅读<view @click.stop="goRead">{{ title }}</view>
				</label>
				<view class="redio_button" @click="goSave">立即投保</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: null, //保险类型
				pageTitle: '',
				title: '',
				orderData: [{
					//全损换新补偿服务
					img: '/goods/insurance-type-title2.png',
					year: 3,
					day: 1,
					detail: '在服务有效期内，客户可享受一次全损换新服务。',
					url: 'https://jbb-common.oss-cn-hangzhou.aliyuncs.com/orBrt1ikIS0LM4xNJ8Wa.pdf'
				}, {
					//大事故降价损失补偿服务
					img: '/goods/insurance-type-title1.png',
					year: 1,
					day: 3,
					detail: '最高新车销售指导价格*15%的事故保障。',
					url: 'https://jbb-common.oss-cn-hangzhou.aliyuncs.com/ucoyNjd8wvqgwabppLWN.pdf'
				}],
				insuranceData: {},
				isRead: false,
				webUrl: '',
				premiumRatio: null,
			}
		},
		onLoad(option) {
			this.type = option.type;
			if (this.type == 1) {
				this.pageTitle = '全损换新补偿服务';
				this.title = '《全损换新补偿服务合同》';
				this.insuranceData[0] = this.orderData[0];
			} else {
				this.pageTitle = '大事故降价损失补偿服务';
				this.title = '《大事故降价损失补偿服务合同》';
				this.insuranceData[0] = this.orderData[1];
			}
			uni.setNavigationBarTitle({
				title: this.pageTitle
			})
		},
		methods: {
			clickRadio() {
				this.isRead = !this.isRead;
			},
			goSave() {
				if (this.isRead) {
					if (this.type == 1) {
						this.getPremiumRatio('TOTAL_LOSS')

					} else {
						this.getPremiumRatio('ACCIDENT_PROTECT')
					}
				} else {
					uni.showToast({
						title: '请仔细阅读服务合同。',
						icon: 'none'
					});
				}
			},
			getPremiumRatio(name) {
				this.$http({
					url: this.$apis.getPremiumRatio + '?type=' + name,
					method: 'GET',
					success: ((res) => {
						if (res.code == 1) {
							if (name == 'TOTAL_LOSS') {
								uni.navigateTo({
									url: '/pagesA/pages/shop/insurance/form?type=1' + '&premiumRatio=' + res.data
								})
							} else {
								uni.navigateTo({
									url: '/pagesA/pages/shop/insurance/form?type=2' + '&premiumRatio=' + res.data
								})
							}

						} else {
							uni.showToast({
								title: '门店暂未开放保值服务申请，敬请期待',
								icon: 'none'
							});
						}
					})
				})
			},
			goRead() {
				uni.previewImage({
					current: 0,
					urls: this.type === '1' ? ['https://img.hangzhouhuiyao.cn/images/hycar/pdf/2.jpg'] : [
						'https://img.hangzhouhuiyao.cn/images/hycar/pdf/1.jpg'
					]
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #F8F6F9;
	}
</style>
