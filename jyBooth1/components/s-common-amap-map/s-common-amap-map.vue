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
          <image src="../../static/images/close.png"
                 @click="handleCancel">
          </image>
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
          <div id="workAddress" class="workAddress"/>
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
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  name: "amapInputModal",
  components: {
    sCommonCascaderArea,
  },
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
        this.chooseAddress = {
          // 地图选中或查询选择地址
          areaCode: "",
          areaName: "",
          address: "",
          point: {
            lat: 30.4744,
            lng: 106.6318
          },
        };
      }
    },
  },
  data() {
    return {
      key: 'c059ea0037f6ce6ba61ccd8a27479067',
      securityJsCode: '171cb0c05e1dda358b8cbab40a2b722f',
      gdMap: null, // 地图
      geocoder: null,
      marker: null,

      isOpenModal: false, // 是否打开模态框
      keyword: "", // 行政区划组件选中中文值
      chooseAddress: {
        // 地图选中或查询选择地址
        areaCode: "",
        areaName: "",
        address: "",
        point: {
          lat: 30.4744,
          lng: 106.6318
        },
      },
      zoom: 16,
      selectValue: null, //当前选中数据
      areaCode: [],
      areaName: "", // 行政区划地址
      // 职位地址列表
    };
  },
  created() {
    window._AMapSecurityConfig = {
      securityJsCode: '171cb0c05e1dda358b8cbab40a2b722f', // 填写你的安全密钥
    }
  },
  methods: {
    // 每次打开时重缩放等级
    clearData() {
      this.zoom = 16;
      this.areaCode = [];
    },
    // 获取选中的行政区划
    getAreaInfo(code, info) {
      this.keyword = info[0].pathLabels.join("");
      this.chooseAddress.address = info[0].pathLabels.join("");
      this.chooseAddress.areaName = info[0].pathLabels.join("/");
      this.chooseAddress.areaCode = code[code.length - 1];
      console.log(code, info, this.keyword, this.chooseAddress)
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
        // 地图选中或查询选择地址
        areaCode: "",
        areaName: "",
        address: "",
        point: {
          lat: 30.4744,
          lng: 106.6318
        },
      };
      this.isOpenModal = false;
    },

    // 搜索详细地址转换坐标
    onSearch() {
      if (!this.keyword) {
        this.keyword = this.chooseAddress.address;
        return;
      }
      this.addressToPoint(this.keyword);
    },

    // 地址转换坐标
    addressToPoint(address) {
      // 清除标记
      this.marker?.remove()
      // 调用geocode方法 获取经纬度
      this.geocoder.getLocation(address, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          // 如果成功获取到结果，则取第一个结果（通常地址会有多个可能的定位点）
          let geocode = result.geocodes[0];
          let lnglat = geocode.location; // 经纬度信息

          // // 显示结果（这里只是简单地打印到控制台，你可以根据需要调整）
          // console.log('地址:', address);
          // console.log('经纬度:', lnglat.lng, lnglat.lat);

          // 将经纬度设置为地图的中心
          this.gdMap.setCenter([lnglat.lng, lnglat.lat])

          // 你可以在这里将经纬度用于其他目的，比如在地图上标记这个点
        } else {
          // 如果获取地址信息失败，则提示错误信息
          console.error('地址解析失败：', result.info);
        }
      });
    },

    // 打开地图时进行赋值
    openMap() {
      this.clearData();
      // 初始化地址
      const load = AMapLoader.load({
        key: 'c059ea0037f6ce6ba61ccd8a27479067', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        this.gdMap = new AMap.Map('workAddress', { // 设置地图容器id
          viewMode: '2D', // 是否为3D地图模式
          zoom: 12, // 初始化地图级别
        });
        // this.gdMap.getCity((info) => {
        //   this.keyword = info.province + info.city + info.district;
        //   this.addressToPoint();
        // });
        // 地图添加点击事件
        this.gdMap.on('click', (e) => this.gdMapHandleClk(e))
        // 添加地理位置解析插件 实现经纬度转地址 地址转经纬度
        this.gdMap.plugin(["AMap.Geocoder"], () => { //加载地理编码插件
          this.geocoder = new AMap.Geocoder({
            radius: 200, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
            extensions: "all" //返回地址描述以及附近兴趣点和道路信息，默认“base”
          });
        });
        if (this.selectValue) {
          this.addressToPoint(this.selectValue);
        }
      }).catch(e => {
        console.log(e)
      })
      console.log(load)
    },

    gdMapHandleClk(e) {
      if (!this.chooseAddress.areaCode) {
        this.$utils.showToast("请先选择工作区域，再补正详细地址！");
        this.keyword = "";
        return;
      }

      // 清除标记
      this.marker?.remove();
      const {lng, lat} = e.lnglat;
      this.chooseAddress.point = {lng, lat}
      // 添加标记
      // 先给出一个标记
      const icon = new AMap.Icon({
        size: new AMap.Size(24, 34), // 设置图标大小
        imageSize: new AMap.Size(24, 34),
        image: 'static/images/img/unitCenter/ic_location.png', // 设置图标图片，确保URL正确
      });
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        icon,
        anchor: 'bottom-center',
      });
      // 将标记添加到地图上
      this.gdMap.add(this.marker);

      // 返显表单中的具体文字位置
      this.geocoder.getAddress(e.lnglat, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          this.keyword = result.regeocode.formattedAddress;
          this.chooseAddress.address = result.regeocode.formattedAddress;
        } else {
          alert('获取地址信息失败：' + result.info);
        }
      });
    },

    // 确定后返回数据
    handleOk() {
      if (!this.chooseAddress.areaCode || !this.chooseAddress.address) {
        this.$utils.showToast("请先选择行政区划，再完善地址！");
        return;
      }
      this.selectValue = this.chooseAddress.address;
      console.log("this.chooseAddress", this.chooseAddress)
      this.$emit("change", this.chooseAddress.address, this.chooseAddress);
      this.isOpenModal = false;
    },

    // 清除
    onClear() {
      this.selectValue = "";
      this.chooseAddress = {
        // 地图选中或查询选择地址
        areaCode: "",
        areaName: "",
        address: "",
        point: {
          lat: 30.4744,
          lng: 106.6318
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

#workAddress {
  min-width: 740px;
  min-height: 400px;
  width: 100%;
  height: 100%;
}

</style>
