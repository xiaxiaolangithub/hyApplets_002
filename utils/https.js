
// 补充说明 
import store from '@/store/index.js'
export default function (param)  {
	let obj = {};
	var defaultOptions = {
		// 线上域名：https://api.hangzhouhuiyao.cn/
		// 开发域名：https://api-dev.hangzhouhuiyao.cn/
		// 本地：http://192.168.3.12:8080/
		root: 'https://api-dev.hangzhouhuiyao.cn/',
		method: 'POST',
		header: {"content-type":"application/json"},
		data: obj || {},
		isShowLoading: false,
	}
	
	var opt = Object.assign({}, defaultOptions, param);
	
	// 发起请求 加载动画
	opt.isShowLoading && uni.showLoading({title:"数据加载中..."})
	
	
	let ajaxParams = {
		url: opt.root + opt.url,
		method: opt.method,
		header: opt.header,
		data: Object.assign({},opt.data,defaultOptions.data),
		success: res => {
			let code = res.data.code;
			if(code === 1){ 
				// 请求成功
				(typeof opt.success == "function") && opt.success(res.data);
				return false;
			} 
			if(code === 401 || code === 407 || code === 406) {
				// 401:未登录      407:token失效    406:非法token
				uni.navigateTo({
					url: '/pagesB/pages/setting/login'
				})
				return false;
			} 
			
			uni.showToast({
				title: `抱歉, ${res.data.local} ！`,
				icon: 'none',
				duration:2000
			});
		},
		fail: (e) => {
			uni.showModal({
				content: e.local
			})
			typeof opt.fail == "function" && opt.fail(e.data);
		},
		complete: () => {
			opt.isShowLoading && uni.hideLoading();
			typeof opt.complete == "function" && opt.complete(e.data);
		}
	}
	
	
	// 不用登录，也需要有数据： 
	let directArr = [
		'article/list', 'articleType/listAll', 'article/detail', 							// 文章
		'series/list', 'car/list', 'car/sameSeriesList', 'car/detail',						// 车辆展厅
		'shop/shopInfo', 'staff/listDS','staff/listPosition',								// 企业信息
		'activity/list', 'activity/detail','activityApply/apply', 'advertisement/list',		// 活动信息
		'product/randomRecommend',	'product/list',	'specGroup/detail', 'product/detail',	// 商城商品										// 商城商品
	 ];
	const token =  uni.getStorageSync('AUTH_TOKEN');
	if(token) {
		if(opt.url !== '') {
			ajaxParams.header =  opt.method == 'GET' ? {
				'AUTH_TOKEN': token,
				'X-Requested-With': 'XMLHttpRequest',
				"Accept": "application/json",
				"Content-Type": "application/json; charset=UTF-8"
			} : {
				'AUTH_TOKEN': token,
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json; charset=UTF-8'
			};
			ajaxParams.dataType = 'json';
			// 发起网络请求
			uni.request(ajaxParams)
			
		} 
	} else {
		// 登录不需要传 Token,一些初始数据不需要传 Token
		let index = opt.url.indexOf('?');
		let url = index > - 1 ? opt.url.substr(0, index) : opt.url;
		if(opt.url === 'customer/login' || directArr.indexOf(url) > -1) {
			uni.request(ajaxParams);
		}
	}
}