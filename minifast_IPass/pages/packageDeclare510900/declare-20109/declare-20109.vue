<!-- 返乡农民工补贴 （人社局） -->
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

            <!-- 创业项目名称 -->
            <div class="cell-item required">
              <div class="key">创业项目名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r46701"
                  placeholder="请输入创业项目名称"
                />
              </div>
            </div>

            <!-- 创业实体 -->

            <ComponentSelectAddressMultitype
              label="创业实体地址"
              placeholder="请选择或输入创业实体地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.r00026 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.r00026"
            >
            </ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="注册日期"
              idName="r00072"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.r00072"
              placeholder="请选择注册日期"
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
import ComponentSelectAddressMultitype from "@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue";
import { useDeclare } from "@/mixins";

import { getIsDev, getDate } from "@/utils/get";
import { checkIDCard, checkPhoneNumber } from "@/utils/check";
import { getCodeListByCodeName } from "@/utils/custom-api";
import { showModal } from "@/utils/uni-api";
export default {
  name: "pageDeclare20025",
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
				r00026: ''
			},
      today_d: getDate(),
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
    async getCodeTableCacheData() {},
    // 手动输入户主身份证号 失去焦点监听
    handleBlurM00004(e) {
      const { value } = e.target;
      const checkResult = checkIDCard(value);
      if (checkResult.status === "0") {
        showModal(checkResult.msg);
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
				r00079, // 户籍地址
				
				r46701, // 创业项目名称
				r00026, // 创业实体
				r00072, // 注册日期
      } = this.projectDeclareInfo;

      if (!r46701) {
        showModal("请输入创业项目名称");
        return false;
      }
      if (!r00026) {
        showModal("请选择或输入创业实体");
        return false;
      }

      if (!r00072) {
        showModal("请选择注册日期");
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
      } = this.basicInfo

      const {
				r00079, // 户籍地址
				
				r46701, // 创业项目名称
				r00026, // 创业实体
				r00072, // 注册日期
      } = this.projectDeclareInfo;

      // 扩展字段
      const hb00BizMap = {
				r00079:permanentAddress, // 户籍地址
				
				r46701, // 创业项目名称
				r00026, // 创业实体
				r00072, // 注册日期
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
