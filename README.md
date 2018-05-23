Vue的图片查看组件

### 安装
```
npm i vue-simple-picture-privew -S
```

### 引入

test.vue
```
<template>
  <div id="app">
    <VuePicturePreview
      :pictureList="pictureList"
    ></VuePicturePreview>
  </div>
</template>
import VuePicturePreview from 'vue-simple-picture-preview';
export default {
    data() {
      return {
        pictureList: []
      }
    },
    components: {
      VuePicturePreview
    }
  }
```

### 参数
```
isRotate  // 是否显示旋转，默认true
isMove // 是否显示前进后退，默认true
isClikcImgClose  // 是否开启点击图片关闭弹出层，默认false
isMenu // 是否显示按钮栏，默认true
```
