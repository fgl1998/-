<template>
  <view class="shop-add h5-page">
    <div class="main-content">
      <div class="input-cell-wrapper">
        <div class="input-title">商铺基本信息</div>
        <div class="input-cell disabled">
          <div class="label">法人姓名</div>
          <div class="value">
            {{ basicInfo.name }}
          </div>
        </div>
        <div class="input-cell disabled">
          <div class="label">法人身份证号</div>
          <div class="value">
            {{ basicInfo.idCard }}
          </div>
        </div>
        <div class="input-cell disabled">
          <div class="label">联系电话</div>
          <div class="value">
            {{ basicInfo.phoneNumber }}
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商户类型</div>
          <div class="value">
            <picker
              class="picker"
              :range="codeMap.cht134"
              range-key="aaa103"
              :value="shopTypeIndex"
              @change="handleChangePickerShopType"
            >
              <div class="picker-content">
                <div class="picker-value" v-if="basicInfo.shopType">
                  {{ shopTypeDesc }}
                </div>
                <div class="picker-placeholder" v-else>请选择商户类型</div>
                <div class="iconimg"></div>
              </div>
            </picker>
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商户名称</div>
          <div class="value">
            <input
              type="text"
              maxlength="12"
              placeholder="请输入商户名称"
              v-model="basicInfo.shopName"
            />
          </div>
        </div>
        <div class="input-cell">
          <div class="label">统一社会信用代码</div>
          <div class="value">
            <input
              type="text"
              maxlength="18"
              v-model="basicInfo.shopCode"
              placeholder="请输入信用代码"
            />
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商户成立日期</div>
          <div class="value">
            <picker
              class="picker"
              mode="date"
              :end="today"
              @change="handleChangePickerDate"
            >
              <div class="picker-content">
                <div class="picker-value" v-if="basicInfo.date">
                  {{ basicInfo.date }}
                </div>
                <div class="picker-placeholder" v-else>请选择商户成立日期</div>
                <div class="iconimg"></div>
              </div>
            </picker>
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商户住所</div>
          <div class="value">
            <input
              type="text"
              v-model="basicInfo.registeredAddress"
              placeholder="请输入商户注册地址"
            />
          </div>
        </div>
        <div class="input-cell address">
          <div class="label">商户地址</div>
          <div class="value" @click="handleSelectAddress">
            <div class="value-val" v-if="basicInfo.address">
              {{ basicInfo.address }}
            </div>
            <div class="value-placeholder" v-else>请选择商户地址</div>
          </div>
          <div class="iconimg iconimg-address"></div>
        </div>

        <div class="input-cell">
          <div class="label">业务局</div>
          <div class="value">
            <picker
              class="picker"
              :range="chi037Range"
              range-key="name"
              :value="chi037Index"
              @change="handleChangePickerBusinessBureau"
            >
              <div class="picker-content">
                <div class="picker-value" v-if="basicInfo.businessBureau">
                  {{ chi037Desc }}
                </div>
                <div class="picker-placeholder" v-else>请选择业务局</div>
                <div class="iconimg"></div>
              </div>
            </picker>
          </div>
        </div>
        <div
          class="input-cell"
          v-if="basicInfo.businessBureau && chi031Range.length > 0"
        >
          <div class="label">补贴项目</div>
          <div class="value">
            <picker
              class="picker"
              :range="chi031Range"
              range-key="name"
              :value="chi031Index"
              @change="handleChangePickerSubsidizedProject"
            >
              <div class="picker-content">
                <div class="picker-value" v-if="basicInfo.subsidizedProject">
                  {{ chi031Desc }}
                </div>
                <div class="picker-placeholder" v-else>请选择补贴项目</div>
                <div class="iconimg"></div>
              </div>
            </picker>
          </div>
        </div>
        <div class="input-cell">
          <div class="label">商铺简介</div>
          <div class="value">
            <textarea
              placeholder="请输入商铺简介"
              maxlength="100"
              v-model="basicInfo.desc"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="input-cell-wrapper">
        <div class="input-title">银行卡信息</div>
        <div class="input-cell">
          <div class="label">收款户名</div>
          <div class="value">
            <input
              type="text"
              maxlength="18"
              placeholder="请输入收款人姓名"
              v-model="basicInfo.bankCardName"
            />
          </div>
        </div>
        <div class="input-cell">
          <div class="label">收款卡号</div>
          <div class="value">
            <input
              type="number"
              maxlength="19"
              placeholder="请输入银行卡卡号"
              v-model="basicInfo.bankCardNumber"
            />
          </div>
        </div>
        <div class="input-cell">
          <div class="label">收款银行</div>
          <div class="value">
            <picker
              class="picker"
              :range="codeMap.aae008"
              range-key="aaa103"
              :value="bankCardTypeIndex"
              @change="handleChangePickerBankCardType"
            >
              <div class="picker-content">
                <div class="picker-value" v-if="basicInfo.bankCardType">
                  {{ bankCardTypeDesc }}
                </div>
                <div class="picker-placeholder" v-else>请选择收款银行</div>
                <div class="iconimg"></div>
              </div>
            </picker>
          </div>
        </div>
      </div>

      <block v-for="(item, index) in he09List" :key="index">
        <div class="upload-files-wrapper">
          <div class="input-title">{{ item.che091 }}上传</div>
          <ComponentUploadImages
            @change="handleChangeImage($event, item.che090)"
            :imageList="item.imageList"
            :uploadNum="item.che094"
          ></ComponentUploadImages>
        </div>
      </block>

      <div class="button-wrapper">
        <ComponentButton
          type="primary"
          name="保存"
          height="72rpx"
          :disabled="!isCanApply"
          @click="handleSave"
        ></ComponentButton>
      </div>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentUploadImages from '@/components/project/ez-upload-images/ez-upload-images.vue'

import { mapGetters } from 'vuex'

import config from '@/config'
import { showModal, chooseLocation, redirectTo } from '@/utils/uni-api'
import {
  requestB050,
  requestB057,
  requestB061,
  requestB062,
} from '@/service/api'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { getDate, getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { USER_INFO, USER_LIST } from '@/store/constants'
export default {
  name: 'pageShopAdd',
  components: {
    ComponentButton,
    ComponentUploadImages,
  },
  data() {
    return {
      today: getDate(),
      // 基本信息填报
      basicInfo: {
        latitude: '',
        longitude: '',
        address: '', // 商户地址
        registeredAddress: '', // 商户注册地址
        phoneNumber: '', // 联系电话
        idCard: '', // 法人身份证号
        name: '', // 法人姓名
        shopName: '', // 商户名称
        shopType: '', // 商户类型
        shopCode: '', // 商户统一社会信用代码
        desc: '', // 商铺简介
        date: '', // 成立日期

        businessBureau: '', // 业务局
        subsidizedProject: '', // 补贴项目名称

        bankCardType: '', // 银行卡类别
        bankCardNumber: '', // 银行卡卡号
        bankCardName: '', // 银行卡姓名
      },
      shopTypeIndex: '',
      shopTypeDesc: '',
      chi037Index: '',
      chi037Desc: '',
      chi037Range: [],
      chi031Index: '',
      chi031Desc: '',
      chi031Range: [],
      bankCardTypeIndex: '',
      bankCardTypeDesc: '',
      // 码表
      codeMap: {
        cht134: [], // 商户类型
        aae008: [], // 银行卡类别
      },
      // 材料上传列表
      he09List: [],
      isCanApply: true, // 是否可以申报
    }
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {},
  // 监听页面初次渲染完成
  onReady() {
    this.getCodeMap()
    this._requestB061()
  },
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取码表
    async getCodeMap() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let cht134 = [] // 商户类型
      let aae008 = [] // 商户类型

      try {
        cht134 = await getCodeListByCodeName('cht134')
        aae008 = await getCodeListByCodeName('aae008')
      } catch (err) {
        if (isDev) {
          console.log('code table cht134/aae008 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        cht134,
        aae008,
      }
    },
    // 商铺入驻
    _requestB050() {
      const { areaCode } = config
      const {
        latitude,
        longitude,
        address, // 商户地址
        registeredAddress, // 商户注册地址
        phoneNumber, // 联系电话
        idCard, // 法人身份证号
        name, // 法人姓名
        shopName, // 商户名称
        shopType, // 商户类型
        shopCode, // 商户信用代码
        desc, // 商铺简介
        date, // 成立日期

        businessBureau, // 业务局
        subsidizedProject, // 补贴项目名称

        bankCardType, // 银行卡类别
        bankCardNumber, // 银行卡卡号
        bankCardName, // 银行卡姓名
      } = this.basicInfo
      const chi031Desc = this.chi031Desc
      const he09List = this.he09List
      let hi21List = []
      he09List.map((item) => {
        item.imageList.map((item2) => {
          console.log(item, item2, 'item item2')
          const filenameArr = item2.filename.split('.')
          const fileSubfix = '.' + filenameArr[filenameArr.length - 1]
          hi21List.push({
            che110: item.che110, // 材料id
            chi212: item2.filename, // 文件名
            chi214: fileSubfix, // 文件类别
            chi215: item2.fileid, // 统一存储id
            chi217: '', // 文件备注
          })
        })
      })
      const data = {
        methodName: 'B050',
        businessName: '商铺入驻',
        userList: JSON.stringify([this.userList]),
        aab031: areaCode,
        aac002: idCard,
        aac003: name,

        aae005: phoneNumber, // 联系电话
        aae006: address, // 商户地址
        aae008: bankCardType, // 对公结算银行类别
        aae009: bankCardName, // 对公结算用户名
        aae010: bankCardNumber, // 对公结算账号

        chb004: '03', // 受理渠道
        cht132: getDate('year'), // 申报年代
        cht135: registeredAddress, // 商户注册地址
        cht136: date, // 商户注成立日期

        cht131: shopName, // 商户名称
        cht133: shopCode, // 统一社会信用代码
        cht134: shopType, // 商户类型
        cht138: desc, // 商户简介
        cht139: longitude + '', // 经度
        cht13a: latitude + '', // 维度

        chi031: subsidizedProject, // 补贴项目
        chi032: chi031Desc, // 补贴项目中文
        chi037: businessBureau, // 业务局
        hi21List: JSON.stringify(hi21List),
      }
      requestB050(data)
        .then(() => {
          showModal('申请已成功提交，请等待相关工作人员审核！').then((res) => {
            redirectTo('shop-list', 'packageSubsidizedGoods')
          })
        })
        .finally(() => {
          this.isCanApply = true
        })
    },
    // 商铺入驻材料列表查询
    _requestB057(chi031) {
      requestB057(chi031)
        .then((res) => {
          const { list } = res.lists.he09List
          const newList = []
          list.map((item) => {
            item.imageList = []
            item.che094 = Number(item.che094)
            newList.push(item)
          })
          this.he09List = [...newList]
        })
        .catch((err) => {})
    },
    // 查询专项补贴项目业务局列表
    _requestB061() {
      requestB061()
        .then((res) => {
          const { list } = res.lists.chi037List
          this.chi037Range = [...list]
          this.chi031Index = ''
          this.chi031Desc = ''
          this.basicInfo.subsidizedProject = ''
          this.chi031Range = []
        })
        .catch((err) => {})
    },
    // 根据业务局查询专项补贴列表
    _requestB062(chi037) {
      this.chi031Range = []
      requestB062(chi037)
        .then((res) => {
          const { list } = res.lists.chi031List
          if (list && list.length > 0) {
            this.chi031Range = [...list]
          } else {
            showModal(
              '该业务局暂无可选择的补贴项目，请选择其他业务局进行入驻！'
            )
          }
        })
        .catch((err) => {})
    },
    // 校验身份证号是否正确
    hanldeBlurIdCard(e) {
      const value = e.target.value.trim()
      if (!value) {
        showModal('请输入法定代表人身份证号')
      } else {
        const checkResult = checkIDCard(value, '法人身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
        }
      }
    },
    // 校验联系电话是否正确
    hanldeBlurPhoneNumber(e) {
      const value = e.target.value.trim()
      if (!value) {
        showModal('请输入联系电话')
      } else {
        const checkResult = checkPhoneNumber(value, '联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
        }
      }
    },
    // 商户类型 picker 改变
    handleChangePickerShopType(e) {
      const value = e.target.value
      const { cht134 } = this.codeMap
      const item = cht134[value]
      this.shopTypeDesc = item.aaa103
      this.shopTypeIndex = value
      this.basicInfo = {
        ...this.basicInfo,
        shopType: item.aaa102,
      }
    },
    // 业务局 picker 改变
    handleChangePickerBusinessBureau(e) {
      const value = e.target.value
      const chi037Range = this.chi037Range
      const item = chi037Range[value]
      this.chi037Desc = item.name
      this.chi037Index = value
      this.basicInfo = {
        ...this.basicInfo,
        businessBureau: item.id,
      }
    },
    // 补贴项目 picker 改变
    handleChangePickerSubsidizedProject(e) {
      const value = e.target.value
      const chi031Range = this.chi031Range
      const item = chi031Range[value]
      this.chi031Desc = item.name
      this.chi031Index = value
      this.basicInfo = {
        ...this.basicInfo,
        subsidizedProject: item.id,
      }
    },
    // 银行卡类别 picker 改变
    handleChangePickerBankCardType(e) {
      const value = e.target.value
      const { aae008 } = this.codeMap
      const item = aae008[value]
      this.basicInfo = {
        ...this.basicInfo,
        bankCardType: item.aaa102,
      }
      this.bankCardTypeDesc = item.aaa103
      this.bankCardTypeIndex = value
    },
    // 成立日期 选择
    handleChangePickerDate(e) {
      const value = e.target.value
      this.basicInfo = {
        ...this.basicInfo,
        date: value,
      }
    },
    // 选择商铺地址
    handleSelectAddress() {
      chooseLocation().then((res) => {
        const { latitude, address, longitude } = res
        this.basicInfo = {
          ...this.basicInfo,
          latitude,
          address,
          longitude,
        }
      })
    },
    // 材料上传
    handleChangeImage(data, id) {
      const he09List = [...this.he09List]
      const len = he09List.length
      const newArr = []
      for (let i = 0; i < len; i++) {
        const item = he09List[i]
        if (item.che090 === id) {
          item.imageList = [...data]
        }
        newArr.push(item)
      }
      this.he09List = [...newArr]
    },
    // 检测输入项是否已完全输入
    handleCheckInpu() {
      const {
        address, // 商户地址
        registeredAddress, // 商户注册地址
        phoneNumber, // 联系电话
        idCard, // 法人身份证号
        name, // 法人姓名
        shopName, // 商户名称
        shopType, // 商户类型
        shopCode, // 商户信用代码
        desc, // 商户简介
        date, // 商户成立日期

        businessBureau, // 业务局
        subsidizedProject, // 补贴项目名称

        bankCardType, // 银行卡类别
        bankCardNumber, // 银行卡卡号
        bankCardName, // 银行卡姓名
      } = this.basicInfo
      if (!name.trim()) {
        showModal('请输入法定代表人姓名')
        return false
      }
      if (!idCard.trim()) {
        showModal('请输入法定代表人身份证号')
        return false
      } else {
        const checkResult = checkIDCard(idCard, '法定代表人身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!phoneNumber.trim()) {
        showModal('请输入联系电话')
        return false
      } else {
        const checkResult = checkPhoneNumber(phoneNumber, '联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!shopType) {
        showModal('请选择商户类型')
        return false
      }
      if (!shopName.trim()) {
        showModal('请输入商户名称')
        return false
      }
      if (!shopCode.trim()) {
        showModal('请输入商户统一信用代码')
        return false
      }
      if (!date) {
        showModal('请选择商户成立日期')
        return false
      }
      if (!registeredAddress.trim()) {
        showModal('请输入商户注册地址')
        return false
      }
      if (!address) {
        showModal('请选择商户地址')
        return false
      }

      if (!businessBureau) {
        showModal('请选择业务局')
        return false
      }
      if (!subsidizedProject) {
        showModal('请选择补贴项目')
        return false
      }
      if (!desc.trim()) {
        showModal('请输入商铺简介')
        return false
      }
      if (!bankCardName.trim()) {
        showModal('请输入收款人姓名')
        return false
      }
      if (!bankCardNumber.trim()) {
        showModal('请输入银行卡卡号')
        return false
      }
      if (!bankCardType.trim()) {
        showModal('请选择收款银行')
        return false
      }
      return true
    },
    // 保存
    handleSave() {
      const result = this.handleCheckInpu()
      if (!result) {
        return
      }
      this.isCanApply = false
      this._requestB050()
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST]),
  },
  watch: {
    'basicInfo.businessBureau': {
      handler(val) {
        if (val) {
          this._requestB062(val)
        }
      },
      immediate: true,
    },
    'basicInfo.subsidizedProject': {
      handler(val) {
        if (val) {
          this._requestB057(val)
        }
      },
      immediate: true,
    },
    'userInfo.user_id': {
      handler(val) {
        if (val) {
          const { idCard, userName, tel } = this.userInfo
          this.basicInfo = {
            ...this.basicInfo,
            name: userName,
            idCard,
            phoneNumber: tel,
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
  &.address {
    position: relative;
    .value {
      padding-right: 44rpx;
    }
    .iconimg-address {
      position: absolute;
      top: 50%;
      right: 10rpx;
      transform: translateY(-50%);
      width: 33rpx;
      height: 42rpx;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABUCAMAAAABBRFcAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABXUExURUdwTB1x/xxw/x1w/xtu/xtv/x9y/xtu/xtu/xxv/xtv/yZ4/xtv/yBz/xtv/1CA/xxv/xtu/////y56/9zp/0KH/5O6//T4/6nJ/36t/1WT/8fc/7nT/yC5/J8AAAARdFJOUwAvVT/7myHv4oqqCtMWwgNxyi1/LwAAAmRJREFUWMPFmNmSqyAQhlFAFkWDCxqT93/O8TiTHI3dyjJV86cqF8Z8Bd1NLxCCqciVrqRgTMhKq7wgYWool9ay9WN/viWnjTegUOv/P7Q8kMprLU3BD//ecPg1pFQngFWqPCfk0l5K5mdL4NZLHF1IUVlPVYhFMmm9JTOIQIUNkKDAGoIIC+OwjkLaQMkPe5SVDVa19wu3EeK7iLJR2sSYEXEIYdK2sdtKxmIR7OVZjb/TDfM8dPjv+icksEUMrm9X9W7AlvEdHAoBPNuNnghErWkKdse9/dAddkqDxsTUHjShscE9CQjjn1+lzy7wvcjFH5ArRxgxQu4tQFNMLaIJNAbg0q5F1UFu1d6WQKyhCZBrHjjiAWQeyCEjjhghlwCx2Z4IiE/CQqwJ2ZP9BkKk2kJA5uxxRA+Zsz4+dDjCHd+uodCaccQMhRaUs/qAfSwBDh2zOWARLCcGyiNPmPCE3jVwyunArfTAOWUSS3wQox+QxNdQuAYdjusDrkgULwLW7YJ0dBYvAo3CiqF776Z3WFFU5wVxqWh3N03uPuB12VyWZd/uIItHvNu+Opag/3etsQhKUjsltW07ZQxB7hrPmK2wjzZcpW0jroOuytQ+XprjZBg2TcgCHG8DGCKDJyt/BjQThU1nMjsZtb38UpvTYdnj4OuLcZncLsYCpq7n/uz06Ivc6+7ghntGG98LDJ2yhLMbBG6CrmKOlwgVJcHXOSLo5gNkbM8dy0mUKEslbLIyjyW8p2hhohGvjKriCa/EniUgSvbuIaJVfTenKar3xTfarSoJoX4JcftrRFELUV+ExRcMT/TDiHsW+wAAAABJRU5ErkJggg==);
    }
  }
  &.disabled {
    .value {
      opacity: 0.4;
    }
  }
}
.shop-add {
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
