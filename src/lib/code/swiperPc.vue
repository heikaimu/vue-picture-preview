<template>
  <div class="big-picture-preview">
    <!-- 主图 -->
    <div class="original-wrapper" ref="imgWrapper">
      <img 
      :class="{'show':isShowPic}"
      :src="currentPicSrc"
      :style="{'transition': `${animateSec}s`, 'transform': `rotate(${imgObj.rotate}deg) scale(${imgObj.scale})`, 'left': `${imgObj.left}px`, 'top': `${imgObj.top}px`}"
      ref="img"
      @load="imageLoaded"
      @mousedown="touchStart"
      @mousemove="touchMove"
      @mouseup="touchEnd"
      @mousewheel="mousewheel"
      @click="doubleClick"
      >
      <Loading v-show="!isShowPic"></Loading>
    </div>
    <div class="float-footer">
      <!-- 按钮们 -->
      <div class="menus-wrapper" v-if="menuType==='normal'||menuType==='all'">
        <div class="title"></div>
        <ul class="toolbar">
          <li class="zoom-in" @click="ScaleImg(1)"></li>
          <li class="zoom-out" @click="ScaleImg(-1)"></li>
          <li class="prev" @click="moveIndex(-1)"></li>
          <li class="next" @click="moveIndex(1)"></li>
          <li class="rotate-left" @click="rotateImg(-1)"></li>
          <li class="rotate-right" @click="rotateImg(1)"></li>
        </ul>
      </div>
      <!-- 小图 -->
      <div class="thumb-wrapper" ref="thumbWrapper">
        <ul :style="{width: thumbWidth, marginLeft: thumbMarginLeft}">
          <li 
          v-for="(item, index) in thumbnailList"
          :key="index"
          :style="{backgroundImage: `url(${item})`}"
          :class="{active: currentIndex===index}"
          @click="changePic(index)"
          ></li>
        </ul>
      </div>
    </div>
    <!-- 左右侧按钮 -->
    <div v-if="menuType==='simple'||menuType==='all'" class="slider-menu prev" :class="{disabled: currentIndex === 0}" @click="moveIndex(-1)"></div>
    <div v-if="menuType==='simple'||menuType==='all'" class="slider-menu next" :class="{disabled: currentIndex === originalList.length - 1}" @click="moveIndex(1)"></div>
    <!-- 关闭按钮 -->
    <div class="close" @click="closeFloat"></div>
  </div>
</template>

<script>
import Loading from "./loading";
export default {
  props: {
    // 原图
    originalList: {
      default() {
        return [];
      }
    },
    // 缩略图
    thumbnailList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 当前索引
    currentIndex: {
      default: 0
    },
    // 鼠标放大缩小
    isMousewheelScale: {
      default: true
    },
    // 鼠标缩放速度
    mousewheelScaleSpeed: {
      default: 0.06
    },
    // 键盘控制
    keyboardControl: {
      default: true
    },
    // 按钮类型
    menuType: {
      default: "normal"
    }
  },
  data() {
    return {
      isShowPic: false,
      animateSec: 0.2,
      wrapperObj: { width: null, height: null },
      imgObj: {
        width: null,
        height: null,
        left: null,
        top: null,
        rotate: 0,
        scale: 1
      },
      oldPosition: { left: null, top: null }, // 点击时候的卡片坐标
      oldPointer: { x: null, y: null }, // 点击时候的鼠标位置
      startMove: false,
      clickTime: 0 // 双击次数（用于单位事件判断是否双击）
    };
  },
  computed: {
    // 当前是哪张图片
    currentPicSrc() {
      return this.originalList[this.currentIndex];
    },
    // 缩略图宽度
    thumbWidth() {
      return `${this.thumbnailList.length * 31}px`;
    },
    // 缩略图左边距
    thumbMarginLeft() {
      return `calc(50vw - 15px - ${this.currentIndex * 31}px)`;
    }
  },
  methods: {
    // *********************************打开关闭*********************************
    // 初始换图片状态
    imageLoaded() {
      this.$nextTick(() => {
        this.isShowPic = true;
        this.imgObj.rotate = 0;
        this.imgObj.scale = 1;
        this.imgObj.width = this.$refs.img.width;
        this.imgObj.height = this.$refs.img.height;
        this.wrapperObj.width = this.$refs.imgWrapper.offsetWidth;
        this.wrapperObj.height = this.$refs.imgWrapper.offsetHeight;
        this.imgObj.left = (this.wrapperObj.width - this.imgObj.width) / 2;
        this.imgObj.top = (this.wrapperObj.height - this.imgObj.height) / 2;
        this.bindKeyboard();
      });
    },
    // 关闭大图
    closeFloat() {
      this.$emit("close", true);
    },
    // *********************************图片切换*********************************
    moveIndex(val) {
      if (val === 1 && this.currentIndex < this.originalList.length - 1) {
        const index = this.currentIndex + val;
        this.$emit("update:currentIndex", index);
      } else if (val === -1 && this.currentIndex > 0) {
        const index = this.currentIndex + val;
        this.$emit("update:currentIndex", index);
      }
    },
    // 小图切换
    changePic(index) {
      this.$emit("update:currentIndex", index);
    },
    // *********************************拖拽******************************
    touchStart(e) {
      e.preventDefault();
      e = e || event;
      this.oldPosition.left = this.imgObj.left;
      this.oldPosition.top = this.imgObj.top;
      this.oldPointer.x = e.clientX;
      this.oldPointer.y = e.clientY;
      this.startMove = true;
    },
    touchMove(e) {
      e = e || event;
      e.preventDefault();
      if (this.startMove) {
        this.animateSec = 0;
        const left = e.clientX - this.oldPointer.x + this.oldPosition.left;
        const top = e.clientY - this.oldPointer.y + this.oldPosition.top;
        this.imgObj.left = left;
        this.imgObj.top = top;
      }
    },
    touchEnd(e) {
      this.animateSec = 0.2;
      this.startMove = false;
    },
    // *******************************缩放*****************************
    // 鼠标滚动
    mousewheel(e) {
      e = e || event;
      e.preventDefault();
      if (!this.isMousewheelScale) return false;
      if (e.deltaY > 0) {
        this.ScaleImg(-1, this.mousewheelScaleSpeed - 0);
      } else {
        this.ScaleImg(1, this.mousewheelScaleSpeed - 0);
      }
    },
    // 缩放
    ScaleImg(way, scale) {
      const oldVal = this.imgObj.scale;
      scale = scale || 0.1;
      if (way === -1) {
        if (this.imgObj.scale <= 0.5) {
          this.imgObj.scale = oldVal;
        } else {
          this.imgObj.scale -= scale;
        }
      } else {
        if (this.imgObj.scale >= 2) {
          this.imgObj.scale = oldVal;
        } else {
          this.imgObj.scale += scale;
        }
      }
    },
    // *******************************旋转*******************************
    rotateImg(way) {
      way === -1 ? (this.imgObj.rotate -= 90) : (this.imgObj.rotate += 90);
    },
    // *******************************双击重置图片状态*******************************
    doubleClick(e) {
      e = e || event;
      e.stopPropagation();
      this.clickTime += 1;
      setTimeout(() => {
        if (this.clickTime == 2) {
          // 如果是双击重置图片
          this.imageLoaded();
        }
        this.clickTime = 0;
      }, 300);
    },
    // ========================键盘事件=======================
    bindKeyboard() {
      document.removeEventListener("keyup", this.keyboardBehavior, false);
      if (this.keyboardControl) {
        document.addEventListener("keyup", this.keyboardBehavior, false);
      }
    },
    keyboardBehavior(e) {
      if (e.keyCode === 27) {
        this.closeFloat();
      }
      if (e.keyCode === 68 || e.keyCode === 39) {
        this.moveIndex(1);
      }
      if (e.keyCode === 65 || e.keyCode === 37) {
        this.moveIndex(-1);
      }
    }
  },
  components: {
    Loading
  }
};
</script>

<style scoped lang="scss">
.big-picture-preview {
  position: fixed;
  z-index: 999999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  .slider-menu {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 50%;
    z-index: 33;
    margin-top: -40px;
    transition: .2s;
    cursor: pointer;
    &.disabled{
      opacity: 0.2;
      cursor: not-allowed;
      &:hover{
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }
    &.prev {
      left: 20px;
      &:before {
        content: "";
        margin: 16px 12px;
        font-size: 0;
        line-height: 0;
        display: block;
        width: 48px;
        height: 48px;
        color: transparent;
        background: url("../icons/left.png");
      }
    }
    &.next {
      right: 20px;
      &:before {
        content: "";
        margin: 16px 0px 16px 20px;
        font-size: 0;
        line-height: 0;
        display: block;
        width: 48px;
        height: 48px;
        color: transparent;
        background: url("../icons/right.png");
      }
    }
  }
  .original-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    img {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      cursor: move;
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
  }

  .float-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    .menus-wrapper {
      padding: 10px;
      display: flex;
      justify-content: center;
      .toolbar {
        display: flex;
        justify-content: center;
        li {
          color: #fff;
          margin: 0 1px;
          list-style: none;
          width: 24px;
          height: 24px;
          cursor: pointer;
          border-radius: 50%;
          transition: 0.2s;
          background-repeat: no-repeat;
          background-color: rgba(0, 0, 0, 0.5);
          &:hover {
            background-color: rgba(0, 0, 0, 0.9);
          }
          &:before {
            margin: 2px;
            font-size: 0;
            line-height: 0;
            display: block;
            width: 20px;
            height: 20px;
            color: transparent;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC);
            background-repeat: no-repeat;
          }
          &.zoom-in {
            &:before {
              content: "Zoom In";
              background-position: 0 0;
            }
          }
          &.zoom-out {
            &:before {
              content: "Zoom Out";
              background-position: -20px 0;
            }
          }
          &.prev {
            &:before {
              content: "Prev";
              background-position: -80px 0;
            }
          }
          &.next {
            &:before {
              content: "Next";
              background-position: -120px 0;
            }
          }
          &.rotate-left {
            &:before {
              content: "Rotate Left";
              background-position: -140px 0;
            }
          }
          &.rotate-right {
            &:before {
              content: "Rotate right";
              background-position: -160px 0;
            }
          }
        }
      }
    }
    .thumb-wrapper {
      width: 100%;
      height: 52px;
      background: rgba(0, 0, 0, 0.6);
      ul {
        transition: 0.2s;
        li {
          list-style: none;
          line-height: 0;
          float: left;
          overflow: hidden;
          width: 30px;
          height: 50px;
          cursor: pointer;
          margin: 1px;
          margin-right: 0;
          background-size: cover;
          opacity: 0.4;
          &.active {
            opacity: 1;
          }
        }
      }
    }
  }

  .close {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 80px;
    height: 80px;
    cursor: pointer;
    border-radius: 50%;
    background-color: #000;
    background-color: rgba(0, 0, 0, 0.5);
    transition: .2s;
    &:before {
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      background: url("../icons/close.png");
      position: absolute;
      left: 18px;
      top: 48px;
      transition: 0.2s;
    }
    &:hover{
      background-color: #d81e06;
    }
  }
}
</style>
