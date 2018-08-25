<template>
    <div class="picture-preview-container">
      <!--预览图片列表-->
      <div class="small-picture-list">
        <transition-group name="list-complete" tag="div">
        <div class="item"
             :style="{'width':`${width}px`, 'height':`${height}px`, 'borderRadius':`${borderRadius}px`}"
             v-for="(item,index) in thumbnailList"
             :key="item"
             @mouseover="showIconIndex=index"
             @mouseout="showIconIndex=-1"
             >
          <div class="picture" :style="{background: `url(${item}) no-repeat center center / cover`}"></div>
          <template v-if="!isEdit">
            <div class="search-icon" :class="{'active': showIconIndex===index}" @click="showBigPicturePreview(index)"></div>
          </template>
          <template v-else>
            <div class="many-icons" :class="{'active': showIconIndex===index}">
              <ul>
                <li class="icons">
                  <div class="icon prev" @click="prevPicture(index)" title="前进"></div>
                  <div class="icon next" @click="nextPicture(index)"></div>
                </li>
                <li class="icons">
                  <div class="icon search" @click="showBigPicturePreview(index)"></div>
                  <div class="icon remove" @click="removePicture(index)"></div>
                </li>
                <li class="icons">
                  <div class="icon first" @click="topPicture(index)" title="置顶"></div>
                  <div class="icon last" @click="bottomPicture(index)"></div>
                </li>
              </ul>
            </div>
          </template>
        </div>
        </transition-group>
        <slot></slot>
      </div>
      <!--放大层-->
      <transition name="fade">
      <div class="big-picture-preview" v-if="ifShowPicturePreview">
        <div class="picture-wrapper" :style="{'bottom':isMenu?'60px':'100px'}" ref="imgWrapper" @click="singleClick">
          <img
            :class="{'show':isShowPic}"
            :src="currentPicSrc"
            alt=""
            :style="{'transition': `${imgTransition}s`, 'transform': `rotate(${rotateVal}deg) scale(${scaleVal})`, 'left': `${left}px`, 'top': `${top}px`}"
            ref="img"
            @load="imageLoaded"
            @mousedown="touchStart"
            @mousemove="touchMove"
            @mouseup="touchEnd"
            @mousewheel="mousewheel"
            @click="doubleClick"
          >
          <div class="loading" v-show="!isShowPic"></div>
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
        // 图片
        pictureList: {
          type: Array,
          default: () => {
            return []
          }
        },
        // 数据配置
        props: {
          type: Object,
          default: () => {
            return {}
          }
        },
        // 缩略图宽度
        width: {
          default: 100
        },
        // 缩略图高度
        height: {
          default: 100
        },
        // 缩略图圆角
        borderRadius: {
          default: 5
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
        // 是否单机黑框关闭弹出层
        isSingleClickToClose: {
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
        },
        // 是否带删除功能
        isEdit: {
          default: false
        }
      },
      data() {
        return {
          isShowPic: false, // 图片加载完成之后再显示
          thumbnailList: [], // 缩略图
          originalList: [], // 原图
          startMove: false,
          left: 0, // 图片left定位值
          top: 0, // 图片top定位值
          imgWidth: 0, // 图片初始宽度
          imgHeight: 0, // 图片初始高度
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
          ifShowPicturePreview: false,
          imgTransition: 0.3
        }
      },
      mounted() {
        this.pageInit();
        console.log(this.props);
      },
      watch: {
        // 监听当前大图的url变化，变化了就先隐藏图片待图片加载完成之后再显示
        currentPicSrc() {
          this.isShowPic = false;
        },
        // 数据配置参数变化时候
        props: {
          handler: function() {
            this.pageInit();
            console.log(this.props);
          },
          deep: true
        },
        pictureList() {
          this.pageInit();
        }
      },
      methods: {
        // 数据初始化
        pageInit() {
          this.originalList = [];
          this.thumbnailList = [];
          this.pictureList.forEach((item) => {
            const domain = this.props.domain ? this.props.domain : '';
            const originalUrl = `${this.props.originalKey ? item[this.props.originalKey] : item}`;
            this.originalList.push(`${domain}${originalUrl}`);
            const thumbnailUrl = `${this.props.thumbnailKey ? item[this.props.thumbnailKey] : originalUrl}`;
            this.thumbnailList.push(`${domain}${thumbnailUrl}`);
          });
        },
        // 初始换图片状态
        imageLoaded() {
          this.isShowPic = true;
          // 在显示图片之后, 设置一个延迟时间重置图片位置，否则图片位置错乱
          setTimeout(() => {
            this.rotateVal = 0;
            this.scaleVal = 1;
            this.imgWidth = this.$refs.img.width;
            this.imgHeight = this.$refs.img.height;
            const imgWrapperWidth = this.$refs.imgWrapper.offsetWidth;
            const imgWrapperHeight = this.$refs.imgWrapper.offsetHeight;
            this.left = (imgWrapperWidth - this.imgWidth) / 2;
            this.top = (imgWrapperHeight - this.imgHeight) / 2;
          }, 50)
        },
        // 判断是否最后一页和第一页
        chargeFirstOrLast(l) {
          if ((this.currentPicIndex === 0 || this.currentPicIndex === l - 1) && l === 1) {
            this.isFirst = true;
            this.isLast = true;
          } else if (this.currentPicIndex === 0) {
            this.isFirst = true;
            this.isLast = false;
          } else if (this.currentPicIndex === l - 1) {
            this.isFirst = false;
            this.isLast = true;
          } else {
            this.isFirst = false;
            this.isLast = false;
          }
        },
        // 打开大图
        showBigPicturePreview(index) {
          this.currentPicSrc = this.originalList[index];
          this.currentPicIndex = index;
          this.ifShowPicturePreview = true;
          const l = this.originalList.length;
          this.chargeFirstOrLast(l);
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
          const l = this.originalList.length;
          way === -1 ? this.currentPicIndex -= 1 : this.currentPicIndex +=1;
          if (this.currentPicIndex <= 0) {
            this.currentPicIndex = 0
          } else if (this.currentPicIndex >= l - 1) {
            this.currentPicIndex = l - 1;
          }
          this.chargeFirstOrLast(l);
          this.currentPicSrc = this.originalList[this.currentPicIndex];
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
            if (this.scaleVal >= 2) {
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
          this.imgTransition = 0;
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
          this.imgTransition = 0.3;
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
        // 双击重置图片状态
        doubleClick(e) {
          e = e || event;
          e.stopPropagation();
          this.clickTime += 1;
          setTimeout(() => {
            if (this.clickTime == 2) { // 如果是双击重置图片
              this.removeClose = false;
              if (this.doubleRestore) this.imageLoaded();
            }
            this.clickTime = 0;
          }, 300)
        },
        // 单层外层关闭图片
        singleClick(e) {
          e = e || event;
          e.stopPropagation();
          if (this.isSingleClickToClose) {
            this.closeBigPicturePreview();
          }
        },
        // 删除图片
        removePicture(index) {
          this.pictureList.splice(index, 1);
          this.$emit('update: pictureList', this.pictureList);
          this.$emit('deletePicture', {
            result: this.pictureList,
            index: index
          })
        },
        // 前进
        prevPicture(index) {
          if (index > 0) {
            const item = [...this.pictureList][index];
            this.pictureList.splice(index, 1);
            this.pictureList.splice(index - 1, 0, item);
            this.$emit('prevPicture', {
              result: this.pictureList,
              index: index
            })
          }
        },
        // 置顶
        topPicture(index) {
          if (index > 0) {
            const item = [...this.pictureList][index];
            this.pictureList.splice(index, 1);
            this.pictureList.splice(0, 0, item);
            this.$emit('topPicture', {
              result: this.pictureList,
              index: index
            })
          }
        },
        // 后退
        nextPicture(index) {
          const length = this.pictureList.length;
          if (index < length - 1) {
            const item = [...this.pictureList][index];
            this.pictureList.splice(index, 1);
            this.pictureList.splice(index + 1, 0, item);
            this.$emit('nextPicture', {
              result: this.pictureList,
              index: index
            })
          }
        },
        // 置后
        bottomPicture(index) {
          const length = this.pictureList.length;
          if (index < length - 1) {
            const item = [...this.pictureList][index];
            this.pictureList.splice(index, 1);
            this.pictureList.splice(length - 1, 0, item);
            this.$emit('bottomPicture', {
              result: this.pictureList,
              index: index
            })
          }
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
        display: inline-block;
        margin: 5px;
        background-color: #ccc;
        overflow: hidden;
        position: relative;
        transition: .3s;
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
        .many-icons{
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
          .icons{
            width: 100%;
            padding: 5px 0;
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            .icon{
              width: 16px;
              height: 16px;
              margin: 0 8px;
              transition: .2s;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 100% 100%;
              &:hover{
                background-color: #409EFF;
              }
              &.remove{
                background-image: url("./delete.png");
              }
              &.search{
                background-image: url("./search.png");
              }
              &.prev{
                background-image: url("./prev.png");
              }
              &.next{
                background-image: url("./next.png");
              }
              &.first{
                background-image: url("./first.png");
              }
              &.last{
                background-image: url("./last.png");
              }
            }
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
          opacity: 0;
          &.show{
            opacity: 1;
          }
        }
        .loading{
          width: 32px;
          height: 32px;
          background: url("./loading.png");
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -16px;
          margin-top: -16px;
          -webkit-animation:scale 2s infinite linear ;
        }
        @-webkit-keyframes scale {
          0%{
            -webkit-transform: rotate(0deg);
          }
          50%{
            -webkit-transform: rotate(180deg);
          }
          100%{
            -webkit-transform: rotate(360deg);
          }
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

  .list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
