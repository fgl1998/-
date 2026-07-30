<template>
  <div>
    <p class="moment_text">
      <span>子女信息</span>
      <span class="add" @click="openChildInfoFrame"><van-icon name="plus"/>新增</span>
    </p>
    <van-card
      v-for="item in childrenInfo"
      :key="item.identificationNo"
      :tag="item.loanRelationship === '03' ? '子' : '女'"
    >
      <template #thumb>
        <div class="child-avatar" :class="item.loanRelationship === '03' ? 'avatar-son' : 'avatar-daughter'">
          <van-icon :name="item.loanRelationship === '03' ? 'manager-o' : 'manager-o'" size="24"/>
        </div>
      </template>
      <template #tags>
        <div class="card-info">
          <div class="card-info__text">
            <div class="card-info__name">{{ item.fullName }}</div>
            <div class="card-info__id">{{ item.identificationNo }}</div>
          </div>
        </div>
      </template>
      <template #footer>
        <van-button size="small" plain type="danger" @click="deletechildInfo(item.identificationNo)">删除</van-button>
      </template>
    </van-card>
    <van-empty v-if="childrenInfo.length === 0" style="background-color: #fff" description="请添加未成年人子女信息"/>
    <van-popup v-model="showchildInfoFrame" position="bottom" round>
      <p class="popup-title">子女信息</p>
      <van-form validate-first ref="childInfoForm">
        <van-field label="亲属关系" label-width="130" v-model="childInfo.loanRelationshipDesc" input-align="right"
                   placeholder="请选择亲属关系"
                   @click="openChildRelationPick"
                   :rules="[{ required: true }]" readonly required/>

        <van-field label="姓名" v-model="childInfo.fullName" input-align="right" placeholder="请输入姓名"
                   :rules="[{ required: true }]" required/>

        <van-field label="证件类型" v-model="childInfo.certificateTypeDesc" input-align="right"
                   placeholder="请选择证件类型"
                   @click="openCertTypePick" :rules="[{ required: true }]" readonly required/>

        <van-field label="证件号码" v-model="childInfo.identificationNo" input-align="right" required
                   :rules="[{ validator: validateIDCardSimple, message: '请填写正确证件号码' }]" placeholder="请填写证件号码"
                   @blur="calcIsMinor"/>
        <van-field label="是否未成年" v-model="childInfo.isMinorDesc" input-align="right" readonly disabled
                   placeholder="自动计算"/>
        <van-button class="save-btn" size="large" @click="save">保存</van-button>
      </van-form>
    </van-popup>

    <!-- 亲属关系选择 -->
    <van-popup v-model="showRelationPick" position="bottom">
      <van-picker show-toolbar value-key="label" :columns="childRelationColumns" @confirm="onRelationConfirm"
                  @cancel="showRelationPick = false"/>
    </van-popup>

    <!-- 证件类型选择 -->
    <van-popup v-model="showCertTypePick" position="bottom">
      <van-picker show-toolbar value-key="label" :columns="certTypeColumns" @confirm="onCertTypeConfirm"
                  @cancel="showCertTypePick = false"/>
    </van-popup>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'

export default {
  name: 'loanChildPage',
  mixins: [codeTableMixin],
  props: ['allPersonData', 'houseData'],
  data() {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      showchildInfoFrame: false,
      showRelationPick: false,
      showCertTypePick: false,
      childInfo: {},
      childRelationColumns: [
        { label: '子', value: '03' },
        { label: '女', value: '04' }
      ],
      certTypeColumns: [],
    }
  },
  computed: {
    ...mapState('perloanApply', ['childrenInfo']),
  },
  async mounted() {
    await this.fnGetChild()
  },
  methods: {
    ...mapActions('perloanApply', [
      'uriGetBorrowerChildrenInfo',
      'uriDeleteBorrowerChildrenInfo',
      'uriSaveBorrowerChildrenInfo'
    ]),

    async fnGetChild() {
      await this.uriGetBorrowerChildrenInfo(this.commonBizApply)
    },
    async openChildInfoFrame() {
      this.childInfo = {}
      // 确保证件类型下拉已加载
      await this.loadCertTypeColumns()
      this.showchildInfoFrame = true
    },
    // 加载证件类型码值
    async loadCertTypeColumns() {
      if (this.certTypeColumns.length > 0) return
      try {
        await this.initCodeTable(['GRZJLX'])
        this.certTypeColumns = this.getCodeList('GRZJLX')
      } catch {
        // 兜底：硬编码常用证件类型
        this.certTypeColumns = [
          { label: '身份证', value: '01' },
          { label: '护照', value: '02' },
          { label: '户口簿', value: '03' }
        ]
      }
    },
    // 打开亲属关系选择
    openChildRelationPick() {
      this.showRelationPick = true
    },
    onRelationConfirm(item) {
      this.$set(this.childInfo, 'loanRelationship', item.value)
      this.$set(this.childInfo, 'loanRelationshipDesc', item.label)
      this.showRelationPick = false
    },
    // 打开证件类型选择
    openCertTypePick() {
      this.showCertTypePick = true
    },
    onCertTypeConfirm(item) {
      this.$set(this.childInfo, 'certificateType', item.value)
      this.$set(this.childInfo, 'certificateTypeDesc', item.label)
      this.showCertTypePick = false
    },
    // 身份证号校验
    validateIDCardSimple(val) {
      if (this.childInfo.certificateType === '01') {
        const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
        return regex.test(val)
      }
      return true
    },
    // 删除未成年子女信息
    async deletechildInfo(value) {
      this.$dialog.confirm({ message: '是否删除子女信息' }).then(async () => {
        try {
          await this.uriDeleteBorrowerChildrenInfo({
            ...this.commonBizApply,
            ...this.childrenInfo.find(item => item.identificationNo === value)
          })
        } catch (e) {
          this.$toast(e)
        }
      })
    },
    // 保存
    save() {
      this.$refs.childInfoForm.validate().then(async () => {
        try {
          await this.uriSaveBorrowerChildrenInfo({ ...this.commonBizApply, ...this.childInfo })
          this.showchildInfoFrame = false
        } catch (e) {
          this.$toast(e)
        }
      })
    },
    // 根据证件号码计算是否未成年
    calcIsMinor() {
      const idCard = this.childInfo.identificationNo
      if (!idCard || idCard.length !== 18) {
        return
      }
      const birthYear = parseInt(idCard.substr(6, 4))
      const birthMonth = parseInt(idCard.substr(10, 2)) - 1
      const birthDay = parseInt(idCard.substr(12, 2))
      const birthDate = new Date(birthYear, birthMonth, birthDay)
      const now = new Date()
      let age = now.getFullYear() - birthDate.getFullYear()
      const m = now.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--
      }
      this.$set(this.childInfo, 'isMinor', age < 18 ? '1' : '0')
      this.$set(this.childInfo, 'isMinorDesc', age < 18 ? '是' : '否')
    },
  }
}
</script>
<style scoped lang="less">
.moment_text {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  margin: 16px 16px 12px;
  padding-left: 10px;
  border-left: 4px solid #1677ff;
  line-height: 22px;
  align-items: center;
}

.add {
  background-color: #1677ff;
  padding: 2px 10px;
  font-size: 14px;
  color: #fff;
  border-radius: 8px;
  margin-left: auto;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin: 16px;
  padding-left: 10px;
  border-left: 4px solid #1677ff;
  line-height: 22px;
}

// 头像样式
.child-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &.avatar-son {
    background-color: #e6f7ff;
    color: #1677ff;
  }
  &.avatar-daughter {
    background-color: #fff0f6;
    color: #f759ab;
  }
}

// 卡片内容信息
.card-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  &__text {
    flex: 1;
  }
  &__name {
    font-size: 15px;
    font-weight: 500;
    color: #323233;
  }
  &__id {
    font-size: 13px;
    color: #969799;
    margin-top: 4px;
  }
}

// 保存按钮
.save-btn {
  margin: 16px;
  width: calc(100% - 32px);
  background-color: #1677ff !important;
  color: #fff !important;
  border-radius: 8px;
  border: none !important;
}

/deep/ .van-card {
  background-color: #fff;
  margin: 0 16px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 12px;
}

/deep/ .van-card__thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

/deep/ .van-card__content {
  justify-content: center;
  font-size: 15px;
  line-height: 1.5;
}

/deep/ .van-card__footer {
  padding-top: 8px;
  border-top: 1px solid #f5f5f5;
  margin-top: 4px;
}

/deep/ .van-empty {
  margin: 0 16px;
  border-radius: 8px;
}
</style>
