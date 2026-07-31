<!-- 注：基于百度地图的地图选址组件 -->
<template>
  <view class="addressInputModal">
    <el-input
        type="text"
        :placeholder="placeholder"
        @onchange="onChange"
        :value="selectValue"
        @focus="openModal"
        clearable
        @clear="onClear"
    />
    <view class="mapBox" v-if="isOpenModal">
      <view class="mapModal">
        <view class="header">
          <view>
            <view>选择地区</view>
          </view>
          <image
              src="../../static/images/close.png"
              @click="handleCancel"
          ></image>
        </view>
        <view class="container">
          <s-common-cascader-area
              @getAreaInfo="getAreaInfo"
              :placeholder="placeholder"
              :value="areaCode"
          ></s-common-cascader-area>
          <view class="input_box">
            <el-input v-model="keyword" placeholder="请输入详细地址"></el-input>
            <el-button type="primary" @click="onSearch">定位</el-button>
          </view>

          <baidu-map
              id="map"
              :center="chooseAddress.point"
              :scroll-wheel-zoom="true"
              :zoom="zoom"
              ak="qKDwtLCbBFu5PAb5EXYdPNmIXQccY07d"
              @click="mapClick"
              @ready="mapReady"
              @zoomend="handleRoomChange"
          >
            <bm-marker
                :dragging="true"
                :position="chooseAddress.point"
                animation="BMAP_ANIMATION_BOUNCE"
            >
              <bm-label
                  :content="chooseAddress.address"
                  :label-style="{ color: 'red', fontSize: '16px' }"
                  :offset="{ width: -35, height: 30 }"
              />
            </bm-marker>
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"/>
          </baidu-map>
        </view>
        <view class="btns">
          <el-button type="primary" @click="handleOk">确认</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import sCommonCascaderArea from "../s-common-cascader-area/s-common-cascader-area.vue";
import {BaiduMap, BmCityList, BmLabel, BmLocalSearch, BmMarker,} from "vue-baidu-map";

export default {
  name: "addressInputModal",
  props: {
    value: {
      // 输入框值
      type: String,
      default: "",
    },
    // 初始化，及默认进入时的行政区划和坐标
    defaultAddress: {
      type: Object,
      default: () => {
        return {
          address: "",
          point: {
            lat: 43.830763,
            lng: 87.62444,
          },
          areaCode: null, //行政区划
        };
      },
    },
    // 用于查询
    aab001: {
      type: Number,
    },
    disabled: {
      type: Boolean,
    },
    // 触发定位的层级
    locLevel: {
      type: Number,
      default: 0,
    },
    placeholder: {
      // 输入框提示文字
      type: String,
      default: "",
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.selectValue = val;
      } else {
        this.selectValue = null;
      }
    },
    isOpenModal(val) {
      if (val) {
        this.openMap();
      } else {
        this.chooseAddress = {};
      }
    },
  },
  components: {
    sCommonCascaderArea,
    BaiduMap,
    BmMarker,
    BmLabel,
    BmLocalSearch,
    BmCityList,
  },
  data() {
    return {
      isOpenModal: false, // 是否打开模态框
      keyword: "", // 行政区划组件选中中文值
      chooseAddress: {
        // 地图选中或查询选择地址
        address: "",
        point: {
          lat: null,
          lng: null,
        },
      },
      areaName: "", // 行政区划地址
      city: "乌鲁木齐", // 城市 （默认搜索范围）
      myGeo: "", // 挂载myGeo
      zoom: 16,
      selectValue: null, //当前选中数据
      areaCode: [],
      // 职位地址列表
    };
  },
  methods: {
    // 获取选中的行政区划
    getAreaInfo(code, info) {
      this.keyword = info[0].pathLabels.join("");
      this.chooseAddress.areaName = info[0].pathLabels.join("/");
      this.chooseAddress.areaCode = code[code.length - 1];
      this.onSearch();
    },
    onChange() {
    },
    // 打开模态框
    openModal() {
      this.isOpenModal = true;
    },
    // 关闭模态框
    handleCancel() {
      this.chooseAddress = {
        address: "",
        point: {
          lat: null,
          lng: null,
        },
      };
      this.isOpenModal = false;
    },
    mapReady({BMap, map}) {
      this.map = map;
      this.myGeo = new BMap.Geocoder();
    },
    // 地图点击事件 （调用百度地图地址转换接口）
    mapClick({point}) {
      if (!this.chooseAddress.areaCode) {
        this.$utils.showToast("请先选择行政区划，再完善地址！");
        return;
      }
      const _this = this;
      // 根据坐标得到地址描述
      this.myGeo.getLocation(point, function (result) {
        if (result) {
          _this.chooseAddress.address = result.address;
          _this.chooseAddress.point = point;
          _this.keyword = result.address;
        }
      });
    },
    // 搜索详细地址转换坐标
    onSearch() {
      if (!this.keyword) {
        this.keyword = this.chooseAddress.address;
        return;
      }
      const _this = this;
      // 将地址解析结果显示在地图上，并调整地图视野
      this.myGeo.getPoint(
          this.keyword,
          function (point) {
            if (point) {
              _this.chooseAddress.point = point;
              _this.chooseAddress.address = _this.keyword;
            } else {
              this.$utils.showToast(
                  "您输入的地址没有解析到结果！请输入更详细的地址"
              );
            }
          },
          this.city
      );
    },
    // 缩放等级变换时触发 (同步缩放等级，防止各种情况缩放等级变化)
    handleRoomChange(type, target) {
      this.zoom = type.target.Na;
    },
    // 打开地图时进行赋值
    openMap() {
      this.clearData();
      // 初始化地址
      //console.log('defaultAddress', this.defaultAddress);
      //console.log('chooseAddress', this.chooseAddress);
      if (!this.chooseAddress.address) {
        // if (JSON.stringify(this.defaultAddress) == "{}") {
        //   this.defaultAddress = {
        //     address: "",
        //     point: {
        //       lat: 43.830763,
        //       lng: 87.62444,
        //     },
        //     areaCode: null, //行政区划
        //   };
        // }
        this.chooseAddress = {
          ...this.defaultAddress,
        };
      }
      //console.log('this.value', this.value);
      //console.log('this.chooseAddress', this.chooseAddress);
      this.keyword = this.chooseAddress.address;
      // 给区划下拉框赋值
      if (
          this.chooseAddress.areaCode &&
          this.chooseAddress.areaCode.length == 12
      ) {
        let code = this.chooseAddress.areaCode;
        let codeList = [];
        for (let i = 1; i <= 6; i++) {
          let newCode = code.slice(0, i * 2);
          if (code.slice((i - 1) * 2, i * 2) !== "00") {
            codeList.push(newCode + "000000000000".slice(i * 2));
          }
        }
        this.areaCode = codeList;
      }
    },
    // 确定后返回数据
    handleOk() {
      if (!this.chooseAddress.areaCode) {
        this.$utils.showToast("请先选择行政区划，再完善地址！");
        return;
      }
      this.selectValue = this.chooseAddress.address;
      this.$emit("change", this.chooseAddress.address, this.chooseAddress);
      this.isOpenModal = false;
    },
    // 自己输入修改
    handleblur(e) {
      if (!this.chooseAddress.areaCode) {
        this.$utils.showToast("请先选择工作区域，再补正详细地址！");
        this.keyword = "";
        return;
      }
      const {lat, lng} = this.chooseAddress.point;
      const value = e.target.value;
      if (value && (!lat || !lng)) {
        this.$utils.showToast("请先选择地址，再补正详细地址！");
        return;
      }
      this.chooseAddress.address = e.target.value;
    },
    markersset(arr) {
      // 去除标注点
      this.$nextTick(() => {
        arr.forEach((item) => {
          this.map.removeOverlay(item.marker);
        });
      });
    },
    // 每次打开时重缩放等级
    clearData() {
      this.zoom = 16;
      this.areaCode = [];
    },
    // 清除
    onClear() {
      this.selectValue = "";
      this.chooseAddress = {
        address: "",
        areaName: '',
        point: {
          lat: null,
          lng: null,
        },
      };
      this.$emit("change", '', this.chooseAddress);
    },
  },
};
</script>

<style lang="less" scoped>
.mapBox {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;

  > .mapModal {
    width: 800px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
  }
}

.header {
  height: 68px;
  background: #0682fe;
  border-radius: 8px 8px 0px 0px;
  padding: 0px 24px 0px 24px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > image {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  > view {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    color: #ffffff;

    > image {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }
  }
}

.container {
  padding: 30px;
  box-sizing: border-box;

  .cascaderArea {
    margin-bottom: 20px;
  }

  .input_box {
    display: flex;
    margin-bottom: 20px;

    button {
      background-color: #007dee;
      margin-left: 16px;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px 20px 0;
  box-sizing: border-box;
}

#map {
  width: 100%;
  height: 400px;
  margin-top: 10px;
}
</style>
