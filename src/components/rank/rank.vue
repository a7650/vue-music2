<template>
    <div class="rank" ref="rank">
        <scroll :data="topList" class="list-content" ref="listContent">
        <ul class="top-list">
            <li v-for="(item,index) in topList" :key="index" @click="selectList(item,index)">
                <div class="list-icon">
                    <img v-lazy="item.picUrl">
                </div>
                <div class="list-text">
                    <h5 class="title">{{item.topTitle}}</h5>
                    <ul class="song-list">
                        <li v-for="(song,index) in item.songList" :key="index">
                            <p>{{index+1+" " }}{{song.songname}}<span class="singer-name"> - {{song.singername}}</span></p>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <loading v-if="!topList.length"></loading>
        </scroll>
        <router-view></router-view>
        <transition name="sidebar">
        <div class="side-bar" v-if="rankBar">
            <div class="bg" @click="closeBar"></div>
            <div class="bar">
                <header>切换榜单</header>
                <scroll :data="topList" class="list-content">
                <ul>
                    <li v-for="(item,index) in topList" :key="index" :class="{'c-list':currentList===index}" @click="selectList2(item,index)">
                        {{item.topTitle | titleFilter}}
                    </li>
                </ul>
                </scroll>
            </div>
        </div>
        </transition>
    </div>
</template>

<script>
import {getRankList} from 'api/rank'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {adaptMiniPlay} from 'common/js/mixin'
import {mapMutations,mapGetters} from 'vuex'
export default {
    mixins:[adaptMiniPlay],
    data(){
        return{
            topList:[],
            currentList:-1
        }
    },
    computed:{
        ...mapGetters([
            "rankBar"
        ])
    },
    components:{
        scroll,
        loading
    },
    filters:{
        titleFilter(val){
            return val.replace("巅峰榜·","");
        }
    },
    methods:{
        closeBar(){
            this.SET_RANKBAR(false);
        },
        adaptMiniPlay(playList){
            let bottom = playList.length>0 ? "10%" : 0;
            this.$refs.rank.style.bottom = bottom;
            this.$refs.listContent.refresh();
        },
        _getRankList(){
            getRankList().then(data => {
                this.topList=data.topList;
            },err => {
                console.log(err);
            })
        },
        selectList(item,index){
            this.currentList = index;
            this.$router.push({
                    name:"rankDetail",
                    params:{
                        topid:item.id
                    }
                });
            this.SET_SINGER(item);
        },
        selectList2(item,index){
            this.currentList = index;
            this.$router.replace({
                    name:"rankDetail",
                    params:{
                        topid:item.id
                    }
                });
            this.SET_SINGER(item);
            this.SET_RANKBAR(false);
        },
        ...mapMutations([
            "SET_SINGER",
            "SET_RANKBAR"
        ])
    },
    created(){
        this._getRankList();
    }
}
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";
.rank{
    min-width: 200px;
    position: fixed;
    top: 44px;
    bottom: 0;
    width: 100%;
}
.list-content{
    position: relative;
    height: 100%;
    overflow: hidden;
}
.top-list{
    display: flex;
    flex-direction: column;
    &>li{
        margin-top: 10px;
        display: flex;
        box-sizing: border-box;
        padding: 0 10px;
        width: 100%;
    }
    .list-icon{
        flex-basis: 100px;
        img{
            flex-basis: 100px;
            height: 100px;
            width: 100px;
        }
    }
    .list-text{
        flex: 1;
        width:1px;//防止被内容撑开
        height: 100px;
        box-sizing: border-box;
        padding:10px;
        background-color:#fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: @color-theme;
        background: rgb(245, 245, 245);
        box-shadow: 0 0 5px rgba(0, 0, 0, .15);
        .title{
            font-weight: bold;
            .no-wrap;
        }
        .song-list{
            li{
                font-size:15px;
                margin-top: 5px;
                p{
                   .no-wrap;
                    font-size: 80%;
                }
                .singer-name{
                    color:@color-text-d;
                    white-space: nowrap;
                }
            }
        }
    }
}
.side-bar{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99;
    .bg{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .2);
    }
    .bar{
        position: absolute;
        width: 150px;
        top: 0;
        bottom: 0;
        right: 0;
        background: #fff;
        box-shadow: -5px 0 10px rgba(0, 0, 0, .2);
        z-index: 99;
        header{
            width: 100%;
            height: 40px;
            color: #000;
            font-weight: bold;
            font-size: @font-size-large;
            line-height: 40px;
            text-align:center;
        }
        .list-content{
            position: absolute;
            left: 0;
            right: 0;
            top: 40px;
            bottom: 50px;
            overflow: hidden;
        }
        li{
            color: #000;
            width: 100%;
            height: 40px;
            text-align: center;
            line-height: 40px;
        }
        .c-list{
            background: rgba(0, 0, 0, .15);
        }
    }
}
.sidebar-enter,.sidebar-leave-to{
    right: -150px;
    opacity: 0;
}
.sidebar-enter-active,.sidebar-leave-active{
    transition: .3s;
}

</style>


