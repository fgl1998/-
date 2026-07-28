<template>
  <!-- 贫困智力、精神及重度残疾人残疾评定补贴(残联) -->
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

    <div class="declare-info-wrapper">
      <!-- 申报信息 -->
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="家庭经济情况"
              idName="c00213"
              :range="codeMap.c00213"
              placeholder="请选择家庭经济情况"
              v-model="projectDeclareInfo.c00213"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="申请标准"
              idName="c00315"
              :range="codeMap.c00315"
              placeholder="请选择申请标准"
              v-model="projectDeclareInfo.c00315"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">录取学校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00051"
                  placeholder="请输入录取学校名称"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">学制（年）</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00201"
                  placeholder="请输入学制"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">专业</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00052"
                  placeholder="请输入专业"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">考生号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00314"
                  placeholder="请输入考生号"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">准考证号</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.c00117"
                  placeholder="请输入准考证号"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="残疾信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">残疾类别</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h1Desc || "暂无" }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾等级</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h2Desc || "暂无" }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾证号</div>
              <div class="value">{{ projectDeclareInfo.c03601 || "暂无" }}</div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">办证时间</div>
              <div class="value">{{ projectDeclareInfo.chb0h9 || "暂无" }}</div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <div class="space-top-wrapper">
      <ComponentPanel title="父母基本情况">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20639"
          addButtonName="父母基本情况"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
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
import { getDate, getIsDev } from "@/utils/get";
import { checkIDCard, checkPhoneNumber } from "@/utils/check";
import { getCodeListByCodeName } from "@/utils/custom-api";
import { showModal } from "@/utils/uni-api";

export default {
  name: "pageDeclare20022",
  data() {
    return {
      today: getDate(),
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, //性别
        birthday: true, // 出生日期
      },

      projectDeclareInfo: {
        c00213: "", // 家庭经济情况
        c00315: "", // 申请标准
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
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data];
    },
    async getCodeTableCacheData() {
      const isDev = getIsDev(); // 当前环境是否是开发环境
      let c00213 = []; // 困难类型
      let c00315 = []; // 申请标准
      try {
        c00213 = await getCodeListByCodeName("c00213");
      } catch (err) {
        if (isDev) {
          console.log("code table c00213 error：", err);
        }
      }
      try {
        c00315 = await getCodeListByCodeName("c00315");
      } catch (err) {
        if (isDev) {
          console.log("code table c00315 error：", err);
        }
      }
      this.codeMap = {
        ...this.codeMap,
        c00213, // 家庭经济情况
        c00315, // 申请标准
      };
    },
    // 设置残疾人信息
    setDisabledData(declareType) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        this.userInfo;
      // 残疾人数据返回格式
      // c03601: "51392219961015741053"
      // chb0h1: "5"
      // chb0h1Desc: "智力"
      // chb0h2: "3"
      // chb0h2Desc: "三级"
      // chb0h9: "2019-01-31"
      // chb0hf: "智力三级"
      // code: "1"
      if (declareType === "01") {
        // 存在残疾证号
        if (c03601) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1, // 残疾人类别
            chb0h1Desc,
            chb0h2, // 残疾等级
            chb0h2Desc,
            chb0h9, // 办证时间
            c03601, // 残疾证号
          };
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1: "", // 残疾人类别
            chb0h1Desc: "",
            chb0h2: "", // 残疾等级
            chb0h2Desc: "",
            chb0h9: "", // 办证时间
            c03601: "", // 残疾证号
          };
          // showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！').then(
          //   () => {
          //     navigateBack(1)
          //   }
          // )
        }
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: "", // 残疾人类别
          chb0h1Desc: "",
          chb0h2: "", // 残疾等级
          chb0h2Desc: "",
          chb0h9: "", // 办证时间
          c03601: "", // 残疾证号
        };
      }
    },
    // 设置数据 通过身份证获取的数据
    seDataByIdCard(data) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        data.disabledInfo;
      if (c03601) {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1, // 残疾人类别
          chb0h1Desc, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h2Desc,
          chb0h9, // 办证时间
          c03601, // 残疾证号
        };
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: "", // 残疾人类别
          chb0h1Desc: "",
          chb0h2: "", // 残疾等级
          chb0h2Desc: "",
          chb0h9: "", // 办证时间
          c03601: "", // 残疾证号
        };
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        c00213, // 家庭经济困难情况
        c00315, // 申请标准
        c00051, // 录取学校
        c00201, // 学制
        c00052, // 专业
        c00314, // 考生号
        c00117, // 准考证号
        c03601, // 二代残疾证号
      } = this.projectDeclareInfo;

      const cardList = this.cardList;

      if (!c00213) {
        showModal("请选择家庭经济困难情况");
        return false;
      }
      if (!c00315) {
        showModal("请选择申请标准");
        return false;
      }
      if (!c00051) {
        showModal("请输入录取学校");
        return false;
      }
      if (!c00201) {
        showModal("请输入学制");
        return false;
      }
      if (!c00052) {
        showModal("请输入专业");
        return false;
      }
      if (!c00314) {
        showModal("请输入考生号");
        return false;
      }
      if (!c00117) {
        showModal("请输入准考证号");
        return false;
      }
      if (cardList.length == 0) {
        showModal("请添加父母基本情况");
        return false;
      }
      if (!c03601) {
        showModal("申报人不是残疾人，无法申报该补贴项目，请检查申报人信息！");
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

      const cardList = this.cardList;
      const { permanentAddress, gender, birthday } = this.basicInfo;

      const {
        c00213, // 家庭经济困难情况
        c00315, // 申请标准
        c00051, // 录取学校
        c00201, // 学制
        c00052, // 专业
        c00314, // 考生号
        c00117, // 准考证号
        chb0h1, // 残疾类别
        chb0h2, // 残疾等级
        c03601, // 二代残疾证号
        c00024, // 与申请人关系
        c00316, // 工作单位
        c00111, // 出生日期
      } = this.projectDeclareInfo;

      let hb00BizMap = {};
      // 扩展字段
      hb00BizMap = {
        aac004: gender, // 性别,
        c00008: permanentAddress, //户籍地址
        c00111: birthday, // 出生日期
        c00213, // 家庭经济困难情况
        c00315, // 申请标准
        c00051, // 录取学校
        c00201, // 学制
        c00052, // 专业
        c00314, // 考生号
        c00117, // 准考证号
        c00024, // 与申请人关系
        chb0h1, // 残疾类别
        chb0h2, // 残疾等级
        c03601, // 二代残疾证号
        c00316, // 工作单位
      };
      let hp03List = [];

      cardList.map((item) => {
        hp03List.push({
          aac003: item.name, // 残疾人姓名
          aac002: item.idCard, // 身份证
          c00024: item.relationship_desc, // 与申请人关系
          c00316: item.work, // 工作单位
          c03601: item.number, // 残疾证
          chb0h1: item.style, // 残疾类别
          chb0h2: item.level, // 残疾等级
        });
      });
      this.handleDeclareData(hb00BizMap, "1", null, hp03List);
    },
  },
  computed: {},
  watch: {
    userInfo: {
      handler(val) {
        const declareType = this.declareType;
        if (val.user_id && declareType !== "00") {
          this.setDisabledData(declareType);
        }
      },
      immediate: true,
      deep: true,
    },
    declareType(val) {
      const { user_id } = this.userInfo;
      if (val && user_id && val !== "00") {
        this.setDisabledData(val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
