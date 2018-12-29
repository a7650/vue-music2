<template>
<transition name="myalbum">
  <div class="my-album">
    <scroll class="album-content" ref="albumContent">
      <div>
        <div class="my-create-album album">
          <header>我创建的歌单</header>
          <div
            v-for="(item,index) in createAlbum"
            class="album"
            :key="index"
            @click="selectCreateAlbum(item)"
          >
            <img :src="albumBg(item)">
            <div class="desc"><span class="name">{{item.name}}</span><span class="num">{{item.songList.length}}首</span></div>
            <i class="icon-right"></i>
          </div>
        </div>
        <div class="my-collect-album album" v-if="collectAlbum.length">
          <header>我收藏的歌单</header>
          <div
            v-for="(item,index) in collectAlbum"
            class="album"
            :key="index"
            @click="selectCollectAlbum(item)"
          >
            <img :src="albumBg(item)">
            <div class="desc">{{item.name}}</div>
            <i class="icon-right"></i>
          </div>
        </div>
        <div v-for="i in refreshAlbum"></div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
  </transition>
</template>

<script>
import scroll from "base/scroll/scroll";
import { adaptMiniPlay } from "common/js/mixin";
import { getCreateAlbum, getCollectAlbum } from "common/js/cache";
import { mapMutations, mapGetters } from "vuex";
import rtol from "base/animation/right-to-left"

export default {
  mixins: [adaptMiniPlay],
  components: {
    scroll,rtol
  },
  data() {
    return {
      createAlbum: []
    };
  },
  computed: {
    refreshAlbum() {
      var m = this.myAlbum;
      this.createAlbum = getCreateAlbum();
      return m;
    },
    ...mapGetters(["myAlbum", "collectAlbum"])
  },
  methods: {
    adaptMiniPlay(playList) {
      let bottom = playList.length > 0 ? "10%" : 0;
      this.$refs.albumContent.$el.style.bottom = bottom;
      this.$refs.albumContent.refresh();
    },
    albumBg(item) {
      let url = item.bgUrl;
      return url ? url : require("base/album/default.png");
    },
    selectCreateAlbum(item) {
      this.$router.push({
        name: "myAlbumDetail",
        params: {
          id: item.name
        }
      });
    },
    selectCollectAlbum(item) {
      this.$router.push({
        name: "collectAlbumDetail",
        params: {
          id: item.dissid
        }
      });
      this.SET_SINGER(item);
    },
    ...mapMutations(["SET_SINGER"])
  },
  mounted() {
    this.$refs.albumContent.refresh();
  },
  created() {
    this.createAlbum = getCreateAlbum();
  },
  activated() {
    this.createAlbum = getCreateAlbum();
    this.$refs.albumContent.refresh();
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";
.my-album {
  position: fixed;
  top: 74px;
  left: 0;
  bottom: 0;
  right: 0;
  color: #000;
  .album-content {
    position: absolute;
    top: 10px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
  }
  .album {
    width: 100%;
    header {
      width: 100%;
      height: 30px;
      font-size: @font-size-medium;
      background: rgb(239, 239, 239);
      box-sizing: border-box;
      padding-left: 20px;
      line-height: 30px;
      color: rgb(110, 110, 110);
    }
    .album {
      width: 100%;
      height: 50px;
      background: #fff;
      color: #000;
      box-sizing: border-box;
      padding-left: 20px;
      display: flex;
      justify-content: center;
      img {
        width: 45px;
        height: 45px;
        border-radius: 3px;
        margin-right: 15px;
        margin-top: 2px;
      }
      .desc {
        height: 50px;
        flex: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(0, 0, 0, .05);
        .name{
          height: 30px;
          line-height: 30px;
        }
        .num{
          flex: 1;
          font-size:@font-size-medium;
          color: @color-text-d;
        }
      }
      i {
        width: 30px;
        height: 49px;
        text-align: left;
        line-height: 50px;
        border-bottom: 1px solid rgba(0, 0, 0, .05);
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }
  .my-collect-album{
    margin-top: 10px;
    line-height: 50PX;
  }
}
    .myalbum-enter-active,.myalbum-leave-active{
      transition:.3s;
    }
    
    .myalbum-enter,.myalbum-leave-to{
        left: -100%;
        right: 100%;
    }

</style>
