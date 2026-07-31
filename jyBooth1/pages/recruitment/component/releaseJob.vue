<!-- 新增职位  -->
<template>
  <el-drawer
      title="新增职位"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible="visible"
      :before-close="handleClose"
      size="60%"
  >
    <div class="releaseJob">
      <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="120px"
          size="medium"
      >

        <div class="line">
          <el-form-item label="职位联系人" prop="acb224">
            <el-input v-model="form.acb224" clearable :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="职位联系电话" prop="acb225">
            <el-input v-model="form.acb225" clearable :maxlength="200"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="是否急招" prop="acb21v">
          <el-radio-group v-model="form.acb21v">
            <el-radio-button
                v-for="item in acb21vList"
                :key="item.value"
                :label="item.value"
            >{{ item.label }}
            </el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="工作方式" prop="acb469">
          <el-radio-group v-model="form.acb469" @change="acb469Change">
            <el-radio-button
                v-for="item in acb469List"
                :key="item.value"
                :label="item.value"
            >{{ item.label }}
            </el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="招工类型" prop="acb01f">
          <el-radio-group v-model="form.acb01f">
            <el-radio-button
                v-for="item in acb01fList"
                :key="item.value"
                :label="item.value"
            >{{ item.label }}
            </el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="岗位类型" prop="acb212">
          <el-radio-group v-model="form.acb212">
            <el-radio-button
                v-for="item in acb212List"
                :key="item.value"
                :label="item.value"
            >{{ item.label }}
            </el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="岗位类别" prop="aca111">
          <s-common-work-type-input
              v-model="form.aca112"
              placeholder="请选择岗位类别"
              @change="getAca111"
          ></s-common-work-type-input>
        </el-form-item>

        <el-form-item label="职位名称" prop="acb213">
          <el-input v-model="form.acb213" clearable :maxlength="200"></el-input>
        </el-form-item>

        <el-form-item label="招聘总人数" prop="acb21g">
          <el-input-number
              v-model="form.acb21g"
              label="请填写招聘总人数"
              :min="1"
              :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="招聘截止日期" prop="aae045" 
        >
          <el-date-picker
              v-model="form.aae045"
              type="date"
              :picker-options="{
                disabledDate:disabledDate
              }"
              placeholder="请选择招聘截止日期"
              value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="福利待遇" prop="acb214s">
          <el-select
              v-model="acb214s"
              placeholder="请选择福利待遇"
              style="width: 100%"
              clearable
              multiple
          >
            <el-option
                v-for="item in acb214List"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职位描述" prop="acb216">
          <el-input
              type="textarea"
              :rows="4"
              :maxlength="1000"
              placeholder="请输入职位描述"
              v-model="form.acb216"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="经验要求" prop="acc217">
          <el-select
              v-model="form.acc217"
              placeholder="请选择工作年限"
              style="width: 100%"
              clearable
              @change="acc217Change"
          >
            <el-option
                v-for="item in acc217List"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="tips">{{ experienceTip }}</div>
        </el-form-item>

        <el-form-item label="最低学历要求" prop="aac011">
          <el-select
              v-model="form.aac011"
              placeholder="请选择最低学历要求"
              style="width: 100%"
              clearable
              @change="aac011Change"
          >
            <el-option
                v-for="item in aac011List"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="tips">{{ educationTip }}</div>
        </el-form-item>

        <div class="salary">
          <el-form-item label="最低薪资" prop="acb21h">
            <el-input-number
                style="width: 100%;"
                v-model="form.acb21h"
                label="请输入最低薪资"
                :max="100000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="最高薪资" prop="acb21j">
            <el-input-number
                style="width: 100%;"
                v-model="form.acb21j"
                label="请输入最高薪资"
                :min="form.acb21h ? form.acb21h : 0"
                :max="100000"
                @change="acb21jChange"
            ></el-input-number>
            <div class="tips">{{ salaryTip }}</div>
          </el-form-item>
          <el-form-item label="薪资制度" prop="acb21z">
            <el-select
              v-model="form.acb21z"
              placeholder="请选择薪资制度"
              style="width: 100%"
              clearable
          >
            <el-option
                v-for="item in acb21zList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
          </el-form-item >
        
         
        </div>

        <!-- 职位标签 -->
        <el-form-item label="职位标签" prop="acb00r">
          <s-common-job-height-lights-input
              v-model="form.acb00r"
              placeholder="请选职位标签"
              @change="getAcb00r"
          ></s-common-job-height-lights-input>
        </el-form-item>

        <!-- 资格证书 -->
        <el-form-item label="资格证书" prop="acb21w">
          <qualification-certificate
              v-model="form.acb21w"
              placeholder="请选择资格证书"
              @change="getAcb21w"
              :maxLength="30"
          ></qualification-certificate>

        </el-form-item>

        <!--        <el-form-item label="上班地址" prop="acb217">
                  <s-common-address-map
                      ref="addressMap"
                      placeholder="请选择上班地址"
                      @change="getAcb217"
                      :defaultAddress="addressObj"
                  ></s-common-address-map>
                </el-form-item>-->

        <el-form-item label="工作地址" prop="acb217">
          <s-common-amap-map
              ref="amapMap"
              placeholder="请选择工作地址"
              @change="getAcb217"
              :defaultAddress="addressObj"
          ></s-common-amap-map>
        </el-form-item>


        
        <!-- <el-form-item label="岗位状态" prop="acb468">
          <el-select
              v-model="form.acb468"
              placeholder="请选择岗位状态"
              style="width: 100%"
              clearable
          >
            <el-option
                v-for="item in acb468List"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        
        <!-- <div class="range_box3">
          <el-form-item label="年龄要求" prop="acb253">
            <el-input-number
                v-model="form.acb253"
                label="请输入年龄下限"
                style="width: 100%"
                :min="18"
                :max="100"
            ></el-input-number>
          </el-form-item>
          <div class="text">至</div>
          <el-form-item label="" prop="acb254" class="select2">
            <el-input-number
                v-model="form.acb254"
                label="请输入年龄上限"
                style="width: 100%"
                :min="18"
                :max="100"
            ></el-input-number>
          </el-form-item>
        </div> -->

        <!-- <div class="range_box4">
          <el-form-item label="语言要求">
            <s-common-language-input
                ref="language"
                placeholder="请选择语言种类"
                @change="getAcc241"
            ></s-common-language-input>
          </el-form-item>
          <el-form-item label="" class="select2">
            <el-select
                v-model="form.acc242"
                placeholder="请选择语言熟练度"
                style="width: 100%"
                :disabled="form.acc241 && form.acc241 != '' ? false : true"
                clearable
            >
              <el-option
                  v-for="item in acc242List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div> -->
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" :disabled="disabledSubmit" @click="onSubmit('form')">提交</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import SCommonAddressMap from "../../../components/s-common-address-map/s-common-address-map.vue";
import SCommonAmapMap from "../../../components/s-common-amap-map/s-common-amap-map.vue";
import SCommonCascaderArea from "../../../components/s-common-cascader-area/s-common-cascader-area.vue";
import SCommonJobHeightLightsInput
  from "../../../components/s-common-job-height-lights-input/s-common-job-height-lights-input.vue";
import SCommonKeyWordsInput from "../../../components/s-common-key-words-input/s-common-key-words-input.vue";
import SCommonLanguageInput from "../../../components/s-common-language-input/s-common-language-input.vue";
import SCommonMajorInput from "../../../components/s-common-major-input/s-common-major-input.vue";
import sCommonWorkTypeInput from "../../../components/s-common-work-type-input/s-common-work-type-input.vue";
import moment from "moment";
import sCommonJobHeightLightsInput from "../../../components/s-common-job-height-lights-input/s-common-job-height-lights-input.vue";
import qualificationCertificate from "../../../components/qualification-certificate/qualification-certificate.vue";
export default {
  name: "releaseJob",
  components: {
    sCommonWorkTypeInput,
    SCommonMajorInput,
    SCommonJobHeightLightsInput,
    SCommonAddressMap,
    SCommonCascaderArea,
    SCommonKeyWordsInput,
    SCommonLanguageInput,
    SCommonAmapMap,
    sCommonJobHeightLightsInput,
    qualificationCertificate
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    visible: {
      handler(newVal, oldVal) {
        if (newVal) {

        }
        this.resetForm();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.acb469List = this.$codeConfig.getCode("acb469"); //工作方式
      this.acb01fList = this.$codeConfig.getCode("acb01f"); //招工类型
      this.acb212List = this.$codeConfig.getCode("acb212"); //岗位类型
      this.acb214List = this.$codeConfig.getCode("acb214"); //福利待遇
      this.acc217List = this.$codeConfig.getCode("acc217"); //经验要求,工作年限
      this.aac011List = this.$codeConfig.getCode("aac011"); //学历
      this.acb21zList = this.$codeConfig.getCode("ACB21Z"); //薪资制度
      // this.acc241List = this.$codeConfig.getCode("acc241");
      // this.acc242List = this.$codeConfig.getCode("acc242");
      // this.acb468List = this.$codeConfig.getCode("acb468");
    });
  },
  data() {
    // 招聘人数
    var checkAcb21g = (rule, value, callback) => {
      if (value) {
        if (value < 1) {
          callback(new Error("招聘人数不得低于1"));
        } else {
          callback();
        }
      } else {
        callback(new Error("请填写招聘人数"));
      }
    };
    // 年龄下限
    // var checkAcb253 = (rule, value, callback) => {
    //   if (value) {
    //     if (this.form.acb254 && this.form.acb254 < value) {
    //       callback(new Error("年龄下限不得高于年龄上限"));
    //     } else {
    //       callback();
    //     }
    //     if (value < 18) {
    //       callback(new Error("年龄下限不得低于18"));
    //     } else {
    //       callback();
    //     }
    //   } else {
    //     callback(new Error("请填写年龄下限"));
    //   }
    // };
    // 年龄上限
    // var checkAcb254 = (rule, value, callback) => {
    //   if (value) {
    //     if (this.form.acb253 && this.form.acb253 > value) {
    //       callback(new Error("年龄上限不得低于年龄下限"));
    //     } else {
    //       callback();
    //     }
    //     if (value > 100) {
    //       callback(new Error("年龄上限不得高于100"));
    //     } else {
    //       callback();
    //     }
    //   } else {
    //     callback(new Error("请填写年龄上限"));
    //   }
    // };
    // 最高月薪
    var checkAcb21j = (rule, value, callback) => {
      if (value) {
        if (this.form.acb21h && this.form.acb21h > value) {
          callback(new Error("工资下限不得高于工资上限"));
        } else {
          callback();
        }
        // if (value < 1500) {
        //   callback(new Error("最低薪资不得低于1500"));
        // } else {
        //   callback();
        // }
      } 
      else {
        callback();
        // callback(new Error("请填写工资下限"));
      }
    };
    // 最低月薪
    var checkAcb21h = (rule, value, callback) => {
      if (value) {
        if (value < 1500) {
          callback(new Error("最低薪资不得低于1500"));
        } else {
          callback();
        }
      } 
      // else {
      //   callback(new Error("请填写最低薪资"));
      // }
    };
    let userInfo = this.$loginConfig.getLoginInfo()
    return {
      userInfo,
      disabledSubmit: false,
      acb21vList: [{
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0,
        checked: true
      }],
      acb469List: [], //工作方式
      acb01fList: [], //招工类型
      acb212List: [], //岗位类型
      acb214List: [], //福利待遇
      acc217List: [], //工作年限
      aac011List: [], //最低学历要求
      acb21zList: [], //薪资制度
      // acb468List: [],
      // acc242List: [], // 语言熟练度
      addressObj: {
        areaCode: "",//行政区划
        areaName: "",//行政区划名称
        address: "",// 详细地址
        point: {
          lat: 30.4744,
          lng: 106.6318
        },
      }, // 上班地址
      // 表单数据
      form: {
        acb224: userInfo.name || "", //职位联系人
        acb225: userInfo.mobile || "", //职位联系电话
        acb21v: "0", //是否急招
        acb469: "1", //工作方式
        acb01f: "", //招工类型
        acb212: "1", //岗位类型
        aca111: "", //岗位类别
        aca112: "", //岗位类别
        acb213: "", //职位名称
        acb21g: "", //招聘人数
        aae045: "", //招聘截止日期
        //福利待遇
        acb216: "", //职位描述
        acc217: "", //经验要求
        aac011: "", //学历
        acb21h: 0, //最低薪资
        acb21j: 0, //最高薪资
        acb21z: "", //薪酬制度
        acb00r: "", //职位标签
        acb21w: "", //资格证书
        acb217: "", //工作地址
        acb303: "", //工作详细地址
        acb215: "",
        acb475: "",
        acb476: "",

        // auditArea: "",
        // acb253: "",
        // acb254: "",
        // acc241: "",
        // acc242: "",
        // acb468: "",
      },
      acb214s: ["10"], //福利待遇
      rules: {
        acb224: [
          {required: true, message: "请输入职位联系人", trigger: "change"},
        ],
        acb225: [
          {required: true, message: "请输入职位联系电话", trigger: "change"},
        ],
        acb21v: [
          {required: true, message: "请选择是否急招", trigger: "change"},
        ],
        acb469: [
          {required: true, message: "请选择工作方式", trigger: "change"},
        ],
        acb01f: [
          {required: true, message: "请选择招工类型", trigger: "change"},
        ],
        acb212: [
          {required: true, message: "请选择岗位类型", trigger: "change"},
        ],
        aca111: [
          {required: true, message: "请选择岗位类别", trigger: "change"},
        ],
        acb213: [
          {required: true, message: "请输入职位名称", trigger: "change"},
        ],
        acb21g: [
          {required: true, message: "请输入招聘人数", trigger: "change"},
          {validator: checkAcb21g, trigger: "change"}],
        aae045: [
          {required: true, message: "请选择招聘截止日期", trigger: "change"},
        ],
        acb216: [
          {required: true, message: "请输入职位描述", trigger: "change"},
        ],
        acc217: [
          {required: true, message: "请选择工作年限", trigger: "change"},
        ],
        aac011: [
          {required: true, message: "请选择最低学历要求", trigger: "change"},
        ],
        // acb21h: [{validator: checkAcb21h, trigger: "change"}],
        acb21j: [{validator: checkAcb21j, trigger: "change"}],
        acb217: [
          {required: true, message: "请选择工作地址", trigger: "change"},
        ],
        acb303: [
          {required: true, message: "请输入工作详细地址", trigger: "change"},
        ],
        // auditArea: [
        //   {required: true, message: "请选择审核地区", trigger: "change"},
        // ],
        // acb253: [{validator: checkAcb253, trigger: "change"}],
        // acb254: [{validator: checkAcb254, trigger: "change"}],
      },
      disabledDate: (current) => {
        //  不能选择今天以前,30天以后的日期
        return (current < moment().startOf("day")) || current > moment().add(30, 'days');
      },
      competitiveData: {},
      experienceTip: "",
      educationTip: "",
      salaryTip: ""
    };
  },
  methods: {
    moment,
    // 关闭弹窗
    handleClose(done) {
      this.addressObj = {};
      this.disabledSubmit = false;
      this.resetForm();
      this.$emit("onClose");
    },
    // 提交
    onSubmit(formName) {
      this.disabledSubmit = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            ...this.form
          };
          param.acb21m = "0";
          param.yae100 = "19";
          param.aab001 = this.userInfo.aab001;
          param.user_id = this.userInfo.user_id;
          param.acb466 = '0'
          param.acb214 = this.acb214s.join(',') //福利待遇
          if (!param.acb21h && !param.acb21j) {
            param.faceToFace = '1'
          }
          let acb21wArr = param.acb21w.split(",")
          let oddIndexArr2_num = acb21wArr.filter((item, index) => index % 2 === 0); //码值
          param.acb21w = oddIndexArr2_num.join(",")

          this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm114', null, param, true).then((data) => {
            this.$utils.showMessageModal('职位发布提示', '职位发布成功需后台审核并加入到招聘会')
            this.disabledSubmit = true;
            this.handleClose();
          }).catch((e) => {
            this.disabledSubmit = false;
          })
        } else {
          this.disabledSubmit = false;
        }
      });
    },
    // #region ------------------- 获取组件内的值 -------------------
    // 获取岗位类型
    getAca111(info, obj) {
      if (obj && JSON.stringify(obj) != "{}") {
        this.form.aca111 = obj.aca111 ? obj.aca111 : "";
        this.form.aca112 = obj.aca112 ? obj.aca112 : "";
        this.competitiveAnalysis()
      } else {
        this.form.aca111 = "";
        this.form.aca112 = "";
      }
    },
    // 获取职位标签
    getAcb00r(info) {
      this.form.acb00r = info;
    },
    // 获取资格证书
    getAcb21w(info){
      this.form.acb21w = info.map((obj) => {
        return "" + obj.aca150 + "," + obj.aca151
      }).join(',')
    },
    // 获取工作详细地址
    getAcb217(info, obj) {
      this.form.acb217 = obj.areaName;
      this.form.acb303 = info
      this.addressObj = obj;
      this.form.acb215 = obj.areaCode;
      this.form.acb475 = obj.point.lat;
      this.form.acb476 = obj.point.lng;
    },
    
    // 获取审核地址行政区划
    // getAreaInfo(code, info) {
    //   this.form.auditArea = code ? code[code.length - 1] : null;
    // },
    // 获取语言类型
    // getAcc241(info, obj) {
    //   console.log('getAcc241', info, obj)
    //   this.form.acc241 = info;
    // },
     // 获取专业
    // getAcc262(info, obj) {
    //   console.log('getAcc262', info, obj)
    //   if (obj && JSON.stringify(obj) != "{}") {
    //     this.form.acc262 = obj.aac183 ? obj.aac183 : "";
    //     this.form.acc262Desc = obj.aac183Desc ? obj.aac183Desc : "";
    //   } else {
    //     this.form.acc262 = "";
    //     this.form.acc262Desc = "";
    //   }
    // },
    // #endregion
    aac011Change(val){
      if(val < this.competitiveData?.education?.value){
        this.educationTip = this.competitiveData.education.message
      }else{
        this.educationTip = ""
      }
    },
    acc217Change(val){
      if(val > this.competitiveData?.experience?.value){
        this.experienceTip = this.competitiveData.experience.message
      }else{
        this.experienceTip = ""
      }
    },
    acb21jChange(){
      if(Number(this.form.acb21j) < Number(this.competitiveData?.salary?.value)){
        this.salaryTip = this.competitiveData?.salary?.message
      }else{
        this.salaryTip = ""
      }
    },

    acb469Change(){
      this.competitiveAnalysis()
    },
    
    //竞争力分析
    competitiveAnalysis(){ //竞争力分析
      let {acb469, aca111, aac011, acc217,acb21j} = this.form
      if(!aca111 || !acb469) return
      let param = {
        acb469,
        aca111,
        apiCode: "jy201_hrm132"
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm132', null, param, true).then(res=>{
        if(res){
           this.competitiveData = res.data.data
            acb21j &&  this.acb21jChange()
            aac011 && this.aac011Change(aac011)
            acc217 && this.acc217Change(acc217)
        }else{
          
        }

      }).catch(e=>{})
    },
 

    resetForm() {
      if (this.$refs.form) {
        this.form.aca111 = "";
        this.form.aca112 = "";
        this.form.acb215 = "";
        this.form.acb475 = "";
        this.form.acb476 = "";
        this.form.acb217 = "";
        this.form.acb303 = "";
        this.acb214s = [];
        this.addressObj = {
          address: "",
          point: {
            lat: 43.830763,
            lng: 87.62444,
          },
          areaCode: null, //行政区划
        };// 上班地址
        this.$refs.form.resetFields();

        if (this.$refs.addressMap) {
          this.$refs.addressMap.onClear()
        }
        if (this.$refs.amapMap) {
          this.$refs.amapMap.onClear()
        }
        if (this.$refs.language) {
          this.$refs.language.onClear()
        }
      }
    }
  },
};
</script>

<style lang="less" scoped>
.releaseJob {
  width: 100%;
  height: 90%;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;

  .line{
    display: flex;
  }
  .tips{
    color: #1177bb;
    font-size: 14px;
  }
}

.salary {
  display: flex;
}

.footer {
  width: 100%;
  height: 10%;
  padding: 20px;
  text-align: right;
}

// /deep/ .el-form {
//   width: 85%;
// }
/deep/ .el-form-item {
  width: 100%;
}

.range_box,
.range_box2,
.range_box3,
.range_box4 {
  width: 100%;
  display: flex;
  align-items: center;
}

/deep/ .range_box {
  .el-form-item {
    width: 50%;
  }

  .text {
    width: 50px;
    margin-bottom: 24px;
  }

  /deep/ .el-form-item:nth-of-type(2) {
    .el-form-item__content {
      margin-left: 100px;
    }
  }
}

/deep/ .range_box2 {
  > .el-form-item:nth-of-type(1) {
    width: 50%;
  }

  > .el-form-item:nth-of-type(2) {
    width: 50%;

    .el-form-item__content {
      margin-left: 24px !important;
    }
  }

  > .s_range_box {
    width: 50%;
    display: flex;
    align-items: center;

    > .el-form-item:nth-of-type(1) {
      .el-form-item__content {
        margin-left: 24px !important;
      }
    }

    > .select2 {
      .el-form-item__content {
        margin-left: 0px !important;
      }
    }

    .text {
      padding: 0 10px;
      margin-bottom: 24px;
    }
  }
}

/deep/ .range_box3 {
  .el-form-item:nth-of-type(1) {
    width: 50% !important;
  }

  .text {
    margin-bottom: 24px;
    padding: 0 20px;
  }

  .select2 {
    width: 44% !important;

    .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}

/deep/ .range_box4 {
  .el-form-item {
    width: 50% !important;
  }

  .select2 {
    .el-form-item__content {
      margin-left: 56px !important;
    }
  }
}

/deep/ .el-drawer__container {
  position: relative;
  left: 0;
  right: 0;
  top: 50%;
  bottom: 0;
  transform: translate(0, -50%);
  height: 100%;
  width: 100%;
}
</style>
