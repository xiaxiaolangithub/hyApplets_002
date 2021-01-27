<template>
	<view class="carDossierPage">
		<view class="inner">
			<view class="add_section" @tap="addDossier">
				<image class="add_back" :src="realmImg('carDossier/add_back.png')" mode="widthFix"></image>
				<view class="add_handle">
					<image :src="realmImg('carDossier/add.png')" mode="widthFix"></image>
					添加爱车 
				</view>
			</view>
			<!-- 车型列表 -->
			<view class="car_list">
				<view class="list" v-for="(item, index) in carData" :key="index">
					<view class="list_top">
						<image :src="item.logo" class="car_img" mode="widthFix"></image>
						<view class="middle">
							<view class="name_box">{{item.brandName}}  {{item.seriesName}}</view>
							<view class="plate_no" v-if="item.plateNo">{{item.plateNo}}</view>
						</view>
					</view>
					<view class="list_bottom">
						<view class="set_default" :class="item.isDefault === 'YES'?'has_default':''" @tap="setDefault(item)">
							<text v-if="item.isDefault === 'YES'">已设为默认车辆</text>
							<text v-else>设为默认车辆</text>
						</view>
						<view class="del delBtn" @tap="editDossier(item)">编辑</view>
						<view class="del " @tap="delDossier(item)">删除</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { goPages } from '@/utils/request.js'
	export default{
		data() {
			return {
				// 爱车档案 
				carData: [],
				name: '',
			}
		},
		onShow() {
			this.name = this.$store.state.userinfo.name;
			// 获取车辆列表
			this.getList();
		},
		onPullDownRefresh() {
			// 获取车辆列表
			this.getList();
			setTimeout(()=> {
				uni.stopPullDownRefresh();
			}, 500);
		},
		methods:{
			// 获取车辆列表
			getList() {
				this.$http({
					url: this.$apis.userCarList,
					method: 'GET',
					success: ((res) => {
						this.carData = res.data || [];
					})
				})
			},
			// 增加爱车档案
			addDossier() {
				if(this.name) {
					uni.redirectTo({
						url: './editDossier?type=add'
					})
				} else {
					goPages('upDateName')
				}
				
			},
			// 删除爱车
			delDossier(item) {
				this.carId = item.id;
				uni.showModal({
				   title: '提示',
				   content: '您确定删除该车档案吗？',
				   confirmColor: '#437DF2',
				   cancelColor: '#7E8596',
				   success: (res)=> {
					   if (res.confirm) {
						   this.delQuery();
					   } 
				   }
				});
		   },
		   // 删除请求
		   delQuery() {
			    this.$http({
					url: `${this.$apis.delUserCar}?id=${this.carId}`,
					method: 'GET',
					success: ((res) => {
						uni.showToast({
							title: '删除成功!',
						});
						this.getList();
					})
			    })
		   },
		   // 设置当前车为默认车辆
		   setDefault(item) {
				if(item.isDefault === 'YES') {
					uni.showToast({
				   		title: '当前该车辆已是默认车辆 !',
						icon: 'none'
					});
					return false;
				}
				this.carId = item.id;
				this.$http({
					url: `${this.$apis.setDefaultCar}?id=${this.carId}`,
					method: 'GET',
					success: ((res) => {
						uni.showToast({
							title: '设置成功 ！'
						});
						this.getList();
					})
				})
		    },
			// 编辑该车辆档案
			editDossier(item) {
				if(this.name) {
					uni.navigateTo({
						url: `./editDossier?id=${item.id}&type=edit&logo=${item.logo}&isDefault=${item.isDefault}`
					})
				} else {
					goPages('upDateName')
				}
				
			}
 		}
	}
</script>


