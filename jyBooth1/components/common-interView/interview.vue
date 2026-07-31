<template>
  <view id="interview" v-show="isShow">
    <view>
      <view class="header">
        <view>
          <image src="../../static/images/work.png"></image>
          <view
            >面试邀请:<span>{{ name }}</span></view
          >
        </view>
        <image src="../../static/images/close.png" @click="closeView"></image>
      </view>
      <view>
        <view class="navTop">
          <image :src="imageUrl"></image>
          <view>
            <view>{{ userInfo.user }}</view>
            <view>
              <view>身份证号码:{{ IdCard }}</view>
              <view>{{ sex }}</view>
              <view>{{ xueli }}</view>
              <view>{{ zhuanye }}</view>
              <view>户籍地:{{ huji }}</view>
              <view>居住地:{{ juzhu }}</view>
            </view>
            <view>
              <view
                >电子邮箱:<span>{{ email }}</span></view
              >
              <view
                >联系电话:<span>{{ phone }}</span></view
              >
            </view>
          </view>
        </view>
        <view class="content">
          <view class="select-box">
            <view>
              <view>面试方式:</view>
              <view
                ><uni-data-select
                  placeholder="请选择您的面试方式"
                  :value="value"
                  :localdata="options"
                  @change="change"
                ></uni-data-select
              ></view>
            </view>
            <view>
              <view>职位选择:</view>
              <view
                ><uni-data-select
                  v-if="show"
                  placeholder="请选择您的面试职位信息"
                  :value="value1"
                  :localdata="options1"
                  @change="change1"
                ></uni-data-select
              ></view>
            </view>
          </view>
          <view class="select-box">
            <view>
              <view>面试时间:</view>
              <view>
                <uni-datetime-picker
                  placeholder="请选择您的面试时间"
                  type="date"
                  :value="single"
                  @change="change2"
                ></uni-datetime-picker>
              </view>
            </view>
            <view>
              <view>面试联系人:</view>
              <view>
                <uni-easyinput v-model="value2" placeholder="请输入您的姓名"></uni-easyinput>
              </view>
            </view>
          </view>
          <view class="select-box1">
            <view>联系电话:</view>
            <view>
              <uni-easyinput v-model="value3" placeholder="请输入您的联系电话"></uni-easyinput>
            </view>
          </view>
          <view class="select-box2">
            <view>面试地点:</view>
            <view>
              <uni-easyinput v-model="value4" placeholder="请输入您的面试地点"></uni-easyinput>
            </view>
          </view>
        </view>
        <view class="btn-back" @click="interViewOk">确认邀请</view>
      </view>
    </view>
  </view>
</template>

<script>
import epselect from '../ep-select/ep-select.vue'
export default {
  name: 'interview',
  components: {
    epselect,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    isInit: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      default: function () {
        return {
          name: '成都·中级软件开发工程师',
          xinzi: '6-12k',
          user: '熊茂森',
          age: '21',
          work: '1年以内',
          xue: '本科',
          statu: '离职-随时到岗',
          fen: '50',
          statu1: 1,
          you: '工作勤奋,认真负责,能 吃苦耐劳性格热情开朗,待人友好,为 人诚实…',
          url: require('../../static/images/headIcon1.png'),
        }
      },
    },
  },
  watch: {
    userInfo: {
      handler(newVal) {
        this.params.aac001 = newVal.aac001
        this.$http.request('/api/business/getData.do', 'post', this.params, true).then((res) => {
          if (res.errors.length > 0) {
            uni.showToast({
              title: res.errors[0].msg,
              duration: 2000,
              icon: 'none',
            })
          } else {
            const personUser = res.data.data
            //console.log(personUser);
            this.sex = personUser.aac004_dsc // 性别
            this.name = newVal.aca112 // 职位名称
            if (personUser.aae707) {
              this.imageUrl = this.utils.getFileLoadUrl(personUser.aae707)
              // this.imageUrl = this.$host+'/api/base/downloadBusinessFile.do?fileId='+personUser.aae707+"&channelCode=sc&sysCode=jyplat"
            } // 头像
            this.IdCard = personUser.aac002 // 身份证号
            this.xueli = personUser.aac011_dsc ? personUser.aac011_dsc : '学历未知' // 学历
            this.zhuanye = personUser.acc01g_dsc ? personUser.acc01g_dsc : '专业未知' // 专业
            this.phone = personUser.aae005 ? personUser.aae005 : '未知号码'
            this.huji = personUser.aae901 ? personUser.aae901 : '未知'
            this.juzhu = personUser.aae006 ? personUser.aae006 : '未知'
            this.email = personUser.aae015
          }
        })
      },
    },
    isShow(val) {
      if (val) {
        const params = {
          apiCode: 'jy201_hrm225',
          method: 'jy201_hrm225',
          aab001: '',
          acb330: '',
        }
        const loginInfo = this.$loginConfig.getLoginInfo()
        params.aab001 = loginInfo.aab001
        params.acb330 = loginInfo.acb330
        this.$http.request('/api/business/getData.do', 'post', params, true).then((res) => {
          const options = res.data.data
          if (options && options.length > 0) {
            const List = options.map((item) => {
              const { acb210, acb213 } = item
              let obj = { value: acb210, text: acb213 }
              return obj
            })
            this.options1 = List
            this.show = true
          } else {
            uni.showToast({
              title: '未查询到职位信息',
              duration: 2000,
              icon: 'none',
            })
          }
        })
      }
    },
  },
  data() {
    return {
      params: {
        apiCode: 'jy201_hrm221',
        method: 'jy201_hrm221',
        aac001: '',
      },
      show: false,
      name: '成都·中级软件开发工程师',
      imageUrl: require('../../static/images/headIcon1.png'),
      sex: '男',
      IdCard: '510107198506020031',
      xueli: '大学本科',
      zhuanye: '计算机专业',
      huji: '四川省成都市',
      juzhu: '成都市锦江区三色路163号',
      email: '1359829938@qq.com',
      phone: '188782962738',
      options: [
        { value: 1, text: '现场面试' },
        { value: 2, text: '视频面试' },
      ],
      value: 0,
      options1: [],
      value1: 0,
      value2: '',
      value3: '',
      value4: '',
      single: '',
    }
  },
  methods: {
    closeView() {
      this.$emit('closeView', false)
    },
    change(e) {
      this.value = e
    },
    change1(e) {
      this.value1 = e
      //console.log(e);
    },
    change2(e) {
      this.single = e
      // //console.log(e);
    },
    interViewOk() {
      const loginInfo = this.$loginConfig.getLoginInfo()
      const params = {
        apiCode: 'jy201_hrm207',
        method: 'jy201_hrm207',
        acc311: 0, // 邀请类别 企业0 机构1
        aab001: '', // 单位机构编号
        aab004: '', // 单位机构名称
        acc200: '', // 简历编号
        acb226: 0, // 是否已投递职位 1是0否
        acc04v: 1, // 是否招聘会邀请
        acb330: loginInfo.acb330, // 招聘会编号
        yae100: 19, // 数据来源
        aac001: '', // 个人编号
        acb222: this.single, // 面试时间
        acc315: this.value, // 面试方式
        acb210: this.value1, //岗位编号
        acb224: this.value2, //面试联系人
        acb225: this.value3, // 联系电话
        acb223: this.value4, // 面试地点
      }
      params.aac001 = this.userInfo.aac001
      params.aab001 = loginInfo.aab001
      params.aab004 = loginInfo.aab004
      params.acc200 = this.userInfo.acc200
      this.$http.request('/api/business/getData.do', 'post', params, true).then((res) => {
        if (res.errors.length > 0) {
          uni.showToast({
            title: res.errors[0].msg,
            duration: 2000,
            icon: 'none',
          })
        } else {
          const objInfo = res.data.data
          if (objInfo) {
            uni.showToast({
              title: '邀请成功',
              duration: 2000,
              icon: 'none',
            })
            this.closeView()
          } else {
            uni.showToast({
              title: '邀请失败，请稍后重试',
              duration: 2000,
              icon: 'none',
            })
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#interview {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  > view {
    width: 1265px;
    height: 700px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    > view:last-child {
      padding: 32px 24px 0px 24px;
    }
  }
}
.header {
  height: 68px;
  background: #0682fe;
  border-radius: 8px 8px 0px 0px;
  padding: 0px 24px 0px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > image {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  > view {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    color: #ffffff;
    > image {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }
  }
}
.navTop {
  display: flex;
  align-items: center;
  > image {
    width: 88px;
    height: 88px;
  }
  > view {
    margin-left: 25px;
    > view:first-child {
      font-size: 24px;
      font-weight: bold;
      color: #333333;
    }
    > view:nth-child(2),
    > view:last-child {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 400;
      color: #666666;
      margin-top: 10px;
      > view {
        border-right: 1px solid #666666;
        padding: 0px 12px 0px 12px;
      }
      > view:first-child {
        padding-left: 0px;
      }
      > view:last-child {
        padding-right: 0px;
        border-right: none;
      }
    }
  }
}
.select-box {
  display: flex;
  align-items: center;
  > view {
    width: 50%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > view:first-child {
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      width: 20%;
    }
    > view:last-child {
      width: 70%;
      flex: 0.9;
    }
  }
}
.select-box1 {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  > view:first-child {
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    width: 10%;
  }
  > view:last-child {
    width: 36%;
  }
}
.select-box2 {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  > view:first-child {
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    width: 10%;
  }
  > view:last-child {
    width: 86%;
  }
}
.content {
  margin-top: 100px;
}
.btn-back {
  width: 200px;
  height: 42px;
  background: linear-gradient(180deg, #098fff 0%, #0064ff 100%);
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  line-height: 42px;
  cursor: pointer;
  margin: 75px auto 0px auto;
}
</style>
