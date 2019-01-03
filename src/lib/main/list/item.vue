<template>
	<div :class="className" ref="self" :style="style" @mousedown="mousedown" @touchstart.stop="mousedown">
		<slot></slot>
	</div>
</template>

<script>
const CLICK_PIXEL_DISTANCE = 5;

export default {
	props: {
		index: {
			//索引
			type: Number
		},
		sort: {
			// 排序
			type: Number
		},
		cellWidth: {
			//宽
			type: Number
		},
		cellHeight: {
			//高
			type: Number
		},
		rowCount: {
			//一排的个数
			type: Number
		},
		rowShift: {
			// 整体偏移量
			type: Number,
			default: 0
		},
		draggable: {
			// 是否可以拖动
			type: Boolean
		},
		dragDelay: {
			// 拖动延迟
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			animate: true,
			dragging: false,
			shiftStartX: 0,
			shiftStartY: 0,
			mouseMoveStartX: 0,
			mouseMoveStartY: 0,
			shiftX: 0,
			shiftY: 0,
			timer: null,
			zIndex: 1
		};
	},
	mounted() {
		//监听位移，位移结束后z-inde变为-1
		this.$refs.self.addEventListener(
			"transitionend",
			event => {
				if (!this.dragging) {
					this.zIndex = 1;
				}
			},
			false
		);
	},
	computed: {
		// 设置classname,拖拽的时候不给动画，放手之后再添加动画
		className() {
			let { animate, dragging } = this;
			return [
				"item-wrapper",
				{
					"item-animate": animate,
					"item-dragging": dragging
				}
			];
		},
		// 设置样式
		style() {
			let { zIndex, cellWidth, cellHeight, borderRadius, left, top } = this;
			return {
				zIndex,
				width: cellWidth + "px",
				height: cellHeight + "px",
				transform: `translate3d(${left}px, ${top}px, 0)`
			};
		},
		// 拖动中则为拖动的位置，静止状态的时候根据横排位置计算出left
		left() {
			return this.dragging
				? this.shiftX
				: this.rowShift + (this.sort % this.rowCount) * this.cellWidth;
		},
		// 拖动中则为拖动的位置，静止状态的时候根据竖排位置计算出top
		top() {
			return this.dragging
				? this.shiftY
				: Math.floor(this.sort / this.rowCount) * this.cellHeight;
		}
	},
	methods: {
		// 公用事件返回
		wrapEvent(event) {
			let { index, sort } = this;
			return { event, index, sort };
		},
		//点击开始，延迟之后执行事件，点击了之后就绑定松手的监听事件
		mousedown(event) {
			if (this.draggable) {
				this.timer = setTimeout(() => {
					this.dragStart(event);
				}, this.dragDelay);
				document.addEventListener("mouseup", this.documentMouseUp);
				document.addEventListener("touchend", this.documentMouseUp);
			} else {
				document.addEventListener("mouseup", this.documentMouseUp);
				document.addEventListener("touchend", this.documentMouseUp);
			}
		},
		//拖拽开始，设置初始值，此时拖拽的起点终点都等于块的初始偏移值，监听移动事件，鼠标的初始位置为点击的位置
		dragStart(event) {
			let e = event.touches ? event.touches[0] : event;

			this.zIndex = 2;

			this.shiftX = this.shiftStartX = this.left;
			this.shiftY = this.shiftStartY = this.top;

			this.mouseMoveStartX = e.pageX;
			this.mouseMoveStartY = e.pageY;

			this.animate = false;
			this.dragging = true;

			document.addEventListener("mousemove", this.documentMouseMove);
			document.addEventListener("touchmove", this.documentMouseMove);

			this.$emit("dragstart", this.wrapEvent(event));
		},
		// 移动的距离等于当前鼠标的位置减去初始位置，当前的块位置为初始的块位置加上鼠标的移动距离
		drag(event) {
			let e = event.touches ? event.touches[0] : event;

			let distanceX = e.pageX - this.mouseMoveStartX;
			let distanceY = e.pageY - this.mouseMoveStartY;

			this.shiftX = distanceX + this.shiftStartX;
			this.shiftY = distanceY + this.shiftStartY;

			// 计算移动的身位，四舍五入
			let gridX = Math.round((this.shiftX - this.rowShift) / this.cellWidth);
			let gridY = Math.round(this.shiftY / this.cellHeight);
			gridX = Math.min(gridX, this.rowCount - 1);
			gridY = Math.max(gridY, 0);
			let gridPosition = gridX + gridY * this.rowCount;
			const $event = {
				event,
				distanceX,
				distanceY,
				positionX: this.shiftX,
				positionY: this.shiftY,
				index: this.index,
				gridX,
				gridY,
				gridPosition
			};
			this.$emit("drag", $event);
		},
		// 如果允许拖动，并且在拖动中，执行拖拽事件
		documentMouseMove(event) {
			if (this.draggable && this.dragging) {
				this.drag(event);
			}
		},
		// 松手后，清楚计时器，还原一切位置，并且判断移动的距离，如果低于5px则为点击，否则才为移动结束。清楚所有事件监听
		documentMouseUp(event) {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			let dx = this.shiftStartX - this.shiftX;
			let dy = this.shiftStartY - this.shiftY;
			let distance = Math.sqrt(dx * dx + dy * dy);
			this.animate = true;
			this.dragging = false;
			this.mouseMoveStartX = 0;
			this.mouseMoveStartY = 0;
			this.shiftStartX = 0;
			this.shiftStartY = 0;
			document.removeEventListener("mousemove", this.documentMouseMove);
			document.removeEventListener("touchmove", this.documentMouseMove);
			document.removeEventListener("mouseup", this.documentMouseUp);
			document.removeEventListener("touchend", this.documentMouseUp);
			let $event = this.wrapEvent(event);
			if (distance < CLICK_PIXEL_DISTANCE) {
				this.$emit("click", $event);
			}
			this.$emit("dragend", $event);
		}
	}
};
</script>

<style scoped lang="scss">
.item-wrapper {
	display: block;
	position: absolute;
	box-sizing: border-box;
	left: 0;
	top: 0;
	user-select: none;
	transform: translate3d(0px, 0px, 0px);
	z-index: 1;
}
.item-animate {
	transition: transform 800ms ease;
}
</style>
