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
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
      >
      </ComponentDeclare>
    </div>

    <!-- 人员类别 -->
    <div class="space-top-wrapper">
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
              <div class="key">养育机构</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00182"
                  placeholder="请输入养育机构"
                />
              </div>
            </div>
            <div class="cell-item textarea required">
              <div class="key">身体状况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入身体状况"
                  v-model="projectDeclareInfo.m00083"
                ></textarea>
              </div>
            </div>
            <div class="cell-item textarea required">
              <div class="key">本人意见</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入本人意见"
                  v-model="projectDeclareInfo.m00183"
                ></textarea>
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
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'

import { useDeclare } from '@/mixins'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare200192',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, // 性别
        birthday: true, // 出生日期
      },
      projectDeclareInfo: {
        m00083: '', // 身体状况
        m00182: '', // 养育机构
        m00183: '', // 本人意见
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclarePersonnel,
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        m00083, // 身体状况
        m00182, // 养育机构
        m00183, // 本人意见
      } = this.projectDeclareInfo
      if (!m00182) {
        showModal('请输入养育机构')
        return false
      }
      if (!m00083) {
        showModal('请输入身体状况')
        return false
      }
      if (!m00183) {
        showModal('请输入本人意见')
        return false
      }
      return true
    },

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      const {
        birthday, // 出生日期
        gender, // 性别
      } = this.basicInfo

      const {
        m00083, // 身体状况
        m00182, // 养育机构
        m00183, // 本人意见
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        aac004: gender, // 性别
        m00079: birthday, // 出生日期
        m00083, // 身体状况
        m00182, // 养育机构
        m00183, // 本人意见
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>
