<template>
  <transition name="alert">
    <div class="alert">
      <div class="message">
        <p>{{message}}</p>
      </div>
      <div class="button">
        <span v-for="(item,index) in button" :key="index" @click="alertButton(index)">{{item}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ""
    },
    button: {
      type: Array,
      default() {
        return ["确认"];
      }
    }
  },
  methods: {
    alertButton(index) {
      this.$emit("alertButton", index);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.alert {
  // animation-duration: .3s;
  width: 240px;
  height: 120px;
  background: #fff;
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -120px;
  margin-top: -60px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  .message {
    width: 100%;
    height: 85px;
    display: flex;
    padding: 5px 15px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    p {
      text-align: center;
    }
  }
  .button {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    width: 100%;
    height: 35px;
    position: absolute;
    bottom: 0;
    span {
      flex: 1;
      height: 35px;
      line-height: 35px;
      text-align: center;
      &:nth-child(2) {
        border-left: 1px solid rgba(0, 0, 0, 0.2);
      }
    }
  }
}
.alert-enter-active {
  animation: bounce 0.2s;
}
.alert-leave-active {
  transition: 0.2s;
}
.alert-leave-to {
  opacity: 0;
}
@keyframes bounce {
  0% {
    opacity: 0;
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
</style>
