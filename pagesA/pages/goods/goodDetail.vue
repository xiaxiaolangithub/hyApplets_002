<template>
	<view class="goodDetailPage">
		<!-- 商品轮播 -->
		<view class="swiper">
			<!-- <view class="look_video" hover-class="handle_hover" v-if="goods.video!== ''" @tap="toVideo">视频</view> -->
			<swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" @change="bannerChange" class="swiper-box">
				<swiper-item class="swiper_item" v-for="(item, index) in goods.pics" :key="index" :data-index="index" @tap.stop="previewImage">
					<image :src="item" class="tui-slide-image"  mode="widthFix"/>
				</swiper-item>
			</swiper>
			<view class="tag">
				<tui-tag padding="12rpx 18rpx" type="translucent" shape="circleLeft" :scaleMultiple="0.82" originRight>{{ bannerIndex + 1 }}/{{ goods.pics.length }}</tui-tag>
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="container">
			<view class="info">
				<view class="price"><span>¥</span>{{goods.price}}</view>
				<view class="basic">
					<view class="name">{{goods.name}}</view>
					<button class="share"  open-type="share">
						<text class="iconfont icon-fenxiang"></text>
						<text>分享</text>
					</button>
				</view>
				<view class="sale_num">
					已卖出{{Number(goods.salesVolume)>10000?(((goods.salesVolume-goods.salesVolume%1000)/10000+'万件')):`${goods.salesVolume}件`}} 
				</view>
			</view>
			<!-- 占位 -->
			<view class="place"></view>
			
			<!-- 商品详情 -->
			<jyf-parser class="news_content" :html="goods.detail" ref="article"></jyf-parser>
		</view>
		
		<!-- 底部 -->
		<view class="page_footer">
			<view class="kefu" @tap="tapPhone">
				<image :src="realmImgTwo('goods/kefu.png')" mode="widthFix"></image>
				联系客服
			</view>
			<view class="booking" v-if="goods.stock>0" hover-class="handle_hover" @tap="payBefore">一键购买</view>
			<view class="booking book_none" v-else >已抢完</view>
		</view>
	
		<!-- 商品属性、数量选择弹窗 -->
		<tui-bottom-popup :show="isShow" @close="isShow=false" class="attr_popup">
			<view class="popup_box">
				<!-- 关闭弹窗icon -->
				<text class="iconfont icon-qingchu" @tap="isShow=false"></text>
				<view class="product_box">
					<image :src="popGoods.pic" class="img" @tap.stop="previewBig"></image>
					<view class="price"><span>¥</span>{{popGoods.salePrice}}</view>
				</view>
				<view class="attr_box" v-if="goods.specialSpec.length" >
					<scroll-view scroll-y class="popup_scroll">
						<view  v-for="(item, index) in goods.specialSpec" :key="index">
							<view class="title">{{item.name}}</view>
							<view class="attr_name" v-for="(ele, i) in item.values" :key="i" 
							:class="{'active': item.attrIndex==i}" @tap="tapColor(item, index, ele, i)">
								{{ele}}
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="num_box">
					<view class="title">
						数量 
						<text class="stock" v-if="isStock">库存{{stockNum}}件</text>
					</view>
					<tui-numberbox :max="stockNum" :min="1" :value="buyNum" @change="changeNum"></tui-numberbox>
				</view>
				<view class="buy" :class="stockNum?'':'outofStock'" hover-class="handle_hover" @tap="tapBooking" >{{stockNum?'确定':'缺货中，提醒掌柜补货'}}</view>
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	import tuiTag from "@/components/tui-tag/tui-tag.vue";
	import tuiBottomPopup from "@/components/tui-bottom-popup/tui-bottom-popup" 
	import tuiNumberbox from "@/components/tui-numberbox/tui-numberbox.vue"
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	import { getArrDifference } from '@/static/js/tool.js'
	import { goPages } from '@/utils/request.js'
	export default {
		components:{		
			tuiTag,  				// 轮播图数字标识
			tuiBottomPopup,			// 从底部展开的弹窗
			tuiNumberbox,			// 数量选择
			jyfParser,				// 富文本解析
		},
		data() {
			return {
				// 当前轮播指示
				bannerIndex:0,		
				// 商品信息
				goods: {
					price: 0, 			// 价格
					name: '',  			// 名称
					salesVolume: 0,		// 销量
					pics: [],			// 轮播图
					mainPic: '',		// 主图
					detail: '',			// 详情
					stock: null,		// 库存
				},
				// 规格信息
				specialSpecArr: [],
				// 是否显示商品属性选择弹窗
				isShow: false,	
				// 弹窗中所选中的商品数量 
				buyNum: 1,	
				// 查询规格组所选中的规格
				specValues: [],
				// 弹窗中的商品信息
				popGoods: {},
				// 是否显示库存数量
				isStock: false,
				// 库存
				stockNum: 99,
				// 商品规格种类列表
				specList: [],
				// 已选择了哪些规格title
				hasSpec: [],
				
			}
		},
		computed: {
			servicePhone() {
				return this.$store.state.shopData.servicePhone
			},
			hasLogin() {
				return this.$store.state.hasLogin
			},
		},
		onLoad(e) {
			this.goods.id = Number(e.id);
			// 得到商品详情
			this.getDetail();
		},
		onShareAppMessage(res) {
			return {
				title: this.goods.name,
				path: `/pagesA/pages/goods/goodDetail?id=${this.goods.id}`,
				imageUrl: this.goods.mainPic
			}
		},
		onShareTimeline() {
			return {
				title: this.goods.name,
				url: "/pagesA/pages/goods/goodDetail",
				query: `id=${this.goods.id}`,
				imageUrl: this.goods.mainPic
			}
		},
		methods:{
			// 得到商品详情
			getDetail() {
				this.$http({
					url: `${this.$apis.goodsDetail}?id=${this.goods.id}`,
					method: 'GET',
					success: ((res) => {
						let result = res.data;
						this.goods.detail = result.detail.replace(/\<img/gi, '<img style="max-width:100%;height:auto;margin:20rpx 0;" ');
						if(result.specialSpec && result.specialSpec.length > 0) {
							result.specialSpec = result.specialSpec.map( item =>{
							   return Object.assign(item,{attrIndex: -1})
							})
						} else {
							// 直接请求这个商品的库存、图片信息
							this.getSpecGroupDetail();
						}
						// 如果轮播图为空，轮播图就用主图
						if(result.pics === null || result.pics.length === 0) {
							result.pics =  [result.mainPic];
						}
						this.goods = res.data;
						// 规格弹窗中的商品信息
						this.popGoods = {
							salePrice: this.goods.price,
							pic: this.goods.pics[0],
						}
						uni.setNavigationBarTitle({
							title: this.goods.name
						});
						this.specList = this.goods.specialSpec ? this.goods.specialSpec.map(ele => ele.name) : [];
						
					})
				})
			},
			// 弹窗点击颜色
			tapColor(item, index,  ele, i) {
				item.attrIndex = item.attrIndex === i ? -1 : i;
				this.specValues = [];
				this.hasSpec = [];
				this.goods.specialSpec.forEach(list => {
					if(list.attrIndex !== -1) {
						this.hasSpec.push(list.name);
						this.specValues.push({
							text: list.code, 
							value: list.values[list.attrIndex],
						})
					}
				})
				// 全部规格选择完了再进行看当前商品有没有库存
				if(this.specValues.length === this.goods.specialSpec.length) {
					this.getSpecGroupDetail();
				} else {
					this.isStock = false;
				}
				
			},
			// 得到规格组
			getSpecGroupDetail() {
				let data = {
					productId: this.goods.id,
				}
				// 如果当前这个商品有规格就传规格数组参数
				if(this.goods.specialSpec && this.goods.specialSpec.length > 0) {
					data.specValues = this.specValues;
				}
				this.$http({
					url: this.$apis.specGroupDetail,
					method: 'POST',
					data,
					success: ((res) => {
						this.isStock = true;
						if(res.data) {
							this.buyNum = 1;
							let result = res.data;
							this.stockNum = Number(result.stock);
							this.popGoods.specGroupId = result.id;  				// 规格选中的产品规格组id
							if(result.pic && result.pic.length > 0) {
								this.popGoods.pic = result.pic;						// 规格选中的产品缩略图
							} else {
								this.popGoods.pic = this.goods.pics[0]
							}					
							this.popGoods.salePrice = result.salePrice;				// 规格选中的产品价格
						} else {
							this.stockNum = 0;
						}
					})
				})
			},
			// 弹窗中更该数量 
			changeNum(e) {
				this.buyNum = e.value;
			},
			// 切换banner 图片
			bannerChange(e) {
				this.bannerIndex = e.detail.current;
			},
			// 查看详情轮播图片
			previewImage(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.goods.pics[index],	// 当前显示图片的链接/索引值
					urls: this.goods.pics  				// 需要预览的图片链接列表
				});
			},
			// 查看弹窗中的大图
			previewBig() {
				uni.previewImage({
					current: 0,					// 当前显示图片的链接/索引值
					urls: [this.popGoods.pic] 	// 需要预览的图片链接列表
				});
			},
			// 拨打客服电话
			tapPhone() {
				uni.showModal({
					title: '提示',
					content: `是否拨打客服电话: ${this.servicePhone}`,
					cancelColor: '#979CA7',
					confirmColor: '#3377FF',
					cancelText: '取消',
					confirmText: '拨打',
					success: (res) => {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: `${this.servicePhone}`
							});
						} else if (res.cancel) {}
					}
				});
			},
			// 购买前判断是否已登录
			payBefore() {
				if (!this.hasLogin) {
					goPages('login')
					return false;
				}
				this.isShow = true;
				// this.getSpecGroupDetail();
			},
			// 一键购买
			tapBooking() {
				if(this.stockNum===0) {
					uni.showToast({
						title: `掌柜已收到补货申请~`,
						icon: 'none'
					});
					return false;
				}
				// 查看选择了哪种属性
				let arr = getArrDifference(this.hasSpec, this.specList);
				let str = arr.join('、');
				if(arr.length) {
					uni.showToast({
						title: `请选择${str}`,
						icon: 'none'
					});
					return false;
				}
				let goods = {
					totalAmount: Number(this.popGoods.salePrice)*this.buyNum,	// 总金额
					payAmount: Number(this.popGoods.salePrice)*this.buyNum,		// 需付款
					productSalePrice: this.popGoods.salePrice,					// 商品价格
					productMainPic: this.popGoods.pic,							// 商品图片
					productName: this.goods.name,								// 商品名称
					productAttr: this.specValues,								// 所选中哪些规格
					productQuantity: this.buyNum,								// 购买数量
					id: this.goods.id,											// 商品ID
					specGroupId: this.popGoods.specGroupId,						// 规格组id
				}
				this.isShow = false;
				uni.navigateTo({
					url: `/pagesB/pages/order/detail?type=商品详情&goods=${JSON.stringify(goods)}`
				})
			},
			// 去视频页面
			toVideo() {
				uni.navigateTo({
					url: `/pagesA/pages/newCar/video?url=${this.goods.video}&name=${this.goods.name}`
				})
			},
		}
	}
</script>

