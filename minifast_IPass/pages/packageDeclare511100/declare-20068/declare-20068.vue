<!-- 残疾人及残疾人子女教育资助 -->
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
              <div class="key">录取学校</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.c00051"
                  placeholder="请输入录取学校"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">录取通知书编号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.c00135"
                  placeholder="请输入录取通知书编号"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="学校类别"
              idName="c00143"
              :range="codeMap.C00143"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择学校类别"
              v-model="projectDeclareInfo.c00143"
            ></ComponentDeclarePicker>
            <block v-if="personnelInfo.cac102 == '3185'">
              <ComponentDeclarePicker
                label="残疾人关系"
                idName="c00186"
                :range="codeMap.c00186"
                rangeKey="aaa103"
                valueKey="aaa102"
                placeholder="请选择残疾人关系"
                v-model="projectDeclareInfo.c00186"
              ></ComponentDeclarePicker>
              <div class="cell-item required">
                <div class="key">父亲（母亲）姓名</div>
                <div class="value">
                  <input
                    type="text"
                    maxlength="20"
                    v-model="projectDeclareInfo.c00006"
                    placeholder="请输入姓名"
                  />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">父亲（母亲）身份证号</div>
                <div class="value">
                  <input
                    type="idcard"
                    maxlength="18"
                    v-model="projectDeclareInfo.c00007"
                    @blur="handleCheckIdCardC00007"
                    placeholder="请输入身份证号"
                  />
                </div>
              </div>
            </block>
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { showModal } from '@/utils/uni-api'
import { requestSPGetHo08 } from '@/service/api'
import { useGetCurrentDate, useCheckIDCard } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
export default {
  name: 'pageDeclare20068',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        nation: true, //民族
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },
      // 申报信息
      projectDeclareInfo: {
        c00135: '', // 录取通知书编号
        c00051: '',
        c00143: '',
        c03601: '',
        c00186: '',
        c00006: '',
        c00007: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclareCard,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      let C00143 = [] // 学校类别
      let c00186 = [] // 残疾类别
      let arr = [] // 残疾类别
      try {
        C00143 = await getCodeListByCodeName('C00143')
      } catch (err) {
        console.error('code C00143 table error：', err)
      }

      try {
        c00186 = await getCodeListByCodeName('C00186')

        // 剔除可选码值 本人
        for (let i = 0; i < c00186.length; i++) {
          const item = c00186[i]
          if (item.aaa102 !== '3') {
            arr.push(item)
          }
        }
      } catch (err) {
        console.error('code C00186 table error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        C00143,
        c00186: arr,
      }
    },

    // 设置残疾信息
    setDisabilityInfo(data) {
      if (data) {
        const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } = data

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
      }
    },

    // 通过身份证号获取残疾人信息
    getDisabilityInfoByIdCard(aac002) {
      requestSPGetHo08(aac002, true, false)
        .then((res) => {
          this.setDisabilityInfo(res)
        })
        .catch(() => {
          this.setDisabilityInfo(null)
        })
    },

    // 当人员类别为残疾人子女时 校验父母身份证号并获取残疾号
    handleCheckIdCardC00007(e) {
      const { value } = e.detail
      const checkRes = useCheckIDCard(value, '父亲（母亲）身份证号')
      if (checkRes.status == '0') {
        showModal(checkRes.msg)
        this.setDisabilityInfo(null)
        return
      }
      this.getDisabilityInfoByIdCard(value)
    },

    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        c00135, // 录取通知书编号
        c00051, // 录取学校
        c03601, // 残疾证号
        c00143, // 学校类别
        c00186, // 残疾人关系
        c00006, // 父亲（母亲）姓名
        c00007, // 父亲（母亲）身份证号
      } = this.projectDeclareInfo

      const { cac102 } = this.personnelInfo

      if (!c00051) {
        showModal('请输入学校名称')
        return false
      }
      if (!c00135) {
        showModal('请输入录取通知书编号')
        return false
      }
      if (!c00143) {
        showModal('请选择学校类别')
        return false
      }

      // 残疾人子女
      if (cac102 === '3185') {
        if (!c00186) {
          showModal('请选择残疾人关系')
          return false
        }
        if (!c00006) {
          showModal('请输入父亲（母亲）姓名')
          return false
        }
        if (!c00007) {
          showModal('请输入父亲（母亲）身份证号')
          return false
        } else {
          const checkRes = useCheckIDCard(c00007, '父亲（母亲）身份证号')
          if (checkRes.status == '0') {
            showModal(checkRes.msg)
            return
          }
        }
      }

      if (!c03601) {
        showModal('申报人不符合申报条件')
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
        c00135,
        c00051,
        c03601,
        c00143,
        c00186, // 残疾人关系
        c00006, // 父亲（母亲）姓名
        c00007, // 父亲（母亲）身份证号
      } = this.projectDeclareInfo

      const { nation, age, gender, currentAddress } = this.basicInfo
      const { cac102 } = this.personnelInfo

      // 扩展字段
      let hb00BizMap = {
        c00135, // 录取通知书编号
        aac005: nation, // 民族
        chb00l: age, // 年龄
        aac004: gender, // 性别
        c00015: currentAddress, // 现居住地址
        c00051, // 录取学校
        c03601, // 二代残疾证号
        c00143, // 学校类别
        c00186: cac102 === '3185' ? cac102 : '3', // 残疾人关系 残疾人人员类别默认为3
        c00006, // 父亲（母亲）姓名
        c00007, // 父亲（母亲）身份证号
        aae019: 0, // 发放金额
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  watch: {
    // 监听基本信息中身份证号改变
    'basicInfo.idCard': {
      handler(val) {
        if (val) {
          const checkRes = useCheckIDCard(val)
          if (checkRes.status == '0') {
            this.setDisabilityInfo(null)
            return
          }

          const { cac102 } = this.personnelInfo
          // 残疾人类别
          if (cac102 && cac102 != '3185') {
            this.getDisabilityInfoByIdCard(val)
          } else {
            this.setDisabilityInfo(null)
          }
        }
      },
      immediate: true,
    },

    // 监听人员类别改变
    'personnelInfo.cac102': {
      handler(val) {
        if (val) {
          // 残疾人类别
          let _idCard = ''
          if (val != '3185') {
            _idCard = this.basicInfo.idCard
          } else {
            _idCard = this.projectDeclareInfo.c00007
          }
          const checkRes = useCheckIDCard(_idCard)
          if (checkRes.status == '0') {
            this.setDisabilityInfo(null)
            return
          }
          this.getDisabilityInfoByIdCard(_idCard)
        }
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
