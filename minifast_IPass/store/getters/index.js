import {
  USER_INFO,
  USER_LIST,
  DECLARE_INFO,
  OCR_INFO,
  REFRESH_FILE,
  FAMILY_MEMBERS,
  OTHERS_DECLARE_INFO,
  EDIT_SUBSIDY_INFO,
  SHOP_INFO,
  GOOD_INFO,
  IS_MERCHANT,
  SUBSIDY_PROJECT_AUDIT_CHANNEL,
  USER_BEHAVIOR_DATA,
} from '../constants'

const getters = {
  // 获取用户信息
  [USER_INFO](state) {
    return state.userInfo
  },
  // 获取经办人信息
  [USER_LIST](state) {
    return state.userList
  },
  // 获取申报信息
  [DECLARE_INFO](state) {
    return state.declareInfo
  },
  // 获取其他申报信息
  [OTHERS_DECLARE_INFO](state) {
    return state.othersDeclareInfo
  },
  // 获取正在修改的补贴项目信息
  [EDIT_SUBSIDY_INFO](state) {
    return state.editSubsidyInfo
  },
  // 获取ocr识别信息
  [OCR_INFO](state) {
    return state.ocrInfo
  },
  // 获取
  [REFRESH_FILE](state) {
    return state.refreshFile
  },
  // 获取家庭成员信息
  [FAMILY_MEMBERS](state) {
    return state.familyMembers
  },
  // 获取店铺信息
  [SHOP_INFO](state) {
    return state.shopInfo
  },
  // 获取商品信息
  [GOOD_INFO](state) {
    return state.goodInfo
  },
  // 获取用户是否是商户
  [IS_MERCHANT](state) {
    return state.isMerchant
  },
  // 补贴项目审核渠道
  [SUBSIDY_PROJECT_AUDIT_CHANNEL](state) {
    return state.subsidyProjectAuditChannel
  },
  // 用户行为数据
  [USER_BEHAVIOR_DATA](state) {
    return state.userBehaviorData
  },
}

export default getters
