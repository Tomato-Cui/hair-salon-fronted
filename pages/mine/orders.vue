<template>
	<view class="orders-container">
		<view class="orders-header">
			<view class="title">我的预约</view>
		</view>
		
		<!-- 订单列表 -->
		<view class="order-list" v-if="orderList.length > 0">
			<view class="order-item" v-for="(item, index) in orderList" :key="index">
				<view class="order-top">
					<view class="order-id">订单号：{{item.id}}</view>
					<view class="order-status" :class="getStatusClass(item.status)">{{getStatusText(item.status)}}</view>
				</view>
				
				<view class="order-info">
					<view class="service-name">
						<text class="label">服务项目：</text>
						<text class="value">{{item.serviceName}}</text>
					</view>
					
					<view class="appointment-time">
						<text class="label">预约时间：</text>
						<text class="value">{{item.appointmentDate}} {{item.appointmentTime}}</text>
					</view>
					
					<view class="duration">
						<text class="label">预计时长：</text>
						<text class="value">{{item.duration}}分钟</text>
					</view>
					
					<view class="remark" v-if="item.remark">
						<text class="label">备注信息：</text>
						<text class="value">{{item.remark}}</text>
					</view>
				</view>
				
				<view class="order-bottom">
					<text class="create-time">{{formatTime(item.createTime)}}</text>
					
					<!-- 不同状态显示不同按钮 -->
					<view class="order-btns">
						<view class="btn cancel-btn" v-if="item.status === 'pending'" @click="cancelOrder(item.id)">取消预约</view>
						<view class="btn detail-btn" @click="viewDetail(item)">查看详情</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<image src="/static/empty.png" mode="aspectFit" class="empty-img"></image>
			<view class="empty-text">暂无预约记录</view>
			<view class="go-btn" @click="goAppointment">去预约</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [],
				userInfo: null
			}
		},
		onLoad() {
			// 检查登录状态
			this.checkLoginStatus();
			
			// 获取预约列表
			this.getOrderList();
		},
		onShow() {
			// 页面显示时刷新数据
			this.getOrderList();
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				const userInfoStr = uni.getStorageSync('userInfo');
				if (userInfoStr) {
					this.userInfo = JSON.parse(userInfoStr);
				} else {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/index'
						});
					}, 1500);
				}
			},
			
			// 获取预约列表
			getOrderList() {
				if (!this.userInfo) return;
				
				// 从本地存储中获取预约记录
				// 实际应用中应该从后端获取
				const appointmentsStr = uni.getStorageSync('appointments') || '[]';
				const allAppointments = JSON.parse(appointmentsStr);
				
				// 筛选当前用户的预约
				this.orderList = allAppointments.filter(item => item.userId === this.userInfo.id)
					.sort((a, b) => b.createTime - a.createTime); // 按创建时间倒序排列
			},
			
			// 获取状态文本
			getStatusText(status) {
				const statusMap = {
					'pending': '待服务',
					'completed': '已完成',
					'cancelled': '已取消'
				};
				return statusMap[status] || status;
			},
			
			// 获取状态样式
			getStatusClass(status) {
				return `status-${status}`;
			},
			
			// 格式化时间戳
			formatTime(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const hour = date.getHours().toString().padStart(2, '0');
				const minute = date.getMinutes().toString().padStart(2, '0');
				
				return `${year}-${month}-${day} ${hour}:${minute}`;
			},
			
			// 取消预约
			cancelOrder(orderId) {
				uni.showModal({
					title: '提示',
					content: '确定要取消该预约吗？',
					success: (res) => {
						if (res.confirm) {
							// 更新预约状态
							const appointmentsStr = uni.getStorageSync('appointments') || '[]';
							const appointments = JSON.parse(appointmentsStr);
							
							const index = appointments.findIndex(item => item.id === orderId);
							if (index !== -1) {
								appointments[index].status = 'cancelled';
								uni.setStorageSync('appointments', JSON.stringify(appointments));
								
								// 刷新列表
								this.getOrderList();
								
								uni.showToast({
									title: '已取消预约',
									icon: 'success'
								});
							}
						}
					}
				});
			},
			
			// 查看详情
			viewDetail(item) {
				// 实际应用中可以跳转到详情页
				// 这里简单用弹窗展示
				uni.showModal({
					title: '预约详情',
					content: `服务：${item.serviceName}\n日期：${item.appointmentDate}\n时间：${item.appointmentTime}\n时长：${item.duration}分钟\n状态：${this.getStatusText(item.status)}\n${item.remark ? '备注：' + item.remark : ''}`,
					showCancel: false
				});
			},
			
			// 去预约页面
			goAppointment() {
				uni.switchTab({
					url: '/pages/appointment/index'
				});
			}
		}
	}
</script>

<style>
	.orders-container {
		min-height: 100vh;
		background-color: #F5F5F5;
		padding-bottom: 30rpx;
	}
	
	.orders-header {
		padding: 30rpx;
	}
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	/* 订单列表样式 */
	.order-list {
		padding: 0 30rpx;
	}
	
	.order-item {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.order-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #F5F5F5;
	}
	
	.order-id {
		font-size: 26rpx;
		color: #999;
	}
	
	.order-status {
		font-size: 26rpx;
		font-weight: bold;
	}
	
	.status-pending {
		color: #FF9500;
	}
	
	.status-completed {
		color: #34C759;
	}
	
	.status-cancelled {
		color: #999;
	}
	
	.order-info {
		margin-bottom: 20rpx;
	}
	
	.service-name, .appointment-time, .duration, .remark {
		margin-bottom: 10rpx;
		font-size: 28rpx;
		display: flex;
	}
	
	.label {
		color: #666;
		width: 160rpx;
	}
	
	.value {
		color: #333;
		flex: 1;
	}
	
	.order-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20rpx;
		border-top: 1rpx solid #F5F5F5;
	}
	
	.create-time {
		font-size: 24rpx;
		color: #999;
	}
	
	.order-btns {
		display: flex;
	}
	
	.btn {
		padding: 10rpx 30rpx;
		margin-left: 20rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
	}
	
	.cancel-btn {
		background-color: #F5F5F5;
		color: #666;
	}
	
	.detail-btn {
		background-color: #FFF2F5;
		color: #FF6699;
	}
	
	/* 空状态样式 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
	}
	
	.empty-img {
		width: 240rpx;
		height: 240rpx;
		margin-bottom: 30rpx;
	}
	
	.empty-text {
		font-size: 30rpx;
		color: #999;
		margin-bottom: 40rpx;
	}
	
	.go-btn {
		padding: 15rpx 60rpx;
		background-color: #FF6699;
		color: #FFFFFF;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
</style> 