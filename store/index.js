
// 补充说明 
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const store = new Vuex.Store({  
    state: {  
		// 底部导航索引
		bottomNavigationIndex: 1,
		// 是否已登录
		hasLogin: false,
		// 用户信息数据
		userinfo: {},
		// token
		token: '',
		// 底部距离，适配苹果底部有黑色横杠
		bottomArea: '',
		bottomHeight: '',
		appId: '',			// appId
		// 企业资料
		shopData: {},
		
    },  
	actions:{
		
		
	},
    mutations: {  
		setBottomNavigationIndex(state, params) {
			state.bottomNavigationIndex = params;
		},
		hasLogin(state, params) {
			state.hasLogin = params;
		},
		bottomArea(state, params) {
			state.bottomArea = params;
		},
		bottomHeight(state, params) {
			state.bottomHeight = params;
		},
		// 登录
		userinfo(state, params) {
			state.hasLogin = true;
			state.userinfo = params;
			uni.setStorage({
				key: 'userinfo',
				data: params
			})
		},
		token(state, params) {
			state.token = params;
			uni.setStorage({
				key: 'AUTH_TOKEN',
				data: params
			})
		},
		appId(state, params) {
			state.appId = params;
			uni.setStorage({
				key: 'appId',
				data: params
			})
		},
		shopData(state, params) {
			state.shopData = params;
			uni.setStorage({
				key: 'shopData',
				data: params
			})
		},
    }  
});
export default store;