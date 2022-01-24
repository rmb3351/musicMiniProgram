import sfRequest from "./index.js";
// 封装所有MV相关网络请求
// 中间层架构，订制一个获取最热MV的请求，最少只需要offset一个参数
export function getTopMV(itemInfo) {
  let { offset, limit, area } = itemInfo;
  if (!limit) limit = 20;
  return sfRequest.get("/mv/all", {
    offset,
    limit,
    // 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
    area,
  });
}

export function getMVURLInfo(id) {
  return sfRequest.get("/mv/url", {
    id,
  });
}
export function getMVDetails(mvid) {
  return sfRequest.get("/mv/detail", {
    mvid,
  });
}
export function getRealatedVideos(id) {
  return sfRequest.get("/related/allVideo", {
    id,
  });
}
