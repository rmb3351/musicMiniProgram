// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songMenu: {
      type: Array,
      value: [],
    },
    title: {
      type: String,
      value: "默认标题",
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
    // 对应歌单的详情页跳转
    toMenuDetail(e) {
      const id = e.currentTarget.dataset.info.id;
      wx.navigateTo({
        url: `/packageDetail/pages/detail-song/index?id=${id}&type=menu`,
      });
    },
    // 歌单分类列表页跳转
    toDetailMenu() {
      wx.navigateTo({
        url: `/packageDetail/pages/detail-menu/index`,
      });
    },
  },
});
