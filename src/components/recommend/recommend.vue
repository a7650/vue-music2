<template>
  <div class="recommend" ref="recommend">
    <div class="view-area">
    <transition name="header">
    <div class="header" 
      v-show="!searchShow"
    >为你推荐</div>
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
            <ul>
              <li v-for="(a,index) in albumTitle" :key="index"><span @click="changeAlbumIndex(index)" :class="{active:albumIndex===index}">{{a.item_name | filterTitle}}</span></li>             
            </ul>
          </div>
          <keep-alive><disc v-if="albumIndex===0&&discShow===0" @selectDisc="selectDisc" :discList="discList[0]" :index="albumIndex"></disc></keep-alive>
          <keep-alive><disc v-if="albumIndex===1&&discShow===1" @selectDisc="selectDisc" :discList="discList[1]" :index="albumIndex"></disc></keep-alive>
          <keep-alive><disc v-if="albumIndex===2&&discShow===2" @selectDisc="selectDisc" :discList="discList[2]" :index="albumIndex"></disc></keep-alive>
          <keep-alive><disc v-if="albumIndex===3&&discShow===3" @selectDisc="selectDisc" :discList="discList[3]" :index="albumIndex"></disc></keep-alive>
          <keep-alive><disc v-if="albumIndex===4&&discShow===4" @selectDisc="selectDisc" :discList="discList[4]" :index="albumIndex"></disc></keep-alive>
          <keep-alive><disc v-if="albumIndex===5&&discShow===5" @selectDisc="selectDisc" :discList="discList[5]" :index="albumIndex"></disc></keep-alive>
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
import { getRadioList ,getDistItem,getDiscList} from "api/recommend";
import scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import { adaptMiniPlay } from "common/js/mixin";
import { mapMutations } from "vuex";
import search from "components/search/search";
import disc from "components/disc/disc";

export default {
  mixins: [adaptMiniPlay],
  data() {
    return {
      recommends: [],
      discList: {},
      currentDot: -1,
      searchText: "",
      scrollY: 0,
      searchShow: false,
      albumIndex:0,
      albumTitle:[],
      discShow:""
    };
  },
  filters:{
    filterTitle(val){
      return val.substring(0,2);
    }
  },
  computed: {
    // recommendStyle(){
    //     return {
    //         "top" : `${this.sliderHeight}px`
    //     }
    // },
    // sliderFilter() {
      // if (-this.scrollY > 0 && -this.scrollY < this.sliderHeight) {
      //   let opacity = this.rang(-this.scrollY, this.sliderHeight, 1);
      //   return {
      //     background: `rgba(0,0,0,${opacity})`
      //   };
      // }
      
    // }
  },
  components: {
    slider,
    radio,
    scroll,
    loading,
    search,
    disc
  },
  methods: {
    _getDistItem(){
      getDistItem().then(data => {
        this.albumTitle = data.splice(0,6);
        this.changeAlbumIndex(0);
      })
    },
    changeAlbumIndex(index){
      this.albumIndex = index;
      if(this.discList[index]&&this.discList[index].length){
        this.discShow = index;
        return
      }
      getDiscList(this.albumTitle[index].item_id).then(data => {
        this.discList[index]=data.map(item => {
          let {cover_url_medium,title,tid} = item;
          let l = {
                    imgurl:cover_url_medium,
                    dissname:title,
                    dissid:tid,
                    name:item.creator_info.nick
                  }
          return l;
        })
        this.discShow = index;
      })
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
      if(pos.y<0){
        r.style.boxShadow = "0 -10px 10px rgba(0,0,0,0.2)";
        s.style.zIndex = "0";
        if(-pos.y>78){
          this.$refs.recommend.style.borderTop = "1px solid rgb(221,221,221)"
        }else{
          this.$refs.recommend.style.borderTop = "none"
        }
      }
      else{
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
  bottom: 0; 
  .view-area{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .header{
    color: #000;
    box-sizing: border-box;
    padding-left:10px;
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
      color:#000;
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
    .tags{
      height: 50px;
      position: relative;
      box-sizing: border-box;
      padding-top: 10px;
      width: 100%;
      overflow: hidden;
      .tags-content{
        position: absolute;
        left: 10px;
        right: 10px;
        top: 10px;
        bottom: 0;
      }
      ul{
        width: 100%;
        display: flex;
        li{
          flex: 1;
          span{
            color: #000;
            height: 25px;
            line-height: 25px;
            padding:5px;
            font-size: 14px;
          }
          .active{
              color: #fff;
              background-color: #000;
              border-radius:15px;
            }
        }
      }
    }

  }
}
.header-enter,.header-leave-to{
  margin-top: -40px;
}
.header-enter-active,.header-leave-active{
  transition: .2s;
}
</style>



