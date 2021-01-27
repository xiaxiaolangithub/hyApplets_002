// 补充说明 
const interfaces = {
	
	// 登录
	login: 'customer/login',									// 登录
	getDirectVoucher:'customerVoucher/getDirectVoucher',		// 登录的情况下请求发放优惠券信息
	getRescuePhone: 'customer/getRescuePhone',					// 得到道路救援电话
	shopInfo: 'shop/shopInfo',									// 获取店铺信息
	phoneCode: 'sms/modifyPhoneCode',							// 获取修改手机号短信验证码
	editPhone: 'customer/modifyPhone',							// 修改手机号
	
	// 文章
	articletTypes: 'articleType/listAll',						// 获取文章类型
	articleList: 'article/list',								// 文章列表
	articleDetail: 'article/detail',							// 获取文章详情
	
	
	// 优惠券
	getVoucher: 'voucher/list',									//	领券中心列表页面
	grabVoucher: 'voucher/get',									//  领券中心领优惠券
	voucherCenterDetail: 'voucher/detail',						//  从领券中心来的优惠券详情
	customerVoucherList: 'customerVoucher/list', 				//	卡包数据列表
	customerVoucherDetail: 'customerVoucher/detail',			//	从卡包来的优惠券详情
	
	// 用户车辆
	addUserCar: 'customerCar/save',								// 用户增加车辆
	editUserCar: 'customerCar/edit',							// 用户编辑车辆
	detailUserCar: 'customerCar/detail',						// 用户车辆详情
	setDefaultCar: 'customerCar/setDefault',					// 设置默认车辆
	userCarList: 'customerCar/list',							// 用户车辆档案
	delUserCar: 'customerCar/delete',							// 删除用户车辆档案
	carPullDownList: 'customerCar/pullDownList',				// 车辆下拉列表
	
	// 车辆相关
	brandCarList: 'brand/list',									// 获取车辆品牌列表
	modelList: 'model/getBySeriesId',							// 根据车系id查询当前车所有车型数据 
	seriesListBrand: 'series/getByBrandId',						// 根据品牌id查询车系
	hostBrandList: 'brand/hotList',								// 热门品牌车辆
	carPullDownList: 'customerCar/pullDownList',    			// 车辆下拉列表
	uploadOcr: 'ai/ocr',										// ocr
	
	
	// 新车列表
	getCarList: 'car/list',										// 得到新车列表
	carDetail: 'car/detail',									// 新车详情
	sameCar: 'car/sameSeriesList',								// 详情中获取同车系车型列表
	submitAsk: 'inquiry/save',									// 提交询问底价
	seriesList: 'series/list',									// 车系列表
	modelList: 'model/list',									// 车系里的车型列表
	
	//专属服务
	staffListPosition: 'staff/listPosition',					//　该店所有职位列表
	staffListDS: 'staff/listDS',								//　分页查询专属服务员工
	saveAppoint: 'appointment/save',							// 专属服务提交	
	
	//保养项目
	maintainPackageList: 'maintainPackage/list',							//条件分页查询保养套餐
	appointmentRemainPullDownList: 'appointmentRemain/pullDownList',		//获取某日期的所有预约时间段及其余量
	
	//预约相关
	appointmentSave: 'appointment/save',						//　新增预约
	appointmentList: 'appointment/list',						//　预约列表
	appointmentCancel: 'appointment/cancel',					//　取消预约
	shopGetShopAddressVO: 'shop/getShopAddressVO',				//　获店铺位置
	appointmentDetail: 'appointment/detail',					//　获取预约详情
	
	// 专属服务提交
	// saveAppoint: 'appointment/save',							// 专属服务提交	
	
	
	// 积分管理
	getSignRecords: 'customerIntegral/checkInHistory',			// 得到签到记录
	handleSign: 'customerIntegral/checkIn',						// 签到
	getIntegralList: 'customerIntegral/taskList',				// 得到积分任务列表
	
	//用户信息
	customerPerInfo: 'customer/perInfo',						// 获取用户信息
	customerUpdatePerInfo: 'customer/updatePerInfo', 			// 修改个人信息
	getMineInfo: 'customer/perCenter',							// 数值：积分、优惠券、待预约商品、收藏
	
	
	//获取订阅消息模板
	shopSubMsgTemplateList: 'shopSubMsgTemplate/list',			//获取订阅消息模板
	
	//保险信息
	insuranceList: 'insurance/list',							//　保单列表
	insuranceDetail: 'insurance/detail',						//　保单详情
	insuranceSave: 'insurance/save',							//　新增保单
	insuranceCancel: 'insurance/cancel',						//　取消保单
	insuranceDelete: 'insurance/delete',						//　删除保单
	getPremiumRatio: 'premiumSetting/getPremiumRatio',			//  获取保费比例
	reqSnGetReqSnL: 'reqSn/getReqSn',							//  获取下单编号
	
	//活动信息
	activityList: 'activity/list',								//	活动列表
	activityDetail: 'activity/detail',							//	活动信息
	activityApplyApply: 'activityApply/apply',					// 	活动报名
	advertisementList: 'advertisement/list',					//  首页活动列表		
						
						
	// 商城
	randomRecommend: 'product/randomRecommend',					// 商城精品推荐
	getGoodsList: 'product/list',								// 商城限时促销和普通商品
	goodsDetail: 'product/detail',								// 得到商品详情
	specGroupDetail: 'specGroup/detail',						// 查询规格组
	
	
	// 商品订单相关
	orderList: 'order/list',									// 订单列表
	orderDetail: 'order/detail',								// 得到订单详情
	delOrder: 'order/del',										// 删除订单
	cancelOrder: 'order/cancel',								// 取消订单
	getReqSn: 'reqSn/getReqSn',									// 获取请求编号
	createOrder: 'order/createOrder',							// 商品详情下单
	waitOrderPay: 'order/pay',									// 待付款订单进行下单
	
}
module.exports = interfaces;
