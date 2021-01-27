<template>
	<view class="insurance_form">
		<form @submit="formSubmit" class="form">
			<tui-list-cell class="box">
				<view class="section">
					<view class="top" @tap="changeCar">
						<view class="left">
							<view class="line"></view>添加车辆信息
						</view>
						<view class="right">
							<text class="car" v-if="carData.length>0">{{carObj.brandName}}</text>
							<text class="car" v-else @tap="addCar">添加车辆</text>
							<text class="iconfont icon-xiangyoujiantou"></text>
						</view>
					</view>
					<view class="tui-line-cell" v-for="(item, index) in inputData" :key="index">
						<view class="tui-title">{{item.text}}</view>
						<view class="value">{{item.value}}</view>
					</view>
					<view class="tui-line-cell">
						<view class="tui-title">车架号/vin码</view>
						<input placeholder-class="tui-phcolor" :value="form.vinNo" class="tui-input special_input" name="vinNo"
						 placeholder="请输入车架号/Vin码" />
					</view>
					<view class="tui-line-cell">
						<view class="tui-title">发动机号码</view>
						<input placeholder-class="tui-phcolor" :value="form.engineModel" class="tui-input special_engine" name="engineModel"
						 placeholder="请输入发动机号码" />
					</view>
					<view class="tui-line-cell date">
						<view class="tui-title">注册时间</view>
						<picker mode="date" value="date" class="date_cell" @change="changeRegister">
							<text class="value" v-if="carObj.registerTime">{{carObj.registerTime}}</text>
							<text class="place_holder value" v-else>请选择注册时间</text>
							<text class="iconfont  icon-xiangyoujiantou"></text>
						</picker>
					</view>
				</view>

				<view class="space_box"></view>
				<view class="section">
					<view class="tui-line-cell">
						<view class="tui-title">车主类型</view>
						<radio-group class="radio-group" name="carType" @change="changeType">
							<label class="tui-radio value" v-for="(ele, i) in radioData" :key="i">
								<radio :value="ele.value" color="#5677fc" style="transform:scale(0.8)" />{{ele.text}}
							</label>
						</radio-group>
					</view>
					<view class="tui-line-cell">
						<view class="tui-title">车主姓名</view>
						<input placeholder-class="tui-phcolor" :value="form.name" class="tui-input value" name="name" placeholder="请输入姓名"
						 type="text" />
					</view>
					<view class="tui-line-cell">
						<view class="tui-title">{{ codeName }}</view>
						<input v-if="codeName == '身份证号'" type="idcard" placeholder-class="tui-phcolor" :value="form.idcard" class="tui-input value" name="idcard" placeholder="请输入身份证号码" />
						<input v-if="codeName == '信用代码/税号'" placeholder-class="tui-phcolor" :value="form.creditCode" class="tui-input value creditCode" name="creditCode" placeholder="请输入统一社会信用代码" />
					</view>
				</view>
			</tui-list-cell>

			<button class="tui-button-primary" hover-class="handle_hover" formType="submit" type="primary">下一步</button>
		</form>

	</view>
</template>

<script>
	const form = require("@/components/common/tui-validation/tui-validation.js")
	import { goPages } from '@/utils/request.js'
	export default {
		data() {
			return {
				radioData: [{
						text: '个人',
						value: 'PERSON'
					},
					{
						text: '企业',
						value: 'COMPANY'
					},
				],
				inputData: [{
						name: 'plate',
						text: '车牌号码',
					},
					{
						name: 'brand',
						text: '车辆品牌',
					},
					{
						name: 'series',
						text: '车辆车系',
					},
					{
						name: 'model',
						text: '车辆车型',
					},
				],
				form: {
					engineModel:'444',				// 发动机号
					vinNo: '1234567899542315s', 	// 车架号
					carType: '', 					// 车主类型	
					idcard: '', 					// 身份证号
					name: '', 						// 车主姓名
					creditCode: '', 				// 信用代码
				},
				carObj: {
					
				},
				carData: {},
				type: '', 					// 保险类型
				codeName: '身份证号',
				premiumRatio: null,
			}
		},
		onShow() {
			// 得到车辆信息
			this.getCarList();
		},
		onLoad(option) {
			this.type = option.type;
			this.premiumRatio = option.premiumRatio;//保费比例
		},
		methods: {
			// 得到车辆信息
			getCarList() {
				this.$http({
					url: this.$apis.carPullDownList,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						if (result.length > 0) {
							this.carObj = result[0];
							this.carData = result;
							this.getCarDetail();
							return false;
						}
						this.carData = [];
						this.carObj = {};
					})
				})
			},
			// 得到车辆详情
			getCarDetail() {
				this.$http({
					url: `${this.$apis.detailUserCar}?id=${this.carObj.id}`,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.inputData = [{
								name: 'plate',
								text: '车牌号码',
								value: result.plateNo || '/'
							},
							{
								name: 'brand',
								text: '车辆品牌',
								value: result.brandName || '/'
							},
							{
								name: 'series',
								text: '车辆车系',
								value: result.seriesName || '/'
							},
							{
								name: 'model',
								text: '车辆车型',
								value: result.modelName || '/'
							}
						]
						this.carObj = result;
						this.form.engineModel = result.engineModel;
						this.form.vinNo = result.vinNo;
						
						
					})
				})
			},
			// 选择车辆
			changeCar() {
				if (this.carData.length) {
					// 选择车辆
					let arr = this.carData.map(ele => `${ele.brandName} ${ele.seriesName} ${ele.modelName}`) || [];
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
								this.getCarDetail();
							}
						},
						fail: (res) => {}
					})
					return false;
				}
				goPages('carDossier')
			},
			formSubmit(e) {
				//表单规则
				let rules = [{
						name: "vinNo",
						rule: ["required", "isEnOrNo", "minLength:17", "maxLength:17"], //可使用区间，此处主要测试功能
						msg: ["请输入车架号", "车架号必须为数字英文组合", "车架号限定17位", "车架号限定17位"]
					},
					{
						name: "engineModel",
						rule: ["required"],
						msg: ["请输入发动机号码"]
					},
					{
						name: "carType",
						rule: ["required"],
						msg: ["请选择车主类型"]
					},
					{
						name: "name",
						rule: ["required", "minLength:2", "maxLength:6"],
						msg: ["请输入姓名", "姓名必须2个或以上字符", "姓名不能超过6个字符"]
					},
				];
				
				//进行表单检查
				let formData = e.detail.value;
				
				let checkRes = form.validation(formData, rules);
				if (!checkRes) {
					if (this.carObj.registerTime === '' || !this.carObj.registerTime) {
						uni.showToast({
							title: '注册时间不能为空',
							icon: "none"
						});
						return false;
					}
					this.form = {
						carType: formData.carType, 			// 车主类型	
						idcard: formData.idcard, 			// 身份证号
						name: formData.name ,				// 车主姓名
						creditCode: formData.creditCode,	// 信用代码
						engineModel: formData.engineModel,
						vinNo : formData.vinNo
					}
					
					if(this.codeName === '信用代码/税号' && this.form.creditCode === '' ) {
						uni.showToast({
							title: '信用代码不能为空',
							icon: "none"
						});
						return false
					}
					if(this.codeName === '身份证号' && this.form.idcard === '') {
						uni.showToast({
							title: '身份证号不能为空',
							icon: "none"
						});
						return ;
					}
					if(this.codeName === '身份证号' && this.form.idcard.length !== 18) {
						uni.showToast({
							title: '身份证号输入错误',
							icon: "none"
						});
						return false
					}
					this.editCar();
				} else {
					uni.showToast({
						title: checkRes,
						icon: "none"
					});
				}
			},
			// 保存车辆信息
			editCar() {
				let data = {
					brand: this.carObj.brand, 					// 品牌id
					series: this.carObj.series, 				// 车系id
					model: this.carObj.model, 					// 车型id
					mileage: this.carObj.mileage || '', 		// 里程
					vinNo: this.form.vinNo || '', 				// 车架号
					engineModel: this.form.engineModel || '', 	// 发动机号码
					plateNo: this.plateNo || '',
					id: this.carObj.id
				};
				if (this.carObj.registerTime !== '' && this.carObj.registerTime) {
					data.registerTime = `${this.carObj.registerTime} 00:00:00`;
				}
				this.$http({
					url: this.$apis.editUserCar,
					method: 'POST',
					data,
					success: ((res) => {
						let postObj = {
							type: this.type,
							id: this.carObj.id,
							carType: this.form.carType,
							name: this.form.name,
							idcard: this.form.carType === 'COMPANY' ? this.form.creditCode : this.form.idcard ,
						}
						let obj1 = JSON.stringify(postObj)
						uni.navigateTo({
							url: '/pagesA/pages/shop/insurance/save?data=' + obj1 + '&premiumRatio=' + this.premiumRatio
						})
					})
				})
			},
			// 选择注册日期
			changeRegister(e) {
				this.carObj.registerTime = e.detail.value;
			},
			// 切换车主类型
			changeType(e) {
				if (e.detail.value === 'COMPANY') {
					this.codeName = '信用代码/税号';
				} else {
					this.codeName = '身份证号'
				}
				this.form.idcard = '';
				this.form.creditCode = ''; 
			}
		}
	}
</script>

<style>
	page {
		background-color: #F8F6F9;
	}
</style>
