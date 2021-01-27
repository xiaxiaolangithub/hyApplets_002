<template>
	<view class="upDateNamePage">
		<view class="inner">
			<view class="name">姓 名：</view>
			<input type="text" v-model="name" class="input"/>
			<view class="right" @click="changeSex">
				{{sexName}}
				<uni-icons type="arrowdown" size="25" v-if="isShow"></uni-icons>
				<uni-icons type="arrowup" size="25" v-else></uni-icons>
			</view>
			<view class="sex_box" v-if="isSex">
				<view v-for="(item, index) in sexData" :key="index" class="list" hover-class="list_hover" @tap.stop="tapClick(item)">{{item.name}}</view>
			</view>
		</view>
		<button  hover-class="handle_hover" class="tui-button-primary" @tap="saveInfo">继续添加爱车</button>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				sexName: '',	// 用户性别名称
				gender: '',		// 用户性别value
				name: '',		// 用户名称
				id: null,		// 用户ID
				isShow: true,	// 是否显示性别箭头
				isSex: false,	// 是否显示性别下拉选择
				sexData: [
					{
						name: '女',
						value: 'WOMEN'
					},
					{
						name: '男',
						value: 'MAN'
					},
				]
			}
		},
		onLoad() {
			this.name = this.$store.state.userinfo.name;
			this.gender = this.$store.state.userinfo.gender;
			if(this.gender === 'UNKNOWN') {
				this.gender = 'MAN'
			}
			this.id = this.$store.state.userinfo.id;
			
		},
		watch:{
			gender(val) {
				switch(val) {
					case 'WOMEN':
						this.sexName = '女';
						break;
					default:
						this.sexName = '男';
						break;
				}
			}
		},
		methods:{
			// 选择性别
			changeSex() {
				this.isShow = !this.isShow;
				this.isSex = !this.isShow;
			},
			// 点击性别
			tapClick(item) {
				this.sexName = item.name;
				this.gender = item.value;
				this.isSex = false;
				this.isShow = true;
			},
			// 保存用户信息
			saveInfo() {
				if(this.name.length===0) {
					uni.showToast({
						title: '抱歉，姓名不能为空！',
						icon: 'none'
					});
					return false;
				}
				this.$http({
					url: this.$apis.customerUpdatePerInfo,
					data: {
						id: this.id, 		
						name: this.name,
						gender: this.gender
					},
					success: ((res) => {
						let userinfo = this.$store.state.userinfo;
						userinfo.name = this.name;
						userinfo.gender = this.gender;
						this.$store.commit('userinfo', userinfo)
						uni.navigateBack({
						    delta: 1
						});
					})
				})
			},
		}
	}
</script>

<style  lang="scss">
	page{
		background: #F7F7F7;
	}
	.upDateNamePage{
		padding-top:200rpx;
	}
	.inner{
		width:690rpx;
		margin: 0 auto;
		border:1px solid #373737;
		height: 100rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left:20rpx;
		box-sizing: border-box;
		font-size: 34rpx;
		position: relative;
	}
	.name{
		height: 100%;
		display: flex;
		align-items: center;
	}
	.input{
		height: 100%;
		width:350rpx;
		display: flex;
		align-items: center;
	}
	.right{
		height: 100%;
		display: flex;
		align-items: center;
		border-left: 1px solid #373737;
		width:200rpx;
		justify-content: center;
	}
	.sex_box{
		position: absolute;
		right: 0;
		width:198rpx;
		top: 99rpx;
		border: 1px solid #373737;
		border-top: 0;
		text-align: center;
		z-index: 99;
		background: #F7F7F7;
		.list{
			padding: 15rpx 0;
			border-bottom: 1px solid #373737;
			&:last-child{
				border-bottom: 0;
			}
		}
		.list_hover{
			background: #fff;
		}
		
	}
	.tui-button-primary{
		margin-top:300rpx;
		width: 690rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 12rpx;
		background: $uni-color-main;
		color:#fff;
	}
</style>

