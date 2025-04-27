<template>
	<view class="admin-container">
		<view class="admin-header">
			<view class="title">预约管理</view>
			<view class="login-verify" v-if="!isAdmin">
				<view class="verify-tip">请输入管理员验证码</view>
				<input type="text" v-model="adminCode" placeholder="请输入4位数验证码" maxlength="4" class="verify-input" />
				<button class="verify-btn" @click="verifyAdmin">验证</button>
			</view>
		</view>
		
		<!-- 管理界面 -->
		<block v-if="isAdmin">
			<!-- 筛选条件 -->
			<view class="filter-section">
				<view class="filter-item">
					<view class="filter-label">服务类型：</view>
					<view class="filter-options">
						<view 
							class="filter-option" 
							:class="{ active: currentServiceType === '' }"
							@click="filterByService('')">
							全部
						</view>
						<view 
							class="filter-option" 
							:class="{ active: currentServiceType === 'wash' }"
							@click="filterByService('wash')">
							洗头
						</view>
						<view 
							class="filter-option" 
							:class="{ active: currentServiceType === 'haircut' }"
							@click="filterByService('haircut')">
							理发
						</view>
						<view 
							class="filter-option" 
							:class="{ active: currentServiceType === 'dye' }"
							@click="filterByService('dye')">
							染发
						</view>
					</view>
				</view>
				
				<view class="filter-item">
					<view class="filter-label">预约日期：</view>
					<picker 
						mode="date" 
						:value="currentDate" 
						:start="startDate" 
						:end="endDate" 
						@change="dateChange">
						<view class="picker-text">
							{{ currentDate || '全部日期' }}
							<text class="iconfont icon-arrow-down"></text>
						</view>
					</picker>
					<view class="clear-btn" v-if="currentDate" @click="clearDateFilter">清除</view>
				</view>
				
				<view class="filter-item">
					<view class="filter-label">订单状态：</view>
					<view class="filter-options">
						<view 
							class="filter-option" 
							:class="{ active: currentStatus === '' }"
							@click="filterByStatus('')">
							全部
						</view>
						<view 
							class="filter-option" 
							:class="{ active: currentStatus === 'pending' }"
							@click="filterByStatus('pending')">
							待服务
						</view>
						<view 
							class="filter-option" 
							:class="{ active: currentStatus === 'completed' }"
							@click="filterByStatus('completed')">
							已完成
						</view>
						<view 
							class="filter-option" 
							:class="{ active: currentStatus === 'cancelled' }"
							@click="filterByStatus('cancelled')">
							已取消
						</view>
					</view>
				</view>
			</view>
			
			<!-- 订单列表 -->
			<view class="order-list" v-if="filteredOrderList.length > 0">
				<view class="order-item" v-for="(item, index) in filteredOrderList" :key="index">
					<view class="order-top">
						<view class="order-id">订单号：{{item.id}}</view>
						<view class="order-status" :class="getStatusClass(item.status)">{{getStatusText(item.status)}}</view>
					</view>
					
					<view class="order-info">
						<view class="user-info">
							<text class="label">用户ID：</text>
							<text class="value">{{item.userId}}</text>
						</view>
						
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
						
						<!-- 操作按钮 -->
						<view class="order-btns">
							<view 
								class="btn complete-btn" 
								v-if="item.status === 'pending'" 
								@click="completeOrder(item.id)">
								标记完成
							</view>
							<view 
								class="btn cancel-btn" 
								v-if="item.status === 'pending'" 
								@click="cancelOrder(item.id)">
								取消
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-else>
				<image src="/static/empty.png" mode="aspectFit" class="empty-img"></image>
				<view class="empty-text">暂无预约记录</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAdmin: false,
				adminCode: '',
				
				// 所有预约数据
				allOrderList: [],
				
				// 筛选条件
				currentServiceType: '',
				currentDate: '',
				currentStatus: '',
				
				// 日期范围
				startDate: '',
				endDate: ''
			}
		},
		computed: {
			// 根据筛选条件过滤订单列表
			filteredOrderList() {
				let result = this.allOrderList;
				
				// 按服务类型筛选
				if (this.currentServiceType) {
					result = result.filter(item => item.serviceType === this.currentServiceType);
				}
				
				// 按日期筛选
				if (this.currentDate) {
					result = result.filter(item => item.appointmentDate === this.currentDate);
				}
				
				// 按状态筛选
				if (this.currentStatus) {
					result = result.filter(item => item.status === this.currentStatus);
				}
				
				return result;
			}
		},
		onLoad() {
			// 检查管理员权限
			this.checkAdminStatus();
			
			// 如果是管理员，获取所有预约数据
			if (this.isAdmin) {
				this.getOrderList();
			}
			
			// 设置日期范围
			this.setupDateRange();
		},
		methods: {
			// 检查管理员权限
			checkAdminStatus() {
				const userInfoStr = uni.getStorageSync('userInfo');
				if (userInfoStr) {
					const userInfo = JSON.parse(userInfoStr);
					// 这里简单判断是否是管理员
					// 实际应用中应该从后端获取用户权限
					this.isAdmin = userInfo.id === 'user_1' || userInfo.id === 'admin';
				}
			},
			
			// 验证管理员身份
			verifyAdmin() {
				// 这里使用简单验证码 1234
				// 实际应用中应该有更安全的验证方式
				if (this.adminCode === '1234') {
					this.isAdmin = true;
					
					// 验证成功后获取预约列表
					this.getOrderList();
					
					uni.showToast({
						title: '验证成功',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: '验证码错误',
						icon: 'none'
					});
				}
			},
			
			// 获取所有预约数据
			getOrderList() {
				// 从本地存储中获取所有预约记录
				// 实际应用中应该从后端获取
				const appointmentsStr = uni.getStorageSync('appointments') || '[]';
				this.allOrderList = JSON.parse(appointmentsStr)
					.sort((a, b) => {
						// 先按状态排序：待服务 > 已完成 > 已取消
						const statusOrder = { 'pending': 0, 'completed': 1, 'cancelled': 2 };
						if (statusOrder[a.status] !== statusOrder[b.status]) {
							return statusOrder[a.status] - statusOrder[b.status];
						}
						// 再按预约日期排序
						if (a.appointmentDate !== b.appointmentDate) {
							return a.appointmentDate > b.appointmentDate ? 1 : -1;
						}
						// 最后按预约时间排序
						return a.appointmentTime > b.appointmentTime ? 1 : -1;
					});
			},
			
			// 设置日期范围
			setupDateRange() {
				const now = new Date();
				
				// 设置开始日期为当前日期前30天
				const startDate = new Date();
				startDate.setDate(now.getDate() - 30);
				this.startDate = this.formatDate(startDate);
				
				// 设置结束日期为当前日期后30天
				const endDate = new Date();
				endDate.setDate(now.getDate() + 30);
				this.endDate = this.formatDate(endDate);
			},
			
			// 格式化日期为 YYYY-MM-DD
			formatDate(date) {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			
			// 日期选择器变化
			dateChange(e) {
				this.currentDate = e.detail.value;
			},
			
			// 清除日期筛选
			clearDateFilter() {
				this.currentDate = '';
			},
			
			// 根据服务类型筛选
			filterByService(type) {
				this.currentServiceType = type;
			},
			
			// 根据状态筛选
			filterByStatus(status) {
				this.currentStatus = status;
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
			
			// 标记订单为已完成
			completeOrder(orderId) {
				uni.showModal({
					title: '提示',
					content: '确定将该预约标记为已完成吗？',
					success: (res) => {
						if (res.confirm) {
							// 更新预约状态
							const appointmentsStr = uni.getStorageSync('appointments') || '[]';
							const appointments = JSON.parse(appointmentsStr);
							
							const index = appointments.findIndex(item => item.id === orderId);
							if (index !== -1) {
								appointments[index].status = 'completed';
								uni.setStorageSync('appointments', JSON.stringify(appointments));
								
								// 刷新列表
								this.getOrderList();
								
								uni.showToast({
									title: '操作成功',
									icon: 'success'
								});
							}
						}
					}
				});
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
			}
		}
	}
</script>

<style>
	.admin-container {
		min-height: 100vh;
		background-color: #F5F5F5;
		padding-bottom: 30rpx;
	}
	
	.admin-header {
		padding: 30rpx;
	}
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}
	
	/* 管理员验证 */
	.login-verify {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}
	
	.verify-tip {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.verify-input {
		width: 100%;
		height: 80rpx;
		background-color: #F8F8F8;
		border-radius: 8rpx;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		font-size: 30rpx;
	}
	
	.verify-btn {
		background-color: #FF6699;
		color: #FFFFFF;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 8rpx;
		font-size: 30rpx;
	}
	
	/* 筛选部分 */
	.filter-section {
		background-color: #FFFFFF;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
	}
	
	.filter-item {
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	
	.filter-label {
		font-size: 28rpx;
		color: #333;
		margin-right: 20rpx;
		width: 140rpx;
	}
	
	.filter-options {
		display: flex;
		flex-wrap: wrap;
		flex: 1;
	}
	
	.filter-option {
		padding: 10rpx 20rpx;
		background-color: #F5F5F5;
		border-radius: 30rpx;
		margin-right: 20rpx;
		margin-bottom: 10rpx;
		font-size: 26rpx;
		color: #666;
	}
	
	.filter-option.active {
		background-color: #FFF2F5;
		color: #FF6699;
		font-weight: bold;
	}
	
	.picker-text {
		background-color: #F5F5F5;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		color: #666;
		display: inline-block;
	}
	
	.clear-btn {
		font-size: 26rpx;
		color: #999;
		margin-left: 20rpx;
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
	
	.user-info, .service-name, .appointment-time, .duration, .remark {
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
	
	.complete-btn {
		background-color: #34C759;
		color: #FFFFFF;
	}
	
	.cancel-btn {
		background-color: #F5F5F5;
		color: #666;
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
	}
</style> 