## vue图片预览与编辑插件

### 什么时候我可能会用到它，在后台管理中需要对图片进行编辑的时候你可以尝试使用它

### 安装

```
npm i vue-simple-picture-preview -S
```

### 使用

在需要使用的组件里面引入并注册：
```js
import Ppreview from "vue-simple-picture-preview";
components: {
  Ppreview
}
```

然后你就可以开始使用它了

```vue
<Ppreview 
  :pictureList="pictureList"
  :containerWidth="800"
  :width="100"
  :height="100"
  :borderRadius="5"
  :spaceBetween="5"
  menuType="all"
  :mouseScrollable="true"
  :mouseScrollSpeed="0.1"
  :thumbnail="true"
  :thumbnailWidth="50"
  :thumbnailHeight="70"
  :isEdit="true"
  @onDragstart="onDragstart"
  @onDragend="onDragend"
  @updateList="updateList"
>
</Ppreview>
```

### 参数

| Name            | Type     | Default   | Description       |
| ---             | ---      | ---       | ---               |
| pictureList     | Array    | []        | 图片列表数组，支持多种数据格式，具体见下方数据格式 |
| defaultProps    | Object   | {}        | 列表数据格式配置，配合pictureList使用，具体见下方数据格式 |
| containerWidth  | Number   | -1        | 外容器的宽度，如果不定义默认是100%，不会超过屏幕 |
| width           | Number   | 100       | 列表图片的单个宽度  |
| height          | Number   | 100       | 列表图片的单个高度  |
| borderRadius    | Number   | 5         | 列表图片的圆角  |
| spaceBetween    | Number   | 5         | 列表图片之间的间隔  |
| menuType        | String   | all       | 大图预览的时候的按钮样式，共三种选择 all/slide/bottom  |
| mouseScrollable | Boolean  | true      | 是否支持鼠标缩放图片 |
| mouseScrollSpeed| Number   | 0.05      | 缩放的速度，越大越快 |
| thumbnail       | Boolean  | true      | 大图预览时候下方的缩略图是否显示  |
| thumbnailWidth  | Number   | 50        | 缩略图宽度  |
| thumbnailHeight | Number   | 70        | 缩略图高度  |
| isEdit          | Boolean  | false     | 是否开启编辑模式，编辑模式下可以拖动排序删除图片  |
