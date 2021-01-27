<template>
	<view class="pointsMallPage">
		<!-- 总积分及兑换记录 -->
		<view class="top">
			<view class="total">
				<text class="num">{{totalNum}}</text>积分
			</view>
			<!-- <view class="records">
				<view class="box">
					<text class="text" @tap="tapPointRecord">兑换记录</text>
					<text class="iconfont icon-xiangyoujiantou"></text>
				</view>
			</view> -->
		</view>
		
		<view class="page_inner">
			<!-- 标题切换 -->
			<view class="title_change">
				<view class="top_title" v-for="(info, index) in infoData" :key="index" @tap="tapTitle(index)">
					<view class="title" :class="index==titleIndex?'active_title':''">{{info}}</view>
					<view class="img_line">
						<image v-if="index==titleIndex" :src="realmImg('cardBag/line.png')" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!-- 券信息 -->
			<view class="points_container">
				<view class="list" v-for="(item, index) in pointData" :key="index">
					<view class="top">
						<view class="point_back">
							<view class="price">
								{{item.price}}
								<text class="yuan">元</text>
							</view>
							<view class="title">—   <text>汽车保养券</text>   —</view>
						</view>
						<!-- 即将开始倒计时 -->
						<view class="count_time" v-if="item.isStart==1">{{item.downTime}}</view>
					</view>
					<view class="list_bottom">
						<view class="bottom_title">{{item.title}}</view>
						<view class="bottom_box">
							<view class="bottom_left">
								<view class="point_integral"> {{item.integral }}积分</view>
								<view class="point_num">剩余{{item.num}}件</view>
							</view>
							<view class="begin" v-if="item.isStart == 1" @tap="tapBegin(item, index)">
								<view class="begin_box">即将开始</view>
							</view>
							<view class="cashed" v-if="item.isStart == 2 " @tap="tapCashed">已兑完</view>
							<view class="exchange" v-if="item.isStart ==3 " @tap="exchange(item, index)">兑换</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 无更多显示 -->
			<uni-load-more iconType="snow" :iconSize="30" :status="status" />
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default{
		components:{
			uniLoadMore
		},
		data() {
			return {
				totalNum: 600,								// 共多少积分
				infoData: ['卡券商城','异业联盟'],			// 标题数据
				titleIndex: 0,								// 当前点击中哪个标题
				pointData: [								// 券数据
					{
						price: 100,
						date:'2020-8-7 15:00:00',
						integral:2000,
						num: 100,
						isStart: 1,
						downTime: '02小时13分22秒后开始',
						title: '汽车保养50元券'
					},
					{
						price: 100,
						date:'2020-8-1 15:00:00',
						integral:2000,
						num: 0,
						isStart: 2,
						title: '汽车保养50元券'
					},
					{
						price: 100,
						date:'2020-8-1 15:00:00',
						integral:2000,
						num: 100,
						isStart: 3,
						title: '汽车保养50元券'
					},
					{
						price: 100,
						date:'2020-8-1 15:00:00',
						integral:2000,
						num: 100,
						isStart: 3,
						title: '汽车保养50元券'
					},
				],
				status: 'noMore',							// 上拉加载更多数据
			}
		},
		methods:{
			// 点击标题
			tapTitle(index) {
				this.titleIndex = index;
				switch(this.titleIndex) {
					case 0:
						this.pointData = [
							{
								price: 100,
								date:'2020-8-7 15:00:00',
								integral:2000,
								num: 100,
								isStart: 1,
								downTime: '02小时13分22秒后开始',
								title: '汽车保养50元券'
							},
							{
								price: 100,
								date:'2020-8-1 15:00:00',
								integral:2000,
								num: 0,
								isStart: 2,
								title: '汽车保养50元券'
							},
							{
								price: 100,
								date:'2020-8-1 15:00:00',
								integral:2000,
								num: 100,
								isStart: 3,
								title: '汽车保养50元券'
							},
							{
								price: 100,
								date:'2020-8-1 15:00:00',
								integral:2000,
								num: 100,
								isStart: 3,
								title: '汽车保养50元券'
							}
						]
						break;
					case 1:
						this.pointData = [
							{
								price: 100,
								date:'2020-8-1 15:00:00',
								integral:2000,
								num: 100,
								isStart: 3,
								title: '汽车保养50元券'
							},
							{
								price: 100,
								date:'2020-8-7 15:00:00',
								integral:2000,
								num: 100,
								isStart: 1,
								downTime: '02小时13分22秒后开始',
								title: '汽车保养50元券'
							},
							{
								price: 100,
								date:'2020-8-1 15:00:00',
								integral:2000,
								num: 0,
								isStart: 2,
								title: '汽车保养50元券'
							}
						]
					break;	
				}
			},
			// 查看兑换记录
			tapPointRecord() {
				uni.showToast({
					title: '兑换记录, 待开发...',
					icon: 'none'
				})
			},
			// 积分已兑换完
			tapCashed() {
				uni.showToast({
					title: '积分已兑换完啦。',
					icon: 'none'
				})
			},
			// 兑换积分
			exchange(item, index) {
				uni.showToast({
					title: '兑换积分, 待开发...',
					icon: 'none'
				})
			},
			// 即将开始兑换
			tapBegin(item, index) {
				uni.showToast({
					title: `别急哦，${item.downTime}兑换。`,
					icon: 'none'
				})
			},
		}
	}
</script>

<style>
	page{
		background:#F7F7F7;
	}
</style>

