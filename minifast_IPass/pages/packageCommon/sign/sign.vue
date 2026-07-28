<template>
  <div class="sign">
    <canvas id="signCanvas" canvas-id="signCanvas" @touchstart="handletouchstart" @touchend="handletouchend"
      @touchmove="handletouchmove"></canvas>
    <div class="bottom">
      <div class="btn" :class="{ 'btn-active': isCheckbtn == 1 }" @click="
  isShowLine = !isShowLine
        isShowColor = false
isCheckbtn = isCheckbtn == 1 ? '' : 1
      ">
        <block v-if="btnType == 'text'">
          <div>粗细</div>
        </block>
        <block v-else>
          <img :src="image01" />
        </block>
      </div>
      <div class="btn" :class="{ 'btn-active': isCheckbtn == 2 }" @click="
  isShowColor = !isShowColor
        isShowLine = false
isCheckbtn = isCheckbtn == 2 ? '' : 2
      ">
        <block v-if="btnType == 'text'">
          <div>颜色</div>
        </block>
        <block v-else>
          <img :src="image05" />
        </block>
      </div>
      <div class="btn" @click="handleCancel">
        <block v-if="btnType == 'text'">
          <div>撤销</div>
        </block>
        <block v-else>
          <img :src="image03" />
        </block>
      </div>
      <div class="btn" @click="handleClear">
        <block v-if="btnType == 'text'">
          <div>清空</div>
        </block>
        <block v-else>
          <img :src="image02" />
        </block>
      </div>
      <div class="btn" @click="handleSaveSign">
        <block v-if="btnType == 'text'">
          <div>保存</div>
        </block>
        <block v-else>
          <img :src="image04" />
        </block>
      </div>
      <div class="bubble" :style="{ left: isShowColor ? '140rpx' : '0' }" v-if="isShowLine || isShowColor">
        <div class="line" v-if="isShowLine">
          <div class="line-item" v-for="(item, index) in lineArr" :key="index"
            :class="{ 'line-active': isCheckedLine == index }" @click="handleCheckLine(index)">
            {{ item.text }}
          </div>
        </div>
        <div class="color" v-if="isShowColor">
          <div class="color-item" v-for="(item, index) in colorArr" :key="index"
            :class="{ 'color-active': isCheckedColor == index }" @click="handleCheckColor(index)"
            :style="{ background: item }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import image01 from './images/01.png'
import image02 from './images/02.png'
import image03 from './images/03.png'
import image04 from './images/04.png'
import image05 from './images/05.png'

import { redirectTo, uploadFile, showModal } from '@/utils/uni-api'
import config from '@/config/index'

export default {
  name: 'sign',
  data() {
    return {
      image01,
      image02,
      image03,
      image04,
      image05,
      StrokeColor: '#000000',
      PointsArr: [],
      isCheckedLine: '0',
      lineArr: [
        {
          text: '小',
          size: '2',
        },
        {
          text: '中',
          size: '4',
        },
        {
          text: '大',
          size: '8',
        },
      ],
      // 展示line
      isShowLine: false,
      lineSize: '2',
      colorArr: ['#000000', '#d81212', '#cccccc'],
      isShowColor: false,
      isCheckedColor: 0,
      // 选中btn
      isCheckbtn: '',
      urlUpload: '/upload/uploadFile',
      lastPoint: [],
      first: false,
      context: '',
      btnType: 'text',
    }
  },
  methods: {
    // 开始触碰
    handletouchstart(e) {
      this.closeAllCheck()
      let pointArr = [e.changedTouches[0].x, e.changedTouches[0].y]
      let arr = [
        {
          color: this.StrokeColor,
          size: this.lineSize,
        },
      ]
      arr.push(pointArr)
      this.PointsArr.push(arr)

      this.context.beginPath()
      this.context.setStrokeStyle(this.StrokeColor)
      this.context.setLineWidth(this.lineSize)
      this.lastPoint = [...pointArr]
    },
    // 触碰移动触发
    handletouchmove(e) {
      let pointArr = [e.changedTouches[0].x, e.changedTouches[0].y]
      let key = this.PointsArr.length - 1
      this.PointsArr[key].push(pointArr)

      this.context.moveTo(...this.lastPoint)
      this.context.lineTo(...pointArr)
      this.context.stroke()
      this.context.draw(true)
      this.lastPoint = [...pointArr]
    },
    handletouchend(e) {
      let pointArr = [e.changedTouches[0].x, e.changedTouches[0].y]
      let key = this.PointsArr.length - 1
      this.PointsArr[key].push(pointArr)

      this.context.moveTo(...this.lastPoint)
      this.context.lineTo(...pointArr)
      this.context.stroke()
      this.context.draw(true)

      this.handlerLineDrawAgin()
    },
    // 重绘最后一条线
    handlerLineDrawAgin() {
      let key = this.PointsArr.length - 1
      this.PointsArr[key].forEach((one, i) => {
        if (i == 0) {
          this.context.beginPath()
          this.context.setStrokeStyle(this.StrokeColor)
          this.context.setLineWidth(this.lineSize)
        } else {
          if (i == 1) {
            this.context.moveTo(...one)
          } else {
            this.context.lineTo(...one)
          }
          if (i == this.PointsArr[key].length - 1) {
            this.context.stroke()
          }
        }
      })
      this.context.draw(true)
    },
    // 绘制图形
    async handlerDraw() {
      this.context.draw()
      let { width, height } = await this.getDescBox()
      this.context.fillStyle = '#FFFFFF'
      this.context.fillRect(0, 0, width, height)
      this.PointsArr.forEach((item, index) => {
        item.forEach((one, i) => {
          if (i == 0) {
            this.context.beginPath()
            this.context.setStrokeStyle(one.color)
            this.context.setLineWidth(one.size)
          } else {
            if (i == 1) {
              this.context.moveTo(...one)
            } else {
              this.context.lineTo(...one)
            }
            if (i == item.length - 1) {
              this.context.stroke()
            }
          }
        })
      })
      this.context.draw(true)
    },
    // 撤销
    handleCancel() {
      this.PointsArr.pop()
      this.handlerDraw()
    },
    // 清空选中
    closeAllCheck() {
      this.isShowColor = false
      this.isCheckbtn = ''
      this.isShowLine = false
    },
    // 清空画布
    handleClear() {
      this.PointsArr = []
      this.handlerDraw()
    },
    // 选中粗细
    handleCheckLine(index) {
      this.isCheckedLine = index
      this.lineSize = this.lineArr[index].size
    },
    // 选中颜色
    handleCheckColor(index) {
      this.isCheckedColor = index
      this.StrokeColor = this.colorArr[index]
    },
    async handleSaveSign() {
      if (this.PointsArr.length == 0) {
        showModal('请录入签名')
        return
      }
      // let {
      // 	width,
      // 	height
      // } = await this.getDescBox()
      let that = this
      uni.canvasToTempFilePath({
        canvasId: 'signCanvas',
        fileType: 'png',
        success(res) {
          let file = {
            path: res.tempFilePath,
          }
          that.requestUploadFile(file).then((fileData) => {
            const data = JSON.parse(fileData.data)
            const { errors } = data
            // 上传出现错误
            if (errors && errors.length > 0) {
              const errorMsg = errors[0].msg
              showModal(errorMsg)
            } else {
              console.log(data, 9875555);
              const { resultData } = data.data
              const { requestUrl } = config
              let signFile = {
                path: file.path,
              }
              if (resultData.code !== '-1') {
                const { fileid, filename } = resultData.data
                // #ifdef H5
                signFile.path = requestUrl + '/upload/downloadFile/' + fileid
                // #endif
                signFile.fileid = fileid
                signFile.filename = filename
                redirectTo('file', 'packageDeclare', {
                  signFile: JSON.stringify(signFile),
                })
              } else {
                signFile.path = ''
                signFile.size = ''
                showModal(resultData.message)
              }
            }
          })
        },
        fail(err) {
          console.log(err)
        },
      })
    },
    // 请求上传文件
    requestUploadFile(file) {
      let url = this.urlUpload
      const { path } = file
      return new Promise((resolve, reject) => {
        uploadFile(url, path, 'file', {}, {})
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取元素宽高
    getDescBox() {
      return new Promise((resolve, reject) => {
        uni
          .createSelectorQuery()
          .in(this)
          .select('#signCanvas')
          .boundingClientRect((result) => {
            if (result) {
              console.log('==========', result)
              resolve(result)
            } else {
              this.getDescBox()
            }
          })
          .exec()
      })
    },
  },
  onLoad() {
    showModal('请申请人签字')
    this.context = uni.createCanvasContext('signCanvas')
    this.$nextTick(async () => {
      let { width, height } = await this.getDescBox()
      this.context.fillStyle = '#FFFFFF'
      this.context.fillRect(0, 0, width, height)
      this.context.draw(true)
    })
  },
}
</script>

<style lang="scss" scoped>
.sign {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  #signCanvas {
    width: 100%;
    height: 100vh;
    display: block;
    z-index: 1;
    flex: 1;
  }

  .bottom {
    // position: fixed;
    background: #fff;
    // bottom: 0;
    // left: 0;
    width: 100%;
    height: 120rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 9;
    position: relative;

    .bubble {
      position: absolute;
      left: 0;
      bottom: 100%;
      margin-bottom: 10rpx;
      z-index: 10;

      .line {
        border-radius: 5px;
        overflow: hidden;

        .line-item {
          width: 300rpx;
          display: flex;
          align-items: center;
          padding: 20rpx 20rpx;
          background: #fff;

          &::before {
            content: '';
            display: block;
            width: 80%;
            height: 4rpx;
            background: #000;
            margin: 0 auto;
          }

          &:hover {
            background-color: #d7efff;
          }

          &:nth-child(2) {
            &::before {
              height: 8rpx;
            }
          }

          &:nth-child(3) {
            &::before {
              height: 12rpx;
            }
          }
        }

        .line-active {
          background-color: #d7efff;
        }
      }

      .color {
        background: #fff;
        border-radius: 5px;
        display: flex;
        overflow: hidden;
        padding: 20rpx;

        .color-item {
          height: 60rpx;
          width: 60rpx;
          border-radius: 50%;
          margin-right: 30rpx;

          &:nth-child(3) {
            margin-right: 0;
          }
        }

        .color-active {
          border: 2px solid #6cd1ff;
        }
      }
    }
  }

  .btn {
    width: 25%;
    height: 120rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #85c6ff;
    color: #85c6ff;

    &:last-of-type {
      border: 0;
    }

    img {
      width: 60rpx;
      height: 60rpx;
      margin: 10rpx auto;
    }

    &:active {
      background-color: #e0f6ff;
    }
  }

  .btn-active {
    background-color: #e0f6ff;
  }
}
</style>
