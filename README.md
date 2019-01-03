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
...
components: {
  Ppreview
}
```

然后你就可以开始使用它了

```vue
<Ppreview 
					:pictureList="pictureList"
					:mouseScrollable="true"
					:mouseScrollSpeed="0.1"
					:width="160"
					:height="160"
					:borderRadius="10"
					:spaceBetween="10"
					:thumbnail="true"
					:thumbnailWidth="50"
					:thumbnailHeight="70"
					:isEdit="true"
					:containerWidth="800"
					:center="false"
					menuType="all"
					@onDragstart="onDragstart"
					@onDragend="onDragend"
					@updateList="updateList"
				>
				</Ppreview>
```
