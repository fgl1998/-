<template>
  <view class="declare">
    <ComponentPanel title="基本信息">
      <div class="panel-content">
        <div class="cell-items">
          <div class="cell-item required disabled">
            <div class="key">身份证号</div>
            <div class="value">
              {{ aac002 }}
            </div>
          </div>
          <div class="cell-item required disabled">
            <div class="key">姓名</div>
            <div class="value">
              {{ aac003 }}
            </div>
          </div>
          <ComponentDeclarePicker
            label="申请原因"
            idName="cac162"
            :range="codeMap.cac162"
            placeholder="请选择申请原因"
            v-model="cac162"
          ></ComponentDeclarePicker>
          <ComponentSelectPermanentAddress
            v-model="cac161"
            disabled
            @change="handleChangePermanentAddress"
          ></ComponentSelectPermanentAddress>
          <div class="cell-item required textarea last">
            <div class="key">申请说明</div>
            <div class="value">
              <textarea
                placeholder="请输入申请说明"
                maxlength="100"
                v-model="cac163"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </ComponentPanel>
    <div class="space-top-wrapper">
      <ComponentPanel title="材料上传">
        <div class="panel-content">
          <ComponentUploadImages
            :uploadNum="10"
            isUploadServer
            uploadTip="若有相应补充材料，请点击上传"
            @change="handleChangeUploadImages"
          ></ComponentUploadImages>
        </div>
      </ComponentPanel>
    </div>

    <!-- end  在以上代码中根据项目需求更改-->
    <div class="button-wrapper">
      <ComponentButton
        @click="handleApply"
        name="提交申请"
        type="primary"
      ></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentUploadImages from '@/components/common/ez-upload-images/ez-upload-images.vue'

import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal, switchTab } from '@/utils/uni-api'
import { requestSPSaveAc16ForWX } from '@/service/api'
import { DECLARE_INFO } from '@/store/constants/index' // 常量
import { mapGetters } from 'vuex'
export default {
  name: 'pageApply',
  data() {
    return {
      cac161: '', // 户籍地址
      cac162: '', // 申请原因
      cac163: '', // 申请说明
      aac003: '', // 提交者姓名
      aac002: '', // 提交者身份证
      chb015: '', // 受理区县
      chb017: '', // 受理乡镇
      chb018: '', // 受理村
      cac16d: '', // 放行申请类型 1 首次申报放行 2 周期生存认证放行
      cac16e: '', // 代办人身份证
      cac16f: '', // 代办人姓名
      chi031: '', // 补贴项目编号
      codeMap: {},
      imgList: [],
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentSelectPermanentAddress,
    ComponentDeclarePicker,
    ComponentUploadImages,
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {},
  // 监听页面初次渲染完成
  onReady() {
    // 申请原因
    getCodeListByCodeName('CAC162').then((res) => {
      this.codeMap = {
        ...this.codeMap,
        cac162: res,
      }
    })
  },
  // 监听页面显示
  onShow() {
    this.getData()
  },
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取数据
    getData() {
      const {
        aac002,
        aac003,
        aae006,
        chb00y,
        chi031,
        chb00z,
        chb015,
        chb017,
        chb018,
      } = this.declareInfo
      this.aac002 = aac002
      this.aac003 = aac003
      this.cac161 = aae006

      this.chi031 = chi031

      this.cac16e = chb00z
      this.cac16f = chb00y
      this.chb015 = chb015
      this.chb017 = chb017
      this.chb018 = chb018
    },
    // 图片上传改变
    handleChangeUploadImages(files) {
      const imgList = []
      if (files && files.length > 0) {
        files.map((item) => {
          imgList.push({
            chi212: item.fileName,
            che092: item.id,
            chi214: item.suffix,
            chi215: item.id,
          })
        })
      }
      this.imgList = [...imgList]
    },
    // 生存认证放行申请
    handleSubmitApply() {
      let declareInfo = this.declareInfo
      declareInfo = {
        ...declareInfo,
        hi21Lists: declareInfo.hi21List,
        userLists: declareInfo.userList,
      }
      requestSPSaveAc16ForWX(
        this.cac161,
        this.cac162,
        this.cac163,
        this.aac003,
        this.aac002,
        this.chb015,
        this.chb017,
        this.chb018,
        this.chi031,
        '1',
        this.cac16e,
        this.cac16f,
        declareInfo,
        this.imgList
      ).then(() => {
        showModal('已成功提交申请，申请通过后，生存校验状态将自动回复！').then(
          () => {
            switchTab('home')
          }
        )
      })
    },
    // 校验必填项
    handleCheck() {
      const cac162 = this.cac162
      const cac163 = this.cac163
      if (!cac162) {
        showModal('请选择申请原因')
        return false
      }
      if (!cac163) {
        showModal('请输入申请说明')
        return false
      }
      return true
    },
    // 点击申请按钮
    handleApply() {
      if (!this.handleCheck()) {
        return
      }
      this.handleSubmitApply()
    },
  },
  computed: {
    ...mapGetters([DECLARE_INFO]),
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.apply {
  padding: $spacing;
}
</style>
