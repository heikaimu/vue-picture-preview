<template>
  <div id="app">
    <!--<PictureView-->
      <!--:pictureList="pictureList"-->
      <!--:isMenu="true"-->
      <!--:isRotate="false"-->
      <!--:isMove="true"-->
      <!--:isScale="false"-->
      <!--:isSingleClickToClose="true"-->
      <!--:isMousewheelScale="true"-->
      <!--:doubleRestore="false"-->
      <!--@move="handleNext"-->
    <!--&gt;</PictureView>-->
    <PictureView
      :pictureList="pictureList"
      :props="defaultProps"
      @move="handleNext"
    ></PictureView>
    <button @click="changeToThumbnail">全部缩略图</button>
    <button @click="changeToOriginal">全部原图</button>
  </div>
</template>

<script>
  import PictureView from './lib/picture-preview.vue';
export default {
  data() {
   return {
     pictureList: [
       {
         thumbnail: '/20180525091245.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
         original: '/20180525091245.jpg'
       },
       {
         thumbnail: '/20180525091249.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
         original: '/20180525091249.jpg'
       },
       {
         thumbnail: '/20180525091252.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
         original: '/20180525091252.jpg'
       },
       {
         thumbnail: '/20180525091253.jpg?imageView2/5/w/200/h/200/q/75|imageslim',
         original: '/20180525091253.jpg'
       }
     ],
     defaultProps: {
       originalKey: 'original',
       thumbnailKey: 'thumbnail',
       domain: 'http://p09vugqdu.bkt.clouddn.com'
     }
   }
  },
  methods: {
    handleNext(data) {
      console.log(data);
    },
    changeToThumbnail() {
      this.defaultProps.originalKey = 'thumbnail';
    },
    changeToOriginal() {
      this.defaultProps.originalKey = 'original';
    }
  },
  components: {
    PictureView
  }
}
</script>

<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
