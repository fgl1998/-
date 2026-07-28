<!-- 普通高中寄宿制生活补助 （教育局） -->
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
        @changeDataByIdCard="handleChangeDataByIdCard"
        permanentAddressLabel="申报学校"
        permanentAddressPlaceholder="请选择申报学校"
      >
      </ComponentDeclare>
    </div>

		<div class="personnel-type-wrapper space-top-wrapper">
			<ComponentDeclarePersonnel
				:renderData="personnelList"
				@change="handleChangePersonnelInfo"
			></ComponentDeclarePersonnel>
		</div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001"
                  placeholder="请输入学校"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00011"
                  placeholder="请输入年级"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">班级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00012"
                  placeholder="请输入班级"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 监护人信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="监护人信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00019"
                  placeholder="请输入监护人姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.j00020"
                  placeholder="请输入监护人身份证号"
                  @blur="handleBlur01"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.j00064"
                  placeholder="请输入监护人联系电话"
                  @blur="handleBlur02"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人工作单位</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00060"
                  placeholder="请输入监护人工作单位"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="与申请人关系"
              idName="chb0gh"
              :range="codeMap.chp031_1"
              placeholder="请选择与申请人关系"
              v-model="projectDeclareInfo.chb0gh"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- end  在以上代码中根据项目需求更改-->
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

import { getIsDev, getDate } from "@/utils/get";
import { checkIDCard, checkPhoneNumber } from "@/utils/check";
import { getCodeListByCodeName } from "@/utils/custom-api";
import { showModal } from "@/utils/uni-api";

export default {
  name: "pageDeclare20806",
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址

        age: true, // 年龄
        currentAddress: true, // 现居住地址
        gender: true, // 性别
        nation: true, // 民族
      },
      // 申报信息
      projectDeclareInfo: {},
      // 卡片列表数据
      cardList: [],
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
      const isDev = getIsDev(); // 当前环境是否是开发环境
      let chp031_1 = []; // 作物种类

      try {
        chp031_1 = await getCodeListByCodeName("chp031_1");
      } catch (err) {
        if (isDev) {
          console.log("code table chp031_1 error：", err);
        }
      }

      this.codeMap = {
        ...this.codeMap,
        chp031_1,
      };
    },
    // 身份证号 失去焦点监听
    handleBlur01(e) {
      const { value } = e.target;
      const checkResult = checkIDCard(value, "身份证号");
      if (checkResult.status === "0") {
        showModal(checkResult.msg);
      }
    },
    // 身份证号 失去焦点监听
    handleBlur02(e) {
      const { value } = e.target;
      const checkResult = checkPhoneNumber(value, "电话号码");
      if (checkResult.status === "0") {
        showModal(checkResult.msg);
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        aac005, // 民族
        aac004, // 性别
        chb00l, // 年龄
        j00046, // 现居住地址

        j00001, // 学校
        j00011, // 年级
        j00012, // 班级

        j00019, // 监护人姓名
        j00020, // 监护人身份证号
        j00064, // 监护人联系电话
        j00060, // 监护人工作单位
        chb0gh, // 监护人与申请人关系
      } = this.projectDeclareInfo;

      if (!j00001) {
        showModal("请输入学校");
        return false;
      }
      if (!j00011) {
        showModal("请输入年级");
        return false;
      }
      if (!j00012) {
        showModal("请输入班级");
        return false;
      }
      if (!j00019) {
        showModal("请输入监护人姓名");
        return false;
      }
      if (!j00020) {
        showModal("请输入监护人身份证号");
        return false;
      } else {
        const checkResult = checkIDCard(j00020, "监护人身份证号");
        if (checkResult.status === "0") {
          showModal(checkResult.msg);
          return false;
        }
      }
      if (!j00064) {
        showModal("请输入监护人联系电话");
        return false;
      } else {
        const checkResult = checkPhoneNumber(j00064, "监护人联系电话");
        if (checkResult.status === "0") {
          showModal(checkResult.msg);
          return false;
        }
      }
      if (!j00060) {
        showModal(`请输入监护人工作单位`);
        return false;
      }
      if (!chb0gh) {
        showModal(`请输入监护人与申请人关系`);
        return false;
      }
      return true;
    },

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return;
      }
      if (!this.handleCheckInput()) {
        return;
      }
      const {
        aac005, // 民族
        aac004, // 性别
        chb00l, // 年龄
        j00046, // 现居住地址

        j00001, // 学校
        j00011, // 年级
        j00012, // 班级

        j00019, // 监护人姓名
        j00020, // 监护人身份证号
        j00064, // 监护人联系电话
        j00060, // 监护人工作单位
        chb0gh, // 监护人与申请人关系
      } = this.projectDeclareInfo;
      const {
        age, // 年龄
        currentAddress, // 现居住地址
        gender, // 性别
        nation, // 民族
      } = this.basicInfo;
      // 扩展字段
      let hb00BizMap = {
        aac005: nation, // 民族
        aac004: gender, // 性别
        chb00l: age, // 年龄
        j00046: currentAddress, // 现居住地址

        j00001, // 学校
        j00011, // 年级
        j00012, // 班级

        j00019, // 监护人姓名
        j00020, // 监护人身份证号
        j00064, // 监护人联系电话
        j00060, // 监护人工作单位
        chb0gh, // 监护人与申请人关系
      };

      this.handleDeclareData(hb00BizMap, "0");
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>

