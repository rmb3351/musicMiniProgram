// components/rcmd-item-v1/index.js
import { playingStore } from "../../store/index";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    songClick() {
      const id = this.properties.itemInfo.id;
      wx.navigateTo({
        url: `/packagePlaying/pages/music-play/index?id=${id}`,
      });
      playingStore.dispatch("playMusicWithSongIdActions", { id });
    },
  },
});
