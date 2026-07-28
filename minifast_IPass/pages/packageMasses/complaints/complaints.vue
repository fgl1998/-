<template>
  <div class="complaints h5-page">
    <div class="top">
      <div class="top-bg">
        <ComponentImg :path="images.header" width="750rpx" height="286rpx"></ComponentImg>
      </div>
      <div class="top-con">
        <div class="PangMenZhengDao">共同维护</div>
        <div class="PangMenZhengDao">良好网络环境</div>
      </div>
    </div>
    <div class="content">
      <div class="tip-wrapper" v-if="!isAgree">
        <ComponentPanel
          title="投诉须知"
          :buttonText="showComplaintBtn ? '查看投诉处理流程' : ''"
          @click="handleShowComplaintImage">
          <div class="panel-content">
            <div class="content-text">
              <div>
                1、为了你反映的问题能够得到及时有效处理，请你填写个人真实信息，如实反映有关情况，并对其真实性负责。我们将严格控制个人信息知悉范围。如你在有关选项中选择保密个人信息，你的联系方式将不会转给有关方面，这可能会影响你反映问题的解决效果。
              </div>
              <div>2、留言时请严格遵守《中华人民共和国宪法》等法律法规。</div>
              <div>
                3、为防止重复办理、减轻基层负担，请不要就同一事项反复留言。如你近期已向政府其他平台或渠道反映有关问题，且相关单位已经受理，希望你在办理结果出来之前暂不通过本平台重复反映。
              </div>
              <div>
                4、我们将对大家反映的问题线索和意见建议进行汇总整理，督促有关地方、部门处理，但无法保证对所有留言一一作出答复，请予谅解。
              </div>
              <div>
                5、本平台有可能将你反映的问题线索和意见建议及处理情况以适当方式向社会公开。如果你不希望公开，请在有关选项中作出声明，我们将充分尊重你的意愿。
              </div>
            </div>
            <div class="button-wrapper">
              <ComponentButton type="secondary" name="去举报" @click="isAgree = true"></ComponentButton>
            </div>
          </div>
        </ComponentPanel>
      </div>
      <div class="form" v-else>
        <div class="voice" @click="jumpToComplainsVoice" v-if="isOpenVoiceComplaints">
          <img src="./images/voice.png" alt="" class="v-img" />
        </div>
        <div class="respondent-wrapper">
          <ComponentPanel title="被投诉对象">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">被举报对象姓名</div>
                <div class="input">
                  <input type="text" disabled v-model="subsidyInfo.aac003" placeholder="请输入投诉对象的姓名" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">被举报对象身份证号</div>
                <div class="input">
                  <input
                    type="idcard"
                    disabled
                    :value="subsidyInfo.aac002 | TMIdcard"
                    maxlength="18"
                    placeholder="请输入被举报对象身份证号" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">被举报补贴项目</div>
                <div class="input">
                  <input type="text" v-model="subsidyInfo.chi031_desc" disabled placeholder="请输入被举报补贴项目" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">被举报发放期号</div>
                <div class="input">
                  <input type="text" v-model="subsidyInfo.aae209" disabled placeholder="请输入被举报发放期号" />
                </div>
              </div>
              <div class="input-wrapper required disabled">
                <div class="label">被举报发放金额(元)</div>
                <div class="input">
                  <input type="number" v-model="subsidyInfo.aae019" disabled placeholder="请输入被举报发放金额" />
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="complainants-info-wrapper">
          <ComponentPanel title="投诉人信息">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">姓名</div>
                <div class="input">
                  <input type="text" disabled v-model="formData.aac003" placeholder="请输入您的姓名" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">身份证号</div>
                <div class="input">
                  <input
                    type="idcard"
                    v-model="formData.aac002"
                    disabled
                    maxlength="18"
                    placeholder="请输入您的身份证号" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">手机号码</div>
                <div class="input">
                  <input type="number" v-model="formData.aac005" maxlength="11" placeholder="请输入你的手机号码" />
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="complainant-info-wrapper">
          <ComponentPanel title="投诉信息">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">投诉类型</div>
                <div class="input">
                  <picker
                    class="picker"
                    :range="complaintTypesRange"
                    range-key="aaa103"
                    mode="selector"
                    :value="pickerValue"
                    @change="handleChangePicker">
                    <div class="picker-content">
                      <div class="picker-value" v-if="formData.chb091">
                        {{ formData.chb091_desc }}
                      </div>
                      <div class="picker-placeholder" v-else>请选择投诉类型</div>
                      <div class="iconimg"></div>
                    </div>
                  </picker>
                </div>
              </div>
              <div class="input-wrapper required disabled">
                <div class="label">投诉标题</div>
                <div class="input">
                  <input type="text" v-model="formData.chb092" disabled placeholder="请输入投诉标题" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">投诉详细内容</div>
                <div class="input">
                  <textarea v-model="formData.chb093" placeholder="请输入投诉详细内容"></textarea>
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="file-wrapper">
          <ComponentPanel title="补充材料上传">
            <div class="panel-content">
              <ComponentUploadImages
                :uploadNum="10"
                :isUploadServer="isRequestFF ? false : true"
                @change="handleChangeUploadImages"></ComponentUploadImages>
            </div>
          </ComponentPanel>
        </div>
        <div class="open-will" v-if="areaCode !== '511000'">
          <ComponentPanel title="您是否愿意向社会公开您的投诉信息">
            <div class="panel-content">
              <div class="describe">
                本平台有可能将你反映的问题线索和意见建议及处理情 况以适当方式向社会公开。如果你不希望公开,我们将
                充分尊重你的意愿。<span class="must">(必选项)</span>
              </div>
              <radio-group @change="radioChange" class="radio-g d-f jc-sa ai-c">
                <label><radio class="radio-style" color="#3882ff" value="willing" />愿意公开</label>
                <label><radio class="radio-style" color="#3882ff" value="unwilling" />不愿意公开</label>
              </radio-group>
            </div>
          </ComponentPanel>
        </div>
        <div class="button-wrapper">
          <ComponentButton
            type="primary"
            :disabled="submitBtnDisabled"
            name="立即投诉"
            @click="handleClickComplaint"></ComponentButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import imageHeader from './images/header.png'

  import ComponentImg from '@/components/common/ez-img/ez-img.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentUploadImages from '@/components/common/ez-upload-images/ez-upload-images.vue'

  import { mapGetters } from 'vuex'

  import config from '@/config'
  import { navigateBack, showModal, navigateTo } from '@/utils/uni-api'
  import { requestFFGetBhi031ByChi031, requestFFSaveHb58, requestSPSaveHb58 } from '@/service/api'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { useGetUserInfoH5 } from '@/mixins'
  import { USER_INFO } from '@/store/constants' // 常量

  export default {
    name: 'pageComplaints',
    mixins: [useGetUserInfoH5],
    data() {
      return {
        // 本地图片
        images: {
          header: {
            src: '', // 本地图片
            httpSrc: imageHeader // 网络图片
          }
        },
        isAgree: false, // 是否同意协议

        subsidyInfo: {}, // 补贴项目信息

        // 填报的数据
        formData: {
          aac003: '', // 投诉人姓名
          aac002: '', // 投诉人身份证号
          aac005: '', // 投诉人电话
          // aae006: '', // 投诉人地址
          chb091: '', // 投诉类型
          chb092: '', // 投诉的标题
          chb093: '', // 投诉内容
          // aae013: '', // 备注
          aab301: '', // 区县
          imgList: '[]' // 补充资料
        },

        // 投诉类型 渲染数据
        complaintTypesRange: [],

        submitBtnDisabled: false, // 投诉按钮是否可用
        pickerValue: '0', // 投诉类型 选中序号
        bhi031: '',
        isOpenVoiceComplaints: false, // 是否开启语音投诉
        isRequestFF: false, // 图片上传是否保存为base64
        radioValue: '', // 意愿选中值
        areaCode: config.areaCode
      }
    },
    components: {
      ComponentButton,
      ComponentImg,
      ComponentPanel,
      ComponentUploadImages
    },
    onLoad(e) {
      this.isOpenVoiceComplaints = config.isOpenVoiceComplaints
      const { type, chi031 } = e
      this.subsidyInfo = { ...e }

      if (type === 'ygff' && config.isOpenYGFF) {
        this.isRequestFF = true
        this.requestGetBhi031ByChi031(chi031)
      }

      getCodeListByCodeName('chb091').then((res) => {
        this.complaintTypesRange = [...res]
      })
    },
    onShow() {
      this.initFormData()
    },
    onUnload() {},
    created() {},
    mounted() {},
    methods: {
      // 查看投诉处理流程
      handleShowComplaintImage() {
        navigateTo('complaint-process', 'packageCommon')
      },
      jumpToComplainsVoice() {
        navigateTo('complaints-voice', 'packageMasses', {
          ...this.subsidyInfo,
          bhi031: this.bhi031,
          isCarrier: true
        })
      },
      // 初始化投诉人信息
      initFormData() {
        const { idCard, userName, tel } = this.userInfo
        this.formData = {
          ...this.formData,
          aac003: userName,
          aac002: idCard,
          aac005: tel
        }
      },
      // 图片上传改变
      handleChangeUploadImages(files) {
        const type = this.type
        const imgList = []
        if (files && files.length > 0) {
          files.map((item) => {
            if (this.isRequestFF) {
              const obj = {
                chb221: item.fileName,
                chb22c: item.base64,
                chb22d: '1'
              }
              imgList.push(obj)
            } else {
              const obj = {
                chi212: item.fileName,
                che092: item.id,
                chi214: item.suffix,
                chi215: item.id
              }
              imgList.push(obj)
            }
          })
        }
        this.formData = {
          ...this.formData,
          imgList: JSON.stringify(imgList)
        }
      },
      // picker change
      handleChangePicker(e) {
        const { value } = e.target
        const item = this.complaintTypesRange[value]
        this.pickerValue = value + ''
        this.formData = {
          ...this.formData,
          chb091: item.aaa102,
          chb091_desc: item.aaa103
        }
      },
      // 检测输入
      checkInput() {
        const { chb091, chb093, aac005 } = this.formData
        if (!aac005) {
          showModal('请选择投诉人的手机号码')
          return false
        }
        if (!chb091) {
          showModal('请选择投诉类型')
          return false
        }
        if (!chb093) {
          showModal('请输入投诉内容')
          return false
        }
        if (!this.radioValue && this.areaCode !== '511000') {
          showModal('请选择是否愿意向社会公开您的投诉信息')
          return false
        }
        return true
      },
      // 阳光发放投诉 转化编码
      requestGetBhi031ByChi031(chi031) {
        requestFFGetBhi031ByChi031(chi031)
          .then((res) => {
            const { fieldData } = res
            if (fieldData) {
              const { bhi031 } = fieldData
              this.bhi031 = bhi031
            }
          })
          .finally(() => {})
      },
      // 请求 投诉
      requestComplaint() {
        const result = this.checkInput()
        if (!result) {
          return
        }
        showModal('是否确认提交投诉', '提示', true)
          .then(() => {
            const { areaCode } = config
            const formData = { ...this.formData }
            const {
              chb010,
              type,
              chb000,
              chb570,
              chb015,
              chb015Desc,
              chb017,
              chb017Desc,
              chb018,
              chb018Desc,
              cpb100,
              chi031,
              chi037,
              chi031_desc,
              chi032,
              aac002,
              aac002_old,
              aac003,
              aab301,
              orgnamepath
            } = this.subsidyInfo

            const { aac021 } = this.userInfo

            let newOrgnamepath = ''

            switch (areaCode) {
              // 成都
              case '510100':
                newOrgnamepath = '四川省/成都市/'
                break
              // 自贡
              case '510300':
                newOrgnamepath = '四川省/自贡市/'
                break
              // 攀枝花
              case '510400':
                newOrgnamepath = '四川省/攀枝花市/'
                break
              // 泸州
              case '510500':
                newOrgnamepath = '四川省/泸州市/'
                break
              // 德阳
              case '510600':
                newOrgnamepath = '四川省/德阳市/'
                break
              // 绵阳
              case '510700':
                newOrgnamepath = '四川省/绵阳市/'
                break
              // 广元
              case '510800':
                newOrgnamepath = '四川省/广元市/'
                break
              // 遂宁
              case '510900':
                newOrgnamepath = '四川省/遂宁市/'
                break
              // 内江
              case '511000':
                newOrgnamepath = '四川省/内江市/'
                break
              // 乐山
              case '511100':
                newOrgnamepath = '四川省/乐山市/'
                break
              // 南充
              case '511300':
                newOrgnamepath = '四川省/南充市/'
                break
              // 眉山
              case '511400':
                newOrgnamepath = '四川省/眉山市/'
                break
              // 宜宾
              case '511500':
                newOrgnamepath = '四川省/宜宾市/'
                break
              // 广安
              case '511600':
                newOrgnamepath = '四川省/广安市/'
                break
              // 达州
              case '511700':
                newOrgnamepath = '四川省/达州市/'
                break
              // 雅安
              case '511800':
                newOrgnamepath = '四川省/雅安市/'
                break
              // 巴中
              case '511900':
                newOrgnamepath = '四川省/巴中市/'
                break
              // 资阳
              case '512000':
                newOrgnamepath = '四川省/资阳市/'
                break
              // 阿坝藏族羌族自治州
              case '513200':
                newOrgnamepath = '四川省/阿坝藏族羌族自治州/'
                break
              // 甘孜藏族自治州
              case '513300':
                newOrgnamepath = '四川省/甘孜藏族自治州/'
                break
              // 凉山彝族自治州
              case '513400':
                newOrgnamepath = '四川省/凉山彝族自治州/'
                break
              default:
                showModal('该地市还未整合' + ' orgnamepath ' + '，请联系管理员！')
                break
            }

            // 请求参数
            let data = {
              chb581: formData.aac003, // 举报人名字
              chb582: formData.aac002, // 举报人身份证号
              chb583: formData.aac005, // 举报人联系方式
              chb584: formData.chb093, // 举报内容
              chb093: formData.chb093, // 举报内容
              chb091: formData.chb091, // 投诉主题
              chb015,
              chb017,
              chb018,
              chi031,
              chi037,
              aac002: config.areaCode === '511700' ? aac002_old : aac002,
              aac003,
              aab301,
              chi032: chi032 || chi031_desc,
              chb092: formData.chb092,
              chb58f: '1', // 举报渠道（1 微信 2 网厅 3 其他）
              chb58e: '2',
              chb09t: '1', //1：文字投诉 2：语音投诉
              imgList: formData.imgList
            }

            if (type === 'ygff') {
              // 从阳光发放进入的投诉getPolicyFileList
              data = {
                ...data,
                aab301: aab301 || areaCode,
                chb010, // 业务受理号
                chb589: formData.chb092,
                chi031: this.bhi031,
                orgnamepath: newOrgnamepath + aac021.split('-').join('/'),
                chb58e: '2', // 举报类型 1 公示投诉 2 补贴发放投诉
                chb58f: '4'
              }
              if (areaCode === '511100') {
                data = {
                  ...data,
                  chb51c: '2'
                }
              }
            } else {
              // 从阳光公示进入的投诉
              data = {
                ...data,
                chb000,
                chb570,
                cpb100,
                chb58e: '1' // 举报类型（1.公示投诉，2.补贴发放投诉）
              }
            }

            this.submitBtnDisabled = true
            requestSPSaveHb58(data)
              .then(() => {
                showModal('投诉提交成功').then((res) => {
                  navigateBack(1)
                })
              })
              .finally(() => {
                this.submitBtnDisabled = false
              })
          })
          .catch(() => {})
      },
      // 请求 投诉
      requestComplaintNeijiang() {
        const result = this.checkInput()
        if (!result) {
          return
        }
        showModal('是否确认提交投诉', '提示', true)
          .then(() => {
            this.submitBtnDisabled = true

            const formData = { ...this.formData }
            const { chb010 } = this.subsidyInfo

            const { aac021 } = this.userInfo

            // 请求参数
            let data = {
              chb09t: '1', //1：文字投诉 2：语音投诉
              chb581: formData.aac003, // 举报人名字
              chb582: formData.aac002, // 举报人身份证号
              chb583: formData.aac005, // 举报人联系方式
              chb58e: aac021, // 投诉人联系地址 暂为空
              chb010, // 业务受理号
              chb091: formData.chb091, // 投诉主题
              chb584: formData.chb093, // 举报内容
              imgList: formData.imgList
            }
            requestFFSaveHb58(data)
              .then(() => {
                showModal('投诉提交成功').then(() => {
                  navigateBack(1)
                })
              })
              .finally(() => {
                this.submitBtnDisabled = false
              })
          })
          .catch(() => {})
      },
      // 点击立即投诉按钮 回调
      handleClickComplaint() {
        const { areaCode } = config
        const { type } = this.subsidyInfo
        // 兼容内江监督小程序 发放投诉
        if ((areaCode === '511600' || areaCode === '511000') && type === 'ygff') {
          this.requestComplaintNeijiang()
        } else {
          this.requestComplaint()
        }
      },
      // radio改变回调
      radioChange(e) {
        const { value } = e.detail
        this.radioValue = value
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),
      showComplaintBtn() {
        let { areaCode } = config
        if (areaCode == '511000' || areaCode == '511600') {
          return true
        }
        return false
      }
    },
    watch: {
      'formData.chb091': {
        handler(val) {
          if (val) {
            let { aac003, chi032, chi031_desc } = this.subsidyInfo
            const { chb091_desc } = this.formData
            chi032 = chi032 || chi031_desc
            let str = `${aac003}的${chi032}存在${chb091_desc}的问题`
            this.formData = {
              ...this.formData,
              chb092: str
            }
          }
        },
        immediate: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .complaints {
    padding-bottom: $spacing;
    .top {
      position: relative;
      background-color: $primary;
      .top-bg {
        width: 100%;
      }
      .top-con {
        position: absolute;
        top: 0;
        left: 0;
        padding: 60rpx 74rpx;
        color: #fff;
        font-size: 48rpx;
        line-height: 1;
        font-weight: 500;
        letter-spacing: 2rpx;
      }
    }
    .content {
      width: 690rpx;
      margin: $spacing auto;
    }
    .tip-wrapper {
      width: 100%;
      .content-text {
        width: 100%;
        padding: 20rpx;
        background-color: #f0f2f5;
        border-radius: 8rpx;
        font-size: 26rpx;
        line-height: 48rpx;
        color: #525866;
        div {
          text-indent: 2em;
        }
      }
      .button-wrapper {
        padding: $spacing 110rpx 0;
      }
    }
    .form {
      font-weight: 500;
      .button-wrapper {
        margin-top: $spacing;
      }

      .voice {
        width: 263rpx;
        height: 214rpx;
        position: fixed;
        top: 180rpx;
        right: 0;
        z-index: 1;

        .v-img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .respondent-wrapper {
      width: 100%;
    }
    .input-wrapper {
      width: 100%;
      font-size: 24rpx;
      line-height: 1.4;
      margin-bottom: 20rpx;
      .label {
        color: $color-placeholder;
        width: 100%;
        padding: 16rpx 0;
        padding-left: 16rpx;
        position: relative;
      }
      .input {
        width: 100%;
      }
      textarea,
      input {
        display: block;
        width: 100%;
        height: 56rpx;
        background-color: #f0f2f5;
        border-radius: 8rpx;
        padding: 0 16rpx;
        color: $color;
        font-size: 24rpx;
        overflow: hidden;
      }
      textarea {
        height: 200rpx;
        padding: 16rpx;
      }

      .picker {
        display: block;
        width: 100%;
      }
      .picker-content {
        width: 100%;
        height: 56rpx;
        background-color: #f0f2f5;
        border-radius: 8rpx;
        padding-right: 50rpx;
        position: relative;
        .picker-placeholder,
        .picker-value {
          height: 100%;
          padding: 0 16rpx;
          line-height: 56rpx;
          color: $color;
          @include textOverflow();
        }
        .picker-placeholder {
          color: $color-placeholder;
        }
        .iconimg {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 10rpx;
          width: 34rpx;
          height: 30rpx;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA8CAMAAADovOwsAAAAUVBMVEUAAACjqbWiqLSiqLOip7ShqLSiqLWkrLaor7e/v7+iqLShqLShqLSiqLOhqLOiqLSiqbWjqLWiqLSiqbWkqLejqreqqrOmsbyqqsahqLShp7N1OjNvAAAAGnRSTlMARvXK75Z+IBAE+uTj2Lmna2ZYTzUnGwsJxDVguhsAAACgSURBVFjD7dRZCsMwDATQSRzH2fekqe5/0EI/QherWA4ECnoHEIjRCEoppS42m4o80vuMYCOxRgS6ZcRKC4RJ6IfkmiHydXg5sXKEKg0xTIlga8oss0JgIK8BIh15dJDZPAllG4Qm+jJBrKcPPeSKmt7UBSIkzL3LWHphEWdv6dDuiLQc/61aEC2X945voilxgnvm3Dic4mzTWAellPojD271KyynL8l2AAAAAElFTkSuQmCC)
            no-repeat center center;
          background-size: 100% 100%;
        }
      }

      &.required {
        .label {
          &::before {
            content: '*';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            color: #f00;
          }
        }
      }
    }
    .complainants-info-wrapper {
      margin-top: $spacing;
    }
    .complainant-info-wrapper {
      margin-top: $spacing;
    }
    .file-wrapper {
      margin-top: $spacing;
    }
    .open-will {
      margin-top: $spacing;

      .describe {
        font-size: 24rpx;
        color: $color-placeholder;
        .must {
          color: #f00;
        }
      }

      .radio-g {
        margin-top: $spacing;

        .radio-style {
          transform: scale(0.7);
        }
      }
    }
  }
</style>
