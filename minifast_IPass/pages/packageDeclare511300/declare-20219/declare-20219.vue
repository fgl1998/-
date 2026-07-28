<template>
  <!-- 教育扶贫救助基金 -->
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
            <ComponentDeclarePicker
              label="学段"
              idName="j00010"
              :range="codeMap.j00010"
              placeholder="请选择您的学段"
              v-model="projectDeclareInfo.j00010"
            ></ComponentDeclarePicker>
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
            <div class="cell-item required">
              <div class="key">学年班级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00003"
                  placeholder="请输入您的学年班级"
                />
              </div>
            </div>

            <ComponentDeclareRadio
              label="享受的国家资助"
              type="checkbox"
              :range="cropsData"
              valueKey="value"
              renderKey="name"
              aglin=""
              v-model="projectDeclareInfo.j00038"
            ></ComponentDeclareRadio>

            <div class="cell-item">
              <div class="key">自购保险费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00039"
                  placeholder="请输入您的自购保险费用"
                  @input="handleCheckNumber($event, 'j00039')"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">自购教辅材料费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00040"
                  placeholder="请输入您的自购教辅材料费用"
                  @input="handleCheckNumber($event, 'j00040')"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">自购校服费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00041"
                  placeholder="请输入您的自购校服费用"
                  @input="handleCheckNumber($event, 'j00041')"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">校内营养补充费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00042"
                  placeholder="请输入您的校内营养补充费用"
                  @input="handleCheckNumber($event, 'j00042')"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">其他费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00043"
                  placeholder="请输入您的其他费用"
                  @input="handleCheckNumber($event, 'j00043')"
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
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20219',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },

      projectDeclareInfo: {
        chbaac: '',
        j00038: '',
        j00039: '',
        j00040: '',
        j00041: '',
        j00042: '',
        j00043: '',
      },
      cropsData: [
        { id: 1, name: '幼儿保教费', value: '幼儿保教费' },
        { id: 1, name: '义教一补', value: '义教一补' },
        { id: 1, name: '普高助学金', value: '普高助学金' },
        { id: 1, name: '普高免学费', value: '普高免学费' },
        { id: 1, name: '中职助学金', value: '中职助学金' },
        { id: 1, name: '中职免学费', value: '中职免学费' },
        {
          id: 1,
          name: '建档立卡中职/本专科特别资助',
          value: '建档立卡中职/本专科特别资助',
        },
      ],
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclareRadio,
    ComponentDeclarePicker,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
    this.projectDeclareInfo.aae019 = '365'
  },
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let j00010 = [] // 申请人当前学历

      try {
        j00010 = await getCodeListByCodeName('j00010')
      } catch (err) {
        if (isDev) {
          console.log('code table j00010 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        j00010,
      }
    },
    // 数字验证
    handleCheckNumber(e, id) {
      let { value } = e.target
      if (value) {
        let res = value.replace(/\D+/g, '')
        let _this = this
        this.$nextTick(function () {
          _this.projectDeclareInfo[id] = res
        })
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac002, // 身份证号
        aac003, // 姓名
        aae005, // 联系电话
        aae006, // 户籍地址
        j00010, //学段
        j00001, //就读学校名称
        j00003, //学年班级

        j00038, //享受国家资助
        // j00039, //自购保险费用
        // j00040, //自购教材费用
        // j00041, //自购校服费用
        // j00042, // 校内营养补充费用
        // j00043, // 其他费用
      } = this.projectDeclareInfo
      if (!j00010) {
        showModal('请选择学段')
        return false
      }
      if (!j00001) {
        showModal('请输入就读学校名称')
        return false
      }
      if (!j00038 || j00038.length < 1) {
        showModal('请选择已享受的国家资助项目名称')
        return false
      }
      if (!j00003) {
        showModal('请输入学年班级')
        return false
      }
      // if (!j00039) {
      //   showModal("请输入自购保险费用");
      //   return false;
      // }
      // if (!j00040) {
      //   showModal("请输入自购教材费用");
      //   return false;
      // }
      // if (!j00041) {
      //   showModal("请输入自购校服费用");
      //   return false;
      // }
      // if (!j00042) {
      //   showModal("请输入校内营养补充费用");
      //   return false;
      // }
      // if (!j00043) {
      //   showModal("请输入其他费用");
      //   return false;
      // }

      return true
    },
    // 下一步
    handleJumpNextStep() {
      // if (!this.handleCheckComponentInput()) {
      //   return;
      // }
      if (!this.handleCheckInput()) {
        return
      }

      const {
        aac002, // 身份证号
        aac003, // 姓名
        aae005, // 联系电话

        j00010, //学段
        j00001, //就读学校名称
        j00038, //享受的国家资助
        j00039, //自购保险费用
        j00040, //自购教辅材料费用
        j00041, //自购校服费用
        j00042, //校内营养补充费用
        j00043, //其他
        aae006, //户籍地址
        j00003, //学年班级
      } = this.projectDeclareInfo
      // 扩展字段
      var hb00BizMap = {
        j00010, //学段
        j00001, //就读学校名称
        j00038, //享受的国家资助
        j00039, //自购保险费用
        j00040, //自购教辅材料费用
        j00041, //自购校服费用
        j00042, //校内营养补充费用
        j00043, //其他
        j00003, //学年班级
        aae006, //户籍地址
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
