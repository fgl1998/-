<!-- 种粮大户 （农业农村局） -->
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
        @change="handleChangePersonnelInfo"></ComponentDeclarePersonnel>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentSelectAddressMultitype
              label="详细地址"
              placeholder="请选择或输入详细地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.n00061 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.n00061">
            </ComponentSelectAddressMultitype>
            <div class="cell-item required">
              <div class="key">所在组</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chb019" placeholder="请输入所在组" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">受益人数</div>
              <div class="value">
                <input type="number" maxlength="11" v-model="projectDeclareInfo.n00077" placeholder="请输入受益人数" />
              </div>
            </div>
            <ComponentDeclareRadio
              label="作物种类"
              type="checkbox"
              :range="codeMap.n00039"
              aglin=""
              :value="['玉米']"
              ref="cropsData"
              v-model="projectDeclareInfo.n00039"></ComponentDeclareRadio>

            <div class="cell-item required">
              <div class="key">自有承包地亩数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.n00049"
                  placeholder="请输入自有承包地亩数" />
              </div>
            </div>

            <div class="cell-item">
              <div class="key">流转（租种）耕地亩数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.n00043"
                  placeholder="请输入流转（租种）耕地亩数" />
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">补贴总亩数</div>
              <div class="value">{{ projectDeclareInfo.n00006 || '暂无' }}</div>
            </div>

            <!--            <div class="cell-item required disabled">
              <div class="key">补贴标准等级</div>
              <div class="value">
                {{ projectDeclareInfo.n00101 || '暂无'
                }}<span v-if="projectDeclareInfo.n00101">级</span>
              </div>
            </div> -->
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!-- end  在以上代码中根据项目需求更改-->
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
  import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
  import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
  import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
  import { useDeclare } from '@/mixins'

  import { getIsDev, getDate } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'

  export default {
    name: 'pageDeclare20055',
    data() {
      return {
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          permanentAddress: true // 户籍地址
        },
        // 申报信息
        projectDeclareInfo: {
          n23901: 10,
          aae006: '',
          n00061: '',
          n00006: 0,
          n00043: '',
          n00049: '',
          // n00101: '',
          n00039: []
        },
        levelArr: [
          {
            name: '种粮农户',
            value: [
              { level: 1, range: [30, 100] },
              { level: 2, range: [100, 200] },
              { level: 3, range: [200, 300] },
              { level: 4, range: [300, 500] },
              { level: 5, range: [500] }
            ]
          },
          {
            name: '家庭农场',
            value: [
              { level: 1, range: [100, 200] },
              { level: 2, range: [200, 500] },
              { level: 3, range: [500] }
            ]
          },
          {
            name: '土地股份合作社',
            value: [
              { level: 1, range: [200, 300] },
              { level: 2, range: [300, 500] },
              { level: 3, range: [500] }
            ]
          },
          {
            name: '农民专业合作社',
            value: [
              { level: 1, range: [300, 500] },
              { level: 2, range: [500] }
            ]
          },
          {
            name: '粮食种植企业',
            value: [{ level: 1, range: [500] }]
          }
        ],
        // 卡片列表数据
        cardList: []
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentSelectPermanentAddress,
      ComponentSelectCurrentAddress,
      ComponentDeclareCard,
      ComponentDeclareRadio,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker,
      ComponentSelectAddressMultitype
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
        let n00039 = [] // 作物种类

        try {
          n00039 = await getCodeListByCodeName('n00039')
        } catch (err) {
          if (isDev) {
            console.log('code table n00039 error：', err)
          }
        }

        this.codeMap = {
          ...this.codeMap,
          n00039
        }
      },

      // 检测数据输入格式是否正确 须根据项目需求修改
      handleCheckInput() {
        const {
          n00061, // 详细地址
          chb019, // 组
          n00043, // 流转（租种）耕地亩数
          n00049, // 自有承包地亩数
          n00006, // 补贴总亩数
          n00039, // 主要粮食作物
          n00077 // 受益人数
          // n00101, // 补贴标准等级
        } = this.projectDeclareInfo

        if (!n00061) {
          showModal('请选择或输入详细地址')
          return false
        }
        if (!chb019) {
          showModal('请输入所在组')
          return false
        }
        if (!n00077) {
          showModal('请输入受益人数')
          return false
        }
        if (!n00039 || n00039.length < 1) {
          showModal('请选择主要粮食作物')
          return false
        }
        if (!n00049) {
          showModal('请输入自有承包地亩数')
          return false
        }
        // if (!n00101) {
        //   showModal(`种植面积不符合${this.personnelInfo.cac10a}标准`)
        //   return false
        // }
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
          aac002, // 身份证号
          aac003, // 姓名
          aae005, // 联系电话
          aae006, // 户籍地址

          chb015,
          chb017,
          chb018,
          chb019, // 组

          n00061, // 详细地址
          n00043, // 流转（租种）耕地亩数
          n00049, // 自有承包地亩数
          n00006, // 补贴总亩数
          n00039, // 主要粮食作物
          n00077 // 受益人数
          // n00101, // 补贴标准等级
        } = this.projectDeclareInfo
        const { idCard, userName, tel, permanentAddress, district, township, village } = this.basicInfo
        var n00224, // 玉米
          n00225, // 水稻
          n00226, // 大豆
          n00227, // 马铃薯
          n00228, // 小麦
          n00229, // 青稞
          n00230, // 荞麦
          n00231 = '0' // 其它
        n00039.forEach((item) => {
          switch (item) {
            case '1':
              n00224 = '1'
              break
            case '2':
              n00225 = '1'
              break
            case '3':
              n00226 = '1'
              break
            case '4':
              n00227 = '1'
              break
            case '5':
              n00231 = '1'
              break
            case '6':
              n00228 = '1'
              break
            case '7':
              n00229 = '1'
              break
            case '8':
              n00230 = '1'
              break
            default:
              break
          }
        })
        // 扩展字段
        let hb00BizMap = {
          aac002: idCard, // 身份证号
          aac003: userName, // 姓名
          aae005: tel, // 联系电话
          aae006: permanentAddress, // 户籍地址

          chb015: district,
          chb017: township,
          chb018: village,
          chb019, // 组

          n00061: n00061, // 详细地址
          n00077, // 受益人数
          n00043, // 流转（租种）耕地亩数
          n00049, // 自有承包地亩数
          n00006, // 补贴总亩数
          n00039: n00039.join(','), // 主要粮食作物
          n00224, // 玉米
          n00225, // 水稻
          n00226, // 大豆
          n00227, // 马铃薯
          n00228, // 小麦
          n00229, // 青稞
          n00230, // 荞麦
          n00231 // 其它
          // n00101, // 补贴标准等级
        }

        this.handleDeclareData(hb00BizMap, '0')
      }
    },
    computed: {
      allLand() {
        let { n00049, n00043 } = this.projectDeclareInfo
        if (n00049) {
          if (n00043) {
            return parseInt(n00043) + parseInt(n00049)
          } else {
            return parseInt(n00049)
          }
        } else {
          return 0
        }
      },
      level() {
        let info = this.personnelInfo
        let arr = this.levelArr
        let land = this.allLand
        let res = ''
        if (info.cac10a && land) {
          arr.forEach((item) => {
            if (item.name === info.cac10a) {
              item.value.forEach((one) => {
                if (one.range.length > 1) {
                  if (land >= one.range[0] && land < one.range[1]) {
                    res = one.level
                  }
                } else {
                  if (land >= one.range[0]) {
                    res = one.level
                  }
                }
              })
            }
          })
          return res
        } else {
          return ''
        }
      }
    },
    watch: {
      allLand: {
        handler(val) {
          this.projectDeclareInfo.n00006 = val
        },
        immediate: true
      }
      // level: {
      //   handler(val) {
      //     this.projectDeclareInfo.n00101 = val
      //   },
      //   immediate: true,
      // },
    }
  }
</script>

<style lang="scss" scoped>
  .declare-info-wrapper {
    margin-top: 30rpx;
  }
</style>
