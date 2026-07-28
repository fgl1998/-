<!--残疾人基本辅具适配补贴（残联） -->
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
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>

    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"></ComponentDeclarePersonnel>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c77501" placeholder="请输入监护人姓名" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">监护人联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.chb0ha"
                  placeholder="请输入监护人联系电话" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="致残原因"
              idName="c00075"
              :range="codeMap.c00075"
              placeholder="请选择致残原因"
              v-model="projectDeclareInfo.c00075">
            </ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">辅具价格</div>
              <div class="value">
                <input type="number" v-model="projectDeclareInfo.c00152" placeholder="请输入辅具价格" />
              </div>
            </div>

            <!-- 辅具联动 -->
            <block>
              <ComponentDeclarePicker
                label="辅具主类型"
                idName="c00150"
                :range="RangeC00150"
                rangeKey="chi912"
                valueKey="chi911"
                placeholder="请选择辅具主类型"
                v-model="projectDeclareInfo.c00150"
                @change="handlerGetC00206">
              </ComponentDeclarePicker>
            </block>
            <block v-if="projectDeclareInfo.c00150">
              <ComponentDeclarePicker
                label="辅具次类"
                idName="c00206"
                :range="RangeC00206"
                rangeKey="chi914"
                valueKey="chi913"
                placeholder="请选择辅具次类"
                v-model="projectDeclareInfo.c00206"
                @change="handlerGetC00085">
              </ComponentDeclarePicker>
            </block>
            <block v-if="projectDeclareInfo.c00206">
              <ComponentDeclarePicker
                label="辅具名称"
                idName="c00085"
                :range="RangeC00085"
                rangeKey="chi915"
                valueKey="chi915"
                placeholder="请选择辅具名称"
                v-model="projectDeclareInfo.c00085">
              </ComponentDeclarePicker>
            </block>

            <ComponentDeclarePicker
              mode="date"
              fields="day"
              label="适配时间"
              align="right"
              placeholder="请选择适配时间"
              v-model="projectDeclareInfo.c00151"></ComponentDeclarePicker>
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
      <ComponentButton @click="handleJumpNextStep" name="下一步" type="primary"></ComponentButton>
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

  import { mapGetters } from 'vuex'
  import { useDeclare } from '@/mixins'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal, navigateBack } from '@/utils/uni-api'
  import { requestB077 } from '@/service/api'
  import { USER_INFO, USER_LIST } from '@/store/constants'

  export default {
    name: 'pageDeclare20291',
    data() {
      return {
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          gender: true, // 性别
          age: true, // 年龄
          permanentAddress: true, // 户籍地址
          currentAddress: true // 现居住地址
        },
        allRange: [], //所有辅具
        RangeC00150: [], //辅具主类型
        RangeC00206: [], //辅具次类
        RangeC00085: [], //辅具名称
        projectDeclareInfo: {
          c00150: '',
          c00206: '',
          c00085: ''
        }
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker
    },
    mixins: [useDeclare],
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      this.handleOnLoad(e)
      this.getAccessories().then((res) => {
        this.allRange = res
        let arr = res.map((item) => {
          let { chi911 } = item
          return chi911
        })
        let data = [...new Set(arr)]
        this.RangeC00150 = data.map((item) => {
          return res.find((one) => one.chi911 == item)
        })
      })
    },
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      // 辅具次类获取
      handlerGetC00206() {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          c00206: '',
          c00085: ''
        }
        let { c00150 } = this.projectDeclareInfo
        let res = this.allRange.filter((item) => item.chi911 == c00150)
        let arr = res.map((item) => {
          let { chi913 } = item
          return chi913
        })
        let data = [...new Set(arr)]
        this.RangeC00206 = data.map((item) => {
          return res.find((one) => one.chi913 == item)
        })
      },
      // 辅具名称获取
      handlerGetC00085() {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          c00085: ''
        }
        let that = this
        let { c00206, c00150 } = this.projectDeclareInfo
        this.RangeC00085 = this.allRange.filter((item) => item.chi911 == c00150 && item.chi913 == c00206)
      },
      // 获取该申报项目的所需要的码表数据
      // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
      // 编写格式参考达州20033项目
      async getCodeTableCacheData() {
        let c00075 = [] // 致残原因

        try {
          c00075 = await getCodeListByCodeName('c00075')
        } catch (err) {
          console.error('code table c00075 error：', err)
        }

        this.codeMap = {
          ...this.codeMap,
          c00075
        }
      },
      // 请求辅具接口
      getAccessories() {
        return new Promise((resolve, reject) => {
          requestB077()
            .then((res) => {
              const resultData = res
              if (resultData.code === '-1') {
                reject(resultData.message)
              } else {
                const { list } = res.lists.hi91List
                if (list && list.length > 0) {
                  resolve(list)
                } else {
                  reject(res)
                }
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 设置残疾人信息
      setDisabledData(declareType) {
        const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } = this.userInfo
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
              c03601 // 残疾证号
            }
          } else {
            this.projectDeclareInfo = {
              ...this.projectDeclareInfo,
              chb0h1: '', // 残疾人类别
              chb0h1Desc: '',
              chb0h2: '', // 残疾等级
              chb0h2Desc: '',
              chb0h9: '', // 办证时间
              c03601: '' // 残疾证号
            }
            showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！').then(() => {
              navigateBack(1)
            })
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1: '', // 残疾人类别
            chb0h1Desc: '',
            chb0h2: '', // 残疾等级
            chb0h2Desc: '',
            chb0h9: '', // 办证时间
            c03601: '' // 残疾证号
          }
        }
      },
      // 设置数据 通过身份证获取的数据
      seDataByIdCard(data) {
        const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } = data.disabledInfo
        if (c03601) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1, // 残疾人类别
            chb0h1Desc, // 残疾人类别
            chb0h2, // 残疾等级
            chb0h2Desc,
            chb0h9, // 办证时间
            c03601 // 残疾证号
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1: '', // 残疾人类别
            chb0h1Desc: '',
            chb0h2: '', // 残疾等级
            chb0h2Desc: '',
            chb0h9: '', // 办证时间
            c03601: '' // 残疾证号
          }
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          c00075, // 致残原因
          c00152, // 辅具价格
          c00151, // 适配时间
          c03601, // 残疾证号

          c00150, //辅具主类
          c00206, //辅助次类
          c00085 //辅具名称
        } = this.projectDeclareInfo

        if (!c00075) {
          showModal('请选择致残原因')
          return false
        }
        if (!c00152) {
          showModal('请输入辅具价格')
          return false
        }
        if (!c00150) {
          showModal('请输入辅具主类')
          return false
        }
        if (!c00206) {
          showModal('请输入辅助次类')
          return false
        }
        if (!c00085) {
          showModal('请输入辅具名称')
          return false
        }
        if (!c00151) {
          showModal('请选择适配时间')
          return false
        }
        if (!c03601) {
          showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！')
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
          gender, // 性别
          age, // 年龄
          permanentAddress, // 户籍地址
          currentAddress // 现居住地址
        } = this.basicInfo

        const {
          c77501, // 监护人姓名
          chb0ha, // 监护人联系电话
          c00075, // 致残原因
          c00152, // 辅具价格
          c00151, // 适配时间

          c00150, //辅具主类
          c00206, //辅助次类
          c00085, //辅具名称

          chb0h1, // 残疾人类别
          chb0h2, // 残疾人等级
          c03601 // 残疾证号
        } = this.projectDeclareInfo

        // 扩展字段
        var hb00BizMap = {
          c00057: gender, // 性别
          chb00l: age, // 年龄
          c00033: currentAddress, // 家庭地址
          aae006: permanentAddress, // 户籍地址
          c77501, // 监护人姓名
          chb0ha, // 监护人联系电话
          c00075, // 致残原因
          c00152, // 辅具价格
          c00151, // 适配时间

          c00150, //辅具主类
          c00206, //辅助次类
          c00085, //辅具名称

          che0hf: chb0h1, // 残疾人类别
          chb0h1,
          chb0h2, // 残疾人等级
          c03601 // 残疾证号
        }

        this.handleDeclareData(hb00BizMap, '0')
      }
    },
    computed: { ...mapGetters([USER_INFO, USER_LIST]) },
    watch: {
      userInfo: {
        handler(val) {
          const declareType = this.declareType
          if (val.user_id && declareType !== '00') {
            this.setDisabledData(declareType)
          }
        },
        immediate: true,
        deep: true
      },
      declareType(val) {
        const { user_id } = this.userInfo
        if (val && user_id && val !== '00') {
          this.setDisabledData(val)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .declare-info-wrapper {
    margin-top: 30rpx;
  }
</style>
