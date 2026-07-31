<template>
  <div class="screen-box">
    <div class="screen-title">太原市智慧招聘信息发布大屏</div>
    <div class="screen-content">
      <!-- <button @click="goBaidu">go baidu</button> -->
      <div class="content-top">
        <div class="content-top-left"></div>
        <div class="content-top-right">
          <div class="time-box">
            <div class="time-1">
              {{ realtime.substring(11) }}
            </div>
            <div class="time-2">
              {{ realtime.substring(0, 10) }}
            </div>
          </div>
          <!-- <div class="right-line"></div>
					<div class="weather">
						<div class="weather-1">
							{{ '多云转小雨' }}
						</div>
						<div class="weather-2">
							{{ '03~09℃' }}
						</div>
					</div> -->
        </div>
      </div>
      <div class="big-table">
        <div class="big-table-header">
          <div class="big-table-tr header-cell">
            <div
              class="big-table-td"
              :style="{ minWidth: col.minWidth + 'px' }"
              v-for="(col, index) in tableColumns"
              :key="index"
            >
              {{ col.title }}
            </div>
          </div>
        </div>
        <div class="big-table-body" @mouseover="pauseScroll" @mouseout="scrollFun">
          <div class="big-table-tr row-class" v-for="(item, index) in positionList" :key="index">
            <div
              class="big-table-td"
              :style="{ minWidth: col.minWidth + 'px' }"
              v-for="(col, index) in tableColumns"
              :key="index"
            >
              <span v-if="col.customRender">{{ col.customRender(item) }}</span>
              <span v-else>{{ item[col.field] }}</span>
            </div>
          </div>
          <div v-if="positionList.length === 0" class="table-no-data">
            <svg
              t="1741921253706"
              class="icon2"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3146"
              width="200px"
              height="200px"
            >
              <path
                d="M843.776 577.536L737.28 403.456c-2.048-4.096-6.144-6.144-10.24-6.144H284.672c-4.096 0-8.192 2.048-10.24 6.144l-106.496 174.08v215.04c0 6.144 4.096 10.24 10.24 10.24h657.408c6.144 0 10.24-4.096 10.24-10.24V581.632c-2.048 0-2.048-2.048-2.048-4.096z m-552.96-157.696h430.08l96.256 151.552H579.584c-6.144 0-10.24 4.096-10.24 10.24 0 34.816-28.672 63.488-63.488 63.488-34.816 0-63.488-28.672-63.488-63.488 0-6.144-4.096-10.24-10.24-10.24H194.56l96.256-151.552z m532.48 364.544h-634.88V593.92h233.472c6.144 40.96 40.96 75.776 83.968 75.776 43.008 0 79.872-32.768 83.968-75.776h233.472v190.464zM116.736 684.032v-12.288c0-2.048-2.048-6.144-6.144-6.144-2.048 0-6.144 2.048-6.144 6.144v12.288h-10.24c-2.048 0-6.144 2.048-6.144 6.144s2.048 6.144 6.144 6.144h12.288v12.288c0 2.048 2.048 6.144 6.144 6.144 2.048 0 6.144-2.048 6.144-6.144V696.32h12.288c2.048 0 6.144-2.048 6.144-6.144s-2.048-6.144-6.144-6.144h-14.336zM884.736 450.56h18.432c4.096 0 8.192 4.096 8.192 8.192s-4.096 8.192-8.192 8.192h-18.432v18.432c0 4.096-4.096 8.192-8.192 8.192s-8.192-4.096-8.192-8.192v-18.432h-18.432c-4.096 0-8.192-4.096-8.192-8.192s4.096-8.192 8.192-8.192h18.432v-18.432c0-4.096 4.096-8.192 8.192-8.192s8.192 4.096 8.192 8.192v18.432z m63.488 75.776h10.24c2.048 0 6.144 2.048 6.144 6.144s-2.048 6.144-6.144 6.144h-10.24v10.24c0 2.048-2.048 6.144-6.144 6.144-2.048 0-6.144-2.048-6.144-4.096v-10.24h-10.24c-2.048 0-6.144-2.048-6.144-6.144s2.048-6.144 6.144-6.144h10.24v-12.288c0-2.048 2.048-6.144 6.144-6.144 2.048 0 6.144 2.048 6.144 6.144v10.24zM131.072 436.224v-18.432c0-4.096-4.096-8.192-8.192-8.192s-8.192 4.096-8.192 8.192v16.384h-18.432c-4.096 0-8.192 4.096-8.192 8.192s4.096 8.192 8.192 8.192h16.384v20.48c0 4.096 4.096 8.192 8.192 8.192s8.192-4.096 8.192-8.192v-16.384h16.384c4.096 0 8.192-4.096 8.192-8.192s-4.096-8.192-8.192-8.192c4.096-2.048-14.336-2.048-14.336-2.048z m-77.824 174.08c-18.432 0-34.816-16.384-34.816-34.816 0-18.432 16.384-34.816 34.816-34.816 18.432 0 34.816 16.384 34.816 34.816 0 20.48-16.384 34.816-34.816 34.816z m0-16.384c10.24 0 16.384-8.192 16.384-16.384 0-10.24-8.192-16.384-16.384-16.384-10.24 0-16.384 8.192-16.384 16.384-2.048 8.192 6.144 16.384 16.384 16.384z m933.888-98.304c-8.192 0-16.384-6.144-16.384-16.384 0-8.192 6.144-16.384 16.384-16.384 8.192 0 16.384 6.144 16.384 16.384s-6.144 16.384-16.384 16.384z m0-6.144c4.096 0 8.192-4.096 8.192-8.192s-4.096-8.192-8.192-8.192-8.192 4.096-8.192 8.192 4.096 8.192 8.192 8.192zM288.768 241.664c6.144-6.144 14.336-6.144 20.48 0l51.2 51.2c6.144 6.144 6.144 14.336 0 20.48-6.144 6.144-14.336 6.144-20.48 0l-51.2-51.2c-6.144-6.144-6.144-14.336 0-20.48z m217.088-34.816c8.192 0 14.336 6.144 14.336 14.336v71.68c0 8.192-6.144 14.336-14.336 14.336-8.192 0-14.336-6.144-14.336-14.336v-71.68c0-6.144 6.144-14.336 14.336-14.336z m215.04 32.768c6.144 6.144 6.144 14.336 0 20.48L671.744 307.2c-6.144 6.144-14.336 6.144-20.48 0-6.144-6.144-6.144-14.336 0-20.48l49.152-49.152c6.144-4.096 16.384-4.096 20.48 2.048z m0 0"
                p-id="3147"
                fill="#AECAF5"
              ></path>
            </svg>
            <div>暂无数据</div>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <div>
          <div class="text-style-1">欢迎光临太原市人力资源市场</div>
          <!-- <div class="text-style-2">
						WELCOME TO THE HUMAN RESOURCES MARKET IN GANSU PROVINCE
					</div> -->
        </div>
        <div class="statistics-box">
          <div class="count-box">
            <div class="count-title">招聘企业数量:</div>
            <div class="count-content">
              <div v-for="(item, index) in formatCountData(orderCount || 0)" :key="index">
                <span v-if="item === ','">{{ item }}</span>
                <span v-else class="count-des">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="statistics-box">
          <div class="count-box">
            <div class="count-title">提供职位数量:</div>
            <div class="count-content">
              <div v-for="(item, index) in formatCountData(jobCount || 0)" :key="index">
                <span v-if="item === ','">{{ item }}</span>
                <span v-else class="count-des">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="statistics-box">
          <div class="count-box">
            <div class="count-title">招聘人数:</div>
            <div class="count-content">
              <div v-for="(item, index) in formatCountData(personCount || 0)" :key="index">
                <span v-if="item === ','">{{ item }}</span>
                <span v-else class="count-des">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="qrcode">
          <image src="/static/images/qrCode.jpg"></image>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="40%"
        top="15%"
        :modal-append-to-body="false"
        :append-to-body="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-form label-width="280px">
          <el-form-item label="请选择大屏设备" required>
            <el-select style="width: 340px" ref="select" v-model="ace711_dsc" placeholder="请选择大屏设备">
              <el-option :value="treeDataValue" style="overflow-y: scroll; height: 100%; max-height: 300px">
                <el-tree
                  default-expand-all
                  ref="tree"
                  :data="data"
                  node-key="label"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                ></el-tree>
              </el-option>
            </el-select>
            <el-button style="margin-left: 20px" type="primary" @click="queryDeviceInfo">刷新</el-button>
          </el-form-item>
          <el-form-item label="请输入校验码" required>
            <el-input placeholder="请输入校验码" v-model="ace772" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="chooseDevice">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import modal from './modal.vue'
export default {
  components: {
    modal,
  },
  data() {
    return {
      modalVisible: false,
      dialogVisible: false,
      dialogVisible2: false,
      realtime: this.$utils.dateFormats('YYYY.mm.dd HH:MM:SS', new Date()),
      realTimer: undefined, // 时间定时器
      scrollTimer: undefined, // 滚动定时器
      pollTimer: undefined, // 轮询定时器
      pollInterval: 5000,
      isFetching: false,
      tableColumns2: [
        {
          field: 'aab004',
          title: '单位名称',
          minWidth: 235,
        },
        {
          field: 'aac003',
          title: '姓名',
          minWidth: 130,
        },
        {
          field: 'acz474Desc',
          title: '状态',
          minWidth: 130,
        },
        {
          field: 'aae005',
          title: '联系电话',
          minWidth: 100,
        },
        // {
        //   field: 'acz476',
        //   title: '取号时间',
        //   minWidth: 310,
        // },
        {
          field: 'acb32b',
          title: '展位号码',
          minWidth: 80,
        },
      ],
      tableColumns: [
        {
          field: 'aab004',
          title: '单位名称',
          minWidth: 235,
        },
        {
          field: 'acb213',
          title: '岗位名称',
          minWidth: 235,
        },
        {
          field: 'acb21g',
          title: '招聘人数',
          minWidth: 130,
        },
        {
          field: 'aac011',
          title: '学历',
          minWidth: 130,
        },
        {
          field: 'money',
          title: '月薪',
          minWidth: 130,
        },
        // {
        //   field: 'acb225',
        //   title: '联系电话',
        //   minWidth: 100,
        // },

        {
          field: 'acb217',
          title: '工作地点',
          minWidth: 80,
        },
      ],
      tableData: [],
      countData: {
        ab01Num: 0,
        cb21Num: 0,
        acb21gNum: 0,
        acb301Desc: '云南省',
      },
      acb330: '',

      roomId: 'project-001', // 你自己定义的“同一个场地/项目”
      enabledVoice: true,
      statusLabelMap: {
        1: '进行中',
        2: '待叫号',
        3: '已完成',
        4: '已过号',
        5: '已取消',
      },
      calledKeys: new Set(), // 记录已呼叫过的唯一 key，防止重复呼叫
      repeatTimes: 2,

      treeDataValue: '',
      data: [],
      ace711_dsc: '',
      ace772: '', //设备校验码

      positionList: [],

      jobCount: '0',
      personCount: '0',
      orderCount: '0',
    }
  },
  onLoad(options) {
    console.log(options, 'options')

    if (options.acb330) {
      this.acb330 = options.acb330
      this.queryDeviceInfo()

      //绑定设备后才能获取数据
      this.getAllData()
      this.startPolling()

      this.getData1()
      this.getData2()
    } else {
      this.$utils.showToast('请输入招聘会编号', 'error')
    }

    // const systemInfo = uni.getStorageSync('systemInfo')
    // const userId = systemInfo.mainBoardSN + systemInfo.cpuSerial
    // // sourceType 你后端用来区分渠道：例如 TW=大屏，XCX=小程序等
    // this.$ws.init(userId, 'TW', (raw) => {
    //   // raw 通常是字符串
    //   this.handleMessage(raw)
    // })
  },
  onUnload() {
    // 如果你是大屏常驻不退出，可以不关；但页面卸载建议完全关闭
    ws.completeClose()
    this.stopPolling()
  },

  mounted() {
    this.realtimer = setInterval(this.showTime, 1000)
    this.$nextTick(this.scrollFun)
  },
  onShow() {
    console.log('onShow')

    let deviceInfo_2 = uni.getStorageSync('deviceInfo_2')
    if (!deviceInfo_2) {
      this.dialogVisible = true
    }
  },
  beforeDestroy() {
    this.realtimer && clearInterval(this.realtimer)
    this.scrollTimer && clearInterval(this.scrollTimer)
    this.realtimer = undefined
    this.scrollTimer = undefined
    this.stopPolling()
  },
  computed: {
    defaultProps() {
      return {
        children: 'children',
        label: 'label',
      }
    },
  },
  methods: {
    goBaidu() {
      uni.navigateTo({
        url: '/pages/largeScreen/largeScreen',
      })
    },
    handleMessage(raw) {
      let msg
      try {
        msg = typeof raw === 'string' ? JSON.parse(raw) : raw
      } catch (e) {
        console.log('消息不是JSON：', raw)
        return
      }

      // 你后端消息结构可能不同，下面按你注释里的格式适配：
      // {"fromUserId":"123","toUserId":"1234","data":"ni hao","messageSourceType":"XCX","messageType":"CALL"}
      if (msg.messageType === 'CALL') {
        // 1) UI提示（你自己写弹窗/滚动）
        uni.showToast({ title: msg.data?.number ? `叫号：${msg.data.number}` : '收到叫号', icon: 'none' })

        // 2) 语音播报（优先 msg.data.speechText，没有就拼一句）
        const speechText =
          msg.data?.speechText ||
          (msg.data?.number && msg.data?.counter ? `请 ${msg.data.number} 号到 ${msg.data.counter} 办理` : '请注意叫号')

        console.log('语音播报内容：', speechText)

        // if (this.enabledVoice) this.speak(speechText)
      }
    },
    // 获取表格数据
    async getAllData() {
      if (this.isFetching) return
      this.isFetching = true
      const param = {
        apiCode: 'jy225_hrm103',
        acb330: this.acb330,
      }
      try {
        const res = await this.$http.post(this.$requestConstant.businessRequestType, 'jy225_hrm103', null, param, false)
        const list = (res && res.data && res.data.pageBean && res.data.pageBean.list) || []
        if (!list.length) {
          this.tableData = []
          return
        }
        const list2 = list.map((item) => {
          const list = item.queueList.map((queueItem) => {
            queueItem.acb32b = item.acb32b
            queueItem.aab004 = item.aab004
            return queueItem
          })
          return {
            ...list,
          }
        })
        const li = []
        list2.map((item) => {
          for (let [i, v] of Object.entries(item)) {
            li.push(v)
          }
        })
        console.log(li, 'list3')

        const { aab004, acb32b, queueList = [] } = li
        const callsToTrigger = []
        this.tableData = li.map((item) => {
          const uniqueKey = item.acz470
          const statusCode = item.acz474
          if (statusCode === '1' && uniqueKey && !this.calledKeys.has(uniqueKey)) {
            this.calledKeys.add(uniqueKey)
            callsToTrigger.push(item)
          } else if (statusCode !== '1' && uniqueKey && this.calledKeys.has(uniqueKey)) {
            // 状态回到非待叫号，允许未来再次触发
            this.calledKeys.delete(uniqueKey)
          }
          return {
            ...item,
            acz474Desc: this.statusLabelMap[statusCode] || statusCode,
          }
        })
        if (callsToTrigger.length) {
          this.dispatchCalls(callsToTrigger)
        }
      } catch (error) {
        console.log('getAllData error', error)
      } finally {
        this.isFetching = false
      }
    },
    dispatchCalls(callList) {
      callList.forEach((item) => {
        console.log(item, 'item')

        const number = item.acz475 || item.acz470 || item.aac003 || ''
        const name = item.name
        const counter = item.acb32b ? item.acb32b + '号窗口' : '窗口'
        const speechText = name ? `请${name} 到${counter} 面谈` : '请注意叫号'
        console.log('呼叫中：', item.acz470, speechText)
        if (this.enabledVoice && typeof this.speak === 'function') {
          // uni.showToast({ title: speechText, icon: 'none', time: 1000 })
          // uni.showToast({ title: speechText, icon: 'none', duration: 500 })
          // this.speak(speechText)
          for (let i = 0; i < this.repeatTimes; i++) {
            this.speak(speechText)
          }
        }
      })
    },
    startPolling() {
      if (this.pollTimer) return
      this.pollTimer = setInterval(() => {
        this.getAllData()
      }, this.pollInterval)
    },
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = undefined
      }
    },
    // 格式化统计数据
    formatCountData(number) {
      const countArray = number.toString().split('')
      for (let i = countArray.length; i < 4; i++) {
        countArray.unshift('0')
      }
      const count = countArray.join('').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      return count
    },
    // 时间轮询
    showTime() {
      this.realtime = this.$utils.dateFormats('YYYY.mm.dd HH:MM:SS', new Date())
    },
    // 表格滚动
    scrollFun() {
      // 如果定时器存在
      if (this.scrollTimer) {
        // 则先清除
        clearInterval(this.scrollTimer)
        this.scrollTimer = null
      }
      this.scrollTimer = setInterval(() => {
        const tableBody = document.querySelector('.big-table .big-table-body')
        if (tableBody) {
          const scrollHeight = tableBody.scrollHeight
          const clientHeight = tableBody.clientHeight
          const scroll = scrollHeight - clientHeight
          // 获取当前滚动条距离顶部高度
          const scrollTop = tableBody.scrollTop
          // 距离顶部高度  大于等于 滚动长度
          // 向下滚动
          // 滚动速度
          tableBody.scrollTo({
            top: scrollTop + 48,
            behavior: 'smooth',
          })
          if (scroll <= scrollTop) {
            // 滚动到底部
            tableBody.scrollTop = 0 // 滚动
          }
        }
      }, 3000)
    },
    // 清除滚动定时器
    pauseScroll() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer)
        this.scrollTimer = undefined
      }
    },
    queryDeviceInfo() {
      let deviceInfo = uni.getStorageSync('deviceInfo_2')
      if (!deviceInfo) {
        this.dialogVisible = true
        this.$http
          .post(
            this.$requestConstant.commonRequestType,
            'jy204_hrm262',
            null,
            {
              ace769: '6',
            },
            true,
          )
          .then((res) => {
            this.data = res.data.ce31Pos
          })
      } else {
        this.dialogVisible = false
        this.disabled = true
      }
    },
    chooseDevice() {
      if (!this.ace711) {
        this.$message.error('请选择设备!')
        return
      }
      if (!this.ace772) {
        this.$message.error('请输入检验码!')
        return
      }

      //验证展位机编号和校验码
      let param = {
        ace711: this.ace711,
        ace772: this.ace772,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm267', null, param, true).then((res) => {
        if (res?.data?.result?.code === '0') {
          this.$message.error(res.data.result.message)
        } else {
          this.$message.success(res.data.result.message)
          uni.setStorageSync('deviceInfo_2', {
            ace769: '6',
            ace711: this.ace711,
            ace772: res.data.result.ace772,
          })
          this.dialogVisible = false
          this.disabled = true
          uni.removeStorageSync('reLanch_times')
        }
      })
    },
    handleNodeClick(data, node, nodeData) {
      if (!data.children) data.children = []
      if (!data.children.length) {
        //非最后一层 为城市，不可选为值
        this.treeDataValue = data
        this.ace711 = data.value
        this.ace711_dsc = data.label
        this.$refs.select.blur() //收起下拉框
      }
    },
    // 简单语音播报，依赖浏览器的 SpeechSynthesis
    speak(text) {
      try {
        if (!text) return
        const synthesis = window.speechSynthesis
        if (!synthesis) return
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'zh-CN'
        utterance.rate = 0.7
        utterance.pitch = 1
        utterance.volume = 1
        synthesis.cancel()
        // 延时触发，避免首字被截断
        setTimeout(() => synthesis.speak(utterance), 400)
      } catch (err) {
        console.log('speak error', err)
      }
    },
    // acb330 = '346130781842197550'
    getData1() {
      const param = {
        method: 'jy204_hrm101',
        apiCode: 'jy204_hrm101',
        acb330: this.acb330,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm101', null, param, true).then(async (res) => {
        const { jobCount, personCount, orderCount } = res.data.cb33VO
        this.jobCount = jobCount
        this.personCount = personCount
        this.orderCount = orderCount
      })
    },
    getData2() {
      const param = {
        method: 'jy204_hrm102',
        apiCode: 'jy204_hrm102',
        acb330: this.acb330,
      }
      this.$http.post(this.$requestConstant.commonRequestType, 'jy204_hrm102', null, param, true).then(async (res) => {
        const list = res.data.pageBean.list
        if (list && list.length > 0) {
          list.forEach((item) => {
            const obj = {
              aab004: item.aab004,
              aab060: item.aab060,
            }

            if (item.cb21List && item.cb21List.length > 0) {
              item.cb21List.forEach((item2) => {
                item2.aac011 = this.$codeConfig.getCodeLabel('aac011', item2.aac011) || '暂无'
                item2.aab004 = obj.aab004
                item2.aab060 = obj.aab060
                if (item2.acb21h && item2.acb21j) {
                  item2.money = `${item2.acb21h}-${item2.acb21j}`
                }
                if (item2.acb21h && !item2.acb21j) {
                  item2.money = item2.acb21h
                }
                if (item2.acb21j && !item2.acb21h) {
                  item2.money = item2.acb21j
                }
              })
              this.positionList = [...this.positionList, ...item.cb21List]
            }
          })
        }
      })
    },
    queryInfoByTemplateId(ace340 = '346303451293558820') {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'queryInfoByTemplateId',
          apiCode: 'queryInfoByTemplateId',
          ace340,
        }
        this.$http
          .post(this.$requestConstant.commonRequestType, 'queryInfoByTemplateId', null, param, true)
          .then(async (res) => {
            try {
              const { ce38Info } = res.data.resultMap

              let positionList = await this.getJobList(ce38Info)
              console.log('positionList', positionList)
              this.positionList = positionList

              resolve(true)
            } catch (error) {
              console.log(error)
              reject(error)
            }
          })
      })
    },
    // 获取职位列表
    getJobList(ce38Info) {
      const param = {
        method: 'jy260_ytj05',
        pageSize: 20,
        pageNumber: 1,
        ...ce38Info,
      }
      return new Promise((resolve, reject) => {
        this.$http
          .post(this.$requestConstant.commonRequestType, 'jy260_ytj05', null, param, true)
          .then((res) => {
            const list = res?.data?.pageBean?.list
            if (list && list.length > 0) {
              resolve([...list, ...list, ...list, ...list, ...list, ...list, ...list, ...list, ...list])
            }
            reject()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.screen-box {
  width: 1920px;
  height: 1080px;
  background: url('~@/static/images/page-bg.png');
  background-size: 100% 100%;

  .screen-title {
    text-align: center;
    font-weight: bold;
    font-size: 40px;
    line-height: 75px;
    color: transparent;
    text-shadow: 0px 30px 40px #1857d2;
    background: linear-gradient(to bottom, #e9edf4, #b9cde8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.screen-content {
  width: 1774px;
  margin: 0 auto;
  position: relative;

  .content-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .content-top-right {
      padding: 0 30px;
      height: 56px;
      background: rgba(45, 88, 184, 0.13);
      text-align: right;
      display: flex;
      align-items: center;

      .time-box {
        .time-1 {
          font-weight: 500;
          font-size: 22px;
          color: #aecaf5;
        }

        .time-2 {
          font-size: 12px;
          color: #aecaf5;
        }
      }

      .right-line {
        width: 1px;
        height: 32px;
        background-color: #aecaf5;
        margin: 0 16px;
      }

      .weather {
        .weather-1 {
          font-size: 12px;
          color: #aecaf5;
        }

        .weather-2 {
          font-weight: 500;
          font-size: 18px;
          color: #aecaf5;
        }
      }
    }
  }

  .content-body {
    display: flex;
  }
}

.big-table {
  margin-top: 16px;
  width: 100%;
  height: 625px;
  box-sizing: border-box;

  .big-table-header {
    width: 100%;
    height: 50px;
    background-image: url('~@/static/images/img-4.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .big-table-body {
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
    background: url('~@/static/images/img-2.png') no-repeat;
    background-size: 100% 100%;

    &::-webkit-scrollbar {
      width: 0;
    }

    .big-table-tr {
      border-bottom: 1px solid #355690;
    }

    .table-no-data {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #aecaf5;
    }
  }

  .big-table-tr {
    display: flex;
    align-items: center;
    line-height: 47px;

    .big-table-td {
      width: 0;
      flex: 1;
      flex-shrink: 0;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.header-cell {
  font-size: 18px;
  color: #d2ddf0;
}

.row-class {
  font-size: 16px;
  color: #b2bbd7;
}

/deep/ .vxe-table.border--inner .vxe-body--column {
  background-image: linear-gradient(#355690, #355690);
}

.content-bottom {
  margin-top: 16px;
  width: 100%;
  height: 193px;
  background: url('~@/static/images/img-3.png');
  background-size: 100% 100%;
  padding: 0 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  .text-style-1 {
    font-weight: bold;
    font-size: 42px;
    color: transparent;
    text-shadow: 0px 30px 40px #103887;
    background: linear-gradient(to bottom, #e9edf4, #b9cde8);
    -webkit-background-clip: text;
  }

  .text-style-2 {
    font-family: Arial;
    font-size: 14px;
    line-height: 36px;
    color: transparent;
    text-shadow: 0px 10px 20px #103887;
    background: linear-gradient(to bottom, #e9edf4, #b9cde8);
    -webkit-background-clip: text;
    letter-spacing: 1px;
  }

  .statistics-box {
    display: flex;
  }

  .count-box {
    margin-right: 30px;

    .count-title {
      font-family: Alibaba PuHuiTi;
      font-weight: 400;
      font-size: 24px;
      color: #ffffff;
    }

    .count-content {
      display: flex;
      align-items: center;
      font-size: 43px;
      color: #ededff;
      line-height: 58px;
      text-align: center;

      .count-des {
        display: inline-block;
        width: 38px;
        height: 58px;
        background: url('~@/static/images/img-5.png');
        background-size: 100% 100%;
      }
    }
  }

  .qrcode {
    width: 125px;
    height: 125px;
    color: #ffffff;
    background-color: #ffffff;

    image {
      width: 100%;
      height: 100%;
    }
  }
  .table-no-data {
    .icon {
      width: 200px !important;
      height: 200px !important;
    }
  }
}
</style>
