import { HYEventStore } from "hy-event-store";
import { getPlayingSong, getSongLyrics } from "../service/getPlayData";
import { parseSongLyrics, findCurrentLyricIndex } from "../utils/handleLyrics";

// const inAuCtxt = wx.createInnerAudioContext();
// 沿用老名字可以不用做过多修改
const inAuCtxt = wx.getBackgroundAudioManager();

const playingStore = new HYEventStore({
  state: {
    id: 0,
    playingSongInfo: {},
    durationTime: 0,

    allLyrics: [],
    currentLyricIndex: 0,
    currentTime: 0,

    // 每个数字对应一种播放模式，这里主要是记录
    playingModeIndex: 0,
    // 当前播放歌曲的列表及其下标
    playingSongList: [],
    playingSongIndex: 0,
    // 随机播放历史记录
    // 适配后台播放器
    isPlaying: false,
    isFirstPlaying: true,
    isStopped: false,
  },
  actions: {
    playMusicWithSongIdActions(ctx, { id, replay = false }) {
      // 歌曲相同且不是指定要重播时不用做任何处理
      if (ctx.id === id && !replay) return;

      ctx.id = id;
      ctx.isPlaying = true;
      getPlayingSong(id).then((res) => {
        ctx.playingSongInfo = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
        inAuCtxt.title = ctx.playingSongInfo.name;
      });
      getSongLyrics(id).then((res) => {
        // 获取的歌曲字符串先进行解析，返回记录多少毫秒显示什么的数组
        const allLyrics = parseSongLyrics(res.lrc.lyric);
        ctx.allLyrics = allLyrics;
      });

      inAuCtxt.stop();
      inAuCtxt.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      inAuCtxt.title = id;
      if (ctx.isFirstPlaying) {
        ctx.isFirstPlaying = false;
        // 开启默认播放
        inAuCtxt.autoplay = true;
        // 直接由这里开始dispatch绑定事件的action
        this.dispatch("setupInAuCtxtLsnerActions");
      }
    },

    // 把原来设置音乐上下文和获取当前歌词的功能整合到一起
    setupInAuCtxtLsnerActions(ctx) {
      // 播放时间更新时的回调
      inAuCtxt.onTimeUpdate(() => {
        ctx.currentTime = inAuCtxt.currentTime * 1000;
        // 更新歌词
        const currentIndex = findCurrentLyricIndex(
          ctx.allLyrics,
          ctx.currentTime
        );
        if (ctx.currentLyricIndex !== currentIndex) {
          ctx.currentLyricIndex = currentIndex;
        }
      });
      inAuCtxt.onError((res) => {
        console.log(res);
      });
      // 为了统一后台底部栏和自己写的组件的状态
      inAuCtxt.onPlay(() => {
        ctx.isPlaying = true;
      });
      inAuCtxt.onPause(() => {
        ctx.isPlaying = false;
      });
      inAuCtxt.onStop(() => {
        console.log("stop");
        ctx.isStopped = true;
        ctx.isPlaying = false;
      });
      inAuCtxt.onEnded(() => {
        this.dispatch("changeSongIndexInListAction");
      });
    },
    changePlayingStatusAction(ctx, isPlaying) {
      ctx.isPlaying = isPlaying;
      if (isPlaying && ctx.isStopped) {
        // 防止停止后无法播放的问题
        inAuCtxt.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        inAuCtxt.title = ctx.playingSongInfo.name;
        // 停止位置开始播放
        inAuCtxt.startTime = ctx.currentTime / 1000;
      }
      ctx.isPlaying ? inAuCtxt.play() : inAuCtxt.pause();
      if (ctx.isStopped) ctx.isStopped = false;
    },
    // 切歌时的action
    changeSongIndexInListAction(ctx, type = "next") {
      let index = ctx.playingSongIndex;
      let id = ctx.id;
      // 0:顺序播放、1:随机播放、2:单曲循环
      switch (ctx.playingModeIndex) {
        case 0:
          // 处理越界
          if (type === "next") {
            index = ++index % ctx.playingSongList.length;
          } else {
            if (--index < 0) index = ctx.playingSongList.length - 1;
          }
          break;
        case 1:
          // 避免随机出重复的歌
          while (
            ctx.playingSongList.length !== 1 &&
            index === ctx.playingSongIndex
          ) {
            index = Math.floor(Math.random() * ctx.playingSongList.length);
          }
          break;
        case 2:
          break;
      }
      ctx.playingSongIndex = index;
      id = ctx.playingSongList[index].id;
      this.dispatch("playMusicWithSongIdActions", {
        id,
        replay: true,
      });
    },
  },
});

export { inAuCtxt, playingStore };
