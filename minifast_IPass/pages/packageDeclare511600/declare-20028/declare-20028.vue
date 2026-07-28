<!-- 地质灾害避险搬迁安置 自然资源和规划局 -->
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
        isOpenOCR
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
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
            <div class="panel-content">
              <div class="cell-items">
                <div class="cell-item">
                  <div class="key">灵活就业工种</div>
                  <div class="value">
                    <input
                      type="text"
                      maxlength="12"
                      v-model="projectDeclareInfo.r00124"
                      placeholder="请输入灵活就业工种"
                    />
                  </div>
                </div>
                <div class="cell-item">
                  <div class="key">灵活就业收入</div>
                  <div class="value">
                    <input
                      type="number"
                      maxlength="12"
                      v-model="projectDeclareInfo.r00125"
                      placeholder="请输入灵活就业收入"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">社保缴费金额</div>
                  <div class="value">
                    <input
                      type="number"
                      maxlength="12"
                      v-model="projectDeclareInfo.r00126"
                      placeholder="请输入社保缴费金额"
                    />
                  </div>
                </div>

                <ComponentDeclarePicker
                  label="补贴申领时间"
                  idName="r00127"
                  mode="date"
                  fields="month"
                  :startTime="today_y"
                  :endTime="next_y"
                  v-model="projectDeclareInfo.r00127"
                  placeholder="请选择"
                ></ComponentDeclarePicker>

                <ComponentDeclarePicker
                  label="补贴申领截止时间"
                  idName="a00027"
                  mode="date"
                  fields="month"
                  :startTime="today_y"
                  :endTime="today"
                  v-model="projectDeclareInfo.r00128"
                  placeholder="请选择"
                ></ComponentDeclarePicker>
                <div class="cell-item required">
                  <div class="key">申领月份数</div>
                  <div class="value">
                    <input
                      type="number"
                      maxlength="2"
                      v-model="projectDeclareInfo.r00129"
                      placeholder="请输入申领月份数"
                    />
                  </div>
                </div>

                <!-- <div class="cell-item required textarea last">
                  <div class="key">现居地址</div>
                  <div class="value">
                    <textarea
                      placeholder="请输入现居地址"
                      maxlength="100"
                      v-model="projectDeclareInfo.r00108"
                    ></textarea>
                  </div>
                </div> -->
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20028',
  data() {
    return {
      today: getDate('month'),
      today_y: getDate('year'),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        r00128: '',
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
    async getCodeTableCacheData() {},

    handleCheckInput() {
      const {
        r00124, // 灵活就业工种
        r00125, // 灵活就业收入
        r00126, // 社保缴费金额
        r00127, // 补贴申领时间
        r00128, // 补贴申领截止时间
        r00129, // 申领月份数
        r00108, // 现居地址

        aae019, // 发放金额
      } = this.projectDeclareInfo
      // if (!r00124) {
      //   showModal('请输入灵活就业工种')
      //   return false
      // }
      // if (!r00125) {
      //   showModal('请输入灵活就业收入')
      //   return false
      // }
      if (!r00126) {
        showModal('请输入社保缴费金额')
        return false
      }
      if (!r00128) {
        showModal('请选择补贴申领截止时间')
        return false
      }
      if (!r00129) {
        showModal('请输入申领月份数')
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
      const { currentAddress } = this.basicInfo

      const {
        r00108, // 现居地址
        r00124, // 灵活就业工种
        r00125, // 灵活就业收入
        r00126, // 社保缴费金额
        r00127, // 补贴申领时间
        r00128, // 补贴申领截止时间
        r00129, // 申领月份数

        aae019, // 发放金额
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        r00108: currentAddress, // 现居地址
        r00124, // 灵活就业工种
        r00125, // 灵活就业收入
        r00126, // 社保缴费金额
        r00127: r00127.replace('-', ''), // 补贴申领时间
        r00128: r00128.replace('-', ''), // 补贴申领截止时间
        r00129, // 申领月份数

        aae019: '', // 发放金额
      }

      this.handleDeclareData(hb00BizMap, '1', null)
    },
  },
  computed: {
    next_y() {
      if (this.today_y) {
        return this.today_y + '-12'
      }
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
