<template>
	<view class="carBrandPage">
		<!-- 汽车搜索 -->
		<!-- <view class="city-search-wrap" v-if="isReach">
			<view class="search">
				<view class="l-search">
					<text class="iconfont icon-search"></text>
					<input class="input-search" type="text" :value="inputValue" placeholder="输入汽车品牌关键字" placeholder-style="color:#8E8F97"
					 :focus="searchFocus" @input="searchChange" />
					 <text class="icon-qingchu clear-input iconfont" v-if="isClearBtn" @click="inputValue = ''"></text>
				</view>
				<button class="r-cancel" open-type="navigateBack" delta="1" @click="isReach = false">取消</button>
			</view> -->
			<!-- 搜索列表  -->
			<!-- <view class="reach-content" v-show="inputValue">
				<block v-show="searchData.length">
					<view class="li borderBottom" v-for="item in searchData" :key="item.id" @click="citySearchList(item)">{{ item.name }}</view>
				</block>
				<view class="has-no-data" v-show="hasNoData">没有找到匹配数据~</view>
			</view>
		</view> -->

		<!-- 汽车列表 -->
		<view v-show="!isReach">
			 <!-- <view class="top-search">
				<button class="item" @click="isReach = true">
					<text class="iconfont icon-sousuo"></text>
					<text>搜索汽车品牌关键字</text>
				</button>
			</view> -->
			<scroll-view class="scroll-view" scroll-y scroll-with-animation="true" enable-back-to-top="true" :scroll-into-view="toIndex"
			 @scroll="scrollHandle">
				<view class="block" v-if="hostList.length">
					<view class="area list-item" id="hot">
						<view class="title-wrapp">本店品牌</view>
						<view class="ul" >
							<view class="li" hover-class="hover" v-for="(item, index) in hostList" :key="index" @click="selectCity(item)">
								<image :src="item.logo" mode="widthFix" class="host_img"></image>
								<view class="host_name">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 汽车列表  -->
				<view class="city-list">
					<view class="list list-item" v-for="(item, key) of carList" :key="key" :id="key">
						<view class="title">{{ key }}</view>
						<view class="item borderBottom" hover-class="hover" v-for="(innerItem, i) in item" :key="i" @click="selectCity(innerItem)">
							<image :src="innerItem.logo" mode="widthFix" class="car_img"></image>
							{{ innerItem.name }}
						</view>
					</view>
				</view>
				
			</scroll-view>


			<!-- 字母列表 -->
			<view class="alphabet" @touchstart="touchStart" @touchend="touchEnd" @touchmove.stop="touchMove">
				<view v-for="(item, index) in alphabet" :key="index" @touchstart="getLetter" @touchend="setLetter" :id="item">
					<view class="item" :class="{ active: currentLetter == item }">
						{{ item }}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 车系选择 -->
		<view class="example-body">
			<uni-drawer ref="showRight" mode="right" :mask-click="true" width="300">
				<view class="scroll-view">
					<scroll-view class="scroll-view-box" scroll-y="true">
						<view class="top">
							<image :src="selectCar.logo" mode="widthFix"></image>
							<text class="name">{{selectCar.name}}</text>
						</view>
						<view class="car_box">
							<view class="list"  v-for="(item, index) in systemCar" :key="index" @tap="tapSystem(item)">{{item.name}}</view>
						</view>
					</scroll-view>
				</view>
			</uni-drawer>
		</view>
	</view>
</template>

<script>
	import Drawer from '@/components/uni-drawer/uni-drawer.vue'
	export default {
		components:{
			Drawer
		},
		data() {
			return {
				// 是否显示抽屉
				showRight: false,
				isReach: false,
				inputValue: "",
				searchData: [], 				// 搜索的数据
				isClearBtn: false,
				cityId: null, 					// 汽车ID
				cityName: null, 				// 汽车名
				hostList:[],					// 热门汽车
				carList: null, 					// 汽车列表
				alphabet: [], 					// 字母列表
				toIndex: "", 					// 跳转的索引的字母
				tipsLetter: "", 				// 滑动显示字母
				timer: null,
				hasNoData: false,
				searchFocus: false,
				letterDetails: [],
				currentLetter: "area" ,//默认选择hot
				// 选中的汽车数据
				selectCar: {},
				// 车系数据 
				systemCar:[],
				brandId: '',						// 品牌Id
				seriesId: '',						// 车系Id
				brandName: '',						// 品牌名称
				seriesName: '',						// 车系名称
				type: '',							// 是增加爱车还是爱车重新选择品牌
				
			};
		},
		watch: {
			// 汽车搜索输入框
			inputValue(newVal) {
				this.isClearBtn = newVal ? true : false;

				if (this.timer) {
					clearTimeout(this.timer);
				}

				if (!this.inputValue) {
					this.searchData = [];
					return;
				}
				this.timer = setTimeout(() => {
					for (let i in this.carList) {
						this.carList[i].forEach(item => {
							item.name == this.inputValue && this.searchData.push(item);
						});
					}
					if (this.searchData.length === 0) {
						this.hasNoData = true;
					} else {
						this.hasNoData = false;
					}
				}, 500);
			},
			isReach(val) {
				this.searchFocus = val;
			}
		},
		onLoad(e) {
			this.type = e.type;
			// 得到热门品牌车辆数据
			this.getHost();
			// 得到品牌车辆数据
			this.getList();
		},
		methods: {
			// 得到热门品牌车辆数据
			getHost() {
				this.$http({
					url: this.$apis.hostBrandList,
					method: 'GET',
					success: ((res) => {
						this.hostList = res.data;
					})
				})
			},
			// 得到品牌车辆数据
			getList() {
				this.$http({
					url: this.$apis.brandCarList,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.alphabet = result.map(ele => ele.firstLetter);
						var obj = { };
						//map循环方式
						result.map((e, item)=> {
							obj[e.firstLetter] = e.list;
						});
						this.carList = obj;
						
					})
				})
			},
			// 列表滚动，和右边字母表对应
			scrollHandle(e) {
				let view = uni.createSelectorQuery().in(this).selectAll(".list-item");
				view.boundingClientRect(d => {
					let top = d[0].top;
					d.forEach(item => {
						item.top = item.top - top;
						item.bottom = item.bottom - top;
						this.letterDetails.push({
							id: item.id,
							top: item.top,
							bottom: item.bottom
						});
					});
				}).exec();

				const scrollTop = e.detail.scrollTop;
				this.letterDetails.some(item => {
					if (scrollTop >= item.top && scrollTop <= item.bottom - 20) {
						this.currentLetter = item.id;
						//当前固定用的是粘性定位，如果不用粘性定位，在这里设置
						return true;
					}
				});
			},
			// 搜索
			searchChange(e) {
				let { value } = e.detail;
				this.inputValue = value;
			},
			// 搜索结果列表数据
			citySearchList(item) {
				this.selectCar = item;
				// this.$refs.showRight.open()
			},
			selectCity(item) {
				this.selectCar = item;
 				let pages = getCurrentPages();  			// 获取所有页面栈实例列表
				let nowPage = pages[ pages.length - 1];  	// 当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  	// 上一页页面实例
				prevPage.$vm.brandName = item.name;   		// 修改上一页data里面的brandName参数值为 item.name
				prevPage.$vm.carObj.brand = item.id;   		// 修改上一页data里面的carObj.brand参数值为 item.id
				
				this.$http({
					url: `${this.$apis.seriesListBrand}?brandId=${item.id}`,
					method: 'GET',
					success: ((res) => {
						this.systemCar = res.data;
						this.$refs.showRight.open();
						prevPage.$vm.seriesData = res.data;
						prevPage.$vm.carObj.logo = item.logo;
						
					})
				})
				/* if(this.type === 'add') {
					this.brandId = item.id;
					this.brandName = item.name;
					this.selectCar = item;
					this.brandId = item.id;
					this.brandName = item.name;
					this.$http({
						url: `${this.$apis.seriesList}?brandId=${item.id}`,
						method: 'GET',
						success: ((res) => {
							this.systemCar = res.data;
						})
					})
					
					//当前项目是需要选择到区域，所以选择汽车后回到区县的地方
					this.toIndex = "area";
					setTimeout(()=>{
						this.toIndex = "";
					},1000)
				} else {
					uni.navigateTo({
						url: `./editDossier?brandName=${this.brandName}&brandId=${this.brandId}`
					})
				} */
				
			},
			// 选择车系
			tapSystem(item) {
				this.seriesId = item.id;
				this.seriesName = item.name;
				let pages = getCurrentPages();  			// 获取所有页面栈实例列表
				let nowPage = pages[ pages.length - 1];  	// 当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  	// 上一页页面实例
				prevPage.$vm.carObj.series = item.id;
				prevPage.$vm.seriesName = item.name;
				uni.navigateBack({
					delta: 1
				});
			},
			// 触发开始
			touchStart(e) {
			},
			// 移动时
			touchMove(e) {
				uni.vibrateShort();
				let y = e.touches[0].clientY;
				let offsettop = e.currentTarget.offsetTop;

				//判断选择区域,只在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20); //右边每个字母元素的高度
					let letter = this.alphabet[num];
					this.tipsLetter = letter;

					let curentLetter = this.letterTransform(letter);
					uni.showToast({
						title: curentLetter,
						icon: "none",
						duration: 1000
					});
				}
			},
			// 触发结束
			touchEnd() {
				this.toIndex = this.tipsLetter;
			},
			// 移动开始获取字母，并放大提示
			getLetter(e) {
				uni.vibrateShort();
				let { id } = e.currentTarget;
				this.tipsLetter = id;
				this.currentLetter = id;
				let curentLetter = this.letterTransform(id);
				uni.showToast({
					title: curentLetter,
					icon: "none",
					duration: 1000
				});
			},
			// 移动结束设置字母，赋值到toIndex
			setLetter() {
				this.toIndex = this.tipsLetter;
			},
			// 提示字母转换
			letterTransform(letter) {
				let str = "";
				if (letter == "area") {
					str = "区县";
				} else if (letter == "hot") {
					str = "热门";
				} else {
					str = letter;
				}
				return str;
			}
		}
	};
</script>
