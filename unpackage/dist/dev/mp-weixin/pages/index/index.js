"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      shopInfo: {
        openTime: "09:00",
        closeTime: "21:00",
        address: "北京市朝阳区建国路88号"
      },
      serviceList: [
        {
          name: "洗头",
          icon: "/static/service/wash.png",
          type: "wash"
        },
        {
          name: "理发",
          icon: "/static/service/haircut.png",
          type: "haircut"
        },
        {
          name: "染发",
          icon: "/static/service/dye.png",
          type: "dye"
        }
      ],
      hasLogin: false,
      userInfo: {}
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
      const userInfo = common_vendor.index.getStorageSync("userInfo");
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
      common_vendor.index.navigateTo({
        url: `/pages/appointment/index?type=${type}`
      });
    },
    // 跳转到登录页
    goLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/index"
      });
    },
    // 跳转到个人中心
    goMine() {
      common_vendor.index.switchTab({
        url: "/pages/mine/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_vendor.t($data.shopInfo.openTime),
    c: common_vendor.t($data.shopInfo.closeTime),
    d: common_vendor.t($data.shopInfo.address),
    e: common_vendor.f($data.serviceList, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.goAppointment(item.type), index)
      };
    }),
    f: !$data.hasLogin
  }, !$data.hasLogin ? {
    g: common_vendor.o((...args) => $options.goLogin && $options.goLogin(...args))
  } : {
    h: $data.userInfo.avatarUrl || "/static/default-avatar.png",
    i: common_vendor.t($data.userInfo.nickName || "用户"),
    j: common_vendor.o((...args) => $options.goMine && $options.goMine(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
