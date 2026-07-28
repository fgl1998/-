import {
  requestFFGetPersonalInfo,
  requestB043,
  requestB117,
  requestB135,
  requestSPGetHo08,
  requestWXGetMyFamilyInfo,
  requestWXGetMyFamilyUser
} from '@/service/api'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showLoading, navigateTo, showModal, hideLoading, showToast, navigateBack, redirectTo } from '@/utils/uni-api'
import config from '@/config'
import store from '@/store'
import { M_UPDATE_USER_INFO, M_UPDATE_USER_LIST } from '@/store/constants'

const { isOpenYGFF, areaCode, isForceBindingAddress, isShowShutDownTips } = config

/**
 * 绑定户籍地址提示
 */
const bindAddressTip = (type) => {
  showModal('系统检测到您还未绑定户籍地址，立即前往绑定？').then(() => {
    let pathName = 'user-info'
    // 乐山特殊处理
    if (areaCode === '511100') {
      pathName = 'user-info-ls'
    }
    if (type === 'login') {
      redirectTo(pathName, 'packageCommon')
    } else {
      navigateTo(pathName, 'packageCommon')
    }
  })
}

/**
 * 根据用户姓名和身份证号获取用户其他信息
 * @param {object} user_info 用户信息
 * @param {object} type 类型 app 默认调用 login 登录时调用
 */
const useGetUserInfo = async (user_info, type = 'app') => {
  const { userName, idCard, token } = user_info
  if (!userName || !idCard) {
    return
  }

  if (token) {
    store.commit(M_UPDATE_USER_INFO, {
      token
    })
    store.commit(M_UPDATE_USER_LIST, {
      cpb10d: idCard, // 经办用户身份证号码
      aae012: userName, // 经办用户姓名
      aae018: userName // 经办部门名称
    })
  }

  showLoading()

  /**
   * 用户信息
   */
  let userInfo = {
    ...user_info,
    // 是否为建党立卡贫困户 false 否 true 是
    isRegisteredPoor: '',
    // 家庭信息
    familyInfo: {
      // 家庭id
      id: '',
      name: '',
      createTime: '',
      idCard: '',
      // 家庭成员列表
      members: [
        // {
        //   // 家庭成员姓名
        //   userName: '',
        //   // 家庭成员身份证号
        //   idCard: '',
        // },
      ]
    },

    // 有效的社保卡信息
    aab034: '', // 社保卡归属地行政区划编码
    aac203: '', // 社保卡银行卡号
    aaf002: '', // 社保卡银行类别码值
    aaf002Desc: '', // 社保卡银行类别码值中文
    aaz500: '', // 社保卡卡号
    aaz502: '', // 社保卡状态
    aaz502Desc: '', // 社保卡状态中文
    aaz702: '', // 社保卡其他状态 可代扣代发
    SSCInfo: {
      aab034: '', // 社保卡归属地行政区划编码
      aac203: '', // 社保卡银行卡号
      aaf002: '', // 社保卡银行类别码值
      aaf002Desc: '', // 社保卡银行类别码值中文
      aaz500: '', // 社保卡卡号
      aaz502: '', // 社保卡状态
      aaz502Desc: '', // 社保卡状态中文
      aaz702: '' // 社保卡其他状态 可代扣代发
    },
    // 残疾信息
    disabilityInfo: {},
    // 地址信息
    aac021: '',
    aac021Arr: null,
    chb015: '',
    chb017: '',
    chb018: '',
    // 审批系统个人地址信息
    addressInfoFromSP: {
      aac021: '',
      aac021Arr: null,
      chb015: '',
      chb017: '',
      chb018: ''
    },
    // 发放系统个人地址信息
    addressInfoFromFF: {
      aac021: '',
      aac021Arr: null,
      chb015: '',
      chb017: '',
      chb018: ''
    }
  }

  /**
   * 请求列表
   */
  const requestList = [
    // 获取社保卡信息
    requestB043(idCard, userName, false, false),
    // 获取码表-社保卡状态
    getCodeListByCodeName('aaz502'),
    // 获取码表-银行类别
    getCodeListByCodeName('aae008'),
    // 获取残疾信息
    requestSPGetHo08(idCard, false, false),
    // 家庭成员信息
    requestWXGetMyFamilyInfo(idCard, false, false),
    // 建档立卡信息
    requestB135(idCard, userName, false, false)
  ]

  if (isOpenYGFF) {
    // 获取发放系统个人相关的村庄信息
    requestList.push(requestFFGetPersonalInfo(idCard, false, false))
  } else {
    // 获取审批系统个人相关的村庄信息
    requestList.push(requestB117(idCard, false, false))
  }

  const data = await Promise.allSettled(requestList)

  const res0 = data[0]
  const res1 = data[1]
  const res2 = data[2]
  const res3 = data[3]
  const res4 = data[4]
  const res5 = data[5]
  const res6 = data[6]

  // 社保卡信息
  if (res0) {
    const { status, value } = res0
    if (status === 'fulfilled') {
      const { aaf002, aaz502, aab034, aac203, aaz500, aaz702 } = value

      let aaf002Desc = ''
      let aaz502Desc = ''

      // 获取社保卡状态中文
      if (res1 && res1.status === 'fulfilled' && res1.value) {
        for (let i = 0, len = res1.value.length; i < len; i++) {
          const item = res1.value[i]
          if (aaz502 === item.aaa102) {
            aaz502Desc = item.aaa103
            break
          }
        }
      }

      // 获取社保卡银行类别中文
      if (res2 && res2.status === 'fulfilled' && res2.value) {
        for (let i = 0, len = res2.value.length; i < len; i++) {
          const item = res2.value[i]
          if (aaf002 === item.aaa102) {
            aaf002Desc = item.aaa103
            break
          }
        }
      }

      userInfo.SSCInfo = {
        ...value,
        aaf002Desc,
        aaz502Desc
      }
      // 兼容之前的写法
      userInfo.aab034 = aab034
      userInfo.aac203 = aac203
      userInfo.aaf002 = aaf002
      userInfo.aaz500 = aaz500
      userInfo.aaz702 = aaz702
      userInfo.aaf002Desc = aaf002Desc
      userInfo.aaz502 = aaz502
      userInfo.aaz502Desc = aaz502Desc
    } else {
      console.error(JSON.stringify(value))
    }
  }

  // 残疾信息
  if (res3) {
    const { status, value } = res3
    if (status === 'fulfilled') {
      userInfo = { ...userInfo, ...value, disabilityInfo: value }
    } else {
      console.error(JSON.stringify(value))
    }
  }

  // 家庭信息
  if (res4) {
    const { status, value } = res4
    if (status === 'fulfilled') {
      const { FAMILYID, FAMILYNAME, CREATETIME, IDCARD } = value.data

      userInfo.familyInfo.id = FAMILYID
      userInfo.familyInfo.name = FAMILYNAME
      userInfo.familyInfo.createTime = CREATETIME
      userInfo.familyInfo.idCard = IDCARD

      try {
        const members = await requestWXGetMyFamilyUser(FAMILYID, false, false)
        const { code, data } = members
        if (code === '200' && data) {
          const newList = []
          data.forEach((item) => {
            const { userName, idCard, joinTime, id } = item
            newList.push({
              userName,
              idCard,
              joinTime,
              id
            })
          })
          userInfo.familyInfo.members = newList
        }
      } catch (err) {
        console.error(JSON.stringify(err))
      }
    } else {
      console.error(JSON.stringify(value))
    }
  }

  // 建档立卡信息
  if (res5) {
    const { status, value } = res5
    if (status === 'fulfilled') {
      const { isHo07Message } = value
      userInfo.isRegisteredPoor = isHo07Message === '1'
    } else {
      console.error(JSON.stringify(value))
    }
  }

  // 审批/发放系统个人相关的村庄信息
  if (res6) {
    const { status, value } = res6
    if (status === 'fulfilled') {
      const { aac021, chb015, chb017, chb018, chb019 } = value
      const aac021Arr = aac021 ? aac021.split('-') : []
      const addressInfo = {
        aac021,
        aac021Arr,
        chb015,
        chb017,
        chb018,
        chb019
      }
      if (isOpenYGFF) {
        userInfo = {
          ...userInfo,
          ...addressInfo,
          addressInfoFromFF: addressInfo
        }
      } else {
        userInfo = {
          ...userInfo,
          ...addressInfo,
          addressInfoFromSP: addressInfo
        }
      }
    } else {
      userInfo = {
        ...userInfo,
        aac021: '',
        aac021Arr: [],
        chb015: '',
        chb017: '',
        chb018: '',
        chb019: ''
      }
      // console.error(JSON.stringify(value))
    }
  }

  store.commit(M_UPDATE_USER_INFO, {
    ...userInfo
  })

  store.commit(M_UPDATE_USER_LIST, {
    cpb10d: idCard, // 经办用户身份证号码
    aae012: userName, // 经办用户姓名
    // chb015: userInfo.chb015 || '9999', // 区县编码
    // chb017: userInfo.chb017 || '9999', // 乡镇编码
    // chb018: userInfo.chb018 || '9999', // 村编码
    aae018: userName // 经办部门名称
  })

  hideLoading()

  // 检测用户是否需要绑定户籍地址
  if (type === 'login') {
    showToast('登录成功', 'success').then(() => {
      setTimeout(() => {
        if (!userInfo.aac021) {
          // 系统中开启的强制用户绑定 且 系统未开启停机公告
          if (isForceBindingAddress && !isShowShutDownTips) {
            bindAddressTip(type)
          } else {
            navigateBack(1)
          }
        } else {
          navigateBack(1)
        }
      }, 1500)
    })
  } else {
    if (!userInfo.aac021) {
      // 系统中开启的强制用户绑定 且 系统未开启停机公告
      if (isForceBindingAddress && !isShowShutDownTips) {
        bindAddressTip(type)
      } else {
        navigateBack(1)
      }
    }
  }
}

export { useGetUserInfo }
