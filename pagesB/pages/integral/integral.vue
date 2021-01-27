<template>
	<view class="integralPage">
		<view class="user_section">
			<!-- 页面返回与回商城 -->
			<quickBar :title="pageTitle" :backgroundColor="backgroundColor"/>
			
			<!-- 积分 -->
			<view class="integral_section">
				<view class="left">
					<text class="num">{{signObj.integralNum}}</text>积分
				</view>
				<!-- <view class="right" @tap="goPointsMall" hover-class="handle_hover">
					<text>积分商城</text>
					<text class="iconfont icon-xiangyoujiantou"></text>
				</view> -->
			</view>
			
			<!-- 签到 -->
			<view class="sign_section" v-if="signData.length > 0">
				<view class="sign_top">
					连续签到<text class="sign_days">{{signObj.signDays}}</text>天
				</view>
				<view class="sign_list">
					<view class="list" v-for="(sign, index) in signData.slice(0,6)" :key="index" :class="index+1<=signObj.signDays?'signed':''">
						<view class="list_day">第{{index+1}}天</view>
						<image class="img" :src="realmImg('integral/integral.png')" mode="widthFix"></image>
						<view class="list_num" >{{sign.integral}}积分</view>
					</view>
					<view class="last_list" :class="signObj.signDays===7? 'signed':''">
						<view class="list_day">第7天</view>
						<view class="text">{{signData[6].integral}}积分</view>
						<view class="image">
							<image :src="realmImg('integral/money.png')" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<button class="sign_btn noCan" v-if="signObj.isSign">今日已签到</button>
				<button class="sign_btn can" v-else hover-class="handle_hover" @tap="handleSign">点击签到</button>
			</view>
			
			<!-- 每日任务 -->
			<view class="task_section">
				<view class="title_change">
					<view class="top_title" v-for="(info, index) in infoData" :key="index" @tap="tapTitle(index)">
						<view class="title" :class="index==titleIndex?'active_title':''">{{info}}</view>
						<view class="img_line">
							<image v-if="index==titleIndex" :src="realmImg('cardBag/line.png')" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<view class="list" v-for="(item, index) in taskData" :key="index">
					 <view class="task_left">
						<image :src="realmImg('integral/integral.png')" mode="widthFix"></image>
						 <view class="task_info">
							<view class="task_text">{{item.name}}</view>
							<text class="task_num">奖励{{item.integral}}积分</text>
						 </view>
					 </view>
					 <view class="task_right" v-if="item.status">已完成</view>
					 <view v-else class="task_nocomplete" hover-class="handle_hover"  @tap="goWork(item.code)">去完成</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import quickBar from "@/components/quickBar.vue"
	import { goTaBar, goPages } from '@/utils/request.js'
	export default {
		components:{
			quickBar
		},
		data() {
			return {
				pageTitle: '积分任务',
				backgroundColor: "transparent",
				type: '日常任务',						// 哪种类型
				infoData: ['日常任务','新手任务'],  		// 标题数据
				signObj: {
					isSign: false, 							// 今日是否已签到
					integralNum: 600,						// 共多少积分
					signDays: 2,							// 共签到几天
				},
				titleIndex: 0,							// 当前点击中哪个标题
				signData: [],							// 签到数据
				taskData: []							// 每日完成数据
			}
		},
		onShow() {
			// 得到签到记录
			this.getSignRecords();
			// 得到积分任务列表
			this.getSignList();
		},
		methods:{
			// 得到签到记录
			getSignRecords() {
				this.$http({
					url: this.$apis.getSignRecords,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.signData = result.details || [];
						this.signObj.signDays = result.checkInDays; 											// 总签到天数
						this.signObj.isSign = result.todStatus; 												// 今日是否已签到
						this.signObj.integralNum = result.integral;												// 总签到积分
					})
				})
			},
			// 用户签到
			handleSign() {
				this.$http({
					url: this.$apis.handleSign,
					method: 'GET',
					success: ((res) => {
						if(res.data) {
							uni.showToast({
								title: '签到成功 ！',
							});
							this.getSignRecords(); 
						}
					})
				})
			},
			// 得到积分任务列表
			getSignList() {
				this.$http({
					url: this.$apis.getIntegralList,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.taskData = (result.filter(ele => ele.taskName === this.type))[0].list;
					})
				})
			},
			// 切换标题
			tapTitle(index) {
				this.titleIndex = index;
				this.type = index === 0 ? '日常任务' : '新手任务';
				this.getSignList();
			},
			// 去积分商城
			goPointsMall() {
				uni.navigateTo({
					url: './pointsMall'
				});
			},
			// 去完成任务
			goWork(code) {
				switch(code) {
					case 'reservation-product':
						// 回到商城
						goTaBar(1);
						break;
					case 'reservation-pro-service':
						// 预约专属服务
						goTaBar(2);
						break;
					case 'reservation-maintain':
						// 预约保养
						uni.navigateTo({
							url: '/pages/shop/reserve/maintain'
						})
						break;
					case 'reservation-wash-car':
						// 预约洗车
						uni.navigateTo({
							url: '/pages/shop/reserve/carWash'
						});
						break;
					case 'add-inquiry':
						// 提交询价
						goPages('carList');
						break;
					default:
						// 完善车辆信息、首次添加车辆
						goPages('carDossier')
						break;
				}
			}
		}
	}
</script>

<style>
	page{
		background: #F7F7F7;
	}
</style>