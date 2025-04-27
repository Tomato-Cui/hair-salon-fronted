"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isAdmin: false,
      adminCode: "",
      // 所有预约数据
      allOrderList: [],
      // 筛选条件
      currentServiceType: "",
      currentDate: "",
      currentStatus: "",
      // 日期范围
      startDate: "",
      endDate: ""
    };
  },
  computed: {
    // 根据筛选条件过滤订单列表
    filteredOrderList() {
      let result = this.allOrderList;
      if (this.currentServiceType) {
        result = result.filter((item) => item.serviceType === this.currentServiceType);
      }
      if (this.currentDate) {
        result = result.filter((item) => item.appointmentDate === this.currentDate);
      }
      if (this.currentStatus) {
        result = result.filter((item) => item.status === this.currentStatus);
      }
      return result;
    }
  },
  onLoad() {
    this.checkAdminStatus();
    if (this.isAdmin) {
      this.getOrderList();
    }
    this.setupDateRange();
  },
  methods: {
    // 检查管理员权限
    checkAdminStatus() {
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        this.isAdmin = userInfo.id === "user_1" || userInfo.id === "admin";
      }
    },
    // 验证管理员身份
    verifyAdmin() {
      if (this.adminCode === "1234") {
        this.isAdmin = true;
        this.getOrderList();
        common_vendor.index.showToast({
          title: "验证成功",
          icon: "success"
        });
      } else {
        common_vendor.index.showToast({
          title: "验证码错误",
          icon: "none"
        });
      }
    },
    // 获取所有预约数据
    getOrderList() {
      const appointmentsStr = common_vendor.index.getStorageSync("appointments") || "[]";
      this.allOrderList = JSON.parse(appointmentsStr).sort((a, b) => {
        const statusOrder = { "pending": 0, "completed": 1, "cancelled": 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        if (a.appointmentDate !== b.appointmentDate) {
          return a.appointmentDate > b.appointmentDate ? 1 : -1;
        }
        return a.appointmentTime > b.appointmentTime ? 1 : -1;
      });
    },
    // 设置日期范围
    setupDateRange() {
      const now = /* @__PURE__ */ new Date();
      const startDate = /* @__PURE__ */ new Date();
      startDate.setDate(now.getDate() - 30);
      this.startDate = this.formatDate(startDate);
      const endDate = /* @__PURE__ */ new Date();
      endDate.setDate(now.getDate() + 30);
      this.endDate = this.formatDate(endDate);
    },
    // 格式化日期为 YYYY-MM-DD
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 日期选择器变化
    dateChange(e) {
      this.currentDate = e.detail.value;
    },
    // 清除日期筛选
    clearDateFilter() {
      this.currentDate = "";
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
    // 标记订单为已完成
    completeOrder(orderId) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定将该预约标记为已完成吗？",
        success: (res) => {
          if (res.confirm) {
            const appointmentsStr = common_vendor.index.getStorageSync("appointments") || "[]";
            const appointments = JSON.parse(appointmentsStr);
            const index = appointments.findIndex((item) => item.id === orderId);
            if (index !== -1) {
              appointments[index].status = "completed";
              common_vendor.index.setStorageSync("appointments", JSON.stringify(appointments));
              this.getOrderList();
              common_vendor.index.showToast({
                title: "操作成功",
                icon: "success"
              });
            }
          }
        }
      });
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isAdmin
  }, !$data.isAdmin ? {
    b: $data.adminCode,
    c: common_vendor.o(($event) => $data.adminCode = $event.detail.value),
    d: common_vendor.o((...args) => $options.verifyAdmin && $options.verifyAdmin(...args))
  } : {}, {
    e: $data.isAdmin
  }, $data.isAdmin ? common_vendor.e({
    f: $data.currentServiceType === "" ? 1 : "",
    g: common_vendor.o(($event) => $options.filterByService("")),
    h: $data.currentServiceType === "wash" ? 1 : "",
    i: common_vendor.o(($event) => $options.filterByService("wash")),
    j: $data.currentServiceType === "haircut" ? 1 : "",
    k: common_vendor.o(($event) => $options.filterByService("haircut")),
    l: $data.currentServiceType === "dye" ? 1 : "",
    m: common_vendor.o(($event) => $options.filterByService("dye")),
    n: common_vendor.t($data.currentDate || "全部日期"),
    o: $data.currentDate,
    p: $data.startDate,
    q: $data.endDate,
    r: common_vendor.o((...args) => $options.dateChange && $options.dateChange(...args)),
    s: $data.currentDate
  }, $data.currentDate ? {
    t: common_vendor.o((...args) => $options.clearDateFilter && $options.clearDateFilter(...args))
  } : {}, {
    v: $data.currentStatus === "" ? 1 : "",
    w: common_vendor.o(($event) => $options.filterByStatus("")),
    x: $data.currentStatus === "pending" ? 1 : "",
    y: common_vendor.o(($event) => $options.filterByStatus("pending")),
    z: $data.currentStatus === "completed" ? 1 : "",
    A: common_vendor.o(($event) => $options.filterByStatus("completed")),
    B: $data.currentStatus === "cancelled" ? 1 : "",
    C: common_vendor.o(($event) => $options.filterByStatus("cancelled")),
    D: $options.filteredOrderList.length > 0
  }, $options.filteredOrderList.length > 0 ? {
    E: common_vendor.f($options.filteredOrderList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.id),
        b: common_vendor.t($options.getStatusText(item.status)),
        c: common_vendor.n($options.getStatusClass(item.status)),
        d: common_vendor.t(item.userId),
        e: common_vendor.t(item.serviceName),
        f: common_vendor.t(item.appointmentDate),
        g: common_vendor.t(item.appointmentTime),
        h: common_vendor.t(item.duration),
        i: item.remark
      }, item.remark ? {
        j: common_vendor.t(item.remark)
      } : {}, {
        k: common_vendor.t($options.formatTime(item.createTime)),
        l: item.status === "pending"
      }, item.status === "pending" ? {
        m: common_vendor.o(($event) => $options.completeOrder(item.id), index)
      } : {}, {
        n: item.status === "pending"
      }, item.status === "pending" ? {
        o: common_vendor.o(($event) => $options.cancelOrder(item.id), index)
      } : {}, {
        p: index
      });
    })
  } : {
    F: common_assets._imports_0$2
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/admin/orders.js.map
