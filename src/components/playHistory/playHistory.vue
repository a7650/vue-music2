<template>
  <transition name="playH">
    <div class="play-history">
      <scroll :data="songList" ref="songContent" class="song-content">
        <discSongList
          ref="songList"
          :songList="songList"
          @selectSong="_selectSong"
          @selectMore="_selectMore"
        ></discSongList>
        <filter-bg v-if="songHanders" @click.native="_closeSongHandles('')"></filter-bg>
        <song-handle
          :currentSelect="currentSelect"
          @closeSongHandles="_closeSongHandles"
          v-if="songHanders"
        ></song-handle>
        <Float :float_message="float_message" v-if="float"></Float>
      </scroll>
    </div>
  </transition>
</template>

<script>
import discSongList from "base/disc-songlist/disc-songlist";
import { getPlayHistory } from "common/js/cache";
import { mapGetters, mapActions, mapMutations } from "vuex";
import songHandle from "base/songHandle/songHandle";
import Float from "base/float/float";
import filterBg from "base/filter-bg/filter-bg";
import { adaptMiniPlay, float } from "common/js/mixin";
import scroll from "base/scroll/scroll";
import { getLyric } from "common/js/song";
export default {
  mixins: [adaptMiniPlay, float],
  components: {
    discSongList,
    Float,
    scroll,
    songHandle,
    filterBg
  },
  data() {
    return {
      songList: [],
      songHanders: false,
      currentSelect: [],
      songHanders: ""
    };
  },
  methods: {
    adaptMiniPlay(playList) {
      let bottom = playList.length > 0 ? "10%" : 0;
      this.$refs.songContent.$el.style.bottom = bottom;
      this.$refs.songContent.refresh();
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
    _closeSongHandles(val) {
      if (val) {
        this.mixin_float(val);
      }
      this.currentSelect = null;
      this.songHanders = false;
    },
    _getPlayHistory() {
      let allSong = getPlayHistory();
      this.songList = allSong.map(item => {
        item.getLyric = getLyric;
        return item;
      });
    },
    ...mapActions(["selectSong"])
  },
  created() {
    this._getPlayHistory();
  },
  activated() {
    this._getPlayHistory();
  }
};
</script>

<style lang="less" scoped>
.play-history {
  position: fixed;
  top: 74px;
  left: 0;
  bottom: 0;
  right: 0;
  color: #000;
  overflow: hidden;
  .song-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.playH-enter-active,
.playH-leave-active {
  transition: 0.3s;
}
.playH-enter,
.playH-leave-to {
  left: 100%;
  right: -100%;
}
</style>
