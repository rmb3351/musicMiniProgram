import { getTopMV } from "../../service/getMVData";
import getSelectorRect from "../../utils/getSelectorRect";
Page({
  data: {
    currentIndex: 0,
    // 记录每个类别的名称、offset、topMVs等信息
    swiperItemsInfo: [],
    // 每个类别内容的高度
    contentHeights: [],
    // 每个类别当前滚动的高度
    scrollTops: [],
    // 是否可以发送新网络请求的决定变量
    canRefreshPage: false,
  },

  // 自带回调
  onLoad(options) {
    this.initialSwiperItemsInfo();
    this.setOffsetThenGetData(true);
  },
  // 上拉下拉到位监听
  onReachBottom() {
    if (this.data.canRefreshPage) this.setOffsetThenGetData(false);
  },
  onPullDownRefresh() {
    this.setOffsetThenGetData(true);
    wx.stopPullDownRefresh();
  },

  //自定义监听
  // 两个监听基本相同，都是切换swiperItem的回调
  handleTabClick(e) {
    // 记录切换前下标的滚动高度
    this.setScrollTop(this.data.currentIndex);
    const currentIndex = e.currentTarget.dataset.index;
    this.setData({ currentIndex });
    // 第一次则请求数据，否则滚到上次高度
    if (this.data.swiperItemsInfo[currentIndex].isFirst) {
      this.setOffsetThenGetData(true);
    } else {
      wx.pageScrollTo({
        scrollTop: this.data.scrollTops[currentIndex],
        duration: 0,
      });
    }
  },
  handleItemChange(e) {
    this.setScrollTop(this.data.currentIndex);
    const currentIndex = e.detail.current;
    this.setData({ currentIndex });
    if (this.data.swiperItemsInfo[currentIndex].isFirst) {
      this.setOffsetThenGetData(true);
    } else {
      wx.pageScrollTo({
        scrollTop: this.data.scrollTops[currentIndex],
        duration: 0,
      });
    }
  },

  // 功能函数
  // 初始化swiperItemsInfo
  initialSwiperItemsInfo() {
    const areas = ["全部", "内地", "港台", "欧美", "日本", "韩国"];
    const swiperItemsInfo = areas.map((item, index) => {
      return {
        area: item,
        index,
        offset: 0,
        // 是否第一次请求
        isFirst: true,
      };
    });
    this.setData({ swiperItemsInfo });
  },

  // 设置offset并获取数据
  setOffsetThenGetData(isInitial) {
    const swiperItemsInfo = this.data.swiperItemsInfo;
    const currentIndex = this.data.currentIndex;
    // 检测是否第一次请求
    if (swiperItemsInfo[currentIndex].isFirst) {
      swiperItemsInfo[currentIndex].isFirst = false;
    }
    swiperItemsInfo[currentIndex].offset = isInitial
      ? 0
      : swiperItemsInfo[currentIndex].topMVs.length;
    this.setData({ swiperItemsInfo });
    this.getTopMVData(swiperItemsInfo[currentIndex]);
  },

  // 获取MV数据
  async getTopMVData(itemInfo) {
    // 请求不是第一段数据时，要判断是否越界
    if (itemInfo.offset !== 0 && !itemInfo.hasMore) return;
    this.setData({ canRefreshPage: false });
    const res = await getTopMV(itemInfo);
    // 不越界或者是第一段，则分情况设置数据
    if (itemInfo.offset === 0) {
      itemInfo.topMVs = res.data;
      itemInfo.hasMore = true;
    } else {
      itemInfo.topMVs = [...itemInfo.topMVs, ...res.data];
      itemInfo.hasMore = res.hasMore;
    }
    // 修改data中的swiperItemsInfo后，更新组件高度
    const swiperItemsInfo = this.data.swiperItemsInfo;
    swiperItemsInfo[this.data.currentIndex] = itemInfo;
    this.setData({ swiperItemsInfo });
    this.updateCurrentItemHeight();
    this.setData({ canRefreshPage: true });
  },

  // 更新组件高度
  updateCurrentItemHeight() {
    // 更新高度和当前滚动位置
    const currentIndex = this.data.currentIndex;
    const contentHeights = this.data.contentHeights;
    contentHeights[currentIndex] =
      75 * this.data.swiperItemsInfo[currentIndex].topMVs.length;
    this.setData({ contentHeights });
  },
  // 记录滚动高度
  async setScrollTop(currentIndex) {
    const res = await getSelectorRect(".video-list");
    const scrollTops = this.data.scrollTops;
    scrollTops[currentIndex] = 55 - res.top;
    this.setData({ scrollTops });
  },
});
