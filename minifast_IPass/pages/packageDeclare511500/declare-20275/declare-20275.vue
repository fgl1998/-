<!-- 高校毕业生创业补贴 人社局 -->
<template>
  <view class="declare">
    <!-- 当前申报流程 -->
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <!-- 申报人或者代办人基本信息 -->
    <div class="basic-info-wrapper">
      <ComponentDeclare
        :declareType="declareType"
        :fixedDeclareType="fixedDeclareType"
        :renderObj="renderObj"
        :projectNumber="chi031"
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
      >
      </ComponentDeclare>
    </div>

    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="毕业时间"
              idName="r00120"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.r00120"
              placeholder="请选择毕业时间"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">毕业学校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00001"
                  placeholder="请输入毕业学校名称"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">就业创业证编号</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="20"
                  v-model="projectDeclareInfo.r00035"
                  placeholder="请输入就业创业证编号"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">创业项目名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r46701"
                  placeholder="请输入创业项目名称"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">创业实体</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00026"
                  placeholder="请输入创业实体"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="创立时间"
              idName="r00139"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.r00139"
              placeholder="请选择创立时间"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">员工人数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="10"
                  v-model="projectDeclareInfo.r00027"
                  placeholder="请输入员工人数"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">工商登记</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00028"
                  placeholder="请输入工商登记"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
    <div class="button-wrapper">
      <ComponentButton
        @click="handleJumpNextStep"
        name="下一步"
        type="primary"
      ></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20275',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {},
      today_d: useGetCurrentDate(),
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },

  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aae005, //联系电话
        aac004, //性别

        r00120, //毕业时间
        r00001, //毕业学校名称
        r00035, //就业创业证编号
        r46701, //创业项目名称
        r00026, //创业实体（创业项目）
        r00139, //创立时间
        r00027, //员工（团队）人数
        r00028, //工商登记（民政注册或职业
      } = this.projectDeclareInfo

      if (!r00120) {
        showModal('请选择毕业时间')
        return false
      }
      if (!r00001) {
        showModal('请输入毕业学校名称')
        return false
      }
      if (!r00035) {
        showModal('请输入就业创业证编号')
        return false
      }
      if (!r46701) {
        showModal('请输入创业项目名称')
        return false
      }
      if (!r00026) {
        showModal('请输入创业实体')
        return false
      }
      if (!r00139) {
        showModal('请选择创立时间')
        return false
      }
      if (!r00027) {
        showModal('请输入员工（团队）人数')
        return false
      }
      if (!r00028) {
        showModal('请输入工商登记')
        return false
      }

      return true
    },
    // 下一步
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      const {
        gender, // 性别
        tel,
      } = this.basicInfo

      const {
        r00120, //毕业时间
        r00001, //毕业学校名称
        r00035, //就业创业证编号
        r46701, //创业项目名称
        r00026, //创业实体（创业项目）
        r00139, //创立时间
        r00027, //员工（团队）人数
        r00028, //工商登记（民政注册或职业
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aae005: tel, //联系电话
        aac004: gender, //性别

        r00120, //毕业时间
        r00001, //毕业学校名称
        r00035, //就业创业证编号
        r46701, //创业项目名称
        r00026, //创业实体（创业项目）
        r00139, //创立时间
        r00027, //员工（团队）人数
        r00028, //工商登记（民政注册或职业
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
