<template>
  <!--预览图片列表-->
    <div class="images" ref="images">
        <div class="move-center" 
        :style="{
        'opacity': centerOpacity,
        'width': `${centerWdith}px`,
        'height': `${centerWdith}px`,
        'left': `${cardCenter.x-centerWdith/2}px`,
        'top': `${cardCenter.y-centerWdith/2}px` }">
        </div>
        <div class="grid-wrapper">
          <ul ref="grid">
            <li 
            v-for="(item,index) in thumbnailList" :key="index" 
            :style="{'width':`${width}px`, 'height':`${height}px`, 'margin':`${spaceBetween}px`}">
            </li>
            <li :style="{'width':`${width}px`, 'height':`${height}px`, 'margin':`${spaceBetween}px`}">
              <slot></slot>
            </li>
          </ul>
        </div>
        <div class="item" :class="{move: centerOpacity==1}" :ref="`item_${index}`"
            v-for="(item, index) in imagesList"
            :key="index"
            :style="{
              'width':`${width}px`,
              'height':`${height}px`,
              'left':`${item.style.left}px`,
              'top':`${item.style.top}px`,
              'transition': `${animateSec}s`,
              'z-index': `${item.style.zIndex}`,
              'opacity': `${item.style.opacity}`,
              'borderRadius':`${borderRadius}px`,
              'background': `url(${item.src}) no-repeat center center / cover`}"
            @click="doubleClick(index)"
            @mousedown="touchStart($event, index)"
             >
             <div class="remove" @click="remove(index)" v-if="isEdit"></div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    // 图片
    thumbnailList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 数据配置
    props: {
      type: Object,
      default: () => {
        return {};
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
    // 间距
    spaceBetween: {
      default: 5
    },
    // 是否编辑模式
    isEdit: {
      default: true
    }
  },
  data() {
    return {
      imagesList: [],
      animateSec: 0,
      currentCardIndex: 0,
      centerWdith: 4,
      centerOpacity: 0,
      cardCenter: { x: null, y: null },
      oldPosition: { left: null, top: null }, // 点击时候的卡片坐标
      oldPointer: { x: null, y: null }, // 点击时候的鼠标位置
      startMove: false,
      clickTime: 0 // 双击次数（用于单位事件判断是否双击）
    };
  },
  watch: {
    thumbnailList() {
      this.$nextTick(() => {
        this.init();
      });
    }
  },
  mounted() {
    window.onresize = () => {
      this.init();
    };
    this.init();
  },
  methods: {
    // init
    init() {
      this.imagesList = [];
      const list = this.$refs.grid.childNodes;
      for (let i = 0; i < this.thumbnailList.length; i++) {
        const item = list[i];
        const style = {
          left: item.offsetLeft,
          top: item.offsetTop,
          zIndex: 0,
          opacity: "1"
        };
        this.imagesList.push({
          src: this.thumbnailList[i],
          style: style
        });
      }
    },
    // 触摸开始
    touchStart(e, index) {
      e = e || event;
      e.preventDefault();
      if (!this.isEdit) return false;
      this.imagesList.forEach(item => {
        item["move"] = false;
      });
      this.imagesList[index].move = true;
      const moveCard = this.$refs[`item_${index}`][0]; // 当前移动的这个块的参数
      this.oldPosition.left = parseInt(moveCard.style.left.replace("px", ""));
      this.oldPosition.top = parseInt(moveCard.style.top.replace("px", ""));
      this.oldPointer.x = e.clientX;
      this.oldPointer.y = e.clientY;
      this.startMove = true;
      document.onmousemove = e => {
        e = e || event;
        e.preventDefault();
        if (this.startMove) {
          this.centerOpacity = 1;
          this.animateSec = 0;
          const left = e.clientX - this.oldPointer.x + this.oldPosition.left;
          const top = e.clientY - this.oldPointer.y + this.oldPosition.top;
          this.cardCenter.x = left + this.width / 2;
          this.cardCenter.y = top + this.height / 2;
          const newStyle = {
            left: left,
            top: top,
            zIndex: 999,
            opacity: "0.8"
          };
          this.imagesList[index].style = newStyle;
        }
      };
      document.onmouseup = () => {
        this.centerOpacity = 0;
        this.imagesList[index].style.zIndex = 0;
        this.imagesList[index].style.opacity = "1";
        this.startMove = false;
        this.searchCenterCard(index);
      };
    },
    // 遍历所有卡片，寻找移动卡片中心点所在的卡片
    searchCenterCard(index) {
      this.animateSec = 0.3;
      let includeCard = null;
      this.imagesList.forEach((item, i) => {
        // 判断到底在左边还是右边
        const { status, slider } = this.chargeCardSlider(item);
        if (status) {
          if (index < i && slider === "left") {
            includeCard = {
              move: index,
              replace: i - 1
            };
          } else if (index < i && slider === "right") {
            includeCard = {
              move: index,
              replace: i
            };
          } else if (index > i && slider === "left") {
            includeCard = {
              move: index,
              replace: i
            };
          } else if (index > i && slider === "right") {
            includeCard = {
              move: index,
              replace: i + 1
            };
          }
        }
      });
      if (includeCard) {
        this.$emit("refresh", includeCard);
      } else {
        this.imagesList[index].style.left = this.oldPosition.left;
        this.imagesList[index].style.top = this.oldPosition.top;
      }
      this.cardCenter = { x: null, y: null };
    },
    // 判断卡片方位
    chargeCardSlider(item) {
      const leftPart = {
        pointleftTop: { x: item.style.left, y: item.style.top },
        pointRightBottom: {
          x: item.style.left + this.width / 2,
          y: item.style.top + this.height
        }
      };
      const rightPart = {
        pointleftTop: {
          x: item.style.left + this.width / 2 + 1,
          y: item.style.top
        },
        pointRightBottom: {
          x: item.style.left + this.width,
          y: item.style.top + this.height
        }
      };
      if (this.chargeInclude(this.cardCenter, leftPart)) {
        return {
          status: true,
          slider: "left"
        };
      } else if (this.chargeInclude(this.cardCenter, rightPart)) {
        return {
          status: true,
          slider: "right"
        };
      } else {
        return {
          status: false
        };
      }
    },
    chargeInclude(center, around) {
      const isInclude =
        center.x > around.pointleftTop.x &&
        center.x < around.pointRightBottom.x &&
        center.y > around.pointleftTop.y &&
        center.y < around.pointRightBottom.y;
      return isInclude;
    },
    // 删除卡片
    remove(index) {
      this.$emit("remove", index);
    },
    // 双击查看大图
    doubleClick(index) {
      this.clickTime += 1;
      setTimeout(() => {
        if (this.clickTime == 2) {
          // 如果是双击重置图片
          this.$emit("showOriginal", index);
        }
        this.clickTime = 0;
      }, 300);
    }
  }
};
</script>

<style scoped lang="scss">
.images {
  padding: 5px;
  .move-center {
    position: absolute;
    z-index: 998;
    background: red;
    border-radius: 50%;
  }
  .grid-wrapper {
    ul {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      li {
        list-style: none;
      }
    }
  }
  .item {
    position: absolute;
    &.move {
      cursor: move;
    }
    .remove {
      width: 24px;
      height: 24px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      position: absolute;
      right: 2px;
      top: 2px;
      transition: 0.2s;
      cursor: pointer;
      &:before {
        content: "";
        display: block;
        width: 16px;
        height: 16px;
        margin: 4px;
        background: url("../icons/close.png");
        transition: 0.2s;
      }
      &:hover {
        background-color: #d81e06;
      }
    }
  }
}
</style>
