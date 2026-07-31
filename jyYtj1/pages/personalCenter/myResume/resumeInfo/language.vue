<template>
	<div class="form-group-box">
		<div class="form-group-list">
			<uni-forms ref="form">
				<div class="form-group-none" v-if="cc24List.length < 1">
					<div class='nodata' style="height: 190px;">
						<div class="nodata-pic" style="width: 180px;height: 190px;">
							<div class="nodata-img"></div>
							<div class="nodata-text">暂时没有录入数据~</div>
						</div>
					</div>
				</div>
				<div class="form-group" v-for="(item,index) in cc24List" :key="index" v-else>
					<div class="group-index">{{ index+ 1 < 10 ? '0'+(index+1) : index }}</div>
					<uni-row class="uni-row">
						<uni-col :span="8">
							<div class="form-item">
								<div class="form-label">语言类别:</div>
								<div class="form-input">{{$utils.queryCodeDesc('acc241',item.acc241)}}</div>
							</div>
						</uni-col>
						<uni-col :span="8">
							<div class="form-item">
								<div class="form-label">熟练程度:</div>
								<div class="form-input">{{$utils.queryCodeDesc('acc242',item.acc242)}}</div>
							</div>
						</uni-col>
						<uni-col :span="8">
							<div class="form-item">
								<div class="form-label">读写能力:</div>
								<div class="form-input">{{$utils.queryCodeDesc('acc242',item.acc243)}}</div>
							</div>
						</uni-col>
						<uni-col :span="8">
							<div class="form-item">
								<div class="form-label">听说能力:</div>
								<div class="form-input">{{$utils.queryCodeDesc('acc242',item.acc244)}}</div>
							</div>
						</uni-col>
					</uni-row>
				</div>
			</uni-forms>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'language',
		props:{
			cc24List:{
				type:Array,
				default:function(){
					return []
				}
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		},
	}
</script>

<style lang="scss" scoped>
	.form-group-box {
		.form-group-list {
			.form-group-none{
				p{
					color: #bbbbbb;
					font-size: 18px;
					text-align: center;
					line-height: 46px;
				}
			}
			.form-group {
				border-bottom: 1px dashed #dddddd;
				position: relative;
				margin-top: 20px;
				padding-bottom: 20px;

				&:last-child {
					border-bottom: 0;
				}

				.group-index {
					position: absolute;
					left: -50px;
					top: 0;
					height: 34px;
					line-height: 34px;
					background: #f0f7ff;
					color: #2778ff;
					font-size: 18px;
					padding: 0 10px;
				}

				.form-item {
					padding: 0 20px;
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					line-height: 42px;

					.form-label {
						color: #666666;
						font-size: 18px;
						display: inline-block;
						width: 86px;
						text-align-last: justify;
					}

					.form-input {
						color: #404040;
						font-size: 18px;
						padding-left: 20px;
						
						&.text-blue{
							color: #2778ff;
						}

						&.text-org {
							color: #ff7e00;
						}
						
						&.text-gary{
							color: #bbbbbb;
						}
					}
				}
			}
		}
	}
</style>
