<template>
     <transition name="rtol" enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
        <slot></slot>
    </transition>
</template>

<script>
import animated from 'animate.css'
export default {

}
</script>

<style>

</style>
