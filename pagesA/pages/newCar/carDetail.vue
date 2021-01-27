<template>
	<view class="carDetailPage">
			<view class="look_video" hover-class="handle_hover" v-if="basicObj.video && basicObj.video !== ''" @tap="toVideo">视频</view>
			<!-- 轮播图 -->
			<swiper class="swiper_box" :circular="true" :autoplay="true">
				<swiper-item class="swiper_item" v-for="(swiper, index) in swiperList" :key="index" @tap="lookImg(index)">
					<image class="image" :src="swiper" mode="widthFix" />
				</swiper-item>
			</swiper>
		<view class="tips">
			<view class="detail_section">
				<!-- 汽车价格、参数 -->
				<view class="basic">
					<view class="info">{{basicObj.modelName}}</view>
					<view class="price">
						<view class="guide">厂商指导价：{{basicObj.guidePrice}}万</view>
						<view class="discount" v-if="basicObj.discountPrice&&basicObj.guidePrice>=basicObj.discountPrice">门店优惠价: {{basicObj.discountPrice.toFixed(2)}}万</view>
					</view>
				</view>
				<view class="place"></view>
				<!-- 参数配置 -->
				<view class="configure">
					<view class="title">
						参数配置
					</view>
					<view class="config_list" v-for="(item, index) in configData" :key="index">
						<view class="config_title" >
							<view class="left">{{item.name}}</view>
							<view class="right">
								<view class="icon">
									<view class="icon_biao yuan"></view>
									标配
								</view>
								<view class="icon">
									<view class="icon_xuan yuan"></view>
									选配
								</view>
								<view class="none">
									- 无
								</view>
							</view>
						</view>
						<view class="line_list" v-for="(ele, i) in item.value" :key="i">
							<view class="name">{{ele.text}}</view>
							<view class="value" >{{ele.value.trim()}} </view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 页面底部 -->
		<view class="page_footer">
			<view class="left">
				<button class="share" open-type="share">
					<text class="iconfont icon-fenxiang"></text>
					<text>分享</text>
				</button>
			</view>
			<view class="right" hover-class="handle_hover" @tap="askPric">获取底价</view>
		</view>



	</view>
</template>

<script>
	import tuiSticky from '@/components/tui-sticky/tui-sticky.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			tuiSticky,
			uniLoadMore
		},
		data() {
			return {
				swiperList: [], 			// 轮播数据
				basicObj: { 				// 车辆基本信息				
					modelName: '', 			// 展示车型  
					price: '',
					video: '', 				// 车视频 
				},
				configData: [],				// 参数配置
				modelId: null, 				
				seriesName: '',
				seriesId: null,
				carTitle: '',
				pageTitle: '',				// 页面标题
			}
		},
		onShareAppMessage(res) {
			return {
				title: this.basicObj.modelName,
				path: `/pagesA/pages/newCar/carDetail?modelId=${this.modelId}`
			}
		},
		onShareTimeline() {
			return {
				title: this.basicObj.modelName,
				url: "/pagesA/pages/newCar/carDetail",
				query: `modelId=${this.modelId}`
			}
		},
		onLoad(e) {
			this.modelId = Number(e.modelId);
			this.getDetail();
			
		},
		
		methods: {
			// 得到新车详情
			getDetail() {
				this.$http({
					url: `${this.$apis.carDetail}?id=${this.modelId}`,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.configData = result.config;
						this.seriesName = result.seriesName;
						this.seriesId = Number(result.series);
						
						this.swiperList = result.pics;
						this.carTitle = result.brandName;
						this.pageTitle = `${result.brandName} ${result.seriesName}`;
						uni.setNavigationBarTitle({
							title: this.pageTitle
						})
						/* let level;
						switch (result.level) {
							case 'NEW_ENERGY':
								level = '新能源';
								break;
							case 'MINI':
								level = '微型';
								break;
							case 'SMALL':
								level = '小型';
								break;
							case 'COMPACT':
								level = '紧凑型';
								break;
							case 'MEDIUM':
								level = '中型';
								break;
							case 'MIDDLE_LARGE':
								level = '中大型';
								break;
							case 'LARGE':
								level = '大型';
								break;
							case 'SUV':
								level = 'suv';
								break;
							case 'MPV':
								level = 'mpv';
								break;
							case 'SPORTS':
								level = '跑车';
								break;
						} */
						this.basicObj = {
							modelName: result.modelName,
							guidePrice: result.guidePrice,
							discountPrice: result.discountPrice,
							video: result.video,
							brandName: result.brandName
						}
						
					})
				})
			},
			// 底部询问底价
			askPric() {
				uni.navigateTo({
					url: `./askPrice?modelId=${this.modelId}&seriesId=${this.seriesId}&seriesName=${this.seriesName}&type=1`
				})
			},
			// 去视频页面
			toVideo() {
				uni.navigateTo({
					url: `./video?url=${this.basicObj.video}&name=${this.pageTitle}`
				})
			},
			// 查看图片
			lookImg(index) {
				uni.previewImage({
				    current: index, 
				    urls: this.swiperList
				})
			},
		}
	}
</script>
