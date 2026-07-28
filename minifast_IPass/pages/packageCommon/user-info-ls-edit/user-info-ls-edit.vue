<template>
  <view class="user-info h5-page">
    <ComponentPanel title="修改个人信息">
      <div class="panel-content">
        <div class="input-wrapper required">
          <label for="" class="label">姓名</label>
          <div class="value">{{ personalInfo.userNameDesc }}</div>
        </div>
        <div class="input-wrapper required">
          <label for="" class="label">身份证号</label>
          <div class="value">{{ personalInfo.idCardDesc }}</div>
        </div>
        <div class="input-wrapper required">
          <label for="" class="label">联系电话</label>
          <div class="value">{{ personalInfo.telDesc }}</div>
        </div>
        <div class="input-wrapper required">
          <label for="" class="label">户籍地址</label>
          <ComponentPicker
            idName="address"
            type="address"
            placeholder="请选择户籍地址"
            v-model="personalInfo.aac021"
            :address="personalInfo.aac021Arr"
            @change="handleChangePicker"
          ></ComponentPicker>
        </div>
        <div class="input-wrapper required">
          <label for="" class="label">变更原因</label>
          <ComponentPicker
            idName="che476"
            placeholder="请选择变更原因"
            rangeKey="aaa103"
            valueKey="aaa102"
            v-model="personalInfo.che476"
            :range="codeTableData.che476"
            @change="handleChangePicker"
          ></ComponentPicker>
        </div>
        <div class="input-wrapper required">
          <label for="" class="label">变更说明</label>
          <textarea
            class="textarea"
            placeholder="请输入变更说明"
            maxlength="100"
            v-model="personalInfo.che475"
          ></textarea>
        </div>
      </div>
    </ComponentPanel>

    <div class="file-wrapper">
      <UploadFiles
        ref="upload"
        :renderList="uploadFileRenderList"
      ></UploadFiles>
    </div>

    <div class="button-wrapper">
      <ComponentButton
        name="保存"
        type="primary"
        @click="handleSave"
      ></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'
import UploadFiles from './UploadFiles.vue'

import { navigateBack, showModal } from '@/utils/uni-api'
import { requestB144, requestB163 } from '@/service/api'
import { USER_INFO } from '@/store/constants' // 常量
import {
  useFormatUserName,
  useFormatIDCardNumber,
  useFormatPhoneNumber,
} from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { mapGetters } from 'vuex'

export default {
  name: 'pageUserInfoLSEdit',
  data() {
    return {
      personalInfo: {
        userName: '', // 姓名
        userNameDesc: '',
        idCard: '', // 身份证号
        idCardDesc: '',
        tel: '', // 联系方式
        telDesc: '',
        aac021: '', // 户籍地址
        chb015: '',
        chb017: '',
        chb018: '',
        aac021Arr: [],
        che476: '', // 变更原因
        che475: '', // 变更说明
      },
      imgList: [], // 上传材料
      uploadFileRenderList: [],
      codeTableData: {
        che476: [],
      },
    }
  },
  components: {
    ComponentPanel,
    ComponentButton,
    ComponentPicker,
    UploadFiles,
  },
  onLoad(e) {
    // 获取码表
    getCodeListByCodeName('che476').then((res) => {
      this.codeTableData = { che476: res }
    })

    requestB144('22222_he47', '14').then((res) => {
      const { list } = res.lists.he11List
      if (list && list.length > 0) {
        this.uploadFileRenderList = [...list]
      }
    })
  },
  methods: {
    // 获取数据
    getData() {
      const { idCard, userName, tel, aac021, aac021Arr } = this.userInfo
      this.personalInfo = {
        userName, // 姓名
        userNameDesc: useFormatUserName(userName),
        idCard, // 身份证号
        idCardDesc: useFormatIDCardNumber(idCard),
        tel, // 联系方式
        telDesc: useFormatPhoneNumber(tel),
        aac021, // 户籍地址
        aac021Arr,
      }
    },
    // 保存
    handleSave() {
      const { chb015, chb017, chb018, tel, idCard, userName, che476, che475 } =
        this.personalInfo

      const param = {
        aac003: userName,
        aac002: idCard,
        aae005: tel,
        chb015,
        // chb015: '165003',
        chb017,
        // chb017: '165035',
        chb018,
        // chb018: '165715',
        che476,
        che475,
        hi21List: '',
      }

      if (!che476) {
        showModal('请选择变更原因')
        return
      }
      if (!che475) {
        showModal('请输入变更说明')
        return
      }

      const result = this.$refs.upload.checkFilesUploadStatus()
      const resultData = result.data
      if (result.status === '0') {
        showModal(`${resultData[0].name_zh}还未上传成功，请检查！`)
        return
      }

      let file = []
      if (resultData) {
        for (let i = 0, len = resultData.length; i < len; i++) {
          let { filename, fileid, che110, che092 } = resultData[i]
          const fileSubfix = filename.split('.')[filename.split('.').length - 1]
          file.push({
            che092,
            chi212: filename, // 文件名
            chi217: '户籍地址变更', // 文件备注
            che110, // 材料id
            chi214: '.' + fileSubfix, // 文件类别
            chi215: fileid, // 统一存储id
          })
        }
      }

      param.hi21List = JSON.stringify(file)

      showModal(
        '每人每月仅能提交一次修改申请，请问是否提交？',
        '提示',
        true
      ).then(() => {
        requestB163(param).then((res) => {
          showModal('提交成功，我们会尽快给您审核！').then(() => {
            navigateBack(2)
          })
        })
      })
    },
    // 户籍地址改变
    handleChangePicker(id, value) {
      if (id === 'address') {
        let chb015 = ''
        let chb017 = ''
        let chb018 = ''

        if (value && value.length > 0) {
          const v0 = value[0]
          const v1 = value[1]
          const v2 = value[2]
          if (v0 && v0.orgid) {
            chb015 = v0.orgid
          }
          if (v1 && v1.orgid) {
            chb017 = v1.orgid
          }
          if (v2 && v2.orgid) {
            chb018 = v2.orgid
          }
        }
        this.personalInfo = {
          ...this.personalInfo,
          chb015,
          chb017,
          chb018,
        }
      }
    },
  },
  computed: {
    ...mapGetters([USER_INFO]),
  },
  watch: {
    'userInfo.user_id': {
      handler(val) {
        if (val) {
          this.getData()
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.user-info {
  padding: $spacing;
  .button-wrapper {
    padding-top: $spacing;
  }

  .input-wrapper {
    .label {
      position: relative;
      &::before {
        display: none;
        content: '*';
        position: absolute;
        transform: translateY(-50%);
        left: 0;
        top: 50%;
        color: #f00;
        margin-top: -8rpx;
      }
    }
    &.required {
      .label {
        display: block;
        padding-left: 16rpx;
        &::before {
          display: block;
        }
      }
    }
  }

  .value {
    width: 100%;
    padding: 0 16rpx;
    font-size: 28rpx;
    line-height: 72rpx;
    height: 72rpx;
    background-color: #f0f2f5;
    border-radius: 8rpx;
    color: $color;
    font-weight: 500;
    opacity: 0.6;
  }
  textarea {
    width: 100%;
    height: 200rpx;
    padding: 12rpx;
    color: $color;
    font-size: 28rpx;
    line-height: 36rpx;
    background-color: #f0f2f5;
    text-align: left;
    border-radius: 8rpx;
  }
  .file-wrapper {
    margin-top: $spacing;
  }
}
</style>
