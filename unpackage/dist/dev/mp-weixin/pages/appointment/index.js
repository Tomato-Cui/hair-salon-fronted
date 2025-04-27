"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // 服务类型列表
      serviceTypes: [
        {
          name: "洗头",
          icon: "/static/service/wash.png",
          type: "wash",
          duration: 30
          // 分钟
        },
        {
          name: "理发",
          icon: "/static/service/haircut.png",
          type: "haircut",
          duration: 60
          // 分钟
        },
        {
          name: "染发",
          icon: "/static/service/dye.png",
          type: "dye",
          duration: 120
          // 分钟
        }
      ],
      selectedService: "",
      // 选中的服务类型
      availableDates: [],
      // 可选日期列表
      selectedDate: "",
      // 选中的日期
      availableTimes: [],
      // 可选时间段列表
      selectedTime: "",
      // 选中的时间段
      remark: "",
      // 备注信息
      userInfo: null
    };
  },
  onLoad(options) {
    if (options.type) {
      this.selectedService = options.type;
    }
    const userInfoStr = common_vendor.index.getStorageSync("userInfo");
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr);
    } else {
      common_vendor.index.showToast({
        title: "请先登录",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/login/index"
        });
      }, 1500);
      return;
    }
    this.initDateList();
    this.initTimeList();
  },
  methods: {
    // 选择服务类型
    selectService(type) {
      this.selectedService = type;
      this.initTimeList();
    },
    // 选择日期
    selectDate(date) {
      this.selectedDate = date;
      this.initTimeList();
    },
    // 选择时间段
    selectTime(time) {
      if (time.disabled)
        return;
      this.selectedTime = time.value;
    },
    // 初始化日期列表（未来7天）
    initDateList() {
      const dates = [];
      const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
      for (let i = 0; i < 7; i++) {
        const date = /* @__PURE__ */ new Date();
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
      this.selectedDate = dates[0].value;
    },
    // 初始化时间段列表
    initTimeList() {
      const times = [];
      const now = /* @__PURE__ */ new Date();
      const today = this.formatDate(now);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      for (let hour = 9; hour < 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeValue = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          const timeLabel = timeValue;
          let disabled = false;
          if (this.selectedDate === today) {
            if (hour < currentHour || hour === currentHour && minute < currentMinute) {
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
      this.selectedTime = "";
    },
    // 格式化日期为 YYYY-MM-DD
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 提交预约
    submitAppointment() {
      if (!this.selectedService) {
        common_vendor.index.showToast({
          title: "请选择服务类型",
          icon: "none"
        });
        return;
      }
      if (!this.selectedDate) {
        common_vendor.index.showToast({
          title: "请选择预约日期",
          icon: "none"
        });
        return;
      }
      if (!this.selectedTime) {
        common_vendor.index.showToast({
          title: "请选择预约时间段",
          icon: "none"
        });
        return;
      }
      const serviceInfo = this.serviceTypes.find((item) => item.type === this.selectedService);
      const appointmentData = {
        userId: this.userInfo.id,
        serviceType: this.selectedService,
        serviceName: serviceInfo.name,
        appointmentDate: this.selectedDate,
        appointmentTime: this.selectedTime,
        duration: serviceInfo.duration,
        remark: this.remark,
        status: "pending",
        createTime: (/* @__PURE__ */ new Date()).getTime()
      };
      const appointmentsStr = common_vendor.index.getStorageSync("appointments") || "[]";
      const appointments = JSON.parse(appointmentsStr);
      appointmentData.id = "order_" + Date.now();
      appointments.push(appointmentData);
      common_vendor.index.setStorageSync("appointments", JSON.stringify(appointments));
      common_vendor.index.showToast({
        title: "预约成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.redirectTo({
          url: "/pages/mine/orders"
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.serviceTypes, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: $data.selectedService === item.type ? 1 : "",
        e: common_vendor.o(($event) => $options.selectService(item.type), index)
      };
    }),
    b: common_vendor.f($data.availableDates, (date, index, i0) => {
      return {
        a: common_vendor.t(date.day),
        b: common_vendor.t(date.week),
        c: index,
        d: $data.selectedDate === date.value ? 1 : "",
        e: common_vendor.o(($event) => $options.selectDate(date.value), index)
      };
    }),
    c: common_vendor.f($data.availableTimes, (time, index, i0) => {
      return {
        a: common_vendor.t(time.label),
        b: index,
        c: $data.selectedTime === time.value ? 1 : "",
        d: time.disabled ? 1 : "",
        e: common_vendor.o(($event) => $options.selectTime(time), index)
      };
    }),
    d: $data.remark,
    e: common_vendor.o(($event) => $data.remark = $event.detail.value),
    f: common_vendor.o((...args) => $options.submitAppointment && $options.submitAppointment(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/appointment/index.js.map
