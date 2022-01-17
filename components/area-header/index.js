// components/area-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题",
    },
    rightText: {
      type: String,
      value: "更多",
    },
    showRight: {
      type: Boolean,
      value: true,
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
    handleMoreClick() {
      // 只提交事件，由具体area-header处理
      this.triggerEvent("moreclick");
    },
  },
});
