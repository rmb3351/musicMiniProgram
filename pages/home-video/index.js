import { getTopMV } from "../../service/getMVData";
Page({
  data: {
    topMVs: [],
    hasMore: true,
  },
  // 发送原生请求，太过繁琐，弃用
  sendOriginRequest() {
    wx.request({
      url: "http://123.207.32.32:9001/top/mv",
      data: {
        offset: 1,
        limit: 20,
      },
      // 使用普通函数会导致this指向不对，所以用箭头函数
      success: (res) => {
        this.setData({
          topMVs: res.data.data,
        });
      },
      fail: (err) => {
        console.log(err);
      },
    });
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
