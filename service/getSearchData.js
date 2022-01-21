import sfRequest from "./index";

export function getSearchHotWords() {
  return sfRequest.get("/search/hot/detail");
}

export function getSearchSuggest(keywords) {
  return sfRequest.get("/search/suggest", {
    type: "mobile",
    keywords,
  });
}

// limit：每页显示数量、offset：偏移数量（从第几首开始）、type： 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export function getSearchResult({
  keywords,
  limit = 50,
  offset = 0,
  type = 1,
}) {
  return sfRequest.get("/cloudsearch", {
    keywords,
    limit,
    offset,
    type,
  });
}
