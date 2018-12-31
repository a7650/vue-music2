<template>
  <div>
    <ul>
      <li v-for="(song,index) in playList" :key="index" @click="_selectSong(song,index)">
        <span
          class="song-name"
          :class="{'c-song':(currentSong && song.id === currentSong.id)}"
          v-html="filterCurrent(song.name,{id:[song.id,currentSong.id],mid:[song.mid,currentSong.mid],url:song.url})"
        ></span>
        <span class="singer" v-html="'-'+song.singer"></span>
        <span class="icon">
          <i :class="favoriteIcon(song)" @click.stop="setFavorite(song)"></i>
          <i class="icon-false" @click.stop="deleteSong(index)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
import {isFavorite} from 'common/js/favorite'


export default {
    computed:{

        ...mapGetters([
            "playList",
            "currentIndex",
            "playMode",
            "currentSong",
            "favoriteMid"
        ])
    },
    methods:{
        favoriteIcon(song){
            let mid = this.favoriteMid;
            let m = isFavorite(song.mid);
            return {
                "icon-favorite":m,
                "icon-unfavorite":!m
            }
        },
        setFavorite(song){
            if(!song.url){
                return
            }
            let m = isFavorite(song.mid);
            if(m){
                this.DELETE_FAVORITE(song);
            }else{
                this.ADD_FAVORITE(song);
            }
            this.REFRESH_MYALBUM();
        },
        _selectSong(song,index){
            if(!song.url){
                return
            }
            this.$emit("selectSong",song,index);
        },
        deleteSong(index){
            this.$emit("deleteSong",index);
        },
        ...mapMutations([
            "ADD_FAVORITE",
            "DELETE_FAVORITE",
            "REFRESH_MYALBUM"
        ])
    }
}
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";

ul {
  li {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 5%;
    color: @color-text-d;
    border-bottom: 1px solid rgba(0, 0, 0, .05);
    span {
      box-sizing: border-box;
    }
    .no-wrap;
    .song-name,
    .singer {
      float: left;
      .no-wrap;
    }
    .song-name {
      max-width: 50%;
    }
    .c-song {
      color: rgb(255, 60, 0);
    }
    .singer {
      padding-left: 10px;
      font-size: @font-size-medium;
      color: @color-text-l;
      width: 30%;
    }
    .icon {
      float: right;
      width: 20%;
      i {
        padding: 7px;
        color: @color-text-d;
      }
      .icon-favorite{
          color: red;
      }
    }
  }
}
</style>
