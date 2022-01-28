import {
  getMVURLInfo,
  getMVDetails,
  getRealatedVideos,
  getVideoURLInfo,
  getVideoDetail,
} from "../../../service/getMVData";

import { formatDate } from "../../../utils/dateFormat";
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
    this.getMVDatas(options);
  },
  // 网络请求一锅端
  async getMVDatas({ id, type }) {
    // home页的mv处理
    if (type === "mv") {
      getMVURLInfo(id).then((res) => {
        this.setData({ mvURLInfo: res.data });
      });
      getMVDetails(id).then((res) => {
        this.setData({ mvDetails: res.data });
      });
      // 推荐的video处理
    } else if (type === "video") {
      getVideoURLInfo(id).then((res) => {
        this.setData({ mvURLInfo: res.urls[0] });
      });
      getVideoDetail(id).then((res) => {
        const data = res.data;
        const artists = [{ ...data.creator, name: data.creator.nickname }];
        const publishTime = formatDate(data.publishTime, "yyyy-MM-dd");
        const mvDetails = {
          name: data.title,
          artists,
          playCount: data.playTime,
          publishTime,
        };
        this.setData({ mvDetails });
      });
    }
    getRealatedVideos(id).then((res) => {
      this.setData({ relatedVideos: res.data });
    });
  },
});
