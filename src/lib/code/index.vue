<template>
  <div>
    <!-- 小图列表 -->
    <list 
    ref="list"
    :thumbnailList="thumbnailList" 
    :props="props" 
    :width="width" 
    :height="height" 
    :borderRadius="borderRadius" 
    :spaceBetween="spaceBetween"
    :isEdit="isEdit"
    @refresh="refresh"
    @remove="remove"
    @showOriginal="showOriginal"
    >
      <slot></slot>
    </list>
    <!-- pc端图片浏览 -->
    <SwiperPc 
    :originalList="originalList"
    :thumbnailList="thumbnailList"
    :currentIndex.sync="currentIndex"
    :isMousewheelScale="isMousewheelScale"
    :mousewheelScaleSpeed="mousewheelScaleSpeed"
    :keyboardControl="keyboardControl"
    :menuType="menuType"
    v-if="original"
    @close="original=false"
    ></SwiperPc>
    <!-- 移动端图片浏览 -->
    <!-- <SwiperPhone></SwiperPhone> -->
  </div>
</template>

<script>
import list from "./list";
import SwiperPc from "./swiperPc";
import SwiperPhone from "./swiperPhone";
export default {
  props: {
    // 图片
    pictureList: {
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
    // 是否带删除功能
    isEdit: {
      default: false
    },
    // 是否显示底部按钮
    menuType: {
      default: "normal"
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
    }
  },
  data() {
    return {
      thumbnailList: [], // 缩略图
      originalList: [], // 原图
      original: false,
      currentIndex: 0 // 大图索引
    };
  },
  watch: {
    // 数据配置参数变化时候
    props: {
      handler: function() {
        this.pageInit();
      },
      deep: true
    },
    pictureList() {
      this.pageInit();
    }
  },
  created() {
    this.pageInit();
  },
  methods: {
    // 数据初始化
    pageInit() {
      this.originalList = [];
      this.thumbnailList = [];
      this.pictureList.forEach(item => {
        const domain = this.props.domain ? this.props.domain : "";
        const originalUrl = `${
          this.props.originalKey ? item[this.props.originalKey] : item
        }`;
        this.originalList.push(`${domain}${originalUrl}`);
        const thumbnailUrl = `${
          this.props.thumbnailKey ? item[this.props.thumbnailKey] : originalUrl
        }`;
        this.thumbnailList.push(`${domain}${thumbnailUrl}`);
      });
    },
    // 刷新数据
    refresh(data) {
      const moveCard = this.pictureList.splice(data.move, 1);
      this.pictureList.splice(data.replace, 0, ...moveCard);
      this.pageInit();
    },
    // 删除图片
    remove(index) {
      this.pictureList.splice(index, 1);
      this.pageInit();
    },
    // 查看大图
    showOriginal(index) {
      this.original = true;
      this.currentIndex = index;
    }
  },
  components: {
    list,
    SwiperPc,
    SwiperPhone
  }
};
</script>

<style>
</style>
