<template>
  <div>
		<template v-if="menuType==='slide'||menuType==='all'">
			<div class="slider-menu prev" :class="{disabled: initSlide === 0}" @click="onMove(-1)"></div>
			<div class="slider-menu next" :class="{disabled: initSlide === itemsLength - 1}" @click="onMove(1)"></div>
		</template>
		<div class="toolbar-wrapper" :style="{bottom:`${thumbnailHeight + 20}px`}" v-if="menuType==='bottom'||menuType==='all'">
			<ul class="toolbar">
				<li class="zoom-in" @click="onScale(-1)"></li>
				<li class="zoom-out" @click="onScale(1)"></li>
				<li class="prev" @click="onMove(-1)"></li>
				<li class="next" @click="onMove(1)"></li>
				<li class="rotate-left" @click="onRotate(90)"></li>
				<li class="rotate-right" @click="onRotate(-90)"></li>
			</ul>
		</div>
  </div>
</template>

<script>
export default {
	props: {
		initSlide: {
			type: Number
		},
		itemsLength: {
			type: Number,
			default: 0
		},
		thumbnailHeight: {
			type: Number
		},
		menuType: {
			type: String
		}
	},
	methods: {
		onMove(val) {
			this.$emit("onMove", val);
		},
		onScale(val) {
			this.$emit("onScale", val);
		},
		onRotate(val) {
			this.$emit("onRotate", val);
		}
	}
};
</script>

<style scoped lang="scss">
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
.toolbar-wrapper {
	position: fixed;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	.toolbar {
		display: flex;
		justify-content: center;
		li {
			color: #fff;
			margin: 0 2px;
			list-style: none;
			width: 24px;
			height: 24px;
			cursor: pointer;
			border-radius: 50%;
			transition: 0.2s;
			background-repeat: no-repeat;
			background-color: rgba(0, 0, 0, 0.5);
			&:hover {
				background-color: rgba(0, 0, 0, 0.9);
			}
			&:before {
				margin: 2px;
				font-size: 0;
				line-height: 0;
				display: block;
				width: 20px;
				height: 20px;
				color: transparent;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC);
				background-repeat: no-repeat;
			}
			&.zoom-in {
				&:before {
					content: "Zoom In";
					background-position: 0 0;
				}
			}
			&.zoom-out {
				&:before {
					content: "Zoom Out";
					background-position: -20px 0;
				}
			}
			&.prev {
				&:before {
					content: "Prev";
					background-position: -80px 0;
				}
			}
			&.next {
				&:before {
					content: "Next";
					background-position: -120px 0;
				}
			}
			&.rotate-left {
				&:before {
					content: "Rotate Left";
					background-position: -140px 0;
				}
			}
			&.rotate-right {
				&:before {
					content: "Rotate right";
					background-position: -160px 0;
				}
			}
		}
	}
}
</style>
