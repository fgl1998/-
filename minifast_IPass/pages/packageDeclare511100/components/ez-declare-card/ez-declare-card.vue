<template>
  <view class="ez-declare-card-wrapper">
    <block v-for="(item, index) in renderData" :key="item.id">
      <div class="card">
        <div class="operating">
          <div class="iconfont iconfont-edit" @click.stop="handleEdit(index)"></div>
          <div class="iconfont iconfont-delete" @click.stop="handleDelete(index)"></div>
        </div>
        <!-- 凉山 公共租赁住房实物配租 添加共同申请人 示例 -->
        <block v-if="type === '200001'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">联系电话：</div>
            <div class="value">{{ item.tel }}</div>
          </div>
          <div class="cell">
            <div class="key">月收入：</div>
            <div class="value">{{ item.income }}</div>
          </div>
          <div class="cell">
            <div class="key">工作单位：</div>
            <div class="value">{{ item.unit }}</div>
          </div>
          <div class="cell">
            <div class="key">所属群体：</div>
            <div class="value">{{ item.group }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾类别：</div>
            <div class="value">{{ item.categories }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾等级：</div>
            <div class="value">{{ item.grade }}</div>
          </div>
        </block>
      </div>
    </block>

    <div class="card add" @click="handleAdd">
      <div class="iconfont iconfont-add"></div>
      <div class="">{{ addButtonName }}</div>
    </div>

    <ComponentPopup ref="popup" type="center" style="max-height: 100px">
      <div class="popup-con">
        <!-- 凉山 公共租赁住房实物配租 添加共同申请人 -->
        <block v-if="type === '200001'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">联系方式：</div>
            <div class="value">
              <input
                class="input"
                type="number"
                maxlength="11"
                placeholder="请输入联系方式"
                v-model="selectInfo.tel"
                @blur="handleTelBlur" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">月收入：</div>
            <div class="value">
              <input class="input" type="digit" maxlength="30" placeholder="请输入月收入" v-model="selectInfo.income" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">工作单位：</div>
            <div class="value">
              <input class="input" type="text" placeholder="请输入工作单位" v-model="selectInfo.unit" />
            </div>
          </div>
          <ComponentDeclarePicker
            :range="codeMap.z00065"
            label="所属群体"
            placeholder="请选择所属群体"
            idName="group"
            align="right"
            v-model="selectInfo.group"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            :range="codeMap.z00066"
            label="残疾类别"
            placeholder="请选择残疾类别"
            idName="categories"
            align="right"
            :required="false"
            v-model="selectInfo.categories"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            :range="codeMap.chb0h2"
            label="残疾等级"
            placeholder="请选择残疾等级"
            idName="grade"
            :required="false"
            align="right"
            v-model="selectInfo.grade"
            @change="handlePickerChange"></ComponentDeclarePicker>
        </block>
        <div class="button-wrapper">
          <ComponentButton name="保存" type="primary" @click="handleSave"></ComponentButton>
        </div>
        <div class="iconfont iconfont-close" @click="closePopup"></div>
      </div>
    </ComponentPopup>
  </view>
</template>

<script>
  import ComponentPopup from '@/components/common/ez-popup/ez-popup.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import { showModal } from '@/utils/uni-api'
  import { getDate } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
  import { getAge } from '@/utils/get'
  import { requestSPGetHo08 } from '@/service/api'
  /**
   * 申报 卡片 组件
   * @description 申报 卡片 组件
   */
  export default {
    name: 'ezDeclareCard',
    props: {
      // 渲染数据
      renderData: {
        type: [Array],
        default: () => {
          return []
        }
      },
      // 添加按钮名称
      addButtonName: {
        type: [String],
        default: '添加'
      },
      // 类型 根据项目编号设定
      type: {
        type: [String],
        required: true
      }
    },
    data() {
      return {
        // 选择的信息 或者 填报的信息
        selectInfo: {},

        // 自定义单位
        unit: [
          {
            id: 'n00068',
            name: '万袋（棒)',
            attribute: ['食用菌']
          },
          {
            id: 'n00069',
            name: '年出栏（头）',
            attribute: ['猪', '肉牛', '羊']
          },
          {
            id: 'n00070',
            name: '年存栏（只)',
            attribute: ['蛋禽', '能繁殖母兔']
          },
          {
            id: 'n00071',
            name: '年出栏（只）',
            attribute: ['肉禽']
          },
          {
            id: 'n00072',
            name: '年存栏（箱）',
            attribute: ['中蜂', '意蜂']
          },
          {
            id: 'n00073',
            name: '面积（亩）',
            attribute: ['粮油', '蔬菜', '水果', '中药材', '茶叶、蚕桑', '其他经济作物']
          },
          {
            id: 'n00074',
            name: '年产值（万元）',
            attribute: ['特种养殖']
          },
          {
            id: 'n00075',
            name: '池塘养殖面积（亩）',
            attribute: ['水产养殖']
          }
        ],

        today: getDate(), // 今日时间 限制时间选择
        codeMap: {}
      }
    },
    components: {
      ComponentPopup,
      ComponentButton,
      ComponentDeclarePicker,
      ComponentDeclareRadio
    },
    filters: {},
    computed: {},
    created() {},
    mounted() {
      this.getCodeTableCacheData()
    },
    methods: {
      openPopup() {
        this.$refs.popup.open()
      },
      closePopup() {
        this.$refs.popup.close()
      },
      // 获取该申报项目的所需要的码表数据
      getCodeTableCacheData() {
        const type = this.type
        getCodeListByCodeName('yesorno').then((res) => {
          this.codeMap = {
            ...this.codeMap,
            yesorno: res
          }
        })
        // 凉山 公共租赁住房实物配租 添加共同申请人
        if (type === '200001') {
          // 所属群体
          getCodeListByCodeName('z00065').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              z00065: res
            }
          })
          // 残疾类型
          getCodeListByCodeName('z00066').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              z00066: res
            }
          })
          // 残疾等级
          getCodeListByCodeName('chb0h2').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              chb0h2: res
            }
          })
        }
      },
      // 根据开始时间和结束时间计算累计年月
      getTotalTime(startTime, endTime) {
        let str = ''
        let s = startTime.split('-')
        let e = endTime.split('-')
        let y = parseInt(e[0]) - parseInt(s[0])
        let m = parseInt(e[1]) - parseInt(s[1]) + 1
        if (m < 0) {
          m = 12 + m
          y = y - 1
        }
        if (m >= 12) {
          m = 0
          y = y + 1
        }
        str = y + '年' + m + '月'
        return str
      },

      // 捕获 picker 改变
      handlePickerChange(id, val_desc, val) {
        this.selectInfo = {
          ...this.selectInfo,
          [id]: val,
          [id + '_desc']: val_desc
        }
      },

      // 手动输入身份证号 失去焦点
      handleBlurIdCard(e) {
        const { value } = e.target
        const checkResult = checkIDCard(value, '成员身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          this.selectInfo = {
            ...this.selectInfo
          }
        } else {
          // 身份证号输入正确
          let res = this.renderData.find((item) => item.idCard === value)
          if (res) {
            showModal('身份证号已录入！')
          }
          const age = getAge(value)
          this.selectInfo = {
            ...this.selectInfo,
            age
          }
        }
      },
      // 手动输入手机号 失去焦点监听
      handleTelBlur(e) {
        const { value } = e.target
        const checkIDCardResult = checkPhoneNumber(value, '联系方式')
        if (checkIDCardResult.status === '0') {
          showModal(checkIDCardResult.msg, '提示', false)
        }
      },
      // 检测输入项是否输入合法
      handleCheck() {
        const type = this.type
        const renderData = [...this.renderData]
        if (type === '200001') {
          const { name, idCard, tel, income, unit, group, categories, grade } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
            for (let i = 0, len = renderData.length; i < len; i++) {
              let item = renderData[i]
              if (idCard === item.idCard) {
                showModal('该对象已添加，请添加未添加成员！')
                return false
              }
            }
          }
          if (!tel) {
            showModal('请输入联系方式')
            return false
          } else {
            const checkResult = checkPhoneNumber(tel, '联系方式')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          if (!income) {
            showModal('请输入月收入')
            return false
          }
          if (!unit) {
            showModal('请输入工作单位')
            return false
          }
          if (!group) {
            showModal('请选择所属群体')
            return false
          }
          // if (!categories) {
          //   showModal('请选择残疾类别')
          //   return false
          // }
          // if (!grade) {
          //   showModal('请选择残疾等级')
          //   return false
          // }
        }
        return true
      },
      // 添加
      handleAdd() {
        const type = this.type
        // 解决无法识别时间限制
        if (type === '999999') {
        } else {
          this.selectInfo = {}
        }

        this.openPopup()
      },
      // 编辑
      handleEdit(index) {
        const item = this.renderData[index]
        this.selectInfo = {
          ...item
        }
        this.openPopup()
      },
      // 删除
      handleDelete(index) {
        const type = this.type
        const newRenderData = [...this.renderData]
        newRenderData.splice(index, 1)
        this.$emit('change', type, newRenderData)
      },
      // 保存
      handleSave() {
        const result = this.handleCheck()
        if (!result) {
          return
        }
        const type = this.type
        const renderData = [...this.renderData]
        const newRenderData = []
        let selectInfo = { ...this.selectInfo }
        const { id } = selectInfo
        // 编辑
        if (id) {
          renderData.forEach((item) => {
            if (item.id === id) {
              item = {
                ...selectInfo
              }
            }
            newRenderData.push(item)
          })
          this.$emit('change', type, newRenderData)
        } else {
          // 添加
          // console.log('======selectInfo====', selectInfo)
          selectInfo = { ...selectInfo, id: +new Date() + '' }
          renderData.push(selectInfo)
          this.$emit('change', type, renderData)
        }
        this.selectInfo = { ...selectInfo }
        this.closePopup()
      }
    },
    watch: {
      'selectInfo.type': {
        handler(val) {
          if (val) {
            this.selectInfo = {
              ...this.selectInfo,
              botany: '',
              botany_desc: '',
              breed: '',
              breed_desc: '',
              n00068: '',
              n00069: '',
              n00070: '',
              n00071: '',
              n00072: '',
              n00073: '',
              n00074: '',
              n00075: ''
            }
          }
        },
        immediate: true
      },
      // 监听开始时间改变 计算累计工作时间
      'selectInfo.start': {
        handler(val) {
          if (val) {
            const type = this.type
            const { end } = this.selectInfo
            if (type === '20457_l' && end) {
              const totalTime = this.getTotalTime(val, end)
              this.selectInfo = {
                ...this.selectInfo,
                totalTime
              }
            }
          }
        },
        immediate: true
      },
      // 监听结束时间改变 计算累计工作时间
      'selectInfo.end': {
        handler(val) {
          if (val) {
            const type = this.type
            const { start } = this.selectInfo
            if (type === '20457_l' && start) {
              const totalTime = this.getTotalTime(start, val)
              this.selectInfo = {
                ...this.selectInfo,
                totalTime
              }
            }
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ez-declare-card-wrapper {
    .card {
      background-color: #ffffff;
      border-radius: 8rpx;
      border: solid 1px $border-color;
      font-size: 28rpx;
      line-height: 1;
      color: $color;
      padding: 20rpx;
      position: relative;
      margin-bottom: 24rpx;
      &.add {
        color: $primary;
        min-height: 200rpx;
        font-size: 32rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0;
        .iconfont-add {
          font-size: 40rpx;
        }
      }
      .cell {
        margin-bottom: 20rpx;
        font-size: 28rpx;
        line-height: 1.4;
        display: flex;
        .key {
          color: $color;
        }
        .name {
          font-weight: 600;
          font-size: 32rpx;
        }
        .relationship_man {
          box-sizing: border-box;
          border: 1px solid #aac1de;
          color: #2f77e2;
          font-size: 24rpx;
          padding: 2rpx 10rpx;
          background-color: #d6e8ff;
          border-radius: 5rpx;
        }
        .relationship_woman {
          box-sizing: border-box;
          border: 1px solid #d694c2;
          color: #e615a6;
          font-size: 24rpx;
          padding: 2rpx 10rpx;
          background-color: #fff0fa;
          border-radius: 5rpx;
        }
        .interval {
          padding: 0 10rpx;
          color: #ccc;
        }
        .value {
          flex: 1;
          overflow: hidden;
          color: #ff7e00;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
      }
      .operating {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 32rpx;
          color: $primary;
          padding: 20rpx;
        }
      }
    }
    .popup-con {
      width: 700rpx;
      background-color: #fff;
      position: relative;
      padding: 40rpx;
      padding-top: 60rpx;
      border-radius: 8rpx;
      .input-cell {
        display: flex;
        align-items: center;
        border-bottom: 1px solid $border-color;

        height: 100rpx;
        .key {
          font-size: 30rpx;
          color: $color;
          font-weight: 700;
          padding-left: 14rpx;
          position: relative;
          &::before {
            content: '*';
            position: absolute;
            color: #f00;
            top: 50%;
            transform: translateY(-50%);
            margin-top: -4rpx;
            left: 0;
          }
        }
        .value {
          flex: 1;
          color: shade($color-placeholder, 20%);
          overflow: hidden;
          padding-left: 20rpx;
          text-align: right;
        }
        .input {
          font-size: 30rpx;
          line-height: 1.4;
          color: shade($color-placeholder, 20%);
          display: block;
          font-weight: 700;
          width: 100%;
        }
        &.disabled {
          .value,
          input {
            opacity: 0.4;
          }
        }
      }
      .box-over {
        max-height: 550rpx;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
      .button-wrapper {
        padding: $spacing * 2;
        padding-bottom: 20rpx;
      }
      .iconfont-close {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        font-size: 36rpx;
        color: #f00;
        padding: 12rpx;
      }
    }
  }
</style>
