<template>
  <rtol>
    <div class="create-album-detail">
        <Header icon="icon-more" :title="this.name" @clickMore="clickMore"></Header>
        <Album :songList="songList" :name="name" :bgUrl="bgUrl" :desc="desc" @_selectMore="selectMore"></album>
        <transition name="editAlbum">
        <div v-if="editAlbum" class="edit-album">
            <header><i class="icon-left" @click="closeEdit"></i><h5>编辑歌单</h5><span @click="saveEdit">保存</span></header>
            <div class="name">名称<input type="tetx" v-model="name2"></div>
            <div class="desc">简介<textarea v-model="desc"></textarea></div>
        </div>
        </transition>
        <filter-bg v-if="songHanders||albumHanders" @click.native="closeHanders"></filter-bg>
        <float v-if="float" :float_message="float_message"></float>
        <song-handle :othersHander="othersHander" v-if="songHanders" @othersHandle="othersHandle"></song-handle>
        <song-handle :othersHander="albumHander" v-if="albumHanders" @othersHandle="othersHandle"></song-handle>
        <alert v-if="alert" :message="alertMessage" :button="alertButton" @alertButton="selectAlert"></alert>
    </div>
  </rtol>
</template>

<script>
import rtol from "base/animation/right-to-left"
import {getCreateAlbum,deleteFromAlbum,editAlbum} from 'common/js/cache'
import Header from 'base/header/header'
import Album from 'base/album/album'
import {getLyric} from 'common/js/song'
import Float from 'base/float/float'
import filterBg from 'base/filter-bg/filter-bg'
import songHandle from 'base/songHandle/songHandle'
import {mapMutations} from "vuex"
import {float } from "common/js/mixin"
import alert from 'base/alert/alert'
import {deleteAlbum} from 'common/js/cache'
export default {
    mixins: [float],
    data(){
        return{
            songHanders:false,
            selectSong:null,
            selectIndex:-1,
            songList:[],
            name:"",
            name2:"",
            bgImg:"",
            desc:"",
            othersHander:[
                {type:"_delete",mes:"从歌单中删除"},
                {type:"_nextPlay",mes:"下一首播放"},
                {type:"_close",mes:"取消"}
            ],
            albumHander:[
                {type:"_editAlbum",mes:"编辑歌单"},
                {type:"_deleteAlbum",mes:"删除歌单"},
                {type:"_close",mes:"取消"}
            ],
            albumHanders:false,
            alertMessage:"",
            alertButton:[],
            alert:false,
            editAlbum:false
        }
    },
  components: {
    rtol,Header,Album,Float,songHandle,filterBg,alert
  },
  methods:{
      saveEdit(){
          if(this.name==="我的收藏"&&this.name2!=="我的收藏"){
              this.mixin_float("默认歌单无法更改名称<br>你可以更改简介")
              return
          }
          let m = editAlbum(this.name,this.name2,this.desc);
          if(m.type===1){
              this.editAlbum = false;
              this.name = this.name2;
              this.REFRESH_MYALBUM();
          }
          else{
              this.mixin_float(m.mes);
          }

      },
      closeEdit(){
          this.editAlbum = false;
      },
      _alert(mes,button){
          this.alertMessage = mes;
          this.alertButton = button;
          this.alert = true;
      },
      selectAlert(index){
          if(index === 0){
              this.alert = false;
              this.closeHanders();
          }
          if(index === 1){
            this.alert = false;
            this.closeHanders();
            let m = deleteAlbum(this.name)
            this.mixin_float(m.mes);      
            if(m.type === 1){
                this.REFRESH_MYALBUM();
            }
        }
      },
      _editAlbum(){
          this.editAlbum = true;
          this.closeHanders();
      },
      _deleteAlbum(){
          this._alert("确定删除吗",["取消","确定"]);
      },
      clickMore(){
          this.albumHanders = true;
      },
      _getCreateAlbum(){
          let album = getCreateAlbum(this.name);
          if(album.songList.length){
              this.songList = album.songList.map(item=>{
               item.getLyric=getLyric;
               return item;
              });
          }
          this.name = album.name;
          this.bgUrl = album.bgUrl;
          this.desc = album.desc;
      },
      closeHanders(){
          this.songHanders = false;
          this.selectSong = null;
          this.selectIndex = -1;
          this.albumHanders = false;
      },
      selectMore(song,index){
          this.songHanders = true;
          this.selectIndex = index;
          this.selectSong = song;
      },
      othersHandle(type){
          this[type]();
      },
      _delete(){
          let m = deleteFromAlbum(this.name,this.selectSong);
          this.mixin_float(m.mes);
          if(m.type === 1){
              this.songList.splice(this.selectIndex,1);
          }
          this.closeHanders();

      },
     _nextPlay(){
          this.NEXT_PLAY(this.selectSong);
          this.mixin_float("已添加到下一首播放队列");
          this.closeHanders();
      },
      _close(){
          this.closeHanders();
      },
      ...mapMutations(["NEXT_PLAY","REFRESH_MYALBUM"])
  },
  created(){
      this.name = this.$route.params.id;
      this.name2 = this.$route.params.id;
      this._getCreateAlbum()
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";
.create-album-detail {
  animation-duration: .3s;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  color: #000;
}
.edit-album{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    color: #000;
    header{
        height: 40px;
        line-height: 40px;
        z-index: 99;
        position: relative;
        i{
            display: inline-block;
            width: 20%;
            height: 100%;
            line-height: 40px;
            float: left;
            box-sizing: border-box;
            padding-left: 10px;
            text-align: left;
            font-size: 18px;
        }
        h5{
            width: 60%;
            text-align: center;
            float: left;
        }
        span{
            width: 20%;
            float: left;
            text-align: center;

        }
    }
    .name{
        margin-top: 30px;
        height: 40px;
        line-height: 40px;
        width: 100%;
        display: flex;
        padding-left: 20px;
        box-sizing: border-box;
        input{
            flex: 1;
            margin-left: 20px;
            margin-right: 20px;
            height: 40px;
            line-height: 40px;
            border: none;
            color: @color-text-d;
            border-bottom: 1px solid rgba(0, 0, 0, .1);
        }
    }
    .desc{
        padding-left: 20px;
        box-sizing: border-box;
        display: flex;
        margin-top: 30px;
        textarea{
            flex: 1;
            height: 200px;
            margin-left: 20px;
            margin-right: 20px;
            border: 1px solid rgba(0, 0, 0, .2);
            resize: none;
            color: @color-text-d;
            font-size: @font-size-medium-x;
        }
    }
}

.editAlbum-enter-active,.editAlbum-leave-active{
    transition: .3s;
}
.editAlbum-enter,.editAlbum-leave-to{
    left: 100%;
    right: -100%;
}
</style>
