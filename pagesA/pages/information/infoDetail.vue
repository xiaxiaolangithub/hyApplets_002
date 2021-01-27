<template>
	<view class="infoDetailPage">
		<view class="news_container">
			<view class="news_title">{{title}}</view>
			<!-- <view class="news_info">
				<view class="anchor_name">
					<text class="anchor">{{anchor}}</text>
					作者
				</view>
				<view class="news_date">{{date}}</view>
			</view> -->
			
			<!-- 文章内容： 解析富文本，包含点击查看图片 -->
			<jyf-parser class="news_content" :html="content" ref="article"></jyf-parser>
			<!-- <view class="news_car">
				<view class="news_car_inner">
					<view class="car_left">
						<view class="car_name">{{carName}}</view>
						<view class="car_price">{{carPrice}}</view>
					</view>
					<view class="car_right">
						<image :src="carImg" mode="widthFix" class="car_img"></image>
						<image :src="realmImg('news/right-icon.png')" mode="widthFix" class="right_icon"></image>
					</view>
				</view>
			</view> -->
		</view>
		 <view class="news_footer">
			<view class="footer_inner">
				<button class="share share_friend"  open-type="share">
					<!-- <image class="img" :src="realmImg('news/wx.png')" mode="widthFix"></image> -->
					分享给好友
				</button>
			</view>
		</view> 
	</view>
</template>

<script>
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	export default {
		components: {
		    jyfParser
		 },
		data() {
			return {
				title:'',		// 文章标题
				anchor: '',		// 文章作者
				date: '',		// 日期
				content: '',	// 文章内容
				carName: '',
				carPrice: '28.8万起',
				carImg: this.realmImg('news/car_detail.png'),
				articleId: null,	// 文章id
				
			}
		},
		onShareAppMessage(res) {
			return {
				title: this.title,
			}
		},
		/* onShareTimeline() {
			return {
				title: this.title,
				url: "/pagesA/pages/information/infoDetail",
				query: `id=${this.articleId}&title=${this.title}`,
			}
		}, */
		onLoad(e) {
			this.articleId = Number(e.id);
			this.getDetail();
			
		},
		
		
		methods: {
			// 得到文章详情
			getDetail() {
				this.$http({
					url: `${this.$apis.articleDetail}?id=${this.articleId}`,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.title = result.title;
						uni.setNavigationBarTitle({
							title: this.title
						});
						this.anchor = result.createUserName;
						this.date = result.createDate;
						this.content = result.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;margin:20rpx 0;" ');
						
					})
				})
			},
			// 查看汽车详情
			toDetail() {
				
			},
		}
	}
</script>
