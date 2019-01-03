## vue图片预览与编辑插件

#### 什么时候我可能会用到它，在后台管理中需要对图片进行编辑的时候你可以尝试使用它

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

### 列表数据格式

#### 完整的字符串地址数组集合

这种数据格式是最简单的无需任何配置直接使用即可

```js
pictureList: [
 "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSIUYAuAAO3jLTBc34AAt6LAPy1R4AA7ek000.jpg",
 "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSITAcKAAMLsFkEUtAAAt6LAPvhBMAAwvI448.jpg",
 "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIVcm-AAVg9RKjYukAAt6LAPp_mAABWEN382.jpg",
 "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIIm70AAJ-NdKlhGkAAt6LAPg52EAAn5N148.jpg"
]

```

```vue
<Ppreview 
  :pictureList="pictureList"
</Ppreview>
```

#### 不完整的拼接地址类型

后台返回的地址只有后半部分，前面是公共仓库地址

```js
pictureList: [
 "/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSIUYAuAAO3jLTBc34AAt6LAPy1R4AA7ek000.jpg",
 "/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSITAcKAAMLsFkEUtAAAt6LAPvhBMAAwvI448.jpg",
 "/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIVcm-AAVg9RKjYukAAt6LAPp_mAABWEN382.jpg",
 "/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIIm70AAJ-NdKlhGkAAt6LAPg52EAAn5N148.jpg"
],
defaultProps: {
 domain: "https://desk-fd.zol-img.com.cn"
}
```

```vue
<Ppreview 
  :pictureList="pictureList"
  :defaultProps="defaultProps"
</Ppreview>
```

#### 同时有原图和缩略图的集合

```js
pictureList: [
 {
  thumbnail: "/t_s144x90c5/g5/M00/0B/00/ChMkJ1wcloSIUYAuAAO3jLTBc34AAt6LAPy1R4AA7ek000.jpg",
  original: "/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSIUYAuAAO3jLTBc34AAt6LAPy1R4AA7ek000.jpg"
 },
 {
  thumbnail: "/t_s144x90c5/g5/M00/0B/00/ChMkJ1wcloSITAcKAAMLsFkEUtAAAt6LAPvhBMAAwvI448.jpg",
  original: "/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSITAcKAAMLsFkEUtAAAt6LAPvhBMAAwvI448.jpg"
 },
 {
  thumbnail: "/t_s144x90c5/g5/M00/0B/00/ChMkJ1wcloOIVcm-AAVg9RKjYukAAt6LAPp_mAABWEN382.jpg",
  original: "/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIVcm-AAVg9RKjYukAAt6LAPp_mAABWEN382.jpg"
 },
 {
  thumbnail: "/t_s144x90c5/g5/M00/0B/00/ChMkJ1wcloOIIm70AAJ-NdKlhGkAAt6LAPg52EAAn5N148.jpg",
  original: "/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIIm70AAJ-NdKlhGkAAt6LAPg52EAAn5N148.jpg"
 }
]
defaultProps: {
 originalKey: "original",
 thumbnailKey: "thumbnail",
 domain: "https://desk-fd.zol-img.com.cn"
}
```

```vue
<Ppreview 
  :pictureList="pictureList"
  :defaultProps="defaultProps"
</Ppreview>
```

灵活的数据格式组合，能满足大多数接口数据类型。

### 事件

| Name         | Description |
| ---          | ---         |
| @onDragstart | 排序拖拽开始时候触发 |
| @onDragend   | 排序拖拽结束时候触发 |
| @updateList  | 图片顺序发生变化以及删除时候都会触发，主要用来更新原始数据 |

#### 添加图片时候的注意事项

添加图片时候请使用如下方式来替代push方法，否则无法触发试图更新：

```
addNewOne() {
 let num = Math.random() * this.pictureList.length - 1;
 num = Math.round(num);
 num = Math.max(num, 0);
 num = Math.min(num, this.pictureList.length - 1);
 this.pictureList = [...this.pictureList, this.pictureList[num]];
}
```
