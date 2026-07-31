<template>
  <xu-common-shell :title="loginInfo.aab004" type="2">
    <view class="contentBox">
      <view class="content">
        <view class="top">
          <view class="leftBox">
            <xu-common-title zh="基本信息" en="ESSENTIAL INFORMATION"> </xu-common-title>
            <view class="leftBox-c">
              <view class="leftBox_c_1">
                <view class="leftBox_c_item" style="width: 252px">
                  <view>摊位编号：</view>
                  <view>{{ bianhao }}</view>
                </view>
                <view class="leftBox_c_item" style="width: calc(100% - 252px)">
                  <view style="width: 126px">预计招聘人数：</view>
                  <view style="width: calc(100% - 126px)">{{ personNum }}</view>
                </view>
              </view>
              <view class="leftBox_c_item">
                <view>公司名称：</view>
                <view>{{ unitName }}</view>
              </view>
              <view class="leftBox_c_item company-intro">
                <view>公司简介：</view>
                <view>
                  <view @click="openEdit({ type: true })">
                    <!--                    {{ unitInfoDesc }}-->
                    <i v-dompurify-html="unitInfoDesc ? unitInfoDesc : '暂无简介'"></i>
                  </view>
                </view>
              </view>
              <view class="leftBox_c_2">
                <image src="../../static/images/gantan.png"></image>
                <view>点击输入框编辑简介内容</view>
              </view>

              <view class="leftBox_c_item">
                <view>公司地址：</view>
                <view>{{ unitAdress }}</view>
              </view>

              <view class="leftBox_c_3">
                <view class="leftBox_c_item" style="width: 160px">
                  <view>人事姓名：</view>
                  <view>{{ personName }}</view>
                </view>
                <view class="leftBox_c_item">
                  <view>手机：</view>
                  <view style="min-width: 100px">{{ phone1 ? phone1 : '暂无' }}</view>
                </view>
                <view class="leftBox_c_item">
                  <view>座机：</view>
                  <view style="min-width: 100px">{{ phone ? phone : '暂无' }}</view>
                </view>
              </view>

              <view class="leftBox_c_item">
                <view style="width: 110px">单位邮箱：</view>
                <view style="min-width: 100px">{{ email ? email : '暂无' }}</view>
              </view>

              <view class="leftBox_c_4">
                <view>企业风采：</view>
                <view @click="triggerFileInput('picture')">
                  <view>图片上传</view>
                </view>
                <!--后端沟通后屏蔽视频-->
                <!-- <view @click="triggerFileInput('video')">
                  <view>视频上传</view>
                </view> -->
                <!-- <view> </view> -->
              </view>

              <view class="album">
                <view class="lt" v-for="(item, index) in albumList">
                  <icon type="clear" color="#fff" size="20px" title="删除" @click="removePic(item.aae707)"></icon>
                  <video
                    v-if="isVideo(item.aae523)"
                    :src="$utils.getFileLoadUrl(item.aae707)"
                    controls
                    style="object-fit: cover"
                  />
                  <img v-else :src="$utils.getFileLoadUrl(item.aae707)" :key="index" />
                </view>
              </view>

              <view :class="['leftBox_c_5', albumList.length ? '' : 'mg-t']">
                <img :src="qrCodeUrl" alt="" />
                <view>更多详情请扫描二维码查看</view>
              </view>
            </view>
          </view>

          <view class="rightBox">
            <xu-common-title zh="招聘信息" en="RECRUITMENT INFORMATION"> </xu-common-title>
            <view class="rightNav">
              <view>
                <image src="../../static/images/zongshu.png"></image>
                <view
                  >招聘岗位总数：<span>{{ totalNum }}</span
                  >个</view
                >
              </view>
              <view>
                <image src="../../static/images/touren.png"></image>
                <view
                  >已投递人数：<span>{{ currentNum }}</span
                  >人</view
                >
              </view>
              <view @click="showAll">
                <image src="../../static/images/guanli.png"></image>
                <view>全部显示</view>
              </view>
            </view>

            <view class="rightList">
              <view v-for="(item, index) in listData" :key="index">
                <view>
                  <image src="../../static/images/remen.png" v-if="item.hot"></image>
                  <view>{{ item.acb213 }}</view>
                  <image src="../../static/images/xuan.png" v-if="item.show"></image>
                </view>
                <view>
                  <view v-for="(obj, index1) in item.tabList" :key="index1">
                    {{ obj }}
                  </view>
                </view>
                <view
                  >薪资待遇：<span>{{ item.acb21h }}{{ item.acb21j ? '-' + item.acb21j : '' }}</span
                  >元/月</view
                >
                <view>
                  <view :class="item.acb219 === '1' ? 'show' : 'noShow'" @click="checkShow(item, 1)">
                    {{ item.acb219 === '1' ? '已显示' : '显示职位' }}
                  </view>
                  <view :class="item.acb218 === '1' ? 'hot' : 'noHot'" @click="checkShow(item, 2)">
                    {{ item.acb218 === '1' ? '已标热门' : '标为热门' }}
                  </view>
                </view>
              </view>
            </view>

            <view class="pagination">
              <view>
                <view>共 {{ totalNum }} 条</view>
              </view>
              <view>
                <view @click="prevOrNext(-1)">上一页</view>
                <view
                  v-for="(item, index) in pages"
                  :key="index"
                  class="page"
                  :class="{ actived: item === currentPage }"
                  @click="select(item)"
                >
                  <span>{{ item }}</span>
                </view>
                <view @click="prevOrNext(1)">下一页</view>
              </view>
            </view>
          </view>
        </view>

        <view class="bottom">
          <view @click="openRelease({ type: true })">投屏预览</view>
          <view @click="openRelease({ type: true })">确认发布</view>
        </view>
      </view>
    </view>

    <unit-edit :editShow="editShow" @closeEdit="openEdit" :userInfo="unitInfoDesc" :aab004="unitName"></unit-edit>

    <!--投屏预览-->
    <unit-release
      :releaseShow="releaseShow"
      @closeRelease="openRelease({ type: false })"
      :brief="unitInfoDesc"
    ></unit-release>
  </xu-common-shell>
</template>

<script>
import unitEdit from './component/unitEdit.vue'
import unitRelease from './component/unitRelease.vue'

import QRCode from 'qrcode'

export default {
  name: 'unitMessage',
  components: {
    unitEdit,
    unitRelease,
  },
  data() {
    return {
      param1: {
        apiCode: 'jy201_hrm217',
        method: 'jy201_hrm217',
        aab001: '',
      },
      param2: {
        apiCode: 'jy201_hrm219',
        method: 'jy201_hrm219',
        aab001: '',
        isJq: true,
      },
      param3: {
        apiCode: 'jy204_hrm252',
        method: 'jy204_hrm252',
        action: '1',
        aab001: '',
        pageSize: 9,
        paginationModel: 'mostCount',
      },
      param4: {
        apiCode: 'jy201_hrm226',
        method: 'jy201_hrm226',
      },
      param5: {
        apiCode: 'jy201_hrm512',
        method: 'jy201_hrm512',
        aab001: '',
      },
      loginInfo: {},
      editShow: false,
      releaseShow: false,
      isFlag: false,
      bianhao: '',
      personNum: '',
      unitName: '',
      unitInfoDesc: '',
      personName: '',
      unitAdress: '',
      phone: '',
      phone1: '',
      email: '',
      totalNum: 0,
      currentNum: 0,
      currentPage: 1,
      totalPages: 10,
      listData: [],
      qrCodeUrlXcxUrl: null,
      albumList: [], //单位相册
      videoExt: ['mp4', 'm4v', 'mov', '3gp', 'flv', 'webm', 'm3u8'],

      qrCodeUrl: null,
    }
  },
  computed: {
    pages: {
      get() {
        const c = this.currentPage
        const t = this.totalPages
        const numArr = []
        if (t <= 7) {
          for (let i = 1; i <= t; i++) {
            numArr.push(i)
          }
          return numArr
        } else if (t > 7) {
          if (c <= 4) {
            return [1, 2, 3, 4, 5, '...', t]
          } else if (c >= t - 3) {
            return [1, '...', t - 4, t - 3, t - 2, t - 1, t]
          } else {
            return [1, '...', c - 1, c, c + 1, '...', t] // 第三种情况
          }
        }
      },
      set(v) {},
    },
  },
  mounted() {
    // 获取登录信息
    this.loginInfo = this.$loginConfig.getLoginInfo()
    let deviceId = uni.getStorageSync('deviceInfo_1')?.ace711
    // this.bianhao = uni.getStorageSync(this.$requestConstant.deviceCacheKey)
    this.bianhao = deviceId || ''
    // 获取企业基本信息
    this.unitInit()
    // 获取统计岗位数量与投递数量
    this.searchNum()
    // 查询有效职位列表
    this.jobListShow()
    //生成单位详情二维码
    this.createQRCode()
    this.createQRCodeBytext()
  },
  methods: {
    async createQRCodeBytext() {
      const text = `a=${this.loginInfo.aab001}&b=19&c=UT02&d=3`

      try {
        this.qrCodeUrl = await QRCode.toDataURL(text)
        console.log(this.qrCodeUrl, 'qrCodeUrl')
      } catch (error) {
        console.error(error, 'error')
      }
    },
    upload() {
      // this.$message.success('功能正在开发中')
    },
    showAll() {
      this.$http
        .post(
          this.$requestConstant.businessRequestType,
          'jy201_hrm227',
          null,
          {
            aab001: this.loginInfo.aab001,
            acb330: this.loginInfo.acb330,
          },
          true,
        )
        .then((responseData) => {
          this.jobListShow()
        })
    },
    // 上一页/下一页
    prevOrNext(n) {
      let num = this.currentPage
      num = num + n
      if (num < 1) {
        num = 1
      }
      if (num > this.totalPages) {
        num = this.totalPages
      }
      if (this.currentPage === num) {
        return
      } else {
        this.currentPage = num
      }
      // this.getDataList()
      this.jobListShow()
    },
    select(n) {
      if (n === this.currentPage) return
      if (typeof n === 'string') return
      this.currentPage = n
      // this.getDataList()
      this.jobListShow()
    },
    openEdit(obj) {
      this.editShow = obj.type
      if (obj.values && typeof obj.values === 'string') {
        this.unitInfoDesc = obj.values
      }
    },
    // 投屏预览
    openRelease(obj) {
      this.releaseShow = obj.type
    },
    checkRotate() {
      if (this.isFlag) {
        this.isFlag = false
      } else {
        this.isFlag = true
      }
    },
    unitInit() {
      this.param1.aab001 = this.loginInfo.aab001
      this.param1.acb330 = this.loginInfo.acb330
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm217', null, this.param1, true)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          const unitInfo = res.ab01HrmVO || {}
          this.unitName = unitInfo.aab004
          this.personNum = unitInfo.recuitnumber
          this.unitInfoDesc = unitInfo.aab092
          this.unitInfoDesc = this.$utils.htmlDecode(unitInfo.aab092)
          this.personName = unitInfo.aae004
          this.unitAdress = unitInfo.aab601
          this.phone = unitInfo.aac067
          this.phone1 = unitInfo.aae005
          this.email = unitInfo.aae159 // 单位邮箱
          this.albumList = unitInfo.ce23List || [] //单位相册
        })
    },
    searchNum() {
      this.param2.aab001 = this.loginInfo.aab001
      this.param2.acb330 = this.loginInfo.acb330
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm219', null, this.param2, true)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          const info = res.resultMap || {}
          this.totalNum = info.totalJob
          this.currentNum = info.totalPost
        })
    },
    jobListShow() {
      this.param3.aab001 = this.loginInfo.aab001
      this.param3.acb330 = this.loginInfo.acb330
      this.param3.pageNumber = this.currentPage
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy204_hrm252', null, this.param3, true)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          const jobInfo = res.pageBean || []
          // 职位列表数据
          this.listData = jobInfo.list.map((item) => {
            if (item.acb217) {
              let address = item.acb217.replaceAll('/', '')
              let reg = /.+?(省|市|自治区|自治州|县|区)/g // 省市区的正则
              let tabList = address.match(reg)
              if (tabList.length > 0) {
                tabList.forEach((e) => {
                  if (e.includes('市')) {
                    item.dizhi = e
                  }
                })
                if (!item.dizhi) {
                  item.dizhi = tabList[0]
                }
              } else {
                item.dizhi = item.acb217
              }
            }
            item.tabList = [
              item.acc217_dsc ? item.acc217_dsc : this.$codeConfig.getCodeLabel('ACC217', item.acc217),
              item.aac011_dsc ? item.aac011_dsc : this.$codeConfig.getCodeLabel('AAC011', item.aac011),
              item.dizhi,
              item.acb469_dsc ? item.acb469_dsc : this.$codeConfig.getCodeLabel('ACB469', item.acb469),
            ]
            item.tabList = item.tabList.filter((item) => item)

            return item
          })
          this.currentPage = jobInfo.pageNum
          this.totalPages = jobInfo.pages
        })
    },
    // 改变显示和热门
    checkShow(info, type) {
      if (type === 1) {
        // 显示职位与否
        if (info.acb219 && info.acb219 === '1') {
          this.param4.acb219 = '0'
        } else {
          this.param4.acb219 = '1'
        }
      } else {
        // 热门与否
        if (info.acb218 && info.acb218 === '1') {
          this.param4.acb218 = '0'
        } else {
          this.param4.acb218 = '1'
        }
      }
      this.param4.acb210 = info.acb210
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm226', null, this.param4, true)
        .then((responseData) => {
          let res = responseData.resultData ? responseData.resultData.data : {}
          this.listData.forEach((item) => {
            if (item.acb210 === info.acb210) {
              if (type === 1) {
                item.acb219 = this.param4.acb219
              } else {
                item.acb218 = this.param4.acb218
              }
            }
          })
          this.jobListShow()
        })
    },
    createQRCode() {
      let params = {
        page: 'pages/find/companyDetail/companyDetail',
        scene: `aab001=${this.loginInfo.aab001}`,
        responseType: 'arraybuffer',
      }
      this.$http.post('other', '/api/flexmini/getunlimitedqrcode', null, params, true, true).then((result) => {
        if (result) {
          const arrayBuffer = new Uint8Array(result)
          const base64 = uni.arrayBufferToBase64(arrayBuffer)
          const code = 'data:image/jpeg;base64,' + base64
          let obj = {
            serviceSuccess: true,
            code: code,
          }
          this.qrCodeUrlXcxUrl = obj.code
        }
      })
    },
    triggerFileInput(type) {
      let list, extension
      if (type === 'picture') {
        list = ['png', 'jpg', 'jpeg']
        extension = ['.png', '.jpg', '.jpeg']
      } else if (type === 'video') {
        list = ['mp4']
        extension = ['.mp4']
      }
      uni.chooseFile({
        count: 1,
        type: 'all',
        extension: extension,
        success: (res) => {
          let tempFile = res.tempFiles[0]
          let filename = tempFile.name
          let fileSize = tempFile.size
          let suffix = filename.substring(filename.lastIndexOf('.') + 1)
          //文件大小不能大于10M
          if (fileSize / 1024 / 1024 > 10) {
            this.$utils.showToast('上传文件太大，请传10M以内的文件', 'warning')
            return
          }
          if (list.filter((item) => item == suffix).length > 0) {
            let tempFilePaths = res.tempFilePaths[0]
            this.handleUpload(tempFilePaths, suffix)
          } else {
            this.$utils.showToast('文件格式不符合要求', 'warning')
          }
        },
      })
    },
    handleUpload(tempFilePaths, suffix) {
      uni.uploadFile({
        url: this.$fileUploadUrl,
        filePath: tempFilePaths,
        name: 'file',
        header: {
          channelCode: 'jyZpHall1',
          'TERMINAL-JTOKEN': this.$loginConfig.getToken(),
        },
        success: (ret) => {
          //成功回调
          let result = JSON.parse(ret.data)
          if (result.serviceSuccess) {
            let data = result.resultData.data
            if (data) {
              let { fileId, fileType, newFileName } = data
              this.albumList.push({
                aae707s: fileId,
                aae707: fileId,
                aae523: suffix,
                aae525: newFileName,
                imgUrl: this.$utils.getFileLoadUrl(fileId),
              })
              console.log(this.$utils.getFileLoadUrl(fileId))

              this.saveInfo(1)
            }
          } else {
            this.$utils.showToast(result.message)
          }
        },
      })
    },
    //保存公司信息
    saveInfo(optype) {
      this.param5.aab001 = this.loginInfo.aab001
      // this.param5.ce23ListStr = JSON.stringify(this.albumList)
      this.param5.aab004 = this.unitName
      this.param4.aab001 = this.loginInfo.aab001
      // this.param5 = { ...this.param5, ...this.albumList[0] }
      const aae707s = this.albumList.map((item) => item.aae707).join(',')
      this.param5.aae707s = aae707s

      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm512', null, this.param5, true)
        .then((responseData) => {
          if (responseData?.data?.resultMap?.code == 1) {
            if (optype == 1) {
              this.$utils.showToast('上传成功!', 'success')
            } else {
              this.$utils.showToast('移除成功!', 'success')
            }
          } else {
            if (optype == 1) {
              this.$utils.showToast('上传失败', 'warning')
            } else {
              this.$utils.showToast('移除失败', 'warning')
            }
          }
        })
    },

    //是否为视频格式
    isVideo(ext) {
      return this.videoExt.includes(ext)
    },

    //删除图片
    removePic(aae707) {
      this.albumList = this.albumList.filter((item) => {
        return item.aae707 != aae707
      })
      this.saveInfo(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
$leftBox-item-margin-top: 16px;

.fontStyle {
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  font-size: 18px;
  line-height: 32px;
  text-align: left;
  font-style: normal;
}

.contentBox {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 12px;
  overflow: auto;

  // ::-webkit-scrollbar {
  //   width: 10px;
  // }

  * {
    box-sizing: border-box;
    //border: 1px solid red;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 24px 32px;

    .top {
      width: 100%;
      height: calc(100% - 42px);
      display: flex;

      // 左边
      > .leftBox {
        width: 608px;
        height: 100%;
        padding-right: 32px;

        .leftBox-c {
          margin-top: 10px;

          .leftBox_c_1 {
            display: flex;
            align-items: center;
            white-space: nowrap;
          }

          .leftBox_c_2 {
            display: flex;
            align-items: center;
            white-space: nowrap;
            padding-left: 90px;

            > image {
              width: 15px;
              height: 15px;
              margin-right: 8px;
            }

            > view {
              @extend .fontStyle;
            }
          }

          .leftBox_c_3 {
            display: flex;
            align-items: center;
            white-space: nowrap;
          }

          .leftBox_c_4 {
            display: flex;
            align-items: center;
            white-space: nowrap;
            margin-top: $leftBox-item-margin-top;
            @extend .fontStyle;

            > view {
              display: flex;
              align-items: center;
            }

            > view:nth-child(2),
            > view:nth-child(3) {
              width: 154px;
              height: 34px;
              background: #f3f7ff;
              border-radius: 4px;
              border: 1px solid #1388fe;
              color: #1388fe;
              justify-content: space-around;
              margin-right: 12px;

              > image {
                width: 16px;
                height: 17px;
              }
            }

            > view:last-child {
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              margin-left: $leftBox-item-margin-top;

              > image {
                width: 17px;
                height: 17px;
                margin-right: 7px;
              }

              > view {
                > span:first-child {
                  color: dodgerblue;
                }

                > span:last-child {
                  color: green;
                }
              }
            }
          }

          .leftBox_c_5 {
            margin-top: $leftBox-item-margin-top;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            margin: 24px auto 0;

            &.mg-t {
              margin: 64px auto 0;
            }

            > img {
              width: 100px;
              height: 100px;
              margin-bottom: 12px;
            }
          }

          .album {
            display: flex;
            overflow-x: auto;
            flex-wrap: nowrap;
            margin-top: 12px;

            .lt {
              position: relative;

              &:not(:last-child) {
                margin-right: 12px;
              }

              icon {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 999;
              }

              video {
                width: 100px;
                height: 100px;
              }
            }

            img {
              width: 100px;
              height: 100px;
            }
          }
        }
      }

      // 右边
      > .rightBox {
        min-width: calc(100% - 608px);
        height: 100%;

        > .rightNav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;

          > view {
            display: flex;
            align-items: center;
            font-weight: 400;

            > image {
              margin-right: 8px;
            }

            > view {
              font-size: 20px;

              > span {
                font-weight: bold;
                margin-right: 8px;
              }
            }
          }

          > view:first-child {
            > image {
              width: 20px;
              height: 20px;
            }

            > view {
              > span {
                color: #0682fe;
              }
            }
          }

          > view:nth-child(2) {
            > image {
              width: 22px;
              height: 22px;
            }

            > view {
              > span {
                color: #11a825;
              }
            }
          }

          > view:last-child {
            cursor: pointer;

            > image {
              width: 20px;
              height: 16px;
            }

            > view {
              font-weight: bold;
              color: #0682fe;
            }
          }
        }

        > .rightList {
          display: flex;
          flex-wrap: wrap;
          padding-top: 10px;
          height: calc(100% - 150px);

          > view {
            width: calc((100% - 16px * 3) / 3);
            height: 180px;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #eeeeee;
            padding: 10px 24px 0 24px;
            margin-right: 16px;
            margin-bottom: 16px;

            > view:first-child {
              display: flex;
              align-items: center;
              justify-content: space-between;

              > image {
                width: 20px;
                height: 20px;
              }

              > view {
                font-size: 18px;
                font-weight: bold;
                color: #333333;
              }
            }

            > view:nth-child(2) {
              display: flex;
              margin-top: 12px;

              > view {
                padding: 8px 2px;
                background: #f8f8f8;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 400;
                color: #666666;
                margin-right: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

            > view:nth-child(3) {
              font-size: 16px;
              font-weight: 400;
              color: #999999;
              margin-top: 12px;

              > span {
                font-weight: bold;
                color: #fe2c2c;
              }
            }

            > view:last-child {
              display: flex;
              align-items: center;
              margin-top: 12px;

              > view {
                width: 140px;
                height: 30px;
                border-radius: 4px;
                text-align: center;
                line-height: 30px;
                font-size: 16px;
                font-weight: 400;
                cursor: pointer;
              }

              > view:first-child {
                margin-right: 20px;
              }

              > view.show {
                border: 1px solid #b4e9b8;
                background: #f2fff5;
                color: #07b313;
              }

              > view.noShow {
                background: #4592fe;
                color: #ffffff;
              }

              > view.hot {
                background: #fff2f2;
                border: 1px solid #ff6868;
                color: #ff6868;
              }

              > view.noHot {
                background: #ff6868;
                color: #ffffff;
              }
            }
          }

          > view:nth-child(3n + 3) {
          }
        }

        > .pagination {
          position: relative;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;

          > view:first-child {
            font-size: 16px;
            font-weight: 400;
            color: #999999;

            > span {
              color: #007dee;
              font-weight: bolder;
            }
          }

          > view:last-child {
            display: flex;
            align-items: center;

            > view {
              width: 42px;
              height: 38px;
              background: #ffffff;
              border-radius: 4px;
              border: 1px solid #eeeeee;
              text-align: center;
              line-height: 38px;
              font-size: 16px;
              font-weight: 400;
              color: #999999;
              margin-right: 10px;
            }

            > view:first-child,
            > view:last-child {
              width: 65px;
            }

            > view:last-child {
              margin-right: 0;
            }

            > view.actived {
              color: #fff;
              background-color: #007dee !important;
            }
          }
        }
      }
    }

    .bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 0;

      > view {
        width: 320px;
        height: 42px;
        border-radius: 4px;
        font-size: 18px;
        font-weight: 400;
        text-align: center;
        line-height: 42px;
        cursor: pointer;
      }

      > view:first-child {
        background-color: #eaeff8;
        color: #666666;
        margin-right: 24px;
      }

      > view:last-child {
        background-color: #1f8cff;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
}

.leftBox {
  .leftBox-c {
    .leftBox_c_item {
      display: flex;
      align-items: center;
      padding-bottom: $leftBox-item-margin-top;
      @extend .fontStyle;

      > view:first-child {
        color: #333333;
        min-width: 90px;
      }

      > view:last-child {
        color: #666666;
        background: #eaeff8;
        width: 100%;
      }

      &.company-intro {
        > view:last-child {
          max-height: 140px;
          overflow: auto;
        }
      }
    }
  }
}
</style>
