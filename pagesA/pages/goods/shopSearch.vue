<template>
	<view class="shopSearchPage">
		<view class="inner_page">
			<!-- 搜索框 -->
			<view class="search_box">
				<view class="top">
					<view class="left">
						<input type="text" :value="keyword" @blur="inputBlur" @input="inputKey" class="input_key" placeholder="奔驰E300L" placeholder-class="place_holder"/>
						<view class="cancal_box" @tap="cancelKey" v-if="keyword.length>0">
							<image class="img" :src="realmImg('shopSearch/del_key.png')" mode="widthFix"></image>
						</view>
					</view>
					<view class="right" @tap="goBack">取消</view>
				</view>
				<view class="bottom" v-if="isShow">
					<view class="list" v-for="(item, index) in keyDream" :key="index" @tap="tapKey(item)">{{item}}</view>
				</view>
			</view>
			
			<!-- 搜索历史 -->
			<view class="history" v-if="historyData.length">
				<view class="top">
					<text class="title">搜索历史</text>
					<view class="del" @tap="delHistory" >
						<image class="img" :src="realmImg('shopSearch/del.png')" mode="widthFix"></image>
					</view>
				</view>
				<view class="list" v-for="(item, index) in historyData" :key="index" @tap="tapKey(item)">{{item}}</view>
			</view>
			
			<!-- 热门搜索 -->
			<view class="host">
				<view class="title">热门搜索</view>
				<view class="host_box">
					<view class="list" v-for="(item, index) in hostData" :key="index" @tap="tapKey(item)">
						<image class="img" v-if="index==0" :src="realmImg('shopSearch/1.png')" mode="widthFix"></image>
						<image class="img" v-if="index==1" :src="realmImg('shopSearch/2.png')" mode="widthFix"></image>
						<image class="img" v-if="index==2" :src="realmImg('shopSearch/3.png')" mode="widthFix"></image>
						<text v-if="index!==0&&index!==1&&index!==2" class="list_index">{{index+1}}</text>
						<text class="name" :class="index==0||index==1||index==2 ? 'special':''">{{item}}</text>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 是否显示关键词联想
				isShow: false,
				// 关键词联想
				keyDream:['奔驰E300L','特斯拉model 3','雷克萨斯es','红旗S9','丰田凯美瑞','宝马5系'],
				// 搜索关键词
				keyword:'',
				// 搜索历史数据
				historyData: ['奔驰E300L','特斯拉model 3','雷克萨斯es','红旗S9','丰田凯美瑞','宝马5系'],
				// 热门搜索
				hostData: ['玛莎拉蒂', '奔驰S级', '保时捷 panamera', '宝马5系', '奥迪A4L', '丰田 凯美瑞', '丰田 卡罗拉', '马自达 CX-4']
			}
		},
		onShow() {
			// 从本地缓存中获取用户搜索词
			this.getHistory();
		},
		methods: {
			// 返回上一级
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 从本地缓存中获取用户搜索词
			getHistory(){
			},
			// 点击了关键词联想
			tapKey(item) {
				uni.showToast({
				    title: '功能开发中...',
					icon: 'none'
				});
				return false;
				// 查看现有搜索和历史搜索关键词是否相同
				this.getSameKey(item);
			},
			// 查看现有搜索和历史搜索关键词是否相同
			getSameKey(e) {
				uni.showToast({
				    title: '功能开发中...',
					icon: 'none'
				});
				return false;
				let data = uni.getStorageSync('keyword') || [];
				let index = data.indexOf(e);
				if(index !== -1) {
					// 说明历史搜索记录里面存在当前搜索的商品，现在把它放在第一个位置
					let key = data.splice(index, 1)[0];
					data.unshift(key)
					uni.setStorage({
						key: 'keyword',
						data: data
					})
				} else if(index == -1){
					// 说明历史搜索记录里不存在搜索的商品，但是也把它放在第一个位置。
					data.unshift(e)
					uni.setStorage({
						key: 'keyword',
						data: data
					})
				}
			},
			// 取消搜索
			cancelKey() {
				
				this.keyword = '';
				this.isShow = false;
			},
			// blur 输入框输入关键字
			inputBlur(e) {
				uni.showToast({
				    title: '功能开发中...',
					icon: 'none'
				});
				return false;
				this.isShow = true;
				this.keyword = e.detail.value;
			},
			// input 输入框输入关键词
			inputKey(e) {
				uni.showToast({
				    title: '功能开发中...',
					icon: 'none'
				});
				return false;
				this.isShow = true;
				this.keyword = e.detail.value;
			},
			// 删除历史记录
			delHistory() {
				uni.showToast({
				    title: '功能开发中...',
					icon: 'none'
				});
				return false;
				uni.showModal({
				    title: '提示',
				    content: '确定清空搜索记录吗?',
					confirmColor: '#3277FE',
					cancelColor: '#979CA7',
				    success: (res) => {
				        if (res.confirm) {
				            this.historyData = [];
				            uni.setStorage({
				            	key: 'keyword',
				            	data: this.historyData
				            })
				        } else if (res.cancel) {
				        }
				    }
				});
			},
		}
	}
</script>


