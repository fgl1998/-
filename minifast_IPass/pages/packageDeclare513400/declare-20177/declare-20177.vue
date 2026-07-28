<!-- 实际种粮农民一次性补贴 （农业农村局） -->
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
              <div class="key">水稻补贴面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00002"
                  maxlength="12"
                  placeholder="请输入水稻补贴面积"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">玉米补贴面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00003"
                  maxlength="12"
                  placeholder="请输入玉米补贴面积"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">马铃薯补贴面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00004"
                  maxlength="12"
                  placeholder="请输入马铃薯补贴面积"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">小麦补贴面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00001"
                  maxlength="12"
                  placeholder="请输入小麦补贴面积"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">大豆补贴面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00275"
                  maxlength="12"
                  placeholder="请输入大豆补贴面积"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">荞麦补贴面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00280"
                  maxlength="12"
                  placeholder="请输入荞麦补贴面积"
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

import { useDeclare } from "@/mixins";
import { showModal } from "@/utils/uni-api";

export default {
  name: "pageDeclare20177",
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址

        age: true, // 年龄
        gender: true, // 性别
        nation: true, // 民族
      },
      // 申报信息
      projectDeclareInfo: {
        n00002: "",
        n00003: "",
        n00004: "",
        n00001: "",
        n00275: "",
        n00280: "",
      },
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
      
    },

    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        n00002, // 水稻补贴面积
        n00003, // 玉米补贴面积
        n00004, // 马铃薯补贴面积
        n00001, // 小麦补贴面积
        n00275, // 大豆补贴面积
        n00280, // 荞麦补贴面积
      } = this.projectDeclareInfo;

      if (!n00002) {
        showModal("请输入水稻补贴面积");
        return false;
      }
      if (!n00003) {
        showModal("请输入玉米补贴面积");
        return false;
      }
      if (!n00004) {
        showModal("请输入马铃薯补贴面积");
        return false;
      }
      if (!n00001) {
        showModal("请输入小麦补贴面积");
        return false;
      }
      if (!n00275) {
        showModal("请输入大豆补贴面积");
        return false;
      }
      if (!n00280) {
        showModal("请输入荞麦补贴面积");
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
        n00002, // 水稻补贴面积
        n00003, // 玉米补贴面积
        n00004, // 马铃薯补贴面积
        n00001, // 小麦补贴面积
        n00275, // 大豆补贴面积
        n00280, // 荞麦补贴面积
      } = this.projectDeclareInfo;
      // const {
      //   permanentAddress, // 现居住地址
      //   gender, // 性别
      //   nation, // 民族
      // } = this.basicInfo;
      // 扩展字段
      let hb00BizMap = {
        n00002, // 水稻补贴面积
        n00003, // 玉米补贴面积
        n00004, // 马铃薯补贴面积
        n00001, // 小麦补贴面积
        n00275, // 大豆补贴面积
        n00280, // 荞麦补贴面积
      };

      this.handleDeclareData(hb00BizMap, "0");
    },
  }
};
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>

