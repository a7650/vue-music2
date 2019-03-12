<template>
  <transition name="player">
    <slot></slot>
  </transition>
</template>

<script>
import animated from "animate.css";
export default {};
</script>

<style>
.player-enter,
.player-leave-to {
  transform: translate(0, 100%);
  opacity: 0;
}
</style>
