<template>
	<div class="group-item" id="workExper">
		<div class="group-title">
			<div class="title-lt">
				<i class="ic ic-resume-title"></i>
				<span>工作经历</span>
			</div>
		</div>
		<div class="group-con">
			<div class="group-list">
				<div class="group-head">
					<div class="group-th">工作时间</div>
					<div class="group-th">公司名称</div>
					<div class="group-th">职位</div>
					<div class="group-th">工作描述</div>
				</div>
				<div class="group-body" v-if="cc25List.length > 0">
					<div class="group-tr" v-for="(item,index) in cc25List" :key="index">
						<div class="group-td">
							{{$utils.dateFormat(item.aae030)}} ~ {{$utils.dateFormat(item.aae031)}}
						</div>
						<div class="group-td">{{item.aab004}}</div>
						<div class="group-td">{{item.aca112}}</div>
						<div class="group-td">{{item.acc251}}</div>
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
		name: 'workExper',
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