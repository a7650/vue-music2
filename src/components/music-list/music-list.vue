<template>
  <div class="music-list">
    <header ref="header">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h5 class="title" v-html="title" @click="turnTop"></h5>
    </header>
    <div class="wrapper" ref="wrapper" :style="wrapperStyle">
      <div class="bg" ref="bg" :style="bgStyle"></div>
      <div class="filter"></div>
    </div>
    <div class="scroll-area">
      <!-- <div class="play" @click="randomPlay" :style="playStyle">
        <i class="icon-play"></i>
      </div>-->
      <scroll
        class="song-content"
        ref="songContent"
        :data="songList"
        @scroll="scroll"
        :listenScroll="true"
        :probeType="3"
        :pullUp="pullUp"
        @scrollToEnd="scrollToEnd"
      >
        <div class="scroll-bg" ref="scrollBg">
          <song-list
            :songList="songList"
            :loading="hasMore"
            @selectSong="_selectSong"
            @selectMore="_selectMore"
          >
            <div class="play" @click="randomPlay">
              <i class="icon-play2"></i>
            </div>
          </song-list>
        </div>
        <loading v-if="!songList.length"></loading>
        <filterBg v-if="songHanders" @click.native="_closeSongHandles('')"></filterBg>
        <songHandle
          :currentSelect="currentSelect"
          v-if="songHanders"
          @closeSongHandles="_closeSongHandles"
        ></songHandle>
      </scroll>
    </div>
    <Float :float_message="float_message" v-if="float"></Float>
  </div>
</template>

<script>
import scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import loading from "base/loading/loading";
import { mapActions } from "vuex";
import { adaptMiniPlay, float } from "common/js/mixin";
import { shuffle } from "common/js/tools";
import songHandle from "base/songHandle/songHandle";
import Float from "base/float/float";
import filterBg from "base/filter-bg/filter-bg";
export default {
  mixins: [adaptMiniPlay, float],
  data() {
    return {
      scrollY: 0,
      bgHeight: 0,
      currentSelect: null,
      songHanders: false,
      pullUp: true
    };
  },
  props: {
    bg: {
      type: String
    },
    title: {
      type: String
    },
    songList: {
      type: Array
    },
    hasMore: {
      default: false
    }
  },
  computed: {
    fbgStyle() {
      return { "background-image": `url(${this.bg})` };
    },
    playStyle() {
      return {
        top: `${this.bgHeight - 70 + this.scrollY}px`
      };
    },
    wrapperStyle() {
      if (this.scrollY > 0) {
        let bgHeight = this.bgHeight + this.scrollY;
        let scale = bgHeight / this.bgHeight;
        return {
          height: `${bgHeight}px`,
          "padding-top": 0
        };
      }
    },
    bgStyle() {
      if (this.scrollY > 0) {
        let bgHeight = this.bgHeight + this.scrollY;
        let scale = bgHeight / this.bgHeight;
        return {
          "background-image": `url(${this.bg})`,
          transform: `scale(${scale},${scale})`
        };
      } else if (this.scrollY < 0) {
        const maxBlur = 30;
        let blur = this.rang(-this.scrollY, this.bgHeight, maxBlur);
        return {
          "background-image": `url(${this.bg})`,
          filter: `blur(${blur}px)`
        };
      } else {
        return {
          "background-image": `url(${this.bg})`
        };
      }
    }
  },
  watch: {},
  components: {
    scroll,
    SongList,
    loading,
    songHandle,
    Float,
    filterBg
  },
  methods: {
    turnTop() {
      this.$refs.songContent.scrollTo(0, 0, 500);
    },
    scrollToEnd() {
      if (this.hasMore) {
        this.$emit("getMore");
      }
    },
    adaptMiniPlay(playingList) {
      let bottom = playingList.length > 0 ? "10%" : 0;
      this.$refs.songContent.$el.style.bottom = bottom;
      this.$refs.songContent.refresh();
    },
    _closeSongHandles(val) {
      if (val) {
        this.mixin_float(val);
      }
      this.currentSelect = null;
      this.songHanders = false;
    },
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _selectSong(song, index, filterList) {
      this.selectSong({
        list: [...filterList],
        index
      });
    },
    _selectMore(song) {
      this.currentSelect = song;
      this.songHanders = true;
    },
    randomPlay() {
      let randomList = shuffle(this.songList);
      this.selectSong({
        list: randomList,
        index: 0
      });
    },
    rang(now, total, max) {
      return Math.min((max * now) / total, max);
    },
    ...mapActions(["selectSong"])
  },
  mounted() {
    this.bgHeight = this.$refs.bg.clientHeight; //减去40是因为header有40px，scroll外部有一个容器，这个容器的顶部为header的底部，scroll是相对于这个容器定位的，所以减去40px，ul就正好在图片的下面
    this.$refs.songContent.$el.style.top = `${this.bgHeight - 40}px`;
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";

.music-list {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  header {
    position: absolute;
    width: 100%;
    height: 40px;
    line-height: 40px;
    z-index: 99;
    font-size: 120%;
    .no-wrap;
  }
  .back {
    float: left;
    width: 10%;
    padding-left: 5px;
    box-sizing: border-box;
  }
  .title {
    float: left;
    width: 80%;
    text-align: center;
    color: @color-text;
    .no-wrap;
  }
  .wrapper {
    width: 100%;
    height: 0;
    padding-top: 70%;
    position: relative;
    .bg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center top;
      transform-origin: top;
      overflow: hidden;
    }
    .filter {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.1);
    }
    .title2 {
      width: 100%;
      font-size: 25px;
      text-align: center;
      position: absolute;
      bottom: 35px;
      font-weight: 100;
    }
  }
  .scroll-area {
    width: 100%;
    position: fixed;
    top: 40px;
    bottom: 0;
    overflow: hidden;
    .play {
      width: 60px;
      height: 60px;
      background-color: #fff;
      border-radius: 30px;
      text-align: center;
      margin: 0 auto;
      margin-top: -50px;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
      i {
        display: inline-block;
        color: #000;
        font-size: 40px;
        margin-top: 10px;
      }
    }
  }
  .song-content {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .scroll-bg {
      background: #fff;
      padding-top: 20px;
      min-height: 100%;
      border-radius: 5px;
    }
  }
}
</style>
