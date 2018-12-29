<template>
	<div class="preview-container">
		<picture-list :items="listItems" :cellWidth="width" :cellHeight="height" :borderRadius="borderRadius" :spaceBetween="spaceBetween" :draggable="isEdit" @sort="sort" @click="onClick"></picture-list>
		<picture-float :items="floatItems" :initSlide.sync="initSlide" :show.sync="showFloat" :mouseScrollable="mouseScrollable" :mouseScrollSpeed="mouseScrollSpeed"></picture-float>
	</div>
</template>

<script>
import pictureList from "./list";
import pictureFloat from "./float";
export default {
	props: {
		pictureList: {
			default: () => []
		},
		defaultProps: {
			default: () => {}
		},
		width: {
			type: Number,
			default: 100
		},
		height: {
			type: Number,
			default: 100
		},
		borderRadius: {
			type: Number,
			default: 5
		},
		spaceBetween: {
			type: Number,
			default: 5
		},
		isEdit: {
			type: Boolean,
			default: false
		},
		mouseScrollable: {
			type: Boolean,
			default: true
		},
		mouseScrollSpeed: {
			type: Number,
			default: 0.05
		}
	},
	data() {
		return {
			listItems: [],
			floatItems: [],
			showFloat: false,
			initSlide: 0
		};
	},
	watch: {
		pictureList: {
			handler(nextItems = []) {
				if (nextItems.length !== 0) {
					if (typeof nextItems[0] === "object") {
						if (this.defaultProps && this.defaultProps.domain) {
							this.listItems = this.pictureList.map(item => {
								return {
									main: item,
									thumbnailUrl: `${this.defaultProps.domain}${
										item[this.defaultProps.thumbnailKey]
									}`,
									originalUrl: `${this.defaultProps.domain}${
										item[this.defaultProps.originalKey]
									}`
								};
							});
						} else {
							this.listItems = this.pictureList.map(item => {
								return {
									main: item,
									thumbnailUrl: `${item[this.defaultProps.thumbnailKey]}`,
									originalUrl: `${item[this.defaultProps.originalKey]}`
								};
							});
						}
					} else if (typeof nextItems[0] === "string") {
						if (this.defaultProps && this.defaultProps.domain) {
							this.listItems = this.pictureList.map(item => {
								return {
									main: item,
									thumbnailUrl: `${this.defaultProps.domain}${item}`,
									originalUrl: `${this.defaultProps.domain}${item}`
								};
							});
						} else {
							this.listItems = this.pictureList.map(item => {
								return {
									main: item,
									thumbnailUrl: `${item}`,
									originalUrl: `${item}`
								};
							});
						}
					}
				}
			},
			immediate: true
		},
		// 全屏滚动禁止
		showFloat() {
			if (this.showFloat) {
				document.body.style.overflow = "hidden";
			} else {
				document.body.style.overflow = "auto";
			}
		}
	},
	methods: {
		sort(data) {
			const list = data.items.map(item => {
				return item.item.main;
			});
			this.$emit("updateList", list);
		},
		onClick(data) {
			this.initSlide = data.sort;
			this.floatItems = data.event.items;
			this.showFloat = true;
		}
	},
	components: {
		pictureList,
		pictureFloat
	}
};
</script>

<style>
</style>
