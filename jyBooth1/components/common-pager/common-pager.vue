<template>
	<div class="pager-wrap">
		<div :class="['pager-btn first', activePage <= 1 ? 'disabled':'']" @click="first" v-show="isShowPager"><span>首页</span></div>
		<div :class="['pager-btn prev', activePage <= 1 ? 'disabled':'']" @click="prev"><i class="ic pager-lt"></i><span>上一页</span></div>
		<div class="pager-list" v-for="(item,index) in pagers" :key="index" v-show="isShowPager">
			 <span @click="changeCurPage(item)" :class="{'dp':item == activePage}">{{item}}</span>
		</div>
		<div class="pager-box">
			<div class="pager-inp"><input v-model="toPage" @keyup.enter="go" @input="handleInput" /></div>
			<div>/{{pageCount}}</div>
		</div>
		<div :class="['pager-btn next', activePage >= pageCount ? 'disabled': '']" @click="next"><span>下一页</span><i class="ic pager-rt"></i></div>
		<div :class="['pager-btn last', activePage >= pageCount ? 'disabled': '']" @click="last" v-show="isShowPager"><span>尾页</span></div>
	</div>
</template>

<script>
	export default {
		name: "common-pager",
		data() {
			return {
				toPage: 1,
				pagerCount: 0, //显示页码数
				pageCount: 0, //总页数
				activePage: 1, //当前页码
				isShowPager:false
			}
		},
		props: {
			totals: {
				type: Number | String,
				default: 0,
			},
			currentPage: {
				type: Number | String,
				default: 1,
			},
			pageSize: {
				type: Number | String,
				default: 10,
			},
			pager: {
				type: Number | String,
				validator(value) {
					return (value | 0) === value && value > 4 && value < 22 && (value % 2) === 1
				},
				default: 5,
			},
		},
		watch: {
			activePage: {
				handler(val) {
					this.$emit('currentChange', val)
				}
			},
			currentPage: {
				type: Number,
				//immediate: true,
				handler(val) {
					this.activePage = val
					this.toPage = this.activePage
				}
			},
			pageSize: {
				type: Number,
				//immediate: true,
				handler(val) {
					this.$emit('pageSizeChange', val)
				}
			},
			pager: {
				type: Number,
				immediate: true,
				handler(val) {
					this.pagerCount = val % 2 == 0 ? val + 1 : val
				}
			},
		},
		computed: {
			pagers() {
				let _pagers = []
				//总页数
				this.pageCount = Math.ceil(this.totals / this.pageSize)

				let offset = (this.pagerCount - 1) / 2

				let startPage = this.activePage - offset;
				startPage = startPage < 1 ? 1 : startPage

				let endPage;

				if (this.pageCount <= this.pagerCount) {
					endPage = this.pageCount
					startPage = 1
				} else {
					endPage = this.activePage + offset
					endPage = endPage > this.pageCount ? this.pageCount : endPage
				}

				if (startPage == 1 && endPage == this.pageCount) {
					for (let i = startPage; i <= this.pageCount; i++) {
						_pagers.push(i)
					}
				} else if (startPage == 1 && endPage < this.pageCount) {
					for (let i = startPage; i <= this.pagerCount; i++) {
						_pagers.push(i)
					}
				} else if (startPage > 1 && endPage == this.pageCount) {
					for (let i = this.pageCount - this.pagerCount + 1; i <= this.pageCount; i++) {
						_pagers.push(i)
					}
				} else {
					for (let i = startPage; i <= endPage; i++) {
						_pagers.push(i)
					}
				}
				return _pagers
			}
		},
		methods: {
			//点选页码
			changeCurPage(activePage) {
				this.activePage = activePage
				this.toPage = this.activePage
			},

			//首页
			first() {
				this.activePage = 1
				this.toPage = this.activePage
			},

			//尾页
			last() {
				this.activePage = this.pageCount
				this.toPage = this.activePage
			},

			//上一页
			prev() {
				//console.log(this.activePage)
				if (this.activePage == 1) {
					return
				}
				this.activePage = this.activePage - 1
				this.toPage = this.activePage
			},

			//下一页
			next() {
				if (this.activePage == this.pageCount) {
					return
				}
				this.activePage = this.activePage + 1
				this.toPage = this.activePage
			},

			//跳转页数
			handleInput(e) {
				this.toPage = e.target.value.replace(/[^\d]/g, '');
				this.go()
			},

			//页码跳转
			go() {
				if (!this.toPage) {
					return
				}
				this.toPage = parseInt(this.toPage)
				if (this.toPage < 1) {
					this.activePage = 1
				} else if (this.toPage > this.pageCount) {
					this.activePage = this.pageCount
				} else {
					this.activePage = this.toPage
				}
				this.toPage = this.activePage
			},

		}
	}
</script>

<style lang="scss" scoped>
	.pager-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100px;
	}

	.pager-btn {
		background: url(../../static/images/pager_btn.png) left center no-repeat;
		background-size: 100% 100%;
		width: 150px;
		height: 58px;
		text-align: center;
		color: #FFFFFF;
		font-size: 24px;
		margin: 0 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		span{
			display: inline-block;
			vertical-align: middle;
			padding:0 16px;
		}
		&.disabled{
			background: url(../../static/images/pager_btn_disabled.png) left center no-repeat;
			background-size: 100% 100%;
		}
	}

	.pager-list{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		span{
			display: inline-block;
			width: 40px;
			height: 40px;
			line-height: 40px;
			border:1px solid #d3e9ff;
			background: #d3e9ff;
			border-radius: 4px;
			margin:0 6px;
			text-align: center;
			font-size:22px;
			color: #2778ff;
			&.dp{
				background: #2778ff;
				color:#FFFFFF;
			}
		}
	}

	.pager-box {
		margin: 0 12px;
		padding: 0 6px;
		height: 60px;
		line-height: 60px;
		text-align: center;
		background-color: #ffffff;
		border-radius: 4px;
		border: solid 1px #cccccc;
		display: flex;
		justify-content: center;
		align-items: flex-end;

		div {
			display: inline-block;
			width: 50px;
			position: relative;
			color: #999999;
			font-size: 26px;
			text-align: left;

			input {
				width: 50px;
				height: 60px;
				line-height: 60px;
				font-family: ArialMT;
				font-size: 36px;
				color: #333333;
				text-align: right;
				padding-right:6px;
			}
		}
	}
</style>
