<template>
  <xu-common-shell :title="loginInfo.aab004" type="2">
    <view class="contentBox">
      <view class="content">
        <el-tabs v-model="activeName" type="card" class="c_tab">
          <el-tab-pane label="我的招聘情况" name="first" :lazy="true">
            <view class="zpqk">
              <zpqk />
            </view>
          </el-tab-pane>
          <el-tab-pane label="我的招聘会" name="second" :lazy="true">
            <view class="zph">
              <zph />
            </view>
          </el-tab-pane>
          <el-tab-pane label="岗位信息统计" name="three" :lazy="true">
            <view class="job">
              <job />
            </view>
          </el-tab-pane>
        </el-tabs>
      </view>
    </view>
  </xu-common-shell>
</template>

<script>
import zpqk from './components/zpqk.vue'
import zph from './components/zph.vue'
import job from './components/job.vue'

export default {
  name: 'tongji',
  components: {
    zpqk,
    zph,
    job,
  },
  data() {
    return {
      loginInfo: {},
      activeName: 'first',
    }
  },
  created() {
    this.loginInfo = this.$loginConfig.getLoginInfo()
    // 获取岗位总数和投递数
  },
  mounted() {},
  onLoad() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.contentBox {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 12px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 10px;
  }

  * {
    box-sizing: border-box;
    //border: 1px solid red;
  }

  .content {
    padding: 24px 32px;
  }
}

/deep/ .c_tab {
  .el-tabs__nav {
    border: 0;

    .el-tabs__item {
      width: 169px;
      height: 40px;

      line-height: 40px;
      text-align: center;

      margin-right: 32px;
      border-radius: 4px;
      background: #eaeff8;
    }

    .is-active {
      background-color: #0682fe;
      color: #ffffff;
    }
  }
}
</style>
