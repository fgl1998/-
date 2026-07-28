<!-- 县级教育扶贫救助基金（教育局） -->
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
            <ComponentDeclarePicker
              label="种植类型"
              idName="n00086"
              :range="codeMap.n00086"
              placeholder="请选择种植类型"
              v-model="projectDeclareInfo.n00086"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">承包面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00049"
                  placeholder="请输入承包面积"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">租种面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00050"
                  placeholder="请输入租种面积"
                />
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">种植总面积(亩)</div>
              <div class="value">{{ projectDeclareInfo.n00087 || "暂无" }}</div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">金额</div>
              <div class="value">{{ projectDeclareInfo.aae019 || "暂无" }}</div>
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

import Big from "@/utils/big.min.js";

export default {
  name: "pageDeclare20003",
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        n00049: "", // 承包面积
        n00050: "", // 租种面积
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
      const isDev = getIsDev(); // 当前环境是否是开发环境
      let n00086 = []; // 种植类型

      try {
        n00086 = await getCodeListByCodeName("n00086");
      } catch (err) {
        if (isDev) {
          console.log("code table n00086 error：", err);
        }
      }

      this.codeMap = {
        ...this.codeMap,
        n00086,
      };
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        n00086, // 种植类型
        n00049, // 承包面积
        n00050, // 租种面积
      } = this.projectDeclareInfo;

      if (!n00086) {
        showModal("请选择种植类型");
        return false;
      }
      if (!n00049) {
        showModal("请输入承包面积");
        return false;
      }
      if (!n00050) {
        showModal("请输入租种面积");
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
      } = this.basicInfo;

      const {
        aae019, // 金额(元)
        n00086, // 种植类型
        n00049, // 承包面积
        n00050, // 租种面积
        n00087, // 总面积
      } = this.projectDeclareInfo;

      // 扩展字段
      const hb00BizMap = {
        aae006: permanentAddress, // 户籍地址
        aae019, // 金额(元)
        n00086, // 种植类型
        n00049, // 承包面积
        n00050, // 租种面积
        n00087, // 总面积
      };

      this.handleDeclareData(hb00BizMap, "0");
    },
  },
  computed: {
    // 获取耕种面积
    getn00087() {
      let all = 0;
      const { n00049, n00050 } = this.projectDeclareInfo;
      all = new Big(all).plus(n00049 || 0).plus(n00050 || 0);
      return all;
    },
    getaae019() {
      let num = 0;
      let all = 0;
      const { n00049, n00050, n00086 } = this.projectDeclareInfo;
      all = new Big(all).plus(n00049 || 0).plus(n00050 || 0);
			let str = all + '';
			let index = str.indexOf('.');
			let l = str.length;
			let n = 10**(l - index -1);
			let newAll = n*all;
      if(n00086 === '4'){
        num = 400 * newAll/n;
        return num;
      }
      num = 200 * newAll/n;
      return num;
    },
  },
  watch: {
    getn00087(val) {
      this.projectDeclareInfo.n00087 = val;
    },
    getaae019(val) {
      this.projectDeclareInfo.aae019 = val.toFixed(2);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
