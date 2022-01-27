import {
  getMVURLInfo,
  getMVDetails,
  getRealatedVideos,
} from "../../../service/getMVData";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    mvURLInfo: {},
    mvDetails: {},
    relatedVideos: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
    });
    this.getMVDatas(this.data.id);
  },
  // 网络请求一锅端
  async getMVDatas(id) {
    getMVURLInfo(id).then((res) => {
      this.setData({ mvURLInfo: res.data });
    });
    getMVDetails(id).then((res) => {
      this.setData({ mvDetails: res.data });
    });
    getRealatedVideos(id).then((res) => {
      this.setData({ relatedVideos: res.data });
    });
  },
});
