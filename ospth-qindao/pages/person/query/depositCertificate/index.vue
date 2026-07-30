<template>
  <view class="remit-content-layout">
    <!--公积金缴存证明-->
    <view class="con_layout">
      <view class="title_font">
        <view class="return_btn" @click="returnLast">
          <van-icon name="arrow-left" size="18px" />
        </view>
        <text class="title_text">公积金缴存证明</text>
      </view>

      <view class="header_layout">
        <view class="text">
          住房公积金缴存证明是汕尾市住房公积金管理中心出具的职工缴存住房公积金的凭证，在个人网上服务大厅和管理部打印的本证明具有同等效力。
        </view>
        <van-button :disabled="disabled" type="primary" color="#1492ff" class="btn-blue" @click="down">
          下载
        </van-button>
      </view>
      <view class="img-wrap">
        <view class="pdf-tip">
          <text>小程序端将使用系统 PDF 查看器打开文档</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import commonMixin from '@osppm/mixin/common.js'
import moment from 'moment/moment'

const name = 'depositCertificate'
export default {
  name,
  components: {},
  mixins: [commonMixin],
  props: {
    personAccountState: {
      default: '',
    },
  },
  data () {
    return {
      // 业务流水号
      busCode: '',
      // 单位账号
      corpAcc: '',
      disabled: true,
      // 开始时间
      startDate: null,
      // 是否打开开始时间选择框
      startOpen: false,
      // 结束时间
      endDate: null,
      // 是否打开结束时间选择框
      endOpen: false,
      // 公共业务申请对象
      commonBizApply: {
        ywdjh: '',
        bizApplyType: 'MP020',
      },
    }
  },
  onLoad (options) {
    if (options?.projectNo) {
      this.setYwdjh(options.projectNo)
    }
  },
  async mounted () {
    // 查询账户信息，只传递前端获取的参数
    await this.queryRemittance({
      bizApplyType: 'MP020', // 只传递业务类型，ywdjh 在 store 中处理
      startDate: moment().format('YYYY-MM-DD'),
      expiryDate: moment().format('YYYY-MM-DD'),
    })

    try {
      setTimeout(() => {
        this.disabled = false
        this.downFundDepositCertificate('view')
      }, 1000)
    } catch (e) {
      uni.showToast({ title: e?.message || e || '加载失败', icon: 'none' })
    }
  },
  computed: {
    ...mapState(name, ['ywdjh', 'accInfo']),
  },
  methods: {
    ...mapActions(name, [
      'getDepositCertificateShow',
      'queryRemittance',
      'buildDepositCertificateDownloadParams'
    ]),
    ...mapMutations(name, ['setYwdjh']),
    // 点击下载，弹出身份认证框
    down () {
      this.sure()
    },
    // 身份验证结果，如果有电子签约，则可以进行下载，如果没有，弹出提示框
    sure () {
      // 身份认证通过后调用下载pdf 方法
      this.downFundDepositCertificate('down')
    },
    // 下载公积金缴存证明, type 'down'-下载pdf type-'view  导出html 页面查看
    async downFundDepositCertificate (showType) {
      if (showType === 'view') {
        try {
          // 先调用 getDepositCertificateShow 检查
          const response = await this.getDepositCertificateShow({
            bizApplyType: 'MP020', // 只传递业务类型，ywdjh 和 grzh 在 store 中处理
          })
          console.log("response",response)
          if (response.data.list[0].status === false) {
            const errorMessage = response.data.list[0].errorMsg || '获取缴存证明失败，请稍后重试'
            uni.showModal({
              title: '温馨提示',
              content: errorMessage,
              showCancel: false,
              success: () => {
                uni.navigateBack()
              }
            })
            return // 异常后不继续执行
          }

          // 只传递前端获取的参数，参数处理交给 store
          const downloadParams = await this.buildDepositCertificateDownloadParams({
            showType,
            bizApplyType: 'MP020', // 只传递业务类型，ywdjh 在 store 中处理
          })

          const result = await this.downloadReportNLC014(downloadParams)
          // 检查响应是否是字符串（可能是 PDF 内容）
          if (typeof result === 'string' && result.startsWith('%PDF')) {
            console.error('错误：接收到 PDF 文件流而不是 JSON 响应')
            throw new Error('接口返回格式错误，请重试')
          }

          // 处理不同的响应格式：可能是 result.data.data 或 result.data 或 result
          const fileBase64 = result?.data?.fileBase64 || result?.data?.fileBase64 || result?.fileBase64
          console.log("fileBase64",fileBase64)
          if (fileBase64) {
            this.loadPdf(fileBase64)
          } else {
            console.error('未找到 fileBase64，响应结构:', JSON.stringify(result, null, 2))
            throw new Error('获取文件数据失败，请重试')
          }
        } catch (e) {
          const errorMessage = e?.message || e?.toString() || '操作失败，请稍后重试'
          uni.showModal({
            title: '温馨提示',
            content: errorMessage,
            showCancel: false,
            success: () => {
              uni.navigateTo({ url: '/pages/home/account/index' })
            }
          })
        }
      } else {
        try {
          // 只传递前端获取的参数，参数处理交给 store
          const downloadParams = await this.buildDepositCertificateDownloadParams({
            showType,
            bizApplyType: 'MP020', // 只传递业务类型，ywdjh 在 store 中处理
          })

          await this.downloadReportNLC014(downloadParams)
        } catch (e) {
          const errorMessage = e?.message || e?.toString() || '下载失败，请稍后重试'
          uni.showModal({
            title: '温馨提示',
            content: errorMessage,
            showCancel: false,
            success: () => {
              uni.navigateBack()
            }
          })
        }
      }
    },
    returnLast () {
      uni.navigateTo({ url: '/pages/home/account/index' })
    },
    // 解决滚动页面时时间选择弹窗不跟随滚动
    setCalendarContainer (trigger) {
      // 移动端不需要此方法
      return null
    },
    handleStartOpenChange (open) {
      this.startOpen = open
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    async loadPdf (base64PdfData) {
      // 小程序端：使用 uni.openDocument 打开系统 PDF 查看器
      try {
        // 1. 检查是否支持文件系统 API（仅小程序支持）
        // #ifdef H5
        uni.showToast({
          title: 'H5 端不支持 PDF 预览，请使用小程序打开',
          icon: 'none',
          duration: 3000
        })
        return
        // #endif

        // #ifndef H5
        // 2. 将 Base64 数据转换为 ArrayBuffer
        const pdfArrayBuffer = this.base64ToArrayBuffer(base64PdfData)

        // 3. 获取文件系统管理器
        if (typeof uni.getFileSystemManager === 'undefined') {
          uni.showToast({
            title: '当前环境不支持 PDF 预览',
            icon: 'none'
          })
          return
        }
        const fs = uni.getFileSystemManager()

        // 4. 生成临时文件路径
        let basePath = ''
        try {
          // #ifdef MP-WEIXIN
          if (typeof wx !== 'undefined' && wx.env && wx.env.USER_DATA_PATH) {
            basePath = wx.env.USER_DATA_PATH
          }
          // #endif
          // #ifndef MP-WEIXIN
          // 其他小程序平台尝试获取临时目录
          if (typeof uni !== 'undefined' && uni.env && uni.env.USER_DATA_PATH) {
            basePath = uni.env.USER_DATA_PATH
          }
          // #endif
        } catch (e) {
          console.warn('获取临时文件路径失败，使用默认路径:', e)
        }

        // 生成文件路径
        const fileName = `deposit_certificate_${Date.now()}.pdf`
        // 如果 basePath 存在，使用完整路径；否则使用相对路径（小程序会自动处理）
        const filePath = basePath ? `${basePath}/${fileName}` : fileName

        // 5. 将 ArrayBuffer 写入临时文件
        try {
          fs.writeFileSync(filePath, pdfArrayBuffer, 'binary')
        } catch (writeError) {
          console.error('文件写入失败:', writeError)
          uni.showToast({
            title: '文件写入失败，请稍后重试',
            icon: 'none'
          })
          return
        }

        // 6. 使用 uni.openDocument 打开 PDF 文件
        uni.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          success: () => {
            console.log('PDF 打开成功')
          },
          fail: (err) => {
            console.error('PDF 打开失败:', err)
            uni.showToast({
              title: err.errMsg || 'PDF 打开失败，请稍后重试',
              icon: 'none'
            })
          }
        })
        // #endif
      } catch (error) {
        console.error('PDF 处理失败:', error)
        uni.showToast({
          title: 'PDF 处理失败，请稍后重试',
          icon: 'none'
        })
      }
    },
    base64ToArrayBuffer (base64) {
      // 小程序端使用 uni.base64ToArrayBuffer
      return uni.base64ToArrayBuffer(base64)
    },
  },
}
</script>

<style scoped lang="scss">
.title_font {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #000;
  margin-bottom: 24rpx;

  .return_btn {
    margin-right: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48rpx;
    height: 48rpx;
  }

  .title_text {
    flex: 1;
  }
}

.con_layout {
  padding: 24rpx;
  background-color: #f5f5f5;
  min-height: 100vh;

  .header_layout {
    display: flex;
    flex-direction: column;
    margin-top: 24rpx;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;

    .btn-blue {
      width: 100%;
      margin-top: 24rpx;
    }

    .text {
      width: 100%;
      color: #ff4444;
      font-size: 28rpx;
      line-height: 1.6;
    }
  }

  .img-wrap {
    margin-top: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;

    .pdf-tip {
      width: 100%;
      padding: 48rpx 24rpx;
      text-align: center;
      color: #999;
      font-size: 28rpx;
      line-height: 1.6;
    }
  }
}
</style>
