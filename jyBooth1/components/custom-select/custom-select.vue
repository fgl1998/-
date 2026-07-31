<template>
	<div class="select" :style="stylea">
		<div class="select-text" @click="clickDown">
			<input type="text" :placeholder="placeholder" v-model="defaultValue.name"
				placeholderClass="placeholderClass" />
			<i class="ic ic-down"></i>
		</div>
		<div class="select-list" v-if="isShow">
			<div :class="['select-item', defaultValue.code == item.code ? 'select-active': '']"
				v-for="(item,index) in selectList" :key="index" @click="clickSel(item)">{{item.name}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'custom-select',
		data() {
			return {
				isShow: false
			}
		},
		props: {
			stylea: {
				type: Object,
				default: () => {
					return {}
				}
			},
			placeholder: {
				type: String,
				default: ''
			},
			defaultValue: {
				type: Object,
				default: () => {
					return {
						code: '',
						name: ''
					}
				}
			},
			selectList: {
				type: Array,
				default: () =>{
					return []
				}
			}
		},
		methods: {
			clickDown() {
				this.isShow = !this.isShow
			},
			clickSel(item) {
				this.defaultValue.name = item.name
				this.defaultValue.code = item.code
				this.$emit('selectChange', item)
				this.isShow = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select {
		width: 180px;
		height: 54px;
		line-height: 54px;
		background-color: #ffffff;
		box-shadow: inset 3px 5px 7px 0px rgba(0, 72, 127, 0.06);
		border-radius: 4px;
		border: solid 1px #cccccc;
		position: relative;
		margin-left: 14px;

		.select-text {
			height: 54px;
			line-height: 54px;
			position: relative;
			padding-right: 40px;
			color: #333333;
			font-size: 22px;

			input {
				width: 100%;
				height: 54px;
				line-height: 54px;
				text-align: left;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding: 0 10px 0 40px;
				box-sizing: border-box;
				color: #333333;
				font-size: 22px;
			}

			.ic-down {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 10px;
			}
		}

		.select-list {
			width: 100%;
			max-height: 180px;
			overflow: auto;
			z-index: 10;
			position: absolute;
			top: 64px;
			left: 0;
			background: #ffffff;
			border-radius: 4px;
			border: solid 1px #cccccc;

			.select-item {
				border-bottom: 1px solid #dddddd;
				height: 60px;
				line-height: 60px;
				text-align: center;
				padding: 0 20px;
				color: #333333;
				font-size: 20px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				&:last-child {
					border-bottom: none;
				}

				&:hover {
					background: #e8f4ff;
					color: #0d7aee;
				}

				&.select-active {
					background: #e8f4ff;
					color: #0d7aee;
				}
			}
		}
	}
</style>
