<template>
  <transition-group name="fade-toggle" mode="out-in">
    <slot></slot>
  </transition-group>
</template>

<script>
export default {
  name: "fade"
};
</script>
<style lang="less">
.fade-toggle-leave-active {
  transition: 0.5s;
}
.fade-toggle-enter-active {
  transition: 0.5s;
  position: absolute;
  left: 0;
}
.fade-toggle-enter,
.fade-toggle-leave-to {
  opacity: 0;
}
</style>

