<template>
	<view class="login-container">
		<view class="login-header">
			<image src="/static/logo.png" mode="aspectFill" class="logo"></image>
			<view class="title">夏日美发沙龙</view>
			<view class="slogan">专业美发，尽在指尖</view>
		</view>
		
		<view class="login-form">
			<view class="login-btn wechat-btn" @click="wxLogin">
				<text class="iconfont icon-wechat"></text>
				<text>微信一键登录</text>
			</view>
			
			<view class="login-btn profile-btn" @click="getUserProfile">
				<text class="iconfont icon-user"></text>
				<text>授权获取头像昵称</text>
			</view>
		</view>
		
		<view class="login-tips">
			<text>登录后可享受更多功能</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			// 微信登录获取code
			wxLogin() {
				uni.showLoading({
					title: '登录中...'
				});
				
				uni.login({
					provider: 'weixin',
					success: (res) => {
						if (res.code) {
							// 获取到code后，发送到后端换取openid
							this.loginByCode(res.code);
						} else {
							uni.hideLoading();
							uni.showToast({
								title: '登录失败，请重试',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: '登录失败，请重试',
							icon: 'none'
						});
					}
				});
			},
			
			// 将code发送到后端
			loginByCode(code) {
				// 这里模拟登录成功
				// 实际应用中，这里应该调用后端接口，将code发送给后端
				// 后端通过code获取openid并返回用户信息
				
				// 模拟登录成功，存储用户信息
				const userInfo = {
					id: 'user_' + Math.floor(Math.random() * 1000),
					nickName: '用户' + Math.floor(Math.random() * 1000),
					avatarUrl: '',
					openid: 'openid_' + Math.floor(Math.random() * 1000)
				};
				
				uni.setStorageSync('userInfo', JSON.stringify(userInfo));
				uni.setStorageSync('token', 'mock_token_' + Math.floor(Math.random() * 1000));
				
				uni.hideLoading();
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				});
				
				// 登录成功后返回
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			},
			
			// 获取用户头像和昵称
			getUserProfile() {
				// 在真实小程序环境中使用wx.getUserProfile
				// 由于uni-app在开发环境中模拟器没有wx对象
				// 这里做兼容处理
				if (typeof wx !== 'undefined' && wx.getUserProfile) {
					wx.getUserProfile({
						desc: '用于完善会员资料',
						success: (res) => {
							const userInfo = res.userInfo;
							// 获取到用户信息后，更新本地存储
							this.updateUserInfo(userInfo);
						},
						fail: () => {
							uni.showToast({
								title: '授权已取消',
								icon: 'none'
							});
						}
					});
				} else {
					// 在非小程序环境下模拟获取用户信息
					uni.showToast({
						title: '当前环境不支持，请使用微信小程序',
						icon: 'none'
					});
				}
			},
			
			// 更新用户信息
			updateUserInfo(profileInfo) {
				// 获取本地存储的用户信息
				const userInfoStr = uni.getStorageSync('userInfo');
				if (userInfoStr) {
					const userInfo = JSON.parse(userInfoStr);
					// 更新用户信息
					userInfo.nickName = profileInfo.nickName;
					userInfo.avatarUrl = profileInfo.avatarUrl;
					
					// 保存更新后的用户信息
					uni.setStorageSync('userInfo', JSON.stringify(userInfo));
					
					uni.showToast({
						title: '授权成功',
						icon: 'success'
					});
					
					// 返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} else {
					// 如果本地没有用户信息，先调用登录接口
					this.wxLogin();
				}
			}
		}
	}
</script>

<style>
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 40rpx;
		height: 100vh;
		background-color: #fff;
	}
	
	.login-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 100rpx;
		margin-top: 80rpx;
	}
	
	.logo {
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
		margin-bottom: 30rpx;
	}
	
	.title {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.slogan {
		font-size: 28rpx;
		color: #999;
	}
	
	.login-form {
		width: 100%;
		margin-bottom: 60rpx;
	}
	
	.login-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 90rpx;
		border-radius: 45rpx;
		margin-bottom: 30rpx;
		font-size: 32rpx;
	}
	
	.login-btn text {
		margin-right: 10rpx;
	}
	
	.wechat-btn {
		background-color: #07C160;
		color: #fff;
	}
	
	.profile-btn {
		background-color: #FF6699;
		color: #fff;
	}
	
	.login-tips {
		font-size: 24rpx;
		color: #999;
		text-align: center;
		margin-top: 30rpx;
	}
</style> 