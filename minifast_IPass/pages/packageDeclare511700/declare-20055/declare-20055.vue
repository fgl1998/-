<!-- 种粮大户补贴（农业农村局） -->
<template>
  <view class="declare">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <div class="basic-info-wrapper">
      <ComponentDeclare
        :declareType="declareType"
        addressFilter="1569457,1569460,1569463,1569466,1569472,1569475,1569469,1569481,2095930"
        :fixedDeclareType="fixedDeclareType"
        :renderObj="renderObj"
        isOpenOCR
        permanentAddressLabel="申报地址"
        permanentAddressPlaceholder="请选择申报地址"
        :projectNumber="chi031"
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel :renderData="personnelList" @change="handleChangePersonnelInfo">
      </ComponentDeclarePersonnel>
    </div>
    <!-- 申报信息 -->
    <div class="space-top-wrapper" v-if="personalType !== '0'">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="补贴年度"
              idName="N00288"
              placeholder="请选择补贴年度"
              mode="date"
              fields="year"
              :endTime="today"
              v-model="projectDeclareInfo.N00288"></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">种植地点</div>
              <!-- <div class="value">{{ getn00047 }}</div> -->
              <div class="value">
                <input type="text" maxlength="30" v-model="projectDeclareInfo.n00047" placeholder="请输入种植地点" />
              </div>
            </div>
            <block>
              <div class="cell-item" v-if="personalType === '1'">
                <div class="key">小麦种植面积(亩)</div>
                <div class="value">
                  <input
                    type="digit"
                    maxlength="10"
                    v-model="projectDeclareInfo.n00001"
                    placeholder="请输入小麦种植面积"
                    @input="handleCheckNumber($event, 'n00001')" />
                </div>
              </div>
              <div class="cell-item">
                <div class="key">水稻种植面积(亩)</div>
                <div class="value">
                  <input
                    type="digit"
                    maxlength="10"
                    v-model="projectDeclareInfo.n00002"
                    placeholder="请输入水稻种植面积"
                    @input="handleCheckNumber($event, 'n00002')" />
                </div>
              </div>
              <div class="cell-item">
                <div class="key">玉米种植面积(亩)</div>
                <div class="value">
                  <input
                    type="digit"
                    maxlength="10"
                    v-model="projectDeclareInfo.n00003"
                    placeholder="请输入玉米种植面积"
                    @input="handleCheckNumber($event, 'n00003')" />
                </div>
              </div>
              <div class="cell-item">
                <div class="key">高粱种植面积（亩）</div>
                <div class="value">
                  <input
                    type="digit"
                    maxlength="10"
                    v-model="projectDeclareInfo.n00251"
                    placeholder="请输入高粱种植面积"
                    @input="handleCheckNumber($event, 'n00251')" />
                </div>
              </div>

              <div class="cell-item required">
                <div class="key">承包面积(亩)</div>
                <div class="value">
                  <input
                    type="digit"
                    maxlength="10"
                    v-model="projectDeclareInfo.n00049"
                    placeholder="请输入承包面积"
                    @input="handleCheckNumber($event, 'n00049')" />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">租种面积(亩)</div>
                <div class="value">
                  <input
                    type="digit"
                    maxlength="10"
                    v-model="projectDeclareInfo.n00050"
                    placeholder="请输入租种面积"
                    @input="handleCheckNumber($event, 'n00050')" />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">捡种面积(亩)</div>
                <div class="value">
                  <input
                    type="digit"
                    maxlength="10"
                    v-model="projectDeclareInfo.n00147"
                    placeholder="请输入租种面积"
                    @input="handleCheckNumber($event, 'n00147')" />
                </div>
              </div>
              <div class="cell-item required disabled">
                <div class="key">种植面积合计(亩)</div>
                <div class="value">{{ getn00048 }}</div>
              </div>
              <div class="cell-item required disabled">
                <div class="key">耕地面积合计(亩)</div>
                <div class="value">{{ getn00051 }}</div>
              </div>
              <div class="cell-item required" v-if="isBusiness">
                <div class="key">组织机构代码</div>
                <div class="value">
                  <input
                    type="text"
                    maxlength="30"
                    v-model="projectDeclareInfo.chb0bl"
                    placeholder="请输入组织机构代码" />
                </div>
              </div>
            </block>
            <block v-if="personalType === '2'">
              <ComponentDeclarePicker
                label="机具品目"
                :range="codeMap.n00009"
                placeholder="请选择机具品目"
                v-model="projectDeclareInfo.n00009"></ComponentDeclarePicker>
              <div class="cell-item required">
                <div class="key">生产厂家</div>
                <div class="value">
                  <input type="text" maxlength="20" v-model="projectDeclareInfo.n00203" placeholder="请输入生产厂家" />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">数量（台、具）</div>
                <div class="value">
                  <input type="number" maxlength="10" v-model="projectDeclareInfo.n00143" placeholder="请输入数量" />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">单价（万元）</div>
                <div class="value">
                  <input type="digit" maxlength="10" v-model="projectDeclareInfo.n00144" placeholder="请输入单价" />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">已享受的农机购置补贴（万元）</div>
                <div class="value">
                  <input type="digit" maxlength="10" v-model="projectDeclareInfo.n00145" placeholder="请输入" />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">已享受的其他补贴（万元）</div>
                <div class="value">
                  <input type="digit" maxlength="10" v-model="projectDeclareInfo.n00146" placeholder="请输入" />
                </div>
              </div>
            </block>
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

  import { useDeclare } from '@/mixins'

  import { getIsDev } from '@/utils/get'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'

  import Big from '@/utils/big.min.js'
  import { getDate } from '@/utils/get'

  export default {
    name: 'pageDeclare20055',
    data() {
      return {
        today: getDate(),
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          permanentAddress: true // 户籍地址
        },
        // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
        projectDeclareInfo: {
          N00288: '', // 补贴年度，最后aae209生成加上N00288 + 12  202412
          n00001: '', // 小麦补贴面积
          n00002: '', // 水稻补贴面积
          n00003: '', // 玉米补贴面积
          n00251: '', // 高粱补贴面积

          n00049: '', // 承包面积
          n00050: '', // 租种面积
          n00147: '' // 捡种面积
        },
        doing: false //校验处理状态
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
        let n00009 = [] // 申报对象

        try {
          n00009 = await getCodeListByCodeName('n00009')
        } catch (err) {
          if (isDev) {
            console.log('code table n00009 error：', err)
          }
        }

        this.codeMap = {
          ...this.codeMap,
          n00009
        }
      },
      // 两位小数数字验证
      handleCheckNumber(e, id) {
        this.doing = true
        let { value } = e.target
        if (value) {
          let res = value
            .replace(/[^\d+(\.\d+)?$]/, '')
            .replace('.', '$#$')
            .replace(/\./g, '')
            .replace('$#$', '.')
          let index = res.indexOf('.')
          if (index > 0 && index + 3 < res.length) {
            res = res.slice(0, index + 3)
          }
          if (res.indexOf('.') == 0) {
            res = '0' + res
          }
          let _this = this
          this.$nextTick(function () {
            _this.projectDeclareInfo[id] = res
            _this.doing = false
          })
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          N00288, // 补贴年度
          n00001, // 小麦补贴面积
          n00002, // 水稻补贴面积
          n00003, // 玉米补贴面积

          n00049, // 承包面积
          n00050, // 租种面积
          n00147, // 捡种面积
          n00048, // 耕种面积合计
          n00051, // 种植面积合计
          chb0bl, // 组织机构代码

          n00009, // 机具品目
          n00203, // 生产厂家
          n00143, // 数量（台、具）
          n00144, // 单价（万元）
          n00145, // 已享受的农机购置补贴(万元)
          n00146, // 已享受的其他补贴(万元)
          n00047
        } = this.projectDeclareInfo
        const personalType = this.personalType
        const isBusiness = this.isBusiness

        if (!N00288) {
          showModal('请选择补贴年度')
          return false
        }

        if (!n00047) {
          showModal('请输入种植地点')
          return false
        }

        if (personalType == '1') {
          if (!n00001 && !n00002 && !n00003) {
            showModal('小麦种植面积、水稻种植面积、玉米种植面积至少要填写一项，请检查！')
            return false
          }

          if (!n00049) {
            showModal('请输入承包面积')
            return false
          }
          if (!n00050) {
            showModal('请输入租种面积')
            return false
          }
          if (!n00147) {
            showModal('请输入捡种面积')
            return false
          }
          if (isBusiness && !chb0bl) {
            showModal('请输入组织机构代码')
            return false
          }
        }
        if (personalType == '2') {
          if (!n00009) {
            showModal('请选择机具品目')
            return false
          }
          if (!n00203) {
            showModal('请输入生产厂家')
            return false
          }
          if (!n00143) {
            showModal('请输入数量')
            return false
          }
          if (!n00144) {
            showModal('请输入单价')
            return false
          }
          if (!n00145) {
            showModal('请输入已享受的农机购置补贴金额')
            return false
          }
          if (!n00146) {
            showModal('请输入已享受的其他补贴金额')
            return false
          }
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
        const getn00048 = this.getn00048
        const getn00051 = this.getn00051
        const getn00047 = this.getn00047
        const personalType = this.personalType

        const {
          N00288, // 补贴年度
          n00001, // 小麦补贴面积
          n00002, // 水稻补贴面积
          n00003, // 玉米补贴面积
          n00251, // 高粱补贴面积

          n00049, // 承包面积
          n00050, // 租种面积
          n00147, // 捡种面积
          n00048, // 耕种面积合计
          n00051, // 种植面积合计
          chb0bl, // 组织机构代码

          n00009, // 机具品目
          n00203, // 生产厂家
          n00143, // 数量（台、具）
          n00144, // 单价（万元）
          n00145, // 已享受的农机购置补贴(万元)
          n00146, // 已享受的其他补贴(万元)
          n00047
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          aae209: Number(N00288 + '12'), // 补贴期号
          N00288: Number(N00288), // 补贴年度
          n00001, // 小麦补贴面积
          n00002, // 水稻补贴面积
          n00003, // 玉米补贴面积
          n00251, // 高粱补贴面积

          n00049, // 承包面积
          n00050, // 租种面积
          n00147, // 捡种面积
          n00047, // 种植地点
          n00048: getn00051, // 耕种面积合计
          n00051: getn00048, // 种植面积合计
          chb0bl, // 组织机构代码
          n00148: personalType,

          n00009, // 机具品目
          n00203, // 生产厂家
          n00143, // 数量（台、具）
          n00144, // 单价（万元）
          n00145, // 已享受的农机购置补贴(万元)
          n00146 // 已享受的其他补贴(万元)
        }
        this.handleDeclareData(hb00BizMap, '0')
      }
    },
    computed: {
      personalType() {
        let result = '0'
        const { cac102 } = this.personnelInfo
        // 现金直补
        if (
          cac102 === '749' ||
          cac102 === '750' ||
          cac102 === '751' ||
          cac102 === '752' ||
          cac102 === '753' ||
          cac102 === '3331'
        ) {
          result = '1'
        }
        if (cac102 === '754' || cac102 === '755') {
          result = '2'
        }
        return result
      },
      isBusiness() {
        let result = false
        const { cac102 } = this.personnelInfo
        if (cac102 === '751' || cac102 === '752' || cac102 === '753') {
          result = true
        }
        return result
      },
      // 获取耕种面积
      getn00048() {
        // 数据处理中则取消计算
        if (this.doing) {
          return
        }
        let num = 0
        let { n00001, n00002, n00003, n00251 } = this.projectDeclareInfo
        n00001 = n00001 ? parseFloat(n00001).toFixed(2) : 0
        n00002 = n00002 ? parseFloat(n00002).toFixed(2) : 0
        n00003 = n00003 ? parseFloat(n00003).toFixed(2) : 0
        n00251 = n00251 ? parseFloat(n00251).toFixed(2) : 0
        num = new Big(num).plus(n00001).plus(n00002).plus(n00003).plus(n00251).toFixed(2)
        return num
      },
      // 获取种植面积
      getn00051() {
        if (this.doing) {
          return
        }
        let num = 0
        let { n00049, n00050, n00147 } = this.projectDeclareInfo
        n00049 = n00049 ? parseFloat(n00049).toFixed(2) : 0
        n00050 = n00050 ? parseFloat(n00050).toFixed(2) : 0
        n00147 = n00147 ? parseFloat(n00147).toFixed(2) : 0

        num = new Big(num).plus(n00049).plus(n00050).plus(n00147).toFixed(2)
        return num
      },
      // 获取种植地即申报村
      getn00047() {
        let res = '暂无'
        let { permanentAddress } = this.basicInfo
        if (permanentAddress) {
          let data = permanentAddress.split('-')[2]
          if (data) {
            res = data
          }
          return res
        }
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
