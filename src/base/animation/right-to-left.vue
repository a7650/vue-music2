<template>
  <transition
    name="rtol"
    enter-active-class="animated fadeInRight"
    leave-active-class="animated fadeOutRight"
  >
    <slot></slot>
  </transition>
</template>

<script>
import animated from "animate.css";
export default {};
</script>

<style>
</style>

