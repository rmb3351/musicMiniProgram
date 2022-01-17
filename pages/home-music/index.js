// index.js
import { getSwiperInfo, getSongMenu } from "../../service/getMusicData";

import { rankingStore, rankingMap } from "../../store/index";

import getSelectorRect from "../../utils/getSelectorRect.js";
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
  },
  onLoad(options) {
    this.getMusicData();
    // 先监听，再发送请求，避免请求回来改变了数据才发送请求
    rankingStore.onState("hotRanking", (res) => {
      this.setData({ recommendSongs: res.tracks?.slice(0, 6) });
    });
    // 0: 新歌榜(new) 1: 热歌榜(hot) 2: 原创榜(origin) 3: 飙升榜(surge)
    rankingStore.onState("newRanking", this.getRankingHandler(0));
    rankingStore.onState("originRanking", this.getRankingHandler(2));
    rankingStore.onState("surgeRanking", this.getRankingHandler(3));
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
    // 暴力限制只执行一次,由于图片要统一适配，所以只需执行一次，不采用防抖和节流
    if (!this.data.isFirst) return;
    this.setData({
      isFirst: false,
    });
    // 获取图片真实高度，并用行内样式修改swiper高度以适配
    getSelectorRect(".swiper-item-image").then((res) => {
      this.setData({
        swiperHeight: res.height,
      });
    });
  },
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
});
