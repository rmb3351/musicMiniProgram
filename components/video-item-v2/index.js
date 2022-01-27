// components/video-item-v2/index.js
import {
  getVideoURLInfo,
  getVideoDetail,
  getRealatedVideos,
} from "../../service/getMVData";
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
    handleItemClick() {
      const id = this.properties.itemInfo.vid;
      getVideoURLInfo(id).then((res) => {
        console.log(res);
      });
      getVideoDetail(id).then((res) => {
        console.log(res);
      });
      getRealatedVideos(id).then((res) => {
        console.log(res);
      });
    },
  },
});
