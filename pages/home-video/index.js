import { getTopMV } from "../../service/getMVData";
const gData = getApp().globalData;
Page({
  data: {
    topMVs: [],
    hasMore: true,
    contentHeight:
      gData.screenHeight - gData.statusBarHeight - gData.navBarHeight,
  },
  async getTopMVData(offset) {
    // 请求不是第一段数据时，要判断是否越界
    if (offset && !this.data.hasMore) return;
    const res = await getTopMV(offset);
    // 不越界或者是第一段，则分情况设置数据
    if (offset === 0) {
      this.setData({
        topMVs: res.data,
        hasMore: true,
      });
    } else {
      this.setData({
        topMVs: [...this.data.topMVs, ...res.data],
        hasMore: res.hasMore,
      });
    }
    console.log(res);
  },
  onLoad(options) {
    this.getTopMVData(0);
  },
  onReachBottom() {
    this.getTopMVData(this.data.topMVs.length);
  },
  onPullDownRefresh() {
    this.getTopMVData(0);
    wx.stopPullDownRefresh();
  },
});
