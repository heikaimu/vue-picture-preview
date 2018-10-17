<template>
  <div id="app">
    <div class="content-box">
      <div>
    <PictureView 
    :pictureList="pictureList" 
    :props="defaultProps"
    :width="100" 
    :height="100" 
    :borderRadius="5" 
    :spaceBetween="5"
    :isEdit="true"
    :isMousewheelScale="true"
    :mousewheelScaleSpeed="0.06"
    :keyboardControl="false"
    :menuType="'all'"
    @pictureUpdated="pictureUpdated"
    >
      <button @click="addPic">添加图片</button>
    </PictureView>
    <button @click="showPic">看图片地址</button>
  </div>
  </div>
  </div>
</template>

<script>
import PictureView from "./lib/code/index";
export default {
  data() {
    return {
      keyboardControl: true,
      mousewheelScaleSpeed: 0.1,
      spaceBetween: 5,
      pictureList: [
        {
          thumbnail:
            "/20180525091245.jpg?imageView2/5/w/200/h/200/q/75|imageslim",
          original: "/20180525091245.jpg"
        },
        {
          thumbnail:
            "/20180525091249.jpg?imageView2/5/w/200/h/200/q/75|imageslim",
          original: "/20180525091249.jpg"
        },
        {
          thumbnail:
            "/20180525091252.jpg?imageView2/5/w/200/h/200/q/75|imageslim",
          original: "/20180525091252.jpg"
        },
        {
          thumbnail:
            "/20180525091253.jpg?imageView2/5/w/200/h/200/q/75|imageslim",
          original: "/20180525091253.jpg"
        }
      ],
      defaultProps: {
        originalKey: "original",
        thumbnailKey: "thumbnail",
        domain: "http://p09vugqdu.bkt.clouddn.com"
      }
    };
  },
  methods: {
    handleNext(data) {},
    changeToThumbnail() {
      this.defaultProps.originalKey = "thumbnail";
    },
    changeToOriginal() {
      this.defaultProps.originalKey = "original";
    },
    showPic() {
      console.log(
        this.pictureList.map(item => {
          return item.original;
        })
      );
    },
    addPic() {
      this.pictureList.push({
        thumbnail:
          "/20180525091249.jpg?imageView2/5/w/200/h/200/q/75|imageslim",
        original: "/20180525091249.jpg"
      });
    },
    pictureUpdated(data) {
      console.log(data)
    }
  },
  components: {
    PictureView
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.content-box{
  width: 600px;
  position: fixed;
  left: 100px;
  right: 200px;
}
</style>
