<template>
 <transition name="filter-bg">
    <div class="filter-bg">

    </div>
 </transition>
</template>

<script>
export default {

}
</script>

<style>
.filter-bg{
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, .5);
}
.filter-bg-enter-active,.filter-bg-leave-active{
    transition: .3s;
}
.filter-bg-enter,.filter-bg-leave-to{
    opacity: 0;
}
</style>
