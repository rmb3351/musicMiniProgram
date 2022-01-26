import sfRequest from "./index.js";
export function getSwiperInfo() {
  return sfRequest.get("/banner", {
    // 1安卓2苹果，具体看接口文档
    type: 1,
  });
}
export function getRankingInfo(id) {
  return sfRequest.get("/playlist/detail", {
    id,
  });
}

export function getSongMenu(category = "全部", limit = 12, offset = 0) {
  return sfRequest.get("/top/playlist", {
    // 华语、古风、欧美、流行、默认值：全部
    cat: category,
    limit,
    offset,
  });
}

export function getSongMenuList() {
  return sfRequest.get("/playlist/hot");
}

export function getSongMenuDetail(id) {
  return sfRequest.get("/playlist/detail", {
    id,
  });
}

export function getAlbum(id) {
  return sfRequest.get("/album", {
    id,
  });
}
