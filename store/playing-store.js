import { HYEventStore } from "hy-event-store";
import { getPlayingSong, getSongLyrics } from "../service/getPlayData";
import { parseSongLyrics, findCurrentLyricIndex } from "../utils/handleLyrics";

const inAuCtxt = wx.createInnerAudioContext();

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
    isPlaying: false,
  },
  actions: {
    playMusicWithSongIdActions(ctx, { id }) {
      ctx.id = id;
      getPlayingSong(id).then((res) => {
        ctx.playingSongInfo = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
      });
      ctx.isPlaying = true;
      getSongLyrics(id).then((res) => {
        // 获取的歌曲字符串先进行解析，返回记录多少毫秒显示什么的数组
        const allLyrics = parseSongLyrics(res.lrc.lyric);
        ctx.allLyrics = allLyrics;
      });

      inAuCtxt.stop();
      inAuCtxt.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      // 开启默认播放
      inAuCtxt.autoplay = true;

      // 直接由这里开始dispatch
      this.dispatch("setupInAuCtxtLsnerActions");
    },

    // 把原来设置音乐上下文和获取当前歌词的功能整合到一起
    setupInAuCtxtLsnerActions(ctx) {
      // inAuCtxt的设置
      inAuCtxt.onCanplay(() => {
        // 防止默认播放失败，解码完毕后手动调用播放
        // inAuCtxt.play();
        console.log("can");
      });
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
      inAuCtxt.onSeeking(() => {
        // 更新歌词
        const currentIndex = findCurrentLyricIndex(
          ctx.allLyrics,
          ctx.currentTime
        );
        if (ctx.currentLyricIndex !== currentIndex) {
          ctx.currentLyricIndex = currentIndex;
        }
      });
      inAuCtxt.onSeeked(() => {
        if (ctx.isPlaying) inAuCtxt.play();
      });
      inAuCtxt.onError((res) => {
        console.log(res);
      });
      inAuCtxt.onPause(() => {
        console.log("pause");
      });
    },
    changePlayingStatusAction(ctx) {
      ctx.isPlaying = !ctx.isPlaying;
      console.log(ctx.isPlaying);
      ctx.isPlaying ? inAuCtxt.play() : inAuCtxt.pause();
    },
  },
});

export { inAuCtxt, playingStore };
