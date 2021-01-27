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
			<!-- <view class="top">常规保养项目({{actNumber}}/{{number}})</view> -->

			<!-- 折叠选择 -->
			<view class="collapse_box">
				<block v-for="(item,index) in maintainData" :key="index">
					<tui-collapse :index="index" :current="item.current" :disabled="item.disabled">
						<template v-slot:title>
							<view class="collapse_top">
								<label @tap="checkboxChange(item)" class="top_label">
									<radio style="transform:scale(0.8)" value="cb" :checked="item.isAll" />
								</label>
								<tui-list-cell @click="tapMaintain(index)">
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
										<view class="detail_label">
											<checkbox style="transform:scale(0.8)" @click="simpleCheck(item,detail)" :value="i" :disabled="!item.isAll"
											 :checked="detail.isChecked" />
											<view class="detail_content">{{detail.content}}</view>
										</view>
									</view>
									<view class="tips">*以上项目仅为预设参考，到店可按需调整</view>
								</checkbox-group>
							</view>
						</template>
					</tui-collapse>
				</block>
			</view>

			<!-- 占位栏 -->
			<view class="place"></view>

			<!-- 预约服务流程 -->
			<order-process></order-process>

			<!-- 车程输入背景 -->
			<view v-show="bgShow" class="checheng_bg" @tap="openBg"></view>

		</view>


		<!-- 底部 -->
		<view class="page_footer">
			<view class="left">
				<button class="contact" @tap="toPhone">
					<image class="img" :src="realmImg('orderDetail/phone.png')" mode="widthFix"></image>
					咨询
				</button>
			</view>
			<view class="right" @tap="toConfirm">预约服务</view>
		</view>
	</view>
</template>

<script>
	import tuiCollapse from "@/components/tui-collapse/tui-collapse.vue"
	import tuiListCell from "@/components/tui-list-cell/tui-list-cell.vue"
	import orderProcess from "@/components/order-process.vue"
	import { goPages } from '@/utils/request.js'
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
				showMaintainData: [],
				bgShow: false,
				phone: '',
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
		},
		onLoad() {

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
				this.clearData();
				item.isAll = !item.isAll;
				item.details.forEach((ele, i) => {
					ele.isChecked = item.isAll;
				})
			},
			// 去确认保养商品服务页面
			toConfirm() {
				let postArr = this.maintainData.filter(item => item.isAll);
				let postArr2 = [];
				if (!this.carObj.brand) {
					uni.showToast({
						title: '请选择您的爱车',
						icon: 'none'
					});
					return false;
				}
				if (this.distance == null && !this.distance && this.distance <= 0) {
					uni.showToast({
						title: '请填写正确车程',
						icon: 'none'
					});
					return false;
				}
				if (postArr.length !== 0) {
					postArr2 = postArr[0].details.filter(item => item.isChecked);
					if (postArr2.length !== 0) {
						let runArr = [];
						postArr2.forEach((item) => {
							runArr.push(item.content)
						})
						uni.navigateTo({
							url: './confirmMaintain?brandId=' + this.carObj.brand + '&seriesId=' + this.carObj.series + '&mileage=' +
								this.distance + '&details=' + runArr + '&carName=' + this.carObj.brandName + this.carObj.seriesName +
								'&mainId=' + postArr[0].id + '&carId=' + this.carObj.id + '&type=' + 'select',
						})
					} else {
						uni.showToast({
							title: '至少选择一项保养明细',
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
						title: '请选择保养套餐',
					});
				}
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
							this.getMainList();
							return false;
						}
						this.carData = [];
						this.carObj = {};
					})
				})
			},
			getMainList() {
				this.$http({
					url: this.$apis.maintainPackageList,
					data: {
						current: 1, //  页码    -   必传
						size: 100, //  条数
						brand: this.carObj.brandId, //  品牌    -   可选
						series: this.carObj.seriesId, //   车系    -   可选
						mileage: this.distance, //    车程    -   可选
					},
					success: ((res) => {
						let postArr = [];
						res.data.forEach((item, index) => {
							let arrAct = [];
							item.detail.forEach((item) => {
								arrAct.push({
									isChecked: false,
									isDisabled: false,
									content: item,
								})
							})
							let arrItem = {
								id: item.id,
								brandId: item.brand,
								seriesId: item.series,
								title: item.name,
								vice: `建议${item.mileageRequire}KM或者${item.onloadTimeRequire}个月/次`,
								isAll: false,
								current: -1,
								disabled: false,
								details: arrAct
							}
							postArr.push(arrItem);
						})
						this.maintainData = postArr;
					})
				})
			},
			clearData() {
				this.maintainData.forEach((item) => {
					item.isAll = false;
					item.details.forEach((item) => {
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
			}
		}
	}
</script>
