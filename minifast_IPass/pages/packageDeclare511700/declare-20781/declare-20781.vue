<!-- 自主就业扶贫培训经费补助（扶贫开发局） -->
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
        isOpenOCR
        addressFilter="1569472"
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
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentSelectAddressMultitype
              label="家庭住址"
              placeholder="请选择或输入家庭地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.f04201 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.f04201"
            >
            </ComponentSelectAddressMultitype>
            <ComponentDeclarePicker
              label="证书类型"
              idName="f00032"
              :range="codeMap.f00032"
              placeholder="请选择证书类型"
              v-model="projectDeclareInfo.f00032"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <div class="cell-item required" v-if="isShowNameInput">
              <div class="key">其他证书说明</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="12"
                  v-model="projectDeclareInfo.f00035"
                  placeholder="请输入其他证书说明"
                />
              </div>
            </div>
            <block v-if="isShowC">
              <ComponentDeclarePicker
                label="是否C类以上小车驾驶证"
                idName="f00034"
                :range="codeMap.yesorno"
                placeholder="请选择"
                v-model="projectDeclareInfo.f00034"
                @change="getPickerValueDesc"
              ></ComponentDeclarePicker>
            </block>

            <ComponentDeclarePicker
              label="初次申领日期"
              mode="date"
              placeholder="请选择初次申领日期"
              v-model="projectDeclareInfo.f00033"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">签发机关</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="8"
                  v-model="projectDeclareInfo.f00037"
                  placeholder="请输入签发机关"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">档案编号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.f00038"
                  placeholder="请输入档案编号"
                />
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">补贴标准</div>
              <div class="value">2000</div>
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
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20781',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        age: true, // 年龄
        birthday: true, // 出生日期
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {},
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectAddressMultitype,
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
      let f00032 = [] // 证书类型

      try {
        f00032 = await getCodeListByCodeName('f00032')
      } catch (err) {
        if (isDev) {
          console.log('code table f00032 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        f00032,
      }
    },
    // 初始化数据 暂未使用
    initData() {
      const { idCard, userName, user_id } = this.userInfo
      // 拦截未登录或延迟
      if (!user_id) {
        return
      }
      const declareType = this.declareType
      if (declareType === '01') {
        // this.getHo07Info(idCard, userName, this.chi031)
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        f00028, // 补贴标准
        f00032, // 证书类型
        f00033, // 领证日期
        f00038, // 档案编号
        f00037, // 签发机关
        f00034, // 是否c类以上小车驾驶证
        f00035, // 其他证书说明
        f04201, // 家庭住址
      } = this.projectDeclareInfo

      const { district } = this.basicInfo

      const isShowNameInput = this.isShowNameInput
      const isShowC = this.isShowC

      // const isShowC = this.isShowC
      if (!f04201) {
        showModal('请选择或输入家庭地址')
        return false
      }
      if (!f00032) {
        showModal('请选择证书类型')
        return false
      }
      if (!f00034 && isShowC) {
        showModal('请选择是否c类以上小车驾驶证')
        return false
      }
      if (!f00035 && isShowNameInput) {
        showModal('请输入其他证书说明')
        return false
      }
      if (!f00033) {
        showModal('请选择初次申领日期')
        return false
      }
      if (!f00037) {
        showModal('请输入签发机关')
        return false
      }
      if (!f00038) {
        showModal('请输入档案编号')
        return false
      }
      // const { isCheckFileAndRegister } = this.declareConfig
      // if (!this.isFileAndRegister && isCheckFileAndRegister) {
      //   showModal('申报人不是建档立卡贫困户，无法申报该补贴项目！')
      //   return false
      // }
      if (district !== '1569472') {
        showModal('抱歉，该补贴项目在申报人所在区县暂未开通！')
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
        f00028, // 补贴标准
        f00032, // 证书类型
        f00033, // 领证日期
        f00038, // 档案编号
        f00037, // 签发机关
        f00034, // 是否c类以上小车驾驶证
        f00035, // 其他证书说明
        f04201, // 家庭住址
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        f00028: '2000', // 补贴标准
        f00032, // 证书类型
        f00033, // 领证日期
        f00038, // 档案编号
        f00037, // 签发机关
        f00034, // 是否c类以上小车驾驶证
        f00035, // 其他证书说明
        f04201, // 家庭住址
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {
    // 是否显示其他证书说明输入框
    isShowNameInput() {
      let result = false
      const projectDeclareInfo = this.projectDeclareInfo
      if (projectDeclareInfo.f00032 === '5') {
        result = true
      }
      return result
    },
    // 是否显示C类驾驶证以上证书选择
    isShowC() {
      let result = false
      const projectDeclareInfo = this.projectDeclareInfo
      if (projectDeclareInfo.f00032 === '4') {
        result = true
      }
      return result
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
</style>
