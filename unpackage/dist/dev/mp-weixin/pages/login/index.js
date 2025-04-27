"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    // 微信登录获取code
    wxLogin() {
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      common_vendor.index.login({
        provider: "weixin",
        success: (res) => {
          if (res.code) {
            this.loginByCode(res.code);
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "登录失败，请重试",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录失败，请重试",
            icon: "none"
          });
        }
      });
    },
    // 将code发送到后端
    loginByCode(code) {
      const userInfo = {
        id: "user_" + Math.floor(Math.random() * 1e3),
        nickName: "用户" + Math.floor(Math.random() * 1e3),
        avatarUrl: "",
        openid: "openid_" + Math.floor(Math.random() * 1e3)
      };
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
      common_vendor.index.setStorageSync("token", "mock_token_" + Math.floor(Math.random() * 1e3));
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({
        title: "登录成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    },
    // 获取用户头像和昵称
    getUserProfile() {
      if (typeof common_vendor.wx$1 !== "undefined" && common_vendor.wx$1.getUserProfile) {
        common_vendor.wx$1.getUserProfile({
          desc: "用于完善会员资料",
          success: (res) => {
            const userInfo = res.userInfo;
            this.updateUserInfo(userInfo);
          },
          fail: () => {
            common_vendor.index.showToast({
              title: "授权已取消",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "当前环境不支持，请使用微信小程序",
          icon: "none"
        });
      }
    },
    // 更新用户信息
    updateUserInfo(profileInfo) {
      const userInfoStr = common_vendor.index.getStorageSync("userInfo");
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        userInfo.nickName = profileInfo.nickName;
        userInfo.avatarUrl = profileInfo.avatarUrl;
        common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
        common_vendor.index.showToast({
          title: "授权成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } else {
        this.wxLogin();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.wxLogin && $options.wxLogin(...args)),
    c: common_vendor.o((...args) => $options.getUserProfile && $options.getUserProfile(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
