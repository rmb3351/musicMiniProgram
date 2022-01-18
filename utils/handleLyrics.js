// 解析歌词字符串，返回数组记录多少毫秒显示什么歌词内容
export function parseSongLyrics(lyrics) {
  const lyricPattern = /\[(\d{2}):(\d{2}).(\d{2,3})\]/;
  const lyricsArr = lyrics.split("\n");
  const allLyrics = [];
  lyricsArr.forEach((lyricLine) => {
    // 正则总捕获时间和时分秒
    const lineArr = lyricPattern.exec(lyricLine);
    // 匹配出来转换时间和截取歌词
    if (lineArr) {
      const minFormat = lineArr[1] * 60 * 1000;
      const secFormat = lineArr[2] * 1000;
      const thirdFormat =
        lineArr[3].length === 2 ? lineArr[3] * 10 : lineArr[3] * 1;
      const showingTime = minFormat + secFormat + thirdFormat;
      const showingLyric = lyricLine.replace(lineArr[0], "");
      allLyrics.push({ showingTime, showingLyric });
    }
  });
  return allLyrics;
}

export function findCurrentLyricIndex(allLyrics, currentTime) {
  let i = 0;
  // 先找到匹配的时间
  for (; i < allLyrics.length; i++) {
    const lineTime = allLyrics[i].showingTime;
    if (currentTime < lineTime) {
      break;
    }
  }
  // 排除一开始返回-1的情况
  return i - 1 >= 0 ? i - 1 : i;
}
