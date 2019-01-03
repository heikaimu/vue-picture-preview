<template>
	<div id="app">
		<div class="content-box">
			<div>
				<ppview 
					:pictureList="pictureList"
					:mouseScrollable="true"
					:mouseScrollSpeed="0.1"
					:width="100"
					:height="100"
					:borderRadius="5"
					:spaceBetween="6"
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
				</ppview>
			</div>
			<button @click="addNewOne">新增</button>
		</div>
	</div>
</template>

<script>
import ppview from "./lib/main/index";
export default {
	data() {
		return {
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
		onDragstart() {
			console.log("排序开始");
		},
		onDragend() {
			console.log("排序结束");
		},
		updateList(list) {
			this.pictureList = list;
		},
		addNewOne() {
			let num = Math.random() * this.pictureList.length - 1;
			num = Math.round(num);
			num = Math.max(num, 0);
			num = Math.min(num, this.pictureList.length - 1);
			this.pictureList = [...this.pictureList, this.pictureList[num]];
		}
	},
	components: {
		ppview
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
