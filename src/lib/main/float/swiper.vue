<template>
  <div class="swiper-wrapper" @mousedown="mousedown" @touchstart.stop="mousedown" ref="imgWrapper">
    <img :src="imgSrc" alt="" :style="style">
  </div>
</template>

<script>
const CLICK_PIXEL_DISTANCE = 5;
export default {
	props: {
		imgSrc: {
			type: String
		},
		mouseScrollable: {
			type: Boolean
		},
		mouseScrollSpeed: {
			type: Number
		}
	},
	data() {
		return {
			animate: false,
			dragging: false,
			shiftX: 0,
			shiftY: 0,
			shiftStartX: 0,
			shiftStartY: 0,
			mouseMoveStartX: 0,
			mouseMoveStartY: 0,
			scale: 1,
			rotate: 0
		};
	},
	watch: {
		imgSrc() {
			this.resetImg();
		}
	},
	computed: {
		style() {
			const { left, top, scale, rotate } = this;
			return {
				transform: `translate3d(${left}px, ${top}px, 0) scale(${scale}) rotate(${rotate}deg)`
			};
		},
		left() {
			return this.dragging ? this.shiftX : this.shiftX;
		},
		top() {
			return this.dragging ? this.shiftY : this.shiftY;
		}
	},
	mounted() {
		this.$refs.imgWrapper.addEventListener("mousewheel", this.mouseScroll);
	},
	methods: {
		preventDefault(event) {
			event.preventDefault();
		},
		mousedown(event) {
			this.dragStart(event);
			document.addEventListener("mouseup", this.documentMouseUp);
			document.addEventListener("touchend", this.documentMouseUp);
		},
		dragStart(event) {
			let e = event.touches ? event.touches[0] : event;
			if (e) e.preventDefault();
			this.shiftX = this.shiftStartX = this.left;
			this.shiftY = this.shiftStartY = this.top;
			this.mouseMoveStartX = e.pageX;
			this.mouseMoveStartY = e.pageY;
			this.animate = false;
			this.dragging = true;
			document.addEventListener("mousemove", this.documentMouseMove);
			document.addEventListener("touchmove", this.documentMouseMove);
		},
		documentMouseMove(event) {
			if (this.dragging) {
				this.drag(event);
			}
		},
		drag(event) {
			let e = event.touches ? event.touches[0] : event;
			let distanceX = e.pageX - this.mouseMoveStartX;
			let distanceY = e.pageY - this.mouseMoveStartY;
			this.shiftX = this.shiftStartX + distanceX;
			this.shiftY = this.shiftStartY + distanceY;
		},
		documentMouseUp() {
			let dx = this.shiftX - this.shiftStartX;
			let dy = this.shiftY - this.shiftStartY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			this.dragging = false;
			this.animate = true;
			this.mouseMoveStartX = 0;
			this.mouseMoveStartY = 0;
			this.shiftStartX = 0;
			this.shiftStartY = 0;
			document.removeEventListener("mousemove", this.documentMouseMove);
			document.removeEventListener("touchmove", this.documentMouseMove);
			document.removeEventListener("mouseup", this.documentMouseUp);
			document.removeEventListener("touchend", this.documentMouseUp);
			if (distance < CLICK_PIXEL_DISTANCE) {
				this.resetImg();
			} else {
				// console.log("拖动结束");
			}
		},
		mouseScroll(event) {
			if (this.mouseScrollable) {
				this.scroll(event);
			}
		},
		scroll() {
			let e = event.touches ? event.touches[0] : event;
			if (e.deltaY > 0) {
				this.scale -= this.mouseScrollSpeed;
				if (this.scale < 0.4) {
					this.scale = 0.4;
				}
			} else {
				this.scale += this.mouseScrollSpeed;
				if (this.scale > 3) {
					this.scale = 3;
				}
			}
		},
		onScale(val) {
			if (val > 0) {
				this.scale -= this.mouseScrollSpeed;
				if (this.scale < 0.4) {
					this.scale = 0.4;
				}
			} else {
				this.scale += this.mouseScrollSpeed;
				if (this.scale > 3) {
					this.scale = 3;
				}
			}
		},
		onRotate(val) {
			this.rotate += val;
		},
		resetImg() {
			this.scale = 1;
			this.shiftX = 0;
			this.shiftY = 0;
			this.rotate = 0;
		}
	},
	beforeDestroy() {
		this.$refs.imgWrapper.removeEventListener("mousewheel", this.mouseScroll);
	}
};
</script>

<style scoped lang="scss">
.swiper-wrapper {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 9998;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		max-width: 100%;
		max-height: 100%;
		cursor: move;
	}
}
</style>
