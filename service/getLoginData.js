import sfRequest, { sfLoginRequest } from "./index";

// 调用官方API获取登录code，用于向后端交换token
export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: (res) => {
        const loginCode = res.code;
        resolve(loginCode);
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      },
    });
  });
}
// 让后台转发拼接code的请求，获取Token
export function codeToToken(code) {
  return sfLoginRequest.post("/login", { code });
}

// 检查获取的登录信息是否过期
export function checkToken() {
  return sfLoginRequest.post("/auth", {}, true);
}
export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      },
    });
  });
}

// 获取用户信息
export function getUserInfo() {
  return new Promise((resolve, reject) => {
    // 这个API必须要事件触发才能响应
    wx.getUserProfile({
      desc: "蜜汁描述",
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
