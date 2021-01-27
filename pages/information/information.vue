<template>
	<view class="homeContainer">
		<!-- 热门资讯、汽车常识 标题 -->
		<view class="tabs">
			<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto" >
				<view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
					<text class="tab-title" :class="tabIndex==index ? 'tab-title-active' : ''">{{tab.name}}</text>
					<view :class="tabIndex==index?'active-line':'' "></view>
				</view>
			</scroll-view>
			<view class="news_container">
				<view class="new_list" v-for="(news, index) in infoData" :key="index" :class="index==infoData.length- 1 ? 'last_list': ''"
				 @tap="toDetail(news)">
					<view class="news_left">
						<view class="news_title">{{news.title}}</view>
						<view class="news_info">{{news.introduction}}</view>
					</view>
					<view class="news_img">
						<image class="img" :src="news.img" mode="aspectFill"></image>
					</view>
				</view>
				<uni-load-more v-if="infoData.length>0" iconType="snow" :iconSize="30" :status="status" />
			</view>
			
			
			<!-- 数据为空 -->
			<empty-part :isShow="tipsObj.isShow" :url="tipsObj.url" :tips="tipsObj.tips" :leftText="tipsObj.leftText" :middleText="tipsObj.middleText" :rightText="tipsObj.rightText"></empty-part>
			
		</view>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import emptyPart from '@/components/empty_part.vue'
	import { distinct } from '@/static/js/tool.js'
	export default {
		components: {
			uniLoadMore,
			emptyPart
		},
		onShareAppMessage(res) {
			return {
				title: '汽车资讯',
			}
		},
		onShareTimeline() {
		  return {
		    title: "汽车资讯",
		    url: "/pages/information/information",
		  }
		},
		data() {
			return {
				status: 'noMore',				// 上拉加载更多数据
				scrollInto: '',
				tabBars: [],					// 文章类型数据
				tabIndex: 0,
				lineIndex: 0,
				infoData: [],					// 文章数据
				currentPage: 1,
				pageSize: 20,
				articleTypeId: null,			// 类型iD
				totalPages: 0,					// 文章总页数
				tipsObj: {
					isShow: false,
					url: this.realmImg('info/no_info.png'),
					tips: '暂无资讯',
					leftText: '',
					middleText: '',
					rightText: '',
				},
				isPull: false,				// 是否是页面上拉加载
			}
		},
		onLoad() { 
			// 得到文章类型
			this.getTypes();
		},
		onPullDownRefresh() {
			// 得到文章类型
			this.currentPage = 1;
			this.getArticleList();
			this.isPull = true;
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 500);
		},
		// 上拉加载
		onReachBottom() {
			this.currentPage++;
			if (this.currentPage <= this.totalPages) {
				this.getArticleList();
			} 
		},
		onShareAppMessage(res) { //res参数可判断该分享的事件源
			if (res.from === 'button') { //当点击button时触发分享
			}
			if (res.from === 'menu') { //当点击右上角分享按钮时触发
			}
			return { //返回参数（必要的）
				title: '汽车资讯', //标题
				path: '/pages/information/information', //路径
			}
		},

		methods: {
			// 得到文章类型
			getTypes() {
				this.$http({
					url: `${this.$apis.articletTypes}?appId=${this.$store.state.appId}`,
					method: 'GET',
					success: ((res) => {
						if(res.data.length === 0) {
							this.tipsObj.isShow = true;
							return false;
						}
						this.tabBars = res.data;
						this.articleTypeId = Number(this.tabBars[0].id);
						// 得到文章列表
						this.getArticleList();
					})
				})
			},
			// 得到文章列表
			getArticleList() {
				this.$http({
					url: this.$apis.articleList,
					method: 'POST',
					data: {
						current: this.currentPage,				// 当前页 - 必传
						size: this.pageSize,					// 显示条数，默认10
						articleTypeId: this.articleTypeId,		// 类型 - 必传
						appId: this.$store.state.appId			// appid必传
					},
					success: ((res) => {
						let result = res.data;
						this.totalPages = Number(result.pages);
						if(this.totalPages === 1) {
							this.infoData = result.records;
						} else {
							let sumData = [];
							sumData = this.isPull ? sumData.concat(result.records) : sumData.concat(this.infoData).concat(result.records);
							this.infoData = sumData;
						}
						this.isPull = false;
						this.tipsObj.isShow = this.infoData.length ? false : true;
						this.status = 'noMore';
					})
				})
			},
			// 点击热门资讯、汽车常识
			ontabtap(e) {
				let result = e.currentTarget.dataset;
				this.tabIndex = result.current;
				this.articleTypeId = Number(e.currentTarget.id);
				this.currentPage = 1;
				this.isPull = true;
				this.getArticleList();
			},
			// 去文章详情页面
			toDetail(item) {
				let url = item.articleContentType === "CUSTOM" ?  `/pagesA/pages/information/infoDetail?id=${item.id}` : `./web-view?url=${item.url}&title=${item.title}`
				uni.navigateTo({
					url,
				})
				
			}
		},

	}
</script>
