// packageDetail/pages/detail-menu/index.js
import { getSongMenuList, getSongMenu } from "../../../service/getMusicData";
Page({
  /**
   * 页面的初始数据
   */
  data: { songMenuList: [] },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSongMenuListDetail();
  },

  async getSongMenuListDetail() {
    const res = await getSongMenuList();
    const tags = res.tags;
    const songMenuList = [];
    const promises = [];
    for (const index in tags) {
      const category = tags[index].name;
      songMenuList[index] = { category, list: [] };
      promises.push(getSongMenu(category));
    }
    Promise.all(promises).then((menuLists) => {
      for (const index in menuLists) {
        const menuList = menuLists[index];
        songMenuList[index].list = menuList.playlists;
        console.log(songMenuList[index].list);
      }
      this.setData({ songMenuList });
    });
  },

  toMenuDetail(e) {
    const id = e.currentTarget.dataset.info.id;
    wx.navigateTo({
      url: `/packageDetail/pages/detail-song/index?id=${id}&type=menu`,
    });
  },
});
