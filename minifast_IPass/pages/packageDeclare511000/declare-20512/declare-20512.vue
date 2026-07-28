<!-- 妇女儿童应急帮扶补贴（妇联） -->
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
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
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
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">职业</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chab1"
                  placeholder="请输入职业"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭人口总数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.chab4"
                  placeholder="请输入家庭人口总数"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭年收入(元)</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="6"
                  v-model="projectDeclareInfo.chab5"
                  placeholder="请输入家庭年收入"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">工作情况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chab3"
                  placeholder="请输入您的工作情况"
                />
              </div>
            </div>

            <div class="cell-item textarea last required">
              <div class="key">申请原因</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入您的申请原因"
                  v-model="projectDeclareInfo.chab8"
                ></textarea>
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

import { useDeclare } from '@/mixins'
import { showModal } from '@/utils/uni-api'
import { checkPhoneNumber } from '@/utils/check'

export default {
  name: 'pageDeclare20512',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        currentAddress: true, // 现居住地址
        permanentAddress: true, // 户籍地址
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
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chab1, // 职业
        chab3, // 工作情况
        chab4, // 家庭人口总数
        chab5, // 家庭年收入
        chab8, // 申请原因
      } = this.projectDeclareInfo

      if (!chab1) {
        showModal('请输入职业')
        return false
      }
      if (!chab4) {
        showModal('请输入家庭人口总数')
        return false
      }
      if (!chab5) {
        showModal('请输入家庭年收入')
        return false
      }

      if (!chab3) {
        showModal('请输入工作情况')
        return false
      }
      if (!chab8) {
        showModal('请输入申报原因')
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

      const declareType = this.declareType
      const {
        currentAddress, // 现居住地址
      } = this.basicInfo
      const {
        chab1, // 职业
        w00034, // 现居住地址
        chab3, // 工作情况
        chab4, // 家庭人口总数
        chab5, // 家庭年收入
        chab8, // 申请原因
      } = this.projectDeclareInfo
      const hb00BizMap = {
        chab1, // 职业
        w00034, // 现居住地址
        chab3, // 工作情况
        chab4, // 家庭人口总数
        chab5, // 家庭年收入
        chab8, // 申请原因
      }
      // 自主申报
      if (declareType === '01') {
        hb00BizMap.w00034 = currentAddress
      }
      this.handleDeclareData(hb00BizMap, '1')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
$spacing: 30rpx;
.declare {
  position: relative;
  padding: $spacing 0;
  .basic-info-wrapper {
    width: 100%;
  }
  .declare-info-wrapper {
    width: 100%;
    margin-top: 30rpx;
  }
  .personnel-type-wrapper {
    width: 100%;
    margin-top: 30rpx;
  }
}
</style>
