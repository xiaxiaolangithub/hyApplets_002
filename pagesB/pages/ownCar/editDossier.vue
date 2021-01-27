<template>
	<view class="editDossierPage">
		<view class="drive">
			<view class="inner" @click="chooseImg">
				<image :src="realmImg('carDossier/camera.png')" mode="widthFix" class="camera"></image>
				<view class="upload">点击此处扫描行驶证</view>
			</view>
		</view>


		<!-- 基本信息 -->
		<view class="info_section">
			<view class="info_inner">
				<view class="info_title">
					<view class="line"></view>
					车辆信息
				</view>
				<!-- 基本信息 -->
				<view class="basic_info">
					<view class="list">
						<image class="require" :src="realmImg('cardBag/star.png')" mode=""></image>
						<view class="title">车辆型号</view>
						<view class="value" @tap="goBrand">
							<view class="basic_text" :class="brandName=='请选择车辆型号'?'hoder_type':'fill'">{{brandName}} {{seriesName}}</view>
							<text class="iconfont icon-xiangyoujiantou"></text>
						</view>
					</view>
					<view class="list licensed_list">
						<image class="require" :src="realmImg('cardBag/star.png')" v-if="!isCheck"></image>
						<view class="title">车牌号码</view>
						<view class="value">
							<view v-if="plateNo===''&&plateArea===''" class="place_class" @tap="openKeyBoard" style="width:100%;height: 100%;display: flex;align-items: center;">{{plateTips}}</view>
							<view class="basic_text" v-else @tap="openBoard" style="width:100%;height: 100%;display: flex;align-items: center;">
								<view class="special_num" @click="openKeyBoard">{{plateArea}}</view>
								<view class="plate_no" @click="openNumEn">{{plateNo}}</view>
							</view>
						</view>
						<checkbox-group @change="checkboxChange" class="licensed" v-if="isHandle">
							<label class="licensed_label">
								<checkbox value="无上牌" :checked="isCheck" style="transform:scale(0.8)" class="checkbox"></checkbox>
								无上牌
							</label>
						</checkbox-group>
					</view>
					<view class="list">
						<view class="title">注册日期</view>
						<picker class="value date_select" mode="date" :value="carObj.registerTime" :start="startDate" :end="endDate"
						 @change="changeRegister">
							<view class="fill date_text" v-if="carObj.registerTime !==''">{{carObj.registerTime}}</view>
							<view class="basic_text date_text" v-else>请选择注册日期</view>
							<text class="iconfont date_icon icon-xiangyoujiantou"></text>
						</picker>
					</view>
					<!-- <view class="list">
						<view class="title">行驶里程</view>
						<view class="value">
							<input class="basic_text" :class="carObj.mileage==''?'hoder_type':'fill'" style="width:60%;" :value="carObj.mileage"
							 @input="mileageInput" type="number" placeholder="请输入行驶里程" placeholder-class="place_class" />
							<text class="kilometre">Km</text>
						</view>
					</view> -->
					<view class="list">
						<view class="title">发动机号</view>
						<view class="value">
							<input class="basic_text" :class="carObj.engine_no==''?'hoder_type':'fill'" style="width:100%;" :value="carObj.engine_no"
							 @input="engineInput" type="text" placeholder="请输入发动机号" placeholder-class="place_class" />
						</view>
					</view>
					<view class="list">
						<image class="require" :src="realmImg('cardBag/star.png')" v-if="isCheck"></image>
						<view class="title">车架号码</view>
						<view class="value">
							<input class="basic_text" :class="carObj.vinNo==''?'hoder_type':'fill'" style="width:100%;" :value="carObj.vinNo"
							 @input="codeInput" type="text" placeholder="请输入行驶证上的17位车架号码" placeholder-class="place_class" />
						</view>
					</view>
				</view>
			</view>

			<!-- 提交信息 -->
			<view class="submit" @tap="submitReady" hover-class="handle_hover">确定</view>
		</view>

		<!-- 车牌号键盘 -->
		<engkey-board-list ref="numEnBoard" @onInputNo="onInputNo" @onConfirm="onConfirm" @onDelete="onDelete"></engkey-board-list>

		<!-- 车牌地区键盘 -->
		<keyboard-package ref="plateNumber" type="plateNumber" :active="active" @onInputArea="onInputArea" />
	</view>
</template>

<script>
	function getDate(type) {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	}
	import {
		getCurrentDate
	} from '@/static/js/tool.js'
	import keyboardPackage from "@/components/keyboard-package/keyboard-package.vue" // 引用车牌地区
	import engkeyBoardList from "@/components/keyboard-package/engkeyBoardList.vue" // 引用车牌号
	export default {
		components: {
			keyboardPackage,
			engkeyBoardList
		},
		data() {
			return {
				title: '',
				plateNumberList: [],
				startDate: getDate('start'),
				endDate: getDate('end'),
				carObj: {
					id: null, 				// 车辆id
					brand: null, 			// 品牌id
					series: null, 			// 车系id
					registerTime: '', 		// 注册日期
					mileage: '', 			// 里程
					vinNo: '', 				// 车架号
					engine_no: '', 			// 发动机号
					logo: '', 				// logo
					isDefault: '', 			// 是否默认车辆
				},
				plateArea: '',
				plateNo: '',
				brandName: '请选择车辆型号', // 车品牌
				seriesName: '', 			// 车系选择
				active: 1,
				isShow: false,
				isCheck: false, 			// 有无上牌
				plateTips: '请输入车牌号码', // 车牌号提示根据有无上牌变化
				isHandle: true,
			};
		},
		onLoad(e) {
			// 判断是新增还是编辑车辆档案
			this.judgeHandle(e);
		},
		onShow() {
			// 获取当前时间格式
			this.getNowDate();
		},
		methods: {
			// 判断是新增还是编辑车辆档案
			judgeHandle(e) {
				console.log(e)
				if (e.type === 'add') {
					this.title = '新增车辆';
					// 新增的时候显示无上牌操作，编辑的时候如果有车牌号码的情况下，不让它显示
					this.isHandle = true;
					return false;
				}
				// 得到当前车辆档案的 ID 和 车系 ID
				this.carObj.id = e.id;
				this.carObj.series = e.series;
				this.carObj.logo = e.logo;
				this.carObj.isDefault = e.isDefault;
				// 得到车辆详情
				this.getDetail();
			},
			// 选择图片
			chooseImg() {
				wx.chooseImage({
					count: 1, 	//	可以选择图片的张数
					sizeType: ['original'],		// 选择
					success: (chooseImageRes) => {
						let tempFilePaths = chooseImageRes.tempFilePaths;
						// 上传的图片进行压缩
						wx.compressImage({
							src: tempFilePaths[0], 		// 图片路径
							quality: 3, 				// 压缩质量
							success: (res) => {
								const FilePaths = res.tempFilePath;
								this.ocrImg(FilePaths);
							}
						})

					}
				});
			},
			// 识别驾驶证信息
			ocrImg(FilePaths) {
				uni.showLoading({
					title: '卖力识别中~',
					mask: true,
				});
				uni.uploadFile({
					url: 'https://api-dev.hangzhouhuiyao.cn/ai/ocr',
					filePath: FilePaths,
					name: 'img',
					header: {
						'Content-Type': 'multipart/form-data',
						AUTH_TOKEN: uni.getStorageSync('AUTH_TOKEN')
					},
					formData: {
						'ocrType': 'VEHICLE_LICENSE',
					},
					success: (uploadFileRes) => {
						uni.showToast({
							title: '识别成功',
							icon: 'success',
							duration: 2000
						})
						let result = JSON.parse(uploadFileRes.data);
						let carObj = result.data;
						if (result.code === 1) {
							this.carObj.registerTime = carObj.register_date || '';
							this.carObj.vinNo = carObj.vin || '';
							this.carObj.engine_no = carObj.engine_no || '';
							this.plateNo = carObj.number.substring(1) || '';
							this.plateArea = carObj.number.substring(0, 1) || '';
							uni.hideLoading();
						} else {
							uni.showToast({
								title: result.local,
								icon: 'none',
								duration: 3000
							})
						}
					},
				});
			},
			openKey(num) {
				uni.getSelectedTextRange({
					success: res => {
						console.log('getSelectedTextRange res', res.start, res.end)
					}
				})
				// this.active = num;
				// this.openKeyBoard();
			},
			openBoard() {
				if (this.isCheck) {
					return false;
				}
				if (this.plateArea.length > 0) {
					this.openNumEn();
				}
			},
			openNumEn() {
				if (this.isCheck) {
					return false;
				}
				this.$refs['numEnBoard'].open();
			},
			openKeyBoard() {
				if (this.isCheck) {
					return false;
				}
				this.$refs['plateNumber'].open();
			},
			onInputNo(val) {
				if (this.plateNumberList.length > 6) {
					/* uni.showToast({
						title: '抱歉，车牌号限定7位数 ！',
						icon: 'none',
						duration: 2000
					}) */
					return false;
				}
				this.plateNumberList.push(val);
				this.plateNo = '';
				this.plateNumberList.forEach(item => {
					this.plateNo += item.toString();
				})

			},
			// 选择车牌地区
			onInputArea(val) {
				this.plateArea = val;
				this.$refs['plateNumber'].close();
				this.openNumEn();
			},
			onDelete() {
				this.plateNumberList.pop();
				this.plateNo = '';
				this.plateNumberList.forEach(item => {
					this.plateNo += item.toString();
				})
			},
			onConfirm() {
				if (this.plateNumberList.length < 7) {
					/* uni.showToast({
						title: '抱歉，车牌号限定7位数 ！',
						icon: 'none',
						duration: 2000
					}) */
				}
			},
			// 选择注册日期
			changeRegister(e) {
				this.carObj.registerTime = e.detail.value;
			},
			// 得到当前汽车详情
			getDetail() {
				this.$http({
					url: `${this.$apis.detailUserCar}?id=${this.carObj.id}`,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.title = result.brandName;
						uni.setNavigationBarTitle({
							title: this.title
						})
						this.carObj.id = result.id; 							// 车辆id
						this.carObj.brand = result.brand; 						// 品牌id
						this.carObj.series = result.series; 					// 车系id
						this.carObj.registerTime = result.registerTime || ''; 	// 注册日期
						this.carObj.mileage = result.mileage || ''; 			// 里程
						this.carObj.vinNo = result.vinNo || ''; 				// 车架号
						this.carObj.engine_no = result.engineModel || '';		// 发动机型号
						if (this.title !== '新增车辆' && result.plateNo && result.plateNo.length > 0) {
							this.isHandle = false;
							this.plateNo = result.plateNo.substr(1) || '';
							this.plateNumberList = this.plateNo.split('') || [];
							this.plateArea = result.plateNo.substr(0, 1);
						} else {
							this.isHandle = true;
							this.isCheck = true;
							this.plateTips = this.isCheck ? '无上牌不用输车牌' : '请输入车牌号码';
						}
						this.brandName = result.brandName;
						this.seriesName = result.seriesName;
					})
				})
			},
			// 获取当前日期格式
			getNowDate() {
				this.onloadNowDate = getCurrentDate(2);
				this.regNowDate = getCurrentDate(2);
			},
			// 输入行驶里程
			mileageInput(e) {
				this.carObj.mileage = e.detail.value;
			},
			// 输入车辆识别代号
			codeInput(e) {
				this.carObj.vinNo = e.detail.value;
			},
			// 输入发动机号码
			engineInput(e) {
				this.carObj.engine_no = e.detail.value;
			},
			// 去车辆型号页面
			goBrand() {
				uni.navigateTo({
					url: './carBrand'
				})
			},
			// 基本信息进行提交准备工作
			submitReady() {
				if (!this.carObj.brand) {
					uni.showToast({
						title: '车辆型号不能为空。',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if (!this.carObj.series) {
					uni.showToast({
						title: '车辆型号不能为空。',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if (this.plateNo.length < 6 && !this.isCheck) {
					uni.showToast({
						title: '请输入正确的车牌号。',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if (this.isCheck && this.carObj.vinNo.length === 0) {
					uni.showToast({
						title: '车架号不能为空 ！',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if (this.carObj.vinNo.length > 0 && this.carObj.vinNo.length !== 17) {
					uni.showToast({
						title: '车架号限定17位数 ！',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				this.queryData();
			},
			// 请求参数
			queryData() {
				let data = {
					brand: this.carObj.brand, 					// 品牌id
					series: this.carObj.series, 				// 车系id
					mileage: this.carObj.mileage || '', 		// 里程
					vinNo: this.carObj.vinNo || '', 			// 车架号
					hasPlateNo: this.isCheck ? 'NO' : 'YES', 	// 是否上牌，YES 是、NO 否
					engineModel: this.carObj.engine_no || '',	// 发动机型号
				}
				// 不上牌的时候要传入车牌号
				if (!this.isCheck) {
					data.plateNo = `${this.plateArea}${this.plateNo}`
				}
				if (this.carObj.registerTime !== '' && this.carObj.registerTime) {
					data.registerTime = `${this.carObj.registerTime} 00:00:00`;
				}
				let url = '';
				if (this.title === '新增车辆') {
					url = this.$apis.addUserCar;
				} else {
					url = this.$apis.editUserCar;
					data.id = this.carObj.id; // 车辆id
				}
				this.submti(data, url);
			},
			// 编辑、新增车辆提交
			submti(data, url) {
				this.$http({
					url,
					method: 'POST',
					data,
					success: ((res) => {
						uni.showToast({
							title: this.title === '新增车辆' ? '新增成功！' : '编辑成功！',
						});
						if (this.title === '新增车辆') {
							uni.redirectTo({
								url: './carDossier'
							})
						} else {
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1500);
						}

					})
				})
			},
			// 选择是否有上牌
			checkboxChange(e) {
				let arr = e.detail.value;
				this.isCheck = arr.length > 0 ? true : false;
				this.plateTips = arr.length > 0 ? '无上牌不用输车牌' : '请输入车牌号码';
				if (this.isCheck) {
					this.plateArea = '';
					this.plateNo = '';
				}
			},
		}
	}
</script>

<style>
	page {
		background: #F7F7F7;
	}
</style>
