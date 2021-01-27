<template>
	<!-- 个人资料 -->
	<view class="carDossierPage">
		<view class="set_item">
			<view>头像</view>
			<image @click="lookImg" :src="userData.avatarUrl" mode="widthFix" class="vip_icon"></image>
		</view>
		<view class="set_item">
			<view>昵称</view>
			<view>{{userData.nickName}}</view>
		</view>
		<view class="set_item">
			<view>性别</view>
			<view>{{retSex(userData.gender)}}</view>
		</view>
		<view class="set_item" @click="isShow=true">
			<view>手机号</view>
			<view >
				{{userData.phone}}
				<text class="iconfont icon-xiangyoujiantou"></text>
			</view>
			
		</view>
		<view class="active"></view>
		<view class="set_item" @tap="prompt('uni-prompt')">
			<view>真实姓名</view>
			<view >{{userData.name? userData.name : '未设置'}}<text class="iconfont icon-xiangyoujiantou"></text></view>
		</view>
		<view class="set_item">
			<view>生日信息</view>
			<view style="width:80%;height:100%">
				<picker class="birth_picker" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					{{userData.birthday? userData.birthday : '未设置'}}
				</picker>
				<text class="iconfont icon-xiangyoujiantou"></text>
			</view>
		</view>
		
		<!-- 姓名修改 -->
		<prompt :show="promptType === 'uni-prompt'" @onConfirm="onConfirm" @onCancel="prompt('')" title="修改真实姓名" text="请输入您的真实姓名"></prompt>
		
		
		<!-- 修改手机号 -->
		<view class="editPhone" v-if="isShow">
			<view class="prompt-content contentFontColor" :class="'uni-prompt-' + 'middle' + ' ' + 'uni-prompt-' + mode">
				<view class="prompt-title">修改手机号</view>
				
				<view class="box">
					<view class="list" v-for="(item, index) in listData" :key="index">
						<text class="text">{{item.text}}</text>
						<input type="number" :disabled="index===0"  :placeholder="item.placeholder" v-model="item.value" 
						@blur="blurNum($event, item, index)"
						class="phone" placeholder-class="place_class"/>
						<view v-if="index===2">
							<view class="send" v-if="isSend&&!isCount" @click="firstSend">发送验证码</view>
							<view class="send" v-if="isCount" @click="resendCode">重新发送</view>
							<view class="resend" v-if="count&&!isSend">{{count}}s后重新发送</view>
						</view>
					</view>
				</view>
				<view class="prompt-btn-group">
					<text class="btn-item prompt-cancel-btn contentFontColor" @tap="isShow=false">取消</text>
					<text class="btn-item prompt-certain-btn" @tap="phoneSubmit">确定</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import prompt from "@/components/prompt.vue";
	export default {
		components: {
			prompt,
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				userData: {
					phone: '',
					gender: '',
					name: '',
					avatarUrl: '',
					birthday: '',
					nickName: '',
				},
				promptType: '',
				date: currentDate,
				isShow: false,
				listData: [
					{
						text: '旧手机号',
						value: '',
						type: 'number'
					},
					{
						text: '新手机号',
						value: '',
						type: 'number',
						placeholder: '请输入新手机号',
					},
					{
						text: '手机验证码',
						value: '',
						type: 'number',
						placeholder: '请输入验证码',
					},
				],
				isSend: true,  // 显示发送验证码
				count: 15,	   // 90秒倒计时
				timer: null,
				isCount: false,
				isGo: false,	// 是否送发送验证码了
			}
		},
		watch:{
			isShow(val) {
				if(val) {
					this.listData[1].value = '';
					this.listData[2].value = '';
					this.isSend = true;
					this.isCount = false;
					this.timer = null;
				}
			}
		},
		onShow() {
			this.getUser();
		},
		methods: {
			// 得到用户基本信息
			getUser() {
				this.$http({
					url: this.$apis.customerPerInfo,
					method: 'GET',
					success: ((res) => {
						this.userData = res.data;
						this.listData[0].value = res.data.phone;
					})
				})
			},
			// 新手机号、验证码输入
			blurNum(e, item, index) {
				item.value = e.detail.value;
			},
			// 重新发送
			resendCode() {
				if(!(/^1[3-9][0-9]{9}$/.test(this.listData[1].value))){
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none'
					});
					return false;
				}
				this.sendCode('resend');
			},
			// 第一次发送验证码
			firstSend() {
				// 19906753681
				if(!(/^1[3-9][0-9]{9}$/.test(this.listData[1].value))){
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none'
					});
					return false;
				}
				if(this.isGo) {
					// 说明验证码已经发送过了
					uni.showToast({
						title: '验证码已经发送，请90s后重试',
						icon: 'none',
						duration: 4000
					});
					return false;
				}
				
				this.sendCode('first');
			},
			// 发送验证码
			sendCode(info) {
				this.$http({
					url: `${this.$apis.phoneCode}?phone=${this.listData[1].value}`,
					method: 'GET',
					success: ((res) => {
						if(res.code === 1) {
							uni.showToast({
								title: '验证码发送成功',
								icon: 'success'
							});
							switch(info) {
								case 'info': 
									this.isSend = !this.isSend;
									this.isCount = false;
									break;
								case 'resend':
									this.timer = null;
									this.isSend = false;
									break;
							}
							// 发送了不能再发送验证码了
							this.isGo = true;
							const TIME_COUNT = 90;
							if (!this.timer) {
								this.count = TIME_COUNT;
								this.isSend = false;
								this.isCount = false;
								this.timer = setInterval(() => {
								if (this.count > 0 && this.count <= TIME_COUNT) {
									this.count--;
								}  else {
									this.isCount = true;
									clearInterval(this.timer);
									}
								}, 1000)
							};
						}
						
					})
				})
			},
			// 修改手机号提交
			phoneSubmit() {
				if(!(/^1[3-9][0-9]{9}$/.test(this.listData[1].value))){
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none'
					});
					return false;
				}
				if(this.listData[2].value === '') {
					uni.showToast({
						title: '验证码错误',
						icon: 'none'
					});
					return;
				}
				this.$http({
					url: this.$apis.editPhone,
					method: 'GET',
					data: {
						phone: this.listData[1].value,
						verifyCode: this.listData[2].value,
					},
					success: ((res) => {
						if(res.code === 1) {
							uni.showToast({
								title: '修改成功~',
								icon: 'none'
							});
							this.isShow = false;
							// 这里说明可以再发送验证码了
							this.isGo = false;
							this.getUser();
						} 
						
					})
				})
			},
			// 重发验证码
			resend() {
				this.isSend = true;
			},
			// 查看头像大图
			lookImg() {
				uni.previewImage({
				    current: 0, 
				    urls: [this.userData.avatarUrl]
				})
			},
			prompt(type) {
				this.promptType = type;
			},
			// 姓名修改提交请求
			onConfirm(e) {
				let _cost = e;
				if (_cost == '') {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					});
					return;
				} else {
					this.prompt('')
					this.$http({
						url: this.$apis.customerUpdatePerInfo,
						data: {
							id: this.userData.id, //   id
							name: _cost //  名字
						},
						success: ((res) => {
							uni.showToast({
								title: '修改成功',
								icon: 'none'
							});
							this.getUser();
						})
					})
				}
			},
			retSex(sex) {
				switch (sex) {
					case 'MAN':
						return '男';
						break;
					case 'WOMEN':
						return '女';
						break;
					case 'UNKNOWN':
						return '未知';
						break;
				}
			},
			bindDateChange(e) {
				this.date = e.target.value
				this.$http({
					url: this.$apis.customerUpdatePerInfo,
					data: {
						id: this.userData.id, //   id
						birthday: this.date //  名字
					},
					success: ((res) => {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						});
						this.getUser();
					})
				})
			},
			getDate(type) {
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
		},
	}
</script>
<style scoped lang="less">
	page {
		background-color: #F8F6F9;
	}
	.editPhone{
		position: fixed;
		z-index: 998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		.box{
			width:100%;
			.list{
				border-bottom: 1px solid #eee;
				padding: 0 0 0 32rpx;
				display: flex;
				justify-content: space-between;
				color: #141E34;
				font-size: 30rpx;
				height: 96rpx;
				align-items: center;
				&:nth-child(1) .phone{
					color:#979CA7;
				}
				&:nth-child(3) {
					border-bottom: 0;
					position: relative;
					.phone{
						width:410rpx;
						height: 40rpx;
						display: flex;
						align-items: flex-start;
						line-height: 40rpx;
					}
					.text{
						margin-right: 24rpx;
					}
				}
			}
			.send{
				position: absolute;
				right: 50rpx;
				top: 28rpx;
				color:#3377FF;
				font-size: 30rpx;
				z-index: 999;
			}
			.resend{
				color:#CCCCCC;
				font-size: 30rpx;
				position: absolute;
				right: 24rpx;
				top: 28rpx;
			}
			.text{
				margin-right: 50rpx;
			}
			.phone{
				width:430rpx;
				height: 100%;
				color:#141E34;
				font-size: 30rpx;
			}
			.place_class{
				color:#CCCCCC;
			}
			
		}
		
		
		.uni-prompt-middle {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		
		.uni-prompt-middle.uni-prompt-insert {
			transform: translate(-50%, -65%);
			box-shadow: none;
		}
		
		.uni-prompt-middle.uni-prompt-fixed {
			border-radius: 10upx;
			padding: 30upx;
		}
		
		.uni-close-bottom,
		.uni-close-right {
			position: absolute;
			bottom: -180upx;
			text-align: center;
			border-radius: 50%;
			color: #f5f5f5;
			font-size: 60upx;
			font-weight: bold;
			opacity: 0.8;
			z-index: -1;
		}
		
		.uni-close-bottom {
			margin: auto;
			left: 0;
			right: 0;
		}
		
		.uni-close-right {
			right: -60upx;
			top: -80upx;
		}
		
		.uni-close-bottom:after {
			content: '';
			position: absolute;
			width: 0px;
			border: 1px #f5f5f5 solid;
			top: -200upx;
			bottom: 56upx;
			left: 50%;
			transform: translate(-50%, -0%);
			opacity: 0.8;
		}
		
		.prompt-content {
			position: fixed;
			z-index: 999;
			background-color: #ffffff;
			width: 650upx;
			border-radius: 10upx;
		}
		
		.prompt-title {
			width: 100%;
			padding: 50upx 0 45upx 0;
			text-align: center;
			font-size: 34upx;
			position: relative;
			color: #141E34;
		}
		
		.prompt-title::after {
			position: absolute;
			z-index: 3;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(.5);
			transform: scaleY(.5);
		}
		
		
		
		.prompt-btn-group {
			width: 100%;
			position: relative;
			height: 95upx;
			margin-top:30rpx;
		}
		
		.prompt-btn-group::before {
			position: absolute;
			z-index: 3;
			right: 0;
			top: 0;
			left: 0;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(.5);
			transform: scaleY(.5);
			background: #E6E6E6;
		}
		
		.btn-item {
			width: 50%;
			display: inline-block;
			text-align: center;
			position: relative;
			height: 95upx;
			line-height: 95upx;
			color: #3377FF;
			font-size: 34rpx;
		}
		
		.prompt-cancel-btn::after {
			position: absolute;
			z-index: 3;
			right: 0;
			top: 0;
			bottom: 0;
			width: 1px;
			content: '';
			-webkit-transform: scaleX(.5);
			transform: scaleX(.5);
			background: #E6E6E6;
		}
		
		.dividing-line {
			width: 1upx;
			height: 100%;
			background-color: #d5d5d6;
		}
		
		.contentFontColor {
			color: #141E34;
		}
		
		.uni-close-bottom,
		.uni-close-right {
			position: absolute;
			bottom: -180upx;
			text-align: center;
			border-radius: 50%;
			color: #f5f5f5;
			font-size: 60upx;
			font-weight: bold;
			opacity: 0.8;
			z-index: -1;
		}
		
		.uni-close-bottom {
			margin: auto;
			left: 0;
			right: 0;
		}
		
		.uni-close-right {
			right: -60upx;
			top: -80upx;
		}
		
		.uni-close-bottom:after {
			content: '';
			position: absolute;
			width: 0px;
			border: 1px #f5f5f5 solid;
			top: -200upx;
			bottom: 56upx;
			left: 50%;
			transform: translate(-50%, -0%);
			opacity: 0.8;
		}
	}
	.birth_picker{
		display: flex;
		justify-content: flex-end;
		width:100%;
		height: 100%;
		align-items: center;
	}
	.set_item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
		padding: 0 30rpx;
		height: 120rpx;
		border-bottom: 1px solid #F8F6F9;
	}

	.set_item image {
		width: 100rpx;
	}

	.set_item view:last-child {
		color: #b1b1b1;
		display: flex;
		align-items: center;
	}

	.icon-xiangyoujiantou {
		margin-left: 10rpx;
		margin-top:5rpx;
	}

	.active {
		width: 100%;
		height: 25rpx;
	}
</style>
