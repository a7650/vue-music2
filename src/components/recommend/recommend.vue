<template>
  <div class="recommend" ref="recommend">
    <first-loading v-if="firstLoading"></first-loading>
    <!-- v-if="firstLoading" -->
    <div class="view-area">
      <transition name="header">
        <div class="header" v-show="!searchShow">为你推荐</div>
      </transition>
      <div class="search" ref="search1">
        <i class="l icon-search"></i>
        <input
          type="text"
          v-model="searchText"
          placeholder="搜索"
          @click="searchShow=true"
          ref="search"
        >
        <i class="r icon-false" @click="clearSearchText" v-if="searchText"></i>
        <search
          :searchText="searchText"
          v-if="searchShow"
          @closeSearch="searchShow=false;clearSearchText()"
          @selectHotKey="selectHotKey"
          @_selectZhida="selectZhida"
        ></search>
      </div>
      <scroll
        class="recommend-content"
        ref="recommendContent"
        @scroll="scroll"
        :listenScroll="true"
        :probeType="3"
      >
        <div class="recommend-songs" ref="recommendSongs">
          <div class="tags">
            <scroll class="tags-content" :data="albumTitle" :scrollX="scrollX" :bounce="!scrollX">
              <ul>
                <li v-for="(a,index) in albumTitle" :key="index">
                  <div
                    @click="changeAlbumIndex(index)"
                    :class="{active:albumIndex===index}"
                  >{{a.item_name | filterTitle}}</div>
                </li>
              </ul>
            </scroll>
          </div>
          <keep-alive>
            <disc
              v-if="albumIndex===0&&discShow===0"
              @selectDisc="selectDisc"
              :discList="discList[0]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===1&&discShow===1"
              @selectDisc="selectDisc"
              :discList="discList[1]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===2&&discShow===2"
              @selectDisc="selectDisc"
              :discList="discList[2]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===3&&discShow===3"
              @selectDisc="selectDisc"
              :discList="discList[3]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===4&&discShow===4"
              @selectDisc="selectDisc"
              :discList="discList[4]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===5&&discShow===5"
              @selectDisc="selectDisc"
              :discList="discList[5]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===6&&discShow===6"
              @selectDisc="selectDisc"
              :discList="discList[6]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===7&&discShow===7"
              @selectDisc="selectDisc"
              :discList="discList[7]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===8&&discShow===8"
              @selectDisc="selectDisc"
              :discList="discList[8]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===9&&discShow===9"
              @selectDisc="selectDisc"
              :discList="discList[9]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===10&&discShow===10"
              @selectDisc="selectDisc"
              :discList="discList[10]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===11&&discShow===11"
              @selectDisc="selectDisc"
              :discList="discList[11]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===12&&discShow===12"
              @selectDisc="selectDisc"
              :discList="discList[12]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===13&&discShow===13"
              @selectDisc="selectDisc"
              :discList="discList[13]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
          <keep-alive>
            <disc
              v-if="albumIndex===14&&discShow===14"
              @selectDisc="selectDisc"
              :discList="discList[14]"
              :index="albumIndex"
            ></disc>
          </keep-alive>
        </div>
      </scroll>
      <div class="loading-container" v-if="albumIndex!==discShow">
        <loading></loading>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import slider from "base/slider/slider";
import radio from "components/radioList";
import { getRadioList, getDistItem, getDiscList } from "api/recommend";
import scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import { adaptMiniPlay } from "common/js/mixin";
import { mapMutations } from "vuex";
import search from "components/search/search";
import disc from "components/disc/disc";
import firstLoading from "base/loading/first-loading";
export default {
  mixins: [adaptMiniPlay],
  data() {
    return {
      recommends: [],
      discList: {},
      currentDot: -1,
      searchText: "",
      scrollY: 0,
      scrollX: true,
      searchShow: false,
      albumIndex: 0,
      albumTitle: [],
      discShow: "",
      firstLoading: true
    };
  },
  filters: {
    filterTitle(val) {
      return val.substring(0, 2);
    }
  },
  components: {
    slider,
    radio,
    scroll,
    loading,
    search,
    disc,
    firstLoading
  },
  methods: {
    _getDistItem() {
      getDistItem().then(data => {
        this.albumTitle = data.splice(0, 15);
        this.changeAlbumIndex(0);
      });
    },
    changeAlbumIndex(index) {
      this.albumIndex = index;
      if (this.discList[index] && this.discList[index].length) {
        this.discShow = index;
        return;
      }
      getDiscList(this.albumTitle[index].item_id).then(data => {
        this.discList[index] = data.map(item => {
          let { cover_url_medium, title, tid } = item;
          let l = {
            imgurl: cover_url_medium,
            dissname: title,
            dissid: tid,
            name: item.creator_info.nick
          };
          return l;
        });
        this.discShow = index;
        if (this.firstLoading) {
          this.firstLoading = false;
        }
      });
    },
    selectHotKey(k) {
      this.searchText = k;
    },
    selectZhida(singer) {
      this.$router.push({
        name: "zhidaDetail",
        params: {
          id: singer.id
        }
      });
      this.SET_SINGER(singer);
    },
    clearSearchText() {
      this.searchText = "";
      if (this.searchShow) {
        this.$refs.search.focus();
      }
    },
    adaptMiniPlay(playList) {
      let bottom = playList.length > 0 ? "15%" : 0;
      this.$refs.recommendContent.$el.style.bottom = bottom;
      this.$refs.recommendContent.refresh();
    },
    _sliderHeight(x) {
      this.sliderHeight = x;
      this.$refs.recommendContent.$el.style.top = x + "px";
      this.$refs.recommendContent.refresh();
    },
    _getDiscList() {
      getDiscList().then(
        res => {
          this.discList.push(res);
        },
        err => {
          console.log(err);
        }
      );
    },
    selectDisc(item) {
      this.$router.push({
        name: "discDetail",
        params: {
          id: item.dissid
        }
      });
      this.SET_SINGER(item);
    },
    scroll(pos) {
      this.scrollY = parseInt(pos.y);
      let r = this.$refs.recommendSongs;
      let s = this.$refs.search;
      if (pos.y < 0) {
        r.style.boxShadow = "0 -7px 10px rgba(0,0,0,0.1)";
        s.style.zIndex = "0";
        if (-pos.y > 78) {
          this.$refs.recommend.style.borderTop = "1px solid rgb(221,221,221)";
        } else {
          this.$refs.recommend.style.borderTop = "none";
        }
      } else {
        r.style.boxShadow = "none";
        s.style.zIndex = "99";
      }
    },
    rang(now, total, max) {
      return Math.min((max * now) / total, max);
    },
    ...mapMutations(["SET_SINGER"])
  },
  created() {
    this._getDistItem();
  }
};
</script>
<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";
.recommend {
  position: fixed;
  width: 100%;
  top: 44px;
  bottom: 0;
  .view-area {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
  }
  .header {
    color: #000;
    box-sizing: border-box;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    font-size: @font-size-large-x;
  }
  .search {
    padding: 5px 10px;
    position: relative;
    input {
      width: 100%;
      height: 27px;
      line-height: 27px;
      background: rgb(236, 236, 236);
      border-radius: 3px;
      color: #000;
      padding: 0 25px;
      box-sizing: border-box;
    }
    input::-webkit-input-placeholder {
      color: @color-text-d;
      font-size: @font-size-medium;
      text-align: center;
    }
    i {
      display: inline-block;
      width: 27px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: @color-text-d;
      &.l {
        margin-right: -27px;
        position: relative;
      }
      &.r {
        margin-left: -27px;
      }
    }
  }
  .recommend-content {
    position: absolute; //为了使该元素高度固定，则子元素的高度会大于该元素，就可以用scroll
    bottom: 0;
    width: 100%;
    top: 77px;
  }
  .slider-content {
    width: 100%;
    .tip {
      width: 100%;
      text-align: center;
      padding: 10px 0;
      color: @color-background-d;
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  .recommend-songs {
    text-align: center;
    background: @color-background;
    border-radius: 5px;
    .tags {
      height: 50px;
      position: relative;
      box-sizing: border-box;
      padding-top: 10px;
      width: 100%;
      .tags-content {
        position: absolute;
        left: 10px;
        right: 10px;
        top: 10px;
        bottom: 0;
        overflow: hidden;
      }
      ul {
        white-space: nowrap;
        width: 750px;
        overflow: auto;
        li {
          float: left;
          margin-right: 10px;
          div {
            color: #000;
            height: 25px;
            width: 40px;
            text-align: center;
            box-sizing: border-box;
            line-height: 25px;
            padding: 0 5px;
            font-size: 14px;
          }
          .active {
            color: #fff;
            background-color: #000;
            border-radius: 15px;
          }
        }
      }
    }
  }
}
.header-enter,
.header-leave-to {
  margin-top: -40px;
}
.header-enter-active,
.header-leave-active {
  transition: 0.2s;
}
</style>



