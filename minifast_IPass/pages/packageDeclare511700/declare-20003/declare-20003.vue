<!-- 县级教育扶贫救助基金（教育局） -->
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
        :projectNumber="chi031"
        :projectName="chi031_desc"
        addressFilter="1569457,1569460,1569463,1569466,1569472,1569475,1569469,1569481,2095930"
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="申请人当前学历"
              idName="chb0gn"
              :range="codeMap.chb0gn"
              placeholder="请选择申请人当前学历"
              v-model="projectDeclareInfo.chb0gn"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="是否住校"
              idName="j00021"
              :range="codeMap.yesorno"
              placeholder="请选择是否住校"
              v-model="projectDeclareInfo.j00021"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">就读学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001"
                  placeholder="请输入就读学校"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00011"
                  placeholder="请输入年级"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">班级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00012"
                  placeholder="请输入班级"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭人口</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.chb0gk"
                  placeholder="请输入家庭人口数"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭年收入(元)</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="12"
                  v-model="projectDeclareInfo.chb0gl"
                  placeholder="请输入家庭年收入"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭人均年收入(元)</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="12"
                  v-model="projectDeclareInfo.chb0g3"
                  placeholder="请输入"
                />
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">申请金额</div>
              <div class="value">200</div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 监护人信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="监护人信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
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
              <div class="key">与申请人关系</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb0gh"
                  placeholder="请输入与申请人关系"
                />
              </div>
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
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20003',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生日期
        currentAddress: true, // 现居住地址
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
      let chb0gn = [] // 申请人当前学历

      try {
        chb0gn = await getCodeListByCodeName('chb0gn')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0gn error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        chb0gn,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb0go, // 现居住地址
        chb0gn, // 申请人当前学历
        j00001, // 就读学校名称
        j00011, // 年级
        j00012, // 班级
        j00021, // 就读方式（是否住校）
        chb0gk, // 家庭人口

        j00020, // 监护人（受托人）身份证号
        j00019, // 监护人（受托人）姓名
        chb0gh, // 监护人与申请人关系

        chb0gl, // 家庭年收入
        chb0g3, // 家庭人均年收入(元)
        chb0gi, // 申请金额(元)
      } = this.projectDeclareInfo

      if (!chb0gn) {
        showModal('请选择申请人当前学历')
        return false
      }

      if (!j00021) {
        showModal('请选择是否住校')
        return false
      }
      if (!j00001) {
        showModal('请输入就读学校')
        return false
      }
      if (!j00011) {
        showModal('请输入年级')
        return false
      }
      if (!j00012) {
        showModal('请输入班级')
        return false
      }
      if (!chb0gk) {
        showModal('请输入家庭人口')
        return false
      }
      if (!chb0gl) {
        showModal('请输入家庭年收入')
        return false
      }
      if (!chb0g3) {
        showModal('请输入家庭人均年收入')
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
        const checkResult = checkIDCard(j00020, '监护人身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!chb0gh) {
        showModal('请输入监护人与申请人关系')
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
        currentAddress, // 现居住地址
      } = this.basicInfo

      const {
        chb0go, // 现居住地址
        chb0gn, // 申请人当前学历
        j00001, // 就读学校名称
        j00011, // 年级
        j00012, // 班级
        j00021, // 就读方式（是否住校）
        chb0gk, // 家庭人口

        j00020, // 监护人（受托人）身份证号
        j00019, // 监护人（受托人）姓名
        chb0gh, // 监护人与申请人关系

        chb0gl, // 家庭年收入
        chb0g3, // 家庭人均年收入(元)
        chb0gi, // 申请金额(元)
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        chb0go: currentAddress, // 现居住地址
        chb0gn, // 申请人当前学历
        j00001, // 就读学校名称
        j00011, // 年级
        j00012, // 班级
        j00021, // 就读方式（是否住校）
        chb0gk, // 家庭人口

        j00020, // 监护人（受托人）身份证号
        j00019, // 监护人（受托人）姓名
        chb0gh, // 监护人与申请人关系

        chb0gl, // 家庭年收入
        chb0g3, // 家庭人均年收入(元)
        chb0gi: '200', // 申请金额(元)
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
</style>
