<template>
	<div class="picture-list" :style="style">
		<item v-for="item in list" :key="item.index" :index="item.index" :sort="item.sort" :draggable="draggable" :dragDelay="dragDelay" :rowCount="rowCount" :rowShift="rowShift" :cellWidth="cellWidth+spaceBetween" :cellHeight="cellHeight+spaceBetween" @dragstart="onDragstart" @drag="onDrag" @click="onClick" @dragend="onDragend">
			<div class="content" :style="contentStyle">
				<div class="pic" :class="className" :style="{background:`url(${item.item.thumbnailUrl}) no-repeat center center / cover`,borderRadius:`${borderRadius}px`}">
					<div class="remove-icon" @click.stop="removeItem(item)" v-if="draggable"></div>
				</div>
			</div>
		</item>
	</div>
</template>

<script>
import item from "./item";
import windowSize from "../../../mixins/windowSize.js";
export default {
	mixins: [windowSize],
	props: {
		items: {
			default: () => []
		},
		gridWidth: {
			default: -1
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
		draggable: {
			type: Boolean,
			default: false
		},
		dragDelay: {
			type: Number,
			default: 0
		},
		center: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			list: []
		};
	},
	watch: {
		items: {
			handler: function(nextItems = []) {
				this.list = nextItems.map((item, index) => {
					return {
						item,
						index: index,
						sort: index
					};
				});
				console.log(this.list);
			},
			immediate: true
		}
	},
	computed: {
		gridResponsiveWidth() {
			if (this.gridWidth < 0) {
				return this.windowWidth;
			} else {
				return Math.min(this.windowWidth, this.gridWidth);
			}
		},
		rowCount() {
			return Math.floor(this.gridResponsiveWidth / this.cellWidth);
		},
		rowShift() {
			if (this.center) {
				let contentWidth = this.items.length * this.cellWidth;
				let rowShift =
					contentWidth < this.gridResponsiveWidth
						? (this.gridResponsiveWidth - contentWidth) / 2
						: (this.gridResponsiveWidth % contentWidth) / 2;
				return Math.floor(rowShift);
			} else {
				return 0;
			}
		},
		height() {
			return Math.ceil(this.items.length / this.rowCount) * this.cellHeight;
		},
		style() {
			return {
				height: this.height + "px",
				marginLeft: -this.spaceBetween / 2 + "px",
				marginRight: -this.spaceBetween / 2 + "px"
			};
		},
		contentStyle() {
			return {
				padding: this.spaceBetween / 2 + "px"
			};
		},
		className() {
			return [
				{
					view: !this.draggable,
					drag: this.draggable
				}
			];
		}
	},
	methods: {
		wrapEvent(other = {}) {
			return {
				datetime: Date.now(),
				items: this.getListClone(),
				...other
			};
		},
		/* Returns sorted clone of "list" array */
		getListClone() {
			return this.list.slice(0).sort((a, b) => {
				return a.sort - b.sort;
			});
			//  .map(v => {
			//    return { ...v.item }
			//  })
		},
		onClick(event) {
			if (!this.draggable) {
				const data = {
					sort: event.sort,
					event: this.wrapEvent()
				};
				this.$emit("click", data);
			}
		},
		onDragend() {
			// console.log("移动结束");
		},
		onDragstart() {
			// console.log("移动开始");
		},
		onDrag(event) {
			this.sortList(event.index, event.gridPosition);
		},
		removeItem({ index }) {
			let removeItem = this.list.find(item => item.index === index);
			let removeItemSort = removeItem.sort;
			this.list = this.list
				.filter(item => {
					return item.index !== index;
				})
				.map(item => {
					let sort = item.sort > removeItemSort ? item.sort - 1 : item.sort;
					return {
						...item,
						sort
					};
				});
			this.$emit("sort", this.wrapEvent());
		},
		sortList(index, gridPosition) {
			gridPosition = Math.max(gridPosition, 0);
			gridPosition = Math.min(gridPosition, this.list.length - 1);
			const targetItem = this.list.find(item => item.index === index);
			const targetItemSort = targetItem.sort;
			if (targetItemSort !== gridPosition) {
				this.list = this.list.map(item => {
					// 首先改变拖动的块的排序值
					if (item.index === targetItem.index) {
						return {
							...item,
							sort: gridPosition
						};
					}
					const { sort } = item;
					// 左拖动
					if (targetItemSort > gridPosition) {
						if (sort <= targetItemSort && sort >= gridPosition) {
							return {
								...item,
								sort: sort + 1
							};
						}
					}
					// 右拖动
					if (targetItemSort < gridPosition) {
						if (sort >= targetItemSort && sort <= gridPosition) {
							return {
								...item,
								sort: sort - 1
							};
						}
					}
					return item;
				});
				this.$emit("sort", this.wrapEvent());
			}
		}
	},
	components: {
		item
	}
};
</script>

<style scoped lang="scss">
.picture-list {
	display: block;
	position: relative;
	width: 100%;
	.content {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;
		position: relative;
		.pic {
			width: 100%;
			height: 100%;
			position: relative;
			&.view {
				cursor: pointer;
				&:hover,
				&:active {
					&:after {
						content: "";
						display: block;
						width: 30px;
						height: 30px;
						background: url("../../icons/view.png") no-repeat center center /
							cover;
						position: absolute;
						left: 50%;
						margin-left: -15px;
						top: 50%;
						margin-top: -15px;
						z-index: 9;
					}
				}
			}
			&.drag {
				cursor: pointer;
				&:hover,
				&:active {
					&:after {
						content: "";
						display: block;
						width: 30px;
						height: 30px;
						background: url("../../icons/drag.png") no-repeat center center /
							cover;
						position: absolute;
						left: 50%;
						margin-left: -15px;
						top: 50%;
						margin-top: -15px;
						z-index: 9;
					}
				}
			}
			.remove-icon {
				width: 24px;
				height: 24px;
				background-color: rgba(0, 0, 0, 0.5);
				border-radius: 50%;
				position: absolute;
				right: 2px;
				top: 2px;
				transition: 0.2s;
				cursor: pointer;
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
		}
	}
}
</style>
