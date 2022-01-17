// 接口获取方式：
https://binaryify.github.io/NeteaseCloudMusicApi/#/
// 填你获取的接口值
const BASE_URL=""
// 封装一个基础的网络请求类（simplify request），简化请求
class SFRequest {
  // 发送通用网络请求,返回promise
  request(url, method, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        // 省去传入ip地址的麻烦
        url: BASE_URL + url,
        data,
        method,
        success: (res) => {
          // 使用时可以简写
          resolve(res.data);
        },
        // 简写
        fail: reject,
      });
    });
  }
  // 分别封装get/post请求，省略method参数，简化
  get(url, data) {
    return this.request(url, "GET", data);
  }
  post(url, data) {
    return this.request(url, "POST", data);
  }
}
const sfRequest = new SFRequest();
// 暴露一个实例，方便调用
export default sfRequest;
