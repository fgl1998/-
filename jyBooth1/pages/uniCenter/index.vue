<template>
  <xu-common-shell :title="userInfo.aab004" type="2">
    <div class="uni-center">
      <div class="left">
        <div class="top">
          <xu-common-title zh="功能列表" en="/ Function List"></xu-common-title>
          <div class="funtion-box">
            <div
              class="funtion-item"
              @click="toPages(item.url)"
              v-for="(item, index) in funList"
              :key="index"
              :style="{
                background: 'url(' + getRealImgUrl(item.bg) + ') no-repeat center center',
                backgroundSize: '100% 100%',
              }"
            >
              <div class="item-left">
                <h6>{{ item.zh }}</h6>
                <p>{{ item.en }}</p>
              </div>
              <img :src="getRealImgUrl(item.img)" :alt="item.zh" />
            </div>
          </div>
        </div>
        <div class="statics-box">
          <div class="statistics_item" v-for="(item, index) in staList" :key="index">
            <img :src="getRealImgUrl(item.img)" :alt="item.name" />
            <div class="name">
              {{ item.name }}
            </div>
            <div class="num">
              {{ item.num }}
              <!-- <span>次</span> -->
            </div>
          </div>
        </div>
        <div class="left-bottom">
          <xu-common-title zh="招聘统计" en="/ Recruitment statis"></xu-common-title>
          <div class="tabel" v-if="tableData.length != 0">
            <el-table :data="tableData" height="98%" style="width: 100%; margin-top: 3px">
              <el-table-column prop="seq" label="序号" width="100" align="center">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>

              <el-table-column prop="acb213" label="招聘职位" align="center">
                <div @click="toPage(scope.row)" slot-scope="scope">
                  {{ scope.row.acb213 }}
                </div>
              </el-table-column>
              <el-table-column prop="acb21g" label="招聘人数" width="130" align="center"></el-table-column>
              <el-table-column prop="positionBrowsedNum" label="浏览次数" width="130" align="center">
                <span style="color: #044fff" slot-scope="scope">
                  {{ scope.row.positionBrowsedNum }}
                </span>
              </el-table-column>
              <el-table-column prop="positiondeliveriedNum" label="投递简历" width="130" align="center">
                <span style="color: #19cbb9" slot-scope="scope">
                  {{ scope.row.positiondeliveriedNum }}
                </span>
              </el-table-column>
              <el-table-column prop="interviewNum" label="面试邀请人数" width="200" align="center">
                <span style="color: #f77a2c" slot-scope="scope">
                  {{ scope.row.interviewNum }}
                </span>
              </el-table-column>
              <el-table-column prop="interviewNum" label="面试成功人数" width="200" align="center">
                <span style="color: #f77a2c" slot-scope="scope">
                  {{ scope.row.interviewSuccessNum }}
                </span>
              </el-table-column>
            </el-table>
          </div>
          <div class="tabel" v-if="tableData.length == 0">
            <div style="width: 200px" class="newNoData" data-on="暂无职位信息" />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="company-info">
          <div class="company-info-top">
            <xu-common-title zh="企业信息" en="/ Enterprise informa">
              <div class="icon_edit" slot="btn" @click="openEditModal">
                <img :src="getRealImgUrl('img/unitCenter/icon_edit.png')" alt="编辑" />
                <span>编辑</span>
              </div>
            </xu-common-title>
            <div class="company-desc">
              <div class="company-top">
                <div class="img_box">
                  <img
                    :src="$utils.getFileLoadUrlOrDefault(companyInfo.headImg, 'img/recruitment/icon_unit.png')"
                    alt=""
                  />
                </div>
                <div class="company-top-right">
                  <div class="name">
                    {{ companyInfo.aab004 }}
                  </div>
                  <div class="industry info_text">
                    所属行业：
                    {{ companyInfo.aab022Desc ? companyInfo.aab022Desc : '无' }}
                  </div>
                  <div class="scale info_text">
                    单位规模：
                    {{ companyInfo.aab056 ? $codeConfig.getCodeLabel('AAB056', companyInfo.aab056) : '无' }}
                  </div>
                  <div class="nature info_text">
                    公司性质：
                    {{ companyInfo.aab019 ? $codeConfig.getCodeLabel('AAB019', companyInfo.aab019) : '无' }}
                  </div>
                </div>
              </div>
              <div class="address info_text">
                公司地址：
                {{ companyInfo.aab060 }}
              </div>
              <div class="company_info_bottom">
                <span>【公司简介】</span>
                <i v-dompurify-html="companyInfo.aab092 ? companyInfo.aab092 : '暂无简介'"></i>
                <!--                <i v-for="(item, index) in comanyIntroduceTextList" :key="index">
                                  {{ item }}
                                </i>-->
              </div>
            </div>
          </div>
        </div>
        <div class="right-bottom">
          <xu-common-title zh="实时职位投递" en="/ Real time job post"></xu-common-title>
          <div class="person_num">
            总投递人数：
            <span>{{ allSendCount }}</span>
            人
          </div>
          <div class="person-list">
            <div v-if="personList.length != 0" class="person_item" v-for="(item, index) in personList" :key="index">
              <div class="time">
                {{ item.aae052_hm }}
              </div>
              <div class="name">
                {{ item.aac003 }}
              </div>
              <div class="text">投递了{{ item.acb213 }}</div>
              <div class="more" @click="toTalentDetails(item)">查看更多</div>
            </div>
            <div v-if="personList.length == 0">
              <div style="width: 120px" class="newNoData" data-on="暂无投递信息" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <common-resume
      :data="resumeInfo"
      :visible="commonResumeVisible"
      @close="commonResumeVisible = false"
    ></common-resume>
    <edit-company-info :visible="isShowEdit" @onClose="closeEditModal" :companyInfo="companyInfo"></edit-company-info>
  </xu-common-shell>
</template>

<script>
import moment from 'moment'
import talentDetails from '../newSearchTalent/components/talentDetails'
import EditCompanyInfo from './component/editCompanyInfo.vue'
import commonResume from '../../components/common-resume/common-resume.vue'

export default {
  components: {
    talentDetails,
    EditCompanyInfo,
    commonResume,
  },
  data() {
    return {
      resumeInfo: {},
      commonResumeVisible: false,
      showModal: false,
      aac001: null,
      acc200: null,
      user_id: null,
      userInfo: this.$loginConfig.getLoginInfo(),
      isShowEdit: false, // 是否打开编辑框
      // 功能列表
      funList: [
        {
          zh: '职位管理',
          en: 'position management',
          img: 'img/unitCenter/icon_fun1.png',
          bg: 'img/unitCenter/bg_1@2x.png',
          url: '../recruitment/recruitment',
        },
        {
          zh: '简历管理',
          en: 'Resume Management',
          img: 'img/unitCenter/icon_fun4.png',
          bg: 'img/unitCenter/bg_3@2x.png',
          url: '../resumeManage/resumeManage',
        },
        {
          zh: '面试管理',
          en: 'Talent management',
          img: 'img/unitCenter/icon_fun3.png',
          bg: 'img/unitCenter/bg_4@2x.png',
          url: '../newInterviewManage/interviewManage',
        },
        {
          zh: '岗位补录',
          en: 'Position Recording',
          img: 'img/unitCenter/icon_fun2.png',
          bg: 'img/unitCenter/bg_2@2x.png',
          url: '../positionRecording/positionRecording',
        },
      ],
      // 统计项列表
      staList: [
        {
          name: '发布岗位',
          num: 0,
          img: 'img/unitCenter/icon_num1.png',
        },
        {
          name: '投递人数',
          num: 0,
          img: 'img/unitCenter/icon_num2.png',
        },
        {
          name: '收藏人数',
          num: 0,
          img: 'img/unitCenter/icon_num3.png',
        },
        {
          name: '浏览总量',
          num: 0,
          img: 'img/unitCenter/icon_num4.png',
        },
      ],
      // tabel表数据
      tableData: [],
      //投递总数
      allSendCount: 0,
      // 公司信息
      companyInfo: {},
      comanyIntroduceTextList: [],
      // 实时投递列表
      personList: [],
      currentSendInfoTimer: null,
      statisticsTimer: null,
      recruitTimer: null,
    }
  },
  mounted() {
    // uni.navigateTo({
    //   url: '/pages/largeScreen/largeScreen?userId=' + '111111111111',
    // })
    this.$nextTick(() => {
      this.getCompanyInfo()
      this.getCurrentSendInfo()
      this.getRecruitInfo()
      this.getStatistics()

      // this.getCompanyInfo();
      // this.getCurrentSendInfo();
      // this.getRecruitInfo();
      // this.getStatistics();
      // this.queryConcat()

      // 十秒
      // this.currentSendInfoTimer = setInterval(() => {
      //   this.getCurrentSendInfo()
      // }, 10000)
      // // 一分钟
      // this.recruitTimer = setInterval(() => {
      //   this.getRecruitInfo()
      // }, 60000)
      // // 十分钟
      // this.statisticsTimer = setInterval(() => {
      //   this.getStatistics()
      // }, 600000)
    })
  },
  methods: {
    moment,
    queryConcat() {
      this.$http.post(this.$requestConstant.businessRequestType, 'jy202_hrm226', null, null, true).then((data) => {
        console.info(data)
      })
    },
    toPages(value) {
      console.log(value, 99999)

      if (value) {
        uni.navigateTo({
          url: value,
        })
      }
    },
    //跳转打开个人简历详细页面
    toTalentDetails(item) {
      this.resumeInfo = item
      this.commonResumeVisible = true
    },
    sendMsgForHelp() {
      let param = {
        apiCode: 'sendMsgForHelp',
        method: 'sendMsgForHelp',
        aab004: this.userInfo.aab004,
        aab001: this.userInfo.aab001,
        acb32b: this.userInfo.acb32b,
      }
      this.$http.request('/api/business/getData.do', 'post', param, true).then((data) => {
        this.$utils.showMessageModal('求职信息发送提示', '求助信息发送成功')
      })
    },
    // 关闭人才详情页面
    modalClose(item) {
      this.showModal = item
    },
    // 获取企业信息
    getCompanyInfo() {
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm204', null, null, true).then((data) => {
        this.companyInfo = data.data.ab01HrmVO
        this.companyInfo.acb00s = this.companyInfo.acb00s ? this.companyInfo.acb00s.split(',') : []
        if (this.companyInfo.aab092) {
          this.comanyIntroduceTextList = this.companyInfo.aab092.split('&#xa;') // 后端的换行是&#xa; 需要分割换行符
          this.companyInfo.aab092 = this.$utils.htmlDecode(this.companyInfo.aab092) // 在textarea中可以直接将\r\n显示成换行
        }
        if (this.companyInfo.aae707) {
          this.companyInfo.headImg = this.companyInfo.aae707
        }
        this.getFileLoadUrlOrDefault(this.companyInfo.aae707, 'img/publicImg/default_company.png')
      })
    },
    // 获取统计数据
    getStatistics() {
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm442', null, { acb330: this.userInfo.acb330 }, false)
        .then((data) => {
          let staticsInfo = data.data.staticsData
          this.staList = [
            {
              name: '发布岗位',
              num: staticsInfo.publish_number,
              img: 'img/unitCenter/icon_num1.png',
            },
            {
              name: '投递人数',
              num: staticsInfo.delivery_number,
              img: 'img/unitCenter/icon_num2.png',
            },
            {
              name: '面试人数',
              num: staticsInfo.collect_number,
              img: 'img/unitCenter/icon_num3.png',
            },
            {
              name: '浏览总量',
              num: staticsInfo.browse_number,
              img: 'img/unitCenter/icon_num4.png',
            },
          ]
        })
    },
    // 获取招聘统计数据
    getRecruitInfo() {
      let param = { acb330: this.userInfo.acb330 }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm253', null, param, false).then((data) => {
        this.tableData = data.data.positionList
      })
    },
    // 获取当日投递数据
    getCurrentSendInfo() {
      let param = {
        acb330: this.userInfo.acb330,
        // currentDate: moment(new Date()).format('yyyy-MM-DD'),
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm444', null, param, false).then((data) => {
        this.personList = data.data.dailyPositionList
        this.allSendCount = data.data.all_count
      })
    },
    // 打开编辑框
    openEditModal() {
      this.isShowEdit = true
    },
    // 关闭编辑框
    closeEditModal() {
      this.isShowEdit = false
      this.getCompanyInfo()
    },
    toPage(item) {
      this.$utils.navigateTo('/pages/recruitment/workDetail?item=' + encodeURIComponent(JSON.stringify(item)))
    },
  },
  beforeDestroy() {
    clearInterval(this.currentSendInfoTimer)
    clearInterval(this.statisticsTimer)
    clearInterval(this.recruitTimer)
  },
}
</script>

<style lang="less" scoped>
.uni-center {
  display: flex;
}

.left {
  width: calc(1208px - 48px);

  .top {
    width: calc(1208px - 48px);
    height: 236px;
    background: #ffffff;
    border-radius: 6px;
    padding: 22px 24px 0;

    .funtion-box {
      display: flex;
      width: calc(1208px - 48px);
      margin-top: 30px;
      gap: 15px;

      .funtion-item {
        cursor: pointer;
        width: 280px;
        height: 118px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;

        .item-left {
          margin-left: 24px;

          > h6 {
            width: 96px;
            height: 24px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: bold;
            font-size: 24px;
            color: #ffffff;
            line-height: 0px;
            text-align: left;
            font-style: normal;
          }

          > p {
            margin-top: 5px;
            width: 147px;
            height: 14px;
            font-family: ArialMT;
            font-size: 12px;
            color: #ffffff;
            line-height: 14px;
            text-align: left;
            font-style: normal;
            text-transform: uppercase;
          }
        }
      }
    }
  }
}

.statics-box {
  width: 1208px;
  height: 204px;
  display: flex;
  padding: 22px 0;
  gap: 20px;

  .statistics_item {
    width: 292px;
    height: 204px;
    background: #ffffff;
    border-radius: 6px;

    > img {
      width: 76px;
      height: 76px;
      margin: 26px 0 0 108px;
    }

    .name {
      width: 80px;
      height: 20px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 20px;
      color: #999999;
      line-height: 30px;
      text-align: left;
      font-style: normal;
      margin: 16px 0 18px 108px;
    }

    .num {
      width: 130px;
      height: 28px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 500;
      font-size: 28px;
      color: #333333;
      line-height: 22px;
      text-align: center;
      font-style: normal;
      margin: 16px 0 18px 80px;
    }
  }
}

.left-bottom {
  width: calc(1208px - 48px);
  height: 388px;
  background: #ffffff;
  border-radius: 6px;
  padding: 22px 24px 0;

  .tabel {
    width: calc(1208px - 48px);
    height: calc(388px - 60px);

    /deep/ .el-table__header-wrapper thead tr th {
      height: 60px;
      background: #f1f6fe;
      border-radius: 2px 2px 0px 0px;
      width: 96px;
      height: 24px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 500;
      font-size: 24px;
      color: #333333;
      line-height: 36px;
      font-style: normal;
    }

    /deep/ .el-table .cell {
      height: 20px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 20px;
      color: #666666;
      line-height: 20px;
      text-align: center;
      font-style: normal;
    }
  }
}

.right {
  width: calc(614px - 48px);
  margin-left: 74px;

  .company-info {
    height: 522px;
    background: #ffffff;
    border-radius: 6px;
    margin-bottom: 24px;
    width: 100%;
    padding: 22px 24px 0;

    .company-desc {
      margin-top: 10px;

      .company-top {
        display: flex;

        .img_box {
          width: 145px;
          height: 131px;

          > img {
            width: 100%;
            height: 100%;
          }
        }

        .company-top-right {
          margin-left: 27px;

          .name {
            width: 364px;
            height: 26px;
            font-family: SourceHanSansCNBold, SourceHanSansCNBold;
            font-weight: bold;
            font-size: 26px;
            line-height: 27px;
            color: #333333;
            text-align: left;
            font-style: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .industry {
            margin-top: 12px;
            width: 320px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 20px;
            color: #666666;
            text-align: left;
            font-style: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .scale {
            width: 320px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 20px;
            color: #666666;
            text-align: left;
            font-style: normal;
          }

          .nature {
            width: 320px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 20px;
            color: #666666;
            text-align: left;
            font-style: normal;
          }
        }
      }

      .address {
        width: 100%;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 21px;
        color: #666666;
        text-align: left;
        font-style: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .company_info_bottom {
        margin-top: 10px;
        width: 561px;
        height: 274px;
        overflow: auto;

        > span {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: bold;
          font-size: 21px;
          color: #666666;
          line-height: 38px;
          text-align: left;
          font-style: normal;
        }

        > i {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-size: 21px;
          color: #666666;
          line-height: 38px;
          text-align: left;
          font-style: normal;
        }
      }
    }
  }

  .right-bottom {
    width: 100%;
    height: 325px;
    background: #ffffff;
    border-radius: 6px;
    padding: 22px 24px 0;

    .person_num {
      height: 24px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 24px;
      color: #999999;
      line-height: 50px;
      text-align: left;
      font-style: normal;

      > span {
        color: #ff6600;
      }
    }

    .person-list {
      width: 527px;
      height: 222px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 24px;
      color: #333333;
      line-height: 54px;
      text-align: left;
      font-style: normal;
      margin-top: 10px;
      overflow: auto;

      .person_item {
        display: flex;

        .name {
          width: 80px;
          margin-left: 20px;
          color: #0682fe;
        }

        .text {
          width: 268px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .more {
          cursor: pointer;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 24px;
          color: #0682fe;
          line-height: 54px;
          text-align: left;
          font-style: normal;
        }

        .more {
          cursor: pointer;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 24px;
          color: #0682fe;
          line-height: 53px;
          text-align: left;
          font-style: normal;
        }
      }
    }
  }
}

.icon_edit {
  width: 90px;
  cursor: pointer;

  > img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  > span {
    width: 48px;
    height: 24px;
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 400;
    font-size: 24px;
    color: #0682fe;
    line-height: 24px;
    text-align: left;
    font-style: normal;
  }
}
</style>
