<template>
  <header>
    <div class="back" @click="back">
      <i class="icon-left"></i>
    </div>
    <div class="title" @click="clickTitle">{{title}}</div>
    <div class="more" @click="clickMore">
      <i :class="icon"></i>
    </div>
  </header>
</template>

<script>
export default {
  props: ["title", "icon"],
  methods: {
    back() {
      this.$router.back();
    },
    clickMore() {
      this.$emit("clickMore");
    },
    clickTitle() {
      this.$emit("clickTitle");
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
header {
  color: @color-text;
  width: 100%;
  height: 40px;
  position: fixed;
  top: 0;
  z-index: 99;
  .back {
    width: 10%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    float: left;
  }
  .title {
    width: 80%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    float: left;
  }
  .more {
    width: 10%;
    height: 40px;
    line-height: 40px;
    float: left;
    i {
      display: inline-block;
      font-size: 30px;
      margin-top: 5px;
    }
  }
}
</style>
