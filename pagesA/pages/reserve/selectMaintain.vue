<template>
	<view class="selectMaintainPage">

		<!-- 选择的汽车 -->
		<view class="page_select_car">
			<view class="left" @tap="tapCar">
				<image :src="realmImg('maintain/car.png')" mode="widthFix"></image>
				<view class="name" v-if="carObj.brandName">{{carObj.brandName}} {{carObj.seriesName}}</view>
				<view class="name" v-else>添加爱车 </view>
				<text class="iconfont icon-xiangyoujiantou"></text>
			</view>
			<view class="right">
				当前车程
				<input style="width: 30%;" class="uni-input" type="number" @change="getMainList" @focus='openBg' v-model="distance"
				 maxlength="8" />
				公里
			</view>
		</view>

		<!-- 保养项目选择 -->
		<view class="maintain_box">
			<view class="top">
				<view></view>预约保养时间
			</view>
			<view class="day_list">
				<scroll-view class="day_list_act" scroll-x="true">
					<view class="day_list_item" v-for="item,index in dayListData" :key="index" :class="{ day_list_active:item.isShow }"
					 @click="dayClick(index)">
						<view>{{ item.day }}</view>
						<view>{{ item.date }}</view>
					</view>
				</scroll-view>
			</view>
			<view class="time_list" v-if="timeListData.length > 0">
				<scroll-view class="time_list_act" scroll-x="true" :scroll-left="scrollLeft">
					<view class="time_list_item" v-for="item,index in timeListData" :key="index" :class="{ time_list_active:item.isShow }"
					 @click="timeClick(index)">
						<view>余{{ item.remain }}</view>
						<view>{{ returnDate(item.startTime) }}-{{ returnDate(item.endTime) }}</view>
					</view>
				</scroll-view>
			</view>
			<view class="my_time">
				<view>已选</view>
				<view class="my_time_act"></view>
				<view>{{returnText(selectData.day)}} {{selectData.time ? selectData.time : ''}}</view>
			</view>

			<view class="top" style="padding:25rpx 35rpx 0rpx 35rpx">
				<view></view>预约保养项目
			</view>
			<!-- 折叠选择 -->
			<view class="collapse_box">
				<block v-for="(item,index) in maintainData" :key="index">
					<tui-collapse class="item_box" :index="index" :current="item.current" :disabled="item.disabled">
						<template v-slot:title>
							<view class="collapse_top">
								<label @tap="checkboxChange(item)" class="top_label" :class="{top_label_act : !item.vice}">
									<radio style="transform:scale(0.8)" value="cb" :checked="item.isAll" />
								</label>
								<tui-list-cell @click="tapMaintain(index)">
									<view class="title" :hover="!item.disabled">
										<view class="main" :class="{main_act : !item.vice}">{{index == 0 ? '推荐保养项目' : item.title}}</view>
										<view class="vice">{{item.vice}}</view>
									</view>
								</tui-list-cell>
							</view>
						</template>
						<template v-slot:content>
							<view class="tui-content">
								<checkbox-group class="check_group">
									<view v-for="(detail, i) in item.detail" :key="i" class="detail_list">
										<view class="detail_label" @click="simpleCheck(item,detail)">
											<checkbox style="transform:scale(0.8)" :value="i" :checked="detail.isChecked" />
											<view class="detail_content">{{detail.content}}</view>
										</view>
									</view>
								</checkbox-group>
							</view>
						</template>
					</tui-collapse>
				</block>
			</view>

			<!-- 占位栏 -->
			<view class="place"></view>

			<!-- 车程输入背景 -->
			<view v-show="bgShow" class="checheng_bg" @tap="openBg"></view>

		</view>


		<!-- 底部 -->
		<view class="page_footer">
			<view class="left">
				<button class="contact" @tap="toPhone">
					<image class="img" :src="realmImgTwo('orderDetail/phone.png')" mode="widthFix"></image>
					电话咨询
				</button>
			</view>
			<view class="right" @tap="applyConfirm">预约服务</view>
		</view>
	</view>
</template>

<script>
	import tuiCollapse from "@/components/tui-collapse/tui-collapse.vue"
	import tuiListCell from "@/components/tui-list-cell/tui-list-cell.vue"
	import orderProcess from "@/components/order-process.vue"
	import {
		getLocalTime,
		getCurrentDate,
		getWeek
	} from '@/static/js/tool.js'
	import {
		goPages
	} from '@/utils/request.js'
	export default {
		components: {
			tuiCollapse,
			tuiListCell,
			orderProcess
		},
		data() {
			return {
				// 车程
				distance: 0,
				// 当前保养的汽车名称
				carMain: {
					brandName: '选择',
					seriesName: '爱车',
					brandId: null,
					seriesId: null,
				},
				carObj: {
					brandName: '',
				},
				carData: [], // 车辆档案信息
				// number: 0,
				// actNumber: 0,
				// 保养项目数据
				maintainData: [],
				maintainOther: [],
				showMaintainData: [],
				bgShow: false,
				phone: '',
				dayListData: [],
				timeListData: [],
				selectData: {},
				scrollLeft: 0,
				msgIdList: [], //显示的模板条目
				msgList: [],
				noticeList: [],//消息订阅模板
			}
		},
		computed: {
			shopData() {
				return this.$store.state.shopData
			},
		},
		onShow() {
			this.phone = this.shopData.reservationPhone;
			this.getCarList();
			this.dayClick(0)
		},
		onLoad() {
			this.getTimeList();
			this.getConfirm();
		},
		methods: {
			// 当前点击到哪个保养项目e
			tapMaintain(index) {
				let item = this.maintainData[index];
				item.current = item.current == index ? -1 : index
			},
			// 单选
			simpleCheck(item, detail) {
				item.isAll = true;
				detail.isChecked = !detail.isChecked;
			},
			// 全选或不选
			checkboxChange(item) {
				item.isAll = !item.isAll;
				item.detail.forEach((ele, i) => {
					ele.isChecked = item.isAll;
				})
			},
			// 选择车辆
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
								this.carData = result;
								this.distance = this.carObj.mileage; //车程
							}
							this.maintainData = [];
							this.maintainOther = [];
							this.getMainList();
							return false;
						}
						this.carData = [];
						this.carObj = {};
					})
				})
			},
			getMainList() {
				this.maintainData = [];
				this.maintainOther = [];
				this.$http({
					url: this.$apis.maintainPackageGet,
					data: {
						current: 1, //  页码    -   必传
						size: 100, //  条数
						brand: this.carObj.brandId, //  品牌    -   可选
						series: this.carObj.seriesId, //   车系    -   可选
						mileage: this.distance, //    车程    -   可选
					},
					success: ((res) => {
						let recomData = res.data.recommendMaintainPackage; //推荐保养服务
						let otherData = res.data.otherItems; //推荐保养服务
						let arrAct = [];
						recomData.detail.forEach((item) => {
							arrAct.push({
								isChecked: true,
								isDisabled: false,
								content: item,
							})
						})
						let arrItem = {
							id: recomData.id,
							brandId: recomData.brand,
							seriesId: recomData.series,
							title: recomData.name,
							vice: `建议${recomData.mileageRequire}KM或者${recomData.onloadTimeRequire}个月进行该系列保养`,
							isAll: true,
							current: 0,
							disabled: false,
							detail: arrAct
						}
						this.maintainData.push(arrItem);

						if (otherData) {
							let arrAct = [];
							otherData.forEach((item) => {
								arrAct.push({
									isChecked: false,
									isDisabled: false,
									content: item,
								})
							})
							let otherItem = {
								title: '其他可选保养项目',
								isAll: false,
								current: -2,
								disabled: false,
								detail: arrAct
							}
							this.maintainData.push(otherItem);
						}
					})
				})
			},
			clearData() {
				this.maintainData.forEach((item) => {
					item.isAll = false;
					item.detail.forEach((item) => {
						item.isChecked = false;
					});
				})
			},
			toPhone() {
				uni.makePhoneCall({
					phoneNumber: this.phone
				})
			},
			openBg() {
				this.bgShow = !this.bgShow;
			},
			dayClick(index) {
				for (let item in this.dayListData) {
					this.dayListData[item].isShow = false;
				}
				this.dayListData[index].isShow = true;
				this.selectData.day = this.dayListData[index].date;
				this.selectData.postDay = this.dayListData[index].postDate; //到店日期

				this.$http({
					url: this.$apis.appointmentRemainPullDownList + '?date=' + this.dayListData[index].postDate,
					method: 'GET',
					success: ((res) => {
						//时间段数据 timeListData
						let objArr = [];
						for (let item in res.data) {
							let obj = {
								id: res.data[item].id,
								startTime: res.data[item].startTime,
								endTime: res.data[item].endTime,
								remain: res.data[item].remain,
								isShow: false,
							}
							//push的时候判断今日事件段
							if (index == 0) {
								let now = new Date();
								let nowNum = Number(now.getHours() * 60 + now.getMinutes()) //当前时间
								let objNum = Number(obj.endTime.substring(0, 2)) * 60 + Number(obj.endTime.substring(3, 5))
								if (objNum > nowNum) {
									objArr.push(obj)
									this.timeListData = objArr;
								}
							} else {
								objArr.push(obj)
								this.timeListData = objArr;
							}

						};
						this.timeClick(0);
						this.scrollLeft = 1;
						this.$nextTick(function() {
							this.scrollLeft = 0;
						});
					})
				})
			},
			timeClick(index) {
				for (let item in this.timeListData) {
					this.timeListData[item].isShow = false;
				}
				this.timeListData[index].isShow = true;
				this.selectData.time = this.returnDate(this.timeListData[index].startTime) + '-' + this.returnDate(this.timeListData[
					index].endTime);
				this.selectData.id = this.timeListData[index].id; //预约时间段id
			},
			returnText(text) {
				if (!text) {
					return '请选择到店时间'
				}
				let arr = text.split('.');
				return arr[0] + '月' + arr[1] + "日";
			},
			returnDate(date) {
				return String(date).substring(0, 5)
			},
			returnDate(date) {
				return String(date).substring(0, 5)
			},
			returnNum(num) {
				if (Number(num) < 10) {
					return "0" + String(num)
				} else {
					return String(num)
				}
			},
			getTimeList() {
				//获取当前时间 dayListData
				let nowDate = Date.parse(new Date()); //当前时间戳
				for (let index = 0; index < 15; index++) {
					let nowNumber = nowDate + (index * 60 * 60 * 24 * 1000)
					let date = this.returnMonth(nowNumber, 1)
					let date2 = this.returnMonth(nowNumber)
					let day = getWeek(nowNumber)
					let obj = {
						day: day,
						date: date,
						postDate: date2,
						isShow: false,
					}
					this.dayListData.push(obj)
					this.dayListData[0].isShow = true;
				}
			},
			//获取时间戳的 月 日
			returnMonth(time, type) {
				let date = new Date(time);
				let year = date.getFullYear(); //得到年份
				let month = date.getMonth() + 1;
				let day = date.getDate(); // 获取具体日
				if (type == 1) {
					return month + '.' + day
				} else {
					return year + '-' + this.returnNum(month) + '-' + this.returnNum(day)
				}
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
				if (!this.carObj.brand) {
					uni.showToast({
						title: '请选择您的爱车',
						icon: 'none'
					});
					return false;
				}
				if (!this.distance && this.distance == '' && this.distance <= 0) {
					uni.showToast({
						title: '请填写正确车程',
						icon: 'none'
					});
					return false;
				}
				if (!this.selectData.day && !this.selectData.postDay && !this.selectData.time) {
					uni.showToast({
						title: '请选择预约保养时间',
						icon: 'none'
					});
					return false;
				}
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
						_.toConfirm();
					}
				})
			},
			// 预约服务
			toConfirm() {
				let postArr = this.maintainData.filter(item => item.isAll);
				if (postArr.length > 0) {
					let postArrData = []
					postArr.forEach((item) => {
						postArrData = postArrData.concat(item.detail.filter(item => item.isChecked))
					})
					if (postArrData.length > 0) {
						let runArr = [];
						postArrData.forEach((item) => {
							runArr.push(item.content)
						})
						//请求预约接口
						let postDataList = this.maintainData[0];
						this.$http({
							url: this.$apis.appointmentSave,
							data: {
								mileage: this.distance, //  车程
								type: "MAINTAIN", //  预约类型
								reachTime: this.selectData.postDay + ' ' + '00:00:00', //  到店日期
								item: postDataList.title, //  保养套餐名
								detail: runArr,
								appointmentRemainId: this.selectData.id, //  预约时间段id - 余量数据id
								reachStartTime: this.selectData.time.substring(0,5), //  预约时间段起始时间
								reachEndTime: this.selectData.time.substring(6,11), //  预约时间段终止时间
								maintainPackageId: postDataList.id, //  保养套餐id
								customerCarId: this.carObj.id, //  用户指定的车辆id 
								templateIds: this.noticeList //  订阅消息模板id
							},
							success: ((res) => {
								this.noticeList = [];
								uni.showToast({
									title: '预约成功',
								});
								setTimeout(() => {
									uni.redirectTo({
										url: '/pagesB/pages/appoint/recordsDetail?type=' + res.data + "&current=" + '1',
									});
								}, 1000)
							})
						})
					} else {
						uni.showToast({
							title: '至少选择一项保养项目',
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
						title: '请选择保养套餐',
					});
				}
			},
		}
	}
</script>
<style>
	.selectMaintainPage .page_footer {
		width: 700rpx;
	}

	.selectMaintainPage .page_footer .right {
		width: 340rpx;
		height: 70rpx;
		line-height: 70rpx;
	}
</style>
