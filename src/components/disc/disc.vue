<template>
  <ul class="disc-list">
    <li v-for="(item,index) in discList" :key="index" @click="selectDisc(item)">
      <div class="disc-icon">
        <img v-lazy="item.imgurl" alt>
      </div>
      <div class="filter"></div>
      <div class="disc-text">
        <div class="title">{{item.name | _discTitle}}</div>
        <div class="line"></div>
        <div class="text">{{item.dissname}}</div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    discList: {
      default() {
        return [];
      }
    },
    index: {
      default: 0
    }
  },
  filters: {
    _discTitle(val) {
      return val.replace(/QQ|qq|腾讯/, "");
    }
  },
  methods: {
    selectDisc(item) {
      this.$emit("selectDisc", item);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";
.disc-list {
  padding: 0 10px;
  li {
    width: 100%;
    height: 100px;
    margin-bottom: 20px;
    border-radius: 2px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    .disc-icon {
      width: 100px;
      height: 100%;
      position: absolute;
      right: 0;
      img {
        max-width: 100%;
        height: 100px;
        // filter: blur(5px);
      }
    }
    .disc-text {
      position: absolute;
      width: 50%;
      top: 20px;
      left: 10px;
      color: #000;
      text-align: left;
      .title {
        font-size: @font-size-large;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .line {
        width: 40px;
        height: 4px;
        background-color: #000;
        margin-bottom: 10px;
      }
      .text {
        color: @color-text-d;
        font-size: @font-size-medium;
        .no-wrap();
      }
    }
  }
}
</style>
