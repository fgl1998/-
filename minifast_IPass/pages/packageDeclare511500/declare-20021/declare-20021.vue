<!-- 残疾人机动轮椅车燃油补贴（残联） -->
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

    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="户籍性质"
              idName="c00106"
              :range="codeMap.c00106"
              placeholder="请选择户籍性质"
              v-model="projectDeclareInfo.c00106"
            >
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">机动轮椅车名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00146"
                  placeholder="请输入机动轮椅车名称"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">机动轮椅车型号</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.c00147"
                  placeholder="请输入机动轮椅车型号"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">机动轮椅车编号</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.c00148"
                  placeholder="请输入机动轮椅车编号"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              mode="date"
              fields="day"
              label="购车时间"
              align="right"
              placeholder="请选择购车时间"
              v-model="projectDeclareInfo.c00028"
            ></ComponentDeclarePicker>
            <div class="cell-item">
              <div class="key">购车原始发票号号码</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.c00029"
                  placeholder="请输入购车原始发票号号码"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="是否经常使用"
              idName="c00153"
              :range="codeMap.yesorno"
              placeholder="请选择是否经常使用"
              v-model="projectDeclareInfo.c00153"
            >
            </ComponentDeclarePicker>
            <!--            <ComponentDeclarePicker
              label="是否为下肢残疾"
              idName="c00109"
              :range="codeMap.yesorno"
              placeholder="请选择是否经常使用"
              v-model="projectDeclareInfo.c00109"
            >
            </ComponentDeclarePicker> -->
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
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20021',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        age: true, // 年龄
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },

      projectDeclareInfo: {
        c00028: '',
        c00106: '',
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
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      let c00106 = [] // 户籍性质

      try {
        c00106 = await getCodeListByCodeName('c00106')
      } catch (err) {
        console.error('code table c00106 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        c00106,
      }
    },
    // 设置残疾人信息
    setDisabledData(declareType) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        this.userInfo
      // 残疾人数据返回格式
      // c03601: "51392219961015741053"
      // chb0h1: "5"
      // chb0h1Desc: "智力"
      // chb0h2: "3"
      // chb0h2Desc: "三级"
      // chb0h9: "2019-01-31"
      // chb0hf: "智力三级"
      // code: "1"
      if (declareType === '01') {
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
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1: '', // 残疾人类别
            chb0h1Desc: '',
            chb0h2: '', // 残疾等级
            chb0h2Desc: '',
            chb0h9: '', // 办证时间
            c03601: '', // 残疾证号
          }
          showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！').then(
            () => {
              navigateBack(1)
            }
          )
        }
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: '', // 残疾人类别
          chb0h1Desc: '',
          chb0h2: '', // 残疾等级
          chb0h2Desc: '',
          chb0h9: '', // 办证时间
          c03601: '', // 残疾证号
        }
      }
    },
    // 设置数据 通过身份证获取的数据
    seDataByIdCard(data) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        data.disabledInfo
      if (c03601) {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1, // 残疾人类别
          chb0h1Desc, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h2Desc,
          chb0h9, // 办证时间
          c03601, // 残疾证号
        }
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: '', // 残疾人类别
          chb0h1Desc: '',
          chb0h2: '', // 残疾等级
          chb0h2Desc: '',
          chb0h9: '', // 办证时间
          c03601: '', // 残疾证号
        }
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        c00106, // 户籍性质
        c00146, // 机动轮椅车名称
        c00147, // 机动轮椅车型号
        c00028, // 购车时间
        c00153, // 是否经常使用
        // c00109, // 是否为下肢残疾人
        c03601,
      } = this.projectDeclareInfo

      if (!c00106) {
        showModal('请选择户籍性质')
        return false
      }
      if (!c00146) {
        showModal('请输入机动轮椅车名称')
        return false
      }
      if (!c00147) {
        showModal('请输入机动轮椅车型号')
        return false
      }
      if (!c00028) {
        showModal('请选择购车时间')
        return false
      }
      if (!c00153) {
        showModal('请选择是否经常使用')
        return false
      }
      // if (!c00109) {
      //   showModal('请选择是否为下肢残疾人')
      //   return false
      // }
      if (!c03601) {
        showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！')
        return false
      }
      return true
    },
    // 下一步0
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      const {
        gender, // 性别
        age, // 年龄
        permanentAddress, // 户籍地址
        currentAddress, // 现居住地址
      } = this.basicInfo

      const {
        c00106, // 户籍性质
        c00146, // 机动轮椅车名称
        c00147, // 机动轮椅车型号
        c00028, // 购车时间
        c00153, // 是否经常使用
        c00148, // 机动轮编号
        // c00109, // 是否为下肢残疾人
        chb0h1, // 残疾人类别
        chb0h2, // 残疾人等级
        c03601, // 残疾证号
      } = this.projectDeclareInfo

      // 扩展字段
      var hb00BizMap = {
        aac004: gender, // 性别
        aae006: permanentAddress, // 户籍地址
        c00033: currentAddress, // 家庭地址
        chb00l: age, // 年龄
        chb0h1, // 残疾人类别
        chb0h2, // 残疾人等级
        c03601, // 残疾证号
        c00106, // 户籍性质
        c00146, // 机动轮椅车名称
        c00147, // 机动轮椅车型号
        c00148, // 机动轮编号
        c00028, // 购车时间
        c00153, // 是否经常使用
        // c00109, // 是否为下肢残疾人
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    userInfo: {
      handler(val) {
        const declareType = this.declareType
        if (val.user_id && declareType !== '00') {
          this.setDisabledData(declareType)
        }
      },
      immediate: true,
      deep: true,
    },
    declareType(val) {
      const { user_id } = this.userInfo
      if (val && user_id && val !== '00') {
        this.setDisabledData(val)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
