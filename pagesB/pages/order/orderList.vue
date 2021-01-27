<template>
	<view class="orderListPage">
		<view class="header">
			<view class="item" v-for="(item,index) in navList" :key="index" @click="bindNav(index)">
				<view class="text" :class="[navIndex==index?'active':'']">{{item}}</view>
				<view class="line">
					<image :src="realmImg('cardBag/line.png')" v-if="navIndex==index" ></image>
					<image  v-else></image>
				</view>
			</view>
		</view>
		
		<view class="inner" v-if="orderList.length">
			<view class="list" v-for="(item, index) in orderList" :key="index" @click="toDetail(item)">
				<view class="top">
					订单号{{item.orderSn}}
					<text class="status">{{item.stateText}}</text>
				</view>
				<view class="goods" v-for="(ele, i) in item.productList" :key="i">
					<image :src="ele.productMainPic" mode="" class="left"></image>
					<view class="right">
						<view class="name">{{ele.productName}}</view>
						<view class="other">
							<view class="spec_num">
								<view class="spec">{{item.spec}}</view>
								<view class="num">共{{ele.productQuantity}}件</view>
							</view>
							<text>  ¥  {{item.payAmount}}</text>
						</view>
					</view>
				</view>
				<view class="handle">
					<view class="pay" @click.stop="$noMultipleClicks(goPay, item)"   hover-class="handle_hover" v-if="item.stateText==='待付款'">微信支付</view>
					<view class="pay del"  hover-class="hover" v-if="item.stateText==='已完成'" @tap.stop="delTips(item)">删除订单</view>
				</view>
			</view>
		</view>
		
		<!-- 数据为空 -->
		<empty-part :isShow="tipsObj.isShow" :url="tipsObj.url" :tips="tipsObj.tips" :leftText="tipsObj.leftText" :middleText="tipsObj.middleText" :rightText="tipsObj.rightText"></empty-part>
		
	</view>
</template>

<script>
	import emptyPart from '@/components/empty_part.vue'
	import { insertStr, getObjectValues } from '@/static/js/tool.js'
	export default {
		components: {
			emptyPart
		},
		data() {
			return {
				// 订单状态
				navList: ['全部', '待付款', '已支付', '已完成'], 
				navIndex: 0,
				noClick:true,
				orderList: [],
				totalPages: 0,
				tipsObj: {
					isShow: false,
					url: this.realmImg('order/no_order.png'),
					tips: '暂无订单',
					leftText: '',
					middleText: '',
					rightText: '',
				},
				objData: {
					current: 1,
					size: 20
				},
				// 付款需要的参数
				payParams: {},
				isPull: false,				// 是否是页面上拉加载
			}
		},
		// 上拉加载
		onReachBottom() {
			this.objData.current++;
			if (this.objData.current <= this.totalPages) {
				this.getList();
			} 
		},
		onLoad(e) {
			// 判断当前显示哪个状态的订单
			this.switchOrder(e);
			this.readyQuery();
		},
		onShow() {
			uni.$on("funUpdate", (res) => {
				// 如果订单详情页面有对订单列表影响的话，这里需要重新再请求一下订单列表。
				if(res.isUpdate) {
					this.objData.current = 1;
					this.orderList = [];
					// 准备去请求订单
					this.readyQuery();
				}
				// 清除监听
				uni.$off('funUpdate');
			})
			
		},
		onPullDownRefresh() {
			this.objData.current = 1;
			this.isPull = true;
			// 准备去请求订单
			this.getList();
			setTimeout(()=> {
				uni.stopPullDownRefresh();
			}, 500);
		},
		methods:{
			// 判断当前显示哪个状态的订单
			switchOrder(e) {
				let status = e.status;
				switch(status) {
					case '待付款':
						this.navIndex = 1;
						break;
					case '已支付':
						this.navIndex = 2;
						break;
					case '已完成':
						this.navIndex = 3;
						break;
					default:
						// 全部
						this.navIndex = 0;
						break;
				}
				
			},
			// 准备去请求订单
			readyQuery() {
				this.objData = {
					current: 1,
					size: 20,
					state: this.navIndex - 1
				}
				if(this.navIndex === 0) {
					// 查看全部订单，不传state
					delete this.objData.state
				}
				this.getList();
			},
			// 得到订单列表数据
			getList() {
				this.$http({
					url: this.$apis.orderList,
					method: 'POST',
					data: this.objData,
					success: ((res) => {
						let result = res.data;
						result.records.forEach((ele) => {
							switch(ele.state) {
								case 0:	
									ele.stateText = '待付款';
									break;
								case 1:
									ele.stateText = '已支付';
									break;
								case 2:
									ele.stateText = '已完成';
									break;
								case 3:
									ele.stateText = '已取消';
									break;
							}
							ele.spec = getObjectValues(ele.productList[0].specGroupValue);
						})
						let sumData = [];
						sumData = this.isPull ? sumData.concat(result.records): sumData.concat(this.orderList).concat(result.records);
						this.orderList = sumData;
						console.log(this.orderList)
						this.totalPages = Number(result.pages);
						this.isPull = false;
						this.tipsObj.isShow = this.orderList.length ? false : true;
					})
				})
			},
			// 点击订单状态
			bindNav(index) {
				this.current = 1;
				this.totalPages = 0;
				this.navIndex = index;
				this.isPull = true;
				// 准备去请求订单
				this.readyQuery();
			},
			// 删除订单提示框
			delTips(item) {
				uni.showModal({
					title: '提示',
					content: `确定删除该订单吗？`,
					cancelColor: '#979CA7',
					confirmColor: '#3377FF',
					cancelText: '取消',
					confirmText: '确认',
					success: (res) => {
						if (res.confirm) {
							this.delOrder(item);
						} else if (res.cancel) {}
					}
				});
			},
			// 删除订单请求
			delOrder(item) {
				this.$http({
					url: `${this.$apis.delOrder}?orderSn=${item.orderSn}`,
					method: 'GET',
					success: ((res) => {
						if(res.code === 1) {
							uni.showToast({
								title: '删除成功。',
								icon: 'none',
								duration: 2000
							});
							this.objData.current = 1;
							this.isPull = true;
							this.getList();
						}
					})
				})
			},
			// 去订单详情
			toDetail(item) {
				uni.navigateTo({
					url: `./detail?type=${item.stateText}&orderSn=${item.orderSn}`
				})
			},
			// 待付款订单直接支付
			goPay(item) {
				// 待付款订单直接拿订单号去支付
				this.$http({
					url: `${this.$apis.waitOrderPay}?orderSn=${item.orderSn}`,
					method: 'GET',
					success: ((res) => {
						this.payParams = res.data;
						this.payQuery();
					})
				})
			},
			// 待付款订单支付请求
			payQuery() {
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: this.payParams.timeStamp,
					nonceStr: this.payParams.nonceStr,
					package: this.payParams.packageValue,
					signType: this.payParams.signType,
					paySign: this.payParams.paySign,
					success: (res)=> {
						uni.showToast({
							title: "支付成功",
							duration: 2000,
							icon: 'none',
						});
						this.objData.current = 1;
						this.isPull = true;
						this.getList();
					},
					fail:(err) =>{
						uni.showToast({
							title: "支付失败",
							duration: 2000,
							icon: 'none',
						});
					}
				});
			},
		}
	}
</script>


<style lang="scss">
	page{
		background: #F7F7F7;
	}
</style>
