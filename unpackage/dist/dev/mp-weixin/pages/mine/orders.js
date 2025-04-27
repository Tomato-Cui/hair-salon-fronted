"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      orderList: [],
      userInfo: null
    };
  },
  onLoad() {
    this.checkLoginStatus();
    this.getOrderList();
  },
  onShow() {
    this.getOrderList();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
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
      }
    },
    // 获取预约列表
    getOrderList() {
      if (!this.userInfo)
        return;
      const appointmentsStr = common_vendor.index.getStorageSync("appointments") || "[]";
      const allAppointments = JSON.parse(appointmentsStr);
      this.orderList = allAppointments.filter((item) => item.userId === this.userInfo.id).sort((a, b) => b.createTime - a.createTime);
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        "pending": "待服务",
        "completed": "已完成",
        "cancelled": "已取消"
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
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    // 取消预约
    cancelOrder(orderId) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消该预约吗？",
        success: (res) => {
          if (res.confirm) {
            const appointmentsStr = common_vendor.index.getStorageSync("appointments") || "[]";
            const appointments = JSON.parse(appointmentsStr);
            const index = appointments.findIndex((item) => item.id === orderId);
            if (index !== -1) {
              appointments[index].status = "cancelled";
              common_vendor.index.setStorageSync("appointments", JSON.stringify(appointments));
              this.getOrderList();
              common_vendor.index.showToast({
                title: "已取消预约",
                icon: "success"
              });
            }
          }
        }
      });
    },
    // 查看详情
    viewDetail(item) {
      common_vendor.index.showModal({
        title: "预约详情",
        content: `服务：${item.serviceName}
日期：${item.appointmentDate}
时间：${item.appointmentTime}
时长：${item.duration}分钟
状态：${this.getStatusText(item.status)}
${item.remark ? "备注：" + item.remark : ""}`,
        showCancel: false
      });
    },
    // 去预约页面
    goAppointment() {
      common_vendor.index.switchTab({
        url: "/pages/appointment/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.orderList.length > 0
  }, $data.orderList.length > 0 ? {
    b: common_vendor.f($data.orderList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.id),
        b: common_vendor.t($options.getStatusText(item.status)),
        c: common_vendor.n($options.getStatusClass(item.status)),
        d: common_vendor.t(item.serviceName),
        e: common_vendor.t(item.appointmentDate),
        f: common_vendor.t(item.appointmentTime),
        g: common_vendor.t(item.duration),
        h: item.remark
      }, item.remark ? {
        i: common_vendor.t(item.remark)
      } : {}, {
        j: common_vendor.t($options.formatTime(item.createTime)),
        k: item.status === "pending"
      }, item.status === "pending" ? {
        l: common_vendor.o(($event) => $options.cancelOrder(item.id), index)
      } : {}, {
        m: common_vendor.o(($event) => $options.viewDetail(item), index),
        n: index
      });
    })
  } : {
    c: common_assets._imports_0$2,
    d: common_vendor.o((...args) => $options.goAppointment && $options.goAppointment(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/orders.js.map
