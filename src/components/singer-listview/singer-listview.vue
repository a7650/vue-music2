<template>
  <div class="singer-listview">
    <div class="search-singer" ref="search" :style="searchStyle">
      <input type="text" v-model="searchText" placeholder="搜索歌手">
    </div>
    <scroll
      class="singer-content"
      ref="singerContent"
      @scroll="scroll"
      :listenScroll="true"
      :probeType="3"
    >
      <div>
        <ul class="singerList">
          <li v-for="(singer,index) in filterSingerList" :key="index" @click="selectSinger(singer)">
            <img :src="singer.pic">
            <span>
              {{singer.name}}
              <i class="icon-right"></i>
            </span>
          </li>
        </ul>
      </div>
      <loading v-if="!singerList.length"></loading>
      <div class="tip" v-if="singerList.length">暂无更多</div>
    </scroll>
  </div>
</template>

<script>
import scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import { adaptMiniPlay } from "common/js/mixin";
import { filterArray } from "common/js/tools";
export default {
  mixins: [adaptMiniPlay],
  props: {
    singerList: {
      type: Array
    }
  },
  data() {
    return {
      searchText: "",
      scrollY: 0
    };
  },
  components: {
    scroll,
    loading
  },
  computed: {
    filterSingerList() {
      return filterArray(this.searchText, this.singerList, "name");
    },
    searchStyle() {
      if (this.scrollY < 0 && -this.scrollY < 44) {
        return {
          top: 44 + this.scrollY + "px"
        };
      } else if (-this.scrollY >= 44) {
        return {
          transition: ".2s",
          top: 0,
          boxShadow: "0 0 15px rgba(0,0,0,.2)"
        };
      }
    }
  },
  methods: {
    adaptMiniPlay(playList) {
      let bottom = playList.length > 0 ? "10%" : 0;
      this.$refs.singerContent.$el.style.bottom = bottom;
      this.$refs.singerContent.refresh();
    },
    selectSinger(singer) {
      this.$emit("selectSinger", singer);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";

.singer-listview {
  position: fixed;
  top: 44px;
  bottom: 0;
  width: 100%;
  .singer-content {
    position: absolute;
    top: 37px;
    left: 0;
    bottom: 0;
    right: 0;
    .tip {
      width: 100%;
      height: 25px;
      font-size: @font-size-medium;
      color: @color-text-d;
      position: absolute;
      text-align: center;
      bottom: 0;
      z-index: -99;
    }
  }
  .search-singer {
    padding: 5px 20px;
    background: #fff;
    position: fixed;
    top: 44;
    box-sizing: border-box;
    width: 100%;
    z-index: 99;
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
  }
  .singerList {
    padding: 0 20px;
    background: #fff;
    li {
      margin-bottom: 10px;
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin-right: 15px;
      }
      span {
        flex: 1;
        color: @color-theme;
        .no-wrap;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        i {
          font-size: @font-size-small;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
}
</style>
