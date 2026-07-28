<template>
  <!-- 残疾人就业创业扶持（残保金项目） -->
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
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">经营项目和规模</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00258"
                  placeholder="请输入经营项目和规模"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">注册资本（万元）</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00322"
                  placeholder="请输入注册资本（万元）"
                  @input='handleCheckNumber($event,"c00322")'
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">经营项目性质</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00277"
                  placeholder="请输入经营项目性质"
                />
              </div>
            </div>

            <ComponentSelectPermanentAddress
              label="经营地点"
              placeholder="请选择经营地点"
              v-model="projectDeclareInfo.c00260"
            ></ComponentSelectPermanentAddress>
            <ComponentDeclarePicker
              label="创业登记时间"
              idName="c00283"
              placeholder="请选择创业时间"
              mode="date"
              fields="day"
              :endTime="today"
              v-model="projectDeclareInfo.c00303"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">聘用残疾人人数</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00304"
                  placeholder="请输入聘用残疾人人数"
                  @input='handleCheckNumber($event,"c00304")'
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

 <!-- 添加家庭其他成员 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="添加聘用残疾人">
        <ComponentDeclareCard
          :renderData="cardList1"
          type="20640"
          addButtonName="添加聘用残疾人"
          @change="handleChangeCardList1"
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
        age: true, // 年龄
      },
      cardList1: [],
      projectDeclareInfo: {
        c00260: "",
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
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 数字校验
     handleCheckNumber(e,id) {
		  let { value } = e.target
		  if (value) {
		    let res = value.replace(/\D+/g, '')
				let _this=this
				this.$nextTick(function(){
					_this.projectDeclareInfo[id] = res
				})
		  }
		},
    getCodeTableCacheData() {},
    // handleChangeDataByIdCard(value){
    // 	this.seDataByIdCard(value)
    // },
        // 捕获 cardList 不用修改
    handleChangeCardList1(type, data) {
      this.cardList1 = [...data]
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
        c00258, // 经营项目和规模
        c00322, // 注册资本
        c00260, // 经营地点
        c00277, // 经营项目性质
        c00303, // 创业登记时间
        c00304, // 聘用残疾人人数
        c03601, // 二代残疾证号
      } = this.projectDeclareInfo;
      if (!c00258) {
        showModal("请输入经营项目和规模", "提示", false);
        return false;
      }
      if (!c00322) {
        showModal("请输入注册资本", "提示", false);
        return false;
      }
      if (!c00277) {
        showModal("请输入经营项目性质", "提示", false);
        return false;
      }
      if (!c00260) {
        showModal("请选择经营地点", "提示", false);
        return false;
      }
      if (!c00303) {
        showModal("请选择创业登记时间", "提示", false);
        return false;
      }
      let [year, month, day] = c00303.split("-");

      let time_begin = parseInt(parseInt(year) + 1 + month + day);
      let time_end = parseInt(parseInt(year) + 3 + month + day);
      let time = this.today;
      time = parseInt(time.replace(/-/g, ""));
      if (time < time_begin || time > time_end) {
        showModal("创业时间不符合该补贴要求", "提示", false);
        return false;
      }
      if (!c00304) {
        showModal("请输入聘用残疾人人数", "提示", false);
        return false;
      } else if (c00304 < 2) {
        showModal("聘用残疾人人数必须大于等于2");
        return false;
      }
       if (this.cardList1.length == 0) {
        showModal('请添加聘用残疾人信息')
        return false
      }
      // if (!c00029) {
      //   showModal('请输入购车原始发票号码', '提示', false)
      //   return false
      // }
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
      const { 
        permanentAddress,
        gender, 
        age 
       } = this.basicInfo;

      const cardList1 = this.cardList1
      const {

        c00258, // 经营项目和规模
        c00322, // 注册规模
       
        c00260, // 经营地点
        c00277, // 经营项目性质
        c00303, // 创业登记时间
        c00304, // 聘用残疾人人数
        chb0h1, // 残疾类别
        chb0h2, // 残疾等级
        c03601, // 二代残疾证号

      } = this.projectDeclareInfo;
      let hb00BizMap = {};
      // 扩展字段
      hb00BizMap = {
        aac004: gender, //性别,
        chb00l: age, //年龄,
        c00008: permanentAddress, //户籍地址

        c00258, // 经营项目和规模
        c00322, // 注册资本
        
        c00260, // 经营地点
        c00277, // 经营项目性质
        c00303, // 创业登记时间
        c00304, // 聘用残疾人人数
        chb0h1, // 残疾类别
        chb0h2, // 残疾等级
        c03601, // 二代残疾证号
      };
      const hp03List = []
      cardList1.map((item) => {
        hp03List.push({
          aac003: item.name, // 姓名
          aac004: item.sex, // 性别
          chb00l: item.age, // 年龄
          aac150: item.level, // 残疾等级
          aac149: item.style, // 残疾类别
          c03601: item.number, // 残疾证号
          aae005: item.phone, // 联系电话
          aae006: item.adress, // 户籍地址
          chp02x: item.time, // 残疾人聘用时间                               
        })
      })
     this.handleDeclareData(hb00BizMap, '1', null, hp03List)
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
