<template>
	<transition name="fade">
		<div class="picture-float-container" v-if="show">
			<!-- 关闭按钮 -->
			<div class="close" @click="closeFloat"></div>
			<!-- 大图区域 -->
			<div class="swiper-container">
				<swiper :imgSrc="imgSrc" :mouseScrollable="mouseScrollable" :mouseScrollSpeed="mouseScrollSpeed"></swiper>
			</div>
			<!-- 左右侧按钮 -->
			<div class="slider-menu prev" :class="{disabled: initSlide === 0}" @click="onMove(-1)"></div>
			<div class="slider-menu next" :class="{disabled: initSlide === items.length - 1}" @click="onMove(1)"></div>
		</div>
	</transition>
</template>

<script>
import swiper from "./swiper";
export default {
	props: {
		items: {
			default: () => []
		},
		initSlide: {
			type: Number,
			default: 0
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
			type: String,
			default: "normal"
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
		}
	},
	components: {
		swiper
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
	background: rgba(0, 0, 0, 0.7);
	color: #fff;
	.close {
		position: absolute;
		top: -40px;
		right: -40px;
		width: 80px;
		height: 80px;
		cursor: pointer;
		border-radius: 50%;
		background-color: #000;
		background-color: rgba(0, 0, 0, 0.5);
		transition: 0.2s;
		&:before {
			content: "";
			display: block;
			width: 16px;
			height: 16px;
			background: url("../../icons/close.png");
			position: absolute;
			left: 18px;
			top: 48px;
			transition: 0.2s;
		}
		&:hover {
			background-color: #d81e06;
		}
	}
	.swiper-container {
		position: absolute;
		left: 0;
		top: 40px;
		right: 0;
		bottom: 60px;
	}
	.slider-menu {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.3);
		position: absolute;
		top: 50%;
		z-index: 33;
		margin-top: -40px;
		transition: 0.2s;
		cursor: pointer;
		&.disabled {
			opacity: 0.2;
			cursor: not-allowed;
			&:hover {
				background-color: rgba(0, 0, 0, 0.3);
			}
		}
		&:hover {
			background-color: rgba(0, 0, 0, 0.8);
		}
		&.prev {
			left: 20px;
			&:before {
				content: "";
				margin: 16px 12px;
				font-size: 0;
				line-height: 0;
				display: block;
				width: 48px;
				height: 48px;
				color: transparent;
				background: url("../../icons/left.png");
			}
		}
		&.next {
			right: 20px;
			&:before {
				content: "";
				margin: 16px 0px 16px 20px;
				font-size: 0;
				line-height: 0;
				display: block;
				width: 48px;
				height: 48px;
				color: transparent;
				background: url("../../icons/right.png");
			}
		}
	}
}
</style>
