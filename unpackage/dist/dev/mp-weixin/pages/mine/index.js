"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      hasLogin: false,
      userInfo: {},
      isAdmin: false
    };
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
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        this.hasLogin = true;
        this.userInfo = JSON.parse(userInfoStr);
        this.isAdmin = this.userInfo.id === "user_1" || this.userInfo.id === "admin";
      } else {
        this.hasLogin = false;
        this.userInfo = {};
        this.isAdmin = false;
      }
    },
    // 跳转到登录页
    goLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/index"
      });
    },
    // 跳转到我的预约
    goOrders() {
      if (!this.hasLogin) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          this.goLogin();
        }, 1500);
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/mine/orders"
      });
    },
    // 跳转到管理页面
    goAdmin() {
      if (!this.isAdmin) {
        common_vendor.index.showToast({
          title: "您没有管理权限",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/admin/orders"
      });
    },
    // 退出登录
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("token");
            this.hasLogin = false;
            this.userInfo = {};
            this.isAdmin = false;
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.hasLogin
  }, !$data.hasLogin ? {
    b: common_assets._imports_0$1,
    c: common_vendor.o((...args) => $options.goLogin && $options.goLogin(...args))
  } : {
    d: $data.userInfo.avatarUrl || "/static/default-avatar.png",
    e: common_vendor.t($data.userInfo.nickName || "用户"),
    f: common_vendor.t($data.userInfo.id)
  }, {
    g: common_vendor.o((...args) => $options.goOrders && $options.goOrders(...args)),
    h: $data.isAdmin
  }, $data.isAdmin ? {
    i: common_vendor.o((...args) => $options.goAdmin && $options.goAdmin(...args))
  } : {}, {
    j: $data.hasLogin
  }, $data.hasLogin ? {
    k: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/index.js.map
