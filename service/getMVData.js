import sfRequest from "./index.js"
// 封装所有MV相关网络请求
// 中间层架构，订制一个获取最热MV的请求，最少只需要offset一个参数
export function getTopMV(offset, limit = 20) {
  return sfRequest.get("/top/mv", {
    offset,
    limit
  })
}

export function getMVURLInfo(id) {
  return sfRequest.get("/mv/url", {
    id
  })
}
export function getMVDetails(mvid) {
  return sfRequest.get("/mv/detail", {
    mvid
  })
}
export function getRealatedVideos(id) {
  return sfRequest.get("/related/allVideo", {
    id
  })
}