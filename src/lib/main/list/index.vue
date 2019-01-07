<template>
	<div class="picture-list" :style="style">
		<item v-for="item in list" 
			ref="item"
			:key="item.index" 
			:index="item.index" 
			:sort="item.sort" 
			:draggable="draggable" 
			:dragDelay="dragDelay" 
			:rowCount="rowCount" 
			:rowShift="rowShift" 
			:cellWidth="cellWidth+spaceBetween" 
			:cellHeight="cellHeight+spaceBetween"
			@dragstart="onDragstart" 
			@drag="onDrag" 
			@click="onClick" 
			@dragend="onDragend">
			<icon 
				:item="item"
				:draggable="draggable"
				:cellWidth="cellWidth"
				:cellHeight="cellHeight"
				:borderRadius="borderRadius"
				:spaceBetween="spaceBetween"
				:url="item.item.thumbnailUrl"
				@removeItem="removeItem">
			</icon>
		</item>
	</div>
</template>

<script>
import item from "./item";
import icon from "./icon";
import windowSize from "../../../mixins/windowSize.js";
export default {
	mixins: [windowSize],
	props: {
		items: {
			default: () => []
		},
		containerWidth: {
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
			},
			immediate: true
		}
	},
	computed: {
		gridResponsiveWidth() {
			if (this.containerWidth < 0) {
				return this.windowWidth;
			} else {
				return Math.min(this.windowWidth, this.containerWidth);
			}
		},
		rowCount() {
			return Math.floor(this.gridResponsiveWidth / this.cellWidth);
		},
		rowShift() {
			if (this.center) {
				let contentWidth =
					this.items.length * (this.cellWidth + this.spaceBetween);
				let rowShift =
					contentWidth < this.gridResponsiveWidth
						? (this.gridResponsiveWidth - contentWidth) / 2
						: (this.gridResponsiveWidth %
								(this.cellWidth + this.spaceBetween)) /
						  2;
				return Math.floor(rowShift);
			} else {
				return 0;
			}
		},
		height() {
			return (
				Math.ceil(this.list.length / this.rowCount) *
				(this.cellHeight + this.spaceBetween)
			);
		},
		style() {
			return {
				height: this.height + "px"
				// marginLeft: -this.spaceBetween / 2 + "px",
				// marginRight: -this.spaceBetween / 2 + "px"
			};
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
			const data = {
				sort: event.sort,
				event: this.wrapEvent()
			};
			this.$emit("click", data);
		},
		onDragstart() {
			this.$emit("onDragstart");
		},
		onDragend() {
			this.$emit("onDragend");
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
		item,
		icon
	}
};
</script>

<style scoped lang="scss">
.picture-list {
	display: block;
	position: relative;
	width: 100%;
}
</style>
