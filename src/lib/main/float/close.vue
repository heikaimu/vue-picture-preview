<template>
  <div class="close" @click="closeFloat"></div>
</template>

<script>
export default {
	methods: {
		closeFloat() {
			this.$emit("closeFloat");
		}
	}
};
</script>

<style scoped lang="scss">
.close {
	position: absolute;
	top: -40px;
	right: -40px;
	z-index: 99999;
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
</style>
