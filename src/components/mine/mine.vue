<template>
    <div class="mine">
        <header>
        <router-link tag="div" class="album" to="/mine/myAlbum" replace="">我的歌单<div class="border1"></div></router-link>
        <router-link tag="div" class="history" to="/mine/playHistory" replace="">最近播放<div class="border2"></div></router-link>
        </header>
        <keep-alive><router-view></router-view></keep-alive>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.mine{
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 0;
    header{
        width: 100%;
        height: 30px;
        position: absolute;
        top: 0;
        display: flex;
        box-sizing: border-box;
        padding: 0 10px;
        .album,.history{
            flex: 1;
            color:rgba(0, 0, 0, .3);
            // background: rgba(0, 0, 0, .1);        
            text-align: center;
            line-height: 30px;
            transition:.3S;
            position: relative;
            overflow: hidden;
            font-size: 15px;
            .border1,.border2{
                transition: .3s;
                 height: 30px;
                 background: #000;
                 width: 100%;
                 position: absolute;
                 bottom: 0;
                 z-index: -99;
                 border-radius: 15px;
            }
            .border1{
                left: 100%;
            }
            .border2{
                right: 100%
            }
       }
       .router-link-active{
           color: #ffffff;
           .border1{
               left: 0;
           }
           .border2{
               right: 0;
           }
       }
    }
}
</style>
