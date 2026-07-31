<template>
  <div class="staticPageOuter" :style="{ height: isSingle ? '100%' : 'auto' }">
    <div
      class="bg"
      v-if="bgUrl && '1' !== currentComponent"
      :style="{ width: '100vw', height: '100vh', backgroundImage: `url(${bgUrl})` }"
    ></div>
    <img
      v-if="firstComponent !== currentComponent"
      src="./img/top.png"
      class="img0"
      :style="{ width: isSingle ? '50%' : '50%' }"
    />
    <carousel v-if="currentComponent == '1'" :ce37List="ce37List" :config="config1" @end="finish" />
    <videoComponent v-if="currentComponent === '2'" @end="finish" :videoList="videoList" />

    <tableInfo
      :columns="columns"
      :tableData="ce3aList"
      :config="config5"
      @end="finish"
      v-if="currentComponent === '5'"
      :show="currentComponent === '5'"
    />
    <tableInfo2
      :columns="columns2"
      :config="config3"
      :tableData="positionList"
      @end="finish"
      v-if="currentComponent === '3'"
    />
    <company :positionList="cb21List" v-if="currentComponent === '4'" :config="config4" @end="finish" />
    <introduce :introduceList="introduceList" :config="config6" v-if="currentComponent == '6'" @end="finish" />
    <div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="40%"
        top="15%"
        :modal-append-to-body="false"
        :append-to-body="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-form label-width="280px">
          <el-form-item label="请选择广告屏设备" required>
            <el-select style="width: 340px" ref="select" v-model="ace711_dsc" placeholder="请选择广告屏设备">
              <el-option :value="treeDataValue" style="overflow-y: scroll; height: 100%; max-height: 300px">
                <el-tree
                  default-expand-all
                  ref="tree"
                  :data="data"
                  node-key="label"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" @click="queryDeviceInfo">刷新</el-button>
          </el-form-item>
          <el-form-item label="请输入校验码" required>
            <el-input placeholder="请输入校验码" v-model="ace772" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="chooseDevice">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import p5 from './img/p5.png'
import p1 from './img/p1.png'
import p2 from './img/p2.png'
import p3 from './img/p3.png'
import p4 from './img/p4.png'
import companyInfo from './components/companyInfo.vue'
import introduceInfo from './components/introduceInfo.vue'
import tableInfo from './components/tableInfo.vue'
import tableInfo2 from './components/tableInfo2.vue'
import carousel from './components/carousel.vue'
import videoComponent from './components/video.vue'
import company from './components/company.vue'
import introduce from './components/introduce.vue'

import { getImageUrlWithCache } from '../../static/public/utils/image-db'

export default {
  name: 'staticPage',
  components: {
    companyInfo,
    introduceInfo,
    tableInfo,
    carousel,
    videoComponent,
    company,
    introduce,
    tableInfo2,
  },
  data() {
    return {
      isSingle: false,
      timer: null,
      Aindex: 0,
      speed: 5, //滚动速度,越大越快,最高100
      // speed3: ,
      speed2: 100, //轮播速度
      picList: [p5, p1, p2, p3, p4],
      tableData: [],
      companyList: [],
      columns: [
        {
          label: '培训班名称',
          value: 'aaf011',
        },
        {
          label: '培训时间',
          value: 'adf072',
        },
        {
          label: '计划人数',
          value: 'adf065',
        },
        {
          label: '培训机构',
          value: 'aaf011',
        },
        {
          label: '报名咨询电话',
          value: 'aae005',
        },
      ],
      columns2: [
        {
          label: '单位名称',
          value: 'name',
        },
        {
          label: '岗位名称',
          value: 'jobname',
        },
        {
          label: '招聘人数',
          value: 'pNumber',
        },
        {
          label: '学历',
          value: 'xl',
        },
        {
          label: '月薪',
          value: 'money',
        },
      ],
      introduceList: [
        {
          title: '惠企惠民政策清单',
          data: [
            // {
            //   title: '一、创业担保贷款',
            //   text: [
            //     '符合条件的个人创业担保贷款额度不超过30万元。对符合个人创业担保贷款条件的借款人合伙创业的，可根据合伙创业人数适当提高贷款额度，最高不超过符合条件的个人创业担保贷款额度上限之和的110%、总额不超过400万元。小微企业在申请创业担保贷款前1年内新招用符合创业担保贷款申请条件的人数占企业现有在职职工人数比例10%（职工超过100人的企业占比5%），最高可申请创业担保贷款500万元。对招用高校毕业生就业的小微企业，未达到创业担保贷款招用人员规定比例的，根据新招用符合条件人数按每人10万元的额度申请创业担保贷款。符合条件的创业担保贷款利息，财政部门给予贷款实际利率50%的财政贴息。',
            //     '咨询电话：市直：2375089、沙洋：8568064、钟祥：6900809、京山：7229821、东宝：2378523、掇刀：2442249、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '二、一次性创业补贴',
            //   text: [
            //     '在我市初次办理注册登记，经营6个月及以上且带动就业2人及以上（含创业者本人）的就业困难人员、高校毕业生（毕业5年内）、返乡入乡人员（注册5年内），给予5000元的一次性创业补贴。',
            //     '咨询电话：市直：2375089、沙洋：8568064、钟祥：6900809、京山：7229821、东宝：2378523、掇刀：2442249、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '三、大学生创业项目资金扶持',
            //   text: [
            //     '对在校及毕业5年内大学生在我市自主创办企业或从事个体经营6个月以上的，经评审后，按规定给予5万至50万元的资金扶持。举办“荆创汇”大学生创业路演，对优秀创业项目给予1万至五万元的项目扶持资金。',
            //     '咨询电话：市直：2380531、2341017。',
            //   ],
            // },
            // {
            //   title: '四、一次性求职补贴',
            //   text: [
            //     '对在毕业学年积极求职创业的低保家庭、零就业家庭、防止返贫监测对象家庭和特困人员中的高校毕业生，残疾及获得国家助学贷款的高校毕业生，给予一次性求职补贴。',
            //     '咨询电话：东宝：6807778、掇刀：2444410。',
            //   ],
            // },
            // {
            //   title: '五、就业困难人员社会保险补贴',
            //   text: [
            //     '对招用就业困难人员并缴纳社会保险费的单位，以及通过公益性岗位安置就业困难人员并缴纳社会保险费的单位，按其为就业困难人员实际缴纳的基本养老保险费、基本医疗保险费和失业保险费给予补贴，不包括就业困难人员个人应缴纳的部分。对就业困难人员灵活就业后缴纳的社会保险费，给予社会保险补贴，补贴标准不超过其实际缴费的2/3，补贴期限最长不超过3年。就业困难人员社会保险补贴期限，除对距法定退休年龄不足5年的就业困难人员可延长至退休外，其余人员最长不超过3年（以初次核定其享受社会保险补贴时年龄为准）。',
            //     '咨询电话：市直：2376091、沙洋：8568036、钟祥：6900802、京山：7235754、东宝：2378420、掇刀：2444410、漳河：8658017、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '六、高校毕业生社会保险补贴',
            //   text: [
            //     '对招用毕业年度和离校2年内未就业高校毕业生，与之签订1年以上劳动合同并为其缴纳社会保险费的小微企业，给予最长1年的社会保险补贴，不包括高校毕业生个人应缴纳的部分。对毕业年度或离校2年内未就业的高校毕业生灵活就业后缴纳的社会保险费，给予一定数额的社会保险补贴，补贴标准原则上不超过其实际缴费的2/3，补贴期限最长不超过2年。',
            //     '咨询电话：市直：2376091、沙洋：8568036、钟祥：6900802、京山：7235754、东宝：2378420、掇刀：2444410、漳河：8658017、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '七、公益性岗位补贴',
            //   text: [
            //     '对公益性岗位安置的就业困难人员给予岗位补贴。补贴标准参照当地最低工资标准执行。公益性岗位补贴期限，除对距法定退休年龄不足5年的人员可延长至退休外，其余人员最长不超过3年（以初次核定其享受社会保险补贴时年龄为准）。对补贴期满后仍难以通过其他渠道实现就业的大龄就业困难人员、零就业家庭中的就业困难成员、重度残疾人等，可再次按程序予以公益性岗位安置，岗位补贴和社会保险补贴期限重新计算，并报送省人力资源社会保障、财政部门备案，累计安置次数不超过2次。',
            //     '咨询电话：市直：2376091、沙洋：8568036、钟祥：6900802、京山：7235754、东宝：2378420、掇刀：2444410、漳河：8658017、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '八、一次性吸纳就业补贴',
            //   text: [
            //     '企业吸纳退役1年以内（上年度9月1日以后退役）退役军人，或企业、扶贫车间等载体在巩固拓展脱贫攻坚成果同乡村振兴有效衔接过渡期内吸纳脱贫人口，签订1年以上劳动合同，实现稳定就业1年以上的，按照2000元/人的标准给予一次性就业奖补；中小微企业招用毕业年度或离校2年内未就业高校毕业生，签订1年以上劳动合同并按规定缴纳社会保险费，按1000元/人的标准分别给予企业和个人一次性就业补贴。',
            //     '咨询电话：市直：2376091、沙洋：8568036、钟祥：6900802、京山：7235754、东宝：2378420、掇刀：2444410、漳河：8658017、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '九、创业带动就业补贴',
            //   text: [
            //     '毕业5年内的高校毕业生，在市内初次创办的小微企业、个体工商户、民办非企业单位、农民专业合作社等组织，在登记注册1年内、招用人员且签订1年以上劳动合同并按规定缴纳社会保险费的，按1000元/人的标准给予补贴，补贴总额不超过2万元。',
            //     '咨询电话：市直：2376091、沙洋：8568036、钟祥：6900802、京山：7235754、东宝：2378420、掇刀：2444410、漳河：8658017、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '十、一次性就业补助',
            //   text: [
            //     '对外省籍首次来荆就业人员（身份证号非42开头且2023年1月1日之前在省内无就业登记和参保记录的人员），签订1年以上劳动合同并按规定缴纳社会保险的，按1000元/人标准给予一次性就业补助。',
            //     '咨询电话：沙洋：8568036、钟祥：6900802、京山：7235754、东宝：2378420、掇刀：2444410、漳河：8658017、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '十一、失业保险待遇',
            //   text: [
            //     '失业前用人单位和本人已经缴纳失业保险费满一年的；非因本人意愿中断就业的；已经进行失业登记，并有求职要求的。可以申领失业保险金，具体标准参照湖北省当年度失业保险金发放要求确定。',
            //     '咨询电话：市直：2376190、沙洋：8568068、8568949、钟祥：6900879京山：7213957东宝：2335136、2378601、掇刀：8603008、2444410、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '十二、一次性生活补助',
            //   text: [
            //     '对到中心城区就业并签订劳动合同，首次缴纳城镇职工养老保险满1年的，给予个人3600元的一次性生活补助。对中心城区新招录的本科生，每年给予1万元的生活补助，连续补助2年。',
            //     '咨询电话：东宝：2378420、掇刀：2444410、漳河：8658017。',
            //   ],
            // },
            // {
            //   title: '十三、技能提升补贴',
            //   text: [
            //     '参加失业保险3年以上的企业在职职工或领取失业保险金人员取得技能人员职业资格证书或职业技能等级证书的，可按照初级（五级）不超过1000元、中级（四级）不超过1500元、高级（三级）不超过2000元的标准申请技能提升补贴。每人每年享受补贴次数最多不超过三次，同一职业（工种）同一等级只能申请并享受一次，且技能提升补贴和职业培训补贴不得重复享受；已享受同一职业（工种）高级别证书技能提升补贴的，不再享受低级别证书补贴。',
            //     '咨询电话：市直：2376190沙洋：8568068、8568949、钟祥：6900879京山：7213957东宝：2335136、2378601、掇刀：8603008、2444410、屈家岭：7418005。',
            //   ],
            // },
            // {
            //   title: '十四、一次性扩岗补助',
            //   text: [
            //     '对招用毕业年度和离校两年内未就业高校毕业生、16—24岁登记失业青年，签订劳动合同，并按规定为其足额缴纳3个月以上失业、工伤、职工养老保险费的企业，按每招用1人1000元的标准发放一次性扩岗补助。政策执行期限至2025年12月31日。',
            //     '咨询电话：市直：2376190沙洋：8568068、8568949、钟祥：6900879京山：7213957东宝：2335136、2378601、掇刀：8603008、2444410、屈家岭：7418005。',
            //   ],
            // },
          ],
        },
      ],

      dialogVisible: false,
      treeDataValue: '',
      data: [],
      ace711_dsc: '',
      ace772: '', //设备校验码

      ace928Map: {
        5: 'pxb_time',
        3: 'gwlb_time',
        4: 'gwxq_time',
        6: 'zcxq_time',
      },
      timeMap: {
        pxb_time: 6,
        gwlb_time: 6,
        gwxq_time: 6,
        zcxq_time: 6,
      },
      bg: '',
      bg2: '',

      ce37List: [],
      bgUrl: '',
      intervalTimer: null,

      config: {},

      componentList: [],
      firstComponent: null,
      currentComponent: null,

      videoList: [],
      ce3aList: [],
      positionList: [],
      introduceList: [],
      cb21List: [],
      config1: {},
      config2: {},
      config3: {},
      config4: {},
      config5: {},
      config6: {},
    }
  },
  mounted() {
    if (window.location.href.indexOf('staticPage') != -1) {
      this.isSingle = true
    }
    this.queryDeviceInfo()
    this.queryTemplateInfoByDeviceId()
    // this.getClassData(() => {
    //     this.getJobList(() => {
    //       this.getIntroduceList(() => {
    //         this.change()
    //       })
    //     })
    //   })
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  computed: {
    defaultProps() {
      return {
        children: 'children',
        label: 'label',
      }
    },
  },
  methods: {
    companyInfoFinied(index) {
      if (this.companyList.length > 0 && index < this.companyList.length - 1) {
        return (this.timeMap.gwlb_time * 1000) / this.companyList.length
      }
      return 3000
    },
    //获取图片列表
    getPicList() {
      this.$utils
        .commonRequest({
          apiCode: '',
        })
        .then((res) => {
          this.picList = res.pageBean.list
          callback()
        })
    },
    // 培训班级
    getClassData(callback) {
      const param = {
        method: 'jy306_service01',
        // aab301: '140010',
        pageSize: 99,
        pageNumber: 1,
      }
      this.$utils
        .request('/api/business/invoke', param, true, true, 'cipher')

        .then((res) => {
          // console.log(res, 'ddddd')
          // this.tableData = res.data.slice(0, 60)
          // console.log(this.tableData,'this.tableData')
          this.tableData = res.pageBean.list
          this.tableData.forEach((item) => {
            // item.pxj003 = item.pxj003 ? `${item.pxj003}人` : '未知'
            item.pxj002 = (item.adf072 || '未知') + '~' + (item.adf073 || '未知')
            console.log(item.pxj002)
          })
          this.tableData = [
            ...this.tableData,
            ...this.tableData,
            ...this.tableData,
            ...this.tableData,
            ...this.tableData,
          ]
          callback()
        })
    },

    getIntroduceList(callback) {
      let param = {
        acz02p: '3',
        aab301: '14',
        method: 'jy232_hrm100',
        apiCode: 'jy232_hrm100',
        pageNumber: 1,
        pageSize: 99,
        paginationModel: 'mostCount',
      }
      this.$utils.request('/api/business/invoke', param, true).then((res) => {
        const list = res?.pageBean?.list
        if (list && list.length > 0) {
          list.forEach((item, index) => {
            this.introduceList[0].data.push({
              title: item.acz02q,
              text: [item.acz02s],
            })
          })
        }
        callback()
      })
    },
    // finish(time) {
    //   setTimeout(
    //     () => {
    //       this.Aindex++
    //       if (this.Aindex == 1 + this.picList.length + this.companyList.length + this.introduceList.length) {
    //         setTimeout(() => {
    //           this.Aindex = 0
    //           this.change()
    //         }, 1000)
    //       }
    //     },
    //     time ? time : this.speed2,
    //   )
    // },
    change() {
      this.timer = setInterval(() => {
        this.Aindex++
        if (this.Aindex == this.picList.length) {
          clearInterval(this.timer)
        }
      }, this.speed2)
    },
    finish({ ace928 }) {
      console.log(ace928, 'ace928')
      const index = this.componentList.findIndex((item) => item === ace928)
      if (index !== -1) {
        if (index === this.componentList.length - 1) {
          this.currentComponent = this.componentList[0]
          this.firstComponent = this.currentComponent
          // this.queryTemplateInfoByDeviceId()
          return
        }
        this.currentComponent = this.componentList[index + 1]
      }
    },
    queryDeviceInfo() {
      let deviceInfo = uni.getStorageSync('deviceInfo_5')
      if (!deviceInfo) {
        this.dialogVisible = true
        const param = {
          method: 'jy204_hrm262',
          apiCode: 'jy204_hrm262',
          ace769: '4',
        }
        this.$utils.request('/api/business/invoke', param, true).then((res) => {
          this.data = res.ce31Pos
        })
      } else {
        this.dialogVisible = false
        this.disabled = true
      }
    },
    queryTemplateInfoByDeviceId() {
      const deviceInfo = uni.getStorageSync('deviceInfo_5')
      if (deviceInfo && deviceInfo.ace711) {
        const param = {
          method: 'queryTemplateInfoByDeviceId',
          apiCode: 'queryTemplateInfoByDeviceId',
          ace711: deviceInfo.ace711,
        }
        this.$utils.request('/api/business/invoke', param, true).then(async (res) => {
          if (res.ce34Vo && res.ce34Vo.ce36POS) {
            const { aae707 } = res.ce34Vo
            if (aae707) {
              const url = this.$downLoadImgSrc + aae707
              getImageUrlWithCache(url)
                .then((src) => {
                  this.bgUrl = src
                })
                .catch(() => {
                  this.bgUrl = url
                })
            } else {
              this.bgUrl = '/jyytj/static/images/bg2.png'
            }
            await this.queryInfoByTemplateId(res.ce34Vo.ace340)

            const list = res.ce34Vo.ce36POS
            // const ace853Arr = list.map((item) => item.ace853)
            // const ace853Str = ace853Arr.join(',')
            const obj = {}
            this.componentList = []
            this.firstComponent = null
            if (list.length > 0) {
              // 处理列表数据
              list.map((item) => {
                this.componentList.push(item.ace928)
                if (!item.ace929) {
                  item.ace929 = '1'
                  item.ace931 = '1'
                  item.ace932 = '10'
                }
                if (item.ace929) {
                  item.ace931 = item.ace931 || '1'
                  item.ace932 = item.ace932 || '10'
                }

                // ace853-播放排序号 ace929-切换方式 ace931-轮次 ace932-播放总时间
                // 岗位列表
                if (item.ace928 === '3') {
                  this.config3 = {
                    ...this.config3,
                    ...item,
                  }
                }
                // 岗位详情
                if (item.ace928 === '4') {
                  this.config4 = {
                    ...this.config4,
                    ...item,
                  }
                }
                // 轮播
                if (item.ace928 === '1') {
                  this.config1 = {
                    ...this.config1,
                    ...item,
                  }
                }
                // 视频
                if (item.ace928 === '2') {
                  this.config2 = {
                    ...this.config2,
                    ...item,
                  }
                }
                // 培训班列表
                if (item.ace928 === '5') {
                  this.config5 = {
                    ...this.config5,
                    ...item,
                  }
                }
                // 政策详情
                if (item.ace928 === '6') {
                  this.config6 = {
                    ...this.config6,
                    ...item,
                  }
                }
              })
            }
            if (this.componentList && this.componentList.length > 0) {
              this.firstComponent = this.componentList[0]
              this.currentComponent = this.componentList[0]
            }
          } else {
            this.$utils.showToast('没有配置页面信息，请先到人力资源后台管理系统配置')
          }
        })
      }
    },
    queryInfoByTemplateId(ace340) {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'queryInfoByTemplateId',
          apiCode: 'queryInfoByTemplateId',
          ace340,
        }
        this.$utils.request('/api/business/invoke', param, true).then(async (res) => {
          try {
            const { ce37List, ce38Info, cz32List, videoList, ce3aList, cb21List } = res.resultMap
            let positionList = await this.getJobList(ce38Info)
            positionList = [...positionList]
            if (!ce38Info) {
              // this.$utils.showToast('没有配置页面信息，请先到人力资源后台管理系统配置')
              positionList = []
            }
            if (ce38Info) {
              this.config3 = {
                ...this.config3,
                ace936: ce38Info.ace936 || '#92DAF8', //标题背景色
                ace937: ce38Info.ace937 || '#FFFFFF', //标题字体色
                ace938: ce38Info.ace938 || '1', //逐行滚动速度
                ace939: ce38Info.ace939 || '#92DAF8', //表头背景色
                ace941: ce38Info.ace941 || '#92DAF8', //奇色
                ace942: ce38Info.ace942 || '#FFFFFF', //偶色
              }
            }

            this.ce37List = ce37List || []
            this.ce37List = this.ce37List.map((item) => {
              return {
                ...item,
                img: this.$downLoadImgSrc + item.aae707,
              }
            })
            if (this.ce37List.length > 0) {
              this.config1 = {
                ...this.config1,
                lunboTime: this.ce37List[0].ace932,
              }
            }
            this.videoList = videoList || []

            this.ce3aList = ce3aList || []

            if (this.ce3aList && this.ce3aList.length > 0) {
              this.config5 = {
                ...this.config5,
                ace936: this.ce3aList[0].ace936 || '#92DAF8', //标题背景色
                ace937: this.ce3aList[0].ace937 || '#FFFFFF', //标题字体色
                ace938: this.ce3aList[0].ace938 || '1', //逐行滚动速度
                ace939: this.ce3aList[0].ace939 || '#92DAF8', //表头背景色
                ace941: this.ce3aList[0].ace941 || '#92DAF8', //奇色
                ace942: this.ce3aList[0].ace942 || '#FFFFFF', //偶色
              }
            }
            this.positionList = positionList
            if (cb21List && cb21List.length > 0) {
              this.config4 = {
                ...this.config4,
                ace936: cb21List[0].ace936 || '#92DAF8', //标题背景色
                ace937: cb21List[0].ace937 || '#FFFFFF', //标题字体色
                lunboTime: cb21List[0].ace932 || '1', //轮播时间
              }

              this.cb21List = cb21List.map((item) => {
                return {
                  name: item.aab004,
                  jobname: item.acb213,
                  pNumber: item.acb21g,
                  xl: item.aac011 ? this.$utils.queryCodeDesc('aac011', item.aac011) : '无要求',
                  money: `${item.acb21h}-${item.acb21j}元`,
                  require: item.acb216 ? this.$utils.htmlDecode(item.acb216) : '',
                  phone: `${item.acb224 || '暂无'} ${item.acb225 || '暂无'}`,
                  address: item.acb217,
                }
              })
            }
            this.introduceList = cz32List
            if (cz32List && cz32List.length > 0) {
              this.config6 = {
                ...this.config6,
                ace936: cz32List[0].ace936 || '#92DAF8', //标题背景色
                ace937: cz32List[0].ace937 || '#FFFFFF', //标题字体色
                ace938: cz32List[0].ace938 || '1', //逐行滚动速度
                ace939: cz32List[0].ace939 || '#92DAF8', //表头背景色
                ace944: '3', //到底停留时间
              }
            }
            resolve(true)
          } catch (error) {
            console.log(error)
            reject(error)
          }
        })
      })
    },
    // 获取职位列表
    getJobList(ce38Info) {
      const param = {
        method: 'jy260_ytj05',
        pageSize: 20,
        pageNumber: 1,
        ...ce38Info,
      }
      const list = []
      return new Promise((resolve, reject) => {
        this.$utils
          .request('/api/business/invoke', param, true, true, 'cipher')
          .then((res) => {
            res.pageBean.list.forEach((item) => {
              list.push({
                name: item.aab004,
                jobname: item.acb213,
                pNumber: item.acb21g,
                xl: item.aac011 ? this.$utils.queryCodeDesc('aac011', item.aac011) : '无要求',
                money: `${item.acb21h}-${item.acb21j}元`,
                require: item.acb216 ? this.$utils.htmlDecode(item.acb216) : '',
                phone: `${item.acb224} ${item.acb225}`,
                address: item.acb303,
              })
            })
            resolve(list)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    chooseDevice() {
      if (!this.ace711) {
        this.$message.error('请选择设备!')
        return
      }
      if (!this.ace772) {
        this.$message.error('请输入检验码!')
        return
      }

      //验证展位机编号和校验码
      let param = {
        ace711: this.ace711,
        ace772: this.ace772,
        method: 'jy204_hrm267',
        apiCode: 'jy204_hrm267',
      }
      this.$utils.request('/api/business/invoke', param, true).then((res) => {
        if (res?.result?.code === '0') {
          this.$message.error(res.result.message)
        } else {
          this.$message.success(res.result.message)
          uni.setStorageSync('deviceInfo_5', {
            ace769: '4',
            ace711: this.ace711,
            ace772: res.result.ace772,
          })
          this.dialogVisible = false
          this.disabled = true
          uni.removeStorageSync('reLanch_times')
          this.queryTemplateInfoByDeviceId()
        }
      })
    },
    handleNodeClick(data, node, nodeData) {
      if (!data.children) data.children = []
      if (!data.children.length) {
        //非最后一层 为城市，不可选为值
        this.treeDataValue = data
        this.ace711 = data.value
        this.ace711_dsc = data.label
        this.$refs.select.blur() //收起下拉框
      }
    },
  },
}
</script>

<style scoped lang="less">
.staticPageOuter {
  position: relative;
  width: 100%;
  // background-image: url('img/bg2.png');
  background-position: center;
  background-size: 100% 100%;

  .carousel {
    width: 100%;
    // background-image: url('img/bg2.png');
    background-position: center;
    background-size: 100% 100%;
  }
  .bg {
    background-position: center;
    background-size: 100% 100%;
  }
  .imgbg {
    visibility: hidden;
  }

  .img0 {
    position: absolute;
    top: 4%;
    left: calc(50% - 477px);
  }

  .img1 {
    width: 13%;
    height: 14%;
    top: 4%;
    left: 1.5%;
    position: absolute;
    // animation: bounce 8s ease-in-out infinite;
  }
  .img3 {
    width: 13%;
    height: 14%;
    top: 4%;
    left: 1.5%;
    position: absolute;
  }
  @keyframes bounce {
    0% {
      top: 4%;
      left: 1.5%;
    }
    25% {
      top: 45%;
      left: 86%;
    }
    50% {
      top: 85%;
      left: 45%;
    }
    75% {
      top: 45%;
      left: 1.5%;
    }
    100% {
      top: 4%;
      left: 1.5%;
    }
  }

  .img2 {
    position: absolute;
    width: 80%;
    top: 28%;
    left: 10%;
  }
}
</style>
