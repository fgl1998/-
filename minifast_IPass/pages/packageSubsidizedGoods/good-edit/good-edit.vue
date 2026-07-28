<template>
  <view class="good-edit h5-page">
    <div class="main-content">
      <div class="input-cell-wrapper">
        <div class="input-title">商品信息</div>
        <div class="input-cell">
          <div class="label">商品类型</div>
          <div class="value">
            <picker
              class="picker"
              :range="goodTypeRange"
              range-key="name"
              :value="goodTypeIndex"
              @change="handleChangePickerGoodType"
            >
              <div class="picker-content">
                <div class="picker-value" v-if="goodInfoLocal.chi620">
                  {{ goodTypeDesc }}
                </div>
                <div class="picker-placeholder" v-else>请选择商品类型</div>
                <div class="iconimg"></div>
              </div>
            </picker>
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商品名称</div>
          <div class="value">
            <input
              type="text"
              maxlength="16"
              placeholder="请输入商品名称"
              v-model="goodInfoLocal.chi621"
            />
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商品售价（元）</div>
          <div class="value">
            <input
              type="number"
              maxlength="10"
              placeholder="请输入商品售价"
              v-model="goodInfoLocal.chi622"
            />
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商品折扣</div>
          <div class="value">
            <input
              type="digit"
              maxlength="4"
              placeholder="请输入商品折扣，例如8.8"
              v-model="goodInfoLocal.chi624"
            />
          </div>
        </div>
        <div class="input-cell disabled">
          <div class="label">商品实际售卖价格（元）</div>
          <div class="value">
            {{ getSellPrice }}
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商品简介</div>
          <div class="value">
            <textarea
              placeholder="请输入商品简介"
              v-model="goodInfoLocal.chi625"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="upload-files-wrapper">
        <div class="input-title">商品图片</div>
        <ComponentUploadImages
          @change="handleChangeImageList"
          :imageList="imageList"
          :uploadNum="6"
        ></ComponentUploadImages>
      </div>

      <div class="button-wrapper">
        <ComponentButton
          type="primary"
          name="保存"
          height="72rpx"
          @click="handleSave"
        ></ComponentButton>
      </div>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentUploadImages from '@/components/project/ez-upload-images/ez-upload-images.vue'

import Big from '@/utils/big.min.js'
import { navigateBack, setStorage } from '@/utils/uni-api'
import { requestB055, requestB056, requestB064 } from '@/service/api'
import { USER_INFO, USER_LIST, GOOD_INFO, SHOP_INFO } from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageGoodEdit',
  components: {
    ComponentButton,
    ComponentUploadImages,
  },
  data() {
    return {
      imageList: [], // 图片
      // 商品信息
      goodInfoLocal: {
        chi620: '', // 物品类别
        chi621: '', // 物品名称
        chi622: '', // 物品参考价格
        chi623: '', // 支付方式
        chi624: '', // 支付比例
        chi625: '', // 备注
        aae011: '', // 经办人
        aae017: '', // 经办部门
        aae035: '', // 数据修改时间
        aae036: '', // 经办时间
        aae100: '', // 数据有效性
        cht130: '', // 商铺主键
        cht140: '', // 商品主键
        cht141: '', // 实际价格
      },
      goodTypeIndex: '',
      goodTypeDesc: '',
      goodTypeRange: [], // 商品类型
    }
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    // 查询商品类别下拉选
    requestB064().then((res) => {
      const { list } = res.lists.hi62List
      this.goodTypeRange = [...list]
    })
  },
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 商铺物品新增
    _requestB055() {
      const {
        chi620, // 物品类别
        chi621, // 物品名称
        chi622, // 物品参考价格
        chi623, // 支付方式
        chi624, // 支付比例
        chi625, // 备注
        cht140, // 商品主键
        cht141, // 实际价格
      } = this.goodInfoLocal
      const imageList = this.imageList
      const getSellPrice = this.getSellPrice
      const { cht130 } = this.shopInfo

      let hi21List = []
      imageList.map((item) => {
        const filenameArr = item.filename.split('.')
        const fileSubfix = '.' + filenameArr[filenameArr.length - 1]
        hi21List.push({
          che110: '', // 材料id
          chi212: item.filename, // 文件名
          chi214: fileSubfix, // 文件类别
          chi215: item.fileid, // 统一存储id
          chi217: '', // 文件备注
        })
      })

      if (!cht140) {
        requestB055(
          chi620,
          chi621,
          chi622,
          chi624,
          chi625,
          cht130,
          getSellPrice,
          hi21List
        ).then((res) => {
          setStorage('SHOP_CENTER_TYPE', 'bank').then(() => {
            navigateBack(1)
          })
        })
      } else {
        requestB056(
          chi620,
          chi621,
          chi622,
          chi624,
          chi625,
          cht130,
          cht140,
          getSellPrice,
          hi21List
        ).then((res) => {
          setStorage('SHOP_CENTER_TYPE', 'bank').then(() => {
            navigateBack(1)
          })
        })
      }
    },
    // 商品类型
    handleChangePickerGoodType(e) {
      const value = e.target.value
      const goodTypeRange = this.goodTypeRange
      const item = goodTypeRange[value]
      this.goodTypeDesc = item.name
      this.goodTypeIndex = value
      this.goodInfoLocal = {
        ...this.goodInfoLocal,
        chi620: item.id,
      }
    },
    // 材料上传 change
    handleChangeImageList(data) {
      console.log(data, '======avatarImageList====')
      this.imageList = [...data]
    },
    // 保存
    handleSave() {
      this._requestB055()
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST, GOOD_INFO, SHOP_INFO]),
    getSellPrice() {
      const { chi622, chi624 } = this.goodInfoLocal
      let num = 0
      num = new Big(chi622 || 0).div(10).times(chi624 || 0)
      return num
    },
  },
  watch: {
    'goodInfo.cht140': {
      handler(val) {
        if (val) {
          const goodInfo = this.goodInfo
          this.goodInfoLocal = {
            ...goodInfo,
          }
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.input-title {
  font-size: 32rpx;
  line-height: 1.4;
  font-weight: 700;
  color: $color;
  padding-left: 20rpx;
  margin-top: 40rpx;
  margin-bottom: 20rpx;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 8rpx;
    height: 32rpx;
    background-color: $primary;
    border-radius: 2rpx;
  }
}
.input-cell {
  width: 100%;
  border-bottom: 1px solid $border-color;
  padding: 0 10rpx 0 20rpx;
  display: flex;
  align-items: center;
  line-height: 1.4;
  font-size: 30rpx;
  color: $color;
  .label {
    margin-right: 20rpx;
    font-weight: 700;
    padding: 26rpx 0;
  }
  .value {
    flex: 1;
    overflow: hidden;
    // background-color: #f00;
    text-align: right;
    padding: 26rpx 0;
    input {
      width: 100%;
      color: inherit;
      line-height: inherit;
      display: block;
      // background-color: #0f0;
    }
    textarea {
      width: 100%;
      height: 200rpx;
      background-color: rgba(#f0f2f5, 0.58);
      border-radius: 12rpx;
      text-align: left;
      padding: 12rpx;
    }
    .value-placeholder {
      color: $color-input-placeholder;
    }
  }
  &.disabled {
    .value {
      opacity: 0.4;
    }
  }
}
.good-edit {
  padding: $spacing;
  .main-content {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 0 40rpx;
  }
  .button-wrapper {
    padding: 60rpx 0;
  }
}
.picker {
  .picker-content {
    width: 100%;
    padding: 0;
    font-size: 30rpx;
    color: $color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .picker-value {
      flex: 1;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .picker-placeholder {
      flex: 1;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: $color-input-placeholder;
    }
    .iconimg {
      width: 34rpx;
      height: 30rpx;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA8CAMAAADovOwsAAAAUVBMVEUAAACjqbWiqLSiqLOip7ShqLSiqLWkrLaor7e/v7+iqLShqLShqLSiqLOhqLOiqLSiqbWjqLWiqLSiqbWkqLejqreqqrOmsbyqqsahqLShp7N1OjNvAAAAGnRSTlMARvXK75Z+IBAE+uTj2Lmna2ZYTzUnGwsJxDVguhsAAACgSURBVFjD7dRZCsMwDATQSRzH2fekqe5/0EI/QherWA4ECnoHEIjRCEoppS42m4o80vuMYCOxRgS6ZcRKC4RJ6IfkmiHydXg5sXKEKg0xTIlga8oss0JgIK8BIh15dJDZPAllG4Qm+jJBrKcPPeSKmt7UBSIkzL3LWHphEWdv6dDuiLQc/61aEC2X945voilxgnvm3Dic4mzTWAellPojD271KyynL8l2AAAAAElFTkSuQmCC)
        no-repeat center center;
      background-size: 100% 100%;
    }
  }
}
</style>
