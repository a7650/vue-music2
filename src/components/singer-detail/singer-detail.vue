<template>
  <rtol>
    <music-list
      :title="singer.name"
      :bg="singer.pic"
      :songList="songList"
      class="singer-detail"
      :hasMore="hasMore"
      @getMore="_getMore"
    ></music-list>
  </rtol>
</template>


<script>
import rtol from "base/animation/right-to-left";
import scroll from "base/scroll/scroll";
import { mapGetters } from "vuex";
import { getSongList } from "api/singer";
import { _encaseSongList } from "common/js/song";
import MusicList from "components/music-list/music-list";

const unitSongs = 30;
export default {
  data() {
    return {
      songList: [],
      total: 0,
      page: 1,
      nowNum: 0
    };
  },
  computed: {
    hasMore() {
      return this.nowNum < this.total;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    _getSongList() {
      getSongList(this.singer.mid, 0, unitSongs).then(data => {
        this.total = data.total;
        this.nowNum = unitSongs;
        this.songList = _encaseSongList(data.list, "musicData");
      });
    },
    _getMore() {
      getSongList(this.singer.mid, this.nowNum, unitSongs).then(data => {
        this.page++;
        this.nowNum += unitSongs;
        let newList = _encaseSongList(data.list, "musicData");
        this.songList = this.songList.concat(newList);
      });
    }
  },
  components: {
    rtol,
    scroll,
    MusicList
  },
  created() {
    this._getSongList();
  }
};
</script>



<style lang="less" scoped>
@import "~common/stylus/variable.less";

.singer-detail {
  z-index: 100;
  animation-duration: 0.2s;
}
</style>

