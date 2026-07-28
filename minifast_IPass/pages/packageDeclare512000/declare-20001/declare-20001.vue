<!-- 卫生扶贫救助基金 卫健委 -->
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
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
		<div class="personnel-type-wrapper space-top-wrapper">
			<ComponentDeclarePersonnel
				:renderData="personnelList"
				:isOpenCategoryNotes="true"
				@change="handleChangePersonnelInfo"
			></ComponentDeclarePersonnel>
		</div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="panel-content">
              <div class="cell-items">
                <div class="cell-item required">
                  <div class="key">户主姓名</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.w00052"
                      placeholder="请输入户主姓名"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">户主身份证号</div>
                  <div class="value">
                    <input
                      type="idcard"
                      maxlength="18"
                      v-model="projectDeclareInfo.w00046"
                      placeholder="请输入户主身份证号"
                    />
                  </div>
                </div>
                <ComponentDeclarePicker
                  label="户主与申请人关系"
                  idName="w00047"
                  :range="codeMap.CHP031"
                  placeholder="请选择户主与申请人关系"
                  v-model="projectDeclareInfo.w00047"
                  @change="getPickerValueDesc"
                >
                </ComponentDeclarePicker>
                <div class="cell-item required">
                  <div class="key">医疗总费用(元)</div>
                  <div class="value">
                    <input
                      type="number"
                      v-model="projectDeclareInfo.w03003"
                      placeholder="请输入医疗总费用"
                      @input='handleCheckNumber($event,"w03003")'
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">个人自费费用（元）</div>
                  <div class="value">
                    <input
                      type="number"
                      v-model="projectDeclareInfo.w00008"
                      placeholder="请输入个人自费费用"
                      @input='handleCheckNumber($event,"w00008")'
                    />
                  </div>
                </div>
              </div>
            </div>
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
import { showModal } from "@/utils/uni-api";
export default {
  name: "pageDeclare20121",
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
        nation: true, // 民族
        age: true, // 年龄
        gender: true, // 性别
        // SSCBankCardNumber: true, // 社保卡银行卡号
        // SSCBankCardCategory: true, // 社保卡银行卡类别
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        w00008: "",
        w03003: "",
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
    async getCodeTableCacheData() {
      const isDev = getIsDev(); // 当前环境是否是开发环境
      let CHP031 = []; // 与申报人关系
      try {
        CHP031 = await getCodeListByCodeName("CHP031");
      } catch (err) {
        if (isDev) {
          console.log("code table CHP031 error：", err);
        }
      }   
      this.codeMap = {
        ...this.codeMap,
        CHP031, // 与申报人关系
      };
    },

  // 数字验证
  handleCheckNumber(e, id) {
    let { value } = e.target
    if (value) {
    let res = value.replace(/[^\d+(\.\d+)?$]/,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')
    let index = res.indexOf('.')
    if (index>0 && index+3<res.length){
     res = res.slice(0,index+3)
    }
      let _this = this
      this.$nextTick(function () {
        _this.projectDeclareInfo[id] = res
      })
    }
  },
    handleCheckInput() {
      const {
        w00052, // 户主姓名
        w00046, // 户主身份证号码
        w00047, // 户主与申请人关系
        w03003, // 医疗总费用
        w00008, // 个人自费费用
      } = this.projectDeclareInfo;

      if (!w00052) {
        showModal("请输入户主姓名");
        return false;
      }
      if (!w00046) {
        showModal("请输入户主身份证号码");
        return false;
      }
      if (!w00047) {
        showModal("请选择与申请人关系");
        return false;
      }
      if (!w03003) {
        showModal("请输入医疗总费用");
        return false;
      }
      if (!w00008) {
        showModal("请输入个人自费费用");
        return false;
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
        permanentAddress, // 户籍地址
        currentAddress, // 现阶段地址
        nation, // 民族
        age, // 年龄
        gender, //性别
      } = this.basicInfo;

      const {
        w00052, // 户主姓名
        w00046, // 户主身份证号码
        w00047, // 户主与申请人关系
        w03003, // 医疗总费用
        w00008, // 个人自费费用

      } = this.projectDeclareInfo;

      // 扩展字段
      const hb00BizMap = {
        chb0a9: permanentAddress, // 户籍地址
        w00034: currentAddress, // 现阶段地址
        aac005: nation, // 民族
        chb00l: age, // 年龄
        aac004: gender, //性别
        w00052, // 户主姓名
        w00046, // 户主身份证号码
        w00047, // 户主与申请人关系
        w03003: parseFloat(w03003), // 医疗总费用
        w00008: parseFloat(w00008) // 个人自费费用
      };
      this.handleDeclareData(hb00BizMap, "0");
    },
    // 下一步
  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>
