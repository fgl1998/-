<template>
  <view class="complaints-voice">
    <div class="base" v-if="isCarrier && !isViewData">
      <ComponentPanel title="被投诉对象">
        <div class="panel-content">
          <div class="base-info">
            <div class="content">
              <span class="title">姓名：</span>
              <span class="val">{{ respondentInfo.aac003 }}</span>
            </div>
            <div class="content">
              <span class="title">发放期号：</span>
              <span class="val">{{ respondentInfo.aae209 }}</span>
            </div>
            <div class="content">
              <span class="title">身份证号：</span>
              <span class="val">{{ respondentInfo.aac002 }}</span>
            </div>
            <div class="content">
              <span class="title">发放金额：</span>
              <span class="val">{{ respondentInfo.aae019 }}</span>
            </div>
            <div class="content">
              <span class="title">补贴项目：</span>
              <span class="val">{{ respondentInfo.chi031_desc }}</span>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <div class="view-all" v-if="isViewData">
      <ComplaintsVoiceContent
        :isCarrier="isCarrier"
        :baseInfo="respondentInfo"
        :subsidy="subsidy_desc"
        :subsidy_org="subsidy"
        :subsidys="subsidys"
        :theme_org="theme"
        :themes="themes"
        :theme="theme_desc"
        :address_arr="address"
        :address="addressOrgname"
        :address_org="addressOrgid"
        :messages="messages"
        :isRequestFF="isRequestFF"
        :uploadImages="showImages"
        @handleEditInfo="toEditInfo"
        @handleSubmit="submitData"></ComplaintsVoiceContent>
    </div>
    <div class="window" v-else>
      <ComplaintsVoiceWindow
        :tips="tips"
        :isRequired="isRequired"
        :subsidys="subsidys"
        :themes="themes"
        :messages="messages"
        :showImages="showImages"
        :address="address"
        :isCarrier="isCarrier"
        :currentStep="currentStep"
        :isRequestFF="isRequestFF"
        :preBtnText="preBtn"
        :nextBtnText="nextBtn"
        :isEdit="isEdit"
        @preStep="preStep"
        @nextStep="nextStep"
        @handleChoseSub="choseSubsidy"
        @handleChoseTheme="choseTheme"
        @handleChoseAddress="choseAddress"
        @handleDelete="deleteVoice"
        @handleChangeImages="handleChangeUploadImages"
        @handleChangeMessages="changeMessages"></ComplaintsVoiceWindow>
    </div>
  </view>
</template>

<script>
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import config from '@/config'
  import {
    requestB016,
    requestSPSaveHb09,
    requestSPSaveHb58,
    requestFFSaveHb58,
    requestSPGetOrgListByOrgId
  } from '@/service/api'
  import { showModal, uploadFile, showLoading, hideLoading, showToast, navigateBack } from '@/utils/uni-api'
  import { mapGetters } from 'vuex'
  import { USER_INFO } from '@/store/constants'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComplaintsVoiceWindow from './complaints-voice-window.vue'
  import ComplaintsVoiceContent from './complaints-voice-content.vue'
  export default {
    name: 'complaintsVoice',
    components: {
      ComplaintsVoiceWindow,
      ComplaintsVoiceContent,
      ComponentPanel
    },
    onLoad(e) {
      const { areaCode } = config
      const { isCarrier, chi031, chi031_desc, chb015, chb015Desc, aac003, aac002, aae209, aae019, type } = e
      if ((areaCode === '511600' || areaCode === '511000') && type === 'ygff') {
        this.isRequestFF = true
      }
      this.getTheme()
      if (!isCarrier) {
        this.getAllSubsidysAndAddress()
      } else {
        this.isCarrier = isCarrier
        this.tips = '请选择投诉举报主题'
        this.currentStep = 1
        this.isHavaData = true
        this.subsidy = chi031
        this.subsidy_desc = chi031_desc
        this.addressOrgid = chb015
        this.addressOrgname = chb015Desc
        this.respondentInfo = {
          chi031_desc,
          aac003,
          aac002,
          aae019,
          aae209
        }
        this.subsidyInfo = { ...e }
      }
    },
    computed: {
      ...mapGetters([USER_INFO])
    },
    data() {
      return {
        tips: '请选择被投诉举报补贴项目',
        currentStep: 0, // 当前步骤
        isRequired: true, // 是否必传
        subsidys: [], // 补贴项目
        themes: [], // 投诉主题
        theme: '', // 选择的主题
        theme_desc: '',
        subsidy: '', // 选择的补贴项目
        subsidy_desc: '',
        addressOrgid: '', // 区县orgid
        addressOrgname: '', // 区县名
        showImages: [], // 已上传的图片
        messages: [], // 已录入的语音
        address: [], // 区县地址信息
        isCarrier: false, // 是否有载体投诉（有无补贴项目）
        isHavaData: false, // 是否已有填写好的数据
        isViewData: false, // 是否查看已录入数据
        subsidyInfo: {}, // 有载体投诉基础数据
        respondentInfo: {}, // 被投诉对象基础信息
        isRequestFF: false, // 是否请求发放系统投诉
        preBtn: '上一步',
        nextBtn: '确认开始下一步',
        isEdit: false, // 是否是编辑
        oldData: '',
        oldDataDsc: '',
        oldArr: []
      }
    },
    methods: {
      // 获取投诉主题
      getTheme() {
        getCodeListByCodeName('CHB091')
          .then((res) => {
            if (res && res.length > 0) {
              res.forEach((item) => {
                this.themes.push({
                  ...item,
                  isChosed: false
                })
              })
            }
          })
          .catch((err) => {
            console.error('code table CHB091 error：', err)
          })
      },
      // 获取补贴项目和区县信息
      getAllSubsidysAndAddress() {
        const requestList = [requestB016(), requestSPGetOrgListByOrgId()]
        showLoading()
        Promise.allSettled(requestList)
          .then((res) => {
            const res0 = res[0] || {}
            const res1 = res[1] || {}

            const { status: status0, value: value0 } = res0
            const { status: status1, value: value1 } = res1

            if (status0 == 'fulfilled' && value0) {
              const { list } = value0.lists.hi03List
              if (list && list.length > 0) {
                list.forEach((item) => {
                  this.subsidys.push({
                    chi031: item.chi031,
                    name: item.chi032,
                    isChosed: false
                  })
                })
              }
            }

            if (status1 == 'fulfilled' && value1) {
              const { list } = value1.lists.orgList
              if (list && list.length > 0) {
                list.forEach((item) => {
                  this.address.push({
                    orgname: item.orgname,
                    orgid: item.orgid,
                    isChosed: false
                  })
                })
              }
            }
          })
          .finally(() => {
            hideLoading()
          })
      },
      // 选择补贴项目
      choseSubsidy(index) {
        this.subsidys.forEach((item, i) => {
          if (index === i) {
            item.isChosed = true
            this.subsidy = item.chi031
            this.subsidy_desc = item.name
          } else {
            item.isChosed = false
          }
        })
      },
      // 选择主题
      choseTheme(index) {
        this.themes.forEach((item, i) => {
          if (index === i) {
            item.isChosed = true
            this.theme = item.aaa102
            this.theme_desc = item.aaa103
          } else {
            item.isChosed = false
          }
        })
      },
      // 选择区县
      choseAddress(index) {
        this.address.forEach((item, i) => {
          if (index === i) {
            item.isChosed = true
            this.addressOrgid = item.orgid
            this.addressOrgname = item.orgname
          } else {
            item.isChosed = false
          }
        })
      },
      // 图片上传改变
      handleChangeUploadImages(list) {
        this.showImages = [...list]
      },
      // 新增录入语音
      changeMessages(list) {
        this.messages.push({
          ...list
        })
      },
      // 去修改
      toEditInfo(i, arr, oldData, oldDataDesc) {
        this.isEdit = true
        this.preBtn = '取消'
        this.nextBtn = '确认'
        this.oldDataDesc = oldDataDesc
        this.oldData = oldData
        this.oldArr = arr
        this.isViewData = false
        this.currentStep = i
        if (this.currentStep === 0) {
          this.tips = '请选择被投诉举报补贴项目'
          this.isRequired = true
        } else if (this.currentStep === 1) {
          this.tips = '请选择投诉举报主题'
          this.isRequired = true
        } else if (this.currentStep === 2) {
          this.tips = '请选择投诉举报所在区县'
          this.isRequired = true
        } else if (this.currentStep === 3) {
          this.tips = '请录入投诉内容'
          this.isRequired = true
        } else if (this.currentStep === 4) {
          this.tips = '请上传投诉凭证材料'
          this.isRequired = false
          this.showImages = [...arr]
        }
      },
      // 上一步和编辑取消，如果取消编辑则将原始数据回显
      preStep() {
        if (this.isEdit) {
          this.isViewData = true
          if (this.currentStep === 0) {
            this.subsidy = this.oldData
            this.subsidy_desc = this.oldDataDesc
            this.subsidys = [...this.oldArr]
          } else if (this.currentStep === 1) {
            this.theme = this.oldData
            this.theme_desc = this.oldDataDesc
            this.themes = [...this.oldArr]
          } else if (this.currentStep === 2) {
            this.addressOrgid = this.oldData
            this.addressOrgname = this.oldDataDesc
            this.address = [...this.oldArr]
          } else if (this.currentStep === 3) {
            this.messages = [...this.oldArr]
          } else if (this.currentStep === 4) {
            this.showImages = [...this.oldArr]
          }
        } else {
          if (this.currentStep === 4) {
            this.currentStep = 3
            this.tips = '请录入投诉内容'
            this.isRequired = true
          } else if (this.currentStep === 3) {
            if (this.isCarrier) {
              this.currentStep = 1
              this.tips = '请选择投诉举报主题'
              this.isRequired = true
            } else {
              this.currentStep = 2
              this.tips = '请选择投诉举报所在区县'
              this.isRequired = true
            }
          } else if (this.currentStep === 2) {
            this.currentStep = 1
            this.tips = '请选择投诉举报主题'
            this.isRequired = true
          } else if (this.currentStep === 1 && !this.isCarrier) {
            this.currentStep = 0
            this.tips = '请选择被投诉举报补贴项目'
            this.isRequired = true
          } else {
            return
          }
        }
      },
      // 请求上传
      requestUpload(path) {
        return new Promise((resolve, reject) => {
          uploadFile('/upload/uploadFileList', path, 'multipartFiles')
            .then((res) => {
              if (res.statusCode === 200) {
                const data = JSON.parse(res.data)
                const { resultData } = data.data
                if (resultData && resultData.code === '-1') {
                  reject(resultData.message || '服务器返回错误')
                } else {
                  resolve(resultData.data)
                }
              }
            })
            .catch((err) => {
              console.log('upload err', err)
              reject(err)
            })
        })
      },
      // 下一步和编辑确认
      nextStep() {
        const len = this.messages.length
        if (this.isEdit) {
          if (len > 0) {
            this.isViewData = true
          } else {
            showModal('请录入投诉内容！')
          }
        } else {
          if (this.currentStep === 0) {
            if (this.subsidy) {
              this.currentStep = 1
              this.tips = '请选择投诉举报主题'
              this.isRequired = true
            } else {
              showModal('请选择被投诉举报补贴项目！')
              return
            }
          } else if (this.currentStep === 1) {
            if (this.theme && !this.isCarrier) {
              this.currentStep = 2
              this.tips = '请选择投诉举报所在区县'
              this.isRequired = true
            } else if (this.theme && this.isCarrier) {
              this.currentStep = 3
              this.tips = '请录入投诉内容'
              this.isRequired = true
            } else {
              showModal('请选择投诉主题！')
              return
            }
          } else if (this.currentStep === 2) {
            if (this.addressOrgname) {
              this.currentStep = 3
              this.tips = '请录入投诉内容'
              this.isRequired = true
            } else {
              showModal('请选择投诉举报所在区县！')
              return
            }
          } else if (this.currentStep === 3) {
            if (len > 0) {
              this.currentStep = 4
              this.tips = '请上传投诉凭证材料'
              this.isRequired = false
            } else {
              showModal('请录入投诉内容！')
              return
            }
          } else {
            this.isViewData = true
          }
        }
      },
      // 删除已经录制的语音
      deleteVoice(index) {
        showModal('确认要删除这条已录入的语音吗？', '', true)
          .then(() => {
            this.messages.splice(index, 1)
            this.$emit('handleChangeMessages', [...this.messages])
            showToast('删除成功！')
          })
          .catch(() => {
            showToast('操作取消！')
          })
      },
      // 语音转base64
      voiceTobase64(url) {
        return new Promise((resolve, reject) => {
          const fs = wx.getFileSystemManager()
          let suffix = url.substr(url.lastIndexOf('.') + 1)
          let base64 = ''
          try {
            let base64Data = fs.readFileSync(url, 'base64')
            base64 = 'data:audio/' + suffix + ';base64,' + base64Data
            resolve(base64)
          } catch (err) {
            showModal('获取文件数据失败')
            reject(err)
          }
        })
      },
      // 提交投诉
      submitData() {
        const { idCard, userName, tel, aac021 } = this.userInfo
        const { areaCode } = config
        const messages = [...this.messages]
        const imgaes = [...this.showImages]
        const imgLen = imgaes.length
        const len = messages.length
        // 是否有载体投诉
        const isCarrier = this.isCarrier
        // 语音、材料
        const list = []
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
          bhi031
        } = this.subsidyInfo

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

        if (!this.theme) {
          this.toEditInfo(1)
          showModal('请选择投诉举报主题！')
          return
        }
        if (!this.addressOrgid) {
          this.toEditInfo(2)
          showModal('请选择投诉举报所在区县！')
          return
        }
        if (len === 0) {
          this.toEditInfo(3)
          showModal('请录入投诉内容！')
          return
        }

        // 图片
        if (imgLen > 0) {
          imgaes.forEach((item) => {
            if (this.isRequestFF) {
              const obj_i = {
                chb221: item.fileName,
                chb22c: item.base64,
                chb22d: '1'
              }
              list.push(obj_i)
            } else {
              const obj_i = {
                chi212: item.fileName,
                che092: item.id,
                chi214: item.suffix,
                chi215: item.id
              }
              list.push(obj_i)
            }
          })
        }

        showModal('是否确认提交投诉', '提示', true)
          .then(async () => {
            try {
              showLoading('语音文件上传中！')
              // 上传语音到服务器
              if (this.isRequestFF) {
                for (let i = 0; i < len; i++) {
                  const path = messages[i].path
                  const fileSize = messages[i].fileSize
                  const fileName = '语音' + i + fileSize
                  const base64 = await this.voiceTobase64(path)
                  const obj_m = {
                    chb221: fileName,
                    chb22c: base64,
                    chb22d: '2'
                  }
                  list.push(obj_m)
                  hideLoading()
                }
              } else {
                for (let i = 0; i < len; i++) {
                  const path = messages[i].path
                  const suffix = messages[i].suffix
                  const uploadResult = await this.requestUpload(path)
                  const { hi21List } = uploadResult
                  const obj_m = {
                    chi212: hi21List[0].data.filename,
                    che092: hi21List[0].data.fileid,
                    chi214: suffix,
                    chi215: hi21List[0].data.fileid
                  }
                  list.push(obj_m)
                  hideLoading()
                }
              }
            } catch (error) {
              console.log('上传语音文件错误', error)
              showModal('语音文件上传出错，请稍后重试！')
              hideLoading()
              return
            }

            if (isCarrier && !this.isRequestFF) {
              // 请求参数
              let data = {
                chb581: userName, // 举报人名字
                chb582: idCard, // 举报人身份证号
                chb583: tel, // 举报人联系方式
                chb584: '语音投诉', // 举报内容
                chb093: '语音投诉', // 举报内容
                chb091: this.theme, // 投诉主题
                chb015,
                chb017,
                chb018,
                chi031,
                chi037,
                aac002: areaCode === '511700' ? aac002_old : aac002,
                aac003,
                aab301,
                chi032: chi032 || chi031_desc,
                chb092: aac003 + '的' + chi031_desc + '存在' + this.theme_desc + '的问题',
                chb58f: '1', // 举报渠道（1 微信 2 网厅 3 其他）
                chb58e: '2',
                chb09t: '2', //1：文字投诉 2：语音投诉
                imgList: JSON.stringify(list)
              }
              if (type === 'ygff') {
                // 从阳光发放进入的投诉getPolicyFileList
                data = {
                  ...data,
                  aab301: aab301 || areaCode,
                  chb010, // 业务受理号
                  chb589: aac003 + '的' + chi031_desc + '存在' + this.theme_desc + '的问题',
                  chi031: bhi031,
                  orgnamepath: newOrgnamepath + aac021.split('-').join('/'),
                  chb58e: '2', // 举报类型 1 公示投诉 2 补贴发放投诉
                  chb58f: '4'
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
              showLoading('提交投诉中！')
              this.saveToHb58(data)
            } else if (isCarrier && this.isRequestFF) {
              let data = {
                chb09t: '2',
                chb581: userName, // 举报人名字
                chb582: idCard, // 举报人身份证号
                chb583: tel, // 举报人联系方式
                chb58e: aac021, // 投诉人联系地址 暂为空
                chb010, // 业务受理号
                chb091: this.theme, // 投诉主题
                chb584: '语音投诉', // 举报内容
                imgList: JSON.stringify(list)
              }
              showLoading('提交投诉中！')
              this.saveToFFHb58(data)
            } else {
              const data = {
                chb58f: '1',
                chb58e: '1',
                aac003: '', // 举报对象姓名
                aac002: '', // 举报对象身份证号
                aac005: '', // 举报对象电话
                chi031: this.subsidy, // 举报项目
                chi032: this.subsidy_desc, // 举报项目名称
                aae209: '', // 期号
                aae019: '', //金额
                chb015: this.addressOrgid,
                chb017: '',
                chb018: '',
                chb581: userName, // 投诉人姓名
                chb582: idCard, // 投诉人身份证号
                chb583: tel, // 投诉人电话
                chb091: this.theme, // 投诉类型
                chb092: '语音投诉', // 投诉的标题
                chb093: '语音投诉', // 投诉内容
                aae006: this.addressOrgname, // 投诉人区县
                hi21List: JSON.stringify(list), // 补充资料
                aab301: areaCode, // 行政区划
                chb09t: '2' //1：文字投诉 2：语音投诉
              }
              showLoading('提交投诉中！')
              this.saveToHb09(data)
            }
          })
          .catch(() => {})
      },
      // 审批无载体投诉
      saveToHb09(data) {
        requestSPSaveHb09(data)
          .then(() => {
            showModal('投诉提交成功').then(() => {
              navigateBack(1)
            })
          })
          .catch((err) => {})
          .finally(() => {
            hideLoading()
          })
      },
      // 有载体调审批投诉
      saveToHb58(data) {
        requestSPSaveHb58(data)
          .then(() => {
            showModal('投诉提交成功').then(() => {
              navigateBack(1)
            })
          })
          .catch((err) => {})
          .finally(() => {
            hideLoading()
          })
      },
      // 调发放系统投诉
      saveToFFHb58(data) {
        requestFFSaveHb58(data)
          .then(() => {
            showModal('投诉提交成功').then(() => {
              navigateBack(1)
            })
          })
          .catch((err) => {})
          .finally(() => {
            hideLoading()
          })
      }
    },
    watch: {
      subsidy(val) {
        if (val) {
          this.isHavaData = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .complaints-voice {
    padding-top: 20rpx;
    height: 100%;
    width: 100%;

    .base {
      .panel-content {
        .base-info {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;

          .content {
            display: flex;
            margin-top: 20rpx;

            .title {
              min-width: 130rpx;
              font-size: 26rpx;
              color: #999999;
            }

            .val {
              flex: 1;
              font-size: 26rpx;
              color: #444444;
            }
          }
        }
      }
    }

    .view-all {
      width: 100%;
      height: 100%;
    }

    .window {
      width: 100%;
      height: 100%;
    }
  }
</style>
