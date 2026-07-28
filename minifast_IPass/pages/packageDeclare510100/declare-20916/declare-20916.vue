<!-- 残疾人居家安养补贴 残联 -->
<template>
  <view class="declare">
    <!-- 当前申报流程 -->
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <!-- 申报人或者代办人基本信息 -->
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
        currentAddressLabel="家庭地址"
        currentAddressPlaceholder="请输入家庭地址"
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
            <div class="cell-item required">
              <div class="key">家庭人数</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.c00048"
                  placeholder="请输入家庭人数"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="本人经济状况"
              idName="c00224"
              :range="codeMap.c00224"
              v-model="projectDeclareInfo.c00224"
              placeholder="请选择本人经济状况"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="自理能力状况"
              idName="c00223"
              :range="codeMap.c00223"
              v-model="projectDeclareInfo.c00223"
              placeholder="请选择自理能力状况"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">低保证号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00133"
                  placeholder="请输入低保证号"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">低保补差</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00225"
                  placeholder="请输入低保补差"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="是否困难家庭"
              idName="c00226"
              :range="codeMap.yesorno"
              v-model="projectDeclareInfo.c00226"
              placeholder="请选择是否困难家庭"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">护理人姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00227"
                  placeholder="请输入护理人姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">护理人电话</div>
              <div class="value">
                <input
                  type="number"
                  length="11"
                  v-model="projectDeclareInfo.c00228"
                  placeholder="请输入护理人电话"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="护理人与受托人关系"
              idName="c00229"
              :range="codeMap.c00229"
              v-model="projectDeclareInfo.c00229"
              placeholder="请选择关系"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">二代残疾证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.c03601"
                  placeholder="请输入残疾证号"
                  @change="handleCheckDisability"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="残疾类别"
              idName="chb0h1"
              :range="codeMap.chb0h1"
              v-model="projectDeclareInfo.chb0h1"
              placeholder="请选择残疾类别"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="残疾等级"
              idName="chb0h2"
              :range="codeMap.chb0h2"
              v-model="projectDeclareInfo.chb0h2"
              placeholder="请选择残疾等级"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!--    <div class="space-top-wrapper">
      <ComponentPanel title="残疾信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">残疾类别</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h1Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾等级</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h2Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾证号</div>
              <div class="value">{{ projectDeclareInfo.c03601 || '暂无' }}</div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">办证时间</div>
              <div class="value">{{ projectDeclareInfo.chb0h9 || '暂无' }}</div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div> -->

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
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20916',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        permanentAddress: true, // 户籍地址
        birthday: true, // 出生日期
        education: true, // 学历
        nature: true, // 户口性质
        currentAddress: true, // 现居住地址
      },
      projectDeclareInfo: {
        c00033: '',
        aae019: 350,
      },
    }
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
    this.handleOnLoad(e)
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
      const isDev = getIsDev() // 当前环境是否是开发环境
      let c00224 = [] // 本人经济状况
      let c00223 = [] // 自理能力状况chb0h1
      let c00229 = [] // 护理人与受托人关系
      let chb0h1 = [] // 残疾人类别
      let chb0h2 = [] // 残疾人等级

      try {
        c00223 = await getCodeListByCodeName('c00223')
      } catch (err) {
        if (isDev) {
          console.log('code table C00223 error：', err)
        }
      }

      try {
        c00224 = await getCodeListByCodeName('c00224')
      } catch (err) {
        if (isDev) {
          console.log('code table c00224 error：', err)
        }
      }

      try {
        c00229 = await getCodeListByCodeName('c00229')
      } catch (err) {
        if (isDev) {
          console.log('code table c00229 error：', err)
        }
      }

      try {
        chb0h1 = await getCodeListByCodeName('chb0h1')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h1 error：', err)
        }
      }

      try {
        chb0h2 = await getCodeListByCodeName('chb0h2')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h2 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        c00224, // 本人经济状况
        c00223, // 自理能力状况
        c00229, // 护理人与受托人关系
        chb0h1,
        chb0h2,
      }
    },
    handleCheckDisability(e) {
      const { value } = e.target
      if (value && !this.CheckDisability(value)) {
        showModal('请输入正确的残疾证号')
      }
    },
    // 校验残疾人证
    CheckDisability(value) {
      console.log(value)
      let str = /[\d]{17}[\dX][1-7][1-4]/.test(value)
      console.log(str)
      return str
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, // 性别
        c00033, // 家庭地址
        chb00l, // 年龄
        c00062, // 出生年月
        c00222, // 文化程度
        c00106, // 户口类型

        c00048, // 家庭人数
        c00224, // 本人经济情况
        c00223, // 自理状况
        c00225, // 低保补差
        c00133, // 低保证号
        c00226, // 是否是家庭困难
        c00227, // 护理人姓名
        c00228, // 护理人电话
        c00229, // 护理人与受托人关系

        c03601, // 残疾证号
        chb0h1,
        chb0h2,
      } = this.projectDeclareInfo

      if (!c00048) {
        showModal('请输入家庭人数')
        return false
      }
      if (!c00224) {
        showModal('请选择本人经济情况')
        return false
      }
      if (!c00223) {
        showModal('请选择自理状况')
        return false
      }
      if (!c00133) {
        showModal('请输入低保证号')
        return false
      }
      if (!c00225) {
        showModal('请输入低保补差')
        return false
      }
      if (!c00226) {
        showModal('请选择是否低保家庭')
        return false
      }
      if (!c00227) {
        showModal('请输入护理人姓名')
        return false
      }
      if (!c00228) {
        showModal('请输入护理人电话')
        return false
      }
      if (!c00229) {
        showModal('请选择护理人与受托人关系')
        return false
      }
      if (!c03601) {
        showModal('请输入残疾证号')
        return false
      } else if (!this.CheckDisability(c03601)) {
        showModal('请输入正确的残疾证号')
        return false
      }

      if (!chb0h1) {
        showModal('请选择残疾类别')
        return false
      }

      if (!chb0h2) {
        showModal('请选择残疾等级')
        return false
      }

      return true
    },
    // 下一步
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }

      const {
        age, // 年龄
        gender, // 性别
        birthday, // 出生日期
        education, // 学历
        nature, // 户口性质
        currentAddress, // 家庭住址
      } = this.basicInfo

      const {
        aac004, // 性别
        c00033, // 家庭地址
        chb00l, // 年龄
        c00062, // 出生年月
        c00222, // 文化程度
        c00106, // 户口类型

        c00048, // 家庭人数
        c00224, // 本人经济情况
        c00223, // 自理状况
        c00225, // 低保补差
        c00133, // 低保证号
        c00226, // 是否是家庭困难
        c00227, // 护理人姓名
        c00228, // 护理人电话
        c00229, // 护理人与受托人关系

        c03601, // 残疾证号
        chb0h1,
        chb0h2,
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别
        c00033: currentAddress, // 家庭地址
        chb00l: age, // 年龄
        c00062: birthday, // 出生年月
        c00222: education, // 文化程度
        c00106: nature, // 户口类型

        c00048, // 家庭人数
        c00224, // 本人经济情况
        c00223, // 自理状况
        c00225, // 低保补差
        c00133, // 低保证号
        c00226, // 是否是家庭困难
        c00227, // 护理人姓名
        c00228, // 护理人电话
        c00229, // 护理人与受托人关系

        c03601, // 残疾证号
        chb0h1,
        chb0h2,
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
