// pages/detail-song/index.js
import { rankingStore, playingStore } from "../../../store/index";
import { getSongMenuDetail, getAlbum } from "../../../service/getMusicData";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    ranking: "",
    songInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 排行榜数据直接从store中获取现成的，歌单详情数据要单独发请求
    this.parseDiffSongListType(options);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.type === "rank") {
      rankingStore.offState(this.data.ranking, this.updateRankingData);
    }
  },
  updateRankingData(res) {
    this.setData({ songInfo: res });
  },
  handleSongMenuItemClick(e) {
    playingStore.setState("playingSongList", this.data.songInfo.tracks);
    playingStore.setState("playingSongIndex", e.currentTarget.dataset.index);
  },

  // 不同类型的歌曲列表的解析
  parseDiffSongListType(options) {
    if (options.type === "rank") {
      this.setData({ ranking: options.ranking, type: options.type });
      rankingStore.onState(this.data.ranking, this.updateRankingData);
    } else if (options.type === "menu") {
      getSongMenuDetail(options.id).then((res) => {
        this.setData({ songInfo: res.playlist, type: options.type });
        console.log(this.data.songInfo);
      });
    } else if (options.type === "album") {
      getAlbum(options.id).then(({ album, songs }) => {
        const songInfo = {
          coverImgUrl: album.blurPicUrl,
          name: album.name,
          creator: {
            avatarUrl: album.artist.img1v1Url,
            nickname: album.artist.name,
          },
          description: album.description,
          playCount: album.info.shareCount,
          tracks: songs,
        };
        this.setData({ songInfo, type: options.type });
      });
    }
  },
});
