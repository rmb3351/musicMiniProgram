// 接口获取方式：
// https://binaryify.github.io/NeteaseCloudMusicApi/#/
// 填你获取的接口值
const BASE_URL = "";

// coderwhy部署好的
const LOGIN_BASE_URL = "";
// 直接获取token，创建实例时传入
const token = wx.getStorageSync("token_key");

// 封装一个基础的网络请求类（simplify request），简化请求
class SFRequest {
  // 创建构造器，以根据不同的baseURL创造不同的实例，下面分别导出
  constructor(baseURL, authHeader) {
    this.baseURL = baseURL;
    // 因为会有大量请求要求携带token，为了避免在不同请求里都要获取token传递进来，这里直接获取
    this.authHeader = authHeader;
  }

  // 发送通用网络请求,返回promise
  request(url, method, data, isAuth = false, header = {}) {
    // 只要需要授权，就把传入的header和已有token的authHeader合并
    const finalHeader = isAuth ? { ...this.authHeader, ...header } : header;
    return new Promise((resolve, reject) => {
      wx.request({
        // 省去传入ip地址的麻烦
        url: this.baseURL + url,
        data,
        method,
        header: finalHeader,
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
  get(url, data, isAuth = false, header) {
    return this.request(url, "GET", data, isAuth, header);
  }
  post(url, data, isAuth = false, header) {
    return this.request(url, "POST", data, isAuth, header);
  }
}
const sfRequest = new SFRequest(BASE_URL);

const sfLoginRequest = new SFRequest(LOGIN_BASE_URL, { token });
// 分别以不同方式暴露实例，方便调用
export default sfRequest;

export { sfLoginRequest };
