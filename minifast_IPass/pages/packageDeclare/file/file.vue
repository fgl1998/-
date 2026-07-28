<template>
  <view class="file h5-page">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="3"></ComponentDeclareStep>
    </div>
    <div class="upload-files">
      <ComponentUploadFiles
        ref="upload"
        :chi031="chi031"
        :filter="aka131"
        :signData="signData"
        @change="handleRequestOver"></ComponentUploadFiles>
    </div>
    <div class="button-wrapper" v-if="isRequestOver">
      <ComponentButton
        name="下一步"
        size="small"
        :disabled="!isCanApply"
        fontWeight="500"
        @click="getUploadFiles"
        type="primary"></ComponentButton>
    </div>
  </view>
</template>

<script>
  import config from '@/config/index'

  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentUploadFiles from '../components/ez-upload-files/ez-upload-files.vue'
  import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'

  import { redirectTo, showModal, hideLoading, showLoading } from '@/utils/uni-api'
  import { requestB001, requestB009 } from '@/service/api'
  import {
    DECLARE_INFO,
    REFRESH_FILE,
    UPDATE_DECLARE_INFO,
    OTHERS_DECLARE_INFO,
    EDIT_SUBSIDY_INFO,
    USER_LIST
  } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  export default {
    name: 'pageDeclareFile',
    components: {
      ComponentButton,
      ComponentUploadFiles,
      ComponentDeclareStep
    },
    data() {
      return {
        aka131: '', // 人员类别
        chi031: '', // 项目编号
        chb006: '0', // 生存认证状态 0 认证失败 1 认证成功
        isRequestOver: false, // 是否请求完毕
        isNeedFileProject: true, // 是否为需要上传材料的项目，通过请求ez-upload-files组件requestConfigFile方法请求回来的list是否为空确定
        isCanApply: true, // 是否可以申报
        signData: {}
      }
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      const { aka131, cac102_arr, chi031, chb006 } = this.declareInfo
      if (cac102_arr && cac102_arr.length > 0) {
        this.aka131 = cac102_arr.join(',')
      } else {
        if (aka131) {
          this.aka131 = aka131
        }
      }
      if (chi031) {
        this.chi031 = chi031
      }

      // 生存认证状态 0 认证失败 1 认证成功
      if (chb006) {
        this.chb006 = chb006
      }
      // console.log(e, 'e')
      let { signFile } = e
      if (signFile) {
        this.signData = JSON.parse(signFile)
      }
    },
    // 监听页面初次渲染完成
    onReady() {
      if (this.refreshFile) {
        const upload = this.$refs.upload
        if (upload) {
          upload.clear()
        }
      }
    },
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      handleRequestOver(flag) {
        this.isNeedFileProject = flag
        this.isRequestOver = true

        // 如果是不需要上传文件的项目，直接调用最后的验证逻辑
        if (!flag) {
          this.getUploadFiles()
        }
      },
      // 申报
      _requestB001(declareInfo, isShowLoading) {
        return new Promise((resolve, reject) => {
          requestB001(config.areaCode == '511600' ? 'zxh' : '', declareInfo, isShowLoading)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              hideLoading()
              reject(err)
            })
        })
      },
      // 获取上传文件
      getUploadFiles() {
        this.isCanApply = false
        const { areaCode } = config
        const chi031 = this.chi031
        let file = []

        //如果是需要上传文件的项目则进行文件上传成功与否的校验，否则跳过
        if (this.isNeedFileProject) {
          const result = this.$refs.upload.checkFilesUploadStatus()
          // console.log(result, '=================')
          const resultData = result.data

          if (result.status === '0') {
            showModal(`${resultData[0].name_zh}还未上传成功，请检查！`)
            this.isCanApply = true
            return
          }

          // 自定义校验
          // 达州 517000 职业技能培训贫困学员交通生活补贴 20500 “职业资格证”和“职业技能培训合格证书”都是非必传材料要求用户必须二选一
          let checkTag = false // 检查标记
          if (resultData) {
            for (let i = 0, len = resultData.length; i < len; i++) {
              let { filename, fileid, che110, che092 } = resultData[i]
              const fileSubfix = filename.split('.')[filename.split('.').length - 1]
              file.push({
                che092,
                chi212: filename, // 文件名
                chi217: '', // 文件备注
                che110, // 材料id
                chi214: '.' + fileSubfix, // 文件类别
                chi215: fileid // 统一存储id
              })
              if (areaCode === '511700' && chi031 === '20500') {
                if (che092 === '400' || che092 === '715') {
                  checkTag = true
                }
              }
            }
          }
          // 校验结果
          if (!checkTag) {
            if (areaCode === '511700' && chi031 === '20500') {
              showModal('请选择“职业资格证”或“职业技能培训合格证书”材料上传，至少上传其中一种材料！')
              this.isCanApply = true
              return
            }
          }
        }

        this.$store.commit(UPDATE_DECLARE_INFO, {
          ...this.declareInfo,
          hi21List: JSON.stringify(file)
        })

        const { chb000, aee100 } = this.editSubsidyInfo
        if (chb000) {
          if (aee100 == '1') {
            this.handleReApply()
          } else {
            this.handleGoNextStep()
          }
        } else {
          this.handleGoNextStep()
        }
      },

      // 第一次/正常申报
      handleGoNextStep(file) {
        const chb006 = this.chb006
        const othersDeclareInfo = this.othersDeclareInfo
        const declareInfo = { ...this.declareInfo }
        // 未认证
        if (chb006 === '0') {
          redirectTo('apply', 'packageDeclare')
          this.isCanApply = true
        } else {
          // 同时申报多个项目
          if (othersDeclareInfo && othersDeclareInfo.chi031) {
            showLoading()
            Promise.all([
              this._requestB001(declareInfo, false),
              this._requestB001(
                {
                  ...declareInfo,
                  chi031: othersDeclareInfo.chi031
                },
                false
              )
            ])
              .then((res) => {
                redirectTo('result', 'packageDeclare', {
                  info: JSON.stringify(res)
                })
                hideLoading()
              })
              .finally(() => {
                this.isCanApply = true
                hideLoading()
              })
          } else {
            this._requestB001(this.declareInfo, file)
              .then((res) => {
                // chb000: '410135' 申报业务主键
                // chb01b: '1' 0 未校验 1 校验成功 2 校验失败
                // chr037: '校验成功'
                // cpb100: '10021631' 申报流程主键
                // const { chb01b, chr037, chb000 } = res
                // this.$store.commit(UPDATE_DECLARE_INFO, {
                //   chb01b,
                //   chr037,
                //   chb000,
                // })
                redirectTo('result', 'packageDeclare', {
                  info: JSON.stringify([res])
                })
                this.isCanApply = true
              })
              .catch((err) => {
                this.isCanApply = true
              })
          }
        }
      },
      // 重新申报 只针对内江助学金申请
      handleReApply() {
        showLoading()
        const declareInfo = this.declareInfo
        const { chb000 } = this.editSubsidyInfo

        requestB009(chb000, '修改申报信息再次申报时作废。', [], false, false)
          .then(() => {
            this._requestB001(declareInfo, false)
              .then((res) => {
                this.isCanApply = true
                redirectTo('result', 'packageDeclare', {
                  info: JSON.stringify([res])
                })
                hideLoading()
              })
              .catch(() => {
                this.isCanApply = true
                hideLoading()
              })
          })
          .catch(() => {
            this.isCanApply = true
            hideLoading()
            showModal('申报失败！')
          })
      }
    },
    computed: {
      ...mapGetters([DECLARE_INFO, USER_LIST, REFRESH_FILE, OTHERS_DECLARE_INFO, EDIT_SUBSIDY_INFO])
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .file {
    padding: $spacing 0;

    .button-wrapper {
      padding: $spacing;
    }

    .progress-wrapper {
      padding: 0 $spacing;
    }

    .upload-files {
      padding-top: $spacing;
    }
  }
</style>
