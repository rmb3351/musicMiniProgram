import sfRequest from "./index";

export function getSearchHotWords() {
  return sfRequest.get("/search/hot");
}

export function getSearchSuggest(keywords) {
  return sfRequest.get("/search/suggest", {
    type: "mobile",
    keywords,
  });
}

export function getSearchResult(keywords) {
  return sfRequest.get("/search", {
    keywords,
  });
}
