<template>
  <div class="thumbnail-wrapper">
    <ul class="content" :style="style">
      <li 
        v-for="item in items" 
        :key="item.index" 
        :class="{light:item.sort===initSlide}"
        :style="{width: `${thumbnailWidth}px`,
				height: `${thumbnailHeight}px`,
				background: `url(${item.item.thumbnailUrl}) no-repeat center center / cover`}"
        @click="view(item.sort)"
      ></li>
    </ul>
  </div>
</template>

<script>
import windowSize from "../../../mixins/windowSize.js";
export default {
	mixins: [windowSize],
	props: {
		items: {
			type: Array
		},
		initSlide: {
			type: Number
		},
		thumbnailWidth: {
			type: Number
		},
		thumbnailHeight: {
			type: Number
		}
	},
	computed: {
		style() {
			const { left } = this;
			return {
				width: `${this.items.length * (this.thumbnailWidth + 2)}px`,
				height: `${this.thumbnailHeight + 4}px`,
				transform: `translate3d(${left}, 0, 0)`
			};
		},
		left() {
			const shiftX =
				this.initSlide * (this.thumbnailWidth + 2) + this.thumbnailWidth / 2;
			return `${this.windowWidth / 2 - shiftX}px`;
		}
	},
	methods: {
		view(sort) {
			this.$emit("view", sort);
		}
	}
};
</script>

<style scoped lang="scss">
.thumbnail-wrapper {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	background: rgba($color: #000000, $alpha: 0.8);
	.content {
		display: flex;
		transition: 0.3s;
		li {
			list-style: none;
			position: relative;
			margin: 2px 1px;
			&.light {
				&:after {
					content: "";
					display: block;
					position: absolute;
					left: -2px;
					right: -2px;
					top: -2px;
					bottom: -2px;
					border: 2px solid #f1f1f1;
				}
			}
		}
	}
}
</style>
