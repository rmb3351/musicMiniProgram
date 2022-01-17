import sfRequest from "./index";

export function getPlayingSong(ids) {
  return sfRequest.get("/song/detail", {
    ids,
  });
}

export function getSongLyrics(id) {
  return sfRequest.get("/lyric", {
    id,
  });
}
