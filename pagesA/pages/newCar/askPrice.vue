<template>
	<view class="askPricePage">
		<!-- 输入信息 -->
		<view class="fill">
			<form @submit="formSubmit">
				<tui-list-cell :hover="false" >
					<view class="tui-line-cell">
						<view class="tui-title">车系名称</view>
						<input placeholder-class="tui-phcolor" disabled class="tui-input"  :value="carObj.seriesName" />
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false">
					<view class="tui-line-cell">
						<view class="tui-title">车辆车型</view>
						<picker @change="bindPickerChange" :value="index" :range="arr" class="model_box">
							<view class="tui-input">
								{{modalData[index].name}}
								<text class="iconfont icon-xiangyoujiantou"></text>
							</view>
						</picker>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" v-for="(item, index) in inputData" :key="index">
					<view class="tui-line-cell">
						<view class="tui-title">{{item.text}}</view>
						<input placeholder-class="tui-phcolor" :value="item.value" class="tui-input" :name="item.name" :placeholder="item.placeholder" maxlength="50" :type="item.name==='customerName'? 'text': 'number'" />
					</view>
				</tui-list-cell>
				<view class="tui-tips">*您的联系方式只会用于4S店本次询底价回电使用， 不会用于其他。</view>
				<button class="tui-button-primary" hover-class="handle_hover" formType="submit" type="primary">确定</button>
			</form>
		</view>
		
	</view>
</template>

<script>
	import tuiListCell from "@/components/tui-list-cell/tui-list-cell.vue";
	const form = require("@/components/common/tui-validation/tui-validation.js")
	import { goPages } from '@/utils/request.js'
	export default {
		components:{
			tuiListCell,
		},
		data() {
			return {
				carObj: {
					seriesName: '',			// 汽车车系名称
					modelName: '',			// 选中的车型名称
					modelId: null,			// 当前车型 ID
					seriesId: null, 		// 车系 ID
				},
				type: 0,					// 0 表示从车系列表来，车系不能禁止选择 1表示从车型里来，		
				modalData: [],
				arr: [],
				index: 0,
				inputData: [
					{
						name: 'customerName',
						placeholder: '您的称呼',
						text: '用户姓名',
						value: '',			// 用户姓名
						
					},
					{
						name: 'phone',
						placeholder: '用于接收底价信息',
						text: '手机号码',
						value: '',					// 用户电话
					}
				]
					
				
			}
		},
		onShow() {
			if(!this.$store.state.hasLogin) {
				
			} else {
				this.inputData[0].value = this.$store.state.userinfo.name;
				this.inputData[1].value = this.$store.state.userinfo.phone;
			}
		},
		onLoad(e) {
			this.type = e.type;
			this.carObj.seriesId = Number(e.seriesId);
			this.carObj.seriesName = e.seriesName;
			if(this.type === 0) {
				// 从车系里来
				
			} else {
				this.carObj.modelId = Number(e.modelId);
			}
			this.getModalList();
			
		},
		methods:{
			// 得到新车详情
			getModalList() {
				this.$http({
					url: this.$apis.getCarList,
					method: 'POST',
					data: {
						series: this.carObj.seriesId,
						appId: this.$store.state.appId,
						current: 1, 
						size: 1000
					},
					success: ((res) => {
						this.modalData = res.data.records;
						this.arr = this.modalData.map(ele => ele.name);
						if(this.type === '0') {
							this.index = 0;
							this.carObj.modelId = this.modalData[0].id;
						} else {
							this.modalData.forEach((item, index)=>{
							   if(Number(item.id) === this.carObj.modelId ){
							      this.index = index 
							  } 
							})
							console.log(this.index)
						}
					})
				})
			},
			// 选择车型
			bindPickerChange(e) {
				this.index = e.target.value;
				this.carObj.modelId = this.modalData[this.index].id;
				console.log(this.carObj.modelId)
			},
			formSubmit(e) {
				if(!this.$store.state.hasLogin) {
					goPages('login');
					return false;
				}
				
				//表单规则
				let rules = [
					{
						name: "customerName",
						rule: ["required", "isChinese", "minLength:2", "maxLength:6"], //可使用区间，此处主要测试功能
						msg: ["请输入姓名", "姓名必须全部为中文", "姓名必须2个或以上字符", "姓名不能超过6个字符"]
					},
					{
						name: "phone",
						rule: ["required", "isMobile"],
						msg: ["请输入手机号码", "请输入正确的手机号码"]
					},
				];
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = form.validation(formData, rules);
				if (!checkRes) {
					this.inputData[0].value = formData.customerName;
					this.inputData[1].value = formData.phone;
					this.goAsk();
				} else {
					uni.showToast({
						title: checkRes,
						icon: "none"
					});
				}
			},
			// 去询问底价
			goAsk() {
				console.log(this.carObj.modelId, '2')
				this.$http({
					url: this.$apis.submitAsk,
					method: 'POST',
					data: {
						customerName: this.inputData[0].value,
						phone: this.inputData[1].value,
						carId: this.carObj.modelId,
					},
					success: ((res) => {
						uni.showToast({
							title: '提交成功！',
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 2000)
					})
				})
			},
		}
	}
</script>

