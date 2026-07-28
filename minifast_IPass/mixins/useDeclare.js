import config from '@/config'
import { navigateTo, showModal } from '@/utils/uni-api'
import { requestB017, requestSPJudgeFaceRecognition, requestSPCheckExamine } from '@/service/api'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getDeclareConfig } from '@/utils/get'
import {
  USER_INFO,
  USER_LIST,
  DECLARE_INFO,
  UPDATE_DECLARE_INFO,
  OCR_INFO,
  UPDATE_REFRESH_FILE
} from '@/store/constants' // 常量
import { mapGetters } from 'vuex'

/**
 * 申报页面共用方法
 */
const useDeclare = {
  data() {
    return {
      chi031: '', // 申报项目编码
      chi031_desc: '', // 申报项目中文
      declareType: '', // 申报类型 01 自主申报 02 代为申报 不能设值 会影响申报判断
      fixedDeclareType: '', // 固定申报模式 01 自主申报 02 代为申报 不能设值 会影响申报判断

      basicInfo: {}, // 申报基本信息
      agentInfo: {}, // 代办人信息
      // 申报信息
      projectDeclareInfo: {
        cac102: '', // 人员类别
        chb015: '',
        chb017: '',
        chb018: ''
      },
      personnelInfo: {}, // 人员类别 已选择的
      personnelList: [], // 人员类别 数组
      personnelList_old: [], // 人员类别原始数据
      codeMap: {}, // 码表存放
      isFileAndRegister: false, // 申报人是否为建档立卡用户
      // 申报配置
      declareConfig: {
        isCheckDisability: false, // 是否校验残疾人
        isCheckFileAndRegister: false // 是否校验建档立卡用户
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 处理 onLoad
    handleOnLoad(e) {
      const { declareType, fixedDeclareType, chi031, chi031_desc } = e
      if (chi031) {
        this.chi031 = chi031
        this.getPersonnelList(chi031)
      }
      if (chi031_desc) {
        this.chi031_desc = chi031_desc
      }
      // 固定一种申报模式
      if (fixedDeclareType) {
        this.fixedDeclareType = fixedDeclareType
      }
      // 多选申报模式
      if (declareType) {
        this.declareType = declareType
      }
      const declareConfig = getDeclareConfig(chi031)
      this.declareConfig = {
        ...declareConfig
      }
      this.getCodeTableCacheData && this.getCodeTableCacheData()
    },
    // 捕获申报类型改变 不用修改
    handleChangeDeclareType(declareType) {
      this.declareType = declareType
    },
    // 捕获申报基本信息改变 不用修改
    handleChangeBasicInfo(e) {
      this.basicInfo = {
        ...e
      }
    },
    // 捕获码表改变 不用修改
    handleChangeCodeMap(e) {
      this.codeMap = {
        ...this.codeMap,
        ...e
      }
    },
    // 捕获代办信息 不用修改
    handleChangeAgentInfo(e) {
      this.agentInfo = {
        ...e
      }
    },
    // 捕获通过申报人姓名获取到的信息 不用修改
    handleChangeDataByUserName(data) {
      this.getDataByUserName(data)
    },
    // 捕获通过申报人身份证获取到的信息 不用修改
    handleChangeDataByIdCard(data) {
      this.seDataByIdCard(data)
    },
    // 获取 人员类别  不用修改
    getPersonnelList(chi031) {
      const aka131 = this.aka131
      requestB017(chi031).then((res) => {
        const { lists } = res
        if (lists) {
          // 人员类别数据
          const { list } = lists.ac10List
          const len = list.length
          let newList = []
          if (list && len > 0) {
            if (len === 1) {
              for (let i = 0; i < len; i++) {
                const item = list[i]
                if (i === 0) {
                  item.checked = true
                  this.personnelInfo = {
                    ...item
                  }
                }
                newList.push(item)
              }
            } else {
              for (let i = 0; i < len; i++) {
                const item = list[i]
                item.checked = false
                if (item.cac102 === aka131) {
                  item.checked = true
                  this.personnelInfo = {
                    ...item
                  }
                } else {
                  if (this.selectFirst) {
                    if (i === 0) {
                      item.checked = true
                      this.personnelInfo = {
                        ...item
                      }
                    }
                  }
                }
                newList.push(item)
              }
            }

            console.log('newList', newList)

            // // 内江教育局相关项目 20013 20014 20015 20016 20017 20018 20019 20020 20080 20374 20375 20376
            // const chi031List = ['20013', '20014' ,'20015', '20016', '20017', '20018', '20019', '20020', '20080', '20374', '20375', '20376']
            // //内江修改人员类别 暂时固定为3490
            // if(config.areaCode === '511000' && chi031List.includes(chi031)){
            //   const resultList = newList.filter(item=> item.cac102 === '3490')

            //   //默认选中
            //   resultList[0].checked = true
            //   this.personnelInfo = {
            //     ...resultList[0],
            //   }

            //   this.personnelList = [...resultList]
            //   this.personnelList_old = [...resultList]
            // }else{
            this.personnelList = [...newList]
            this.personnelList_old = [...newList]
            //}
          }
          if (this.userInfo.idCard == '511002198812031225') {
            for (let i = 0; i < newList.length; i++) {
              const item = newList[i]
              if (item.cac102 === '147') {
                item.checked = true
                this.personnelInfo = {
                  ...item
                }
              }
            }
          }

          //内江杜盼
          // if (this.userInfo.idCard == '511526199912254218' || this.userInfo.idCard == '511325199604210056' || this.userInfo.idCard == '510124199111053218') {
          //   for (let i = 0; i < newList.length; i++) {
          //     const item = newList[i]
          //     if (item.cac102 === '102') {
          //       item.checked = true
          //       this.personnelInfo = {
          //         ...item,
          //       }
          //     }
          //   }
          // }
        }
      })
    },
    // 达州检测申报人是否需要人脸认证 暂未使用
    requestJudgeFaceRecognition(aac002, aac003) {
      return new Promise((resolve, reject) => {
        requestSPJudgeFaceRecognition(aac002, aac003, false)
          .then((res) => {
            const { recognition } = res
            if (recognition === '1') {
              resolve(recognition)
            } else {
              reject(err)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 达州检测申报人是否在放行申请中 暂未使用
    requestCheckExamine(aac002, aac003, chi031) {
      return new Promise((resolve, reject) => {
        requestSPCheckExamine(aac002, aac003, chi031, false)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取 picker 选择组件 的中文值
    getPickerValueDesc(id, val_desc, val) {
      this.projectDeclareInfo = {
        ...this.projectDeclareInfo,
        [id + '_desc']: val_desc
      }
    },
    // 人员类别改变 不用修改
    handleChangePersonnelInfo(val) {
      const isMultipleChoicesPersonnel = this.isMultipleChoicesPersonnel
      const personnelList = [...this.personnelList]

      if (isMultipleChoicesPersonnel) {
        const arr = []
        personnelList.forEach((item) => {
          item.checked = false
          if (val.includes(item.cac102)) {
            item.checked = true
            arr.push(item)
          }
        })
        this.personnelInfo = [...arr]
      } else {
        personnelList.forEach((item) => {
          item.checked = false
          if (item.cac102 === val) {
            item.checked = true
            this.personnelInfo = {
              ...item
            }
          }
        })
      }

      this.personnelList = [...personnelList]
    },
    // 此处只验证组件内的申报数据是否填报正确
    handleCheckComponentInput() {
      // 未校验社保卡信息
      const currentDeclareType = this.declareType || this.fixedDeclareType
      const personnelInfo = this.personnelInfo
      const labelPrefix = this.labelPrefix
      const {
        idCard: idCard_r,
        userName: userName_r,
        tel: tel_r,
        nation: nation_r,
        nature: nature_r,
        education: education_r,
        nativePlace: nativePlace_r,
        permanentAddress: permanentAddress_r,
        currentAddress: currentAddress_r,
        SSCNumber: SSCNumber_r
      } = this.renderObj

      const {
        idCard,
        userName,
        tel,
        nation,
        nature, // 户口性质
        education,
        nativePlace,
        permanentAddress,
        currentAddress,
        district,
        township,
        village
      } = this.basicInfo

      const { idCard: idCard_a, tel: tel_a } = this.agentInfo

      const permanentAddressPlaceholder = this.permanentAddressPlaceholder
      const currentAddressPlaceholder = this.currentAddressPlaceholder
      const isMultipleChoicesPersonnel = this.isMultipleChoicesPersonnel

      let msgTip = '申报人'
      if (labelPrefix) {
        msgTip = labelPrefix
      }
      // 校验代办人信息
      if (currentDeclareType === '02') {
        if (!idCard_a) {
          showModal('系统出了点小问题，无法获取到代办人身份信息，请稍后重试！')
          return false
        }
        // console.log('this.agentInfo=======', this.agentInfo, tel_a)
        if (!tel_a) {
          showModal('请输入代办人联系电话')
          return false
        } else {
          const checkResult = checkPhoneNumber(tel_a, '代办人联系电话')
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
      }
      if (idCard_r) {
        console.log(this, this.basicInfo, 'this.basicInfo==')
        if (!idCard) {
          console.log(this, this.basicInfo, 'this.basicInfo==')
          showModal(`请输入${msgTip}身份证号`)
          return false
        } else {
          const checkResult = checkIDCard(idCard, `${msgTip}身份证号`)
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
      }
      if (userName_r) {
        if (!userName) {
          showModal(`请输入${msgTip}姓名`)
          return false
        }
      }
      if (tel_r) {
        if (!tel) {
          showModal(`请输入${msgTip}联系电话`)
          return false
        } else {
          const checkResult = checkPhoneNumber(tel, `${msgTip}联系电话`)
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
      }

      // 校验申报人 民族
      if (nation_r && !nation) {
        showModal('请选择民族')
        return false
      }
      // 校验申报人 户口性质
      if (nature_r && !nature) {
        showModal('请选择户口性质')
        return false
      }
      // 校验申报人 学历
      if (education_r && !education) {
        showModal('请选择学历')
        return false
      }
      // 校验申报人 籍贯
      if (nativePlace_r && !nativePlace) {
        showModal('请选择籍贯')
        return false
      }
      // 校验申报人 户籍地址
      if (permanentAddress_r) {
        if (!permanentAddress || permanentAddress === '请选择地址') {
          if (permanentAddressPlaceholder) {
            showModal(permanentAddressPlaceholder)
          } else {
            showModal(`请选择${msgTip}户籍地址`)
          }
          return false
        }
      }
      // 校验申报人 居住地址
      if (currentAddress_r && !currentAddress) {
        if (currentAddressPlaceholder) {
          showModal(currentAddressPlaceholder)
        } else {
          showModal(`请选择现居住地址`)
        }
        return false
      }
      // 校验申报人 人员类别
      if (isMultipleChoicesPersonnel) {
        if (personnelInfo.length == 0) {
          showModal('请选择人员类别')
          return false
        }
      } else {
        if (!personnelInfo.cac102) {
          showModal('请选择人员类别')
          return false
        }
      }

      return true
    },
    // 用于选择人脸认证和材料认证
    isShowType() {
      return new Promise((resolve, reject) => {
        let that = this
        uni.showModal({
          title: '提示',
          content: '是否使用人脸认证',
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#576B95',
          success: (res) => {
            console.log(res)
            if (res.confirm) {
              resolve(true)
            } else if (res.cancel) {
              resolve(false)
            }
          },
          fail: (res) => {
            reject(res)
          }
        })
      })
    },
    // 处理申报数据 addressInfo 为学校申报添加
    async handleDeclareData(
      hb00BizMap, // 扩展字段
      isRefreshFile = '1', // 是否更新材料上传
      hp02List = null, // 个人就业信息
      hp03List = null, // 家庭成员信息
      addressInfo = null, // 地址信息
      hp15List = null // 禽畜捕杀信息
    ) {
      let cac102 = '' // 人员类别
      let cac102_arr = [] // 人员类别
      const { areaCode } = config
      const chi031 = this.chi031
      const chi031_desc = this.chi031_desc
      const personnelInfo = this.personnelInfo
      const isMultipleChoicesPersonnel = this.isMultipleChoicesPersonnel
      const currentDeclareType = this.declareType || this.fixedDeclareType
      const userList = this.userList // 经办人信息

      const {
        idCard, // 身份证号
        userName, // 姓名
        tel, // 电话号码
        district, // 区县编码
        township, // 乡镇编码
        village, // 村编码
        group, // 组编码
        permanentAddress, // 户籍地址
        nation, // 民族
        gender // 性别
      } = this.basicInfo

      const {
        idCard: idCard_a, // 身份证号
        userName: userName_a, // 姓名
        tel: tel_a // 电话号码
      } = this.agentInfo

      // 是否多选人员类别
      if (isMultipleChoicesPersonnel) {
        personnelInfo.forEach((item, index) => {
          if (index === 0) {
            cac102 = item.cac102
          }
          cac102_arr.push(item.cac102)
        })
      } else {
        cac102 = this.personnelInfo.cac102
      }
      let data = {
        aab301: areaCode, // 市州行政区划代码
        aac002: idCard, // 申报人身份证号
        aac003: userName, // 申报人姓名
        aac004: gender || '0', // 性别
        aae005: tel, // 联系手机（到账信息提醒）
        aae006: permanentAddress, // 申报人联系地址
        aac005: nation, // 民族
        aka131: cac102, // 人员类别
        cac102_arr, // 人员类别
        chb00c: '1', // 补贴对象类型 1 个人 2 家庭 3 单位
        chb00q: '暂无', // 申报备注
        chb00r: '01', // 生存认证类型 01 人脸认证 02 报纸认证
        chb00w: '', // 代办人联系电话
        chb00y: '', // 代办人姓名
        chb00z: '', // 代办人身份证号码
        chb004: '04', // 申报渠道 01 线下受理 02 网厅申报 03 微信申报 04 支付报申报
        // #ifdef MP-WEIXIN
        chb004: '03',
        // #endif
        chb006: '0', // 生存认证状态 0 认证失败 1 认证成功
        chb009: currentDeclareType, // 补贴项申报模式 01 个人申报 02 他人申报 03 街道申报
        chb015: district, // 申报人所属区县编码
        chb017: township, // 申报人所属乡镇编码
        chb018: village, // 申报人所属村编码
        chb019: group || '', // 申报人所属组编码
        chi031, // 补贴项目编码
        chi031_desc, // 补贴项目名称
        hb00Bizmap: JSON.stringify(hb00BizMap), // 项目扩展字段
        hi21List: '', // 文件列表
        userList: JSON.stringify([userList]) // 经办人信息
      }

      // 个人就业信息
      if (hp02List) {
        data = {
          ...data,
          hp02List: JSON.stringify(hp02List)
        }
      }
      // 家庭成员信息
      if (hp03List) {
        data = {
          ...data,
          hp03List: JSON.stringify(hp03List)
        }
      }

      // 禽畜捕杀信息
      if (hp15List) {
        data = {
          ...data,
          hp15List: JSON.stringify(hp15List)
        }
      }

      // 代为申报
      if (currentDeclareType === '02') {
        data = {
          ...data,
          chb00z: idCard_a,
          chb00y: userName_a,
          chb00w: tel_a
        }
      }
      // 存在没有户籍地址的情况 如学校申报
      if (addressInfo) {
        data = {
          ...data,
          chb015: addressInfo.chb015,
          chb017: addressInfo.chb017,
          chb018: addressInfo.chb018,
          chb019: addressInfo.chb019
        }
      }

      if (isRefreshFile === '1') {
        isRefreshFile = true
      } else {
        isRefreshFile = false
      }
      // isRefreshFile 在材料上传时 是否在进入页面时清空已上传材料 0 不清空 1 清空
      this.$store.commit(UPDATE_REFRESH_FILE, isRefreshFile)
      this.$store.commit(UPDATE_DECLARE_INFO, {
        ...data
      })

      /* ======================== 是否跳过生存认证 ========================== */
      const declareConfig = getDeclareConfig(chi031)
      let { closeAuth, chooseAuth } = declareConfig

      // 配置选择人员验证方式
      if (chooseAuth) {
        let checkType = await this.isShowType()

        if (!checkType) {
          // 配置了选择验证方式
          if (!closeAuth) {
            closeAuth = []
          }
          closeAuth.push(chooseAuth)
          cac102 = chooseAuth
          cac102_arr.push(chooseAuth)
          data = {
            ...data,
            cac102,
            cac102_arr
          }
        }
      }

      // 未开启跳过配置
      if (!closeAuth) {
        navigateTo('survival-certification', 'packageDeclare')
        return
      }
      // 所有人员类别跳过人脸识别
      if (closeAuth.length == 0) {
        this.$store.commit(UPDATE_DECLARE_INFO, {
          ...data,
          chb006: '1'
        })
        navigateTo('file', 'packageDeclare')
        return
      }
      // 配置的人员类别跳过人脸识别
      if (closeAuth.length > 0) {
        if (closeAuth.includes(cac102)) {
          this.$store.commit(UPDATE_DECLARE_INFO, {
            ...data,
            chb006: '1'
          })
          navigateTo('file', 'packageDeclare')
          return
        } else {
          navigateTo('survival-certification', 'packageDeclare')
          return
        }
      }
    }
  },
  computed: {
    ...mapGetters([DECLARE_INFO, USER_INFO, USER_LIST, OCR_INFO])
  },
  watch: {}
}
export { useDeclare }
