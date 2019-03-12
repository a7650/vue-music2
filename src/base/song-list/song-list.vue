<template>
  <div class="song-list">
    <slot></slot>
    <div v-if="search" class="search">
      <input type="text" v-model="searchText" placeholder="搜索此歌手的歌曲">
    </div>
    <div v-if="zhida" class="zhida" @click="selectZhida">
      <img
        :src="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${zhida.singermid}.jpg?max_age=2592000`"
      >
      <div class="text">
        <span class="name">{{zhida.singername}}</span>
        <div class="desc">单曲:{{zhida.songnum+" "}}专辑:{{zhida.albumnum}}</div>
      </div>
      <i class="icon-right"></i>
    </div>
    <ul>
      <li
        v-for="(song,index) in filterList"
        :class="{'c-song':(currentSong && song.id === currentSong.id),'noUrl':!song.url}"
        :key="index"
        @touchstart.once="audioPlay(song)"
        @click="_selectSong(song,index,filterList)"
      >
        <div class="song-container">
          <div
            class="song-name"
            v-html="filterCurrent(song.name,{id:[song.id,currentSong.id],mid:[song.mid,currentSong.mid],url:song.url})"
          ></div>
          <div class="desc" v-html="_getDesc(song)"></div>
        </div>
        <i class="icon-more" @click.stop="selectMore(song)"></i>
      </li>
    </ul>
    <div class="loading" v-show="loading">
      <loading loadingText></loading>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { filterArray } from "common/js/tools";
import loading from "base/loading/loading";

export default {
  props: {
    songList: {
      type: Array
    },
    search: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    zhida: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      searchText: ""
    };
  },
  components: {
    loading
  },
  computed: {
    filterList() {
      return filterArray(this.searchText, this.songList, "name");
    },
    ...mapGetters(["currentSong", "getPlayer", "playList"])
  },
  methods: {
    _getDesc(song) {
      return `${song.singer} 《${song.album}》`;
    },
    _selectSong(song, index, filterList) {
      if (!song.url) {
        return;
      }
      this.$emit("selectSong", song, index, filterList);
    },
    selectMore(song) {
      if (!song.url) {
        return;
      }
      this.$emit("selectMore", song);
    },
    audioPlay(song) {
      if (this.playList.length === 0) {
        let el = this.getPlayer;
        el.src = song.url;
        el.play();
        el.pause();
      }
    },
    selectZhida() {
      this.$emit("selectZhida", this.zhida);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.song-list {
  background: #fff;
  border: 1px solid transparent;
  .loading {
    width: 100%;
    height: 50px;
    position: relative;
  }
}
.search {
  width: 100%;
  height: 45px;
  padding: 10px 20px;
  box-sizing: border-box;
  input::-webkit-input-placeholder {
    color: @color-text-d;
    font-size: @font-size-medium-x;
    text-align: center;
  }
  input {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    background: rgb(236, 236, 236);
  }
}
.zhida {
  width: 100%;
  padding: 0 20px;
  height: 50px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 20px;
  }
  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    .name,
    .desc {
      height: 15px;
      line-height: 15px;
    }
    .desc {
      font-size: @font-size-medium;
      color: @color-text-d;
      margin-top: 5px;
    }
  }
  i {
    width: 10px;
    color: rgba(0, 0, 0, 0.4);
  }
}
ul {
  li {
    width: 100%;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    &.c-song {
      padding-left: 17px;
      border-left: 3px solid #000;
      background: rgba(0, 0, 0, 0.05);
    }
  }
  .song-container {
    flex: 1;
    width: 1px;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    div {
      height: 25px;
      flex: 1;
      .no-wrap;
      line-height: 25px;
    }
    .song-name {
      color: @color-theme;
    }
    .desc {
      color: @color-text-d;
      font-size: @font-size-medium;
    }
  }
  i {
    width: 40px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: @font-size-large-x;
    color: rgba(0, 0, 0, 0.4);
    margin-right: -20px;
  }
  .noUrl {
    .song-name,
    .desc {
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
