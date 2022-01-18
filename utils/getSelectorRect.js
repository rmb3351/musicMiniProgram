export default function (selector) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select(selector).boundingClientRect();
    // query.selectViewport().scrollOffset()
    // 简写：query.exec(resolve)
    query.exec((res) => {
      resolve(res[0]);
    });
  });
}
