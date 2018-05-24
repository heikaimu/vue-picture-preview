<template>
    <div class="picture-preview-container">
      <!--预览图片列表-->
      <div class="small-picture-list">
        <div class="item"
             v-for="(item,index) in pictureList"
             @mouseover="showIconIndex=index"
             @mouseout="showIconIndex=-1"
             @click="showBigPicturePreview(item, index)">
          <div class="picture" :style="{background: `url(${item}) no-repeat center center / cover`}"></div>
          <div class="search-icon" :class="{'active': showIconIndex===index}"></div>
        </div>
      </div>
      <!--放大层-->
      <transition name="fade">
      <div class="big-picture-preview" v-if="ifShowPicturePreview">
        <div class="picture-wrapper" :style="{'bottom':isMenu?'60px':'100px'}" ref="imgWrapper">
          <img
            :src="currentPicSrc"
            alt=""
            :style="{'transform': `rotate(${rotateVal}deg) scale(${scaleVal})`, 'left': `${left}px`, 'top': `${top}px`}"
            ref="img"
            @load="imageLoaded"
            @mousedown="touchStart"
            @mousemove="touchMove"
            @mouseup="touchEnd"
            @mousewheel="mousewheel"
            @click="doubleClick"
          >
        </div>
        <div class="menu-wrapper" v-if="isMenu">
          <div class="item prev" :class="{'disabled':isFirst}" @click="moveIndex(-1)" v-if="isMove"></div>
          <div class="item left-rotate" @click="rotateImg(-1)" v-if="isRotate"></div>
          <div class="item right-rotate" @click="rotateImg(1)" v-if="isRotate"></div>
          <div class="item big" @click="ScaleImg(1)" v-if="isScale"></div>
          <div class="item small" @click="ScaleImg(-1)" v-if="isScale"></div>
          <div class="item next" :class="{'disabled':isLast}" @click="moveIndex(1)" v-if="isMove"></div>
          <div class="close-icon" @click="closeBigPicturePreview"><i></i></div>
        </div>
      </div>
      </transition>
    </div>
</template>

<script>
    export default {
      props: {
        pictureList: {
          type: Array,
          default: () => {
            return []
          }
        },
        // 是否旋转
        isRotate: {
          default: true
        },
        // 是否前进后退
        isMove: {
          default: true
        },
        // 是否缩放
        isScale: {
          default: true
        },
        // 是否单击图片关闭
        isClikcImgClose: {
          default: true
        },
        // 是否显示底部按钮
        isMenu: {
          default: true
        },
        // 鼠标放大缩小
        isMousewheelScale: {
          default: true
        },
        // 双击恢复
        doubleRestore: {
          default: true
        }
      },
      data() {
        return {
          startMove: false,
          left: 0, // 图片left定位值
          top: 0, // 图片top定位值
          width: 0, // 图片初始宽度
          height: 0, // 图片初始高度
          startX: 0, // 触摸位置X
          startY: 0, // 触摸位置Y
          disX: 0, // 移动距离X
          disY: 0, // 移动距离Y
          lastDisX: 0, // 上一次移动距离X
          lastDisY: 0, // 上一次移动距离Y
          time: 1, // 节流计时器
          clickTime: 0, // 双击次数（用于单位事件判断是否双击）
          removeClose: true, // 用于判断是点击还是拖动时候的第一次单击
          showIconIndex: -1,
          currentPicSrc: '',
          currentPicIndex: -1,
          isFirst: false,
          isLast: false,
          rotateVal: 0,
          scaleVal: 1,
          ifShowPicturePreview: false
        }
      },
      methods: {
        // 初始换图片状态
        imageLoaded() {
          this.rotateVal = 0;
          this.scaleVal = 1;
          this.width = this.$refs.img.width;
          this.height = this.$refs.img.height;
          const imgWrapperWidth = this.$refs.imgWrapper.offsetWidth;
          const imgWrapperHeight = this.$refs.imgWrapper.offsetHeight;
          this.left = (imgWrapperWidth - this.width) / 2;
          this.top = (imgWrapperHeight - this.height) / 2;
        },
        // 打开大图
        showBigPicturePreview(item, index) {
          this.currentPicSrc = item;
          this.currentPicIndex = index;
          this.ifShowPicturePreview = true;
          const l = this.pictureList.length;
          if (index === 0) {
            this.isFirst = true;
          } else if (index === l - 1) {
            this.isLast = true;
          } else {
            this.isFirst = false;
            this.isLast = false;
          }
        },
        // 关闭大图
        closeBigPicturePreview() {
          this.ifShowPicturePreview = false;
          this.currentPicSrc = '';
          this.currentPicIndex = -1;
        },
        // 前进后退
        moveIndex(way) {
          this.rotateVal = 0;
          const l = this.pictureList.length;
          way === -1 ? this.currentPicIndex -= 1 : this.currentPicIndex +=1;
          if (this.currentPicIndex <= 0) {
            this.currentPicIndex = 0
            this.isFirst = true;
          } else if (this.currentPicIndex >= l - 1) {
            this.currentPicIndex = l - 1;
            this.isLast = true;
          } else {
            this.isFirst = false;
            this.isLast = false;
          }
          this.currentPicSrc = this.pictureList[this.currentPicIndex];
          const params = {
            direction: way,
            src: this.currentPicSrc,
            index: this.currentPicIndex,
            isFirst: this.isFirst,
            isLast: this.isLast
          }
          this.$emit('move', params);
        },
        // 旋转
        rotateImg(way) {
          way === -1 ? this.rotateVal -= 90 : this.rotateVal += 90;
        },
        // 缩放
        ScaleImg(way, scale) {
          const oldVal = this.scaleVal;
          scale = scale || 0.1;
          if (way === -1) {
            if (this.scaleVal <= 0.5) {
              this.scaleVal = oldVal;
            } else {
              this.scaleVal -= scale;
            }
          } else {
            if (this.scaleVal >= 1.5) {
              this.scaleVal = oldVal;
            } else {
              this.scaleVal += scale;
            }
          }
        },
        // 触摸开始
        touchStart(e) {
          e.preventDefault();
          e = e || event;
          this.removeClose = true;
          this.startX = e.clientX;
          this.startY = e.clientY;
          this.startMove = true;
        },
        // 滑动过程
        touchMove(e) {
          e = e || event;
          if (this.startMove) {
            this.disX = e.clientX - this.startX;
            this.disY = e.clientY - this.startY;
            this.left = this.left - this.lastDisX + this.disX;
            this.top = this.top - this.lastDisY + this.disY;
            this.lastDisX = this.disX;
            this.lastDisY = this.disY;
            this.removeClose = false;
          }
        },
        // 滑动结束
        touchEnd(e) {
          this.startMove = false;
          this.lastDisX = 0;
          this.lastDisY = 0;
        },
        // 鼠标滚动
        mousewheel(e) {
          e = e || event;
          if (!this.isMousewheelScale) return false;
          e.preventDefault();
          if (e.deltaY > 0) {
            this.throttle(() => {
              this.ScaleImg(-1, 0.02);
            });
          } else {
            this.throttle(() => {
              this.ScaleImg(1, 0.02);
            });
          }
        },
        // 双击重置图片状态，单击关闭
        doubleClick() {
          this.clickTime += 1;
          setTimeout(() => {
            if (this.clickTime == 2) { // 如果是双击重置图片
              this.removeClose = false;
              if (this.doubleRestore) this.imageLoaded();
            } else { // 是单击关闭图层
              if (this.isClikcImgClose && this.removeClose) {
                this.closeBigPicturePreview();
              }
            }
            this.clickTime = 0;
          }, 300)
        },
        // 节流
        throttle(func) {
          if (this.time) {
            this.time = 0;
            func();
            setTimeout(() => {
              this.time = 1;
            }, 20)
          }
        }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .picture-preview-container{
    .small-picture-list{
      display: flex;
      flex-wrap: wrap;
      padding: 5px;
      .item{
        width: 100px;
        height: 100px;
        margin: 5px;
        background-color: #ccc;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
        .picture{
          width: 100%;
          height: 100%;
        }
        .search-icon{
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 3;
          top: 0;
          left: 0;
          background: rgba(0,0,0,0.3);
          opacity: 0;
          transition: .2s;
          transform: scale(0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          &.active{
            opacity: 1;
            transform: scale(1);
          }
          &:after{
            content: '';
            display: block;
            width: 32px;
            height: 32px;
            background: url("./biger.png");
          }
        }
      }
    }
    .big-picture-preview{
      position: fixed;
      z-index: 9999999999;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0,0,0,0.9);
      .picture-wrapper{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 60px;
        img{
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          cursor: move;
        }
      }
      .menu-wrapper{
        position: absolute;
        height: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f2f2f2;
        display: flex;
        justify-content: center;
        align-items: center;
        .item{
          width: 40px;
          height: 40px;
          background: #444;
          margin: 0 10px;
          &.prev{
            background: url("./left-arrow.png") no-repeat center center;
          }
          &.next{
            background: url("./right-arrow.png") no-repeat center center;
          }
          &.left-rotate{
            background: url("./left-rotate.png") no-repeat center center;
          }
          &.right-rotate{
            background: url("./right-rotate.png") no-repeat center center;
          }
          &.big{
            background: url("./big.png") no-repeat center center;
          }
          &.small{
            background: url("./small.png") no-repeat center center;
          }
          &.disabled{
            opacity: 0.2;
          }
        }
        .close-icon{
          position: absolute;
          width: 60px;
          height: 60px;
          right: 0;
          top: 0;
          background: url('./close.png') no-repeat center center #fff;
        }
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
