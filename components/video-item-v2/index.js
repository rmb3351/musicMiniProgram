// components/video-item-v2/index.js
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
    handleItemClick(e) {
      const id = this.properties.itemInfo.vid;
      wx.navigateTo({
        url: `/packageDetail/pages/detail-video/index?id=${id}`,
      });
    },
  },
});
