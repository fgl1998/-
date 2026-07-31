<!-- 新版行政区划组件 -->
<template>
  <div>
    <el-dialog
      width="1000px"
      :visible.sync="visible"
      :footer="null"
      @close="handleCancel"
      :modal-append-to-body="false"
      title="选择工作地"
      class="newCascaderArea"
    >
      <div class="chose_city" v-if="choseCityList.length > 0">
        <ul class="chose_city_list">
          <li
            v-for="(item, index) in choseCityList"
            :key="'choseCity' + index"
            @click="cancleChoseCity(item)"
          >
            <div>{{ item.name }}</div>
            <div class="close">X</div>
          </li>
        </ul>
        <div class="notice">最多只能选择{{ maxLength }}项</div>
      </div>
      <div class="content">
        <div class="left_box">
          <div
            class="province_btn"
            v-for="(item, index) in provinceList"
            :key="'province' + index"
            @click="chooseProvince(item)"
            :class="choseProvinceId == item.id ? 'choseProvince' : ''"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="right_box">
          <div class="city_box" v-for="(i, n) in cityList" :key="'city' + n">
            <div
              @click="chooseCity(i)"
              :class="
                JSON.stringify(choseCityList).indexOf(JSON.stringify(i)) != -1
                  ? 'choseCity'
                  : ''
              "
            >
              {{ i.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" @click="submitChoseCity">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cityJson from "../js/cityJson.js";
export default {
  name: "newCascaderArea",
  props: {
    visible: {
      type: Boolean,
    },
    // 最多选择个数
    maxLength: {
      type: Number,
      default: 3,
    },
    choseArea: {
      type: Array,
    },
    editCode:{
      type: String,
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          let province = this.provinceList.find(
            (item) => item.id == this.choseProvinceId
          );
          if (province) {
            this.cityList = province.city;
          }
          // 只有市的精确到区【除台湾、香港、澳门
          let areaList = [];
          this.provinceList.forEach((item, index) => {
            if (
              item.city.length < 2 &&
              item.id != "820000000000" &&
              item.id != "810000000000" &&
              item.id != "710000000000"
            ) {
              let cityCode = item.city[0].id;
              areaList = this.areaList.filter((item) => item.pid == cityCode);
              this.provinceList[index].city = areaList;
            }
          });
          this.choseCityList = this.choseArea;
        });
      }
    },
    // 编辑时传入的回显处理
    editCode: {
      handler(val){
        if(val){
          let codeArr = val.split(',')
          let allCity = []
          this.provinceList.forEach(item => {
            allCity=[...allCity,...item.city]
          })
          this.choseCityList = allCity.filter(item => codeArr.find(one => one == item.id))
          this.$emit("getCity", this.choseCityList);
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      provinceList: cityJson.province, // 省数据
      areaList: cityJson.area, // 区数据
      choseProvinceId: "650000000000", // 选中省-默认为新疆
      cityList: [], // 选中省下的市区
      choseCityList: [], // 选中市区
    };
  },
  methods: {
    // 提交
    submitChoseCity() {
      this.$emit("getCity", this.choseCityList);
      this.handleCancel();
    },
    // 选择省份
    chooseProvince(provinceInfo) {
      this.choseProvinceId = provinceInfo.id;
      this.cityList = provinceInfo.city;
    },
    // 选中城市
    chooseCity(cityInfo) {
      // 判断是否选择
      let isCityExist = this.choseCityList.find(
        (item) => item.id == cityInfo.id
      );
      if (isCityExist == undefined) {
        if (this.choseCityList.length < this.maxLength) {
          this.choseCityList.push(cityInfo);
        } else if(this.maxLength === 1) {
          this.choseCityList = [cityInfo]
        }
      } else {
        this.choseCityList = this.choseCityList.filter(
          (item) => item.id !== cityInfo.id
        );
      }
    },
    // 删除选中城市
    cancleChoseCity(cityInfo) {
      this.choseCityList = this.choseCityList.filter(
        (item) => item.id !== cityInfo.id
      );
    },
    // 取消
    handleCancel() {
      this.$emit("close");
      setTimeout(() => {
        this.choseProvinceId = "650000000000";
        this.cityList = [];
        this.choseCityList = [];
      }, 500);
    },
  },
};
</script>

<style lang="less" scoped>
.newCascaderArea {
  .chose_city {
    height: 50px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .chose_city_list {
      display: flex;
      align-items: center;
      margin-bottom: 0px !important;
      > li {
        height: 26px;
        font-size: 12px;
        color: #333;
        padding: 0 8px;
        background-color: #fff;
        border: 1px solid #999999;
        cursor: pointer;
        display: flex;
        align-items: center;
        > .close {
          font-weight: bold;
          color: #999;
          margin-left: 6px;
          font-size: 11px;
        }
      }
      > li:not(:last-of-type) {
        margin-right: 12px;
      }
    }
    .notice {
      width: 154px;
      padding-left: 38px;
      height: 28px;
      display: flex;
      align-items: center;
      background: url("@/static/images/img/xjPublicImg/tag_error_box.png")
        no-repeat no-repeat;
      background-size: 100% 100%;
    }
  }
  .content {
    width: 100%;
    height: 478px;
    display: flex;
    .left_box {
      width: 260px;
      height: 100%;
      overflow: auto;
      background-color: #f7f7f7;
      > .province_btn {
        padding-left: 20px;
        height: 34px;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
      }
      > .province_btn:hover {
        background-color: #ddd;
      }
    }
    .right_box {
      width: calc(100% - 260px);
      padding: 6px 14px;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: 10px;
      overflow-y: scroll;
      > .city_box {
        width: 32%;
        height: 36px;
        > div {
          height: 100%;
          display: inline-block;
          line-height: 36px;
          cursor: pointer;
          padding: 0 6px;
        }
        > div:hover {
          background-color: #ddd;
        }
      }
    }
  }
  .btns {
    background-color: #f7f7f7;
    width: 100%;
    height: 60px;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    > button:nth-of-type(1) {
      margin-right: 12px;
      background-color: #66b1ff;
      color: #fff;
    }
  }
}

.choseProvince {
  background-color: #fff !important;
  font-weight: bold !important;
  color: #66b1ff !important;
}

.choseCity {
  background-color: #66b1ff !important;
  color: #fff !important;
}
/deep/ .el-dialog__body{
  padding: 0;
}
</style>
