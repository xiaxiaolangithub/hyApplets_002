<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		onLaunch() {
			// 获取Appid
			this.getAppid();
			// 小程序新版本
			this.isVersion();
			// 获取手机信息
			this.getMobileInfo();
			
			
		},
		methods: {
			...mapMutations([
				'userinfo',
				'hasLogin'
			]),
			// 获取Appid
			getAppid() {
				let appId = uni.getAccountInfoSync().miniProgram.appId;
				this.$store.commit('appId', appId);
				// 获取用户凭证
				this.getLoginCode();
				// 获取企业资料
				this.getShopInfo();
			},
			// 获取用户凭证
			getLoginCode() {
				// 调用登录接口，获取 code
				wx.login({ 
					success: (res) => {
						this.loginHandle(res.code);
					},
					fail:(res)=>{
					}
				})
			},
			// 用户登录操作,判断用户有没有登录过
			loginHandle(code) {
				this.$http({
					url: this.$apis.login,
					method: 'POST',
					data: {
						code,
						appid: this.$store.state.appId
					},
					success: ((res) => {
						this.transData(res.data);
					})
				})
			},
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
			},
			// 获取企业资料
			getShopInfo() {
				this.$http({
					url: `${this.$apis.shopInfo}?appId=${this.$store.state.appId}`,
					method: 'GET',
					success: ((res) => {
						this.$store.commit('shopData', res.data);
					})
				})
			},
			// 获取手机信息
			getMobileInfo() {
				const mobileInfo = uni.getSystemInfoSync();
				let BottomBlackLineHeight = ""; //iphoneX底部一条黑线，有些页面要避开
				let iphoneXArr = ["iPhone X", "iPhone 11", "iPhone 11 Pro Max"];
				iphoneXArr.forEach((item) => {
				if (mobileInfo.model.search(item) !== -1) {
					  this.$store.commit('bottomArea', '150rpx');
					  this.$store.commit('bottomHeight', '100rpx');
					}
				});
			},
			// 小程序新版本
			isVersion() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res2) {
							uni.showModal({
								title: '更新提示',
								content: '发现新版本，是否重启小程序?',
								cancelColor:'#333333',
								confirmColor:'#3377FF',
								success(res2) {
									if (res2.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate();
									}
								}
							});
						});
					}
				});
				
				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
					uni.showModal({
						title: '提示',
						content: '检查到有新版本，但下载失败，请检查网络设置',
						cancelColor:'#333333',
						confirmColor:'#3377FF',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});
				});
			},
		},
	};
</script>

<style>
	
	/*导入字体图标*/
	/* @import url('/components/gaoyia-parse/parse.css'); */
	
</style>
