<template>
	<!-- 登录页面 -->
	<view class="loginPage">
		<view class="arredit_inner">
			<image class="img" :src="logo || realmImg('login/navLogo.png')" mode="widthFix"></image>
			<view class="top">
				<text>亲爱的用户，您好 !  欢迎来到{{shopName}} 。</text>
			</view>
			<view class="user">
				<button  open-type="getUserInfo" hover-class="handle_hover" @getuserinfo="getuserinfo" withCredentials="true" class="weixin">开始使用</button>
			</view>
		</view>
		<!-- 获取手机验证码 -->
		<tui-modal :show="isShow" :custom="true" :fadein="true" class="login_modal">
			<view class="title">温馨提示</view>
			<view class="content">为了更好的体验，同意授权手机号？</view>
			<view class="handle">
				<button type="default" @tap="isShow=false;" class="cancel btn">取消</button>
				<button open-type="getPhoneNumber" hover-class="handle_hover"  @getphonenumber="getPhoneNumber"  withCredentials="true"class="weixin btn">同意</button>
			</view>
		</tui-modal>
	</view>
	
</template>

<script>
	import tuiModal from "@/components/modal/modal"
	export default {
		components: {
			tuiModal,
		},
		data() {
			return {
				isShow: false,
				appId: this.$store.state.appId,
				iv: '',						// 基本信息加密 iv
				encryptedData: '',			// 基本信息加密数据
				code: '',					// 登录凭证
				phoneIv: '',				// 手机号信息加密iv
				phoneEncryptedData: '',		// 手机号信息加密数据
				obj: {},					// 用户信息
				shopName: '车G时代',
				logo: '',
			};
		},
		computed: {
			shopData() {
				return this.$store.state.shopData
			},
		},
		onShow() {
			// 获取店铺信息
			this.shopName = this.shopData.aliasName;
			this.logo = this.shopData.logo;
		},
		methods:{
			// 处理登录数据
			transData(result) {
				if(result) {
					this.saveInfo(result);
					return false;
				}
			},
			// 登录过后用户的数据保存在vuex中
			saveInfo(result) {
				this.$store.commit('token', result.token);
				uni.setStorage({
				    key: 'token',
				    data: result.token,
				    success: function () {
				    }
				});
				this.$store.commit('hasLogin', true);
				this.$store.commit('userinfo', result.customerPerInfoVO)
				// 返回上一级
				uni.navigateBack({
					delta: 1
				});
			},
			// 授权登录
			getuserinfo(e) {
				let result = e.detail;
				this.iv = result.iv;
				this.encryptedData = result.encryptedData;
				this.obj =  e.detail.userInfo;
				// 调用登录接口，获取 code
				wx.login({ 
					success: (res) => {
						this.code = res.code;
						this.isShow = true;
					},
					fail:(res)=>{
						
					}
				})
			},
			// 手机号授权
			getPhoneNumber (e) {
				let result = e.detail;
				this.phoneIv = result.iv;
				this.phoneEncryptedData = result.encryptedData;
				this.isShow = false;
				this.$http({
					url: this.$apis.login,
					method: 'POST',
					data: {
						iv: this.iv,
						encryptedData: this.encryptedData,
						code: this.code,
						phoneIv: this.phoneIv,
						phoneEncryptedData: this.phoneEncryptedData,
						appid: this.appId
					},
					success: ((res) => {
						this.transData(res.data);
					})
				})
			},
		}
	}
</script>

<style lang="scss">
page{
	width:100%;
	height: 100%;
}
</style>
