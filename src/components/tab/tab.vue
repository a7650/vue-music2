<template>
    <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend" replace>
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer" replace>
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank" replace>
      <span class="tab-link">排行
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/mine" replace>
      <span class="tab-link">我的</span>
    </router-link>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
 @import "~common/stylus/variable";

  .tab{
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: @font-size-medium;
    background: @color-theme;
          transition: .5s;

    .tab-item{
      flex: 1;
      text-align: center;
      .tab-link{
        padding-bottom: 5px;
        color: @color-text-ll;
        transition: .3s;

      }
      &.router-link-active{
        .tab-link{
          color: @color-text;
          border-bottom: 2px solid @color-text;
          font-size: @font-size-medium-x;
        }
      }
    }
  }
</style>

