<template>
  <div class="my-home-member h5-page">
    <div class="member">
      <div class="name d-f ai-c">
        <div class="key">姓名：</div>
        <div class="value">{{ useTMUserName(memberInfo.userName) }}</div>
      </div>
      <div class="idcard d-f ai-c">
        <div class="key">身份证号：</div>
        <div class="value">{{ useTMIDCard(memberInfo.idCard) }}</div>
      </div>
    </div>

    <div class="button-wrapper" v-if="familyId">
      <button class="btn" v-if="showBtnDeleteFamily" @click="handleDelete('family')">删除家庭</button>
      <button class="btn" v-if="showBtnDeleteMember" @click="handleDelete('user')">删除成员</button>
      <button class="btn" v-if="showBtnOutFamily" @click="handleDelete('out')">退出家庭</button>
    </div>
  </div>
</template>
<script>
import { showModal, navigateBack } from '@/utils/uni-api' // 封装过后的api，推荐使用。方便以后统一修改，便于维护。
import { requestWXDeleteFamily, requestWXDeleteFamilyNumber } from '@/service/api'
import { USER_INFO } from '@/store/constants'
import { mapGetters } from 'vuex'
import { useTMIDCard, useTMUserName } from '@/hooks'
export default {
  name: 'pageMyHomeMember',
  data() {
    return {
      memberInfo: {},
      familyId: '',
      useTMIDCard,
      useTMUserName
    }
  },
  components: {},
  onLoad(e) {
    const { familyId } = e
    this.familyId = familyId
    this.memberInfo = { ...e }
  },
  created() {},
  mounted() {},
  methods: {
    // 删除成员
    deleteUser(idCard, familyId) {
      requestWXDeleteFamilyNumber(idCard, familyId, true).then(() => {
        showModal('删除成功').then(() => {
          navigateBack(1)
        })
      })
    },
    // 删除家庭
    deleteFamily(familyId) {
      requestWXDeleteFamily(familyId, true).then(() => {
        showModal('删除成功').then(() => {
          navigateBack(1)
        })
      })
    },
    // 删除
    handleDelete(type) {
      const { idCard, familyId } = this.memberInfo
      let str = ''
      if (type === 'family') {
        str = '是否确定删除该成员？'
      }
      if (type === 'out') {
        str = '是否确定退出家庭？'
      }
      if (type === 'user') {
        str = '是否确定删除该成员？'
      }
      showModal(str, '提示', true).then((res) => {
        if (type === 'family') {
          this.deleteFamily(familyId)
        } else {
          this.deleteUser(idCard, familyId)
        }
      })
    }
  },
  computed: {
    ...mapGetters([USER_INFO]),
    // 显示删除家庭按钮
    showBtnDeleteFamily() {
      let result = false
      const { idCard } = this.userInfo
      const memberInfo = this.memberInfo
      // 此人为创建家庭者 并且 成员信息为自己
      if (idCard === memberInfo.createIdCard && memberInfo.createIdCard === memberInfo.idCard) {
        result = true
      }
      return result
    },
    // 显示删除家庭成员
    showBtnDeleteMember() {
      let result = false
      const { idCard } = this.userInfo
      const memberInfo = this.memberInfo
      // 此人为创建家庭者 并且 被删除人不是自己
      if (idCard === memberInfo.createIdCard && memberInfo.createIdCard !== memberInfo.idCard) {
        result = true
      }
      return result
    },
    // 显示退出家庭按钮
    showBtnOutFamily() {
      let result = false
      const { idCard } = this.userInfo
      const memberInfo = this.memberInfo
      // 此人不是创建者 自己在自己手机上删除
      if (idCard !== memberInfo.createIdCard && idCard === memberInfo.idCard) {
        result = true
      }
      return result
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
.my-home-member {
  background-color: #f5f5f5;
  padding: $spacing;
  .member {
    background-color: #fff;
    box-shadow: 0px 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.15);
    border-radius: 12rpx;
    padding: 0 40rpx;
    font-size: 30rpx;
    color: $color;
    font-weight: 500;
    line-height: 1.4;
    .value {
      color: rgba($color, 0.8);
    }
    .name {
      height: 142rpx;
      border-bottom: solid 1px $border-color;
    }
    .idcard {
      height: 150rpx;
    }
  }
  .button-wrapper {
    padding-top: 52rpx;
    .btn {
      height: 72rpx;
      background-color: $primary;
      border-radius: 12rpx;
      line-height: 72rpx;
      font-size: 26rpx;
      font-weight: 500;
      color: #fff;
      transition: opacity 0.3s ease-in-out;
      &:active {
        opacity: 0.5;
      }
    }
  }
}
</style>
