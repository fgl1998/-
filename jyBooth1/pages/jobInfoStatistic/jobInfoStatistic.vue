<template>
  <div class="screen-box">
    <div class="screen-title">太原市智慧招聘信息发布大屏</div>
    <div class="screen-content">
      <div class="content-top">
        <div class="content-top-left">总体情况分析</div>
        <div class="content-top-right">
          <div class="time-1">
            {{ realtime.format('HH:mm:ss') }}
          </div>
          <div class="time-2">
            {{ realtime.format('YYYY.MM.DD') }}
          </div>
        </div>
      </div>
      <div class="content-body">
        <job-info-left :acb330="acb330" />
        <job-info-center :acb330="acb330" />
        <job-info-right :acb330="acb330" />
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
import moment from 'moment'
import JobInfoLeft from './part/jobInfoLeft'
import JobInfoRight from './part/jobInfoRight'
import JobInfoCenter from './part/jobInfoCenter'

export default {
  name: 'jobInfoStatistic',
  components: { JobInfoCenter, JobInfoRight, JobInfoLeft },
  data() {
    return {
      realtime: moment(),
      realTimer: undefined, // 时间定时器

      dialogVisible: false,
      treeDataValue: '',
      data: [],
      ace711_dsc: '',
      ace772: '', //设备校验码
      acb330: '',
    }
  },
  computed: {
    defaultProps() {
      return {
        children: 'children',
        label: 'label',
      }
    },
  },
  onLoad(options) {
    if (options.acb330) {
      this.acb330 = options.acb330
      this.realtimer = setInterval(this.showTime, 1000)
      this.queryDeviceInfo()
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
  mounted() {
    // this.realtimer = setInterval(this.showTime, 1000)
    // this.queryDeviceInfo()
  },

  beforeDestroy() {
    this.realtimer && clearInterval(this.realtimer)
    this.realtimer = undefined
  },
  methods: {
    // 时间轮询
    showTime() {
      this.realtime = moment()
    },
    queryDeviceInfo() {
      let deviceInfo = uni.getStorageSync('deviceInfo_3')
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
          uni.setStorageSync('deviceInfo_3', {
            ace769: '6',
            ace711: this.ace711,
            ace772: res.data.result.ace772,
          })
          this.dialogVisible = false
          this.disabled = true
          this.companyInfo = {}
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
  },
}
</script>

<style scoped lang="scss">
@import '../../static/scss/gsCommon.scss';
</style>
