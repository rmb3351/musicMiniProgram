import {
  getMVURLInfo,
  getMVDetails,
  getRealatedVideos,
  getVideoURLInfo,
  getVideoDetail,
} from "../../../service/getMVData";

import { formatDate } from "../../../utils/dateFormat";

import { playingStore, inAuCtxt } from "../../../store/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    mvURLInfo: {},
    mvDetails: {},
    relatedVideos: [],

    // 绑定store里的isPlaying
    musicIsPlaying: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
    });
    // 将音乐播放状态和data的musicIsPlaying同步
    playingStore.onState("isPlaying", (res) => {
      this.setData({ musicIsPlaying: res });
    });
    this.getMVDatas(options);
  },
  onUnload() {
    // 手动开始播放则保存播放状态
    if (this.data.musicIsPlaying)
      playingStore.dispatch("saveInitialIsPlayingAction");
  },

  // 网络请求一锅端
  async getMVDatas({ id }) {
    // mv处理
    if (parseInt(id) == id) {
      getMVURLInfo(id).then((res) => {
        this.setData({ mvURLInfo: res.data });
      });
      getMVDetails(id).then((res) => {
        this.setData({ mvDetails: res.data });
      });
      // video处理
    } else {
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

  // 监听事件
  handleVideoPlay() {
    // 开始播放视频时暂停音乐
    if (this.data.musicIsPlaying) inAuCtxt.pause();
  },
});
