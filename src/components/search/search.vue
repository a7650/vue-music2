<template>
  <transition name="search-content">
    <div class="search-content">
      <div class="bg" @click="closeSearch">
        <div class="tip" v-show="searchList.length">共为您找到{{totalNum}}首歌{{" "+nowNum+"/"+totalNum}}</div>
        <div class="tip" v-show="tip" v-html="tipMessage"></div>
        <div class="back">点击此处返回</div>
      </div>
      <div class="search-detail">
        <transition-group name="hot">
          <div class="hot" v-show="!searchText" key="1">
            <header>热门搜索</header>
            <div class="key">
              <span
                @click="selectHotKey(item.k)"
                v-for="(item,index) in hotKey"
                :key="index"
              >{{item.k}}</span>
            </div>
          </div>
          <div class="search-history" v-if="!searchText&&searchHistory.length" key="2">
            <header>
              <span class="title">搜索历史</span>
              <span class="clear" @click="clearHistory(true)">清除历史</span>
            </header>
            <scroll :data="searchHistory" class="history-content" ref="historyContent">
              <ul>
                <li v-for="(val,index) in searchHistory" :key="index" @click="selectHotKey(val)">
                  <span>{{val}}</span>
                  <i @click.stop="clearHistory(false,index)" class="icon-false"></i>
                </li>
              </ul>
            </scroll>
          </div>
        </transition-group>
        <scroll
          class="song-content"
          :data="searchList"
          :pullUp="pullUp"
          @scrollToEnd="scrollToEnd"
          v-show="searchText"
          ref="songContent"
        >
          <div>
            <songList
              :zhida="zhida"
              :loading="loading"
              v-show="searchList.length>0"
              :songList="searchList"
              :search="false"
              @selectSong="_selectSong"
              @selectZhida="_selectZhida"
              @selectMore="_selectMore"
            ></songList>
          </div>
          <loading v-show="!searchList.length" :loadingText="loadingText"></loading>
        </scroll>
      </div>
      <filter-bg v-if="songHanders" @click.native="_closeSongHandles('')"></filter-bg>
      <song-handle
        :currentSelect="currentSelect"
        @closeSongHandles="_closeSongHandles"
        v-if="songHanders"
      ></song-handle>
      <alert v-if="alert" :message="alertMessage" @alertButton="alertButton" :button="button"></alert>
      <Float :float_message="float_message" v-if="float"></Float>
    </div>
  </transition>
</template>

<script>
import { getHotKey, search } from "api/search";
import songList from "base/song-list/song-list";
import { _encaseSongList } from "common/js/song";
import scroll from "base/scroll/scroll";
import { mapActions, mapGetters } from "vuex";
import { adaptMiniPlay, float } from "common/js/mixin";
import loading from "base/loading/loading";
import alert from "base/alert/alert";
import { mapMutations } from "vuex";
import songHandle from "base/songHandle/songHandle";
import Float from "base/float/float";
import filterBg from "base/filter-bg/filter-bg";
const prePage = 20;
export default {
  mixins: [adaptMiniPlay, float],
  props: ["searchText"],
  data() {
    return {
      zhida: null,
      hotKey: [],
      page: 1,
      searchList: [],
      alert: false,
      alertMessage: "",
      totalNum: 0,
      nowNum: 0,
      loading: false,
      pullUp: true,
      tip: true,
      tipMessage: "",
      loadingText: "",
      button: [],
      songHanders: false,
      currentSelect: null
    };
  },
  computed: {
    otherNum() {
      return this.totalNum - this.nowNum;
    },
    ...mapGetters(["playList", "searchHistory"])
  },
  components: {
    songList,
    scroll,
    loading,
    alert,
    songHandle,
    Float,
    filterBg
  },
  methods: {
    scrollToEnd() {
      this.searchMore();
    },
    adaptMiniPlay(playList) {
      let bottom = playList.length > 0 ? "10%" : 0;
      this.$refs.songContent.$el.style.bottom = bottom;
      this.$refs.songContent.refresh();
      if (this.$refs.historyContent) {
        this.$refs.historyContent.$el.style.bottom = bottom;
        this.$refs.historyContent.refresh();
      }
    },
    closeSearch() {
      this.$emit("closeSearch");
    },
    _getHotKey() {
      getHotKey().then(data => {
        this.hotKey = data.data.hotkey.splice(0, 6);
      });
    },
    _alert(message, button) {
      this.button = ["确定"];
      if (button) {
        this.button = button;
      }
      this.alertMessage = message;
      this.alert = true;
    },
    alertButton(index) {
      switch (index) {
        case 0:
          this.alert = false;
          break;
        case 1:
          this.CLEAR_SEARCHHISTORY({ flag: true }), (this.alert = false);
          break;
        default:
          this.alert = false;
      }
    },
    clearHistory(flag, index) {
      // if(!this.searchHistory.length){
      //   this._alert("这里没有历史纪录");
      //   return;
      // }
      if (flag) {
        this._alert("你将清空所有历史记录", ["取消", "确定"]);
      } else {
        this.CLEAR_SEARCHHISTORY({ flag: false, index });
      }
    },
    selectHotKey(k) {
      this.$emit("selectHotKey", k);
      this.SAVE_SEARCHHISTORY(k);
    },
    _selectZhida(zhida) {
      let singer = {
        id: zhida.singerid,
        mid: zhida.singermid,
        name: zhida.singername,
        pic: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${
          zhida.singermid
        }.jpg?max_age=2592000`
      };
      this.$emit("_selectZhida", singer);
    },
    _selectSong(song, index) {
      if (song.url === "") {
        this._alert("这首歌没有音源,版权方要钱，听听别的吧😁");
        return;
      }
      if (!this.playList.length) {
        this.selectSong({
          list: [song],
          index: 0
        });
        return;
      }
      this.selectSearchSong(song);
    },
    _selectMore(song) {
      if (song.url === "") {
        this._alert("这首歌没有音源,版权方要钱，听听别的吧😁");
        return;
      }
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
    searchMore() {
      if (this.otherNum <= 0) {
        this.loading = false;
        return;
      }
      this.loading = true;
      var n = prePage;
      this.page++;
      if (this.otherNum < 20) {
        n = this.otherNum;
      }
      search(this.searchText, this.page, n).then(data => {
        let newList = _encaseSongList(data.data.song.list);
        this.searchList = this.searchList.concat(newList);
        this.nowNum += n;
      });
    },
    ...mapActions(["selectSong", "selectSearchSong"]),
    ...mapMutations(["SET_SINGER", "SAVE_SEARCHHISTORY", "CLEAR_SEARCHHISTORY"])
  },
  watch: {
    searchText(val) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.totalNum = this.nowNum = 0;
      this.searchList = [];
      this.tipMessage = this.loadingText = "在停止输入0.5s后会自动搜索";
      this.tip = true;
      this.zhida = null;
      if (val === "") {
        return;
      }
      this.page = 1;
      this.timer = setTimeout(() => {
        this.tipMessage = `<i class='icon-search'></i> 正在为您搜索《${
          this.searchText
        }》`;
        this.loadingText = "正在搜索";
        search(this.searchText, this.page, prePage, 1).then(data => {
          let song = data.data.song;
          if (data.code !== 0 || !song.list.length) {
            this.loadingText = this.tipMessage = `搜索不到《${
              this.searchText
            }》,换个试试吧`;
            return;
          }
          this.tip = false;
          this.searchList = _encaseSongList(song.list);
          if (data.data.zhida.type === 2) {
            this.zhida = data.data.zhida;
          }
          this.totalNum = parseInt(song.totalnum);
          this.nowNum = prePage >= this.totalNum ? this.totalNum : prePage;
          this.loading = prePage >= this.totalNum ? false : true;
          this.SAVE_SEARCHHISTORY(val);
        });
      }, 500);
    }
  },
  created() {
    this._getHotKey();
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.search-content {
  position: fixed;
  top: 76px;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  color: #000;
  z-index: 99;
  .bg {
    position: absolute;
    width: 100%;
    height: 40px;
    top: 0;
    div {
      width: 100%;
      height: 15px;
      text-align: center;
    }
    .tip {
      font-size: @font-size-medium;
      color: rgba(0, 0, 0, 1);
      margin-top: 3px;
      .no-wrap();
    }
    .back {
      font-size: @font-size-medium;
      color: rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 5px;
    }
  }
  .search-detail {
    width: 100%;
    position: absolute;
    top: 40px;
    bottom: 0;
    padding: 10px 20px;
    box-sizing: border-box;
    .hot {
      height: 88px;
      header {
        color: @color-text-d;
      }
      .key {
        span {
          display: inline-block;
          margin: 10px 10px 0 0;
          padding: 5px 8px;
          font-size: @font-size-medium;
          color: #000;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 12px;
        }
      }
    }
    .search-history {
      position: absolute;
      top: 88px;
      left: 0;
      right: 0;
      bottom: 0;
      box-sizing: border-box;
      padding: 20px;
      .history-content {
        position: absolute;
        left: 0;
        right: 0;
        top: 50px;
        bottom: 0;
        overflow: hidden;
        padding: 0 20px;
      }
      header {
        width: 100%;
        height: 30px;
        line-height: 30px;
        background: #fff;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        span {
          color: @color-text-d;
          font-size: @font-size-medium;
        }
        .title {
          float: left;
        }
        .clear {
          float: right;
        }
      }
      li {
        width: 100%;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        span {
          float: left;
        }
        i {
          display: inline-block;
          width: 40px;
          height: 40px;
          line-height: 40px;
          float: right;
          text-align: right;
        }
      }
    }
    .song-content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
    }
  }
}
.search-content-enter-active {
  transition: 0.2s;
  transition-delay: 0.1s;
}
.search-content-enter,
.search-content-leave-to {
  opacity: 0;
}

.hot-enter,
.hot-leave-to {
  margin-top: 200px;
  opacity: 0;
}
.hot-enter-active,
.hot-leave-active {
  transition: 0.3s;
}
</style>


