<template>
  <transition name="first-loading">
    <div class="first-loading">
      <div class="welcome">
        <div class="img">
          <img :src="logoStyle" alt>
        </div>
        <!-- <p class="a">欢迎使用</p> -->
        <p class="b">正在载入资源</p>
        <div class="loading">
          <img src="./loading2.gif" alt>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { getRandom } from "common/js/tools";
export default {
  data() {
    return {
      logo: 1
    };
  },
  computed: {
    logoStyle() {
      return require(`./logo${this.logo}.jpg`);
    }
  },
  methods: {
    setLogo() {
      this.logo = getRandom(1, 6);
    }
  },
  created() {
    this.setLogo();
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable.less";
@import "~common/stylus/mixin.less";
.first-loading {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  z-index: 100;
  .welcome {
    color: #000;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    .img {
      width: 300px;
      height: 150px;
      margin: 0 auto;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .a {
      margin-bottom: 20px;
      font-size: 40px;
    }
    .b {
      color: @color-text-d;
    }
    .loading {
      margin-top: 20px;
      width: 100%;
      height: 30px;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
}
.first-loading-leave-active {
  animation: Fade 0.5s;
}
@keyframes Fade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
</style>
