<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <fadeToggle>
        <div v-for="(item,index) in recommends" :key="item.id" v-show="index==currentDot">
          <a :href="item.linkUrl">
            <img :src="item.picUrl">
          </a>
        </div>
      </fadeToggle>
    </div>
    <div class="dots">
      <span
        v-for="(item,index) in maxRecommends"
        :key="item"
        class="dot"
        :class="{active:currentDot===index}"
      ></span>
    </div>
  </div>
</template>


<script>
import { addClass } from "common/js/dom";
import fadeToggle from "base/animation/fade";

export default {
  name: "slider",
  props: {
    recommends: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      maxRecommends: this.recommends.length,
      currentDot: -1
    };
  },
  components: {
    fadeToggle
  },
  methods: {
    sliderHeight() {
      return this.$refs.slider.clientHeight;
    },
    _currentDot() {
      let n = this.currentDot + 1;
      n = n === this.maxRecommends ? 0 : n;
      this.currentDot = n;
      this.timer = setTimeout(() => {
        this._currentDot();
      }, 5000);
    },
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children[0].children;
      let sliderWidth = this.$refs.slider.clientWidth;
      let width = 0;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _getSliderHeight() {
      this.$emit("sliderHeight", this.sliderHeight());
    },
    checkHeight() {
      let h = this.$refs.slider.clientHeight;
      if (h !== 0) {
        this.$emit("sliderHeight", h);
      } else {
        setTimeout(() => {
          this.checkHeight();
        }, 100);
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this._setSliderWidth();
      this._currentDot();
      this.checkHeight();
    });
    window.addEventListener("resize", () => {
      this._setSliderWidth();
      this._getSliderHeight();
    });
  }
};
</script>


<style lang="less">
@import "~common/stylus/variable.less";

.slider {
  position: relative;
  overflow: hidden;
  .slider-group {
    white-space: nowrap;
    overflow: hidden;
    .slider-item {
      float: left;
      box-sizing: border-box;
      text-align: center;
      a {
        display: block;
        width: 100%;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
.dots {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 20px;
  transform: translateZ(1px);
  text-align: center;
  font-size: 0;
  .dot {
    display: inline-block;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: @color-text-l;
    &.active {
      width: 20px;
      border-radius: 5px;
      background: @color-text-ll;
    }
  }
}
</style>

