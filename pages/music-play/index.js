// pages/music-play/index.js
import { inAuCtxt, playingStore } from "../../store/index";
const gData = getApp().globalData;
const playingIconNames = ["order", "random", "repeat"];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playingSongInfo: {},
    durationTime: 0,
    allLyrics: [],
    // 使用时要注意单位转换
    currentTime: 0,
    percent: 0,

    showLyrics: gData.widthHeightRatio >= 1.9,
    // 所有歌词数组以及从中获取的当前歌词和它的下标
    currentLyric: "",
    currentLyricIndex: 0,
    // 更新歌词时该上滑到的距离
    lyricScrollTop: 0,

    isSliding: false,
    currentPage: 0,
    contentHeight:
      gData.screenHeight - gData.statusBarHeight - gData.navBarHeight,

    playingModeIndex: 0,
    modeIconName: "order",
    isPlaying: true,
    playingIconName: "pause",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setupInAuCtxt(options.id);
    this.setupPlayingStoreListener();
  },

  // 监听事件
  pageChange(e) {
    this.setData({ currentPage: e.detail.current });
  },
  setupPlayingStoreListener() {
    // 可以一次监听多个数据，以数组形式填写，解构回调的response，有哪个就配置哪个,因为不同的数据不会同步监听到改变
    playingStore.onStates(
      ["playingSongInfo", "durationTime", "allLyrics"],
      ({ allLyrics, durationTime, playingSongInfo }) => {
        if (allLyrics) this.setData({ allLyrics });
        if (durationTime) this.setData({ durationTime });
        if (playingSongInfo) this.setData({ playingSongInfo });
      }
    );

    playingStore.onStates(
      ["currentLyricIndex", "currentTime"],
      ({ currentLyricIndex, currentTime }) => {
        // 时间变化时更新时间和进度
        if (currentTime && !this.data.isSliding) {
          const percent = (currentTime / this.data.durationTime) * 100;
          this.setData({ currentTime, percent });
        }
        // 下标变化
        if (currentLyricIndex) {
          this.setData({
            currentLyricIndex,
            lyricScrollTop: currentLyricIndex * 35,
            currentLyric: this.data.allLyrics[currentLyricIndex].showingLyric,
          });
        }
      }
    );

    // 播放模式的监听
    playingStore.onState("playingModeIndex", (playingModeIndex) => {
      this.setData({
        playingModeIndex,
        modeIconName: playingIconNames[playingModeIndex],
      });
    });

    // 播放状态监听
    playingStore.onState("isPlaying", (isPlaying) => {
      this.setData({
        isPlaying,
        playingIconName: isPlaying ? "pause" : "resume",
      });
    });
  },
  // slider改变完毕的处理函数
  handleSliderChange(e) {
    if (this.data.isSliding) {
      this.setData({ isSliding: false });
    }
    const percent = e.detail.value;
    const currentTime = this.data.durationTime * (percent / 100);
    playingStore.setState("currentTime", currentTime);
    inAuCtxt.seek(currentTime / 1000);
    this.setData({ currentTime, percent });
  },
  // slider正在改变的处理函数
  handleSliderChanging(e) {
    if (!this.data.isSliding) {
      this.setData({ isSliding: true });
    }
    const percent = e.detail.value;
    const currentTime = this.data.durationTime * (percent / 100);
    // 这里不设置percent，因为percent设置是同步操作，而界面渲染是异步操作，会因为时间不同造成延迟
    this.setData({ currentTime });
    // this.getCurrentLyric();
  },
  handleLeftClick() {
    wx.navigateBack();
  },
  handleModeClick() {
    const playingModeIndex =
      (this.data.playingModeIndex + 1) % playingIconNames.length;
    playingStore.setState("playingModeIndex", playingModeIndex);
  },
  handlePlayClick() {
    playingStore.dispatch("changePlayingStatusAction", !this.data.isPlaying);
  },
  // 切歌调用同一个方法，只用传参区分
  handleSongChangeBtnClick(e) {
    const type = e.currentTarget.dataset.type;
    playingStore.dispatch("changeSongIndexInListAction", type);
  },
});
