// components/video-item-v1/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mvInfo: {
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
    mvItemClick(e) {
      const id = e.currentTarget.dataset.click.id;
      wx.navigateTo({
        url: `/packageDetail/pages/detail-video/index?id=${id}`,
      });
    },
  },
});
