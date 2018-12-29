<template>
  <div class="recommend" ref="recommend">
    <div class="search">
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
    <div v-if="recommends.length" class="slider-wrapper">
      <div class="slider-content" ref="aaa">
        <slider :recommends="recommends" @sliderHeight="_sliderHeight"></slider>
      </div>
    </div>
    <div class="scroll-area" :style="sliderFilter">
      <scroll
        :data="discList"
        class="recommend-content"
        ref="recommendContent"
        @scroll="scroll"
        :listenScroll="true"
        :probeType="3"
      >
        <div class="recommend-songs">
          <h5 v-if="discList.length">热门歌单推荐</h5>
          <ul class="disc-list">
            <li v-for="item in discList" :key="item.listnum" @click="selectDisc(item)">
              <div class="disc-icon">
                <img :src="item.imgurl" alt>
              </div>
              <div class="filter"></div>
              <div class="disc-text">
                <div class="title">{{item.creator.name | _discTitle}}</div>
                <div class="line"></div>
                <div class="text">{{item.dissname}}</div>
              </div>
            </li>
          </ul>
        </div>
      </scroll>
    </div>
    <div class="loading-container" v-if="!discList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import slider from "base/slider/slider";
import radio from "components/radioList";
import { getDiscList, getRadioList } from "api/recommend";
import scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import { adaptMiniPlay } from "common/js/mixin";
import { mapMutations } from "vuex";
import search from "components/search/search";
export default {
  mixins: [adaptMiniPlay],
  data() {
    return {
      radioLists: [],
      recommends: [],
      discList: [],
      currentDot: -1,
      searchText: "",
      sliderHeight: 0,
      scrollY: 0,
      searchShow: false
    };
  },
  computed: {
    // recommendStyle(){
    //     return {
    //         "top" : `${this.sliderHeight}px`
    //     }
    // },
    sliderFilter() {
      if (-this.scrollY > 0 && -this.scrollY < this.sliderHeight) {
        let opacity = this.rang(-this.scrollY, this.sliderHeight, 1);
        return {
          background: `rgba(0,0,0,${opacity})`
        };
      }
    }
  },
  components: {
    slider,
    radio,
    scroll,
    loading,
    search
  },
  methods: {
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
    _getRadioList() {
      getRadioList().then(
        data => {
          this.radioLists = data.radioList;
          this.recommends = data.slider;
        },
        err => {
          console.log(err);
        }
      );
    },
    _getDiscList() {
      getDiscList().then(
        res => {
          this.discList = res;
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
    },
    rang(now, total, max) {
      return Math.min((max * now) / total, max);
    },
    ...mapMutations(["SET_SINGER"])
  },
  filters: {
    _discTitle(val) {
      return val.replace(/QQ|qq|腾讯/, "");
    }
  },
  created() {
    this._getRadioList();
    this._getDiscList();
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";

.recommend {
  position: fixed;
  width: 100%;
  top: 44px;
  bottom: 0; //设置 fixed top bottom 使该元素获得固定的高度
  .search {
    padding: 8px;
    background: @color-theme;
    input {
      width: 100%;
      height: 27px;
      line-height: 27px;
      background: @color-theme-d;
      border-radius: 3px;
      color: @color-text-ll;
      padding: 0 25px;
      box-sizing: border-box;
    }
    .placeholderStyle();
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
  .scroll-area {
    position: fixed;
    top: 87px;
    bottom: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .recommend-content {
    position: absolute; //为了使该元素高度固定，则子元素的高度会大于该元素，就可以用scroll
    bottom: 0;
    width: 100%;
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
    h5 {
      padding: 10px 0;
      color: @color-theme;
    }
    .disc-list {
      padding: 0 10px;
      li {
        width: 100%;
        height: 100px;
        margin-bottom: 20px;
        border-radius: 2px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        .disc-icon {
          width: 100px;
          height: 100%;
          position: absolute;
          right: 0;
          img {
            max-width: 100%;
            height: 100px;
            // filter: blur(5px);
          }
        }
        .disc-text {
          position: absolute;
          width: 50%;
          top: 20px;
          left: 10px;
          color: #000;
          text-align: left;
          .title {
            font-size: @font-size-large;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .line {
            width: 40px;
            height: 4px;
            background-color: #000;
            margin-bottom: 10px;
          }
          .text {
            color: @color-text-d;
            font-size: @font-size-medium;
            .no-wrap();
          }
        }
      }
    }
  }
}
</style>



