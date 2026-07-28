<template>
  <view class="ez-hot-service-wrapper">
    <div class="service-items">
      <block v-for="(item, index) in getHotServiceRenderData" :key="item.id">
        <div class="item" :class="['item_' + index, item.disabled ? 'disabled' : '']" @click="onClick(index)">
          <h3>{{ item.title }}</h3>
          <div class="desc">
            {{ item.desc }}
          </div>
          <img
            :src="item.imageSrc"
            :style="{
              width: item.imageWidth,
              height: item.imageHeight
            }" />
        </div>
      </block>
    </div>
  </view>
</template>

<script>
import config from '@/config'
import { navigateTo, showModal, switchTab } from '@/utils/uni-api'
import { USER_INFO, M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
import { useJumpToLogin } from '@/hooks'

const { closePages, areaCode } = config
const imageStrPerfix = config.requestUrl + '/static/images/tabbar/home/'
const imageBtffcx = imageStrPerfix + 'nav-01.png'
const imageTsjdcx = imageStrPerfix + 'nav-09.png'
const imageTsjdcxNj = imageStrPerfix + 'nav-08.png'
const imageSp_01 = imageStrPerfix + 'nav-03.png'
const imageSp_02 = imageStrPerfix + 'nav-04.png'
const imageSp_ptgzgjzxj = imageStrPerfix + 'nav-06.png'
const imageSp_ptgzgjzxj2 = imageStrPerfix + 'nav-07.png'
const imageSp_gljt = imageStrPerfix + 'nav-05.png'
const imageYgsb = imageStrPerfix + 'nav-10.png'
const imageScrz = imageStrPerfix + 'nav-02.png'
const imageNd = imageStrPerfix + 'nav-17.png'

/**
 * 热门服务
 * @description 热门服务
 */
export default {
  name: 'yhHotService',
  props: {
    companyData: {
      type: [Array],
      default: () => {
        return []
      }
    }
  },
  components: {},
  data() {
    return {
      tsName: '举报投诉',
      // 补贴项目排行 请求数据
      hotServiceResList: []
    }
  },
  mounted() {
    // 乐山特殊处理
    if (areaCode === '511100') {
      this.tsName = '投诉咨询'
    }
  },
  methods: {
    /**
     * 跳转路由之前 检测该路由是否为tabbar
     */
    jumpRoute(name, packageName, params, chi122) {
      if (chi122) {
        this.$store.commit(M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL, chi122)
      }
      // 跳转 tababr 页面
      if (packageName === 'tabbar') {
        switchTab(name)
      } else {
        // 跳转 非tababr 页面
        navigateTo(name, packageName, params)
      }
    },
    /**
     * 跳转路由之前 检测该路由是否关闭
     */
    jumpRouteBefore(name, packageName, params, tip, chi122) {
      // 如果有提示直接提示 然后退出执行
      if (tip) {
        showModal(tip)
        return
      }

      // 存在 关闭页面筛选
      if (closePages && closePages.length > 0) {
        // 跳转路径为关闭的页面
        if (closePages.includes(`${packageName}/${name}`)) {
          navigateTo('not-found', 'packageCommon')
        } else {
          this.jumpRoute(name, packageName, params, chi122)
        }
      } else {
        // 不存在 关闭页面筛选
        this.jumpRoute(name, packageName, params, chi122)
      }
    },
    /**
     * 点击事件
     */
    async onClick(index) {
      const { user_id } = this.userInfo

      const item = this.getHotServiceRenderData[index]
      const { name, packageName, params, tip, isMustLogin, chi122 } = item

      const { chp210 } = params
      // 存在后端渲染的页面
      if (chp210) {
        navigateTo(name, packageName, params)
        return
      }
      // 必须登录也能访问的页面
      if (isMustLogin) {
        if (user_id) {
          this.jumpRouteBefore(name, packageName, params, tip, chi122)
        } else {
          useJumpToLogin()
        }
      } else {
        // 无须登录也能访问的页面
        this.jumpRouteBefore(name, packageName, params, tip, chi122)
      }
    }
  },
  computed: {
    ...mapGetters([USER_INFO]),
    // 获取热门服务渲染数据
    getHotServiceRenderData() {
      const { areaCode } = config
      const tsName = this.tsName
      const hotServiceResList = this.hotServiceResList
      let hotServiceRenderData = [
        {
          id: 'btffcx',
          title: '补贴发放查询',
          imageSrc: imageBtffcx,
          imageWidth: '70rpx',
          imageHeight: '86rpx',
          desc: '方便快速查询发放进度',
          disabled: false,
          name: 'subsidy-payment',
          packageName: 'packageQuery',
          params: {},
          isMustLogin: true // 是否必须登录才能访问
        },
        {
          id: 'tsjdcx',
          title: tsName,
          imageSrc: imageTsjdcx,
          imageWidth: '73rpx',
          imageHeight: '81rpx',
          desc: '方便维护网络环境',
          disabled: false,
          name: 'complaints',
          packageName: 'packageDetails',
          params: {},
          isMustLogin: true // 是否必须登录才能访问
        }
      ]

      switch (areaCode) {
        // 成都
        case '510100':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '粮食规模化生产财政奖补',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '自主申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20075',
              chi031_desc: '粮食规模化生产财政奖补',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '残疾人就业创业补贴',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20201',
              chi031_desc: '残疾人就业创业补贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 自贡
        case '510300':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '自贡市残疾人下肢假肢装配补贴',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '自主申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '200099',
              chi031_desc: '自贡市残疾人下肢假肢装配补贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '绿色殡葬补助资金',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '自助申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20957',
              chi031_desc: '绿色殡葬补助资金',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 攀枝花
        case '510400':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '育儿补贴金',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '自主申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20407',
              chi031_desc: '育儿补贴金',
              chi04z: '1'
            },
            isMustLogin: true // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '义务教育在读残疾儿童生活费补助（残联）',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20368',
              chi031_desc: '义务教育在读残疾儿童生活费补助（残联）',
              chi04z: '1'
            },
            isMustLogin: true // 是否必须登录才能访问
          })
          break
        // 泸州
        case '510500':
          hotServiceRenderData[1].name = 'complaints-510500'
          hotServiceRenderData.push({
            id: 'yggs',
            title: '阳光公示',
            imageSrc: imageYgsb,
            imageWidth: '69rpx',
            imageHeight: '77rpx',
            desc: '方便了解补贴发放情况',
            disabled: false,
            name: 'publicity',
            packageName: 'packageQuery',
            params: {},
            isMustLogin: true // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'zccx',
            title: '政策查询',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '方便了解国家政策',
            disabled: false,
            name: 'policy',
            packageName: 'packageQuery',
            params: {},
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 内江
        case '511000':
          hotServiceRenderData[1].imageSrc = imageTsjdcxNj
          hotServiceRenderData[1].imageWidth = '132rpx'
          hotServiceRenderData[1].imageHeight = '78rpx'

          hotServiceRenderData.push({
            id: 'xqjy',
            title: '学前教育家庭经济困难儿童资助',
            imageSrc: imageSp_ptgzgjzxj,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '助学申报、方便快捷',
            chi122: '2', // 项目补贴审核渠道 1 乡镇 2 学校
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20019',
              chi031_desc: '学前教育家庭经济困难儿童资助',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'xqjy',
            title: '义务教育家庭经济困难生活补助',
            imageSrc: imageSp_ptgzgjzxj2,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '助学申报、方便快捷',
            chi122: '2', // 项目补贴审核渠道 1 乡镇 2 学校
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20375',
              chi031_desc: '义务教育家庭经济困难生活补助',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 资阳
        case '512000':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '普通高中国家助学金',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '助学申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20014',
              chi031_desc: '普通高中国家助学金',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '高龄津贴',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20054',
              chi031_desc: '高龄津贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 乐山
        case '511100':
          //hotServiceRenderData[1].name = 'complaints-510500'
          hotServiceRenderData[0].name = 'subsidy-payment-ds'
          hotServiceRenderData[0].packageName = 'packageQuery'
          hotServiceRenderData.push({
            id: 'gs',
            title: '公示',
            imageSrc: imageSp_ptgzgjzxj,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '补贴公示',
            disabled: false,
            name: 'publicity',
            packageName: 'packageQuery',
            isMustLogin: true // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'hjkk',
            title: '回家看看',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '街坊邻里相互监督',
            disabled: false,
            name: 'sunshine-ds',
            packageName: 'tabbar',
            isMustLogin: true
          })
          hotServiceRenderData.push({
            id: 'zcwj',
            title: '政策文件',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '查找政策文件',
            disabled: false,
            name: 'policy',
            packageName: 'packageQuery',
            isMustLogin: false
          })
          break
        // 南充
        case '511300':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '农村公益性岗位补贴',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20779',
              chi031_desc: '农村公益性岗位补贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'csdb',
            title: '市直发残疾人临时救助、紧急救助',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20194',
              chi031_desc: '市支发残疾人零时救助、紧急救助',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 宜宾
        case '511500':
          hotServiceRenderData[0].name = 'subsidy-payment-ds'
          hotServiceRenderData[0].packageName = 'packageQuery'
          hotServiceRenderData.push({
            id: 'csdb',
            title: '残疾人C5驾照补贴',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '助学申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20926',
              chi031_desc: '残疾人C5驾照补贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '残疾人灵活就业创业补贴',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20022',
              chi031_desc: '残疾人灵活就业创业补贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })

          break
        // 广安
        case '511600':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '阳光申报',
            imageSrc: imageYgsb,
            imageWidth: '69rpx',
            imageHeight: '77rpx',
            desc: '掌上申报、方便快捷',
            disabled: false,
            name: 'sunshine-declare',
            packageName: 'tabbar',
            params: {},
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '生态护林员补助',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            chi122: '1', // 项目补贴审核渠道 1 乡镇 2 学校
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20061',
              chi031_desc: '生态护林人员补助',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 达州
        case '511700':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '阳光申报',
            imageSrc: imageYgsb,
            imageWidth: '69rpx',
            imageHeight: '77rpx',
            desc: '掌上申报、方便快捷',
            disabled: false,
            name: 'sunshine-declare',
            packageName: 'tabbar',
            params: {},
            isMustLogin: false // 是否必须登录才能访问
          })
          // hotServiceRenderData.push({
          //   id: 'csdb',
          //   title: '生存认证',
          //   imageSrc: imageScrz,
          //   imageWidth: '74rpx',
          //   imageHeight: '70rpx',
          //   desc: '在线认证、补贴续发',
          //   disabled: false,
          //   name: 'survival-certification',
          //   packageName: 'packageDeclare',
          //   params: {
          //     type: 'home_dazhou',
          //   },
          //   isMustLogin: true, // 是否必须登录才能访问
          // })
          break
        // 遂宁
        case '510900':
          break
        // 雅安
        case '511800':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '市本级中职技工院校国家助学金',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '助学申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20431',
              chi031_desc: '市本级中职技工院校国家助学金',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 巴中
        case '511900':
          hotServiceRenderData[1].name = 'complaints-bz'
          hotServiceRenderData.push({
            id: 'csdb',
            title: '村社公示',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '线上查看、方便快捷',
            disabled: false,
            name: 'publicity-bz',
            packageName: 'packageQuery',
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '年度清单',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '方便查询年度数据',
            disabled: false,
            name: 'subsidy-payment-bz',
            packageName: 'packageQuery',
            isMustLogin: true // 是否必须登录才能访问
          })
          break
        // 阿坝
        case '513200':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '种粮大户补贴',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '助学申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20055',
              chi031_desc: '种粮大户补贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '特困人员丧葬费',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20872',
              chi031_desc: '特困人员丧葬费',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 甘孜藏族自治州
        case '513300':
          hotServiceRenderData = []
          hotServiceRenderData.push({
            id: 'csdb',
            title: '家庭经济困难大学生资助',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '助学申报、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '200182',
              chi031_desc: '家庭经济困难大学生资助',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '双巴“金鹏工程”大学生生活补助',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice',
            packageName: 'packageDeclare',
            params: {
              chi031: '20633',
              chi031_desc: '双巴“金鹏工程”大学生生活补助',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          break
        // 凉山彝族自治州
        case '513400':
          hotServiceRenderData.push({
            id: 'csdb',
            title: '实际种粮农民一次性补贴',
            imageSrc: imageSp_01,
            imageWidth: '74rpx',
            imageHeight: '58rpx',
            desc: '线上申报、方便快捷',
            disabled: false,
            name: 'notice-513400',
            packageName: 'packageDeclare',
            params: {
              chi031: '20177',
              chi031_desc: '实际种粮农民一次性补贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })
          hotServiceRenderData.push({
            id: 'glbt',
            title: '种粮大户补贴',
            imageSrc: imageSp_02,
            imageWidth: '76rpx',
            imageHeight: '62rpx',
            desc: '补贴代办、方便快捷',
            disabled: false,
            name: 'notice-513400',
            packageName: 'packageDeclare',
            params: {
              chi031: '20055',
              chi031_desc: '种粮大户补贴',
              chi04z: '1'
            },
            isMustLogin: false // 是否必须登录才能访问
          })

          // 宣传公司数据
          for (let i = 0; i < this.companyData.length; i++) {
            const item = this.companyData[i]
            if (item.chp212 == '1') {
              // 是否配置热门服务
              hotServiceRenderData.push({
                id: item.chp213,
                title: item.chp213,
                imageSrc: imageNd,
                imageWidth: '60rpx',
                imageHeight: '60rpx',
                desc: item.chp214,
                disabled: false,
                name: 'company-detail',
                packageName: 'packageScan',
                params: {
                  title: item.chp213,
                  chp210: item.chp210,
                  chp21c: item.chp21c,
                  chp219: item.chp219
                },
                isMustLogin: false // 是否必须登录才能访问
              })
            }
          }
          break

        default:
          showModal('该地市还未整合' + '热门服务' + '，请联系管理员！')
          break
      }

      // if (hotServiceResList.length > 0) {
      //   hotServiceRenderData.push({
      //     id: 'csdb',
      //     title: hotServiceResList[0].chi031Desc,
      //     imageSrc: imageSp_01,
      //     imageWidth: '74rpx',
      //     imageHeight: '58rpx',
      //     desc: '自主申报、方便快捷',
      //     disabled: false,
      //     name: 'notice',
      //     packageName: 'packageDeclare',
      //     params: {
      //       chi031: hotServiceResList[0].chi031,
      //       chi031_desc: hotServiceResList[0].chi031Desc,
      //       chi04z: '1',
      //     },
      //     isMustLogin: false, // 是否必须登录才能访问
      //   })
      //   hotServiceRenderData.push({
      //     id: 'glbt',
      //     title: hotServiceResList[1].chi031Desc,
      //     imageSrc: imageSp_02,
      //     imageWidth: '76rpx',
      //     imageHeight: '62rpx',
      //     desc: '自主申报、方便快捷',
      //     disabled: false,
      //     name: 'notice',
      //     packageName: 'packageDeclare',
      //     params: {
      //       chi031: hotServiceResList[1].chi031,
      //       chi031_desc: hotServiceResList[1].chi031Desc,
      //       chi04z: '1',
      //     },
      //     isMustLogin: false, // 是否必须登录才能访问
      //   })
      // }
      return hotServiceRenderData
    }
  }
}
</script>

<style lang="scss" scoped>
.ez-hot-service-wrapper {
  width: 100%;
  .service-items {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .item {
    width: 304rpx;
    height: 168rpx;
    background-color: #edf7ff;
    box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(0, 111, 255, 0.27);
    border-radius: 8rpx;
    margin-bottom: 24rpx;
    padding-left: 16rpx;
    position: relative;
    transition: all 0.3s;
    h3 {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 70rpx;
      font-size: $font-size-title;
      font-weight: 700;
      color: #003b8d;
      line-height: 42rpx;
      padding-left: 20rpx;
      padding-right: 100rpx;
      @include textOverflow(2);
      z-index: 3;
    }
    .desc {
      position: absolute;
      font-weight: 400;
      line-height: 24rpx;
      font-size: $font-size-desc;
      color: rgba(0, 59, 141, 0.4);
      position: absolute;
      left: 20rpx;
      bottom: 32rpx;
      z-index: 3;
    }
    img {
      position: absolute;
      top: 16rpx;
      right: 20rpx;
      z-index: 1;
    }
    &:nth-last-child(2),
    &:last-child {
      margin-bottom: 0;
    }
    &.disabled {
      opacity: $opacity-disabled;
    }
    &.item_1 {
      background-color: #ecfffd;
    }
    &.item_2 {
      background-color: #fff9df;
    }
    &.item_3 {
      background-color: #fff5f6;
    }
  }
}
</style>
