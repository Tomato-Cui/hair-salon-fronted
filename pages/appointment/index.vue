<template>
	<view class="appointment-container">
		<view class="appointment-header">
			<view class="header-title">服务预约</view>
		</view>
		
		<!-- 服务类型选择 -->
		<view class="section">
			<view class="section-title">选择服务类型</view>
			<view class="service-list">
				<view class="service-item" 
					v-for="(item, index) in serviceTypes" 
					:key="index"
					:class="{ active: selectedService === item.type }"
					@click="selectService(item.type)">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
		
		<!-- 日期选择 -->
		<view class="section">
			<view class="section-title">选择预约日期</view>
			<view class="date-list">
				<view class="date-item" 
					v-for="(date, index) in availableDates" 
					:key="index"
					:class="{ active: selectedDate === date.value }"
					@click="selectDate(date.value)">
					<text class="date-day">{{date.day}}</text>
					<text class="date-week">{{date.week}}</text>
				</view>
			</view>
		</view>
		
		<!-- 时间段选择 -->
		<view class="section">
			<view class="section-title">选择时间段</view>
			<view class="time-list">
				<view class="time-item" 
					v-for="(time, index) in availableTimes" 
					:key="index"
					:class="{ active: selectedTime === time.value, disabled: time.disabled }"
					@click="selectTime(time)">
					<text>{{time.label}}</text>
				</view>
			</view>
		</view>
		
		<!-- 备注信息 -->
		<view class="section">
			<view class="section-title">备注信息（选填）</view>
			<textarea class="remark-input" placeholder="请输入预约备注信息" v-model="remark"></textarea>
		</view>
		
		<!-- 提交按钮 -->
		<view class="btn-container">
			<button class="submit-btn" @click="submitAppointment">确认预约</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 服务类型列表
				serviceTypes: [
					{
						name: '洗头',
						icon: '/static/service/wash.png',
						type: 'wash',
						duration: 30 // 分钟
					},
					{
						name: '理发',
						icon: '/static/service/haircut.png',
						type: 'haircut',
						duration: 60 // 分钟
					},
					{
						name: '染发',
						icon: '/static/service/dye.png',
						type: 'dye',
						duration: 120 // 分钟
					}
				],
				selectedService: '', // 选中的服务类型
				
				availableDates: [], // 可选日期列表
				selectedDate: '', // 选中的日期
				
				availableTimes: [], // 可选时间段列表
				selectedTime: '', // 选中的时间段
				
				remark: '', // 备注信息
				
				userInfo: null
			}
		},
		onLoad(options) {
			// 从页面参数获取预选的服务类型
			if (options.type) {
				this.selectedService = options.type;
			}
			
			// 获取用户信息
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
				return;
			}
			
			// 初始化日期选择
			this.initDateList();
			
			// 初始化时间段选择
			this.initTimeList();
		},
		methods: {
			// 选择服务类型
			selectService(type) {
				this.selectedService = type;
				// 选择服务类型后可能需要更新时间段
				this.initTimeList();
			},
			
			// 选择日期
			selectDate(date) {
				this.selectedDate = date;
				// 选择日期后可能需要更新时间段
				this.initTimeList();
			},
			
			// 选择时间段
			selectTime(time) {
				if (time.disabled) return;
				this.selectedTime = time.value;
			},
			
			// 初始化日期列表（未来7天）
			initDateList() {
				const dates = [];
				const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
				
				for (let i = 0; i < 7; i++) {
					const date = new Date();
					date.setDate(date.getDate() + i);
					
					const month = date.getMonth() + 1;
					const day = date.getDate();
					const weekDay = weekDays[date.getDay()];
					
					dates.push({
						label: `${month}月${day}日`,
						day: `${month}/${day}`,
						week: `周${weekDay}`,
						value: this.formatDate(date)
					});
				}
				
				this.availableDates = dates;
				// 默认选中第一天
				this.selectedDate = dates[0].value;
			},
			
			// 初始化时间段列表
			initTimeList() {
				// 营业时间 9:00 - 21:00，每30分钟一个时间段
				const times = [];
				const now = new Date();
				const today = this.formatDate(now);
				const currentHour = now.getHours();
				const currentMinute = now.getMinutes();
				
				// 生成时间段
				for (let hour = 9; hour < 21; hour++) {
					for (let minute = 0; minute < 60; minute += 30) {
						const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
						const timeLabel = timeValue;
						
						// 判断是否已过当前时间（今天的话）
						let disabled = false;
						if (this.selectedDate === today) {
							if (hour < currentHour || (hour === currentHour && minute < currentMinute)) {
								disabled = true;
							}
						}
						
						times.push({
							label: timeLabel,
							value: timeValue,
							disabled
						});
					}
				}
				
				this.availableTimes = times;
				// 重置已选择的时间段
				this.selectedTime = '';
			},
			
			// 格式化日期为 YYYY-MM-DD
			formatDate(date) {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			
			// 提交预约
			submitAppointment() {
				// 验证选择
				if (!this.selectedService) {
					uni.showToast({
						title: '请选择服务类型',
						icon: 'none'
					});
					return;
				}
				
				if (!this.selectedDate) {
					uni.showToast({
						title: '请选择预约日期',
						icon: 'none'
					});
					return;
				}
				
				if (!this.selectedTime) {
					uni.showToast({
						title: '请选择预约时间段',
						icon: 'none'
					});
					return;
				}
				
				// 获取服务时长
				const serviceInfo = this.serviceTypes.find(item => item.type === this.selectedService);
				
				// 组装预约数据
				const appointmentData = {
					userId: this.userInfo.id,
					serviceType: this.selectedService,
					serviceName: serviceInfo.name,
					appointmentDate: this.selectedDate,
					appointmentTime: this.selectedTime,
					duration: serviceInfo.duration,
					remark: this.remark,
					status: 'pending',
					createTime: new Date().getTime()
				};
				
				// 这里模拟保存到本地
				// 实际应用中，应该发送到后端保存
				const appointmentsStr = uni.getStorageSync('appointments') || '[]';
				const appointments = JSON.parse(appointmentsStr);
				
				// 生成订单ID
				appointmentData.id = 'order_' + Date.now();
				appointments.push(appointmentData);
				
				uni.setStorageSync('appointments', JSON.stringify(appointments));
				
				uni.showToast({
					title: '预约成功',
					icon: 'success'
				});
				
				// 预约成功后跳转到我的预约页面
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/mine/orders'
					});
				}, 1500);
			}
		}
	}
</script>

<style>
	.appointment-container {
		padding: 30rpx;
		background-color: #F5F5F5;
		min-height: 100vh;
	}
	
	.appointment-header {
		margin-bottom: 30rpx;
	}
	
	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	.section {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	/* 服务类型样式 */
	.service-list {
		display: flex;
		justify-content: space-between;
	}
	
	.service-item {
		width: 30%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #F8F8F8;
		padding: 20rpx;
		border-radius: 12rpx;
		transition: all 0.3s;
	}
	
	.service-item.active {
		background-color: #FFF2F5;
		border: 2rpx solid #FF6699;
	}
	
	.service-item image {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 10rpx;
	}
	
	.service-item text {
		font-size: 28rpx;
		color: #333;
	}
	
	.service-item.active text {
		color: #FF6699;
		font-weight: bold;
	}
	
	/* 日期选择样式 */
	.date-list {
		display: flex;
		overflow-x: scroll;
		padding-bottom: 10rpx;
	}
	
	.date-list::-webkit-scrollbar {
		display: none;
	}
	
	.date-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20rpx 30rpx;
		margin-right: 20rpx;
		background-color: #F8F8F8;
		border-radius: 12rpx;
		min-width: 140rpx;
		transition: all 0.3s;
	}
	
	.date-item.active {
		background-color: #FFF2F5;
		border: 2rpx solid #FF6699;
	}
	
	.date-day {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.date-week {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}
	
	.date-item.active .date-day,
	.date-item.active .date-week {
		color: #FF6699;
	}
	
	/* 时间段选择样式 */
	.time-list {
		display: flex;
		flex-wrap: wrap;
	}
	
	.time-item {
		width: 22%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F8F8F8;
		border-radius: 12rpx;
		margin-right: 3%;
		margin-bottom: 20rpx;
		transition: all 0.3s;
	}
	
	.time-item:nth-child(4n) {
		margin-right: 0;
	}
	
	.time-item.active {
		background-color: #FFF2F5;
		border: 2rpx solid #FF6699;
	}
	
	.time-item text {
		font-size: 26rpx;
		color: #333;
	}
	
	.time-item.active text {
		color: #FF6699;
		font-weight: bold;
	}
	
	.time-item.disabled {
		background-color: #E0E0E0;
		color: #999;
	}
	
	.time-item.disabled text {
		color: #999;
	}
	
	/* 备注输入框 */
	.remark-input {
		width: 100%;
		height: 200rpx;
		background-color: #F8F8F8;
		border-radius: 12rpx;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}
	
	/* 提交按钮 */
	.btn-container {
		margin-top: 60rpx;
		padding-bottom: 50rpx;
	}
	
	.submit-btn {
		width: 100%;
		height: 90rpx;
		background-color: #FF6699;
		color: #FFFFFF;
		border-radius: 45rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 10rpx 20rpx rgba(255, 102, 153, 0.3);
	}
</style> 