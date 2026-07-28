<!-- 双巴“金鹏工程”大学生生活补助（教育局） -->
<template>
  <view class="declare">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

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

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
		<div class="personnel-type-wrapper space-top-wrapper">
			<ComponentDeclarePersonnel
				:renderData="personnelList"
				@change="handleChangePersonnelInfo"
			></ComponentDeclarePersonnel>
		</div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 家庭类型调整为人员类别 -->
            <!-- <ComponentDeclarePicker
              label="家庭困难类型"
              idName="j00110"
              :range="codeMap.j00110"
              placeholder="请选择家庭困难类型"
              v-model="projectDeclareInfo.j00110"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker> -->
            <div class="cell-item required">
              <div class="key">政治面貌</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00056"
                  placeholder="请输入政治面貌"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭人口</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.chb0gk"
                  placeholder="请输入家庭人口"
                />
              </div>
            </div>
            <!-- <div class="cell-item required">
              <div class="key">家庭年收入</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb0gl"
                  placeholder="请输入家庭年收入"
                />
              </div>
            </div> -->
            <div class="cell-item required">
              <div class="key">录取院校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00008"
                  placeholder="请输入录取院校名称"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">专业名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00023"
                  placeholder="请输入专业名称"
                />
              </div>
            </div>
            <!-- <div class="cell-item required">
              <div class="key">父亲所在单位</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00104"
                  placeholder="请输入父亲所在单位"
                />
              </div>
            </div> -->
            <!-- <div class="cell-item required">
              <div class="key">父亲职务</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00105"
                  placeholder="请输入父亲职务"
                />
              </div>
            </div> -->
            <div class="cell-item required">
              <div class="key">父亲电话号码</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.j00106"
                  placeholder="请输入父亲电话号码"
                />
              </div>
            </div>
            <!-- <div class="cell-item required">
              <div class="key">母亲所在单位</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00107"
                  placeholder="请输入母亲所在单位"
                />
              </div>
            </div> -->
            <!-- <div class="cell-item required">
              <div class="key">母亲职务</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00108"
                  placeholder="请输入母亲职务"
                />
              </div>
            </div> -->
            <div class="cell-item required">
              <div class="key">母亲电话号码</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00109"
                  placeholder="请输入母亲电话号码"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭主要成员及其经济情况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00111"
                  placeholder="请输入"
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

import { getIsDev } from '@/utils/get'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20633',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        birthday: true, // 出生日期
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        //  j00110:'',
      },
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
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      //let j00110 = [] // 家庭困难类型

      // try {
      //   j00110 = await getCodeListByCodeName('j00110')
      // } catch (err) {
      //   if (isDev) {
      //     console.log('code table j00110 error：', err)
      //   }
      // }

      this.codeMap = {
        ...this.codeMap,
        //  j00110,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        // j00110, // 家庭困难类型
        j00056, // 政治面貌
        chb0gk, // 家庭人口
        // chb0gl, // 家庭年收入
        j00008, // 录取院校名称
        j00023, // 专业名称
        // j00104, // 父亲所在单位
        // j00105, // 父亲职务
        j00106, // 父亲电话号码
        // j00107, // 母亲所在单位
        // j00108, // 母亲职务
        j00109, // 母亲电话号码
        j00111, // 家庭主要成员及其经济情况
      } = this.projectDeclareInfo

      // if (!j00110) {
      //   showModal('请选择家庭困难类型')
      //   return false
      // }

      if (!j00056) {
        showModal('请选择政治面貌')
        return false
      }
      if (!chb0gk) {
        showModal('请输入家庭人口')
        return false
      }
      // if (!chb0gl) {
      //   showModal('请输入家庭年收入')
      //   return false
      // }
      if (!j00008) {
        showModal('请输入录取院校名称')
        return false
      }
      if (!j00023) {
        showModal('请输入专业名称')
        return false
      }
      // if (!j00104) {
      //   showModal('请输入父亲所在单位')
      //   return false
      // }
      // if (!j00105) {
      //   showModal('请输入父亲职务')
      //   return false
      // }
      if (!j00106) {
        showModal('请输入父亲电话号码')
        return false
      }
      // if (!j00107) {
      //   showModal('请输入母亲所在单位')
      //   return false
      // }
      // if (!j00108) {
      //   showModal('请输入母亲职务')
      //   return false
      // }
      if (!j00109) {
        showModal('请输入母亲电话号码')
        return false
      }
      if (!j00111) {
        showModal('请输入家庭主要成员及其经济情况')
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
        tel, // 联系电话
        gender, // 性别
        birthday, // 出生日期
      } = this.basicInfo

      const {
        // j00110, // 家庭困难类型
        j00056, // 政治面貌
        chb0gk, // 家庭人口
        // chb0gl, // 家庭年收入
        j00008, // 录取院校名称
        j00023, // 专业名称
        // j00104, // 父亲所在单位
        // j00105, // 父亲职务
        j00106, // 父亲电话号码
        // j00107, // 母亲所在单位
        // j00108, // 母亲职务
        j00109, // 母亲电话号码
        j00111, // 家庭主要成员及其经济情况
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aae005: tel, // 联系电话
        aac004: gender, // 性别
        j00059: birthday, // 出生年月
        // j00110, // 家庭困难类型
        j00056, // 政治面貌
        chb0gk, // 家庭人口
        // chb0gl, // 家庭年收入
        j00008, // 录取院校名称
        j00023, // 专业名称
        // j00104, // 父亲所在单位
        // j00105, // 父亲职务
        j00106, // 父亲电话号码
        // j00107, // 母亲所在单位
        // j00108, // 母亲职务
        j00109, // 母亲电话号码
        j00111, // 家庭主要成员及其经济情况
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
</style>
