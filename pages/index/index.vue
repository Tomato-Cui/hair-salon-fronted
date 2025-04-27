<template>
	<view class="content">
		<!-- 店铺信息 -->
		<view class="shop-info">
			<image class="logo" src="/static/logo.png"></image>
			<view class="shop-name">剪派造型</view>
			<view class="shop-detail">
				<view class="shop-item">
					<text class="iconfont icon-time"></text>
					<text>营业时间: {{shopInfo.openTime}} - {{shopInfo.closeTime}}</text>
				</view>
				<view class="shop-item">
					<text class="iconfont icon-location"></text>
					<text>地址: {{shopInfo.address}}</text>
				</view>
			</view>
		</view>
		
		<!-- 服务快速入口 -->
		<view class="service-btns">
			<view class="service-title">快速预约</view>
			<view class="service-list">
				<view class="service-item" v-for="(item, index) in serviceList" :key="index" @click="goAppointment(item.type)">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
		
		<!-- 登录状态区域 -->
		<view class="login-box" @click="goLogin" v-if="!hasLogin">
			<text class="login-tip">您尚未登录，点击登录后使用更多功能</text>
			<text class="login-btn">去登录</text>
		</view>
		
		<view class="login-box user-box" @click="goMine" v-else>
			<image class="user-avatar" :src="userInfo.avatarUrl || '/static/default-avatar.png'"></image>
			<text class="user-name">{{userInfo.nickName || '用户'}}</text>
			<text class="go-mine">进入个人中心 ></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shopInfo: {
					openTime: '09:00',
					closeTime: '21:00',
					address: '北京市朝阳区建国路88号'
				},
				serviceList: [
					{
						name: '洗头',
						icon: '/static/service/wash.png',
						type: 'wash'
					},
					{
						name: '理发',
						icon: '/static/service/haircut.png',
						type: 'haircut'
					},
					{
						name: '染发',
						icon: '/static/service/dye.png',
						type: 'dye'
					}
				],
				hasLogin: false,
				userInfo: {}
			}
		},
		onLoad() {
			// 检查登录状态
			this.checkLoginStatus();
		},
		onShow() {
			// 页面显示时也检查登录状态
			this.checkLoginStatus();
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.hasLogin = true;
					this.userInfo = JSON.parse(userInfo);
				} else {
					this.hasLogin = false;
				}
			},
			
			// 跳转到预约页面
			goAppointment(type) {
				if (!this.hasLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/index'
						});
					}, 1500);
					return;
				}
				
				uni.navigateTo({
					url: `/pages/appointment/index?type=${type}`
				});
			},
			
			// 跳转到登录页
			goLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
				});
			},
			
			// 跳转到个人中心
			goMine() {
				uni.switchTab({
					url: '/pages/mine/index'
				});
			}
		}
	}
</script>

<style>
	.content {
		padding: 30rpx;
	}
	
	/* 店铺信息样式 */
	.shop-info {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	.logo {
		height: 150rpx;
		width: 150rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
	}
	
	.shop-name {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		color: #333;
	}
	
	.shop-detail {
		width: 100%;
	}
	
	.shop-item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		font-size: 28rpx;
		color: #666;
	}
	
	.shop-item text {
		margin-right: 10rpx;
	}
	
	/* 服务按钮样式 */
	.service-btns {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	.service-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
		color: #333;
	}
	
	.service-list {
		display: flex;
		justify-content: space-between;
	}
	
	.service-item {
		width: 30%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #FFF2F5;
		padding: 20rpx;
		border-radius: 12rpx;
	}
	
	.service-item image {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 10rpx;
	}
	
	.service-item text {
		font-size: 28rpx;
		color: #FF6699;
	}
	
	/* 登录区域样式 */
	.login-box {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}
	
	.login-tip {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}
	
	.login-btn {
		font-size: 30rpx;
		color: #FF6699;
		font-weight: bold;
	}
	
	/* 已登录的用户信息 */
	.user-box {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	
	.user-name {
		flex: 1;
		margin-left: 20rpx;
		font-size: 30rpx;
		color: #333;
	}
	
	.go-mine {
		font-size: 28rpx;
		color: #999;
	}
</style>
