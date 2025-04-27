<template>
	<view class="mine-container">
		<!-- 未登录状态 -->
		<view class="not-login" v-if="!hasLogin">
			<image src="/static/default-avatar.png" class="avatar"></image>
			<view class="login-tips">您尚未登录</view>
			<view class="login-btn" @click="goLogin">立即登录</view>
		</view>
		
		<!-- 已登录状态 -->
		<view class="user-info" v-else>
			<view class="user-info-header">
				<image :src="userInfo.avatarUrl || '/static/default-avatar.png'" class="avatar"></image>
				<view class="user-name">{{userInfo.nickName || '用户'}}</view>
				<view class="user-id">ID: {{userInfo.id}}</view>
			</view>
		</view>
		
		<!-- 功能菜单 -->
		<view class="menu-list">
			<view class="menu-group">
				<view class="menu-item" @click="goOrders">
					<text class="iconfont icon-order"></text>
					<text class="menu-text">我的预约</text>
					<text class="arrow">></text>
				</view>
				
				<view class="menu-item" @click="goAdmin" v-if="isAdmin">
					<text class="iconfont icon-admin"></text>
					<text class="menu-text">管理预约</text>
					<text class="arrow">></text>
				</view>
			</view>
			
			<view class="menu-group">
				<view class="menu-item">
					<text class="iconfont icon-about"></text>
					<text class="menu-text">关于我们</text>
					<text class="arrow">></text>
				</view>
				
				<view class="menu-item">
					<text class="iconfont icon-service"></text>
					<text class="menu-text">客服中心</text>
					<text class="arrow">></text>
				</view>
				
				<view class="menu-item">
					<text class="iconfont icon-feedback"></text>
					<text class="menu-text">意见反馈</text>
					<text class="arrow">></text>
				</view>
			</view>
			
			<!-- 退出登录按钮 -->
			<view class="logout-btn" @click="logout" v-if="hasLogin">退出登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasLogin: false,
				userInfo: {},
				isAdmin: false
			}
		},
		onLoad() {
			this.checkLoginStatus();
		},
		onShow() {
			this.checkLoginStatus();
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				const userInfoStr = uni.getStorageSync('userInfo');
				if (userInfoStr) {
					this.hasLogin = true;
					this.userInfo = JSON.parse(userInfoStr);
					
					// 这里简单判断是否是管理员
					// 实际应用中应该从后端获取用户权限
					this.isAdmin = this.userInfo.id === 'user_1' || this.userInfo.id === 'admin';
				} else {
					this.hasLogin = false;
					this.userInfo = {};
					this.isAdmin = false;
				}
			},
			
			// 跳转到登录页
			goLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
				});
			},
			
			// 跳转到我的预约
			goOrders() {
				if (!this.hasLogin) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					setTimeout(() => {
						this.goLogin();
					}, 1500);
					return;
				}
				
				uni.navigateTo({
					url: '/pages/mine/orders'
				});
			},
			
			// 跳转到管理页面
			goAdmin() {
				if (!this.isAdmin) {
					uni.showToast({
						title: '您没有管理权限',
						icon: 'none'
					});
					return;
				}
				
				uni.navigateTo({
					url: '/pages/admin/orders'
				});
			},
			
			// 退出登录
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							// 清除用户信息和token
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('token');
							
							this.hasLogin = false;
							this.userInfo = {};
							this.isAdmin = false;
							
							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
	.mine-container {
		min-height: 100vh;
		background-color: #F5F5F5;
		padding-bottom: 50rpx;
	}
	
	/* 未登录状态 */
	.not-login {
		background-color: #FF6699;
		padding: 60rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #FFFFFF;
	}
	
	.avatar {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		margin-bottom: 30rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.5);
	}
	
	.login-tips {
		font-size: 32rpx;
		margin-bottom: 30rpx;
	}
	
	.login-btn {
		background-color: #FFFFFF;
		color: #FF6699;
		padding: 10rpx 60rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
	}
	
	/* 已登录状态 */
	.user-info {
		background-color: #FF6699;
		padding: 60rpx 30rpx;
		color: #FFFFFF;
	}
	
	.user-info-header {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.user-name {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.user-id {
		font-size: 24rpx;
		opacity: 0.8;
	}
	
	/* 菜单列表 */
	.menu-list {
		padding: 30rpx;
	}
	
	.menu-group {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		margin-bottom: 30rpx;
		overflow: hidden;
	}
	
	.menu-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		position: relative;
		border-bottom: 1rpx solid #F5F5F5;
	}
	
	.menu-item:last-child {
		border-bottom: none;
	}
	
	.menu-item .iconfont {
		font-size: 40rpx;
		color: #FF6699;
		margin-right: 20rpx;
	}
	
	.menu-text {
		font-size: 30rpx;
		color: #333;
		flex: 1;
	}
	
	.arrow {
		font-size: 30rpx;
		color: #999;
	}
	
	/* 退出登录按钮 */
	.logout-btn {
		background-color: #FFFFFF;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12rpx;
		margin-top: 60rpx;
		font-size: 32rpx;
		color: #FF3366;
	}
</style> 