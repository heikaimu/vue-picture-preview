<template>
	<transition name="fade">
		<div class="picture-float-container" v-if="show">
			<!-- 关闭按钮 -->
			<close @closeFloat="closeFloat"></close>
			<!-- 大图区域 -->
			<swiper 
				:imgSrc="imgSrc" 
				:mouseScrollable="mouseScrollable" 
				:mouseScrollSpeed="mouseScrollSpeed"
				ref="swiper"
			></swiper>
			<!-- 按钮 -->
			<menus 
				:initSlide="initSlide" 
				:itemsLength="items.length" 
				:thumbnailHeight="thumbnailHeight"
				:menuType="menuType"
				@onMove="onMove"
				@onScale="onScale"
				@onRotate="onRotate"
			></menus>
			<!-- 缩略图 -->
			<thumbnail 
				v-if="thumbnail"
				:thumbnailWidth="thumbnailWidth"
				:thumbnailHeight="thumbnailHeight"
				:items="items" 
				:initSlide="initSlide"
				@view="onView"
			></thumbnail>
		</div>
	</transition>
</template>

<script>
import close from "./close";
import swiper from "./swiper";
import menus from "./menus";
import thumbnail from "./thumbnail";
export default {
	props: {
		items: {
			default: () => []
		},
		initSlide: {
			type: Number,
			default: -1
		},
		show: {
			type: Boolean,
			default: false
		},
		mouseScrollable: {
			type: Boolean
		},
		mouseScrollSpeed: {
			type: Number
		},
		menuType: {
			type: String
		},
		thumbnail: {
			type: Boolean
		},
		thumbnailWidth: {
			type: Number
		},
		thumbnailHeight: {
			type: Number
		},
		menuType: {
			type: String
		}
	},
	data() {
		return {
			imgSrc: ""
		};
	},
	watch: {
		initSlide: {
			handler(slide = 0) {
				const currentItem = this.items.find(item => {
					return item.sort === slide;
				});
				this.imgSrc = currentItem ? currentItem.item.originalUrl : "";
			},
			immediate: true
		}
	},
	methods: {
		closeFloat() {
			this.$emit("update:show", false);
		},
		onMove(val) {
			let newVal = this.initSlide + val;
			newVal = Math.min(newVal, this.items.length - 1);
			newVal = Math.max(newVal, 0);
			this.$emit("update:initSlide", newVal);
		},
		onView(sort) {
			this.$emit("update:initSlide", sort);
		},
		onScale(val) {
			this.$refs.swiper.onScale(val);
		},
		onRotate(val) {
			this.$refs.swiper.onRotate(val);
		}
	},
	components: {
		close,
		swiper,
		menus,
		thumbnail
	}
};
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.picture-float-container {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 9999999;
	background: rgba(0, 0, 0, 0.9);
}
</style>
