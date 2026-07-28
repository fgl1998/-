<template>
  <view class="card-subscribe-message">
    <ComponentButton
      @click="onClickMessageSubscription"
      width="112rpx"
      height="48rpx"
      fontSize="24rpx"
      type="secondary"
      circle
      name="立即订阅">
    </ComponentButton>
  </view>
</template>

<script>
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'

  import { showModal, requestSubscribeMessage, getSetting, openSetting } from '@/utils/uni-api'
  import { requestB254, requestB255 } from '@/service/api'

  export default {
    name: 'ComponentProjectCardSubscribeMessage',
    props: {},
    components: {
      ComponentButton
    },
    data() {
      return {
        tmplIdsRes: [],
        tmplIds: []
      }
    },
    created() {},
    mounted() {},
    methods: {
      /**
       * 保存/更新消息订阅状态
       */
      saveSubscribeMessageStatus(itemSetting) {
        const data = this.tmplIdsRes
        const len = data.length
        const tmplIds = this.tmplIds
        let che500List = []
        // 清空数据授权
        if (!itemSetting) {
          data.forEach((item) => {
            che500List.push({
              che500: item.che500,
              subscribe: '0' // 0 拒绝订阅 1 订阅
            })
          })
        } else {
          for (let key in itemSetting) {
            for (let i = 0; i < len; i++) {
              const item = data[i]
              if (key === item.che507) {
                che500List.push({
                  che500: item.che500,
                  subscribe: itemSetting[key] === 'reject' ? '0' : '1' // 0 拒绝订阅 1 订阅
                })
                break
              }
            }
          }
        }
        requestB255(che500List, false, false)
          .then((res) => {})
          .catch((err) => {})
      },
      // 处理用户打开设置操作
      hanldeOpenSetting(data = null) {
        let msgTip = ''
        openSetting().then((res) => {
          const { itemSettings, mainSwitch } = res.subscriptionsSetting
          // 开启/关闭具体某个或一些模版消息操作
          if (data) {
            if (itemSettings && itemSettings[data.che507] !== 'reject') {
              msgTip = `订阅消息“${data.che502}”订阅成功！`
            } else {
              msgTip = `订阅消息“${data.che502}”订阅失败！`
            }
          } else {
            // 开启/关闭订阅消息接收通知总开关
            if (mainSwitch) {
              msgTip = '订阅消息接收通知开启成功！'
            } else {
              msgTip = '订阅消息接收通知开启失败！'
            }
          }

          showModal(msgTip)
          this.saveSubscribeMessageStatus(itemSettings || null)

          console.log('======openSettings==', res)
        })
      },
      /**
       * 消息订阅
       */
      async onClickMessageSubscription() {
        let tmplIdsRes = []
        const tmplIds = []
        let settings = {}

        try {
          tmplIdsRes = await requestB254(true, false)
        } catch (err) {
          // 测试数据
          tmplIdsRes = [
            {
              che507: 'irVx4Uzp8mzYrZO5mqjkVXmWeYLvAWy1Um_4ryB-saU',
              che502: '待办事项提醒',
              che500: '1'
            },
            {
              che507: 'bfLEtF9hYdYH0EBZr3B-JvD0VhfJriP9ofim6u-VByk',
              che502: '业务办理进度提醒',
              che500: '2'
            }
          ]
        }
        this.tmplIdsRes = [...tmplIdsRes]

        tmplIdsRes.forEach((item) => {
          if (item.che507) {
            tmplIds.push(item.che507)
          }
        })
        this.tmplIds = [...tmplIds]

        if (!tmplIds.length) {
          showModal('未查询到相关模版数据！')
          return
        }

        try {
          settings = await getSetting()
        } catch (err) {
          //
        }

        console.log(settings, '========settings======')
        const { subscriptionsSetting } = settings
        if (subscriptionsSetting) {
          const { mainSwitch, itemSettings } = subscriptionsSetting
          // 用户关闭订阅消息接收
          if (!mainSwitch) {
            showModal('系统检测到您已关闭订阅消息接收，是否立即前往设置开启？', '提示', true).then(() => {
              this.hanldeOpenSetting()
            })
            return
          } else {
            // 存在订阅记录
            if (itemSettings) {
              // 排查用户是否已经关闭消息接收
              // 标记用户是否接收所有模版消息
              let isAllAccept = true
              for (let i = 0; i < tmplIdsRes.length; i++) {
                const item = tmplIdsRes[i]
                if (itemSettings[item.che507] === 'reject') {
                  isAllAccept = false
                  showModal(
                    `系统检测到您已拒绝接收订阅消息“${item.che502}”，是否立即前往设置在订阅消息中开启？`,
                    '提示',
                    true
                  ).then(() => {
                    this.hanldeOpenSetting(item)
                  })
                  break
                }
              }
              if (!isAllAccept) {
                return
              }
            }
          }
        }

        requestSubscribeMessage(tmplIds)
          .then((res) => {
            const itemSetting = {}
            let isAllAccept = true
            for (let key in res) {
              if (tmplIds.includes(key)) {
                const value = res[key]
                if (value === 'reject') {
                  isAllAccept = false
                }
                itemSetting[key] = value
              }
            }

            this.saveSubscribeMessageStatus(itemSetting)
            if (isAllAccept) {
              showModal('订阅成功！')
            }

            console.log(res, itemSetting, '======requestSubscribeMessage')
          })
          .catch((err) => {
            const { errCode } = err
            let errMsg = '订阅失败！'
            if (errCode === 20001) {
              errMsg = '后台未配置相关模板数据，订阅失败！'
            }
            showModal(errMsg)
          })
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped>
  $height: 112rpx;
  .card-subscribe-message {
    width: 100%;
  }
</style>
