// pages/detail-search/index.js
import {
  getSearchHotWords,
  getSearchSuggest,
  getSearchResult,
} from "../../../service/getSearchData";
import debounce from "../../../utils/debounce";
import strToNodes from "../../../utils/str2Nodes";
import { playingStore } from "../../../store/index";
// 获取防抖处理后的请求函数
const debounceGetSearchSuggest = debounce(getSearchSuggest, 300);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    searchContent: "",
    suggestSongs: [],
    // 里面的每个元素是一个富文本的nodes数组
    suggestSongNodes: [],
    searchResults: [],
    // 展示建议的逻辑不好判断，直接加data
    showSuggestion: false,
    // 下拉加载更多相关功能的数据
    canReachBottom: true,
    resultsOffset: 0,
    resultsLimit: 50,
    resultsCount: 51,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getSearchHotWords().then((res) => {
      this.setData({ hotKeywords: res.data });
    });
  },
  // 监听事件
  handleChanged(e) {
    this.setData({ searchContent: e.detail });
    if (!this.data.searchContent.length) {
      // 没有搜索内容时不仅不展示，还要把延后的防抖计时器取消
      this.setData({ showSuggestion: false });
      debounceGetSearchSuggest.cancel();
      return;
    }
    this.setData({ showSuggestion: true });
    debounceGetSearchSuggest(this.data.searchContent).then((res) => {
      // 没有结果弹出，防止后面对null进行map报错
      if (!res.result.allMatch) return;
      this.setData({ suggestSongs: res.result.allMatch });
      // 当前输入匹配的所有关键词数组
      const suggestKeywords = this.data.suggestSongs.map(
        (item) => item.keyword
      );
      const suggestSongNodes = [];
      for (const keyword of suggestKeywords) {
        // 传入关键词数组里的某个关键词和当前输入内容，返回对应的富文本的nodes数组
        const nodes = strToNodes(keyword, this.data.searchContent);
        suggestSongNodes.push(nodes);
      }
      this.setData({ suggestSongNodes });
    });
  },
  // 下拉加载更多
  onReachBottom() {
    if (this.data.canReachBottom) this.handleSearched(true);
  },
  // 搜索
  async handleSearched(isBottom = false) {
    this.checkBeforeSearch(isBottom);
    this.setData({ showSuggestion: false });

    if (this.data.resultsLimit < 1) return;
    const keywords = this.data.searchContent;
    const limit = this.data.resultsLimit;
    const offset = this.data.resultsOffset;
    const res = await getSearchResult({ keywords, offset, limit });
    const resultsCount = res.result.songCount;
    this.setData({
      searchResults: [...this.data.searchResults, ...res.result.songs],
      resultsCount,
    });
    // 还可以请求下一次
    if (resultsCount > offset) {
      this.setData({ canReachBottom: true });
    }
  },
  // 搜索之前的判断处理
  checkBeforeSearch(isBottom) {
    // 设置偏移位置，禁止下拉
    if (isBottom === true) {
      this.setData({
        resultsOffset: this.data.resultsOffset + this.data.resultsLimit,
        canReachBottom: false,
      });
      // 不够50首时按剩余的结果数量请求
      if (
        this.data.resultsCount <
        this.data.resultsOffset + this.data.resultsLimit
      ) {
        this.setData({
          resultsLimit: this.data.resultsCount - this.data.resultsOffset,
        });
      }
    } else {
      // 不是下拉则初始化
      this.setData({
        searchResults: [],
        resultsOffset: 0,
        canReachBottom: true,
        resultsLimit: 50,
      });
    }
  },

  // 给热门搜索和搜索建议添加同名自定义属性，事件对象传关键词即可合并处理两个关键词点击的搜索，再根据关键词修改搜索内容，即可调用handleSearched
  handleKeywordClick(e) {
    this.setData({ searchContent: e.currentTarget.dataset.keyword });
    this.handleSearched();
  },
  handleSongMenuItemClick(e) {
    playingStore.setState("playingSongList", this.data.searchResults);
    playingStore.setState("playingSongIndex", e.currentTarget.dataset.index);
  },
});
