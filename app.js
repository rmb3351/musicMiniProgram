// app.js
App({
  onLaunch() {
    // 获取系统信息的API
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;
    this.globalData.widthHeightRatio = info.screenHeight / info.screenWidth;
  },
  // 任意定义的数据
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    widthHeightRatio: 1,
  },
});
