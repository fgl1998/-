<template>
  <div class="page">
    <!-- 我的简历 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="resume-wrap">
          <div class="wrap-title">
            <div class="title-lt">
              <div class="name">
                <span>{{ handleItemName }}</span>
                <label>办事指南</label>
              </div>
              <div class="decr">/滑动屏幕浏览更多指南内容</div>
            </div>
            <div class="title-rt">
              <div class="navigation">
                <i class="ic ic-home-blue"></i>
                <label>首页 > 个人中心 > 办事指南</label>
              </div>
            </div>
          </div>

          <div class="resume-box">
            <div class="content" v-html="acz02s"></div>
            <!-- <div class="resume-lt">
              <div class="resume-nav">
                <div
                  :class="['nav-item', navCur === index ? 'active' : '']"
                  v-for="(item, index) in resumeNav"
                  :key="index"
                  @click="navChange(index, item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div> -->
            <!-- <div class="resume-rt">
              <scroll-view :style="{ height: '100%' }" scroll-y :scrollIntoView="navViewId">
                <div class="resume-group">
                  <div class="group-item" id="basicInfo">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>基本信息</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <uni-row class="uni-row table-horizontal-2">
                        <uni-col :span="24" class="clo-tr">
                          <uni-col :span="8" class="clo-td">
                            <div class="form-item">
                              <div class="form-label">事项名称</div>
                              <div class="form-value">{{ handleItemName }}</div>
                            </div>
                          </uni-col>
                          <uni-col :span="16" class="clo-td left">
                            <div class="form-item">
                              <div class="form-label">事项编号</div>
                              <div class="form-value">{{ handleItemCode }}</div>
                            </div>
                          </uni-col>
                          <uni-col :span="8" class="clo-td">
                            <div class="form-item">
                              <div class="form-label">承诺办结时限</div>
                              <div class="form-value">{{ basicInfo.promise_day || '无' }}</div>
                            </div>
                          </uni-col>
                          <uni-col :span="16" class="clo-td left">
                            <div class="form-item">
                              <div class="form-label">实施主体</div>
                              <div class="form-value">{{ extendField.dept_name || '无' }}</div>
                            </div>
                          </uni-col>
                          <uni-col :span="8" class="clo-td">
                            <div class="form-item">
                              <div class="form-label">法定办结时限</div>
                              <div class="form-value">
                                {{ basicInfo.anticipate_day + '天' }}
                              </div>
                            </div>
                          </uni-col>
                          <uni-col :span="16" class="clo-td left">
                            <div class="form-item">
                              <div class="form-label">到办事现场次数</div>
                              <div class="form-value">
                                {{ basicInfo.limit_scene_num + '次' }}
                              </div>
                            </div>
                          </uni-col>
                          <uni-col :span="24" class="clo-td">
                            <div class="form-item">
                              <div class="form-label">服务对象</div>
                              <div class="form-value">{{ basicInfo.server_type || '无' }}</div>
                            </div>
                          </uni-col>
                          <uni-col :span="24" class="clo-td">
                            <div class="form-item">
                              <div class="form-label">咨询方式</div>
                              <div class="form-value">{{ extendField.ask_way || '无' }}</div>
                            </div>
                          </uni-col>
                          <uni-col :span="24" class="clo-td">
                            <div class="form-item">
                              <div class="form-label">监督投诉方式</div>
                              <div class="form-value">
                                {{ extendField.suggest_way || '无' }}
                              </div>
                            </div>
                          </uni-col>
                          <uni-col :span="24" class="clo-td">
                            <div class="form-item">
                              <div class="form-label">结果反馈</div>
                              <div class="form-value">{{ extendField.feed_back || '无' }}</div>
                            </div>
                          </uni-col>
                        </uni-col>
                      </uni-row>
                    </div>
                  </div>

                  <div class="group-item" id="acceptCriteria">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>受理条件</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="group-text">
                        {{ basicInfo.accept_condition || '无' }}
                      </div>
                    </div>
                  </div>

                  <div class="group-item" id="matterSketch">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>事项简述</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="group-text">
                        {{ basicInfo.task_desc || '无' }}
                      </div>
                    </div>
                  </div>

                  <div class="group-item" id="handleMaterial">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>办理材料</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="group-list">
                        <div class="group-head">
                          <div class="group-th flex-none-120">序号</div>
                          <div class="group-th">材料名称</div>
                          <div class="group-th flex-none-300">材料是否必要</div>
                        </div>
                        <div class="group-body">
                          <div class="group-tr" v-for="(item, index) in materailList" :key="index">
                            <div class="group-td flex-none-120">{{ index + 1 }}</div>
                            <div class="group-td">{{ item.material_name }}</div>
                            <div class="group-td flex-none-300">
                              {{ item.is_need == '1' ? '是' : '否' }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="group-item" id="process">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>办理渠道</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="group-text">
                        <div>现场办理：{{ extendField.org_address ? extendField.org_address : '暂无' }}</div>
                        <div>
                          网上办理：{{ basicInfo.mobile_terminal_url ? basicInfo.mobile_terminal_url : '暂无' }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="group-item" id="whetherToCharge">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>是否收费</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="group-text">
                        {{ extendField.is_free || '无' }}
                      </div>
                    </div>
                  </div>

                  <div class="group-item" id="settingBasis">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>设定依据</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="group-text">
                        {{ extendField.set_law || '无' }}
                      </div>
                    </div>
                  </div>

                  <div class="group-item" id="notes">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>备注</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="group-text">
                        {{ extendField.matter_remark || '无' }}
                      </div>
                    </div>
                  </div>
                </div>
              </scroll-view>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
      isLogin: false,
      userInfo: {},

      navViewId: 'baseInfo',
      navCur: 0,
      resumeNav: [
        {
          name: '基本信息',
          id: 'basicInfo',
        },
        {
          name: '受理条件',
          id: 'acceptCriteria',
        },
        {
          name: '事项简述',
          id: 'matterSketch',
        },
        {
          name: '办理材料',
          id: 'handleMaterial',
        },
        {
          name: '办理渠道',
          id: 'process',
        },
        {
          name: '是否收费',
          id: 'whetherToCharge',
        },
        {
          name: '设定依据',
          id: 'settingBasis',
        },
        {
          name: '备注',
          id: 'notes',
        },
      ],

      isOnline: false,
      handleItemCode: '', //事项编号
      handleItemName: '', //事项名称
      officeNo: '', //办件编号
      ada120: '',
      //接口返回的数据
      acceptCondition: '',
      basicInfo: {},
      extendField: {},
      feeList: [],
      flowchartList: [],
      lawList: [],
      materailList: [],
      materialDetile: {}, //材料详情
      materialCount: 0, //材料数量
      questionList: [],
    }
  },
  onLoad(e) {
    if (e.acz02s) {
      this.acz02s = JSON.parse(decodeURIComponent(e.acz02s))
      // this.init()
      this.formatAcz02s()
    }
  },
  methods: {
    formatAcz02s() {
      console.log(this.acz02s, 'acz02s')
    },
    init() {
      //获取事项编号
      const url = '/api/business/getOfficeNo.do'
      const param = {}
      this.$utils.request(url, param, true, false, 'guide').then((res) => {
        this.officeNo = res
        //获取事项信息
        const url1 = '/api/service/queryServiceSingle.do'
        const param1 = {
          handleItemCode: this.handleItemCode,
        }
        this.$utils.request(url1, param1, true, false, '').then((res) => {
          console.log(res)
          if (!res) {
            this.$utils.showToast('功能即将上线，敬请期待!')
            return
          }

          this.handleItemName = res.handleItemName
          this.ada120 = res.serviceExt.serviceField3
          this.fnQueryItemsGuide()
        })
      })
    },
    navChange(index, item) {
      this.navCur = index
      this.navViewId = item.id
    },
    //办理渠道切换
    changeType(type) {
      if (type === 'online') {
        this.isOnline = true
      } else {
        this.isOnline = false
      }
    },
    //获取指南信息
    fnQueryItemsGuide() {
      let param = {
        officeNo: this.officeNo,
        handleItemCode: this.handleItemCode,
        callCode: 'I01047',
        aae400: '74',
        orgid: '1004542249',
        ada120: this.ada120,
        apiCode: 'onlineCommon-003',
        method: 'onlineCommon-003',
      }
      const url = '/api/businessCommon/getData/onlineCommon-003'
      this.$utils.request(null, param, true).then((res) => {
        // this.$utils.request(url, param, true, false, 'cipher').then(res => {
        if (!res.serviceSuccess) {
          this.$utils.showToast('网络错误，请稍后再试!')
          return
        }

        let result = res.data.result.data
        this.acceptCondition = result.accept_condition
        this.basicInfo = result.basic_info
        this.extendField = JSON.parse(this.basicInfo.extend_field.replace(/[\r\n]/g, ''))
        this.feeList = result.fee_list
        this.flowchartList = result.flowchart_list
        this.lawList = result.law_List
        this.materailList = result.materail_list
        this.materailList.map((item) => {
          this.materialCount += parseInt(item.page_num ? parseInt(item.page_num) : 0)
        })
        this.questionList = result.question_list
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/common_sll.scss';
@import '~@/static/scss/resume.scss';

.table-horizontal-2 {
  border-left: 1px solid #a2a7a9;
  border-bottom: 1px solid #a2a7a9;
  border-right: 1px solid #a2a7a9;

  .clo-td {
    border-top: 1px solid #a2a7a9;

    &.no-top {
      border-top: 0;
    }

    &.left {
      border-left: 1px solid #a2a7a9;
    }

    &:first-child {
      border-left: 0;
    }
  }
}

.group-list {
  border-bottom: 1px solid #a2a7a9;

  .flex-none-120 {
    width: 120px;
    flex: none !important;
  }

  .flex-none-300 {
    width: 300px;
    flex: none !important;
    text-align: center;
  }
}
.resume-box {
  width: 100%;
  height: 600px;
  overflow: auto;
  display: block;

  .content {
  }
}
</style>
