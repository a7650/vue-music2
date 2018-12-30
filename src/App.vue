<template>
  <div id="app">    
    <header>
      <tab></tab>
    </header>
    <keep-alive><router-view></router-view></keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import player from 'components/player/player'

export default {
  components:{
    Tab,player
  }
}
</script>



<style scoped lang="less">

</style>
