<template>
  <view class="notice h5-page">
    <scroll-view class="scroll-view" :scroll-y="true" :scroll-into-view="scrollIntoView">
      <block v-if="renderData && renderData.length > 0">
        <block v-for="item in renderData" :key="item.id">
          <div class="item-card" :id="item.id">
            <ComponentCardNotice :renderData="item"></ComponentCardNotice>
          </div>
        </block>

        <div class="item-card" v-if="isRequestPolicyDocumentOver">
          <ComponentCardNotice :renderData="relevantPolicies" type="policy"></ComponentCardNotice>
        </div>
        <div class="item-card" v-if="isShowDeclarationEntry">
          <ComponentCardNotice :renderData="declarationEntry"></ComponentCardNotice>
        </div>
      </block>

      <div class="btn-wrapper" v-if="chi04z === '1' && showApply">
        <ComponentButton @click="handleApply" fontWeight="500" name="立即申报" type="primary"></ComponentButton>
      </div>
    </scroll-view>
  </view>
</template>

<script>
  // 图片导入 转为base64 由于打包体积超过2M
  import image01 from './images/1.png'
  import image02 from './images/2.png'
  import image03 from './images/3.png'
  import image04 from './images/4.png'
  import image05 from './images/5.png'
  import image06 from './images/6.png'

  import ComponentCardNotice from './CardNotice.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'

  import config from '@/config'
  import { navigateTo, setNavigationBarTitle, showModal, navigateBack } from '@/utils/uni-api'
  import { requestB017, requestSPGetHi05List } from '@/service/api'
  import { getDeclareConfig } from '@/utils/get'

  import { USER_INFO, USER_LIST } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  import { areaCode } from '@/config/city'
  export default {
    name: 'pageNotice',
    components: {
      ComponentCardNotice,
      ComponentButton
    },
    data() {
      return {
        scrollIntoView: '',
        timer: null, //
        renderData: [], // 渲染数据
        chi031: '', // 补贴项目编码
        chi031_desc: '', // 补贴项目中文
        chi04z: '', // 是否开通
        showApply: false, // 是否显示申报按钮 解决提前显示的bug
        // 渲染数据 格式 供参考 未使用
        mockRenderData: [
          {
            id: 'fwdx',
            src: image01,
            title: '服务对象',
            list: [
              {
                title: '',
                list: [
                  {
                    symbol: 'point',
                    value: '户籍、党组织关系均在内江市'
                  },
                  {
                    symbol: 'point',
                    value: '履行党员义务，参加党员活动，按时缴纳党费'
                  },
                  {
                    symbol: 'point',
                    value: '年龄80周岁以上'
                  },
                  {
                    symbol: 'point',
                    value: '党龄达30年'
                  },
                  {
                    symbol: 'point',
                    value:
                      '未领取机关事业单位养老保险、城镇职工养老保险、居民（个体）养老保险；领取各级党委、政府发放的固定收入不超过3000元/年；除此之外，为党的事业作出突出贡献，获得市级及以上党委授予的“优秀共产党员”或“优秀党务工作者”等称号、生活困难且符合1、2、5项条件的党员也可申请定期补助'
                  }
                ]
              }
            ]
          },
          {
            id: 'sbcl',
            src: image02,
            title: '申报材料',
            list: [
              {
                title: '',
                list: [
                  {
                    symbol: 'point',
                    value: '身份证、户口薄'
                  },
                  {
                    symbol: 'point',
                    value: '乡镇（街道）出具的固定收入情况证明材料'
                  },
                  {
                    symbol: 'point',
                    value:
                      '“优秀共产党员”或“优秀党务工作者”荣誉证书（对于不符合“年龄80周岁及以上”和“党龄达30年”的必须提供）'
                  }
                ]
              }
            ]
          },
          {
            id: 'btbz',
            src: image03,
            title: '补贴标准',
            list: [
              {
                title: '',
                list: [
                  {
                    symbol: 'point',
                    value: '标准一般每人每年500元（补助金额每年不定，由区级经办人员人为录入）'
                  }
                ]
              }
            ]
          },
          {
            id: 'sbrk',
            src: image04,
            title: '申报入口',
            list: [
              {
                title: '',
                list: [
                  {
                    symbol: '',
                    value: '内江市惠民惠农“一卡通”公共服务网（http://www.scnjhrss.com:8080）'
                  }
                ]
              }
            ]
          }
        ],
        serviceObjectList: [], // 服务对象
        applyMaterialstList: [], // 申报材料
        isRequestPolicyDocumentOver: false, // 相关政策文件是否请求完成
        // 相关政策
        relevantPolicies: {
          id: 'xgzc',
          src: image05,
          title: '相关政策',
          list: []
        },
        isShowDeclarationEntry: false, // 是否显示申报入口
        // 申报入口
        declarationEntry: {}
      }
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      const { chi031, chi031_desc, chi04z } = e
      if (chi031_desc) {
        this.chi031_desc = chi031_desc
        setNavigationBarTitle(chi031_desc + '申报须知')
      }
      if (chi031) {
        this.chi031 = chi031
        this.getPolicyDocumentData(chi031)
      }
      if (chi04z) {
        this.chi04z = chi04z
      }
      this.getB017(chi031)
    },
    // 监听页面初次渲染完成
    onReady() {},
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      // 获取数据
      getB017(chi031) {
        const chi04z = this.chi04z
        const newRenderData = []
        requestB017(chi031, true, false)
          .then((res) => {
            const { ac10List, he11List, hi03DomianList } = res.lists
            const serviceObjectList = ac10List.list // 服务对象
            const applyMaterialstList = he11List.list // 申报材料
            const subsidyStandardList = hi03DomianList.list // 补贴标准
            const contactsList = hi03DomianList.list

            if (serviceObjectList) {
              const arr = []
              for (let i = 0, len = serviceObjectList.length; i < len; i++) {
                const item = serviceObjectList[i]
                const obj = {
                  symbol: 'point',
                  value: item.cac10a,
                  id: item.cac102
                }
                arr.push(obj)
              }
              this.serviceObjectList = [...arr]
              // console.log(this.serviceObjectList, 'this.serviceObjectList')
              const obj = {
                id: 'service_objec',
                src: image01,
                title: '服务对象',
                list: [
                  {
                    title: '',
                    list: arr
                  }
                ]
              }
              newRenderData.push(obj)
            }
            if (applyMaterialstList) {
              const arrList = []
              const serviceObjectList = this.serviceObjectList
              for (let i = 0, len = serviceObjectList.length; i < len; i++) {
                const arr = []
                const item = serviceObjectList[i]
                for (let j = 0, jLen = applyMaterialstList.length; j < jLen; j++) {
                  const jItem = applyMaterialstList[j]
                  if (jItem.aka131 === item.id) {
                    let valueData = jItem.che091
                    if (jItem.che09b && jItem.che09b !== '无' && config.areaCode == '510400') {
                      valueData = valueData + ` (注意事项：${jItem.che09b})`
                    }
                    const obj = {
                      symbol: 'point',
                      value: valueData,
                      hi21List: jItem.hi21List // 示列材料文件
                    }
                    arr.push(obj)
                  }
                }
                const obj1 = {
                  title: item.value,
                  list: arr
                }
                arrList.push(obj1)
              }

              const obj = {
                id: 'apply_materialst',
                src: image02,
                title: '申报材料',
                list: arrList
              }
              newRenderData.push(obj)
            }
            if (subsidyStandardList) {
              const arr = []
              for (let i = 0, len = subsidyStandardList.length; i < len; i++) {
                const item = subsidyStandardList[i]
                const value = item.chi04x
                if (value) {
                  const value_arr = value.split('；')
                  for (let j = 0, jLen = value_arr.length; j < jLen; j++) {
                    const obj = {
                      symbol: 'point',
                      value: value_arr[j]
                    }
                    arr.push(obj)
                  }
                }
              }
              const obj = {
                id: 'subsidy_standard',
                src: image03,
                title: '补贴标准',
                list: [
                  {
                    title: '',
                    list: arr
                  }
                ]
              }
              newRenderData.push(obj)
            }

            if (contactsList) {
              const arr = []
              for (let i = 0, len = contactsList.length; i < len; i++) {
                const item = contactsList[i]
                if (config.areaCode == '511100') {
                  const obj = {
                    symbol: 'point',
                    value: item.chi04q ? `联系电话：${item.chi04q}` : '',
                    phone: item.chi04q
                  }
                  arr.push(obj)
                } else {
                  const obj = {
                    symbol: 'point',
                    value: item.chi04p && item.chi04q ? `联系人：${item.chi04p}（${item.chi04q}）` : '',
                    phone: item.chi04q
                  }
                  arr.push(obj)
                }
              }
              this.contactsList = [...arr]
              // console.log(this.serviceObjectList, 'this.serviceObjectList')
              const obj = {
                id: 'contacts',
                src: image06,
                title: '政策解答员',
                list: [
                  {
                    title: '',
                    list: arr
                  }
                ]
              }
              if (config.areaCode !== '511000') {
                newRenderData.push(obj)
              }
            }
            this.handleUpdateDeclarationEntry(chi04z)
            this.renderData = [...newRenderData]
          })
          .catch((err) => {
            showModal(err.message).then(() => {
              navigateBack(1)
            })
          })
          .finally(() => {
            this.showApply = true
            if (areaCode === '511700' && this.chi031 === '20666') {
              this.showApply = false
            }
          })
      },
      // 获取政策文件列表
      getPolicyDocumentData(chi031) {
        requestSPGetHi05List('', '', chi031, '', 1, 10)
          .then((res) => {
            const { list } = res.lists.hi05List
            if (list && list.length > 0) {
              this.relevantPolicies.list = [...list]
            }
          })
          .finally(() => {
            this.isRequestPolicyDocumentOver = true
          })
      },
      // 立即申报
      handleApply() {
        const { user_id } = this.userInfo
        if (!user_id) {
          showModal('请登录后再访问').then(() => {
            navigateTo('login', 'packageCommon')
          })
          return
        }
        const chi031 = this.chi031
        const chi031_desc = this.chi031_desc
        const { declarePackageName } = config

        // 默认跳转 至 申报类型选择
        const defaultJump = (fixedDeclareType) => {
          let params = {
            chi031,
            chi031_desc
          }
          if (fixedDeclareType) {
            params.fixedDeclareType = fixedDeclareType
          }
          navigateTo('type', 'packageDeclare', params)
        }

        const declareConfig = getDeclareConfig(chi031)
        const { isFixedDeclareType, fixedDeclareType, isJumpDeclareTypeSelect } = declareConfig

        // 固定申报模式
        if (isFixedDeclareType) {
          // 跳过申报类型选择
          if (isJumpDeclareTypeSelect) {
            navigateTo('declare-' + chi031, declarePackageName, {
              chi031,
              fixedDeclareType,
              chi031_desc
            })
          } else {
            defaultJump(fixedDeclareType)
          }
        } else {
          defaultJump()
        }
      },
      // 更新申报入口数据
      handleUpdateDeclarationEntry(chi04y) {
        const { areaCode } = config
        let obj = {
          id: 'declare_enter',
          src: image04,
          title: '申报入口',
          list: [
            {
              title: '',
              list: []
            }
          ]
        }
        const temArr = []
        if (areaCode === '511000') {
          temArr.push({
            symbol: 'point',
            value: '内江市惠民惠农“一卡通”公共服务网（http://www.scnjhrss.com:8080）'
          })
          if (chi04y === '1') {
            temArr.push({
              symbol: 'point',
              value: '内江一卡通阳光审批微信小程序申报'
            })
          }
          obj.list[0].list = temArr
          this.isShowDeclarationEntry = true
        }
        this.declarationEntry = { ...obj }
      }
    },
    computed: { ...mapGetters([USER_LIST, USER_INFO]) },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .notice {
    width: 100%;
    background-color: #f5f5f5;
    height: 100%;
    height: 100vh;
    .scroll-view {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .item-card {
      padding: 0 24rpx;
      &:first-child {
        padding-top: 30rpx;
      }
      &:last-child {
        padding-bottom: 30rpx;
      }
    }
    .btn-wrapper {
      padding: 0 $spacing $spacing;
    }
  }
</style>
