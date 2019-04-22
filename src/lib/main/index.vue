<template>
	<div class="preview-container">
		<picture-list :items="listItems" :cellWidth="width" :cellHeight="height" :borderRadius="borderRadius" :spaceBetween="spaceBetween" :draggable="isEdit" :containerWidth="containerWidth" :center="center" @sort="sort" @click="onClick" @onDragstart="onDragstart" @onDragend="onDragend">
		</picture-list>
		<picture-float :items="floatItems" :initSlide.sync="initSlide" :show.sync="showFloat" :mouseScrollable="mouseScrollable" :mouseScrollSpeed="mouseScrollSpeed" :thumbnail="thumbnail" :thumbnailWidth="thumbnailWidth" :thumbnailHeight="thumbnailHeight" :menuType="menuType">
		</picture-float>
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
			default: 6
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
		},
		thumbnail: {
			type: Boolean,
			default: true
		},
		thumbnailWidth: {
			type: Number,
			default: 50
		},
		thumbnailHeight: {
			type: Number,
			default: 70
		},
		menuType: {
			type: String,
			default: "all"
		},
		containerWidth: {
			type: Number,
			default: -1
		},
		center: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			listItems: [],
			floatItems: [],
			showFloat: false,
			initSlide: -1,
			timer: null
		};
	},
	watch: {
		pictureList: {
			handler(nextItems = [], oldItems = []) {
				// 只有当心的数据大于老数据的长度的时候才会重新构造数据，否则会起动画冲突
				if (nextItems.length > oldItems.length) {
					this.createdList(nextItems);
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
		refresh() {
			setTimeout(() => {
				this.createdList(this.pictureList);
			}, 50);
		},
		createdList(nextItems) {
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
		onClick(data) {
			// 点击之后设置延迟，延迟之后才真正触发点击事件，主要是为了和删除按钮区分开来
			this.timer = setTimeout(() => {
				this.initSlide = data.sort;
				this.floatItems = data.event.items;
				this.showFloat = true;
			}, 500);
		},
		sort(data) {
			// 如果是删除的时候，数据有变化，此时清楚延迟器，阻止点击事件触发
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			const list = data.items.map(item => {
				return item.item.main;
			});
			this.$emit("updateList", list);
		},
		onDragstart() {
			this.$emit("onDragstart");
		},
		onDragend() {
			this.$emit("onDragend");
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
