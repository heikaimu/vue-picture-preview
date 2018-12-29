<template>
	<div id="app">
		<div class="content-box">
			<div>
				<!-- <PictureView :pictureList="pictureList" :props="defaultProps" :width="100" :height="100" :borderRadius="5" :spaceBetween="5" :isEdit="true" :isMousewheelScale="true" :mousewheelScaleSpeed="0.06" :keyboardControl="false" :menuType="'all'" @pictureUpdated="pictureUpdated">
          <button @click="addPic">添加图片</button>
        </PictureView>
        <button @click="showPic">看图片地址</button> -->
				<test :pictureList="pictureList" :mouseScrollable="true" :mouseScrollSpeed="0.1" :width="160" :height="160" :borderRadius="10" :spaceBetween="10" :isEdit="true" @sort="onSort" @updateList="updateList"></test>
			</div>
			<div style="height:2000px">
				<ul>
					<li></li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import test from "./lib/main/index";
import PictureView from "./lib/code/index";
export default {
	data() {
		return {
			keyboardControl: true,
			mousewheelScaleSpeed: 0.1,
			spaceBetween: 5,
			pictureList: [
				"https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSIUYAuAAO3jLTBc34AAt6LAPy1R4AA7ek000.jpg",
				"https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSITAcKAAMLsFkEUtAAAt6LAPvhBMAAwvI448.jpg",
				"https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIVcm-AAVg9RKjYukAAt6LAPp_mAABWEN382.jpg",
				"https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIIm70AAJ-NdKlhGkAAt6LAPg52EAAn5N148.jpg"
			],
			pictureList1: [
				"/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSIUYAuAAO3jLTBc34AAt6LAPy1R4AA7ek000.jpg",
				"/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSITAcKAAMLsFkEUtAAAt6LAPvhBMAAwvI448.jpg",
				"/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIVcm-AAVg9RKjYukAAt6LAPp_mAABWEN382.jpg",
				"/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIIm70AAJ-NdKlhGkAAt6LAPg52EAAn5N148.jpg"
			],
			pictureList2: [
				{
					thumbnail:
						"/t_s144x90c5/g5/M00/0B/00/ChMkJ1wcloSIUYAuAAO3jLTBc34AAt6LAPy1R4AA7ek000.jpg",
					original:
						"/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSIUYAuAAO3jLTBc34AAt6LAPy1R4AA7ek000.jpg"
				},
				{
					thumbnail:
						"/t_s144x90c5/g5/M00/0B/00/ChMkJ1wcloSITAcKAAMLsFkEUtAAAt6LAPvhBMAAwvI448.jpg",
					original:
						"/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloSITAcKAAMLsFkEUtAAAt6LAPvhBMAAwvI448.jpg"
				},
				{
					thumbnail:
						"/t_s144x90c5/g5/M00/0B/00/ChMkJ1wcloOIVcm-AAVg9RKjYukAAt6LAPp_mAABWEN382.jpg",
					original:
						"/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIVcm-AAVg9RKjYukAAt6LAPp_mAABWEN382.jpg"
				},
				{
					thumbnail:
						"/t_s144x90c5/g5/M00/0B/00/ChMkJ1wcloOIIm70AAJ-NdKlhGkAAt6LAPg52EAAn5N148.jpg",
					original:
						"/t_s960x600c5/g5/M00/0B/00/ChMkJ1wcloOIIm70AAJ-NdKlhGkAAt6LAPg52EAAn5N148.jpg"
				}
			],
			defaultProps: {
				originalKey: "original",
				thumbnailKey: "thumbnail",
				domain: "https://desk-fd.zol-img.com.cn"
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
		updateList(list) {
			// this.pictureList = list;
			console.log(list);
		},
		pictureUpdated(data) {
			console.log(data);
		},
		onSort(list) {
			console.log(list);
		}
	},
	components: {
		PictureView,
		test
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
.content-box {
}
</style>
