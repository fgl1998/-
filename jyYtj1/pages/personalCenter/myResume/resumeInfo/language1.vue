<template>
	<div class="group-item" id="language">
		<div class="group-title">
			<div class="title-lt">
				<i class="ic ic-resume-title"></i>
				<span>语言能力</span>
			</div>
		</div>
		<div class="group-con">
			<div class="group-list">
				<div class="group-head">
					<div class="group-th">语言类别</div>
					<div class="group-th">熟练程度</div>
					<div class="group-th">读写能力</div>
					<div class="group-th">听说能力</div>
				</div>
				<div class="group-body" v-if="cc25List.length > 0">
					<div class="group-tr" v-for="(item,index) in cc25List" :key="index">
						<div class="group-td">{{$utils.queryCodeDesc('acc241',item.acc241)}}</div>
						<div class="group-td">{{$utils.queryCodeDesc('acc242',item.acc242)}}</div>
						<div class="group-td">{{$utils.queryCodeDesc('acc242',item.acc243)}}</div>
						<div class="group-td">{{$utils.queryCodeDesc('acc242',item.acc244)}}</div>
					</div>
				</div>
				<div class="group-none" v-else>
					<div class="none-box">
						<div class="none-img">
							<image :src="baseImgSrc + '/ic_no_data.png'" mode="scaleToFill" />
						</div>
						<div class="none-text">暂时没有录入数据~</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'language',
		props: {
			cc25List: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				baseImgSrc: this.$baseImgSrc
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/scss/resume.scss';
</style>