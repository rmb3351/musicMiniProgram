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
  async onLoad(options) {
    this.setData({
      id: options.id,
    });
    await this.getMVDatas(this.data.id);
  },
  // 网络请求一锅端
  async getMVDatas(id) {
    const resURLInfo = await getMVURLInfo(id);
    const resDetails = await getMVDetails(id);
    const resRelated = await getRealatedVideos(id);
    this.setData({
      mvURLInfo: resURLInfo.data,
      mvDetails: resDetails.data,
      relatedVideos: resRelated.data,
    });
  },
});
