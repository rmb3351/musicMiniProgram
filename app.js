// app.js
import {
  getLoginCode,
  codeToToken,
  checkToken,
  checkSession,
} from "./service/getLoginData";
App({
  // 任意定义的数据
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    widthHeightRatio: 1,
  },
  onLaunch() {
    // 获取系统信息的API
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;
    this.globalData.widthHeightRatio = info.screenHeight / info.screenWidth;

    // 避免异步减慢onLaunch调用速度的方法
    this.handleLoginInfo();
  },
  async handleLoginInfo() {
    const token = wx.getStorageSync("token_key");
    const checkTokenResult = await checkToken();
    const checkSessionResult = await checkSession();
    // 没有token或token过期或session过期
    if (!token || checkTokenResult.errorCode || !checkSessionResult)
      // 重新获取token
      this.loginAction();
  },
  async loginAction() {
    const loginCode = await getLoginCode();
    console.log("loginCode：", loginCode);
    const result = await codeToToken(loginCode);
    const token = result.token;
    console.log("token", token);
    wx.setStorageSync("token_key", token);
  },
});
