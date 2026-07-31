<template>
  <div class="talentDetails">
    <div v-if="isShow" class="popContainer" @click="close">
      <div class="detailBox" @click.stop>
        <div class="title">
          <span v-if="!showInvitate">简历详情</span>
          <span v-else>邀约面试</span>
          <img :src="getRealImgUrl('img/recruitTalents/ic_close.png')" alt="" @click="close"/>
        </div>
        <div v-if="!showInvitate" class="details_mesg">
          <div class="left" :class="isFromUim ? 'left-active' : ''">
            <div class="l_top">
              <div class="personalMesg">
                <img :src="personMesg.aae707" alt=""/>
                <div>
                  <div class="name">
										<span>{{ personMesg.aac003 }}（{{
                        personMesg.user_name
                            ? showAllMobile
                                ? personMesg.user_name
                                : personMesg.user_name.replace(
                                    /^(1[3-9][0-9])\d{4}(\d{4}$)/,
                                    "$1****$2"
                                )
                            : "暂无联系方式"
                      }}）</span>
                    <span @click="seeAllMobile" v-if="!showAllMobile">查看完整联系方式</span>
                  </div>
                  <div class="baseInfo">
										<span v-if="personMesg.aac004 != undefined">{{
                        $codeConfig.getCodeLabel("AAC004", personMesg.aac004)
                      }}</span>
                    <span>{{ personMesg.age }}({{ personMesg.aac006 }})</span>
                    <span v-if="personMesg.acc217 != undefined">{{
                        $codeConfig.getCodeLabel("ACC217", personMesg.acc217)
                      }}</span>
                    <span v-if="personMesg.aac011 != undefined">{{
                        $codeConfig.getCodeLabel("AAC011", personMesg.aac011)
                      }}</span>
                    <span v-if="personMesg.aae006">常住地：{{ personMesg.aae006 }}</span>
                    <span v-if="personMesg.aac010">户籍：{{ personMesg.aac010 }}</span>
                    <span v-if="personMesg.state != undefined">{{
                        personMesg.state
                      }}</span>
                  </div>
                </div>
                <div v-if="!isFromUim" class="no-from-uim-collection">
                  <div v-if="iscollection" class="rightCancel">
                    <el-popconfirm title="是否要取消收藏该简历" @confirm="confirmOk" confirm-button-text="是"
                                   cancel-button-text="否">
											<span slot="reference">
												<img :src="getRealImgUrl('img/recruitTalents/saved.png')" alt=""
                             style="width: 30px; height: 29px"/>
												取消收藏
											</span>
                    </el-popconfirm>
                  </div>
                  <div v-else @click="showPositionModal">
                    <img :src="getRealImgUrl('img/recruitTalents/ic_collect.png')" alt=""/>
                    <span>收藏简历</span>
                  </div>
                </div>
              </div>
              <div class="tags">
                <div>
                  <div class="triangle"/>
                  <div>
                    <img :src="
                        getRealImgUrl('img/recruitTalents/ic_expression.png')
                      " alt=""/>
                    <span>{{
                        personMesg.acc04t_dsc
                            ? personMesg.acc04t_dsc
                            : "我正在积极求职，期待与您沟通"
                      }}</span>
                  </div>
                </div>
                <ul v-if="isFromUim && this.userInfo.aab001">
                  <li style="display: none">
                    <img :src="getRealImgUrl('img/recruitTalents/ic_forward.png')" alt=""/>
                    <span>转发给同事</span>
                  </li>
                  <li v-if="iscollection" class="rightCancel">
                    <el-popconfirm title="是否要取消收藏该简历" @confirm="confirmOk" confirm-button-text="是"
                                   cancel-button-text="否">
                      <img :src="getRealImgUrl('img/recruitTalents/saved.png')" alt=""
                           style="width: 30px; height: 29px"/>
                      <span>取消收藏</span>
                    </el-popconfirm>
                  </li>
                  <li v-else @click="jy201_hrm104">
                    <img :src="getRealImgUrl('img/recruitTalents/ic_collect.png')" alt=""/>
                    <span>收藏简历</span>
                  </li>
                  <li @click="downLoadFile" style="display: none">
                    <img :src="getRealImgUrl('img/recruitTalents/ic_download.png')" alt=""/>
                    <span>下载简历</span>
                  </li>
                  <li @click="handleInvitate">
                    <img :src="getRealImgUrl('img/recruitTalents/ic_forward.png')" alt=""/>
                    <span>面试邀请</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="l_bottom">
              <div>
                <div class="ta_title">求职意向</div>
                <div v-for="(item, index) in jobIntension" class="jobIntension" :key="index">
                  <div>
                    <span>{{ item.aca112 }}</span>
                    <span>{{ getSalary(item.acc034) }}</span>
                  </div>
                  <div>
                    <span>{{ item.acb202 }}</span>
                    <!-- <span>{{ $codeConfig.getCodeLabel("ACA111", item.aca111) }}</span> -->
                    <span>{{ $codeConfig.getCodeLabel("ACB469", item.acb469) }}</span>
                  </div>
                </div>
              </div>
              <div>
                <div class="ta_title">教育经历</div>
                <div class="educationExp">
                  <el-timeline>
                    <el-timeline-item v-for="(item, index) in educationExp" :key="index">
                      <div>
                        <span>{{ item.acc261 }}</span>
                        <span>{{
                            item.acc262
                                ? $codeConfig.getCodeLabel("AAC183", item.acc262)
                                : "未知"
                          }}</span>
                      </div>
                      <div>
												<span>{{ item.aae030_dsc ? item.aae030_dsc : "未知" }}-{{
                            item.aae031_dsc ? item.aae031_dsc : "未知"
                          }}</span>
                        <span>{{
                            $codeConfig.getCodeLabel("AAC011", item.aac011)
                          }}</span>
                        <span>{{ item.type }}</span>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>
              <div>
                <div class="ta_title">工作经历</div>
                <div class="workExp">
                  <el-timeline>
                    <el-timeline-item v-for="(item, index) in workExp" :key="index">
                      <div>
                        <span>{{ item.aab004 }}</span>
                        <span>{{ item.aca112 }}</span>
                      </div>
                      <div>
                        <!--<span>{{ item.salary }}</span>-->
                        <span>{{ item.aae030_dsc ? item.aae030_dsc : "未知" }} -
													{{ item.aae031_dsc ? item.aae031_dsc : "未知" }}</span>
                      </div>
                      <div>
                        工作描述：<span>
                        {{ item.acc251 ? item.acc251 : '暂无'}}
                      </span>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>

              <div>
                <div class="ta_title">语言能力</div>
                <div class="languangeList">
                  <el-timeline>
                    <el-timeline-item v-for="(item, index) in perLanguage" :key="index">
                      <div>{{ $codeConfig.getCodeLabel("ACC241", item.acc241) }}</div>
                      <span v-if="item.acc242">熟练程度：<span>{{
                          item.acc242
                              ? $codeConfig.getCodeLabel("ACC242", item.acc242)
                              : "未知"
                        }}</span></span>
                      <span>读写能力：<span>{{
                          item.acc243
                              ? $codeConfig.getCodeLabel("ACC242", item.acc243)
                              : "未知"
                        }}</span></span>
                      <span>听说能力：<span>{{
                          item.acc244
                              ? $codeConfig.getCodeLabel("ACC242", item.acc244)
                              : "未知"
                        }}</span></span>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>

              <div>
                <div class="ta_title">个人优势介绍</div>
                <div>
                  {{ personMesg.acc209 ? personMesg.acc209 : '暂无'}}
                </div>
              </div>
            </div>
          </div>
          <div class="right" v-if="!isFromUim">
            <div class="r_top">
              <div>
                <span class="ta_title">感觉人才还不错，您可以：</span>
                <div class="twoBtn">
                  <div>
                    <button v-if="user_id" @click="handleOpenUim">
                      立即沟通
                    </button>
                    <button @click="handleInvitate">面试邀请</button>
                  </div>
                </div>
                <ul style="display: none">
                  <li>
                    <img :src="getRealImgUrl('img/recruitTalents/ic_forward.png')" alt=""/>
                    <span>转发给同事</span>
                  </li>
                  <li v-if="iscollection" class="rightCancel" style="cursor: pointer">
                    <el-popconfirm title="是否要取消收藏该简历" @confirm="confirmOk" confirm-button-text="是"
                                   cancel-button-text="否">
                      <img :src="getRealImgUrl('img/recruitTalents/saved.png')" alt=""
                           style="width: 30px; height: 29px"/>
                      <span>取消收藏</span>
                    </el-popconfirm>
                  </li>
                  <li v-else @click="jy201_hrm104" style="cursor: pointer">
                    <img :src="getRealImgUrl('img/recruitTalents/ic_collect.png')" alt=""/>
                    <span>收藏简历</span>
                  </li>
                  <li @click="downLoadFile">
                    <img :src="getRealImgUrl('img/recruitTalents/ic_download.png')" alt=""/>
                    <span>下载简历</span>
                  </li>
                </ul>
              </div>
              <div>
                <div class="ta_title">
                  人才互动记录<span>({{ this.timeLine.length }}条)</span>
                </div>
                <template v-if="this.timeLine.length == 0">
                  <div class="noData">
                    <img :src="getRealImgUrl('img/recruitTalents/no_data.png')" alt=""/>
                  </div>
                </template>
                <template v-else>
                  <div>
                    <el-timeline>
                      <el-timeline-item v-for="(item, index) in timeLine" :key="index">
                        <div>
                          <span>{{ item.startTime }}</span>
                        </div>
                        <div>
                          <!-- <span>{{ userInfo.aab004 }}</span> -->
                          <span>{{ item.doSomething }}</span>
                        </div>
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </template>
              </div>
            </div>
            <div class="r_bottom">
              <div class="ta_title">相似人才推荐</div>
              <div v-if="talentRecomeList.length > 0">
                <t-recom v-for="(item, index) in talentRecomeList" v-show="index < 10" :key="index"
                         :talent-recome-mesg="item" :is-see-resume="1" v-on:searchEvent="handleSearchEvent"/>
              </div>
              <div v-else style="background-color: #fff; align-items: center">
                <div class="newNoData" data-on="暂无人才信息"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="interview" style="height: 550px">
          <invite-view :aac001="aac001" :aac003="personMesg.aac003" :acc200="acc200" :acc300="acc300" :acb210="acb210"
                       :show-invitate="showInvitate" @colseInvitate="colseInvitate" @getInvitateMesg="colseInvitate"/>
        </div>
      </div>
    </div>
    <el-dialog title="职位选择" :visible.sync="showPosition" :modal-append-to-body="false" width="300px">
      <div v-if="positionList" class="position-list">
        <div @click="jy201_hrm104(item.acb210)" v-for="(item, index) in positionList" :key="index">
          {{ item.acb213 }}
        </div>
      </div>
    </el-dialog>
    <!-- <ta-modal
        width="300"
        title="职位选择"
        :visible="showPosition"
        @cancel="closePositionModal"
        :footer="null"
    >
      <div v-if="positionList" class="position-list">
        <div
            @click="jy201_hrm104(item.acb210)"
            v-for="(item, index) in positionList"
            :key="index"
        >
          {{ item.acb213 }}
        </div>
      </div>
    </ta-modal> -->

    <!-- <company-uim-box ref="cpUimBox" :uimType="2"></company-uim-box> -->
  </div>
</template>

<script>
import tRecom from "../../common/part/tRecom";
import inviteView from "../components/invitateInterview";
// import companyUimBox from "@/corePage/common/part/companyUimBox.vue";

export default {
  name: "talentDetails",
  components: {
    tRecom,
    inviteView,
    // companyUimBox,
  },
  props: {
    aac001: {
      type: String,
    },
    acc200: {
      type: String,
    },
    acc300: {
      type: String,
    },
    showModal: {
      type: Boolean,
    },
    // 是否来自即时通讯
    isFromUim: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: String,
    },
    acb210: {
      type: String,
    },
  },
  data() {
    return {
      showPosition: false, // 显示职位选择列表
      positionList: [], //职位列表
      positionData: null,
      isShow: this.showModal,
      showInvitate: false, // 面试邀请
      iscollection: false, // 是否收藏简历
      acb230: "",
      userInfo: {},
      // 个人基本信息
      personMesg: {},
      // 求职意向
      jobIntension: {},
      // 教育经历
      educationExp: [],
      // 工作经历
      workExp: [],
      // 语言能力
      perLanguage: [],
      // 相似人才
      talentRecomeList: [],
      timeLine: [],

      //添加浏览足迹
      paramCz29: {
        apiCode: "jy202_hrm109",
        method: "jy202_hrm109",
        acz01s: "2", //查看单位
        acz01t: "2", //查看简历
      },
      showAllMobile: false,
    };
  },

  watch: {
    showModal(val) {
      this.$nextTick(() => {
        this.isShow = val;
      });
      if (val) {
        this.$nextTick(() => {
          this.searchEvent();
          this.getRecord(this.userInfo.aab001);
          //添加访问足迹记录
          this.addCz29Info();
          this.updateState();
          // 查询是否动用会员权益查看完整联系方式
          // this.searchIsSeeAllMobile();
        })
      } else {
        this.showInvitate = false;
      }
    },
  },

  created() {
    this.userInfo = uni.getStorageSync("loginInfo");
  },

  methods: {
    updateState() {
      let param = {
        apiCode: "jy201_hrm108",
        method: "jy201_hrm108",
        acc300: this.acc300,
        acc676: '1'
      }
      this.$http.request("/api/business/getData.do", "post", param, true);
    },
    // 用于子组件调用查询
    handleSearchEvent(val) {
      if (val) {
        this.searchEvent(val);
      }
    },
    // 查询方法
    searchEvent(val) {
      const params = {};
      if (val) {
        params.personAac001 = val.aac001;
        params.aac001 = val.aac001;
        params.acc200 = val.acc200;
      } else {
        params.personAac001 = this.aac001;
        params.aac001 = this.aac001;
        params.acc200 = this.acc200;
      }
      if (this.userInfo && this.userInfo.aab001) {
        params.aab001 = this.userInfo.aab001;
        params.aab004 = this.userInfo.aab004;
        params.acz01v = this.userInfo.aac003;
        params.acz01w = this.userInfo.user_id;
      } else {
        this.$message.warning("当前未登录单位用户，请返回首页登录后进行操作");
      }
      params.apiCode = "jy202_hrm119";
      params.method = "jy202_hrm119";
      this.$http
          .request("/api/business/getData.do", "post", params, true)
          .then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg);
            } else {
              // 业务信息成功处理
              const resultData = data.data.resumeMap;
              if (!resultData.baseInfo || !resultData.baseInfo.acc200) {
                this.$message.warning("无法查看该人员简历信息！");
                this.$parent.showModal = false;
                return;
              }
              resultData.baseInfo.aae707 = resultData.baseInfo.aae707 ?
                  this.$host +
                  "api/base/downloadBusinessFile.do?fileId=" +
                  resultData.baseInfo.aae707 +
                  "&channelCode=xas&sysCode=jyplat" :
                  resultData.baseInfo.aac004 == "1" ?
                      this.getRealImgUrl("img/recruitTalents/male.png") :
                      this.getRealImgUrl("img/recruitTalents/female.png");
              this.personMesg = resultData.baseInfo;
              this.jobIntension = resultData.jobIntent;
              this.educationExp = resultData.eduExperience;
              this.workExp = resultData.workExperience;
              this.perLanguage = resultData.language;
              const cb23Vo = resultData.cb23Vo;
              if (cb23Vo && cb23Vo.acb230) {
                this.iscollection = true;
                this.acb230 = cb23Vo.acb230;
              } else {
                this.iscollection = false;
                this.acb230 = "";
              }
              // 查询相似人才
              const params1 = {};
              params1.aac001 = this.aac001;
              const aca111s = resultData.jobIntent
                  .map((item) => item.aca111)
                  .toString();
              params1.aca111s = aca111s;
              params1.apiCode = "jy201_hrm118";
              params1.method = "jy201_hrm118";
              this.$http
                  .request("/api/business/getData.do", "post", params1, true)
                  .then((data) => {
                    if (data.errors.length > 0) {
                      this.$message.error(data.errors[0].msg);
                    } else {
                      const resultData = data.data.data;
                      if (resultData) {
                        resultData.forEach((item) => {
                          item.aae707 = item.aae707 ? this.$host + "api/base/downloadBusinessFile.do?fileId=" + item.aae707 + "&channelCode=xas&sysCode=jyplat" :
                              item.aac004 == "1" ?
                                  this.getRealImgUrl("img/recruitTalents/male.png") :
                                  this.getRealImgUrl("img/recruitTalents/female.png");
                        });
                      }
                      this.talentRecomeList = resultData;
                    }
                  });
            }
          });
    },

    // 简历收藏
    jy201_hrm104(value) {
      const params = {};
      params.aab001 = this.userInfo.aab001;
      params.acb231 = this.userInfo.aab001;
      params.acb232 = this.userInfo.user_id;
      params.acb233 = this.userInfo.aab004;
      params.acb234 = '1';
      params.acb235 = this.acc200;
      params.acb237 = '2';
      params.acc200 = this.acc200;
      if (value) {
        params.acb210 = value;
      }
      if (this.iscollection) {
        params.apiCode = "jy201_hrm105";
        params.method = "jy201_hrm105";
        params.acb230 = this.acb230;
      } else {
        params.apiCode = "jy201_hrm104";
        params.method = "jy201_hrm104";
      }
      this.$http
          .request("/api/business/getData.do", "post", params, true)
          .then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg)
            } else {
              if (this.iscollection) {
                this.$message.success("取消收藏成功");
                this.acb230 = "";
                this.iscollection = false;
                this.refreshInfoCompany();
              } else {
                if (this.iscollection) {
                  this.$message.success("取消收藏成功")
                  this.acb230 = "";
                  this.iscollection = false;
                  this.refreshInfoCompany();
                } else {
                  this.$message.success("收藏成功");
                  this.acb230 = data.data.data.acb230;
                  this.positionList = [];
                  this.showPosition = false;
                  this.iscollection = true;
                  this.refreshInfoCompany();
                }
              }
            }
          });
    },

    // 查询收藏数、投递数（单位）
    refreshInfoCompany() {
      let param = {
        apiCode: "jy201_hrm128",
        method: "jy201_hrm128",
        aab001: this.userInfo.aab001,
      };
      this.$http
          .request("/api/business/getData.do", "post", param, true)
          .then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg);
            } else {
              let res = data.data.data;
              this.userInfo.ab01Vo = res;
              window.localStorage.setItem(
                  "userInfo",
                  JSON.stringify(this.userInfo)
              );
            }
          });
    },

    // 人才处理记录查询
    getRecord(aab001) {
      let paramResume = {
        apiCode: "jy002_base117",
        method: "jy002_base117",
        aab001: aab001,
        aac001: this.aac001,
      };
      this.$http
          .request("/api/business/getData.do", "post", paramResume, true)
          .then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg);
            } else {
              this.timeLine = data.data.data;
            }
          });
    },

    // 关闭
    close() {
      this.isShow = false;
      this.showAllMobile = false;
      // this.showInvitate = false; // 面试邀请
      // this.iscollection = false; // 是否收藏简历
      // this.acb230 = "";
      // // 个人基本信息
      // this.personMesg = {};
      // // 求职意向
      // this.jobIntension = {};
      // // 教育经历
      // this.educationExp = [];
      // // 工作经历
      // this.workExp = [];
      // // 语言能力
      // this.perLanguage = [];
      // // 相似人才
      // this.talentRecomeList = [];
      // this.timeLine = [];

      this.$emit("modalClose", this.isShow);
    },

    // 打开面试邀请
    handleInvitate() {
      this.showInvitate = true;
    },

    confirmOk(e) {
      this.jy201_hrm104();
    },

    // 关闭面试邀请，打开人才详情
    colseInvitate(item) {
      this.getRecord();
      this.showInvitate = item;
    },

    // 调用外部uim
    handleOpenUim() {
      this.$refs.cpUimBox.openUim(this.personMesg);
      this.close();
    },

    // 下载简历附件
    downLoadFile() {
      let paramResume = {
        apiCode: "jy202_hrm121",
        method: "jy202_hrm121",
        aac001: this.aac001,
      };
      this.$http
          .request("/api/business/getData.do", "post", paramResume, true)
          .then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg);
            } else {
              //业务信息成功处理
              if (JSON.stringify(data.data) != "{}") {
                var downData = data.data.data;
              }
              if (!downData || !downData.acc04w) {
                this.$message.warning("暂无附件简历，无法下载！");
                return;
              }
              let a = document.createElement("a");
              a.href = faceConfig.basePath +
                  "api/base/downloadBusinessFile.do?fileId=" +
                  downData.acc04w +
                  "&channelCode=xas&sysCode=jyplat";
              a.click();
            }
          });
    },
    //获取薪资要求
    getSalary(value) {
      if (value) {
        let list = value.split("-");
        if (list.length === 1) {
          return this.getAbbreviatSalary(Number(list[0]));
        } else {
          let low = this.getAbbreviatSalary(Number(list[0]));
          let high = this.getAbbreviatSalary(Number(list[1]));
          return low + "-" + high;
        }
        return "暂无期望薪资";
      } else {
        return "暂无期望薪资";
      }
    },
    //显示职位弹窗
    showPositionModal() {
      if (!this.userInfo) {
        this.$message.error("请先登录用户");
        this.$router.push({
          name: "index"
        });
        return;
      }
      const param = {
        apiCode: "jy201_hrm21",
        method: "jy201_hrm21",
        aab001: this.userInfo.aab001,
        acb330: this.userInfo.acb330
      };
      this.$http
          .request("/api/business/getData.do", "post", param, true)
          .then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg);
            } else {
              if (data.data.list !== null && data.data.list !== undefined) {
                this.positionList = data.data.list;
                this.showPosition = true;
              }
            }
          });
    },

    //添加访问足迹记录
    addCz29Info() {
      // 足迹类型 ACZ01S: 查看简历 2
      this.paramCz29.acz01p = "2"; //	用户主体类型：单位
      this.paramCz29.acz01q = this.userInfo.aab001; //	用户主体主键编号（如aac001）
      this.paramCz29.acz01r = this.userInfo.aab004; //	用户主体名称
      this.paramCz29.acz01u = this.acc200; //	被浏览主体主键编号（如aac001）[简历编号]
      this.paramCz29.acz01v = this.userInfo.aab004; //	用户关联主体名称(例如招聘单位关联招聘HR的称呼)
      this.paramCz29.acz01w = this.userInfo.user_id; //	用户关联主体主键编号(例如招聘单位关联招聘HR的user_id)
      this.paramCz29.acz01x = "简历个人详情业务浏览"; //	被浏览业务描述
      this.$http.request('/api/business/getData.do', 'post', this.paramCz29, true).then((data) => {
        if (data.errors.length > 0) {
          this.$message.error(data.errors[0].msg)
        } else {

        }
      })
    },

    //关闭职位列表
    closePositionModal() {
      this.positionList = [];
      this.showPosition = false;
    },
    // 点击按钮查看完整的联系方式【简历
    seeAllMobile() {
      if (this.showAllMobile) {
        return;
      }
      let param = {
        apiCode: "jy201_hrm430",
        method: "jy201_hrm430",
        user_type: this.userInfo.aab001 ? 1 : 2,
        user_id: this.user_id,
        ace2w1: this.userInfo.aab001,
        ace2w2: "02",
        acc200: this.acc200,
      };
      this.$http
          .request("/api/business/getData.do", "post", param, true)
          .then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg);
            } else {
              this.showAllMobile = true;
            }
          });
    },
    // 查询是否已查看过完整的联系方式【简历
    searchIsSeeAllMobile() {
      let param = {
        apiCode: "jy201_hrm430",
        method: "jy201_hrm430",
        user_type: this.userInfo.aab001 ? 1 : 2,
        user_id: this.user_id,
        ace2w1: this.userInfo.aab001,
        ace2w2: "02",
        onlyBrowse: 1,
      };
      this.$http
          .request("/api/business/getData.do", "post", param, true)
          .then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg);
            } else {
              let result = data.data.list;
              result.forEach((item) => {
                if (item.ace2w3 == this.acc200) {
                  this.showAllMobile = true;
                }
              });
            }
          });
    },
  },
};
</script>

<style scoped>
@import "../../common/css/reset.css";
</style>

<style lang="less" scoped>
@import "../../common/css/common.less";
@import "../css/recruitTalents.less";

.talentDetails {
  > .popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
  }

  .detailBox {
    // width: 1200px;
    // height: 1052px;
    width: 1100px;
    height: 90%;
    background: #f6f8fd;
    border-radius: 4px 4px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // margin-top: -482px;
    // margin-left: -550px;
    min-height: 650px;

    > .title {
      width: 100%;
      height: 66px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px 0 28px;
      box-sizing: border-box;

      > span {
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #333333;
      }

      > img {
        cursor: pointer;
      }
    }

    > div:nth-of-type(2) {
      width: 100%;
      height: calc(100% - 66px);
      padding: 19px;
      box-sizing: border-box;
    }

    > .details_mesg {
      display: flex;

      // justify-content: space-between;
      > .left {
        // width: 100%;
        width: 67%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        > .l_top {
          width: 100%;
          height: 222px;
          margin-bottom: 12px;
          background-color: #fff;
          padding: 24px 30px 32px 30px;
          box-sizing: border-box;
          font-family: Source Han Sans CN;
          font-weight: 500;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;

          > .personalMesg {
            display: flex;

            .no-from-uim-collection {
              position: absolute;
              top: 0px;
              right: 12px;

              .rightCancel {
                > span {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  cursor: pointer;

                  > span {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #666666;
                  }
                }
              }
            }

            > img {
              width: 101px;
              height: 101px;
              margin-right: 36px;
            }

            > div {
              height: 101px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;

              > .name {
                display: flex;
                align-items: center;

                > span:nth-of-type(1) {
                  font-size: 24px;
                  font-weight: bold;
                  color: #333333;
                  margin-right: 7px;
                }

                > span:nth-of-type(2) {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 30px;
                  border: 1px solid #c8f0d9;
                  border-radius: 2px;
                  font-size: 14px;
                  color: #2eca79;
                  cursor: pointer;
                  padding: 0 6px;
                }
              }

              > .baseInfo {
                font-size: 14px;
                color: #333333;
                display: flex;
                flex-wrap: wrap;

                > span {
                  display: flex;
                  border-right: 1px solid #eeeeee;
                  margin-bottom: 8px;
                }

                > span:last-child {
                  border: 0;
                }

                > span:nth-of-type(1) {
                  padding-right: 8px;
                }

                > span:not(:first-of-type) {
                  padding: 0 8px;
                }

                > span:nth-of-type(6) {
                  padding-left: 8px;
                  padding-right: 0px;
                  border: 0px solid #000;
                }

                > span:nth-of-type(7) {
                  padding: 0px;
                  border: 0px solid #000;
                }
              }
            }
          }

          > .tags {
            width: 100%;
            height: 51px;
            display: flex;
            justify-content: space-between;

            > div {
              width: 282px;
              height: 100%;
              position: relative;

              > .triangle {
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 6px solid #ecf2ff;
                margin-left: 15%;
              }

              > div:nth-of-type(2) {
                width: 100%;
                height: calc(100% - 6px);
                background: #ecf2ff;
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;

                > span {
                  font-size: 16px;
                  color: #333333;
                  margin-left: 8px;
                }
              }
            }

            > ul {
              height: 100%;
              display: flex;
              align-items: center;

              > li {
                display: flex;
                height: 55px;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;

                img {
                  width: 26px;
                  height: 26px;
                }

                span {
                  font-size: 14px;
                  color: #666666;
                }
              }

              > li:not(:last-of-type) {
                margin-right: 24px;
              }

              .rightCancel {
                > span {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  cursor: pointer;

                  > span {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #666666;
                  }
                }
              }

              > li:hover {
                > span {
                  color: #007dee;
                  font-weight: bold;
                }
              }

              .rightCancel:hover {
                > span > span {
                  color: #007dee;
                  font-weight: bold;
                }
              }
            }
          }
        }

        > .l_bottom {
          width: 91%;
          height: 620px;
          background-color: #fff;
          padding: 12px 30px 20px 30px;
          font-size: 14px;
          font-family: Source Han Sans CN;
          color: #666666;
          flex: 1;
          // display: flex;
          // flex-direction: column;
          // justify-content: space-between;
          overflow-y: scroll;

          > div {
            > .ta_title {
              line-height: 42px;
            }
          }

          > div:nth-of-type(1) {
            > .jobIntension {
              > div:nth-of-type(1) {
                font-weight: bold;

                > span:nth-of-type(1) {
                  color: #333333;
                  margin-right: 18px;
                }

                > span:nth-of-type(2) {
                  color: #ff4545;
                }
              }

              > div:nth-of-type(2) {
                line-height: 42px;

                > span:not(:last-of-type) {
                  margin-right: 15px;
                }
              }
            }
          }

          > div:nth-of-type(2) {
            > .educationExp {
              /deep/ .ant-timeline {
                > .ant-timeline-item {
                  padding: 0 0 14px 0 !important;

                  > .ant-timeline-item-content {
                    > div:nth-of-type(1) {
                      font-weight: bold;
                      color: #333333;

                      > span:nth-of-type(1) {
                        margin-right: 19px;
                      }
                    }

                    > div:nth-of-type(2) {
                      color: #666666;
                      line-height: 24px;

                      > span:not(:last-of-type) {
                        margin-right: 15px;
                      }
                    }
                  }
                }

                > .ant-timeline-item:nth-last-of-type(1) {
                  padding: 0 !important;
                }
              }
            }
          }

          > div:nth-of-type(3) {
            > .workExp {
              /deep/ .ant-timeline {
                > .ant-timeline-item {
                  padding: 0 0 14px 0 !important;

                  > .ant-timeline-item-content {
                    > div:nth-of-type(1) {
                      font-weight: bold;
                      color: #333333;

                      > span:nth-of-type(1) {
                        margin-right: 19px;
                      }
                    }

                    > div:nth-of-type(2) {
                      color: #666666;
                      line-height: 26px;

                      > span:not(:last-of-type) {
                        margin-right: 20px;
                      }
                    }

                    > div:nth-of-type(3) {
                      font-size: 14px;
                      font-weight: 400;
                      color: #666666;
                      line-height: 24px;
                    }
                  }
                }

                > .ant-timeline-item:nth-last-of-type(1) {
                  padding: 0 !important;
                }
              }
            }
          }

          > div:nth-of-type(4) {
            > .languangeList {
              /deep/ .ant-timeline {
                > .ant-timeline-item {
                  padding: 0 0 14px 0 !important;

                  > .ant-timeline-item-content {
                    > div:nth-of-type(1) {
                      font-weight: bold;
                      color: #333333;
                    }

                    > span {
                      color: #666666;
                      margin-right: 19px;
                    }
                  }
                }

                > .ant-timeline-item:nth-last-of-type(1) {
                  padding: 0 !important;
                }
              }
            }
          }

          > div:nth-of-type(5) {
            > div:nth-of-type(2) {
              line-height: 24px;
            }
          }
        }

        > .l_bottom::-webkit-scrollbar {
          display: none;
          /* Chrome Safari */
        }
      }

      .left-active {
        width: 100%;
      }

      > .right {
        width: 354px;
        height: 100%;
        margin-left: 18px;

        > .r_top {
          width: 100%;
          height: 295px;
          background-color: #fff;
          padding: 10px;
          box-sizing: border-box;
          font-family: Source Han Sans CN;
          font-weight: 400;

          .noData {
            overflow: hidden !important;
          }

          > div:nth-of-type(1) {
            border-bottom: 1px solid #eeeeee;

            > .twoBtn {
              margin: 20px 0;

              > div {
                display: flex;
                justify-content: space-between;

                > button {
                  width: 148px;
                  height: 38px;
                  border-radius: 4px;
                  font-size: 16px;
                  border: 0px solid #000;
                }

                > button:nth-of-type(1) {
                  background-color: #007dee;
                  color: #fff;
                  margin-right: 14px;
                }

                > button:nth-of-type(2) {
                  background-color: #e1eefe;
                  color: #007dee;
                }
              }
            }

            > ul {
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-bottom: 20px;

              > li {
                display: flex;
                height: 55px;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;

                img {
                  width: 26px;
                  height: 26px;
                }

                span {
                  font-size: 14px;
                  color: #666666;
                }
              }

              .rightCancel {
                > span {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  cursor: pointer;

                  > span {
                    margin-top: 12px;
                    font-size: 14px;
                    color: #666666;
                  }
                }
              }

              > li:hover {
                > span {
                  color: #007dee;
                  font-weight: bold;
                }
              }

              .rightCancel:hover {
                > span > span {
                  color: #007dee;
                  font-weight: bold;
                }
              }
            }
          }

          > div:nth-of-type(2) {
            // height: calc(100% - 170px);
            height: calc(100% - 160px);

            > .ta_title {
              height: 60px;
              display: flex;
              align-items: center;

              > span {
                font-weight: 400;
                color: #999999;
                margin-left: 15px;
              }
            }

            > div:nth-of-type(2) {
              // height: calc(100% - 60px);
              height: 100%;
              padding-top: 2px;
              overflow-y: scroll;

              /deep/ .ant-timeline {
                > .ant-timeline-item {
                  padding: 0 0 12px 0 !important;

                  > .ant-timeline-item-content {
                    > div:nth-of-type(1) {
                      font-size: 14px;
                      color: #666666;
                      margin-bottom: 8px;
                    }

                    > div:nth-of-type(2) {
                      display: flex;
                      flex-direction: column;

                      > span:nth-of-type(1) {
                        font-size: 14px;
                        font-weight: bold;
                        color: #333333;
                        margin-bottom: 6px;
                      }

                      > span:nth-of-type(2) {
                        font-size: 14px;
                        color: #666666;
                      }
                    }
                  }
                }
              }
            }

            > div:nth-of-type(2)::-webkit-scrollbar {
              display: none;
              /* Chrome Safari */
            }
          }
        }

        .r_bottom {
          width: 100%;
          height: calc(100% - 295px);

          > .ta_title {
            height: 40px;
            display: flex;
            align-items: center;
          }

          > div:nth-of-type(2) {
            height: calc(100% - 40px);
            display: flex;
            flex-direction: column;
            // justify-content: space-between;
            overflow-y: scroll;
          }

          ::-webkit-scrollbar {
            display: none;
            /* Chrome Safari */
          }

          /deep/ .tRecom {
            width: 100%;
            height: 116px;
            // padding-bottom: 10px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}

.ta_title {
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #333333;
  // line-height: 42px;
}

.position-list {
  // height: 200px;
  // overflow-y: scroll;
  font-size: 16px;

  > div {
    // width: 200px;
    border-bottom: 1px gray dotted;
    text-align: center;
    padding: 5px;
    cursor: pointer;

    &:hover {
      background: #007dee;
      color: #fff;
    }
  }
}

/deep/ .invitateInterview {
  padding: 20px !important;
}
</style>
