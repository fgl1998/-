<template>
  <!-- 残疾人就业创业扶持（残保金项目）	 -->
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

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
						
						<ComponentDeclarePicker
						  label="文化程度"
						  idName="c00222"
							:required="false"
						  :range="codeMap.aac011"
						  placeholder="请选择文化程度"
						  v-model="projectDeclareInfo.c00222"
						>
						</ComponentDeclarePicker>
						
						<div class="cell-item" :class="{required:otherRequired}">
						  <div class="key">经营项目</div>
						  <div class="value">
						    <input
						      type="text"
						      v-model="projectDeclareInfo.c00284"
						      placeholder="请输入经营项目"
						    />
						  </div>
						</div>
						
						<ComponentSelectAddressMultitype
						  label="经营地点"
						  :required="otherRequired"
						  placeholder="请选择或输入经营地点"
						  :isShowBtn="renderObj.permanentAddress"
						  @clickBtn="projectDeclareInfo.c00260 = basicInfo.permanentAddress"
						  v-model="projectDeclareInfo.c00260"
						>
						</ComponentSelectAddressMultitype>
						
            <div class="cell-item" :class="{required:otherRequired}">
              <div class="key">营业执照号码</div>
              <div class="value">
                <input
                  type="number"
									maxlength="20"
                  v-model="projectDeclareInfo.c00261"
                  placeholder="请输入营业执照号码"
                />
              </div>
            </div>
						
						<ComponentDeclarePicker
						  label="营业执照时间"
						  idName="c00305"
						  mode="date"
						  fields="day"
							:required="otherRequired"
						  :endTime="new Date().getTime()"
						  placeholder="请选择营业执照时间"
						  v-model="projectDeclareInfo.c00305"
						></ComponentDeclarePicker>
						
						<div class="cell-item" :class="{required: otherRequired}">
						  <div class="key">创建经济组织名称</div>
						  <div class="value">
						    <input
						      type="text"
						      v-model="projectDeclareInfo.c00307"
						      placeholder="请输入创建经济组织名称"
						    />
						  </div>
						</div>
						
						<div class="cell-item" :class="{required: isRequired}">
						  <div class="key">申请证书名称（编号）</div>
						  <div class="value">
						    <input
						      type="number"
									maxlength="20"
						      v-model="projectDeclareInfo.c00324"
						      placeholder="请输入申请证书名称（编号）"
						    />
						  </div>
						</div>
						
						<div class="cell-item" :class="{required: isRequired}">
						  <div class="key">曾获证书名称（编号）</div>
						  <div class="value">
						    <input
						      type="number"
									maxlength="20"
						      v-model="projectDeclareInfo.c00323"
						      placeholder="请输入曾获证书名称（编号）"
						    />
						  </div>
						</div>
						
						<div class="cell-item textarea last" :class="{required: otherRequired}">
						  <div class="key">经营现状描述</div>
						  <div class="value">
						    <textarea
						      placeholder="请输入经营现状描述"
						      maxlength="100"
						      v-model="projectDeclareInfo.c00306"
						    ></textarea>
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
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
  name: "pageDeclare20640",

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, //性别
				currentAddress: true ,//现居地址
				age: true, //年龄
      },

      projectDeclareInfo: {
        c00153: "",
        c00028: "",
      },
	  isRequired: true,
	  otherRequired: true,
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
		ComponentSelectAddressMultitype
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
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let c00211 = [] // 与残疾人关系
    	let c00116 = [] // 录取专业
			let aac011 = [] // 文化程度
    
      try {
        c00211 = await getCodeListByCodeName('c00211')
      } catch (err) {
        if (isDev) {
          console.log('code table c00211 error：', err)
        }
      }
    	try {
    	  c00116 = await getCodeListByCodeName('c00116')
    	} catch (err) {
    	  if (isDev) {
    	    console.log('code table c00116 error：', err)
    	  }
    	}
			try {
			  aac011 = await getCodeListByCodeName('aac011')
			} catch (err) {
			  if (isDev) {
			    console.log('code table aac011 error：', err)
			  }
			}
    
      this.codeMap = {
        ...this.codeMap,
        c00211,
    		c00116,
				aac011
      }
    },
		// 手动输入户主身份证号 失去焦点监听
		handleBlurM00004(e) {
		  const { value } = e.target;
		  const checkResult = checkIDCard(value);
		  if (checkResult.status === "0") {
		    showModal(checkResult.msg);
		  }
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
				aac004, //性别
				c00015, //现居住地址
				chb00l, //年龄
				
				c03601, //二代残疾证号
				
				c00222, //文化程度
				c00284, //经营项目
				c00260, //经营地点
				c00261, //营业执照号码
				c00305, //营业执照时间
				c00306, //经营现状描述
				c00307, //创建经济组织名称
				c00324, //申请证书名称（编号）
				c00323, //曾获证书名称（编号）
      } = this.projectDeclareInfo;
      // if (!c00222) {
      //   showModal("请选择文化程度");
      //   return false;
      // }
      if (!c00284 && this.otherRequired) {
        showModal("请输入经营项目");
        return false;
      }
      if (!c00260  && this.otherRequired) {
        showModal("请选择经营地点");
        return false;
      }
			if (!c00261&& this.otherRequired) {
			  showModal("请输入营业执照号码");
			  return false;
			}
			if (!c00305 && this.otherRequired) {
			  showModal("请选择营业执照时间");
			  return false;
			}
			
			
			if (!c00307&& this.otherRequired) {
			  showModal("请输入创建经济组织名称");
			  return false;
			}
			
			if (!c00324&& this.isRequired) {
			  showModal("请输入申请证书名称（编号）");
			  return false;
			}
			
			if (!c00323&& this.isRequired) {
			  showModal("请输入曾获证书名称（编号）");
			  return false;
			}
			
			if (!c00306&& this.otherRequired) {
			  showModal("请输入经营现状描述");
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
      const {
        gender, // 性别
        age,
        currentAddress,
      } = this.basicInfo;

      const {
				aac004, //性别
				c00015, //现居住地址
				chb00l, //年龄
				
				c03601, //二代残疾证号
				
				c00222, //文化程度
				c00284, //经营项目
				c00260, //经营地点
				c00261, //营业执照号码
				c00305, //营业执照时间
				c00306, //经营现状描述
				c00307, //创建经济组织名称
				c00324, //申请证书名称（编号）
				c00323, //曾获证书名称（编号）
      } = this.projectDeclareInfo;
      // 扩展字段
      const hb00BizMap = {
				aac004:gender, //性别
				c00015:currentAddress, //现居住地址
				chb00l:age, //年龄
				
				c03601, //二代残疾证号
				
				c00222, //文化程度
				c00284, //经营项目
				c00260, //经营地点
				c00261, //营业执照号码
				c00305, //营业执照时间
				c00306, //经营现状描述
				c00307, //创建经济组织名称
				c00324, //申请证书名称（编号）
				c00323, //曾获证书名称（编号）
      };

      this.handleDeclareData(hb00BizMap, "0");
    },
  },
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
	"personnelInfo.cac102": {
	  handler(val) {
		console.log(val,'val')
		if(val == '462' || '1183') {
			this.isRequired = false
			this.otherRequired = true
		}
		if(val == '1184') {
			this.isRequired = true
			this.otherRequired = false
		}
	  },
	  immediate: true,
	  deep: true,
	},
  },
};
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
