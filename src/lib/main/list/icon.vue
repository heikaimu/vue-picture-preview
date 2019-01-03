<template>
  <div class="icon-wrapper" :style="style">
		<div class="remove-icon" @mousedown="removeItem()" v-if="draggable"></div>
	</div>
</template>

<script>
export default {
	props: {
		item: {
			type: Object
		},
		cellWidth: {
			type: Number,
			default: 100
		},
		cellHeight: {
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
		url: {
			type: String,
			default: ""
		},
		draggable: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		style() {
			return {
				width: `${this.cellWidth}px`,
				height: `${this.cellHeight}px`,
				borderRadius: `${this.borderRadius}px`,
				margin: `${this.spaceBetween / 2}px`,
				background: `url(${this.url}) no-repeat center center / cover`
			};
		}
	},
	methods: {
		removeItem() {
			this.$emit("removeItem", this.item);
		}
	}
};
</script>

<style scoped lang="scss">
@keyframes shake {
	from {
		transform: rotate(-4deg);
	}
	to {
		transform: rotate(4deg);
	}
}
.icon-wrapper {
	position: relative;
	transition: all 0.3s;
	.remove-icon {
		width: 24px;
		height: 24px;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		position: absolute;
		right: 2px;
		top: 2px;
		transition: 0.2s;
		&:before {
			content: "";
			display: block;
			width: 16px;
			height: 16px;
			margin: 4px;
			background: url("../../icons/close.png");
			transition: 0.2s;
		}
		&:hover {
			background-color: #d81e06;
		}
	}
	&:hover {
		cursor: pointer;
		// &:after {
		// 	content: "";
		// 	display: block;
		// 	width: 30px;
		// 	height: 30px;
		// 	background: url("../../icons/view.png") no-repeat center center / cover;
		// 	position: absolute;
		// 	left: 50%;
		// 	margin-left: -15px;
		// 	top: 50%;
		// 	margin-top: -15px;
		// 	z-index: 9;
		// }
	}
}
.item-dragging .icon-wrapper {
	animation-name: shake;
	animation-duration: 0.07s;
	animation-iteration-count: infinite;
	animation-direction: alternate;
	&:hover {
		cursor: move;
		// &:after {
		// 	content: "";
		// 	display: block;
		// 	width: 30px;
		// 	height: 30px;
		// 	background: url("../../icons/drag.png") no-repeat center center / cover;
		// 	position: absolute;
		// 	left: 50%;
		// 	margin-left: -15px;
		// 	top: 50%;
		// 	margin-top: -15px;
		// 	z-index: 9;
		// }
	}
}
</style>
