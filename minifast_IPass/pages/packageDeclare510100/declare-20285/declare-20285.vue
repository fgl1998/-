<!-- 残疾儿童康复救助补贴（残联） -->
<template>
  <view class="declare">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <div class="basic-info-wrapper">
      <ComponentDeclare
          :declareType="declareType"
          :fixedDeclareType="fixedDeclareType"
          :renderObj="renderObj"
          :projectNumber="chi031"
          :projectName="chi031_desc"
          @changeDeclareType="handleChangeDeclareType"
          @changeBasicInfo="handleChangeBasicInfo"
          @changeCodeMap="handleChangeCodeMap"
          @changeAgentInfo="handleChangeAgentInfo"
          @changeDataByIdCard="seDataByIdCard"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->

    <div class="space-top-wrapper">
      <ComponentPanel title="监护人信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                    type="text"
                    v-model="projectDeclareInfo.c77501"
                    placeholder="请输入监护人的姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人身份证号</div>
              <div class="value">
                <input
                    type="idcard"
                    maxlength="18"
                    v-model="projectDeclareInfo.c77502"
                    placeholder="请输入监护人的身份证号"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人联系电话</div>
              <div class="value">
                <input
                    type="number"
                    maxlength="11"
                    v-model="projectDeclareInfo.chb0ha"
                    placeholder="请输入监护人的联系电话"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
                label="办证状况"
                idName="c00178"
                :range="codeMap.c00178"
                placeholder="请选择办证状况"
                v-model="projectDeclareInfo.c00178"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
                label="家庭经济状况"
                idName="c00129"
                :range="codeMap.c00129"
                placeholder="请选择家庭经济状况"
                v-model="projectDeclareInfo.c00129"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
                label="医疗保险情况"
                idName="c00179"
                :range="codeMap.c00179"
                placeholder="请选择家医疗保险情况"
                v-model="projectDeclareInfo.c00179"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
                label="申请救助内容"
                idName="c00180"
                :range="codeMap.c00180"
                placeholder="请选择申请救助内容"
                v-model="projectDeclareInfo.c00180"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
                label="诊断评估结果"
                idName="c00181"
                :range="codeMap.c00181"
                placeholder="请选择诊断评估结果"
                v-model="projectDeclareInfo.c00181"
            >
            </ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">诊断评估机构</div>
              <div class="value">
                <input
                    type="text"
                    v-model="projectDeclareInfo.c00184"
                    placeholder="请输入诊断评估机构"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">选定康复机构名称</div>
              <div class="value">
                <input
                    type="text"
                    v-model="projectDeclareInfo.c00185"
                    placeholder="请输入选定康复机构名称"
                />
              </div>
            </div>
            <ComponentDeclarePicker
                label="选定康复机构类型"
                idName="c00182"
                :range="codeMap.c00182"
                placeholder="请选择"
                v-model="projectDeclareInfo.c00182"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
                label="是否定点医院或机构"
                idName="c00183"
                :range="codeMap.yesorno"
                placeholder="请选择"
                v-model="projectDeclareInfo.c00183"
            >
            </ComponentDeclarePicker>
						
						<div class="cell-item required">
						  <div class="key">二代残疾证号</div>
						  <div class="value">
						    <input
						        type="text"
										maxlength="20"
						        v-model="projectDeclareInfo.c03601"
						        placeholder="请输入残疾证号"
										@change="handleCheckDisability"
						    />
						  </div>
						</div>
						
						<ComponentDeclarePicker
						    label="残疾类别"
						    idName="chb0h1"
								:range="codeMap.chb0h1"
						    v-model="projectDeclareInfo.chb0h1"
						    placeholder="请选择残疾类别"
						></ComponentDeclarePicker>
						
						<ComponentDeclarePicker
						    label="残疾等级"
						    idName="chb0h2"
								:range="codeMap.chb0h2"
						    v-model="projectDeclareInfo.chb0h2"
						    placeholder="请选择残疾等级"
						></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>


    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
    <div class="button-wrapper">
      <ComponentButton
          @click="handleJumpNextStep"
          name="下一步"
          type="primary"
      ></ComponentButton>
    </div>
  </view>
</template>

<script>
  import ComponentButton from "@/components/common/ez-button/ez-button.vue";
  import ComponentPanel from "@/components/common/ez-panel/ez-panel.vue";

  import ComponentDeclareStep from "@/components/project/ez-declare-step/ez-declare-step.vue";
  import ComponentDeclare from "@/components/project/ez-declare/ez-declare.vue";
  import ComponentSelectPermanentAddress from "@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue";
  import ComponentSelectCurrentAddress from "@/components/project/ez-select-current-address/ez-select-current-address.vue";
  import ComponentDeclareCard from "@/components/project/ez-declare-card/ez-declare-card.vue";
  import ComponentDeclarePersonnel from "@/components/project/ez-declare-personnel/ez-declare-personnel.vue";
  import ComponentDeclareRadio from "@/components/project/ez-declare-radio/ez-declare-radio.vue";
  import ComponentDeclarePicker from "@/components/project/ez-declare-picker/ez-declare-picker.vue";

  import { useDeclare } from "@/mixins";

  import { getIsDev } from "@/utils/get";
  import { checkIDCard, checkPhoneNumber } from "@/utils/check";
  import { getCodeListByCodeName } from "@/utils/custom-api";
  import { navigateBack, showModal } from "@/utils/uni-api";
  export default {
    name: "pageDeclare20457",
    data() {
      return {
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          gender: true, // 性别
          birthday: true, // 出生日期
          currentAddress: true, // 现居住地址
          permanentAddress: true, // 户籍地址
        },
        // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
        projectDeclareInfo: {

        },
      };
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentSelectPermanentAddress,
      ComponentSelectCurrentAddress,
      ComponentDeclareCard,
      ComponentDeclareRadio,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker,
    },
    mixins: [useDeclare],
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      this.handleOnLoad(e);
    },
    // 监听页面初次渲染完成
    onReady() {},
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      // 获取该申报项目的所需要的码表数据
      // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
      // 编写格式参考达州20033项目
      async getCodeTableCacheData() {
        const isDev = getIsDev; //当前环境是否是开发环境
        let c00178 = []; // 办证状况
        let c00129 = []; // 家庭经济状况
        let c00179 = []; // 医疗保险情况
        let c00180 = []; // 申请救助内容
        let c00181 = []; // 诊断评估结果
        let c00182 = []; // 选定康复类型
				let chb0h1 = [] // 残疾人类别
				let chb0h2 = [] // 残疾人等级
        try {
          c00178 = await getCodeListByCodeName("c00178");
        } catch (err) {
          if (isDev) {
            console.log("code table c00178 error", err);
          }
        }
        try {
          c00129 = await getCodeListByCodeName("c00129");
        } catch (err) {
          if (isDev) {
            console.log("code table c00129 error", err);
          }
        }
        try {
          c00179 = await getCodeListByCodeName("c00179");
        } catch (err) {
          if (isDev) {
            console.log("code table c00179 error", err);
          }
        }
        try {
          c00180 = await getCodeListByCodeName("c00180");
        } catch (err) {
          if (isDev) {
            console.log("code table c00180 error", err);
          }
        }
        try {
          c00181 = await getCodeListByCodeName("c00181");
        } catch (err) {
          if (isDev) {
            console.log("code table c00181 error", err);
          }
        }
        try {
          c00182 = await getCodeListByCodeName("c00182");
        } catch (err) {
          if (isDev) {
            console.log("code table c00182 error", err);
          }
        }
			try {
			  chb0h1 = await getCodeListByCodeName('chb0h1')
			} catch (err) {
			  if (isDev) {
			    console.log('code table chb0h1 error：', err)
			  }
			}
			
			try {
			  chb0h2 = await getCodeListByCodeName('chb0h2')
			} catch (err) {
			  if (isDev) {
			    console.log('code table chb0h2 error：', err)
			  }
			}
        this.codeMap = {
          ...this.codeMap,
          c00178,
          c00129,
          c00179,
          c00180,
          c00181,
          c00182,
					chb0h1,
					chb0h2
        }
      },
			handleCheckDisability(e) {
				const {value} = e.target
				if (value &&!this.CheckDisability(value)){
					showModal('请输入正确的残疾证号')
				}
			},
			// 校验残疾人证
			CheckDisability(value){
				console.log(value)
				let str = /[\d]{17}[\dX][1-7][1-4]/.test(value)
				console.log(str)
				return str
			},
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          chb0h1, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h9, // 办证时间
          c03601, // 残疾证号

          c77501, // 监护人姓名
          c77502, // 监护人身份证号
          chb0ha, //监护人电话

          c00178, // 办证状况
          c00129, // 家庭经济状况
          c00179, // 医疗保险情况
          c00180, // 申请救助内容
          c00181, // 诊断评估结果
          c00184, // 诊断评估机构
          c00185, // 选定康复机构名称
          c00182, // 选定康复机构类型
          c00183, // 是否定点医院或机构
        } = this.projectDeclareInfo;

        if (!c77501) {
          showModal("请输入监护人姓名");
          return false;
        }

        if (!c77502) {
          showModal("请输入监护人身份证号");
          return false;
        } else {
          const checkResult = checkIDCard(c77502, "监护人身份证号");
          if (checkResult.status === "0") {
            showModal(checkResult.msg);
            return false;
          }
        }
        if (!chb0ha) {
          showModal("请输入监护人电话");
          return false;
        }

        if (!c00178) {
          showModal("请选择办证状况");
          return false;
        }
        if (!c00129) {
          showModal("请选择家庭经济状况");
          return false;
        }
        if (!c00179) {
          showModal("请选择医疗保险情况");
          return false;
        }
        if (!c00180) {
          showModal("请选择申请救助内容");
          return false;
        }
        if (!c00181) {
          showModal("请选择诊断评估结果");
          return false;
        }
        if (!c00184) {
          showModal("请选择诊断评估机构");
          return false;
        }
        if (!c00185) {
          showModal("请选择选定康复机构名称");
          return false;
        }
        if (!c00182) {
          showModal("请选择选定康复机构类型");
          return false;
        }
        if (!c00183) {
          showModal("请选择是否定点医院或机构");
          return false;
        }
     if (!c03601) {
				showModal('请输入残疾证号')
        return false
      } else if (!this.CheckDisability(c03601)) {
				showModal('请输入正确的残疾证号')
				return false
			}
			
			if (!chb0h1) {
				showModal('请选择残疾类别')
				return false
			}
			
			if (!chb0h2) {
				showModal('请选择残疾等级')
				return false
			}

        return true;
      },
      // 下一步
      handleJumpNextStep() {
        if (!this.handleCheckComponentInput()) {
          return;
        }
        if (!this.handleCheckInput()) {
          return;
        }

        const {
          currentAddress, // 现居住地址
          permanentAddress, //户籍地址
          gender, //性别
          birthday, //出生年月
        } = this.basicInfo;

        const {
          chb0h1, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h9, // 办证时间
          c03601, // 残疾证号

          c77501, // 监护人姓名
          c77502, // 监护人身份证号
          chb0ha, //监护人电话

          c00178, // 办证状况
          c00129, // 家庭经济状况
          c00179, // 医疗保险情况
          c00180, // 申请救助内容
          c00181, // 诊断评估结果
          c00184, // 诊断评估机构
          c00185, // 选定康复机构名称
          c00182, // 选定康复机构类型
          c00183, // 是否定点医院或机构
        } = this.projectDeclareInfo;

        // 扩展字段
        const hb00BizMap = {
          c00015: currentAddress, // 现居住地址
          c00008: permanentAddress, //户籍地址
          aac004: gender, //性别
          c00062: birthday, //出生年月
          che0hf: chb0h1, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h9, // 办证时间
          c03601, // 残疾证号

          c77501, // 监护人姓名
          c77502, // 监护人身份证号
          chb0ha, //监护人电话

          c00178, // 办证状况
          c00129, // 家庭经济状况
          c00179, // 医疗保险情况
          c00180, // 申请救助内容
          c00181, // 诊断评估结果
          c00184, // 诊断评估机构
          c00185, // 选定康复机构名称
          c00182, // 选定康复机构类型
          c00183, // 是否定点医院或机构
        };
        this.handleDeclareData(hb00BizMap, "0");
      },
    },
    computed: {},
    watch: {}
  };
</script>

<style lang="scss" scoped>
</style>
