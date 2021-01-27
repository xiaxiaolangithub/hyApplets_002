<template>
	<view class="categoryPage">
		<!-- 头部背景图 -->
		<image class="header_img" :src="realmImg('shopHome/header_back.png')" mode="widthFix"></image> 
		
		<!-- 自定义导航栏 -->
		<hx-navbar
			:back="true" 
			class="shop_home_navbar"
			:fixed="true"
			transparent="auto"
			:background-color="[[78,132,230],[99,201,238],[190,245,228]]"
			:pageScroll.sync="scrollData">
			<view class="input_view" @tap="tapSearch">
				<image class="search_icon" :src="realmImg('shopHome/search.png')" mode="widthFix"></image>
				<input class="home_input" type="text" placeholder-class="place_holder" placeholder="搜索"/>
			</view>
		</hx-navbar>
		
		
		<view class="category_contanier">
			<!-- 左侧分类导航 -->
			<scroll-view scroll-y="true" class="left">
				<view class="row" v-for="(category,index) in navData" :key="category.cls_id" :class="[index==showCategoryIndex?'on':'']"
				 @tap="showCategory(index)">
					<view class="text">
						<view class="block"></view>
						{{category.title}}
					</view>
				</view>
			</scroll-view>
			<!-- 右侧子导航 -->
			<scroll-view scroll-y="true" class="right">
				<view class="category" v-for="(item,index) in goodsData" :key="index">
					<view class="box">
						<view class="title">{{item.title}}</view>
						<view class="goods" @tap="toDetail(item)">
							<view class="list" v-for="(ele, i) in item.goods" :key="i">
								<view class="img">
									<image :src="ele.url" mode="widthFix"></image>
								</view>
								<view class="name">{{ele.name}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				scrollData: {},
				showCategoryIndex: '0',
				navData: [		// 菜单数据
					{title: '汽车配件'},
					{title: '美容清洗'},
					{title: '品牌轮胎'},
					{title: '常规保养'},
					{title: '空调养护'},
					{title: '品牌轮胎'},
					{title: '水箱养护'},
					{title: '刹车养护'},
					{title: '车载电器'},
					{title: '内饰精品'},
					{title: '常用配件'},
					{title: '汽车配件'},
					{title: '常用配件'},
					{title: '汽车配件'},
				],
				goodsData:[		// 商品数据
					{
						title: '生活精品',
						goods: [
							{
								name: '电风扇',
								url:  this.realmImg('category/p2.png'),
							},
							{
								name: '蓝牙音箱',
								url:  this.realmImg('category/p1.png'),
							},
							{
								name: '电风扇',
								url:  this.realmImg('category/p3.png'),
							},
							{
								name: '蓝牙音箱',
								url:  this.realmImg('category/p2.png'),
							},
							{
								name: '电风扇',
								url:  this.realmImg('category/p1.png'),
							},
						]
					},
					{
						title: '美容团购',
						goods: [
							{
								name: '电风扇',
								url:  this.realmImg('category/p2.png'),
							},
							{
								name: '蓝牙音箱',
								url:  this.realmImg('category/p1.png'),
							},
							{
								name: '电风扇',
								url:  this.realmImg('category/p3.png'),
							},
							{
								name: '蓝牙音箱',
								url:  this.realmImg('category/p2.png'),
							},
							{
								name: '电风扇',
								url:  this.realmImg('category/p1.png'),
							},
							{
								name: '电风扇',
								url:  this.realmImg('category/p2.png'),
							},
							{
								name: '蓝牙音箱',
								url:  this.realmImg('category/p1.png'),
							},
							{
								name: '电风扇',
								url:  this.realmImg('category/p3.png'),
							},
							{
								name: '蓝牙音箱',
								url:  this.realmImg('category/p2.png'),
							},
							{
								name: '电风扇',
								url:  this.realmImg('category/p1.png'),
							},
						]
					}
				],			
			}
		},
		//必须在页面加 onPageScroll(e){} ，才能滑动显示背景
		onPageScroll(e){
			this.scrollData = e;
		},
		onShow() {
		},
		methods: {
			// 返回上一级
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			showCategory(index) {
				this.showCategoryIndex = index;
			},
			// 去搜索商品页面
			tapSearch() {
				uni.navigateTo({
					url: './shopSearch'
				})
			},
			// 去商品详情页面
			toDetail(item) {
				uni.navigateTo({
					url: './goodDetail'
				})
			},
		}
	}
</script>


<style>
	page{
		width:100%;
		height: 100%;
	}
</style>