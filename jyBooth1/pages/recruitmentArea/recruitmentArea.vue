<template>
  <view class="min-box">
    <!-- <common-guide-header></common-guide-header> -->
    <view class="screen">
      <view class="screen-lt">
        <view class="lt-top">
          <view class="area-title">
            <view class="top-lt">
              <!-- <button type="primary" size="mini" @click="toPrevious">返回上一级</button> -->
            </view>
            <view class="top-cr">
              <text>招聘会区域 - 详情展示</text>
            </view>
            <view class="top-rt">
              <!-- <view class="vr-btn">
                <image src="@/static/images/guide/ic_vr.png" class="btn-img"></image>
                <text>VR全景展示</text>
              </view> -->
            </view>
          </view>
        </view>
        <view class="lt-con">
          <view class="area-box">
            <view class="area-border" :style="areaStyle"></view>
            <view
              class="entrance"
              v-for="(item, index) in entrance"
              :key="index"
              :style="{ left: item.x * 3 + 'px', top: item.y * 3 + 'px' }"
              >{{ '入口' + item.id }}</view
            >
            <view class="booth-list">
              <view
                class="booth-item"
                v-for="(item, index) in booths"
                :key="index"
                :style="{ left: item.acb32f * 3 + 'px', top: item.acb32g * 3 + 'px' }"
                @click="openInfo({ type: true, info: item })"
              >
                <view :class="{ 'booth-status': true, active: item.status }">
                  <view class="booth-number">{{ item.acb32b }}</view>
                </view>
                <view class="booth-unit">{{ item.status ? item.aab004 : '空展位' }}</view>
              </view>
            </view>
          </view>
          <!--展位详情-->
          <unit-info :infoShow="infoShow" @closeInfo="openInfo" :boothsInfo="boothsInfo"></unit-info>
        </view>
      </view>
      <view class="screen-rt">
        <view class="rt-top">
          <image src="@/static/images/guide/ic_compass.png"></image>
        </view>
        <view class="rt-bottom">
          <image src="@/static/images/guide/ic_location.png"></image>
        </view>
      </view>
    </view>
    <!-- <common-guide-footer></common-guide-footer> -->
    <div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="40%"
        top="15%"
        :modal-append-to-body="false"
        :append-to-body="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-form label-width="280px">
          <el-form-item label="请选择导航台设备" required>
            <el-select style="width: 340px" ref="select" v-model="ace711_dsc" placeholder="请选择导航台设备">
              <el-option :value="treeDataValue" style="overflow-y: scroll; height: 100%; max-height: 300px">
                <el-tree
                  default-expand-all
                  ref="tree"
                  :data="data"
                  node-key="label"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" @click="queryDeviceInfo">刷新</el-button>
          </el-form-item>
          <el-form-item label="请输入校验码" required>
            <el-input placeholder="请输入校验码" v-model="ace772" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="chooseDevice">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </view>
</template>

<script>
import unitInfo from './component/unitInfo.vue'

export default {
  components: {
    unitInfo,
  },
  data() {
    return {
      infoShow: false,
      boothsInfo: {},
      param1: {
        apiCode: 'jy204_hrm104',
        method: 'jy204_hrm104',
      },
      areaStyle: {},
      entrance: '',
      booths: [],

      dialogVisible: false,
      treeDataValue: '',
      data: [],
      ace711_dsc: '',
      ace772: '', //设备校验码
    }
  },
  onLoad: function (option) {
    if (option && option.acb330) {
      uni.setStorageSync('acb330', option.acb330)
      this.getAreaInfo(option.acb330)
      this.queryDeviceInfo()
    } else {
      this.$message.error('缺少acb330参数')
    }
  },
  beforeDestroy() {
    // uni.removeStorageSync('deviceInfo_4')
  },
  computed: {
    defaultProps() {
      return {
        children: 'children',
        label: 'label',
      }
    },
  },
  methods: {
    //返回上一级
    toPrevious() {
      uni.navigateTo({
        url: '/pages/navigationMap/navigationMap',
      })
    },
    openInfo(obj) {
      if (obj.info.hasOwnProperty('aab001')) {
        this.infoShow = obj.type
        this.boothsInfo = obj.info
      } else {
        this.infoShow = false
        this.boothsInfo = {}
      }
    },
    getAreaInfo(acb330) {
      this.param1.acb330 = acb330
      // const loginInfo = this.$loginConfig.getLoginInfo()
      // this.param1.acb330 = loginInfo.acb330
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy204_hrm104', null, this.param1, true)
        .then((res) => {
          const result = res.data.cb34VO
          let resData = result
          let area = resData.area
          let acb477 = JSON.parse(area.acb477)
          let ycb305Url = acb477.ycb305url
          let file_url = ycb305Url.file_url
          let areaBorder = acb477.areaBorder
          const baseLeft = areaBorder.left
          const baseTop = areaBorder.top
          this.areaStyle = {
            width: areaBorder.width * 3 + 'px',
            height: areaBorder.height * 3 + 'px',
            position: 'absolute',
            left: (areaBorder.left - baseLeft) * 3 + 'px',
            top: (areaBorder.top - baseTop) * 3 + 'px',
            border: '1px dash #cccccc',
            background: file_url != '' ? 'url(' + file_url + ') no-repeat' : '#ffffff',
          }
          this.entrance = acb477.entrance.map((item) => {
            item.x = item.x - baseLeft
            item.y = item.y - baseTop
            return item
          })
          let allSelect = resData.allSelect
          this.booths = resData.booths.map((item) => {
            item.acb32f = item.acb32f - baseLeft
            item.acb32g = item.acb32g - baseTop
            return item
          })
          for (var i in this.booths) {
            for (var j in allSelect) {
              if (this.booths[i].acb32b == allSelect[j].acb32b) {
                Object.assign(this.booths[i], allSelect[j])
                this.booths[i].status = true
              }
            }
          }
          console.log(this.booths)
        })
    },
    drawArea(obj) {},
    queryDeviceInfo() {
      let deviceInfo = uni.getStorageSync('deviceInfo_4')
      if (!deviceInfo) {
        this.dialogVisible = true
        this.$http
          .post(
            this.$requestConstant.commonRequestType,
            'jy204_hrm262',
            null,
            {
              ace769: '5',
            },
            true,
          )
          .then((res) => {
            this.data = res.data.ce31Pos
          })
      } else {
        this.dialogVisible = false
        this.disabled = true
      }
    },
    chooseDevice() {
      if (!this.ace711) {
        this.$message.error('请选择设备!')
        return
      }
      if (!this.ace772) {
        this.$message.error('请输入检验码!')
        return
      }

      //验证展位机编号和校验码
      let param = {
        ace711: this.ace711,
        ace772: this.ace772,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm267', null, param, true).then((res) => {
        if (res?.data?.result?.code === '0') {
          this.$message.error(res.data.result.message)
        } else {
          this.$message.success(res.data.result.message)
          uni.setStorageSync('deviceInfo_4', {
            ace769: '5',
            ace711: this.ace711,
            ace772: res.data.result.ace772,
          })
          this.dialogVisible = false
          this.disabled = true
          uni.removeStorageSync('reLanch_times')
        }
      })
    },
    handleNodeClick(data, node, nodeData) {
      if (!data.children) data.children = []
      if (!data.children.length) {
        //非最后一层 为城市，不可选为值
        this.treeDataValue = data
        this.ace711 = data.value
        this.ace711_dsc = data.label
        this.$refs.select.blur() //收起下拉框
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/static/scss/guide_common.scss';

.area-box {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
}

.entrance {
  position: absolute;
  padding: 4px 10px;
  background: #ffeef1;
  box-shadow: 4px 4px 0px 0px #e0b4bc;
  border-radius: 2px;
  border: 1px solid #feced7;
  text-align: center;
  color: #feced7;
  font-size: 14px;
}

.booth-list {
  position: absolute;
  top: 0;
  left: 0;
}

.booth-item {
  position: absolute;
  width: 56px;
  height: 92px;
  background: #eaf6ff;
  box-shadow: 4px 4px 0px 0px #d7e2ee;
  border-radius: 2px;
  border: 1px solid #76b6fa;

  .booth-status {
    width: 36px;
    height: 36px;
    background: #0082ff;
    box-shadow: 0px 2px 4px 0px rgba(0, 130, 255, 0.42);
    border-radius: 4px;
    margin: 10px auto;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      background: #0eb323;
      box-shadow: 0px 2px 4px 0px rgba(14, 179, 35, 0.42);

      .booth-number {
        color: #0eb323;
      }
    }

    .booth-number {
      width: 24px;
      height: 15px;
      background: #ffffff;
      border-radius: 2px;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #0082ff;
      line-height: 15px;
      text-align: center;
    }
  }

  .booth-unit {
    padding: 0 6px;
    font-size: 14px;
    line-height: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
