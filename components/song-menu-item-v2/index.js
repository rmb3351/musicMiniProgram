// components/song-menu-item-v2/index.js
import { playingStore } from "../../store/index";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    artistisLength: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    songClick() {
      console.log(this.properties.item);
      const id = this.properties.item.id;
      wx.navigateTo({
        url: `/packagePlaying/pages/music-play/index?id=${id}`,
      });
      playingStore.dispatch("playMusicWithSongIdActions", { id });
    },
  },
  lifetimes: {
    attached() {
      if (this.properties.item.ar) {
        this.setData({ artistisLength: this.properties.item.ar.length - 1 });
      } else if (this.properties.item.artists) {
        this.setData({
          artistisLength: this.properties.item.artists.length - 1,
        });
      }
    },
  },
});
