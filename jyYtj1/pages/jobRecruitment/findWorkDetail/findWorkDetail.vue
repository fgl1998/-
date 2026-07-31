<template>
  <div class="page">
    <!-- 职位详情 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="work-wrap wrap-box">
          <div class="wrap-con" style="height: 65px">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7">找</text> 工作 </span> /职位详情介绍，原圆就业伴你行
                </div>
              </div>
              <div class="title-rt rt-address">
                <div>
                  <image src="../../../static/images/findWork/icon_home.png" mode="aspectFit" class="icon_home"></image>
                  <span>首页&nbsp;&gt;&nbsp;找工作&nbsp;&gt;&nbsp;工作详情</span>
                </div>
              </div>
            </div>
          </div>
          <div class="work-top">
            <div class="top-lt">
              <div class="work-title">
                <div class="work-name">
                  {{ workInfo.acb213 }}
                </div>
                <div class="work-money" v-if="!type">
                  薪资待遇：
                  <!-- <span>{{workInfo.acb21h?workInfo.acb21h:'0'+'-'+workInfo.acb21j?workInfo.acb21j:'0'}}</span><label>元/月</label> -->
                  <span>{{
                    workInfo.acb21h && workInfo.acb21j
                      ? workInfo.acb21h != workInfo.acb21j
                        ? workInfo.acb21h + '~' + workInfo.acb21j
                        : workInfo.acb21h
                      : ''
                  }}</span>
                  <span>{{ workInfo.acb21h && !workInfo.acb21j ? workInfo.acb21h + '元以上' : '' }}</span>
                  <span>{{ !workInfo.acb21h && workInfo.acb21j ? workInfo.acb21j + '元以下' : '' }}</span>
                  <span>{{ !workInfo.acb21h && !workInfo.acb21j ? '薪资面议' : '' }}</span>
                  <label v-if="workInfo.acb21h && workInfo.acb21j">{{
                    workInfo.acb21h || workInfo.acb21j ? '元/月' : ''
                  }}</label>
                  <label v-if="(!workInfo.acb21h && workInfo.acb21j) || (workInfo.acb21h && !workInfo.acb21j)">{{
                    '/月'
                  }}</label>
                </div>
                <div class="work-money" v-else>
                  薪资待遇：
                  <!-- <span>{{workInfo.acb21h?workInfo.acb21h:'0'+'-'+workInfo.acb21j?workInfo.acb21j:'0'}}</span><label>元/月</label> -->
                  <span>{{
                    workInfo.acc034l && workInfo.acc034h ? workInfo.acc034l + '~' + workInfo.acc034h : ''
                  }}</span>
                  <span>{{ workInfo.acc034l && !workInfo.acc034h ? workInfo.acc034l + '以上' : '' }}</span>
                  <span>{{ !workInfo.acc034l && workInfo.acc034h ? workInfo.acc034h + '以下' : '' }}</span>
                  <span>{{ !workInfo.acc034l && !workInfo.acc034h ? '薪资面议' : '' }}</span>
                  <label>{{ workInfo.acc034l || workInfo.acc034h ? '元/月' : '' }}</label>
                </div>
              </div>
              <div class="work-address">
                <span v-show="workInfo.acb217">{{ workInfo.acb217 }}</span>
                <span v-show="workInfo.acb217">|</span>
                <span v-show="workInfo.acc217Desc">{{ workInfo.acc217Desc }}</span>
                <span v-show="workInfo.acc217Desc">|</span>
                <span v-show="workInfo.aac011Desc">{{ workInfo.aac011Desc }}</span>
                <span v-show="workInfo.aac011Desc">|</span>
                <span v-show="workInfo.acb21g">招{{ workInfo.acb21g }}人</span>
              </div>
              <div v-if="workInfo.acb214 && workInfo.acb214_desc" class="work-tip">
                <span v-for="item in workInfo.acb214_desc.split(',')" :key="item">{{ item }}</span>
              </div>
              <div v-else-if="workInfo.acb214" class="work-tip">
                <span v-for="item in workInfo.acb214.split(',')" :key="item">{{ item }}</span>
              </div>
            </div>
            <div class="top-rt">
              <div class="work-operation">
                <div v-if="!type">
                  <div
                    class="btn-div btn-cancel"
                    style="margin: 0 !important"
                    @click="cancelCollectOpen"
                    v-if="workInfo.cb23Count && workInfo.cb23Count == '1'"
                  >
                    <image src="../../../static/images/findWork/icon_vector1.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>取消收藏</span>
                  </div>
                  <div class="btn-div btn-add" @click="collect" v-else style="margin: 0 !important">
                    <image src="../../../static/images/findWork/icon_vector2.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>收藏职位</span>
                  </div>
                  <div
                    disabled
                    class="btn-div btn-send"
                    style="margin: 0 0 0 20px !important"
                    v-if="workInfo.cc30Count && workInfo.cc30Count == '1'"
                  >
                    <image src="../../../static/images/findWork/icon_vector.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>已投简历</span>
                  </div>
                  <div class="btn-div btn-send" @click="sendOpen" v-else style="margin: 0 0 0 20px !important">
                    <image src="../../../static/images/findWork/icon_vector.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>投递简历</span>
                  </div>
                </div>
                <div v-else>
                  <div
                    class="btn-div btn-cancel"
                    style="margin: 0 !important"
                    @click="cancelCollectOpen"
                    v-if="workInfo.cb23Count && workInfo.cb23Count == '1'"
                  >
                    <image src="../../../static/images/findWork/icon_vector1.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>取消收藏</span>
                  </div>
                  <div class="btn-div btn-add" @click="collect" v-else style="margin: 0 !important">
                    <image src="../../../static/images/findWork/icon_vector2.png" mode="aspectFit" class="icon_vector">
                    </image>
                    <span>收藏职位</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="work-bottom">
            <div :class="isAab001 ? 'bottom-lt' : 'bottom-lt-none'">
              <div class="main-title">
                <div>职位信息</div>
              </div>
              <div class="bottom-box">
                <div class="bottom-title">
                  <div class="title-blt">岗位描述：</div>
                </div>
                <div class="bottom-con2" v-if="workInfo.acb216">
                  <common-scroll>
                    <div class="decr-box">
                      <p v-dompurify-html="workInfo.acb216"></p>
                    </div>
                  </common-scroll>
                </div>
                <div class="no-data" v-else>
                  <img src="../../../static/images/ic_no_data.png" />
                  <p>发布者还未录入</p>
                </div>
                <div class="person-bot">
                  <div class="bottom-title">
                    <div class="title-blt">岗位联系人：</div>
                    <div class="bottom-con3" v-if="workInfo.acb224 || workInfo.aae004">
                      <common-scroll>
                        <div class="decr-box">
                          <p>{{ workInfo.acb224 || workInfo.aae004 }}</p>
                        </div>
                      </common-scroll>
                    </div>
                  </div>

                  <div class="bottom-title">
                    <div class="title-blt">岗位联系电话：</div>
                    <div class="bottom-con3" v-if="(workInfo.acb225 || workInfo.aae005) && isLogin">
                      <div class="decr-box">
                        <p>{{ workInfo.acb225 || workInfo.aae005 }}</p>
                      </div>
                    </div>
                    <div class="bottom-con3" v-if="(workInfo.acb225_tm || workInfo.aae005_tm) && !isLogin">
                      <div class="decr-box">
                        <p>{{ workInfo.acb225_tm || workInfo.aae005_tm }}</p>
                      </div>
                    </div>
                    <div class="btn-primary" v-if="!isLogin" @click="toLogin">
                      <image src="../../../static/images/findWork/icon_view.png" mode="aspectFit" class="icon_view" />
                      查看完整电话
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom-rt" v-if="isAab001">
              <div class="main-title">
                <div>企业信息</div>
                <div @click="toCompany">企业详情</div>
              </div>
              <div class="bottom-box h40">
                <div class="bottom-con">
                  <div class="unit-box">
                    <div class="unit-info">
                      <div class="uinfo-lt">
                        <div class="uinfo-logo">
                          <image :src="unitInfo.headImg" mode="aspectFill" class="headImg"></image>
                        </div>
                        <!--                        <div class="logo-text">
                          <image src="../../../static/images/findWork/icon_good.png" mode="aspectFill"
                            class="icon_good"></image>
                        </div> -->
                        <!--                        <div class="logo-text">未认证</div> -->
                      </div>
                      <div class="uinfo-rt">
                        <div class="unit-title">
                          <div class="unit-name">{{ unitInfo.aab004 }}</div>
                          <!--                          <div class="unit-tags">
                            <span>{{unitInfo.aab019?$utils.queryCodeDesc('aab019',unitInfo.aab019):'未知'}}</span>
                          </div> -->
                        </div>
                        <p>
                          所属行业：
                          <span class="text-blue">{{
                            unitInfo.aab022 ? $utils.queryCodeDesc('aab022', unitInfo.aab022) : '未知'
                          }}</span>
                        </p>
                        <p>统一社会信用代码：{{ unitInfo.aab998 ? unitInfo.aab998 : '未知' }}</p>
                        <!-- <p>注册资金：{{unitInfo.aab049?unitInfo.aab049:'未知'}}</p> -->
                        <p>
                          公司规模：{{ unitInfo.aab056 ? $utils.queryCodeDesc('aab056', unitInfo.aab056) : '未知' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom-box h40" style="padding-top: 0">
                <div class="bottom-con">
                  <div v-if="workList.length > 0" class="jobBox">
                    <div class="work-list" :style="`margin-left:-${(numIndex - 1) * 526}px;`">
                      <div class="work-item" v-for="(item, index) in workList" :key="index" @click="toPage(item)">
                        <div class="item-title">
                          <div class="item-name">{{ item.acb213 }}</div>
                          <div class="item-money">
                            <span>{{ item.acb21h && item.acb21j ? item.acb21h + '~' + item.acb21j : '' }}</span>
                            <span>{{ item.acb21h && !item.acb21j ? item.acb21h + '以上' : '' }}</span>
                            <span>{{ !item.acb21h && item.acb21j ? item.acb21j + '以下' : '' }}</span>
                            <span>{{ !item.acb21h && !item.acb21j ? '薪资面议' : '' }}</span>
                            <label>{{ item.acb21h || item.acb21j ? '元' : '' }}</label>
                          </div>
                        </div>
                        <div class="item-tag">
                          <span v-if="item.aac011">{{
                            item.aac011 ? $utils.queryCodeDesc('aac011', item.aac011) : ''
                          }}</span>
                          <span v-if="item.acb00r">{{ item.acb00r }}</span>
                          <span v-if="item.acb469">{{
                            item.acb469 ? $utils.queryCodeDesc('acb469', item.acb469) : ''
                          }}</span>
                          <span v-if="item.aab056">{{
                            item.aab056 ? $utils.queryCodeDesc('aab056', item.aab056) : ''
                          }}</span>
                        </div>
                        <div class="item-decr">
                          <span>工作地点：{{ item.acb217 ? item.acb217 : '未知地点' }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="botItem">
                      <div
                        :class="numIndex === index + 1 ? 'numActive' : ''"
                        @click="numIndex = index + 1"
                        v-for="(it, index) in workList"
                        :key="index"
                      ></div>
                    </div>
                  </div>
                  <div class="no-data" v-else>
                    <img src="../../../static/images/ic_no_data.png" />
                    <p>暂无相似岗位信息</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin"></common-footer>

    <uni-popup ref="popup" type="center">
      <div class="code-box">
        <div class="code-title">
          <i class="ic ic-user-tip"></i>
          <span>请选择要投递的简历</span>
        </div>
        <div class="code-center">
          <uni-list :border="false">
            <uni-list-item title="简历名称" class="code-name"></uni-list-item>
          </uni-list>
        </div>
        <div class="code-btn">
          <button class="btn btn-gary" @click="closeWxCode">取 消</button>
        </div>
      </div>
    </uni-popup>

    <common-modal ref="modalPopup"></common-modal>
    <common-modal-check
      ref="checkPopup"
      :tipInfo="titleTip"
      :typeCheck="typeCheck"
      @triggerClick="triggerClick"
    ></common-modal-check>
  </div>
</template>

<script>
export default {
  onLoad(option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (option) {
      this.workInfo = JSON.parse(option.item)
      this.type = this.workInfo.oddJob
      this.currentPage = 1
	  //暂存acb330
	  if(option.acb330){
	  	this.acb330 = option.acb330 
	  	this.cz29Param.acz01v = option.acz01v
	  	this.cz29Param.acz01t = option.acz01t
	  	this.cz29Param.acz01u = option.acb330
	  }
    }
    if (this.userInfo) {
      this.isLogin = true
      this.init()
      this.getResumeInfo()
    } else {
      this.isLogin = false
      this.initNologin()
    }
  },
  data() {
    return {
      acb330: '',
	  acz01v: '',
	  acz01t: '',
      userInfo: {},
      workInfo: {},
      unitInfo: {},
      workList: [],
      currentPage: 0,
      allWorksList: [], //所有相似岗位
      titleTip: '',
      typeCheck: '1',
      numIndex: 1,
      type: '', //是否收藏明细？？
      isAab001: false,
	  timer: null,
	  cz29Param: {
	  	method: "jy202_hrm109",
	  	acz01p: "1", //用户主体类型：求职者
	  	acz01u: '', //被浏览主体编号 招聘会或者直播过来的参数
	  	acz01v: '', // 被浏览主体名称 招聘会或者直播过来的参数
	  	acz01t: "", //被浏览主体类型：默认没有 招聘会或者直播过来的参数
	  },
    }
  },
  methods: {
    desensitizePhone(phone, maskLength = 4, maskChar = '*', prefixLength = 3, suffixLength = 4) {
      // 参数验证
      if (!phone || typeof phone !== 'string') {
        throw new Error('电话号码必须是字符串')
      }

      // 移除非数字字符
      const cleanedPhone = phone.replace(/\D/g, '')

      // 验证长度
      if (cleanedPhone.length !== 11) {
        throw new Error('电话号码必须是11位数字')
      }

      // 验证数字
      if (!/^\d+$/.test(cleanedPhone)) {
        throw new Error('电话号码必须只包含数字')
      }

      // 验证脱敏参数
      if (prefixLength + suffixLength + maskLength !== 11) {
        // 自动调整脱敏长度
        maskLength = 11 - prefixLength - suffixLength
      }

      // 生成脱敏部分
      const maskedPart = maskChar.repeat(maskLength)

      // 返回脱敏结果
      return cleanedPhone.substring(0, prefixLength) + maskedPart + cleanedPhone.substring(11 - suffixLength)
    },

    cancelApply(data) {
      let url = '/api/businessCommon/getData/jy202_hrm502'
      let param = {
        acc300: data.acc300,
        aac001: this.userInfo.aac001,
      }
      this.$utils.request(url, param, true, false, 'cipher').then((res) => {
        if (!res.serviceSuccess) {
          this.$utils.showToast('调用服务异常')
          return
        } else {
          this.$utils.showToast('撤销成功！')
          this.init()
        }
      })
    },
    initNologin() {
      //明细岗位查询--未登录下
      if (this.type) {
        let param = {
          method: 'jy218_flex203',
          acb2a0: this.workInfo.acb2a0,
        }
        this.$utils.request(null, param, true).then((res) => {
          //console.log(res)
          if (!res.serviceSuccess) {
            this.$utils.showToast('调用服务异常')
            return
          } else {
            this.$nextTick(() => {
              this.workInfo = res.data.job
              if (res.data.job.aab001) {
                this.isAab001 = true
                this.queryCompany()
              } else {
                this.isAab001 = false
              }
            })

            // this.handleGetResume()
          }
        })
      } else {
        let param = {
          method: 'jy202_hrm102',
          acb210: this.workInfo.acb210,
        }
        this.$utils.request('/api/business/invoke', param, true, true).then((res) => {
          this.$nextTick(() => {
            this.workInfo = res.cb21VO
            this.workInfo.acb216 = this.$xssUtils.decodeSafeHTML(this.workInfo.acb216)
            this.workInfo.acb225_tm = this.desensitizePhone(this.workInfo.acb225)
            this.workInfo.aae005_tm = this.desensitizePhone(this.workInfo.aae005)
            this.isAab001 = true
            this.queryCompany()
          })
        })
      }
    },

    init() {
      if (this.type) {
        let param = {
          aac001: this.userInfo.aac001,
          acb2a0: this.workInfo.acb2a0,
          method: 'jy218_flex203',
        }
        this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
          this.$nextTick(() => {
            this.workInfo = res.data.job
            if (res.data.job.aab001) {
              this.isAab001 = true
              this.queryCompany()
            } else {
              this.isAab001 = false
            }
			//添加查看岗位浏览记录
			this.cz29Param.acz01w = this.workInfo.acb210; //业务信息
			this.cz29Param.acz01x = this.workInfo.acb213; //业务信息
			this.cz29Param.acz01s = '0' //足迹类型:查看职位
			this.cz29Param.acz01q = this.userInfo.aac001; //主体信息
			this.cz29Param.acz01r = this.userInfo.aac003; //主体信息
			// 添加浏览记录
			this.$utils.addFootprint(this.cz29Param)
          })
        })
      } else {
        let param = {
          aac001: this.userInfo.aac001,
          acb210: this.workInfo.acb210,
          method: 'jy202_hrm102',
        }
        this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
          this.isAab001 = true
          this.workInfo = { ...this.workInfo, ...res.cb21VO }
          this.workInfo.acb216 = this.$xssUtils.decodeSafeHTML(this.workInfo.acb216)
          this.queryCompany()
		  //添加查看岗位浏览记录
		  this.cz29Param.acz01w = this.workInfo.acb210; //业务信息
		  this.cz29Param.acz01x = this.workInfo.acb213; //业务信息
		  this.cz29Param.acz01s = '0' //足迹类型:查看职位
		  this.cz29Param.acz01q = this.userInfo.aac001; //主体信息
		  this.cz29Param.acz01r = this.userInfo.aac003; //主体信息
		  this.$utils.addFootprint(this.cz29Param)
        })
      }
    },
    // 获取个人简历
    handleGetResume() {
      let param = {
        method: 'jy202_hrm119',
        aac001: this.userInfo.aac001,
        isSelf: '1',
      }
      this.$utils.request(null, param, true).then((res) => {
        if (!res.serviceSuccess) {
          this.$utils.showToast('调用服务异常')
        } else {
          this.userInfo.acc200 = res.data.resumeMap.baseInfo.acc200
        }
      })
    },
    queryCompany() {
      //console.log(this.workInfo)
      let param = {
        method: 'jy202_hrm111',
        aab001: this.workInfo.aab001,
      }
      this.$utils.request(null, param, true).then((res) => {
        this.unitInfo = res.ab01VO
        if (this.unitInfo.aae707) {
          this.unitInfo.headImg = this.$downLoadImgSrc + this.unitInfo.aae707
        } else {
          this.unitInfo.headImg = '../../../static/images/findWork/icon_unit.png'
        }
        this.queryWorkList()
      })
    },
    // 查询相似岗位
    queryWorkList() {
      let param = {
        method: 'jy202_hrm101',
        aab001: this.unitInfo.aab001,
        // ycb211: "0",//上线的
        acb468: '1', //岗位是否上线（1：上线，0：下线）
        AAE100: '1', //岗位是否有效（1：有效，0：无效）
        audit_status: '0', //岗位审核通过的
        pageNumber: 1,
        pageSize: 3,
        paginationModel: 'mostCount',
        aac001: this.userInfo.aac001,
      }
      this.$utils.request(null, param, true).then((res) => {
        this.workList = res?.pageBean?.list
      })
      // let param = {
      //   method: "jy202_hrm114",
      //   aca111: this.workInfo.aca111,
      //   acb468: this.workInfo.acb468,
      //   aae100: this.workInfo.aae100,
      //   pageSize: 1,
      // };
      // this.$utils.request(null, param, true).then(res => {
      //   if (!res.serviceSuccess) {
      //     this.$utils.showToast("调用服务异常")
      //     return
      //   } else {
      //     this.allWorksList = res.data.data;
      //     this.changeQuery()
      //   }
      // });
    },

    triggerClick(type) {
      //alert(type)
      if (type == '1') {
        //取消收藏
        this.cancelCollect()
      } else if (type == '2') {
        //跳转创建简历
        this.$utils.navigateTo('/pages/personalCenter/resumeEdit/resumeEdit')
      } else {
        this.init()
      }
    },
    getResumeInfo() {
      const url = '/api/business/invoke'
      let param = {
        aac001: this.userInfo.aac001,
        isSelf: '1',
        method: 'jy202_hrm1194',
      }
      this.$utils.request(url, param, true, true, 'cipher').then((res) => {
        this.acc200 = res.resumeMap?.baseInfo?.acc200
        console.log(this.acc200, 'acc200')
      })
    },
    sendOpen() {
      //console.log(this.userInfo.acc200)
      if (!this.isLogin) {
        this.$refs.modalPopup.open()
        return
      }
      if (!this.workInfo.acb210 && !this.userInfo.aac001) {
        this.$utils.showToast('未获取到职位详情，不可投递')
        return
      }
      if (!this.acc200) {
        // this.titleTip = '尚未创建个人简历信息,是否创建个人简历信息?'
        this.typeCheck = '2'
        // this.$refs.checkPopup.open()
        this.$utils.showToast('暂无简历，请前往微信小程序或者网站创建简历')
        return
      }
      this.send()
    },
    // 投递简历
    send() {
      let param = {
        acc04u: this.acb330 ? '1' : '0',
        acb330: this.acb330,
        aac001: this.userInfo.aac001,
        acb210: this.workInfo.acb210,
        acc200: this.acc200,
        aab001: this.workInfo.aab001,
        aae400: '19',
        method: 'jy202_hrm100',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.titleTip = '投递成功'
        this.typeCheck = '3'
		//添加职位申请浏览记录
		this.cz29Param.acz01w = this.workInfo.acb210; //业务信息
		this.cz29Param.acz01x = this.workInfo.acb213; //业务信息
		this.cz29Param.acz01s = '1' //足迹类型:投递简历
		this.cz29Param.acz01q = this.userInfo.aac001; //主体信息
		this.cz29Param.acz01r = this.userInfo.aac003; //主体信息
		this.$utils.addFootprint(this.cz29Param)
        this.$refs.checkPopup.open()
      })
    },
    // cancelSend() {
    // 	let param = {};
    // 	param.method = "revokeApplyInfo";
    // 	param.acc300 = this.workInfo.acc300;
    // 	this.$utils.showModal("提示信息", "是否撤销投递", true, () => {
    // 		this.$utils.request(param, res => {
    // 			if (res.code === '-1') {
    // 				this.$utils.showToast(res.message)
    // 			} else {
    // 				this.$utils.showToast("撤销成功")
    // 				this.init();
    // 			}
    // 		})
    // 	}, () => {
    // 		this.$utils.showToast("已取消")
    // 	});
    // },

    collect() {
      if (!this.isLogin) {
        this.$refs.modalPopup.open()
        return
      }

      let that = this
      let param = {
        aac001: this.userInfo.aac001,
        acb231: this.userInfo.aac001,
        aca111: this.workInfo.aca111,
        acb235: this.workInfo.acb210 || this.workInfo.acb2a0,
        acb234: '2',
        acb237: '1',
        // yae100: this.workInfo.yae100,
        aae400: '19',
        method: 'collect_com01',
      }

      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.$utils.showToast('收藏成功')
		//添加职位收藏浏览记录
		this.cz29Param.acz01s = '2' //足迹类型:职位收藏
		this.$utils.addFootprint(this.cz29Param)
		if(this.timer){
			clearTimeout(this.timer)
		}
        this.timer = setTimeout(() => {
          that.init()
        }, '1000')
      })
    },

    cancelCollectOpen() {
      this.titleTip = '请您确认是否需要取消收藏呢？'
      this.typeCheck = '1'
      this.$refs.checkPopup.open()
    },

    cancelCollect() {
      let param = {
        aac001: this.userInfo.aac001,
        acb231: this.userInfo.aac001,
        aca111: this.workInfo.aca111,
        acb235: this.workInfo.acb210 || this.workInfo.acb2a0,
        acb235s: this.workInfo.acb210 || this.workInfo.acb2a0,
        acb230: this.workInfo.acb230,
        acb234: '2',
        acb237: '1',
        method: 'collect_com02',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.$utils.showToast('取消收藏成功')
		if(this.timer){
			clearTimeout(this.timer)
		}
        this.timer = setTimeout(() => {
          that.init()
        }, '1000')
      })
    },
    toPage(item) {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findWorkDetail/findWorkDetail?item=' + encodeURIComponent(JSON.stringify(item)),
      )
    },
    toCompany() {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findUnitDetail/findUnitDetail?item=' +
          encodeURIComponent(JSON.stringify(this.unitInfo)) +
          '&acb330=' +
          this.acb330,
      )
    },
    closeWxCode() {
      this.$refs.popup.close()
    },
    // 换一批相似岗位
    changeQuery() {
      this.currentPage++
      if ((this.currentPage - 1) * 3 >= this.allWorksList.length) {
        this.currentPage = 1
      }
      this.workList = this.allWorksList.slice((this.currentPage - 1) * 3, this.currentPage * 3)
    },
    toLogin() {
      this.$refs.modalPopup.open()
    },
  },
}
</script>

<style lang="scss" scoped>
.rt-address {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .icon_home {
    width: 30px;
    height: 30px;
  }

  > div {
    display: flex;
    align-items: center;

    > span {
      height: 30px;
      display: inline-block;
      line-height: 30px;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.6);
      letter-spacing: 2px;
      margin-left: 6px;
    }
  }
}

.main-title {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid #d9d9d9;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div:first-child {
    height: 60px;
    box-sizing: border-box;
    font-weight: 600;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.9);
    border-bottom: 4px solid #0c6af7;
    border-radius: 2px;
    line-height: 60px;
  }

  > div:nth-child(2) {
    width: 96px;
    height: 38px;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #0c6af7;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #0c6af7;
    text-align: center;
    line-height: 38px;
  }
}

.work-wrap {
  height: 100%;

  .work-top {
    height: 160px;
    width: 1640px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    background: url('../../../static/images/findWork/bg_top.png') center no-repeat;
    background-size: cover;
    margin: 20px auto 0 auto;
    padding: 0px 60px 0 30px;

    .top-lt {
      .work-title {
        display: flex;
        align-items: center;

        .work-name {
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          font-size: 30px;
          color: rgba(0, 0, 0, 0.9);
          text-align: left;
          margin-right: 150px;
        }

        .work-money {
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 24px;
          color: #eb3527;
        }
      }

      .work-address {
        margin: 8px 0;

        span {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 18px;
          color: rgba(0, 0, 0, 0.6);
          letter-spacing: 2px;
          margin: 0 6px;
        }

        > span:first-child {
          margin-left: 0;
        }
      }

      .work-tip {
        padding-top: 13px;

        > span {
          display: inline-block;
          padding: 4px 10px;
          box-sizing: border-box;
          background: #c0e0fc;
          border-radius: 2px 2px 2px 2px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #0c6af7;
          margin-right: 12px;
        }
      }
    }

    .top-rt {
      .work-operation {
        > div {
          min-width: 350px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
  }

  .btn-div {
    width: 158px;
    height: 52px;
    border-radius: 4px 4px 4px 4px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon_vector {
      width: 20px;
      height: 20px;
      padding-top: 10px;
      margin-right: 3px;
    }
  }

  .btn-cancel {
    background-color: #e19613;
    color: #ffffff;
  }

  .btn-add {
    border: 1px solid #0c6af7;
    color: #0c6af7;
  }

  .btn-send {
    background-color: #0c6af7;
    color: #ffffff;
  }

  .work-bottom {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 212px);
    width: 1640px;
    margin: 30px auto 0 auto;
    box-sizing: border-box;
    overflow: hidden;

    .bottom-lt {
      height: 430px;
      width: calc(100% - 660px);
      margin-right: 60px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }

    .bottom-lt-none {
      height: 430px;
      width: 100%;
      padding-right: 60px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }

    .bottom-rt {
      width: 600px;
      height: 430px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
      box-sizing: border-box;
    }
  }
}

.bottom-box {
  height: calc(100% - 65px);
  box-sizing: border-box;
  overflow: hidden;
  padding: 20px 30px 10px 30px;

  &.h40 {
    height: 42%;
  }

  &.h60 {
    height: 58%;
  }

  .no-data {
    padding: 10px;

    img {
      width: 160px;
      height: 160px;
    }
  }

  .person-bot {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
  }

  .bottom-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .title-blt {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.9);
    }

    .title-brt {
      .btn-refresh {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }
  }

  .bottom-con {
    height: calc(100% - 40px);
    padding-left: 14px;

    .scroll {
      padding-left: 0;
    }
  }

  .bottom-con2 {
    height: 65%;
    padding-left: 14px;
    margin-bottom: 30px;

    .scroll {
      padding-left: 0;
    }
  }

  .bottom-con3 {
    padding-left: 14px;

    .scroll {
      padding-left: 0;
    }
  }
}

.decr-box {
  font-size: 18px;
  color: #666666;
  line-height: 32px;
}

.unit-box {
  .unit-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;

    .unit-name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 24px;
      color: #000000;
      line-height: 26px;
      color: #404040;
      display: inline-block;
      max-width: 420px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .unit-tags {
      padding-left: 10px;

      span {
        display: inline-block;
        padding: 0 12px;
        height: 24px;
        line-height: 24px;
        background: #f3faff;
        border-radius: 4px;
        border: solid 1px rgba(17, 148, 255, 0.24);
        font-size: 14px;
        color: #1194ff;
      }
    }
  }

  .unit-info {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .uinfo-lt {
      width: 110px;
      height: 110px;
      position: relative;

      .uinfo-logo {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        border-radius: 50%;

        .headImg {
          width: 100%;
          height: 100%;
        }
      }

      .logo-text {
        position: absolute;
        z-index: 2;
        width: 96px;
        height: 32px;
        left: 50%;
        /* 居中 */
        bottom: -7px;
        /* 靠底部 */
        transform: translateX(-50%);

        /* 水平居中 */
        .icon_good {
          width: 100%;
          height: 100%;
        }
      }
    }

    .uinfo-rt {
      padding-left: 20px;

      p {
        color: #666666;
        font-size: 16px;
        line-height: 32px;

        span {
          &.text-blue {
            color: #2778ff;
          }

          &.text-org {
            color: #ff7e00;
          }
        }
      }
    }
  }
}
.jobBox {
  width: 526px;
  height: 170px;
  box-sizing: border-box;
  overflow: hidden;
}
.work-list {
  width: 300%;
  display: flex;
  transition: all 0.3s ease-in-out;
  .work-item {
    width: 526px;
    height: 146px;
    padding: 20px 26px;
    box-sizing: border-box;
    background-color: #f5f5f5;

    .item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .item-name {
        font-size: 18px;
        color: #404040;
        font-weight: bold;
        max-width: 340px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-money {
        color: #666666;
        font-size: 16px;

        span {
          color: #ff7e00;
          font-size: 18px;
        }
      }
    }

    .item-decr {
      margin-top: 20px;
      span {
        padding-right: 8px;
        white-space: nowrap;
        color: #666666;
        font-size: 16px;
      }
    }
    .item-tag {
      span {
        margin-right: 5px;
      }
    }
  }
}

.code-box {
  min-width: 400px;
  background: #ffffff;
  border-radius: 8px;

  .code-title {
    border-bottom: 1px solid #cccccc;
    line-height: 40px;
    padding: 8px 24px;

    .ic-user-tip {
      width: 24px;
      height: 24px;
    }

    span {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      color: #666666;
      padding-left: 8px;
    }
  }

  .code-center {
    padding: 24px;

    .code-name {
      /deep/ .uni-list-item__content-title {
        font-size: 16px;
        color: #007aff;
      }
    }
  }

  .code-btn {
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      display: inline-block;
      width: 158px;
    }
  }
}
.botItem {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  > div {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-image: url('../../../static/images/waitPage/Rectangle9.png');
    transition: all 0.3s ease-in-out;
    margin-right: 8px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  > div:last-child {
    margin-right: 0px;
  }
  > div.numActive {
    width: 18px;
    border-radius: 3px;
    background-image: url('../../../static/images/waitPage/Rectangle8.png');
  }
}
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0c6af7;
  padding: 0 14px;
  height: 40px;
  border-radius: 4px;
  .icon_view {
    width: 24px;
    height: 24px;
  }
}
</style>
