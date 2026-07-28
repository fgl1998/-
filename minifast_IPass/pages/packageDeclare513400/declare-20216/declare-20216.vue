<!-- 集中连片特困地区9+3生活补助（教育局）-->
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">学校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001desc"
                  placeholder="请输入学校名称"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="入学时间"
              mode="date"
              placeholder="请选择入学时间"
              v-model="projectDeclareInfo.chb0g1"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="4"
                  v-model="projectDeclareInfo.j00011"
                  placeholder="请输入年级"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="4"
                  v-model="projectDeclareInfo.j00019"
                  placeholder="请输入监护人姓名"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="监护人与本人关系"
              idName="j00092"
              :range="codeMap.CHP031_1"
              placeholder="请选择监护人与本人关系"
              v-model="projectDeclareInfo.j00092"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">监护人联系电话</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00064"
                  placeholder="请输入监护人联系电话"
                  @blur="handleAae005Blur"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭年收入</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="10"
                  v-model="projectDeclareInfo.chb0gl"
                  placeholder="请输入家庭年收入"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭人均年收入(元)</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="10"
                  v-model="projectDeclareInfo.chb0g3"
                  placeholder="请输入家庭人均年收入"
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

import { getIsDev, getDate } from "@/utils/get";
import { checkIDCard, checkPhoneNumber } from "@/utils/check";
import { getCodeListByCodeName } from "@/utils/custom-api";
import { showModal } from "@/utils/uni-api";
export default {
  name: "pageDeclare20797",
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        nation: true, // 民族
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },
      // 申报信息
      projectDeclareInfo: {
        chb0g1: "", // 入学时间    
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
    // 手动输入手机号 失去焦点监听
      handleAae005Blur(e) {
      const { value } = e.target
      const checkIDCardResult = checkPhoneNumber(value)
      if (checkIDCardResult.status === '0') {
        showModal(checkIDCardResult.msg, '提示', false)
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          aae005: '',
        }
      }
    },
     // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let CHP031_1 = [] // 

      try {
        CHP031_1 = await getCodeListByCodeName('CHP031_1')
      } catch (err) {
        if (isDev) {
          console.log('code table CHP031_1 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        CHP031_1,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        j00001desc, // 学校名称
        chb0g1, // 入学时间
        j00011, // 年级
        j00019, // 监护人姓名
        j00092, // 监护人与申请人关系
        j00064, // 监护人联系电话
        chb0gl, // 家庭年收入
        chb0g3, // 家庭人均年收入（元）
      } = this.projectDeclareInfo;
      if (!j00001desc) {
        showModal("请输入学校名称");
        return false;
      }
      if (!chb0g1) {
        showModal("请选择入学时间");
        return false;
      }
      if (!j00011) {
        showModal("请输入年级");
        return false;
      }
      if (!j00019) {
        showModal("请输入监护人姓名");
        return false;
      }
      if (!j00092) {
        showModal("请输入监护人与申请人关系");
        return false;
      }
      if (!j00064) {
        showModal("请输入监护人联系电话");
        return false;
      }else {
        const checkPhoneNumberResult = checkPhoneNumber(
          j00064,
          '联系电话'
        )
        if (checkPhoneNumberResult.status === '0') {
          showModal(checkPhoneNumberResult.msg)
          return false
        }
      }

      if (!chb0gl) {
        showModal("请输入家庭年收入");
        return false;
      }
       if (!chb0g3) {
        showModal("请输入家庭人均年收入");
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
    
        permanentAddress, //户籍地址
        age, // 年龄
        gender,// 性别
        nation,// 民族 
        currentAddress, // 现阶段地址
      } = this.basicInfo;
      const {

        j00001desc, // 学校名称
        chb0g1, // 入学时间
        j00011, // 年级
        j00019, // 监护人姓名
        j00092, // 监护人与申请人关系
        j00064, // 监护人联系电话
        chb0gl, // 家庭年收入
        chb0g3, // 家庭人均年收入（元）


      } = this.projectDeclareInfo;

      // 扩展字段
      let hb00BizMap = {
        aac005: nation, // 民族
        chb00l: age, // 年龄
        aac004: gender, // 性别
        chb0go: currentAddress, // 家庭地址
        j00001desc, // 学校名称
        chb0g1, // 入学时间
        j00011, // 年级
        j00019, // 监护人姓名
        j00092, // 监护人与申请人关系
        j00064, // 监护人联系电话
        chb0gl, // 家庭年收入
        chb0g3, // 家庭人均年收入（元）
      };

      this.handleDeclareData(hb00BizMap, "0");
    },
  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>

