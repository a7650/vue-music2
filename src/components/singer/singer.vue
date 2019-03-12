<template>
  <div class="singer">
    <singerListview :singerList="singerList" @selectSinger="selectSinger"></singerListview>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer";
import singerListview from "components/singer-listview/singer-listview";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      singerList: []
    };
  },
  components: {
    singerListview
  },
  methods: {
    _getSingerList() {
      getSingerList().then(data => {
        let singerList = []; //官方返回的数据中 l为小写
        data.singerlist.forEach(item => {
          singerList.push({
            id: item.singer_id,
            mid: item.singer_mid,
            name: item.singer_name,
            pic: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${
              item.singer_mid
            }.jpg?max_age=2592000`
          });
        });
        this.singerList = singerList;
      });
    },
    selectSinger(singer) {
      this.$router.push({
        name: "singerDetail",
        params: {
          id: singer.id
        }
      });
      this.setSinger(singer);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  created() {
    this._getSingerList();
  }
};
</script>

<style lang="less" scoped>
.singer {
  background: #fff;
  width: 100%;
  position: absolute;
  top: 44px;
  bottom: 0;
}
</style>


