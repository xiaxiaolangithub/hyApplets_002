<template>
	<view class="confirmMaintainPage">

		<!-- 选择的汽车 -->
		<view class="page_top">
			<!-- 保养套餐不可选择车 -->
			<view class="left" v-if="type == 'select'">
				<image class="img" :src="realmImg('maintain/car.png')" mode="widthFix"></image>
				<view class="name">{{optData.carName}}</view>
			</view>
			<!-- 洗车选择车 -->
			<view class="left" v-if="type == 'wash'" @tap="tapCar">
				<image class="img" :src="realmImg('maintain/car.png')" mode="widthFix"></image>
				<view class="name" v-if="carObj.brandName">{{carObj.brandName}} {{carObj.seriesName}}</view>
				<view class="name" v-else>添加爱车 </view>
				<text class="iconfont icon-xiangyoujiantou"></text>
			</view>
			<view class="right" v-if="optData && type == 'select'">当前车程{{optData.mileage}}公里</view>
		</view>

		<!-- 已选商品/服务 -->
		<view class="maintain_box">
			<view class="top">已选商品/服务</view>
			<!-- 预约美容 -->
			<view class="collapse_box" v-if="type == 'select'">
				<block v-for="(item,index) in maintainData" :key="index">
					<tui-collapse :index="index" :current="item.current" :disabled="item.disabled" @click="tapMaintain(index)">
						<template v-slot:title>
							<view class="collapse_top">
								<tui-list-cell>
									<view class="title" :hover="!item.disabled">
										<view class="main">{{item.title}}</view>
										<view class="vice">{{item.vice}}</view>
									</view>
								</tui-list-cell>
							</view>
						</template>
						<template v-slot:content>
							<view class="tui-content">
								<checkbox-group class="check_group">
									<view v-for="(detail, i) in item.details" :key="i" class="detail_list">
										<view class="detail_content">{{detail}}</view>
									</view>
									<view class="tips">*以上项目仅为预设参考，到店可按需调整</view>
								</checkbox-group>
							</view>
						</template>
					</tui-collapse>
				</block>
			</view>
			<!-- 预约洗车 -->
			<view class="collapse_box" v-if="type == 'wash'" style="font-size:44rpx;font-weight:bold;margin:35rpx 30rpx;">
				<text>常规洗车</text>
			</view>

			<!-- 占位栏 -->
			<view class="place"></view>

			<!-- 选择服务时间 -->
			<view class="time_box">
				<view class="time_top title">选择服务时间</view>
				<view class="list">
					<!-- <view class="title">预约到店时间</view> -->
					<!-- 预约保养 -->
					<picker v-if="type == 'select'" class="value" mode="multiSelector" @columnchange="bindPickerChange" :value="index"
					 :range="timeArray">
						<text :class="endDate == '选择服务时间'? 'date_hoder': ''">{{startDate}} {{endDate}}</text>
						<!-- <text class="iconfont icon-xiangyoujiantou"></text> -->
					</picker>
					<!-- 预约洗车 -->
					<view class="uni-list-cell" v-if="type == 'wash'">
						<!-- 	<view class="uni-list-cell-left">
							当前选择
						</view> -->
						<view @tap="closePop(true)" class="value">
							<text :class="endDate == '选择服务时间'? 'date_hoder': ''">{{date || '选择服务时间'}}</text>
							<text class="iconfont icon-xiangyoujiantou"></text>
						</view>
					</view>

				</view>
				<!-- 取消、确定按钮 -->
				<view class="handle">
					<button class="confirm" @tap="applyConfirm">确定</button>
				</view>
			</view>
			<!-- 占位栏 -->
			<view class="place"></view>

			<!-- 预约服务流程 -->
			<order-process></order-process>
		</view>

		<!-- 插件地址： https://ext.dcloud.net.cn/plugin?id=891 -->
		<long-date :isPopup="isPopup" @closePop="closePop" type="day" getDayNum="7" :openStatus="true" chooesMaxDay="7"
		 @select="onSelectTime"></long-date>

	</view>
</template>

<script>
	import tuiCollapse from "@/components/tui-collapse/tui-collapse.vue"
	import tuiListCell from "@/components/tui-list-cell/tui-list-cell.vue"
	import longDate from "@/components/long-date/long-date.vue"
	import orderProcess from "@/components/order-process.vue"
	import {
		goPages
	} from '@/utils/request.js'
	import { getCurrentDate } from '@/static/js/tool.js'
	import {
		mapMutations
	} from 'vuex';
	export default {
		components: {
			longDate,
			tuiCollapse,
			tuiListCell,
			orderProcess
		},
		data() {
			// const currentDate = this.getDate({
			// 	format: true
			// })
			return {
				pageTitle: '',
				type: '',
				time: '00:00',
				date: '',
				isPopup: false, // 是否显示时间选择
				title: 'picker',
				timeArray: [],
				index: 0,
				// 车程
				distance: null,
				// 当前保养的汽车名称
				carName: '',
				// 保养项目数据
				maintainData: [{
					title: '',
					vice: '',
					current: -1,
					disabled: false,
					details: [],
				}],
				// 预约到店时间
				endDate: '请选择预约到店时间',
				startDate: '',
				// 是否有填入值
				isFill: false,
				//路由接收的参数
				optData: {
					brandId: null,
					seriesId: null,
					details: [],
					mileage: null,
					carName: '',
					mainId: null, //保养套餐ID
					carId: null,
				},
				oldTimeList: [],
				postTime: {
					mileage: null, //  车程
					type: 'MAINTAIN', //  预约类型
					reachTime: '', //  到店日期
					item: '', //  项目名
					detail: [], //  保养套餐明细
					appointmentRemainId: null, //  预约时间段id
					reachStartTime: "", //  预约时间段起始时间
					reachEndTime: "", //  预约时间段终止时间
					maintainPackageId: null, //  保养套餐id
					customerCarId: null //  用户指定的车辆id 
				},
				carObj: {}, //当前选择车辆
				scIndex: 0,
				msgIdList: [], //显示的模板条目
				msgList: [],
				noticeList: [],
			}
		},
		onLoad(options) {
			this.type = options.type;
			if (this.type == 'select') {
				this.pageTitle = '预约保养'
			} else {
				this.pageTitle = '预约洗车'
			}
			uni.setNavigationBarTitle({
			　　title: this.pageTitle
			})
			this.getTimeList();
			if (this.type == 'select') {
				this.optData.brandId = options.brandId;
				this.optData.seriesId = options.seriesId;
				let str = String(options.details);
				this.optData.details = str.split(',');
				this.optData.mileage = options.mileage;
				this.optData.carName = options.carName;
				this.optData.mainId = options.mainId;
				this.optData.carId = options.carId;
				this.getMaintain();
			} else {
				this.getCarList();
			}
			this.getConfirm();
		},
		methods: {
			...mapMutations([
				'setBottomNavigationIndex'
			]),
			// 返回上一级
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 回到首页
			goHome() {
				this.setBottomNavigationIndex(1);
				uni.switchTab({
					url: '/pages/shop/goods/shopHome'
				});
			},
			// 当前点击到哪个保养项目
			tapMaintain(index) {
				let item = this.maintainData[index];
				item.current = item.current == index ? -1 : index
			},
			//获取保养信息
			getMaintain() {
				this.$http({
					url: this.$apis.maintainPackageList,
					data: {
						current: 1, //  页码    -   必传
						size: 100, //  条数
						brand: this.optData.brandId, //  品牌    -   可选
						series: this.optData.seriesId, //   车系    -   可选
						mileage: this.optData.distance, //    车程    -   可选
					},
					success: ((res) => {
						let arr = res.data.filter(item => item.id == this.optData.mainId);
						let showData = [];
						this.maintainData[0].title = arr[0].name;
						this.maintainData[0].vice = `建议${arr[0].mileageRequire}KM或者${arr[0].onloadTimeRequire}个月/次`;
						let str = String(this.optData.details);
						this.maintainData[0].details = str.split(',');
					})
				})
			},
			getConfirm() {
				this.$http({
					url: this.$apis.shopSubMsgTemplateList + '?triggerPosition=' + 1,
					method: 'GET',
					success: ((res) => {
						this.msgList = res.data; //模板条目总列表
						this.msgList.find((item) => {
							this.msgIdList.push(item.templateId)
						})
					})
				})
			},
			// 确定取消预约专属服务
			applyConfirm() {
				let _ = this;
				wx.requestSubscribeMessage({
					tmplIds: _.msgIdList,
					success(res) {
						for (let key in res) {
							if (res[key] == 'accept') {
								let a = _.msgList.filter((item) => {
									return item.templateId == key
								})
								_.noticeList.push(a[0].id);
							}
						}
						// 不管用户订阅与否都提交预约
						_.postConfirm();
					}
				})
			},
			// 提交预约
			postConfirm() {
				if (this.type == 'select') {
					this.$http({
						url: this.$apis.appointmentSave,
						data: {
							mileage: this.optData.mileage, //  车程
							type: "MAINTAIN", //  预约类型
							reachTime: this.postTime.reachTime, //  到店日期
							item: this.maintainData[0].title, //  保养套餐名
							detail: this.optData.details,
							appointmentRemainId: this.postTime.appointmentRemainId, //  预约时间段id - 余量数据id
							reachStartTime: this.postTime.reachStartTime, //  预约时间段起始时间
							reachEndTime: this.postTime.reachEndTime, //  预约时间段终止时间
							maintainPackageId: this.optData.mainId, //  保养套餐id
							customerCarId: this.optData.carId, //  用户指定的车辆id 
							templateIds: this.noticeList //  订阅消息模板id
						},
						success: ((res) => {
							this.noticeList = [];
							uni.showToast({
								title: '预约成功',
							});
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/exclusive/exclusive'
								});
							}, 2000)
						})
					})
				} else {
					if (this.date == '') {
						this.noticeList = [];
						uni.showToast({
							title: '请选择到店时间',
						});
						return false;
					}

					this.$http({
						url: this.$apis.appointmentSave,
						data: {
							mileage: this.distance, //  车程
							type: "WASH", //  预约类型：MAINTAIN 保养，WASH 洗车，DS 专属服务，PRODUCT 商品
							reachTime: this.date + ':00', //  到店日期
							customerCarId: this.carObj.id, //  用户指定的车辆id 
							templateIds: this.noticeList, //  订阅消息模板id
						},
						success: ((res) => {
							this.noticeList = [];
							uni.showToast({
								title: '预约成功',
							});
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/exclusive/exclusive'
								});
							}, 2000)
						})
					})
				}
			},
			bindPickerChange(e) {
				//滚动第一列
				if (e.detail.column == 0) {
					let index = e.target.value;
					this.postTime.reachTime = this.timeArray[0][index] + ' 00:00:00';
					this.$http({
						url: this.$apis.appointmentRemainPullDownList + '?date=' + this.timeArray[0][index],
						method: 'GET',
						success: ((res) => {
							let arr = [];
							this.oldTimeList = res.data;
							res.data.forEach((item) => {
								//判断是否为今天
								if (index == 0) {
									let nowTime = new Date;
									//筛选当天已过去的时间
									let H = nowTime.getHours();
									let Y = nowTime.getMinutes();
									let N = H * 60 + Y; //当期分钟
									let A = Number(item.startTime.substring(0, 5).substring(0, 2));
									let B = Number(item.startTime.substring(0, 5).substring(3, 5));
									let C = A * 60 + B;
									if (C >= N) {
										if (item.remain > 0) {
											arr.push(item.startTime.substring(0, 5) + '—' + item.endTime.substring(0, 5) + '  ' + '余' + item.remain);
										}
									}
								} else {
									if (item.remain > 0) {
										arr.push(item.startTime.substring(0, 5) + '—' + item.endTime.substring(0, 5) + '  ' + '余' + item.remain);
									}
								}
							});
							this.startDate = this.timeArray[0][index];
							this.timeArray[1] = arr;
							if (this.timeArray[1].length <= 0) {
								uni.showToast({
									title: '营业时间已过，请预约明天',
								});
							}
							if (this.scIndex <= this.timeArray[1].length) {
								this.postTime.reachStartTime = this.timeArray[1][this.scIndex].substring(0, 5);
								this.postTime.reachEndTime = this.timeArray[1][this.scIndex].substring(6, 11);
								this.endDate = this.postTime.reachStartTime + '-' + this.postTime.reachEndTime;
								this.postTime.appointmentRemainId = this.retTimeId(this.postTime.reachStartTime + ':00', this.postTime.reachEndTime +
									':00');
							} else {
								this.postTime.reachStartTime = this.timeArray[1][0].substring(0, 5);
								this.postTime.reachEndTime = this.timeArray[1][0].substring(6, 11);
								this.endDate = this.postTime.reachStartTime + '-' + this.postTime.reachEndTime;
								this.postTime.appointmentRemainId = this.retTimeId(this.postTime.reachStartTime + ':00', this.postTime.reachEndTime +
									':00');
							}
							this.$forceUpdate();
						})
					})
				} else {
					//滚动第二列
					let index2 = e.target.value;
					this.scIndex = index2;
					this.postTime.reachStartTime = this.timeArray[1][index2].substring(0, 5);
					this.postTime.reachEndTime = this.timeArray[1][index2].substring(6, 11);
					this.endDate = this.postTime.reachStartTime + '-' + this.postTime.reachEndTime;
					this.postTime.appointmentRemainId = this.retTimeId(this.postTime.reachStartTime + ':00', this.postTime.reachEndTime +
						':00');
				}
			},
			getTimeList() {
				this.timeArray = [
					[],
					[]
				];
				let nowDate = getCurrentDate(1), //当前日期
					nowTime = new Date(nowDate).getTime() / 1000; //当前时间戳
				let pushArr = [];
				for (let i = 0; i < 7; i++) {
					let num = nowTime + 24 * 60 * 60 * i;
					if (i == 0) {
						pushArr.push(
							this.format(nowTime)
						)
					} else {
						pushArr.push(
							this.format(num)
						)
					}
				};
				this.postTime.reachTime = nowDate + ' 00:00:00';
				this.timeArray[0] = pushArr;
				this.$forceUpdate();
				this.$http({
					url: this.$apis.appointmentRemainPullDownList + '?date=' + this.timeArray[0][0],
					method: 'GET',
					success: ((res) => {
						let arr = [];
						this.oldTimeList = res.data;
						res.data.forEach((item) => {
							let nowTime = new Date;
							//筛选当天已过去的时间
							let H = nowTime.getHours();
							let Y = nowTime.getMinutes();
							let N = H * 60 + Y; //当期分钟
							let A = Number(item.startTime.substring(0, 5).substring(0, 2));
							let B = Number(item.startTime.substring(0, 5).substring(3, 5));
							let C = A * 60 + B;
							if (C >= N) {
								if (item.remain > 0) {
									arr.push(item.startTime.substring(0, 5) + '—' + item.endTime.substring(0, 5) + '  ' + '余' + item.remain);
								}
							}
						})
						this.timeArray[1] = arr;
						this.postTime.reachStartTime = this.timeArray[1][0].substring(0, 5);
						this.postTime.reachEndTime = this.timeArray[1][0].substring(6, 11);
						this.startDate = nowDate;
						this.endDate = this.postTime.reachStartTime + '-' + this.postTime.reachEndTime;
						this.postTime.appointmentRemainId = this.retTimeId(this.postTime.reachStartTime + ':00', this.postTime.reachEndTime +
							':00');
						this.$forceUpdate();

					})
				})
			},
			//时间戳转换日期
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			format(shijianchuo) {
				//shijianchuo是整数，否则要parseInt转换
				var time = new Date(shijianchuo * 1000);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				return y + '-' + this.add0(m) + '-' + this.add0(d);
			},
			retTimeId(start, end) {
				let arrList = this.oldTimeList.filter(item =>
					item.startTime == start && item.endTime == end
				);
				return arrList[0].id;
			},
			tapCar() {
				if (this.carData.length) {
					// 选择车辆
					let arr = this.carData.map(ele => `${ele.brandName} ${ele.seriesName} ${ele.modelName}`);
					arr.push('添加车辆')
					uni.showActionSheet({
						itemList: arr,
						cancelText: '取消',
						success: (res) => {
							let index = res.tapIndex;
							// 添加爱车
							if (index === arr.length - 1) {
								goPages('carDossier')
							} else {
								this.carObj = this.carData[res.tapIndex];
								this.distance = this.carObj.mileage; //车程
							}
						},
						fail: (res) => {}
					})
					return false;
				}
				goPages('carDossier')
			},
			//选择默认车辆
			getCarList() {
				this.$http({
					url: this.$apis.carPullDownList,
					method: 'GET',
					success: ((res) => {
						if (res.data) {
							let result = res.data;
							if (result.length > 0) {
								this.carObj = result[0];
								this.carData = res.data;
								return false;
							}
						}
						this.carData = [];
						this.carObj = {};
					})
				})
			},
			// 关闭时间选择
			closePop(val) {
				this.isPopup = val;
			},
			// 选择的时间数据
			onSelectTime(val) {
				this.date = val.time;
				this.endDate = '';
			},
		}
	}
</script>
