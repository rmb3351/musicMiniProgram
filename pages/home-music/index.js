// index.js
import { getSwiperInfo, getSongMenu } from "../../service/getMusicData";

import { rankingStore, rankingMap, playingStore } from "../../store/index";

import getSelectorRect from "../../utils/getSelectorRect.js";
import throttle from "../../utils/throttle";

// 封装成节流函数，最后会回调一次
const throttleGetSelectorRect = throttle(getSelectorRect, 1000, {
  trailing: true,
});
Page({
  data: {
    banners: [],
    swiperHeight: 0,
    isFirst: true,
    // 推荐歌曲（热门榜）前六条
    recommendSongs: [],
    // 歌单数据（请求只获取了6条）
    hotSongMenu: [],
    chineseSongMenu: [],
    // 所有巅峰榜的前三条展示数据，加下标保持在对象中的位置，方便按顺序遍历
    rankings: { 0: {}, 2: {}, 3: {} },

    // 底部工具栏用到的属性
    playingSongInfo: {},
    isPlaying: false,
    coverAnimState: "paused",
  },
  onLoad(options) {
    this.getMusicData();
    this.setupPlayingStoreListener();
    // 分发actions发送请求获取数据
    rankingStore.dispatch("getRankingDataActions");
  },
  getMusicData() {
    // 获取轮播图的数据
    getSwiperInfo().then((res) => {
      this.setData({
        banners: res.banners,
      });
    });
    // 获取热门歌单
    getSongMenu().then((res) => {
      this.setData({ hotSongMenu: res.playlists });
    });
    // 获取华语歌单
    getSongMenu("华语").then((res) => {
      this.setData({ chineseSongMenu: res.playlists });
    });
  },
  // 配置playing-store监听的函数
  setupPlayingStoreListener() {
    // 先监听，再发送请求，避免请求回来改变了数据才发送请求
    rankingStore.onState("hotRanking", (res) => {
      this.setData({ recommendSongs: res.tracks?.slice(0, 6) });
    });
    // 0: 新歌榜(new) 1: 热歌榜(hot) 2: 原创榜(origin) 3: 飙升榜(surge)
    rankingStore.onState("newRanking", this.getRankingHandler(0));
    rankingStore.onState("originRanking", this.getRankingHandler(2));
    rankingStore.onState("surgeRanking", this.getRankingHandler(3));

    // 监听playing-store的正在播放歌曲和状态
    playingStore.onStates(
      ["playingSongInfo", "isPlaying"],
      ({ playingSongInfo, isPlaying }) => {
        if (playingSongInfo) {
          this.setData({ playingSongInfo });
        }
        // 同步播放状态和动画
        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            coverAnimState: isPlaying ? "running" : "paused",
          });
        }
      }
    );
  },
  // 整合几个排行榜的数据，拼接到一个对象内
  getRankingHandler(idx) {
    return (res) => {
      // 初始监听的空值跳出，避免数组方法报错
      if (Object.keys(res).length === 0) return;
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const songList = res.tracks.slice(0, 3);
      const rankingObj = { name, coverImgUrl, playCount, songList };
      this.setData({ rankings: { ...this.data.rankings, [idx]: rankingObj } });
    };
  },
  // 图片加载完毕后调用
  getImageHeight() {
    // 还是需要使用节流，在最后的图片加载的时候执行一次，避免执行太早高度获取不正确的bug
    // 获取图片真实高度，并用行内样式修改swiper高度以适配
    throttleGetSelectorRect(".swiper-item-image").then((res) => {
      this.setData({
        swiperHeight: res.height,
      });
    });
  },

  // 监听事件
  toSearch() {
    wx.navigateTo({
      url: "../detail-search/index",
    });
  },
  handleMoreClick() {
    this.toSong("hotRanking");
  },
  handleRankingItemClick(e) {
    const idx = e.currentTarget.dataset.idx;
    // 把ranking-store里的映射对象拿来取到排行名
    this.toSong(rankingMap[idx]);
  },
  // 由于都是到detail-song界面，所以要传参区分
  toSong(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-song/index?ranking=${rankingName}&type=rank`,
    });
  },
  // 播放歌曲的入口存储歌曲所在列表及所在位置
  handleRcmdItemClick(e) {
    playingStore.setState("playingSongList", this.data.recommendSongs);
    playingStore.setState("playingSongIndex", e.currentTarget.dataset.index);
  },
  // 底部状态栏的监听
  handldPlayBtnClick() {
    playingStore.dispatch("changePlayingStatusAction", !this.data.isPlaying);
  },
  handleBarClick() {
    wx.navigateTo({
      url: "/pages/music-play/index?id=" + this.data.playingSongInfo.id,
    });
  },
});
