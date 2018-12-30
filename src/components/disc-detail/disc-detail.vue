<template>
    <rtol>
        <div class="disc-detail">
            <div class="bg" :style="bgStyle"></div>
            <div class="filter"></div>
            <header>
               <div class="back" @click = "back"> <i class="icon-left"></i></div>
               <div class="title">歌单</div>
               <div class="more" @click="albumHandle"><i class="icon-more"></i></div>
            </header>
            <div class="scroll-area">
                <div class="text">
                    <div class="logo">
                        <img :src="this.singer.imgurl||this.singer.bgUrl" alt="">
                        <div class="hot">{{hot}}人收听</div>
                    </div>
                    <div class="other">
                        <div class="title">{{title}}</div>
                        <div class="dissname" v-html="dissname"></div>
                        <div class="tags"><span v-for="(tag,index) in tags" :key="index">{{tag.name}}</span></div>
                        <div class="play"><i class="icon-play" @click="randomPlay"></i></div>
                    </div>
                </div>
                <scroll class="desc" ref="desc" :data="desc" v-if="desc[0]">     
                    <p  v-html="this.desc[0]"></p>
                    <img src="./drop.png" alt="">
                </scroll>
                <scroll class="song-content" ref="songContent" :data="songList" @scroll="scroll" :listenScroll="true" :probeType="3">
                    <discSonglist  :songList="songList" @selectMore="_selectMore" @selectSong="_selectSong" ref="disSonglist">
                    </discSonglist>
                    <loading v-if="!songList.length"></loading>
                    <filter-bg v-if="songHandles||collectAlbum" @click.native="_closeSongHandles('')"></filter-bg>
                    <songHandle @closeSongHandles="_closeSongHandles" :currentSelect="currentSelect" v-if="songHandles"></songHandle>
                    <songHandle :othersHander="othersHander" v-if="collectAlbum" @othersHandle="othersHandle"></songHandle>
                </scroll>
            </div>
            <Float v-if="float" :float_message="float_message"></Float>

        </div>
    </rtol>
</template>

<script>
import musicList from 'components/music-list/music-list'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {getDiscSongList} from 'api/recommend'
import {_encaseSongList} from 'common/js/song'
import rtol from 'base/animation/right-to-left'
import scroll from 'base/scroll/scroll'
import discSonglist from 'base/disc-songlist/disc-songlist'
import {adaptMiniPlay,float} from 'common/js/mixin'
import {shuffle} from 'common/js/tools'
import {formateHot} from 'common/js/tools'
import loading from 'base/loading/loading'
import songHandle from 'base/songHandle/songHandle'
import filterBg from 'base/filter-bg/filter-bg'
import Float from 'base/float/float'
import {setCollectAlbum,deleteCollectAlbum,isCollect} from  'common/js/cache'
export default {
    mixins:[adaptMiniPlay,float],
    data(){
        return {
            songList:[],
            title:"",
            desc:[],
            dissname:"",
            tags:[],
            hot:0,
            isCollect:false,
            currentSelect:null,
            songHandles:false,
            collectAlbum:false
        }
    },
    computed:{
        othersHander(){
            if(this.isCollect){
                return [{type:"_deleteAlbum",mes:"取消收藏"},{type:"_close",mes:"取消"}]
            }else{
                return  [{type:"_collectAlbum",mes:"收藏这个歌单"},{type:"_close",mes:"取消"}]
            }
        },
        bgStyle(){
            return {
                "background-image":`url(${this.singer.imgurl||this.singer.bgUrl})`
            }
        },
       ...mapGetters([
            "singer"
        ])
    },
    components:{
        musicList,rtol,scroll,discSonglist,loading,songHandle,filterBg,Float
    },
    methods:{
        _close(){
            this._closeSongHandles();
        },
        _collectAlbum(){
           let m = setCollectAlbum({bgUrl:this.singer.imgurl||this.singer.bgUrl,name:this.singer.name||this.singer.creator.name,dissname:this.singer.dissname,dissid:this.singer.dissid,collectAlbum:true});
           if(m.type===1){
               this.isCollect = true;
               this.REFRESH_COLLECTALBUM();
           }
           this._closeSongHandles(m.mes);
        },
        _deleteAlbum(){
            let m = deleteCollectAlbum(this.singer);
            if(m.type===1){
                this.isCollect=false;
                this.REFRESH_COLLECTALBUM()
            }
           this._closeSongHandles(m.mes);
         
            
        },
        othersHandle(type){
          this[type]();
      },
        albumHandle(){
            this.collectAlbum = true;
        },
        scroll(pos){
            if(pos.y < 0){
                this.$refs.disSonglist.$el.style.boxShadow = "0 -10px 10px rgba(0,0,0,.2)";
            }
            if(pos.y >= 0){
                this.$refs.disSonglist.$el.style.boxShadow = "";
            }
        },
        adaptMiniPlay(playList){
            let bottom = playList.length>0 ? "15%" : 0;
            this.$refs.songContent.$el.style.bottom = bottom;
            this.$refs.songContent.refresh();
        },
        back(){
            this.$router.back();
        },
        
        _getDiscSongList(){
            getDiscSongList(this.singer.dissid).then( data => {
                this.songList = _encaseSongList(data.songlist);
                this.desc[0] = data.desc;
                this.dissname = data.dissname;
                this.title = data.nickname;
                this.tags = data.tags;
                this.hot = formateHot(data.visitnum);
            })
        },
        randomPlay(){
            let randomList = shuffle(this.songList);
            this.selectSong({
                list:randomList,
                index:0
            })
        },
        _selectSong(song,index,filterList){
            this.selectSong({
                list:[...filterList],
                index
            })
        },
        _selectMore(song){
            this.songHandles = true;
            this.currentSelect = song;
        },
        _closeSongHandles(val){
            if(val){
                this.mixin_float(val);
            }
            this.songHandles =false ;
            this.currentSelect = null;
            this.collectAlbum = false;
        },
        ...mapActions([
            "selectSong"
        ]),
        ...mapMutations([
            "REFRESH_COLLECTALBUM"
        ])
    },
    created(){
        this._getDiscSongList();
        this.isCollect = isCollect(this.singer);
    }
}
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";

.disc-detail{
    animation-duration: 0.3s;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @color-background;
    z-index: 99;
    .bg{
        width: 100%;
        height: 0;
        padding-top: 70%;
        background-size: 110%;
        position: fixed;
        top: 0;
        left: 0;
        filter: blur(20px);
    }
    .filter{
        width: 100%;
        height: 0;
        padding-top: 70%;
        background-size: 110%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .7);
    }
    header{
        color: @color-text;
        width: 100%;
        height: 40px;
        position: fixed;
        top: 0;
        z-index: 99;
        .back{
            width:10%;
            height:40px;
            line-height: 40px;
            text-align: center;
            float: left;
        }
        .title{
            width: 80%;
            height: 40px;
            line-height: 40px;
            text-align:center;
            float: left;
        }
        .more{
            width: 10%;
            height: 40px;
            line-height: 40px;
            float: left;
            i{
                font-size: 30px;
            }
        }
    }
    .scroll-area{
        position: fixed;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        padding: 0 20px;
        .text{
            padding: 10px 0;
            display: flex;
            flex-direction: row;
            .logo{
                width: 150px;
                height: 150px;
                position: relative;
                img{
                    width: 100%;
                    height: 100%;
                }
                .hot{
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    position: absolute;
                    bottom: 0;
                    background: rgba(0, 0, 0, .3);
                    color: #fff;
                    font-size: @font-size-medium;
                }
            }
            .other{
                color: #fff;
                max-height: 150px;
                box-sizing: border-box;
                overflow: hidden;
                flex: 1;
                padding: 10px 10px 0 10px;
                display: flex;
                flex-direction: column;
                .title{
                    font-size: @font-size-large;
                    font-weight:600;
                    height: 20px;
                    .no-wrap();
                }
                .dissname{
                    flex: 1;
                    font-size: @font-size-medium;
                    margin-top: 10px;
                }
                .tags{
                    height: 15px;
                    margin-bottom: 15px;
                    line-height: 15px;
                    span{
                        height: 100%;
                        font-size: 13px;
                        display: inline-block;
                        padding:2px;
                        margin-right: 5px;
                        background: #fff;
                        color: @color-text-d;
                        border-radius: 7px;

                    }
                }
                .play{
                    height: 25px;
                    i{
                        font-size: 25px;
                    }
                }

            }
        }
        .desc{
            width: 100%;
            min-height: 50px;
            max-height: 100px;
            background:#fff;
            border-radius: 2px;
            box-shadow: 0 0 7px rgba(0, 0, 0, .3);
            box-sizing: border-box;
            overflow: hidden;
            padding: 10px;
            position: relative;
            p{
                padding: 10px 15px;
                color: @color-text-d;
                font-size: @font-size-medium;
                line-height: 23px;
            }
            img{
                width: 15px;
                height: 30px;
                position: absolute;
                top: 50%;
                right: 7px;
                margin-top: -15px;
            }
        }
        .song-content{
            position: absolute;
            top: 275px;
            bottom: 0;
            left: 0;
            right: 0;
           
        }
    }
}

</style>
