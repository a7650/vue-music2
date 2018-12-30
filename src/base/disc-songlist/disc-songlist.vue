<template>
    <div class="list">
        <div class="search">
            <input type="text" v-model="searchText" placeholder="搜索歌曲">
        </div>
        <ul>
            <li v-for="(song,index) in filterList" :class="{'c-song':(currentSong && song.id === currentSong.id),'rank-index':rank,'noUrl':!song.url}" :key="index" @touchstart.once="audioPlay(song)" @click="selectSong(song,index,filterList)">
                <div class="index"><div class="index1">{{index+1}}</div><div class="rank" v-if="rank">{{song.rank}}</div></div>
                <div class="text">
                    <span class="name">{{song.name | filterCurrent(song.id,currentSong.id,song.url)}}</span>
                    <span class="singer">{{song.singer}}-《{{song.album}}》</span>
                </div>
                <i class="icon-more" @click.stop="selectMore(song,index)"></i>
            </li>
        </ul>
    </div>
</template>

<script>
import {filterArray} from 'common/js/tools'
import { mapGetters } from 'vuex'
export default {
    props:{
        songList:{
            type:Array,
            default:[]
        },
        rank:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            searchText:""
        }
    },
    computed:{
        filterList(){
            return filterArray(this.searchText,this.songList,"name")
        },
         ...mapGetters([
            "currentSong",
            "getPlayer",
            "playList"
        ])

    },
    methods:{
        selectSong(song,index,filterList){
            if(!song.url){
                return
            }
            this.$emit("selectSong",song,index,filterList)
        },
        audioPlay(song){
            if(this.playList.length === 0){
                let el = this.getPlayer;
                el.src = song.url;
                el.play();
                el.pause();
            }
        },
        selectMore(song,index){
            if(!song.url){
                return
            }
            this.$emit("selectMore",song,index);
        }
    }

}
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.list{
    background: #fff;
    border-radius: 5px;
}
.search{
    width: 100%;
    height: 45px;
    padding: 10px 20px;
    box-sizing: border-box;
    input::-webkit-input-placeholder {
        color: @color-text-d;
        font-size: @font-size-medium-x;
        text-align: center;
    }
    input{
        width: 100%;
        height: 100%;
        border-radius: 2px;
        background: rgba(0, 0, 0, .07)
    }
}
ul{
    
    li{
        color: black;
        display:flex;
        flex-direction: row;
        align-items: center;
        height: 50px;
        box-sizing: border-box;
        padding-left: 3px;
        // border: 1px solid black;
        &.c-song{
            border-left: 3px solid @color-theme;
            padding: 0;
            background: rgba(0, 0, 0, .05);
        }
        .index{
            width: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            div{
                flex: 1;
            }
            .index1{
                font-size: @font-size-large;
                font-weight:100;
            }
            
            .rank{
                font-size: @font-size-small;
                color: rgba(0, 0, 0, .4)
            }
        }
        .text{
            flex: 1;
            width: 1px;
            display: flex;
            height: 100%;
            justify-content: center;
            flex-direction: column;
            border-bottom: 1px solid rgba(0, 0, 0, .05);
            span{
                .no-wrap();
            }
            .name{
                margin-bottom: 2px;
            }
            .singer{
                margin-top: 2px;
                font-size: @font-size-small;
                color: @color-text-d;
            }
        }
        i{
            display: inline-block;
            width: 40px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            font-size: @font-size-large;
        }
    }
    .rank-index:nth-child(1),.rank-index:nth-child(2),.rank-index:nth-child(3){
        .index1{
            color: rgb(255, 72, 0);
        }
    }
    .noUrl{
            .name,.singer{
                color: rgba(0, 0, 0, 0.3);
            }
        }
}


</style>
