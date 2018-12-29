<template>
    <rtol>
        <music-list :title="singer.name" :bg="singer.pic" :songList="songList"  class="singer-detail"></music-list>
    </rtol>
</template>


<script>
import rtol from 'base/animation/right-to-left'
import scroll from 'base/scroll/scroll'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/singer'
import {_encaseSongList} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
    data(){
        return {
            songList:[]
        }
    },
    computed:{
        ...mapGetters([
            'singer'
        ])
    },
    methods:{
        _getSongList(){
            getSongList(this.singer.mid,0,30).then( data => {
                this.songList = _encaseSongList(data.list,"musicData");
            })
        }
    },
    components:{
        rtol,scroll,MusicList
    },
    created(){
        this._getSongList();
    }


}

</script>



<style lang="less" scoped>
@import "~common/stylus/variable.less";

    .singer-detail{
        z-index: 100;
        animation-duration: 0.3s;
    }
</style>

