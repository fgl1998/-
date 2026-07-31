<!-- 人才搜索列表组件 -->
<template>
	<div>
		<div class="personList" v-if="talentList.length !== 0">
			<div class="list_box">
				<!-- 无数据 -->
				<!-- <div v-if="!talentList || talentList.length === 0" style="width: 200px;" class="newNoData" data-on="暂无数据"></div> -->
				<yt-none :isShow="!talentList || talentList.length === 0" tip="暂无数据"></yt-none>

				<!-- 单个数据项 -->
				<person-item v-for="(item,index) in talentList" :key="index" :person-info-item="item" />
			</div>
			<div></div>
			<view class="pagination">
				<!-- 分页 -->
				<el-pagination @size-change="handleSizeChange" @current-change="changePage"
					:current-page="parameter.pageNumber" :page-size="parameter.pageSize"
					layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</view>
		</div>
		<template v-if="talentList.length === 0">
			<div class="newNoData" data-on="暂无人才信息" />
		</template>
	</div>
</template>
<script>
	// import pageContainer from "@/corePage/common/part/pageContainer.vue";
	import personItem from './personItem.vue'

	export default {
		name: 'personList',
		props: {
			param: {
				type: Object,
				default: () => {}
			}
		},

		components: {
			// pageContainer,
			personItem
		},

		watch: {
			param: {
				handler(val) {
					if (val && JSON.stringify(val) != '{}') {
						this.parameter = {
							...this.parameter,
							...val,
							// aab301: val.acb215,
							pageNumber: 1
						}
						this.getDataList()
					}
				},
				deep: true
			}
		},

		data() {
			return {
				// 人才列表数据
				talentList: [],
				parameter: {
					apiCode: "jy202_hrm220",
					method: "jy202_hrm220",
					aab001: '',
					pageSize: 10,
					pageNumber: 1,
				},
				total: 0,
				userInfo: null,
			}
		},

		mounted() {
			this.userInfo = uni.getStorageSync("loginInfo");
			this.parameter.aab001 = this.userInfo.aab001;
			this.getDataList()
		},

		methods: {
			handleSizeChange(val) {
				this.pageSize = val;
				//console.log(`每页 ${val} 条`);
			},
			// 换页
			changePage(curPage) {
				this.parameter.pageNumber = curPage;
				this.getDataList();
			},
			getDataList() {
				 this.$http
				   .request("/api/business/getData.do", "post", this.parameter, true)
				   .then((res) => {
				     if(res.serviceSuccess){
				       let dataList = res.data.pageBean.list
				       if (dataList) {
				         this.total = res.data.pageBean.total;
				         this.talentList = dataList
				         //console.log(this.talentList,'this.talentList')
				         //处理薪资
						dataList.forEach((item)=>{
				           item.aae707 = item.aae707
				               ? this.$host +
				               "api/base/downloadBusinessFile.do?fileId=" +
				               item.aae707 +
				               "&channelCode=xas&sysCode=jyplat"
				               : item.aac004 == "1"
				                   ? this.getRealImgUrl("img/recruitTalents/male.png")
				                   : this.getRealImgUrl("img/recruitTalents/female.png");
				         })

				       } else {
				         this.talentList = []
				         this.total = 0;
				       }
				     }
				   })
			},
			// getPageList(dataList) {
			//   if (dataList) {
			//     this.talentList = dataList
			//     //处理薪资
			//     dataList.forEach((item)=>{
			//       item.aae707 = item.aae707
			//           ? faceConfig.basePath +
			//           "api/base/downloadBusinessFile.do?fileId=" +
			//           item.aae707 +
			//           "&channelCode=xas&sysCode=jyplat"
			//           : item.aac004 == "1"
			//               ? this.getRealImgUrl("img/publicImg/male.png")
			//               : this.getRealImgUrl("img/publicImg/female.png");
			//       if(item.acc034_dsc){
			//         let low = item.acc034_dsc.split("-")[0];
			//         let high = item.acc034_dsc.split("-")[1];
			//         item.acc034_dsc = this.getAbbreviatSalary(low)+"-"+this.getAbbreviatSalary(high);
			//       }
			//     })

			//   } else {
			//     this.talentList = []
			//   }
			// },

		},

	};
</script>
<style lang="less" scoped>
	.pagination {
		// padding-left: 1200px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 60px;
		padding: 0 50px;
		box-sizing: border-box;

		.page {
			margin: 0 30px;
		}

		>view {
			width: 42px;
			height: 38px;
			background: #ffffff;
			border-radius: 4px;
			border: 1px solid #eeeeee;
			font-size: 16px;
			font-weight: 400;
			color: #999999;
			line-height: 38px;
			text-align: center;
			cursor: pointer;
		}

		>view:first-child,
		>view:last-child {
			width: 65px;
		}

		>view.actived {
			color: #fff;
			background-color: #007dee;
		}
	}

	.personList {
		padding: 10px 29px;
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		.list_box {
			height: 500px;
			overflow-y: scroll;
		}
	}
</style>