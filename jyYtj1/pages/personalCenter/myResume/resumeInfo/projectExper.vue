<template>
	<div class="group-item">
		<div class="group-title">
			<div class="title-lt">
				<i class="ic ic-resume-title"></i>
				<span>项目经验</span>
			</div>
		</div>
		<div class="group-con">
			<div class="group-con">
				<!-- <div class="group-text-list" v-if="cc28List.length > 0">
					<div class="group-text" v-for="(item,index) in cc28List" :key="index">
						<div class="name">{{item.acc281}}</div>
						<div class="decr">{{item.acc283}}</div>
					</div>
				</div> -->
				<div class="group-list">
					<div class="group-head">
						<div class="group-th">项目名称</div>
						<div class="group-th">担任职位</div>
						<div class="group-th">开始时间</div>
						<div class="group-th">结束时间</div>
						<div class="group-th">项目描述</div>
					</div>
					<div class="group-body" v-if="cc28List.length > 0">
						<div class="group-tr" v-for="(item,index) in cc28List" :key="index">
							<div class="group-td">{{item.acc321}}</div>
							<div class="group-td">{{item.acc322}}</div>
							<div class="group-td">{{$utils.dateFormat(item.aae030)}}</div>
							<div class="group-td">{{$utils.dateFormat(item.aae031)}}</div>
							<div class="group-td">{{item.acc323}}</div>
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
	</div>
</template>

<script>
	export default {
		name: 'projectExper',
		props: {
			cc28List: {
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