<template>
	<div class="scroll">
		<div class="scroll-box" ref="scrollBox">
			<div class="scroll-con" ref="scrollCon">
				<slot></slot>
			</div>
		</div>
		<div class="scroll-group" v-if="isScroll">
			<div class="scroll-up" @click="scrollUp"></div>
			<div class="scroll-down" @click="scrollDown"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'common-scroll',
		props: {
			add: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				scrollGap: 0,
				maxScroll: 0,
				isScroll: false
			}
		},
		watch: {
			add(newV, oldV) {
				setTimeout(() => {
					this.scrollHeight(newV, oldV)
				}, 100)
			}
		},
		mounted() {
			setTimeout(() => {
				this.scrollHeight()
			}, 100)
		},
		methods: {
			scrollHeight(newV, oldV) {
				let scrollBoxH = this.$refs.scrollBox.offsetHeight
				let scrollConH = this.$refs.scrollCon.offsetHeight
				//滚动最大距离
				this.maxScroll = scrollConH - scrollBoxH
				if (this.maxScroll > 0) {
					this.isScroll = true
				} else {
					this.isScroll = false
				}
				if (newV && oldV) {
					if (oldV > newV) {
						this.scrollGap = this.$refs.scrollBox.scrollTop;
					}
				}
			},
			//向上滚动
			scrollUp() {
				this.scrollGap -= 60
				if (this.scrollGap <= 0) {
					this.scrollGap = 0
				}
				this.$refs.scrollBox.scrollTop = this.scrollGap
			},
			//向下滚动
			scrollDown() {
				this.scrollGap += 60
				if (this.scrollGap > this.maxScroll) {
					this.scrollGap = this.maxScroll
				}
				this.$refs.scrollBox.scrollTop = this.scrollGap
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll {
		height: 100%;
		position: relative;
		overflow: hidden;
		padding: 0 80px;

		.scroll-box {
			height: 100%;
			overflow: auto;
		}

		.scroll-group {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);

			.scroll-up {
				background: url('../../static/images/scroll_up.png') left center no-repeat;
				background-size: 100% 100%;
				width: 56px;
				height: 56px;
				margin-bottom: 40px;
			}

			.scroll-down {
				background: url('../../static/images/scroll_down.png') left center no-repeat;
				background-size: 100% 100%;
				width: 56px;
				height: 56px;
			}
		}
	}
</style>
