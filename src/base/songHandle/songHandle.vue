<template>
  <ani>
    <div class="handles" ref="handles">
      <span
        ref="defaultHanders"
        v-if="!othersHander.length"
        v-for="(item,index) in songMore"
        :key="index"
        @click.stop="songHandle(index)"
      >{{item}}</span>

      <transition name="bounce">
        <div v-if="selectOther" class="selectOther">
          <div class="selectAlbum" v-if="selectAlbum">
            <header>
              <span class="create" @click="_createAlbum">创建</span>
              <span class="title">请选择歌单</span>
            </header>
            <scroll :data="otherAlbum" class="album-content" :stopPropagation="stopPropagation">
              <div>
                  <span @click="addToAlbum(item.name)" v-for="(item,index) in otherAlbum" :key="index">{{item.name}}</span>
              </div>
            </scroll>
          </div>
          <div class="createAlbum" v-if="createAlbum">
            <header>
              <i class="icon-left" @click="_back"></i>
              <span class="title">创建歌单</span>
            </header>
            <div class="detail">
              <label class="name">歌单名称
                <br>
                <input type="text" v-model="albumName">
                <br>
              </label>
              <label class="desc">你还可以添加一个简介
                <br>
                <textarea type="text" v-model="albumDesc"></textarea>
              </label>
              <button @click="create">创建</button>
            </div>
          </div>
        </div>
      </transition>

      <span
        v-if="othersHander.length"
        v-for="(item,index) in othersHander"
        :key="index"
        @click.stop="othersHandle(item.type)"
      >{{item.mes}}</span>
      <Float :float_message="float_message" v-if="float"></Float>
    </div>
  </ani>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import ani from "base/animation/mini-list-animation";
import { setCreateAlbum, getCreateAlbum, createAlbum,getMyAlbum } from "common/js/cache";
import Float from "base/float/float";
import { float } from "common/js/mixin";
import scroll from 'base/scroll/scroll'

//在父组件传入一个currentSelect，而且要父组件控制改组件的隐藏/显示，父组件还要实现closeSongHandles函数
export default {
  mixins: [float],

  props: {
    currentSelect: {
      type: Object
    },
    othersHander: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      songMore: ["添加到收藏", "添加到歌单", "下一首播放", "取消"],
      otherAlbum: [],
      selectOther: false,
      selectAlbum: false,
      createAlbum: false,
      albumName: "",
      albumDesc: "",
      stopPropagation:true
    };
  },
  computed: {
    ...mapGetters(["playList"])
  },
  components: {
    ani,
    Float,
    scroll
  },
  methods: {
    _back() {
      this.selectAlbum = true;
      this.createAlbum = false;
    },
    create() {
      if (!this.albumName) {
        this.mixin_float("至少输入歌单名称");
        return;
      }
      let m = createAlbum(this.albumName, this.albumDesc);
      if(m.type === 1){
        this._back();
        this.otherAlbum = getMyAlbum();
        this.REFRESH_MYALBUM();
      }
      this.mixin_float(m.mes);
    },
    _createAlbum() {
      this.selectAlbum = false;
      this.createAlbum = true;
    },
    addFavorite(song) {
      let m = setCreateAlbum("我的收藏", song);
      this.REFRESH_MYALBUM();
      return m;
    },
    addToAlbum(name){
      let m = setCreateAlbum(name,this.currentSelect);
      this.REFRESH_MYALBUM();
      this.$emit("closeSongHandles", m);
    },
    addOther(song) {
      this.selectOther = true;
      this.selectAlbum = true;
      this.otherAlbum = getMyAlbum();
    },
    nextPlay(song) {
      this.NEXT_PLAY(song);
    },
    songHandle(index) {
      switch (index) {
        case 0:
          let m = this.addFavorite(this.currentSelect);
          console.log(this.currentSelect)
          this.$emit("closeSongHandles", m);
          break;
        case 1:
          this.addOther(this.currentSelect);
          break;
        case 2:
          this.nextPlay(this.currentSelect);
          this.$emit("closeSongHandles", "已添加到下一首播放队列");
          break;
        case 3:
          this.$emit("closeSongHandles");
          break;
      }
    },
    othersHandle(type) {
      this.$emit("othersHandle", type);
    },
    ...mapMutations(["NEXT_PLAY","REFRESH_MYALBUM"])
  },
  mounted() {
    this.$nextTick(() => {
      let n = this.othersHander.length;
      this.$refs.handles.style.height = n ? `${n * 50}px` : "200px";
      if (this.playList.length) {
        this.$refs.handles.style.bottom = "8%";
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";
.handles {
  animation-duration: 0.2s;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 99;
  background: #fff;

  &>span {
    width: 100%;
    flex: 1;
    text-align: center;
    line-height: 50px;
    color: #000;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .selectOther {
    position: fixed;
    top: 20%;
    bottom: 20%;
    left: 15%;
    right: 15%;
    background: #fff;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    .selectAlbum {
      header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        height: 40px;
        .title {
          float: right;
          width: 60%;
          text-align: center;
          line-height: 40px;
          color: #000;
        }
        .create {
          float: right;
          width: 20%;
          text-align: center;
          line-height: 40px;
          color: @color-text-d;
        }
      }
      .album-content{
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        padding: 0 20px;
        overflow: hidden;
        span {
          display: block;
          width: 100%;
          text-align: center;
          .no-wrap;
          height: 40px;
          line-height: 40px;
          color: #000;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      }
      }
      
    }
    .createAlbum {
      position: fixed;
      top: 20%;
      bottom: 20%;
      left: 15%;
      right: 15%;
      background: #fff;
      border-radius: 5px;
      header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        height: 40px;
        color: #000;
        i {
          width: 10%;
          height: 40px;
          line-height: 40px;
          display: block;
          float: left;
          text-align: center;
          z-index: 99;
          position: relative;
        }
        .title {
          width: 80%;
          float: left;
          text-align: center;
          line-height: 40px;
        }
      }
      .detail {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        padding: 60px 20px 10px 20px;
        color: #000;
        display: flex;
        flex-direction: column;
        label:nth-child(1) {
          height: 80px;
        }
        label:nth-child(2) {
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        input {
          margin: 10px 0 20px 0;
          width: 100%;
          height: 25px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.3);
          border-left: 1px solid #fff;
          border-right: 1px solid #fff;
        }
        textarea {
          width: 100%;
          resize: none;
          margin-top: 20px;
          border: 1px solid rgba(0, 0, 0, 0.3);
          margin-left: -2px;
          flex: 1;
        }
        button {
          width: 70px;
          height: 35px;
          margin-top: 10px;
          background: black;
          border: none;
          color: #fff;
          align-self: center;
        }
      }
    }
  }
}
@keyframes bounce {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.bounce-enter-active {
  animation: bounce 0.5s;
}
.bounce-leave-active {
  transition: 0.3s;
}
.bounce-leave-to {
  opacity: 0;
}
</style>
