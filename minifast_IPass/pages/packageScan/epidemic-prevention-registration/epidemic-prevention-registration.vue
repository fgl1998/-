<template>
  <view class="epidemic-prevention-registration">
    <RegistrationInfo ref="RegistrationInfo"></RegistrationInfo>
    <!-- <div class="files">
      <block v-for="item in uploadFiles" :key="item.id">
        <div class="file">
          <UploadFile
            :name="item.markname"
            :isRequired="item.required === '1'"
            @change="handleChangeImage($event, item.markname)"
          ></UploadFile>
        </div>
      </block>
    </div> -->
    <div class="button-wrapper">
      <ComponentButton
        name="登记"
        type="primary"
        borderRadius="12rpx"
        height="80rpx"
        @click="handleSubmit"
      ></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'

import RegistrationInfo from './RegistrationInfo.vue'
// import UploadFile from './UploadFile.vue'

import { requestWXInsertRegister } from '@/service/api'
import { showModal, navigateTo, switchTab } from '@/utils/uni-api'

export default {
  name: 'pageEpidemicPreventionRegistration',
  data() {
    return {
      unitname: '' // 到访单位
      // uploadFiles: [] // 上传文件
    }
  },
  components: {
    ComponentButton,
    RegistrationInfo
    // UploadFile
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    // 设置到访单位
    if (e.unitname) {
      this.unitname = e.unitname
    }
  },
  methods: {
    // 上传材料更改
    // handleChangeFileData(data) {
    //   this.uploadFiles = [...data]
    // },
    // 改变图片
    // handleChangeImage(e, markname) {
    //   const data = [...this.uploadFiles]
    //   for (let i = 0, len = data.length; i < len; i++) {
    //     const item = data[i]
    //     if (item.markname === markname) {
    //       item.file = e
    //     }
    //   }
    //   this.uploadFiles = [...data]
    // },

    // 提交
    handleSubmit() {
      const formData = this.$refs.RegistrationInfo.returnFormData()
      const {
        aac002,
        aac003,
        tel,
        aka131,
        visitplace,
        content,
        place,
        visitnumber,
        isUpdate,
        id
      } = formData

      if (!aac002) {
        showModal('请登录后再访问').then((res) => {
          navigateTo('login', 'packageCommon')
        })
        return false
      }
      if (!aka131) {
        showModal('请选择人员类别')
        return false
      }
      if (!visitplace) {
        showModal('请输入您的来访单位名称，如无请输入暂无')
        return false
      }
      if (!place) {
        showModal('请选择您来自省市区')
        return false
      }
      if (!content) {
        showModal('请输入您的来访内容')
        return false
      }
      // if (!temperature) {
      //   showModal('请输入您当前的体温')
      //   return false
      // }
      // if (!showcode) {
      //   showModal('请选择是否出示健康码')
      //   return false
      // }

      // let isError = false
      // for (let i = 0, len = uploadFiles.length; i < len; i++) {
      //   const item = uploadFiles[i]
      //   if (item.required === '1') {
      //     if (!(item.file && item.file.fileid)) {
      //       isError = true
      //       showModal('请上传必传材料' + item.maname)
      //       break
      //     }
      //   }
      // }

      // if (isError) {
      //   return false
      // }

      // // files 里面包含所有上传的文件id
      // let files = []
      // for (let i = 0, len = uploadFiles.length; i < len; i++) {
      //   const item = uploadFiles[i]

      //   if (item.file && item.file.fileid) {
      //     files.push({
      //       epmaname: item.maname,
      //       materid: item.id,
      //       storageid: item.file.fileid,
      //       aae100: item.aae100
      //     })
      //   }
      // }

      requestWXInsertRegister(
        aac002,
        aac003,
        tel,
        aka131,
        this.unitname,
        content,
        place,
        visitnumber,
        visitplace,
        isUpdate,
        id
      ).then((res) => {
        showModal(isUpdate === '1' ? '修改成功' : '登记成功').then((res) => {
          switchTab('home')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.epidemic-prevention-registration {
  padding: $spacing 0;
  .files {
    padding-top: $spacing;
    .file {
      margin-bottom: $spacing;
    }
  }
  .button-wrapper {
    padding: $spacing;
  }
}
</style>
