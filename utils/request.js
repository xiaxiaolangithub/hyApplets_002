
// 当前文件为 公共事件请求及页面跳转
import https from "@/utils/https.js";
import interfaces from "@/utils/interfaces.js";
import store from '@/store/index.js'

// 跳转tarbar, num表示页面底部导航索引
function goTaBar(num) {
	// store.commit('setBottomNavigationIndex', num)
	switch(num) {
		case 0:
			// 资讯页面
			uni.switchTab({
				url:'/pages/information/information'
			})
			break;
		case 1:
			// 商城页面 
			uni.switchTab({
				url:'/pages/home/home'
			})
			break;
		case 2:	
			// 专属服务
			uni.switchTab({
				url:'/pages/exclusive/exclusive'
			})
			break;
		case 4:
			// 我的
			uni.switchTab({
				url:'/pages/user/user'
			})
			break;
	}
}

// 跳转页面
function goPages(info) {
	switch(info) {
		case 'login':
			// 登录页面
			uni.navigateTo({
				url: '/pagesB/pages/setting/login'
			})
			break;
		case 'selectMaintain':
			// 保养预约
			uni.navigateTo({
				url: '/pages/shop/reserve/selectMaintain'
			})
			break;
		case 'carDossier':
			// 爱车档案
			uni.navigateTo({
				url: '/pagesB/pages/ownCar/carDossier'
			});
			break;
		case 'carList':
			// 新车展厅
			uni.switchTab({
				url: '/pages/newCar/carList'
			});
			break;
		case 'integral':
			// 积分列表
			uni.navigateTo({
				url: '/pagesB/pages/integral/integral'
			});
			break;
		case 'pointsMall':
			// 积分商城
			uni.navigateTo({
				url: '/pagesB/pages/integral/pointsMall'
			});
			break;
		case 'cardBag':
			// 优惠券
			uni.navigateTo({
				url: '/pagesA/pages/cardBag/cardBag?type=cardBag'
			})
			break;
		case 'changeCard':
			// 卡包
			uni.navigateTo({
				url: '/pagesA/pages/cardBag/changeCard?type=changeCard'
			})
			break;
		case 'upDateName':
			// 修改姓名
			uni.navigateTo({
				url:'/pagesB/pages/setting/upDateName'
			});
			break;
		case 'records':
			// 我的预约记录
			uni.navigateTo({
				url:'/pagesB/pages/appoint/records'
			});
			break;
		case 'orderList':
			// 我的订单列表
			uni.navigateTo({
				url: '/pagesB/pages/order/orderList'
			})
			
	}
	
	
}


// 领取优惠券
function receiveCoupon (id) {
	https({
		url: interfaces.grabVoucher,
		method: 'GET',
		data: {
			id: Number(id),
		},
		success: ((res) => {
			if(res.code == 1) {
				uni.showToast({
					title: '领取成功 ！',
				});
				uni.$emit("handleFun", {
					navIndex: 0
				});
			} else{
				uni.showToast({
					title: res.local,
					icon: 'none'
				})
			}
		})
	})
}

export {
	goTaBar,
	goPages,
	receiveCoupon,
	
}