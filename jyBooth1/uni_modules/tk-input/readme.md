# 示例
~~~
<template>
	<view class="content">
		<view>
			<tk-input ref="myInput1" class="un-input" :allowEdit="true"
				:style="{border:'1px solid #000', margin: '5px'}" @input="input" v-model="value1"
				@confirm="onInput1Confirm" />
			<view>value1:{{value1}}</view>

			<tk-input ref="myInput2" v-model="value2" class="un-input" :style="{border:'1px solid #000', margin: '5px'}"
				@input="input" @confirm="onInput2Confirm" />
			<view>value2:{{value2}}</view>

		</view>



		<button @click="focus">input1获得焦点</button>
		<button @click="showKeyboard">input1显示键盘</button>
		<button @click="hideKeyboard">input1隐藏键盘</button>
		<button @click="onSetText">input1 onSetText</button>
		<button @click="onReset">input1 onReset</button>

		<button @click="focus1">input2获得焦点1</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				value1: "",
				value2: ''
			}
		},
		onLoad() {
			this.$nextTick(() => {
				this.$refs.myInput1.focus()
			})
		},
		methods: {
			input(e) {
				//console.log("e ************: ", e);
			},
			focus() {
				this.$refs.myInput1.focus()
			},
			focus1() {
				this.$refs.myInput2.focus()
			},
			showKeyboard() {
				this.$refs.myInput1.showKeyboard()
			},
			hideKeyboard() {
				this.$refs.myInput1.hideKeyboard()
			},
			onInput1Confirm(val) {
				//console.log("val ************: ", val);
				this.$refs.myInput1.focus()
			},
			onInput2Confirm(val) {
				//console.log("val ************: ", val);
				this.$refs.myInput1.focus()
			},
			onSetText() {
				this.$refs.myInput1.onSetText('99999');
			},
			onReset() {
				this.$refs.myInput1.onReset();
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
~~~
