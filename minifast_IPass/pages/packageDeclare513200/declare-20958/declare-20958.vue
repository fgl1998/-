<!-- 退役安置一次性地方经济补助 退役军人事务管理局 -->
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
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!--入伍时间-->
            <ComponentDeclarePicker
              label="入伍时间"
              idName="t00012"
              mode="date"
              fields="day"
              :endTime="today_d"
              placeholder="请输入入伍时间"
              v-model="projectDeclareInfo.t00012"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <!--退伍时间-->
            <ComponentDeclarePicker
              label="退伍时间"
              idName="t00013"
              mode="date"
              fields="day"
              :startTime="projectDeclareInfo.t00012"
              :endTime="today_d"
              placeholder="请输入退伍时间"
              v-model="projectDeclareInfo.t00013"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <!-- 服役年限折算 -->
            <div class="cell-item required">
              <div class="key">服役年限折算</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.t03801"
                  placeholder="请输入服役年限折算"
                />
              </div>
            </div>

            <!--政治面貌-->
            <ComponentDeclarePicker
              label="政治面貌"
              idName="t00038"
              :range="codeMap.t00038"
              placeholder="请选择政治面貌"
              v-model="projectDeclareInfo.t00038"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <!--政治面貌-->
            <ComponentDeclarePicker
              label="是否是士官"
              idName="t00040"
              :range="codeMap.yesorno"
              placeholder="请选择是否是士官"
              v-model="projectDeclareInfo.t00040"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <!--入伍时户口所在地-->
            <ComponentSelectAddressMultitype
              label="入伍时户口所在地"
              placeholder="请选择或输入入伍时户口所在地"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.t00039 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.t00039"
            >
            </ComponentSelectAddressMultitype>
            <!-- 退伍证编号 -->
            <div class="cell-item required">
              <div class="key">退伍证编号</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.t00041"
                  placeholder="请输入退伍证编号"
                />
              </div>
            </div>
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
import ComponentSelectAddressMultitype from "@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue";
import { useDeclare } from "@/mixins";

import { getIsDev, getDate } from "@/utils/get";
import { checkIDCard, checkPhoneNumber } from "@/utils/check";
import { getCodeListByCodeName } from "@/utils/custom-api";
import { showModal } from "@/utils/uni-api";

export default {
  name: "pageDeclare20958",
  data() {
    return {
      today_d: getDate("day"), // 当前日期
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {
        a00022: "",
        t00012: "", // 入伍时间
        t00013: "",
        t03801: "",
        t00038: "",
        t00040: "",
        t00039: "",
        t00041: "",
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
    ComponentSelectAddressMultitype,
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
      let t00038 = []; // 政治面貌

      try {
        t00038 = await getCodeListByCodeName("t00038");
      } catch (err) {
        if (isDev) {
          console.log("code table t00038 error：", err);
        }
      }

      this.codeMap = {
        ...this.codeMap,
        t00038,
      };
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        t00012, // 入伍时间
        t00013, // 退伍时间
        t03801, // 服役年限折算
        t00038, // 政治面貌
        t00040, // 是否是士官
        t00039, // 入伍时户口所在地
        t00041, // 退伍证编号
      } = this.projectDeclareInfo;
      if (!t00012) {
        showModal("请选择入伍时间");
        return false;
      }
      if (!t00013) {
        showModal("请选择退伍时间");
        return false;
      }
      if (!t03801) {
        showModal("请输入服役年限折算");
        return false;
      }
      if (!t00038) {
        showModal("请选择政治面貌");
        return false;
      }
      if (!t00040) {
        showModal("请选择是否是士官");
        return false;
      }
      if (!t00039) {
        showModal("请选择或输入入伍时户口所在地");
        return false;
      }
      if (!t00041) {
        showModal("请输入退伍证编号");
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
        nature, // 户口性质
        currentAddress, // 现居住地址
      } = this.basicInfo;

      const {
        t00012, // 入伍时间
        t00013, // 退伍时间
        t03801, // 服役年限折算
        t00038, // 政治面貌
        t00040, // 是否是士官
        t00039, // 入伍时户口所在地
        t00041, // 退伍证编号
      } = this.projectDeclareInfo;

      // 扩展字段
      let hb00BizMap = {
        t00012, // 入伍时间
        t00013, // 退伍时间
        t03801, // 服役年限折算
        t00038, // 政治面貌
        t00040, // 是否是士官
        t00039, // 入伍时户口所在地
        t00041, // 退伍证编号
      };

      this.handleDeclareData(hb00BizMap, "0");
    },
  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>
