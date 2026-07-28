<!-- 体育助学资助 教育局-->
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
        permanentAddressLabel="就读学校"
        permanentAddressPlaceholder="请选择就读学校"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
      >
      </ComponentDeclare>
    </div>

    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">就读学校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001"
                  placeholder="请输入您的就读学校名称"
                />
              </div>
            </div>
            <!--            <div class="cell-item required">
              <div class="key">运动项目</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00093"
                  placeholder="请输入运动项目"
                />
              </div>
            </div> -->
            <ComponentDeclarePicker
              label="运动项目"
              idName="j00117"
              :range="codeMap.j00117_1"
              placeholder="请选择运动项目"
              v-model="projectDeclareInfo.j00117"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <div class="declare-info-wrapper">
      <ComponentPanel title="监护人信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="12"
                  v-model="projectDeclareInfo.j00019"
                  placeholder="请输入监护人姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.j00020"
                  placeholder="请输入监护人身份证号"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.j00064"
                  placeholder="请输入监护人的联系电话"
                />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="监护人现居住地址"
              placeholder="请选择监护人现居住地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.j00063 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.j00063"
            >
            </ComponentSelectAddressMultitype>
            <ComponentDeclarePicker
              label="监护人与本人关系"
              idName="j00092"
              :range="codeMap.chp031_1"
              placeholder="请选择监护人与本人关系"
              v-model="projectDeclareInfo.j00092"
              @change="getPickerValueDesc"
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
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useCheckIDCard } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20363',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, //性别
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        j00063: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectAddressMultitype,
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
      let chp031_1 = [] // 监护人与本人关系
      let j00117_1 = [] // 运动项目

      try {
        chp031_1 = await getCodeListByCodeName('chp031_1')
      } catch (err) {
        console.error('code table chp031_1 error：', err)
      }

      try {
        j00117_1 = await getCodeListByCodeName('j00117_1')
      } catch (err) {
        console.error('code table j00117_1 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        chp031_1,
        j00117_1,
      }
    },
    handleCheckInput() {
      const {
        // j00093, //运动项目
        j00001, //就读学校名称
        j00019, //监护人（受托人）姓名
        j00020, // 监护人（受托人）身份证号
        j00092, //监护人与本人关系
        j00063, //监护人现居住地址
        j00064, //监护人联系电话
        j00117, //运动项目
      } = this.projectDeclareInfo

      if (!j00001) {
        showModal('请输入就读学校名称')
        return false
      }
      if (!j00117) {
        showModal('请选择运动项目')
        return false
      }
      if (!j00019) {
        showModal('请输入监护人姓名')
        return false
      }
      if (!j00020) {
        showModal('请输入监护人身份证号')
        return false
      } else {
        const checkResult = useCheckIDCard(j00020, '监护人身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!j00092) {
        showModal('请选择')
        return false
      }
      if (!j00063) {
        showModal('请选择或输入监护人现居住地址')
        return false
      }
      if (!j00064) {
        showModal('请输入监护人联系电话')
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
        gender, //性别
        permanentAddress, // 户籍地址
      } = this.basicInfo

      const {
        j00001, //就读学校名称
        // j00093, //运动项目
        j00019, //监护人（受托人）姓名
        j00020, // 监护人（受托人）身份证号
        j00092, // 监护人与本人关系
        j00063, //监护人现居住地址
        j00064, //监护人联系电话
        j00117, //运动项目
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别
        aae006: permanentAddress, // 户籍地址
        j00001, //就读学校名称
        // j00093, //运动项目
        j00117, // 运动项目
        j00019, //监护人（受托人）姓名
        j00020, // 监护人（受托人）身份证号
        j00092, // 监护人与本人关系
        j00063, //监护人现居住地址
        j00064, //监护人联系电话
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
