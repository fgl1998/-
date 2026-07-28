<template>
  <div
    class="declare-process h5-page"
    v-if="renderData && renderData.length > 0"
  >
    <ComponentPanel :title="projectName">
      <div class="wrapper">
        <div class="items">
          <block v-for="(item, index) in renderData" :key="item.id">
            <div class="item" :class="[currentStep >= index ? 'active' : '']">
              <div class="name">
                <span>{{ item.name }}</span>
                <i class="icon"></i>
              </div>
              <div class="info" v-if="isShowDetails">
                <div class="cell" v-if="areaCode !='510500'">
                  <div class="key">经办人：</div>
                  <div class="value">{{ item.agent }}</div>
                </div>
                <div class="cell">
                  <div class="key">经办机构：</div>
                  <div class="value">{{ item.unit }}</div>
                </div>
                <div class="cell" v-if="areaCode !='510500'">
                  <div class="key">经办时间：</div>
                  <div class="value">{{ item.time }}</div>
                </div>
                <div class="cell">
                  <div class="key">审核状态：</div>
                  <div class="value">{{ item.status }}</div>
                </div>
                <div class="cell">
                  <div class="key">审核意见：</div>
                  <div class="value">{{ item.opinion }}</div>
                </div>
                <!-- <div class="cell">
                  <div class="key">审核结果：</div>
                  <div class="value">{{ item.result_desc }}</div>
                </div> -->
              </div>
            </div>
          </block>
          <i class="icon icon-line" :style="lineStyle"></i>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>
<script>
import config from '@/config'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import { setNavigationBarTitle, showModal, navigateBack } from '@/utils/uni-api'
import {
  requestB018,
  requestFFGetGrantFlowByChb010,
  requestDSGetGrantFlowByChb010,
} from '@/service/api'
export default {
  name: 'pageDeclareProcess',
  data() {
    return {
      projectName: '', // 补贴项目名称
      renderData: [], // 渲染数据
      currentStep: 0, // 当前环节
      isShowDetails: false, // 是否显示发放进度详情
      areaCode:config.areaCode
    }
  },
  components: {
    ComponentPanel,
  },
  onLoad(e) {
    const { chi031, chb010, chi031_desc } = e
    if (chi031_desc) {
      this.projectName = chi031_desc
    }
    // chb010 存在则表示查询发放进度
    if (chb010) {
      this.isShowDetails = true
      this.getGrantFlowByChb010(chb010)
      setNavigationBarTitle('发放进度')
    }
    // chi031 存在则表示查询审批流程
    if (chi031) {
      this.isShowDetails = false
      this.getB018(chi031)
      setNavigationBarTitle('审批流程')
    }
  },
  methods: {
    getRenderData(list) {
      this.renderData = []
      if (list) {
        const arr = []
        list.map((item, index) => {
          if (item.cse285) {
            this.currentStep = index
          }
          arr.push({
            id: 'ffjd_' + index,
            name: item.cse241 || '暂无', // 流程环节名称
            time: item.aae036, // 经办时间
            result: item.cse284, // // 审核结果码值 1审核中 2通过 3未通过 4打回
            result_desc: item.cse285, // 审核结果中文
            agent: item.aae011, // 经办人
            unit: item.aae017, // 经办机构
            status: item.chb014, // 审核状态
            opinion: item.cse285, // 审核意见
          })
        })
        this.renderData = [...arr]
      }
    },
    // 获取补贴项目的发放进度
    getGrantFlowByChb010(chb010) {
      const { isOpenYGFFByDS, isOpenYGFF } = config
      if (isOpenYGFFByDS) {
        requestDSGetGrantFlowByChb010(chb010).then((res) => {
          const { list } = res
          this.getRenderData(list)
        })
      } else {
        if (isOpenYGFF) {
          requestFFGetGrantFlowByChb010(chb010).then((res) => {
            const { list } = res
            this.getRenderData(list)
          })
        }
      }
    },
    // 获取补贴项目审批流程
    getB018(chi031) {
      const { onlineTerminalName, isCompileToTianfuCitizenCloud } = config
      this.renderData = []

      requestB018(chi031, true, false)
        .then((res) => {
          const { list } = res.lists.cpb08List
          if (list) {
            // 改审批流程特殊 展示有些问题 处理比较复杂 还未完全处理
            // 1. 正常流程 从头到尾
            // 2. 流程中途产生分支
            // 3. 多分支相同结束节点
            // 4. 多分支不同结束节点

            const len = list.length // 所有节点数

            const tempArr = [] // 零时数组 储存最终渲染数据

            let lastObjArr = [] // 结束节点组成的对象
            let currentObj = {} // 当前选中对象

            // 依次查找上一节点
            const findObj = (obj) => {
              let tag = false
              for (let i = 0; i < len; i++) {
                const item = list[i]
                if (obj.cpb084 === item.cpb085) {
                  currentObj = { ...item }
                  tag = true
                  tempArr.unshift({
                    ...item,
                    id: 'splc_' + item.cpb085,
                    name: item.cpb084_desc || '暂无', // 流程环节名称
                  })
                  findObj(currentObj)
                  break
                }
              }
              if (!tag) {
                // 再次筛选
                var newTempArr = []
                let tempArrLen = tempArr.length
                for (let i = 0; i < tempArrLen; i++) {
                  const item = tempArr[i]
                  if (item.isHide !== '1') {
                    newTempArr.push(item)
                  }
                }
                this.currentStep = newTempArr.length
                this.renderData = [...newTempArr]
              }
            }

            // 查找结束节点
            for (let i = 0; i < len; i++) {
              const item = list[i]
              if (
                item.cpb084_desc == '微信小程序申报' &&
                isCompileToTianfuCitizenCloud
              ) {
                item.cpb084_desc = onlineTerminalName
                  ? onlineTerminalName + '申报'
                  : '微信小程序申报'
              }
              // 等于代表此节点为结束节点
              if (item.cpb085 === '2') {
                lastObjArr.push(item)
              }
            }

            const lastObjLen = lastObjArr.length

            // 只存在一个节点
            if (lastObjLen === 1) {
              const lastObj = lastObjArr[0]
              currentObj = { ...lastObj }
              tempArr.push({
                ...lastObj,
                id: 'last',
                name: lastObj.cpb084_desc || '暂无',
              })
              findObj(currentObj)
            } else {
              // 存在多个节点 目前当只有一个节点处理
              const lastObj = lastObjArr[0]
              currentObj = { ...lastObj }
              tempArr.push({
                ...lastObj,
                id: 'last',
                name: lastObj.cpb084_desc || '暂无',
              })
              findObj(currentObj)
            }
          }
        })
        .catch((err) => {
          showModal('抱歉，暂未查询到该补贴项目的审批流程！').then((res) => {
            navigateBack(1)
          })
        })
    },
    // 死数据 暂未使用
    createRenderData(id) {
      const renderDataGLBT = [
        {
          id: '01',
          name: '微信小程序个人自主申报',
          time: '7天',
          status: 0,
          content: '申请人在该微信小程序上自主申报',
        },
        {
          id: '02',
          name: '乡镇审核',
          time: '7天',
          status: 0,
          content: '乡镇对村（社区）提交的申报表进行审核',
        },
        {
          id: '03',
          name: '乡镇公示',
          time: '7天',
          status: 0,
          content:
            '乡镇审核通过的申请人，由乡镇统一汇总进行公示，对于不满足申报条件的可进行举报投诉',
        },
        {
          id: '04',
          name: '区县审批',
          time: '7天',
          status: 0,
          content: '乡镇公示通过的申请人，由乡镇统一汇总交由区县进行审批',
        },
      ]
    },
  },
  computed: {},
  watch: {},
  onShow() {},
  onUnload() {},
}
</script>
<style lang="scss" scoped>
.declare-process {
  min-height: 100%;
  min-height: 100vh;
  padding: $spacing 0;
}
.wrapper {
  width: 100%;
  padding-bottom: 52rpx;
  padding-left: 68rpx;
  padding-right: 44rpx;
  padding-top: 40rpx;
  position: relative;
}
.items {
  width: 100%;
  position: relative;
  .icon-line {
    position: absolute;
    top: 12rpx + 32rpx;
    width: 20rpx;
    height: 100%;
    left: -12rpx;
    z-index: 0;
    background-image: url(data:image/png;base64,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);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center bottom;
  }
}
.item {
  width: 100%;
  font-size: 28rpx;
  color: #666666;
  line-height: 40rpx;
  padding-left: 80rpx;
  padding-top: 12rpx;
  position: relative;
  .name {
    width: 100%;
    min-height: 64rpx;
    padding: 12rpx 40rpx;
    line-height: 40rpx;
    background-color: #eaf2ff;
    border-radius: 32px;
    text-align: center;
    font-size: 30rpx;
    font-weight: 700;
    color: #333333;
    margin-bottom: 24rpx;
    position: relative;
    span {
      display: inline-block;
      text-align: left;
    }
    .icon {
      position: absolute;
      top: 50%;
      left: -100rpx;
      width: 100rpx;
      height: 44rpx;
      transform: translateY(-50%);
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAABoCAMAAAD4vo2OAAAA9lBMVEUAAACv//8txf8txv8txf8txv8txv8ux/831P9D5P9M//831P800f8txv882f9E5/9G6v9E5f9D5v9E5v9D5v9E5f9E5v9D5v9E5v9D5v9F5v9F5v9F5f9B4/8xy/8zz/9E5v8xy/8/3/8+3v883P872/862f851/8zzv8xzf8vyP8zzf80z/820f8/3v9A4f9G6P8txv9E5v////9D5f8sxP8txv9A4v8+3/8vyf8yzf800f831P872v851//P+f8wy/893f882/8zz/820v841v862P/3/v/j/P+a8v9p6/9g6f9G5v+x9f8ux/8uxv9Q5/+w9P+0/hxbAAAAM3RSTlMAAX96hYl1cDweBsKzji4QGfnz6eDZy8m/bmddO/5pSaSW8ezi3dPOpaGRXllPIvpYwKWcD+jgAAADFklEQVR42u3aaVPaUBgF4BvZhJYW2RepdG/tpia5IiJB2VXA/v8/07w5yS3OQKczSZ3byft8O/KFMycGkiAYY4wxxhhjjDHGGGOMMcYYY4z91472yL6ISqHZqVeKxUq90ywIHR1L25URkcg1ataGWiMntJO3ZVSFjVbZAqXcMoRm8nZUC2er1hbVrNBLPqpD+rBkbVU6FFqJauGTA2uHgxOhk5S3cDr0vqrv3cKZz2ZzZ3GnGmu1ccqOonC2ZMGtYyrOrQUlnf6PI1nYqKLZ/dJ8ZHmPv1c1OldHsnALvR4w7wbnAa+0hDZStgxdOFfGvuj7iIONy/p8A0naJCHCaGDGpbnFEq81hC6SUoYuXMP5ytwKZ66a0EUECxcwomNu5eBVba4kkjJ04SY+f80d8HncFJqIYOEziyzMHRYWORMuwzByuZzwvFSQC1nXd4L8QhHE2FeQj8g3gvyVfCHIryCTySCn0+kEObXJngihro7oPxzT9Xb7nHS7bbyBLrkmyDeuK3KDPJ1OB4PJYDIZIPfJuD8e95EvyehyNBoh98iwNxz2kIeuCw+yXK/Xkk5YMnThikXm5g5zi1TOfd3zoDAEha/dvmjsFx5AUHhCdanzWBX2OyOPeqAKo64qvJKAxqEKFy0yM3eYWaSo+naFB21pY2QsTJDdgbHwBFktPEbeXJiMRsHGyJuFyQqNqe7TFQa/MBpvFr7CxMiDgdf4cWHq2/cLgyqMfXFIkwvVGFnKNQo/1SHdDgbuGiisJka+DhaeIk/dxpgYeYKB3crIYzUxshp4iDwMGq+QV9QYAz/NSYsKt9s/XHgDb8hbgvyOvCfIH8hHgvxMQX6uIH8inwnya8+xCznlSrpOwy/c+ZuPpY6hyRVTwibJ+HzxSEivcHy+WvoLx+fiIWFLFP5Hl4c/dbs89BeOzw2AtKSFU/G5xZO2SSo+N/HS0iscn9u0/sLxuRGPwvn4PGrJSK9wfB6mZWxJhePzuDSDQzo+D8T9Qzo+P3n4vXBMftSyv0eOBGOMMcYYY4wxxhhjjDHGGGOMMcbi4BdiDoiYwCizmwAAAABJRU5ErkJggg==)
        no-repeat center center;
      background-size: 120rpx 52rpx;
      z-index: 1;
    }
  }
  .cell {
    margin-bottom: 12rpx;
    display: flex;
    &.con {
      height: 160rpx;
      max-height: 160rpx;
      overflow: hidden;
    }
  }
  .key {
    font-weight: 700;
  }
  .value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  &.active {
    .name {
      background-image: linear-gradient(180deg, #a1e5ff 0%, #005fff 100%);
      color: #fff;
    }
    .icon {
      background-image: url(data:image/png;base64,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);
      background-size: 142rpx 64rpx;
    }
  }
  &.ing {
    color: #999;
    .name {
      color: #999;
    }
  }
}
</style>
