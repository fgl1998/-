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
          :buttonText="showComplaintProcessBtn ? '查看投诉处理流程' : ''"
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
        <div class="respondent-wrapper">
          <ComponentPanel title="被举报对象信息">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">被举报对象姓名</div>
                <div class="input">
                  <input
                    type="text"
                    v-model="formData.aac003"
                    :disabled="type == 'ygff'"
                    maxlength="20"
                    placeholder="请输入被举报对象的姓名" />
                </div>
              </div>
              <div class="input-wrapper">
                <div class="label">被举报对象身份证号</div>
                <div class="input">
                  <input
                    type="idcard"
                    v-model="formData.aac002"
                    maxlength="18"
                    :disabled="type == 'ygff'"
                    placeholder="请输入被举报对象身份证号"
                    @change="handleCheckIDCard" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">被举报对象所在区县</div>
                <div class="input">
                  <picker
                    class="picker"
                    :range="districtRange"
                    range-key="orgname"
                    :disabled="type == 'ygff'"
                    mode="selector"
                    :value="districtPickerValue"
                    @change="handleChangePickerYab003">
                    <div class="picker-content" :class="[type == 'ygff' ? 'disabled' : '']">
                      <div class="picker-value" v-if="formData.yab003">
                        {{ formData.yab003Desc }}
                      </div>
                      <div class="picker-placeholder" v-else>请选择被举报对象所在区县</div>
                      <div class="iconimg"></div>
                    </div>
                  </picker>
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">被举报补贴项目所属业务局</div>
                <div class="input">
                  <picker
                    class="picker"
                    :range="chi037Range"
                    range-key="chi011"
                    :disabled="type == 'ygff'"
                    mode="selector"
                    :value="chi037PickerValue"
                    @change="handleChangePickerChi037">
                    <div class="picker-content" :class="[type == 'ygff' ? 'disabled' : '']">
                      <div class="picker-value" v-if="formData.chi037">
                        {{ formData.chi037Desc }}
                      </div>
                      <div class="picker-placeholder" v-else>请选择被举报补贴项目所属业务局</div>
                      <div class="iconimg"></div>
                    </div>
                  </picker>
                </div>
              </div>
              <div class="input-wrapper required" v-if="formData.chi037">
                <div class="label">被举报补贴项目</div>
                <div class="input">
                  <picker
                    class="picker"
                    :range="chi031Range"
                    range-key="chi031_desc"
                    :disabled="type == 'ygff'"
                    mode="selector"
                    :value="chi031PickerValue"
                    @change="handleChangePickerChi031">
                    <div class="picker-content" :class="[type == 'ygff' ? 'disabled' : '']">
                      <div class="picker-value" v-if="formData.chi031">
                        {{ formData.chi031Desc }}
                      </div>
                      <div class="picker-placeholder" v-else>请选择被举报补贴项目</div>
                      <div class="iconimg"></div>
                    </div>
                  </picker>
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="complainants-info-wrapper">
          <ComponentPanel title="举报人信息">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">姓名</div>
                <div class="input">
                  <input type="text" v-model="formData.chb581" disabled placeholder="请输入您的姓名" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">身份证号</div>
                <div class="input">
                  <input
                    type="idcard"
                    v-model="formData.chb582"
                    maxlength="18"
                    disabled
                    placeholder="请输入您的身份证号" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">联系方式</div>
                <div class="input">
                  <input
                    type="number"
                    v-model="formData.chb583"
                    maxlength="11"
                    disabled
                    placeholder="请输入你的联系方式" />
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">联系地址</div>
                <div class="input" @click="showAddressPopup = true">
                  <div class="picker-content">
                    <div class="picker-value" v-if="formData.chb58e">
                      {{ formData.chb58e }}
                    </div>
                    <div class="picker-placeholder" v-else>请选择联系地址</div>
                    <div class="iconimg"></div>
                  </div>
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="complainant-info-wrapper">
          <ComponentPanel title="举报内容">
            <div class="panel-content">
              <div class="input-wrapper required">
                <div class="label">投诉主题</div>
                <div class="input">
                  <picker
                    class="picker"
                    :range="complaintTypesRange"
                    range-key="aaa103"
                    mode="selector"
                    :value="complaintTypePickerValue"
                    @change="handleChangePickerComplaintType">
                    <div class="picker-content">
                      <div class="picker-value" v-if="formData.chb091">
                        {{ formData.chb091Desc }}
                      </div>
                      <div class="picker-placeholder" v-else>请选择投诉主题</div>
                      <div class="iconimg"></div>
                    </div>
                  </picker>
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">投诉标题</div>
                <div class="input">
                  <div class="input-value">{{ getChb589 }}</div>
                </div>
              </div>
              <div class="input-wrapper required">
                <div class="label">投诉详细内容</div>
                <div class="input">
                  <textarea v-model="formData.chb584" placeholder="请输入投诉详细内容"></textarea>
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
        <div class="button-wrapper">
          <ComponentButton type="primary" name="立即投诉" @click="handleClickComplaint"></ComponentButton>
        </div>
      </div>
    </div>
    <ComponentSelectAddress
      v-model="showAddressPopup"
      @change="handlerChangeAddress"
      :address="addressArr"
      requestSystemType="FF"
      idKey="orgid"
      :DValue="2"
      renderKey="orgname"></ComponentSelectAddress>
  </div>
</template>
<script>
  import imageHeader from './images/header.png'

  import ComponentImg from '@/components/common/ez-img/ez-img.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentUploadImages from '@/components/common/ez-upload-images/ez-upload-images.vue'
  import ComponentSelectAddress from '@/components/project/ez-select-address/ez-select-address.vue'

  import { mapGetters } from 'vuex'

  import config from '@/config'
  import { navigateBack, showModal, showLoading, hideLoading, navigateTo } from '@/utils/uni-api'
  import {
    requestFFSaveHb58,
    requestFFGetOrgNextLevelList,
    requestFFGetChi037List,
    requestFFGetChi031ListByChi037
  } from '@/service/api'
  import { getDate } from '@/utils/get'
  import { checkIDCard } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'

  import { USER_INFO } from '@/store/constants' // 常量
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

        // 填报的数据
        formData: {
          aac003: '', // 举报对象姓名
          aac002: '', // 举报对象身份证号
          yab003: '', // 举报对象所在区县
          yab003Desc: '',
          chi037: '', // 举报对象补贴项目所在业务局
          chi037Desc: '',
          chi031: '', // 举报对象补贴项目
          chi031Desc: '',

          // chb015: '',
          // chb017: '',
          // chb018: '',

          chb581: '', // 投诉人姓名
          chb582: '', // 投诉人身份证号
          chb583: '', // 投诉人电话
          chb58e: '', // 投诉人联系地址

          chb091: '', // 投诉类型（主题）
          chb589: '', // 投诉的标题
          chb584: '', // 投诉内容
          aae036: '', // 投诉时间
          chb585: '1', // 投诉渠道 1 微信 2 网厅  3 其他 4 村村响 5 天府通办

          chb002: '', // 补充资料
          chb586: '0' // 处理状态(0未处理，1：已处理)
        },

        // 投诉类型 渲染数据
        complaintTypesRange: [],
        complaintTypePickerValue: '0',
        // 业务局
        chi037Range: [],
        chi037PickerValue: '0',
        // 补贴项目
        chi031Range: [],
        chi031PickerValue: '0',
        // 举报投诉对象所在区县
        districtRange: [],
        districtPickerValue: '0',

        showAddressPopup: false, // 投诉类型 选中序号
        addressArr: [],

        type: 'wztts' // 投诉类型 wztts 无载体投诉 ygff 村村响投诉
      }
    },
    components: {
      ComponentButton,
      ComponentImg,
      ComponentPanel,
      ComponentUploadImages,
      ComponentSelectAddress
    },
    onLoad(e) {
      console.log(e, 99)
      const {
        type,
        chb010,
        chi037,
        chi031,
        chi031_desc,
        chi037_desc,
        aac002,
        aac002_old,
        aac003,
        chb015,
        orgnamepath
      } = e
      // 发放系统进入的投诉
      if (type === 'ygff') {
        this.type = type
        this.formData = {
          ...this.formData,
          aac002,
          aac002_old,
          aac003,
          chi031,
          chi031Desc: chi031_desc,
          chi037,
          chi037Desc: chi037_desc,
          chb010,
          chb585: '4',
          yab003: chb015,
          yab003Desc: orgnamepath.split('/')[0]
        }
      }
      this.initData()
      this.getData()
    },
    methods: {
      // 初始化数据
      initData() {
        const { userName, idCard, tel, aac021, aac021Arr } = this.userInfo
        this.formData = {
          ...this.formData,
          chb581: userName, // 投诉人姓名
          chb582: idCard, // 投诉人身份证号
          chb583: tel, // 投诉人电话
          chb58e: aac021 // 投诉人联系地址
        }
        this.addressArr = aac021Arr
      },
      // 获取数据
      getData() {
        showLoading()

        const { FFAddressRequestParams } = config

        Promise.allSettled([
          requestFFGetOrgNextLevelList(FFAddressRequestParams, false),
          requestFFGetChi037List(false),
          getCodeListByCodeName('chb091', 'ygff')
        ]).then((res) => {
          const res0 = res[0]
          const res1 = res[1]
          const res2 = res[2]

          const { status: statusRes0, value: valueRes0 } = res0
          const { status: statusRes1, value: valueRes1 } = res1
          const { status: statusRes2, value: valueRes2 } = res2

          console.log(res, 987)
          if (statusRes0 === 'fulfilled' && valueRes0) {
            const { list } = valueRes0
            if (list && list.length > 0) {
              this.districtRange = [...list]
            }
          }

          if (statusRes1 === 'fulfilled' && valueRes1) {
            const { list } = valueRes1
            if (list && list.length > 0) {
              this.chi037Range = [...list]
            }
          }

          if (statusRes2 === 'fulfilled' && valueRes2) {
            if (valueRes2 && valueRes2.length > 0) {
              this.complaintTypesRange = [...valueRes2]
            }
          }

          hideLoading()
        })
      },
      // 获取chi031
      getChi031Range(chi037) {
        this.chi031PickerValue = '0'
        this.chi031Range = []
        requestFFGetChi031ListByChi037(chi037).then((res) => {
          const { list } = res
          if (list && list.length > 0) {
            this.chi031PickerValue = '0'
            this.chi031Range = [...list]
          } else {
            this.formData = {
              ...this.formData,
              chi037: '',
              chi037Desc: ''
            }
            showModal('该业务局下暂无补贴项目，请重新选择业务局！！！')
          }
        })
      },
      // 校验身份证是否输入正确
      handleCheckIDCard(e) {
        const { value } = e.target
        const checkResult = checkIDCard(value)
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
        }
      },
      // 区县选择
      handleChangePickerYab003(e) {
        const { value } = e.target
        const item = this.districtRange[value]
        this.districtPickerValue = value + ''
        this.formData = {
          ...this.formData,
          yab003: item.orgid,
          yab003Desc: item.orgname
        }
      },
      // 业务局选择
      handleChangePickerChi037(e) {
        const { value } = e.target
        const item = this.chi037Range[value]
        this.chi037PickerValue = value + ''
        this.formData = {
          ...this.formData,
          chi037: item.chi037,
          chi037Desc: item.chi011
        }
      },
      // 补贴项目选择
      handleChangePickerChi031(e) {
        const { value } = e.target
        const item = this.chi031Range[value]
        this.chi031PickerValue = value + ''
        this.formData = {
          ...this.formData,
          chi031: item.chi031,
          chi031Desc: item.chi031_desc
        }
      },
      // 地址变化
      handlerChangeAddress(value) {
        this.formData = {
          ...this.formData,
          chb58e: value.join('-')
        }
      },
      // 投诉主题
      handleChangePickerComplaintType(e) {
        const { value } = e.target
        const item = this.complaintTypesRange[value]
        this.complaintTypePickerValue = value + ''
        this.formData = {
          ...this.formData,
          chb091: item.aaa102,
          chb091Desc: item.aaa103
        }
      },
      // 查看投诉处理流程
      handleShowComplaintImage() {
        navigateTo('complaint-process', 'packageCommon')
      },
      // 提交投诉
      saveData() {
        const type = this.type
        const chb589 = this.getChb589

        const {
          aac003, // 举报对象姓名
          aac002, // 举报对象身份证号
          aac002_old, // 发放系统举报对象身份证号
          yab003, // 举报对象所在区县

          chi037, // 举报对象补贴项目所在业务局

          chi031, // 举报对象补贴项目

          // chb015,
          // chb017,
          // chb018,

          chb581, // 投诉人姓名
          chb582, // 投诉人身份证号
          chb583, // 投诉人电话
          chb58e, // 投诉人联系地址

          chb091, // 投诉类型（主题）
          // chb589, // 投诉的标题
          chb584, // 投诉内容
          aae036, // 投诉时间
          chb585, // 投诉渠道 1 微信 2 网厅  3 其他 4 村村响 5 天府通办
          chb586,
          chb010
        } = this.formData
        let data = {
          aac003, // 举报对象姓名
          // aac002, // 举报对象身份证号

          yab003, // 举报对象所在区县

          chi037, // 举报对象补贴项目所在业务局

          chi031, // 举报对象补贴项目

          // chb015,
          // chb017,
          // chb018,

          chb581, // 投诉人姓名
          chb582, // 投诉人身份证号
          chb583, // 投诉人电话
          chb58e, // 投诉人联系地址

          chb091, // 投诉类型（主题）
          chb589, // 投诉的标题
          chb584, // 投诉内容
          aae036: getDate(), // 投诉时间
          chb585, // 投诉渠道 1 微信 2 网厅  3 其他 4 村村响 5 天府通办
          chb586
        }
        if (type === 'wztts') {
          data = {
            ...data,
            aac002
          }
        }
        if (type === 'ygff') {
          data = {
            ...data,
            aac002: aac002_old,
            chb010
          }
        }
        return new Promise((resolve, reject) => {
          requestFFSaveHb58(data, true, false)
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

      // 图片上传改变
      handleChangeUploadImages(files) {
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
          chb002: JSON.stringify(hi21List)
        }
      },

      // 检测输入
      handleCheckInput() {
        const {
          aac003, // 举报对象姓名
          aac002, // 举报对象身份证号
          yab003, // 举报对象所在区县

          chi037, // 举报对象补贴项目所在业务局

          chi031, // 举报对象补贴项目

          // chb015,
          // chb017,
          // chb018,

          chb581, // 投诉人姓名
          chb582, // 投诉人身份证号
          chb583, // 投诉人电话
          chb58e, // 投诉人联系地址

          chb091, // 投诉类型（主题）
          chb589, // 投诉的标题
          chb584, // 投诉内容
          aae036, // 投诉时间
          chb585 // 投诉渠道 1 微信 2 网厅  3 其他 4 村村响 5 天府通办
        } = this.formData
        if (!aac003) {
          showModal('请输入举报对象姓名')
          return false
        }
        // if (!aac002) {
        //   showModal('请输入举报对象身份证号')
        //   return false
        // }
        if (!yab003) {
          showModal('请选择举报对象所在区县')
          return false
        }
        if (!chi037) {
          showModal('请选择举报对象补贴项目所在业务局')
          return false
        }
        if (!chi031) {
          showModal('请选择举报对象补贴项目')
          return false
        }

        // if (!chb581) {
        //   showModal('请输入举报人姓名')
        //   return false
        // }
        // if (!chb582) {
        //   showModal('请输入举报人身份证号')
        //   return false
        // }
        // if (!chb583) {
        //   showModal('请输入举报人联系方式')
        //   return false
        // }

        if (!chb58e) {
          showModal('请选择举报人联系地址')
          return false
        }

        if (!chb091) {
          showModal('请选择投诉主题')
          return false
        }

        // if (!chb589) {
        //   showModal('请输入投诉标题')
        //   return false
        // }
        if (!chb584) {
          showModal('请输入投诉内容')
          return false
        }
        return true
      },

      // 点击立即投诉按钮 回调
      handleClickComplaint() {
        if (!this.handleCheckInput()) {
          return
        }
        showModal(
          '是否愿意我们以适当方式向社会公开您提出的问题、意见建议以及处理情况？这其中不会包括您的隐私信息！',
          '提示',
          true,
          '不愿意',
          '#000000',
          '愿意'
        )
          .then(() => {})
          .finally(() => {
            this.saveData().then((res) => {
              showModal('投诉成功').then((re) => {
                navigateBack(1)
              })
            })
          })
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),

      showComplaintProcessBtn() {
        let { areaCode } = config
        if (areaCode == '511000' || areaCode == '511600') {
          return true
        }

        return false
      },
      // 自动获取投诉标题
      getChb589() {
        let str = '暂无'
        const type = this.type
        const { aac003, chi031Desc, chb091Desc } = this.formData
        if ((type === 'ygff' && aac003 && chi031Desc, chb091Desc)) {
          str = `${aac003}的${chi031Desc}存在${chb091Desc}的问题`
        }
        return str
      }
    },
    watch: {
      'formData.chi037': {
        handler(val) {
          if (val) {
            if (this.type !== 'ygff') {
              this.getChi031Range(val)
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
      .input-value {
        line-height: 32rpx;
        padding: 12rpx 16rpx;
        opacity: 0.4;
        display: block;
        width: 100%;
        min-height: 56rpx;
        background-color: #f0f2f5;
        border-radius: 8rpx;
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
        &.disabled {
          opacity: 0.4;
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
  }
</style>
