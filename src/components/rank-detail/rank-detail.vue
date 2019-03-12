<template>
  <rtol>
    <div class="rank-detail">
      <div class="bg" ref="bg" :style="bgStyle"></div>
      <Header :title="title" :icon="'icon-list'" @clickMore="clickMore" @clickTitle="turnTop"></Header>
      <div class="bar" ref="bar">
        <div class="play" v-if="date">
          <i class="icon-play"></i>
          {{date}}
        </div>
        <div class="comment" v-if="hot">
          <i class="icon-message"></i>
          {{hot}}
        </div>
      </div>
      <div class="scroll-area">
        <scroll
          class="song-content"
          ref="songContent"
          :data="songList"
          @scroll="scroll"
          :listenScroll="true"
          :probeType="3"
        >
          <songList
            ref="songList"
            :songList="songList"
            @selectSong="_selectSong"
            @selectMore="_selectMore"
            :rank="true"
          ></songList>
          <loading v-if="!songList.length" :loadingText="err_message"></loading>
          <filter-bg v-if="songHanders" @click.native="_closeSongHandles('')"></filter-bg>
          <song-handle
            :currentSelect="currentSelect"
            @closeSongHandles="_closeSongHandles"
            v-if="songHanders"
          ></song-handle>
          <Float :float_message="float_message" v-if="float"></Float>
        </scroll>
      </div>
    </div>
  </rtol>
</template>

<script>
import rtol from "base/animation/right-to-left";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getSongList, getComment } from "api/rank";
import { createSong, getSongVkey } from "common/js/song";
import { formateHot } from "common/js/tools";
import Header from "base/header/header";
import scroll from "base/scroll/scroll";
import songList from "base/disc-songlist/disc-songlist";
import { adaptMiniPlay, float } from "common/js/mixin";
import loading from "base/loading/loading";
import songHandle from "base/songHandle/songHandle";
import Float from "base/float/float";
import filterBg from "base/filter-bg/filter-bg";
export default {
  mixins: [adaptMiniPlay, float],
  data() {
    return {
      songList: [],
      hot: "",
      date: "",
      day_of_year: "",
      title: "",
      pic: "",
      err_message: "正在加载",
      songHanders: false,
      currentSelect: null
    };
  },
  computed: {
    bgStyle() {
      return {
        "background-image": `url(${this.pic})`
      };
    },
    ...mapGetters(["singer", "rankBar"])
  },
  components: {
    rtol,
    Header,
    scroll,
    songList,
    loading,
    songHandle,
    Float,
    filterBg
  },
  methods: {
    turnTop() {
      this.$refs.songContent.scrollTo(0, 0, 500);
    },
    clickMore() {
      this.SET_RANKBAR(true);
    },
    adaptMiniPlay(playList) {
      let bottom = playList.length > 0 ? "15%" : 0;
      this.$refs.songContent.$el.style.bottom = bottom;
      this.$refs.songContent.refresh();
    },
    scroll(pos) {
      if (pos.y < 0) {
        this.$refs.songList.$el.style.boxShadow = "0 -10px 10px rgba(0,0,0,.2)";
      }
      if (pos.y >= 0) {
        this.$refs.songList.$el.style.boxShadow = "";
      }
    },
    formateDate(date) {
      if (!date) return;
      let n = date.indexOf("_");
      if (n > -1) {
        return "第" + date.slice(n + 1) + "周";
      }
      return date;
    },
    _getSongList(id = this.singer.id) {
      getSongList(id).then(data => {
        this.title = data.topinfo.ListName;
        this.pic = data.topinfo.pic_v12;
        this.hot = formateHot(data.comment_num);
        this.date = this.formateDate(data.date);
        this.day_of_year = data.day_of_year;
        if (data.songlist.length === 0) {
          this.err_message = "这个榜单好像没有歌曲，去看看别的吧";
          return;
        }
        this.songList = this._encaseSongList(data.songlist);
      });
    },
    _encaseSongList(list) {
      let result = [];
      let len = list.length;
      for (var i = 0; i < len; i++) {
        let item = list[i];
        if (item.data.songid && item.data.songmid) {
          if (this.singer.id === 4) {
            var r = (parseFloat(item.in_count) * 100).toFixed(0) + "%";
          } else {
            var r = parseInt(item.cur_count) - parseInt(item.old_count);
            r = r === 0 ? "-" : r < 0 ? "↑ " + -r : "↓ " + r;
          }
          result.push(createSong(item.data, "", r));
        }
      }
      for (var j = 0; j < len; j++) {
        let item = result[j];
        getSongVkey(item.mid).then(res => {
          let vkey = res.data.items[0].vkey;
          item.url = vkey
            ? `http://dl.stream.qqmusic.qq.com/C400${
                item.mid
              }.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
            : "";
        });
      }
      return result;
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
    ...mapMutations(["SET_RANKBAR"]),
    ...mapActions(["selectSong"])
  },
  watch: {
    $route(to, from) {
      this.err_message = "正在加载";
      this.songList = [];
      this._getSongList(to.params.topid);
    }
  },
  created() {
    this._getSongList();
    // getComment(this.singer.id,1,25);
  },
  mounted() {
    this.bgHeight = this.$refs.bg.clientHeight;
    this.$refs.bar.style.top = this.bgHeight + "px";
    this.$refs.songContent.$el.style.top = `${this.bgHeight - 10}px`;
  }
};
</script>

<style lang="less" scoped>
.rank-detail {
  animation-duration: 0.2s;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
  background: #fff;
}
.bg {
  width: 100%;
  height: 0;
  padding-top: 70%;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
}
.bar {
  width: 100%;
  height: 30px;
  position: absolute;
  line-height: 30px;
  color: #000;
  div {
    display: inline-block;
    width: 50%;
    text-align: center;
    i:nth-child(1) {
      margin-right: 10px;
    }
  }
}
.scroll-area {
  position: absolute;
  top: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  .song-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
