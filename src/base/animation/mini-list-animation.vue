<template>
  <transition name="m">
    <slot></slot>
  </transition>
</template>

<script>
import animated from "animate.css";
export default {};
</script>

<style>
.m-enter,
.m-leave-to {
  transform: translate(0, 100px);
  opacity: 0;
}
</style>
