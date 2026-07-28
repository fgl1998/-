import {
  M_UPDATE_USER_INFO,
  M_UPDATE_USER_INFO_CLEAR,
  M_UPDATE_USER_LIST,
  UPDATE_DECLARE_INFO,
  UPDATE_OCR_INFO,
  UPDATE_REFRESH_FILE,
  UPDATE_FAMILY_MEMBERS,
  UPDATE_OTHERS_DECLARE_INFO,
  UPDATE_EDIT_SUBSIDY_INFO,
  UPDATE_SHOP_INFO,
  UPDATE_GOOD_INFO,
  UPDATE_IS_MERCHANT,
  M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL,
  M_UPDATE_USER_BEHAVIOR_DATA,
} from '../constants'

const mutations = {
  // 更新用户信息
  [M_UPDATE_USER_INFO](state, data) {
    state.userInfo = { ...state.userInfo, ...data }
  },
  // 清空用户信息 用于退出登录
  [M_UPDATE_USER_INFO_CLEAR](state) {
    state.userInfo = {}
  },
  // 更新经办人信息
  [M_UPDATE_USER_LIST](state, data) {
    state.userList = { ...state.userList, ...data }
  },
  // 更新申报信息
  [UPDATE_DECLARE_INFO](state, data) {
    state.declareInfo = { ...data }
  },
  // 更新其他申报信息
  [UPDATE_OTHERS_DECLARE_INFO](state, data) {
    state.othersDeclareInfo = { ...data }
  },
  // 更新正在编辑的补贴项目信息
  [UPDATE_EDIT_SUBSIDY_INFO](state, data) {
    state.editSubsidyInfo = { ...data }
  },
  // 更新ocr识别信息
  [UPDATE_OCR_INFO](state, data) {
    state.ocrInfo = { ...data }
  },
  // 更新
  [UPDATE_REFRESH_FILE](state, data) {
    state.refreshFile = data
  },
  // 更新家庭成员
  [UPDATE_FAMILY_MEMBERS](state, data) {
    state.familyMembers = [...data]
  },
  // 更新店铺信息
  [UPDATE_SHOP_INFO](state, data) {
    state.shopInfo = {
      ...state.shopInfo,
      ...data,
    }
  },
  // 更新商品信息
  [UPDATE_GOOD_INFO](state, data) {
    state.goodInfo = {
      ...data,
    }
  },
  // 更新用户是否是商户
  [UPDATE_IS_MERCHANT](state, data) {
    state.isMerchant = data
  },
  // 补贴项目审核渠道
  [M_UPDATE_SUBSIDY_PROJECT_AUDIT_CHANNEL](state, data) {
    state.subsidyProjectAuditChannel = data
  },
  // 更新用户行为数据
  [M_UPDATE_USER_BEHAVIOR_DATA](state, data) {
    if (data) {
      state.userBehaviorData = {
        ...state.userBehaviorData,
        ...data,
      }
    } else {
      state.userBehaviorData = {}
    }
  },
}

export default mutations
