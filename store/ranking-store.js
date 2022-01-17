import { HYEventStore } from "hy-event-store";

import { getRankingInfo } from "../service/getMusicData";
// 用法类似vuex
// 做个映射，好让for循环遍历并给对象添加数据
const rankingMap = {
  0: "newRanking",
  1: "hotRanking",
  2: "originRanking",
  3: "surgeRanking",
};
const rangkingNewIds = [3779629, 3778678, 2884035, 19723756];
const rankingStore = new HYEventStore({
  state: {
    newRanking: {},
    hotRanking: {},
    originRanking: {},
    surgeRanking: {},
  },
  actions: {
    // 0: 新歌榜 1: 热歌榜 2: 原创榜 3: 飙升榜
    getRankingDataActions(context) {
      for (let i = 0; i < 4; i++) {
        getRankingInfo(rangkingNewIds[i]).then((res) => {
          context[rankingMap[i]] = res.playlist;
        });
      }
    },
  },
});

export { rankingStore, rankingMap };
