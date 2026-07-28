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
          <ComponentPanel title="被投诉举报对象信息">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">被投诉举报对象名称（姓名/单位）</div>
                <div class="input">
                  <input type="text" v-model="formData.aac003" placeholder="请输入被投诉举报对象名称（姓名/单位）" />
                </div>
              </div>
              <div class="input-wrapper">
                <div class="label">被投诉举报对象身份证号</div>
                <div class="input">
                  <input
                    type="idcard"
                    v-model="formData.aac002"
                    maxlength="18"
                    placeholder="请输入被举报对象身份证号"
                    @change="handleBlurM00004" />
                </div>
              </div>

              <div class="panel-content">
                <div class="input-wrapper">
                  <div class="label">被投诉举报补贴所属部门</div>
                  <div class="input">
                    <picker
                      class="picker"
                      :range="chi037Range"
                      range-key="chi037_desc"
                      mode="selector"
                      :value="pickerChi037Value"
                      @change="handleChi037ChangePicker">
                      <div class="picker-content">
                        <div class="picker-value" v-if="chi037">
                          {{ chi037_desc }}
                        </div>
                        <div class="picker-placeholder" v-else>请选择被投诉举报补贴所属部门</div>
                        <div class="iconimg"></div>
                      </div>
                    </picker>
                  </div>
                </div>
              </div>
              <div class="panel-content">
                <div class="input-wrapper required">
                  <div class="label">被投诉举报补贴项目</div>
                  <div class="input">
                    <picker
                      class="picker"
                      :range="chi031Range"
                      range-key="name"
                      mode="selector"
                      :value="pickerChi031Value"
                      @change="handleChi031ChangePicker">
                      <div class="picker-content">
                        <div class="picker-value" v-if="formData.chi031">
                          {{ formData.chi031_desc }}
                        </div>
                        <div class="picker-placeholder" v-else>请选择被投诉举报补贴项目</div>
                        <div class="iconimg"></div>
                      </div>
                    </picker>
                  </div>
                </div>
              </div>

              <div id="address">
                <ComponentSelectPermanentAddress
                  label="地址"
                  placeholder="请选择地址"
                  v-model="perAddress"
                  @change="handlerChangeAddress">
                </ComponentSelectPermanentAddress>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="complainant-info-wrapper">
          <ComponentPanel title="投诉举报内容">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">投诉主题</div>
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
                      <div class="picker-placeholder" v-else>请选择投诉主题</div>
                      <div class="iconimg"></div>
                    </div>
                  </picker>
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">投诉举报标题</div>
                <div class="input">
                  <input type="text" v-model="formData.chb092" placeholder="请输入投诉举报标题" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">投诉举报详细内容</div>
                <div class="input">
                  <textarea v-model="formData.chb093" placeholder="请输入投诉举报详细内容"></textarea>
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="file-wrapper">
          <ComponentPanel title="凭证材料上传">
            <div class="panel-content">
              <ComponentUploadImages
                :uploadNum="10"
                isUploadServer
                @change="handleChangeUploadImages"></ComponentUploadImages>
            </div>
          </ComponentPanel>
        </div>
        <div class="complainants-info-wrapper">
          <ComponentPanel title="投诉举报人信息">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">姓名</div>
                <div class="input">
                  <input
                    :disabled="disabledForm.chb581"
                    type="text"
                    v-model="formData.chb581"
                    placeholder="请输入您的姓名" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">身份证号</div>
                <div class="input">
                  <input
                    type="idcard"
                    :disabled="disabledForm.chb582"
                    v-model="formData.chb582"
                    maxlength="18"
                    placeholder="请输入您的身份证号" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">联系电话</div>
                <div class="input">
                  <input
                    type="number"
                    :disabled="disabledForm.chb583"
                    v-model="formData.chb583"
                    maxlength="11"
                    placeholder="请输入你的联系电话" />
                </div>
              </div>
              <div class="panel-content">
                <div id="address2">
                  <ComponentSelectPermanentAddress
                    label="地址"
                    :placeholder="disabledForm.placeholder2"
                    v-model="perAddress2"
                    :disabled="disabledForm.address"
                    @change="handlerChangeAddress2">
                  </ComponentSelectPermanentAddress>
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="button-wrapper">
          <ComponentButton
            type="primary"
            :disabled="submitBtnDisabled"
            name="立即投诉"
            borderRadius="40rpx"
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
  import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'

  import { mapGetters } from 'vuex'

  import { navigateBack, showModal, showLoading, hideLoading, navigateTo } from '@/utils/uni-api'
  import {
    requestB016,
    requestSPSaveHb09,
    requestSPGetOrgListByOrgId,
    requestFFGetBhi031ByChi031,
    requestSPQueryChi031
  } from '@/service/api'
  import { checkIDCard } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'

  import { USER_INFO, USER_LIST } from '@/store/constants' // 常量

  import config from '@/config'
  const { isOpenVoiceComplaints, areaCode } = config
  export default {
    name: 'pageComplaints',
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
          aac003: '', // 举报对象姓名
          aac002: '', // 举报对象身份证号
          aac005: '', // 举报对象电话
          // aae006: '', // 举报对象地址
          chi031: '', // 举报项目
          chi032: '', // 举报项目名称
          aae209: '', // 期号
          aae019: '', //金额

          chb015: '',
          chb017: '',
          chb018: '',

          chb581: '', // 投诉人姓名
          chb582: '', // 投诉人身份证号
          chb583: '', // 投诉人电话

          chb091: '', // 投诉类型
          chb092: '', // 投诉的标题
          chb093: '', // 投诉内容
          // aae013: '', // 备注
          aae006: '', // 投诉人区县
          hi21List: '[]', // 补充资料

          aab301: '' // 行政区划
        },
        //是否不可修改,现只有泸州使用
        disabledForm: {
          chb581: false,
          chb82: false,
          chb583: false,
          address: false,
          placeholder2: '请选择地址'
        },
        // 投诉类型 渲染数据
        complaintTypesRange: [],

        // 补贴项目 渲染数据
        chi031Range: [],
        //全部补贴项目
        completeChi031Range: [],
        // 所在区县
        schoolRange: [],

        // 业务部门 渲染数据
        chi037Range: [
          {
            chi037_desc: '全部',
            chi037: '-1'
          }
        ],
        chi037: '',
        chi037_desc: '',

        submitBtnDisabled: false, // 投诉按钮是否可用
        pickerValue: '0', // 投诉类型 选中序号
        pickerChi031Value: '0', // 项目选中
        pickerAae016Value: '0', // 区县选中
        pickerChi037ValueL: '0', //业务部门选中
        bhi031: '',
        perAddress: '',
        perAddress2: '', //泸州举报人地址
        isOpenVoiceComplaints, // 是否开启语音投诉
        radioValue: '', // 意愿选中值
        areaCode
      }
    },
    components: {
      ComponentButton,
      ComponentImg,
      ComponentPanel,
      ComponentUploadImages,
      ComponentSelectPermanentAddress
    },
    onLoad(e) {
      const { type, chi031 } = e
      this.subsidyInfo = { ...e }

      if (type === 'ygff') {
        this.requestGetBhi031ByChi031(chi031)
      }

      getCodeListByCodeName('chb091').then((res) => {
        this.complaintTypesRange = [...res]
      })

      this.initFormData()

      this.formData.aab301 = areaCode
      this.requestSchoolOrgByPid().then((res) => {
        this.schoolRange = [...res]
      })
    },
    onShow() {},
    onUnload() {},
    created() {},
    mounted() {
      this.getAllChi031List()
      this.setDefaultInfo()
    },
    methods: {
      setDefaultInfo() {
        const { aac021, chb015, chb017, chb018 } = this.userInfo
        this.perAddress = aac021
        this.formData = {
          ...this.formData,
          chb015,
          chb017,
          chb018
        }
      },
      // 查看投诉处理流程
      handleShowComplaintImage() {
        navigateTo('complaint-process', 'packageCommon')
      },
      // 语音投诉
      jumpToComplainsVoice() {
        navigateTo('complaints-voice', 'packageMasses', { isCarrier: false })
      },
      // 提交投诉
      saveData() {
        let data = {
          chb58f: '1',
          chb58e: '1',
          chb09t: '1' // 1：文字投诉  2：语音投诉
        }
        this.formData.chb097 = this.formData.aac002
        this.formData.chb098 = this.formData.aac003
        data = Object.assign(data, this.formData)
        return new Promise((resolve, reject) => {
          requestSPSaveHb09(data, true, false)
            .then((res) => {
              hideLoading()
              resolve(res)
            })
            .catch((err) => {
              hideLoading()
              reject(err)
            })
        })
      },
      // 手动输入身份证号 失去焦点监听
      handleBlurM00004(e) {
        const { value } = e.target
        const checkResult = checkIDCard(value)
        if (checkResult.status === '0' && value !== '') {
          showModal(checkResult.msg)
        }
      },
      // 区县
      requestSchoolOrgByPid() {
        showLoading()
        return new Promise((resolve, reject) => {
          requestSPGetOrgListByOrgId({}, false)
            .then((res) => {
              const { list } = res.lists.orgList
              if (list && list.length > 0) {
                resolve(list)
              } else {
                reject(res)
              }
              hideLoading()
            })
            .catch((err) => {
              reject(err)
              hideLoading()
            })
        })
      },
      // 地址变化
      handlerChangeAddress(value) {
        const chb015 = value[0].orgid
        const chb017 = value[1].orgid
        const chb018 = value[2].orgid
        this.formData = {
          ...this.formData,
          chb015,
          chb017,
          chb018
        }
      },
      //泸州举报人地址改变
      handlerChangeAddress2(value) {
        const chb015 = value[0]
        this.formData = {
          ...this.formData,
          aae006: chb015.orgid,
          aae006_desc: chb015.orgname
        }
      },

      // 根据chi037获取chi031
      getChi031Range(chi037) {
        let chi031Range = []
        this.completeChi031Range.forEach((item) => {
          if (item.chi037 == chi037) {
            chi031Range.push(item)
          }
        })
        this.chi031Range = chi031Range
        if (chi031Range.length == 0) {
          showModal('该业务局下暂无补贴项目，请重新选择业务局！！！')
        }
      },

      //获取全部业务局
      getAllChi037List(list) {
        let chi037List = []
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (chi037List.indexOf(item.chi037) == -1) {
            let obj = {
              chi037: item.chi037,
              chi037_desc: item.chi011
            }
            chi037List.push(item.chi037)
            this.chi037Range.push(obj)
          }
        }
      },

      //请求全部补贴项目
      getAllChi031List() {
        requestSPQueryChi031(true, true, '0', '1').then((res) => {
          console.log('res', res)
          const { list } = res.lists.chi031List
          if (list && list.length > 0) {
            this.chi031Range = [...list]
            this.completeChi031Range = this.chi031Range
            this.getAllChi037List(list)
          }
        })
      },
      // 初始化投诉人信息
      initFormData() {
        const { idCard, userName, tel } = this.userInfo
        this.formData = {
          ...this.formData,
          chb581: userName,
          chb582: idCard,
          chb583: tel
        }
        const { aac021, aac021Arr, chb015 } = this.userInfo //设置区县
        this.formData.aae006 = chb015
        this.formData.aae006_desc = aac021Arr[0]
        //以placeholder2代替默认值
        //设置了默认值再设置不可修改
        if (userName) {
          this.disabledForm.chb581 = true
        }
        if (idCard) {
          this.disabledForm.chb582 = true
        }
        if (tel) {
          this.disabledForm.chb583 = true
        }
        if (aac021) {
          this.disabledForm.placeholder2 = aac021
          this.disabledForm.address = true
        }
      },
      // 图片上传改变
      handleChangeUploadImages(files) {
        const type = this.type
        const hi21List = []
        if (files && files.length > 0) {
          files.map((item) => {
            const obj = {
              chi212: item.fileName,
              che092: item.id,
              chi214: item.suffix,
              chi215: item.id
            }
            hi21List.push(obj)
          })
        }
        this.formData = {
          ...this.formData,
          hi21List: JSON.stringify(hi21List)
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
      // 补贴选择触发
      handleChi031ChangePicker(e) {
        console.log('e', e)
        const { value } = e.target
        const item = this.chi031Range[value]
        this.pickerChi031Value = value + ''
        this.formData = {
          ...this.formData,
          chi031: item.id,
          chi031_desc: item.name,
          chi032: item.chi011,
          chi037: item.chi037
        }
        //反选部门
        this.chi037 = item.chi037
        this.chi037_desc = item.chi011
        //获取对应补贴项目
        this.getChi031Range(item.chi037)
      },
      //业务部门选择触发
      handleChi037ChangePicker(e) {
        console.log('e', e)
        const { value } = e.target
        const item = this.chi037Range[value]

        //选择业务部门重置补贴项目
        this.formData.chi031 = ''
        this.formData.chi031_desc = ''
        this.formData.chi032 = ''
        this.formData.chi037 = ''

        this.pickerChi037Value = value + ''
        this.chi037 = item.chi037
        this.chi037_desc = item.chi037_desc
        //当请求全部业务部门时
        if (item.chi037 == '-1') {
          this.chi031Range = this.completeChi031Range
          return
        }
        //获取对应补贴项目
        this.getChi031Range(item.chi037)
      },
      // 检测输入
      checkInput() {
        const {
          aac003, // 举报对象姓名
          aac002, // 举报对象身份证号
          // aae006: '', // 举报对象地址
          chi031, // 举报项目
          chi032, // 举报项目名称
          aae209, // 期号
          aae019, // 金额

          chb015,
          chb017,
          chb018,

          chb581, // 投诉人姓名
          chb582, // 投诉人身份证号
          chb583, // 投诉人电话

          chb091, // 投诉类型
          chb092, // 投诉的标题
          chb093, // 投诉内容
          aae006 // 投诉人区县
        } = this.formData
        if (!aac003) {
          showModal('请输入举报对象姓名')
          return false
        }
        if (!chi031) {
          showModal('请选择举报补贴项目')
          return false
        }
        if (!this.perAddress) {
          showModal('请选择举报对象地址')
          return false
        }
        if (!chb581) {
          showModal('请输入举报人姓名')
          return false
        }
        if (!chb582) {
          showModal('请输入举报人身份证号')
          return false
        }
        if (!chb583) {
          showModal('请输入举报人电话')
          return false
        }
        if (!aae006) {
          showModal('请输入举报人地址')
          return false
        }
        if (!chb091) {
          showModal('请选择投诉主题')
          return false
        }
        if (!chb092) {
          showModal('请输入投诉标题')
          return false
        }
        if (!chb093) {
          showModal('请输入投诉内容')
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
      // 点击立即投诉按钮 回调
      handleClickComplaint() {
        if (!this.checkInput()) {
          return
        }
        console.log('this.formData', this.formData)
        showModal('是否确认提交投诉', '提示', true)
          .then(() => {
            this.saveData().then((res) => {
              showModal('投诉成功').then((re) => {
                navigateBack(1)
              })
            })
          })
          .catch(() => {})
      },
      // radio改变回调
      radioChange(e) {
        const { value } = e.detail
        this.radioValue = value
      }
    },
    computed: {
      ...mapGetters([USER_INFO, USER_LIST]),
      quest() {
        let str = ''
        let { aac003, chi032, chb091_desc } = this.formData
        if (aac003 && chi032 && chb091_desc) {
          str = `${aac003}的${chi032}存在${chb091_desc}的问题`
          this.formData = {
            ...this.formData,
            chb092: str
          }
        }
        return str
      },
      showComplaintBtn() {
        if (areaCode == '511000' || areaCode == '511600') {
          return true
        }
        return false
      }
    },
    watch: {}
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
        color: #000;
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
    #address,
    #address2 {
      /deep/ .ez-select-permanent-address-wrapper {
        width: 100%;
        font-size: 24rpx !important;
        line-height: 1.4 !important;
        margin-bottom: 20rpx;
        padding: 0 !important;
        .key {
          font-size: 28rpx !important;
          font-weight: 400;
          color: #000 !important;
          width: 100%;
          padding: 16rpx 0 !important;
          padding-left: 16rpx !important;
          position: relative !important;
        }
        .value {
          display: block;
          width: 100%;
          height: 56rpx;
          margin: 0;
          font-weight: 400;
          background-color: #f0f2f5 !important;
          border-radius: 8rpx;
          padding: 0 16rpx;
          color: $color;
          font-size: 24rpx;
          overflow: hidden;
          display: flex;
          align-items: center;
          .value-placeholder {
            color: #878787;
          }
        }
        .iconfont {
          display: none;
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
