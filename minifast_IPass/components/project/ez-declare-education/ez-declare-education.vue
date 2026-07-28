<template>
  <div class="space-top-wrapper specilWrapper">
    <div class="title">量化体系认定填报内容</div>
    <div class="input-tip">
      <div class="icon"></div>
      <div>本人承诺诚信，准确、如实填写以下资料、如有虚假，愿意承担相应责任。</div>
    </div>
    <ComponentPanel title="家庭经济状况">
      <div class="panel-content">
        <div class="cell-items">
          <block>
            <ComponentDeclarePicker
              label="家庭人均年收入（可支配收入）"
              :labelWidth="200"
              idName="j00219"
              :range="codeMap.J00219"
              placeholder="请选择家庭人均年收入"
              v-model="projectDeclareInfo.j00219"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="家庭房产情况"
              idName="j00220"
              :range="codeMap.J00220"
              placeholder="请选择家庭房产情况"
              v-model="projectDeclareInfo.j00220"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="车辆情况"
              idName="j00221"
              :range="codeMap.J00221"
              placeholder="请选择车辆情况"
              v-model="projectDeclareInfo.j00221"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="经商办企业情况"
              idName="j00222"
              :range="codeMap.J00222"
              placeholder="请选择经商办企业情况"
              v-model="projectDeclareInfo.j00222"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              :labelWidth="300"
              :height="200"
              label="债务状况（非投资购房欠债（如天灾人祸、重大疾病、交通事故等））"
              idName="j00223"
              :range="codeMap.J00223"
              placeholder="请选择债务状况"
              v-model="projectDeclareInfo.j00223"></ComponentDeclarePicker>
          </block>
        </div>
      </div>
    </ComponentPanel>
    <ComponentPanel title="地区经济发展水平及居住环境状况">
      <div class="panel-content">
        <div class="cell-items">
          <block>
            <ComponentDeclarePicker
              label="家庭户口所在区域"
              idName="j00224"
              :range="codeMap.J00224"
              placeholder="请选择区域"
              v-model="projectDeclareInfo.j00224"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="家庭所在城乡"
              idName="j00225"
              :range="codeMap.J00225"
              placeholder="请选择城乡"
              v-model="projectDeclareInfo.j00225"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="家庭所在地交通情况"
              :labelWidth="250"
              idName="j00240"
              :range="codeMap.J00240"
              placeholder="请选择所在地交通情况"
              v-model="projectDeclareInfo.j00240"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="家庭居住环境（家用电器使用:彩电、冰箱、电脑、电烤箱、洗衣机、空调、投影仪7件套，家庭有其中）"
              idName="j00226"
              :labelWidth="200"
              :height="400"
              :range="codeMap.J00226"
              placeholder="请选择电器使用情况"
              v-model="projectDeclareInfo.j00226"></ComponentDeclarePicker>
          </block>
        </div>
      </div>
    </ComponentPanel>
    <ComponentPanel title="突发、灾害状况">
      <div class="panel-content">
        <div class="cell-items">
          <block>
            <ComponentDeclarePicker
              label="重大自然灾害"
              idName="j00227"
              :range="codeMap.J00227"
              placeholder="请选择重大自然灾害"
              v-model="projectDeclareInfo.j00227"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="重大突发意外事件"
              idName="j00228"
              :range="codeMap.J00228"
              placeholder="请选择意外事件"
              v-model="projectDeclareInfo.j00228"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="突发重大疾病状况"
              idName="j00229"
              :range="codeMap.J00229"
              placeholder="请选择疾病状况"
              v-model="projectDeclareInfo.j00229"></ComponentDeclarePicker>
          </block>
        </div>
      </div>
    </ComponentPanel>
    <ComponentPanel title="其他影响家庭经济状况（主要成员负担、健康状况、劳动力、职业状况等">
      <div class="panel-content">
        <div class="cell-items">
          <block>
            <ComponentDeclarePicker
              label="家庭居住成员职业状况"
              idName="j00230"
              :range="codeMap.J00230"
              placeholder="请选择职业状况"
              v-model="projectDeclareInfo.j00230"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="家庭成员残疾情况"
              idName="j00231"
              :range="codeMap.J00231"
              placeholder="请选择残疾情况"
              v-model="projectDeclareInfo.j00231"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="家庭成员健康状况"
              idName="j00232"
              :range="codeMap.J00232"
              placeholder="请选择健康状况"
              v-model="projectDeclareInfo.j00232"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="父母劳动能力状况"
              idName="j00233"
              :range="codeMap.J00233"
              placeholder="请选择能力状况"
              v-model="projectDeclareInfo.j00233"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="赡养60岁以上老人数"
              idName="j00234"
              :range="codeMap.J00234"
              placeholder="请选择人数"
              v-model="projectDeclareInfo.j00234"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="抚养未成年人数"
              idName="j00235"
              :range="codeMap.J00235"
              placeholder="请选择人数"
              v-model="projectDeclareInfo.j00235"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="家庭负担学生上学人数（除本人外）"
              idName="j00236"
              :labelWidth="300"
              :range="codeMap.J00236"
              placeholder="请选择上学人数"
              v-model="projectDeclareInfo.j00236"></ComponentDeclarePicker>
          </block>
          <block>
            <ComponentDeclarePicker
              label="家庭受教育程度（除本人外，居住在一起家庭成员的最高学历）"
              idName="j00237"
              :labelWidth="200"
              :height="300"
              :range="codeMap.J00237"
              placeholder="请选择家庭受教育程度"
              v-model="projectDeclareInfo.j00237"></ComponentDeclarePicker>
          </block>
        </div>
      </div>
    </ComponentPanel>
    <ComponentPanel title="其他认定">
      <div class="panel-content">
        <div class="cell-items">
          <block>
            <ComponentDeclarePicker
              label="是否存在学生亲兄弟姐妹在高收费的非普惠性民办学校（含幼儿园）就读"
              idName="j00238"
              :labelWidth="400"
              :height="200"
              :range="codeMap.yesorno"
              placeholder="请选择"
              @change="handlePickerChange"
              v-model="projectDeclareInfo.j00238"></ComponentDeclarePicker>
          </block>
          <!-- 就读学校名称 -->
          <div :class="['cell-item', projectDeclareInfo.j00238 === '1' ? 'required' : '']">
            <div class="key">就读学校名称</div>
            <div class="value">
              <input type="text" v-model="projectDeclareInfo.j00242" placeholder="请输入就读学校名称" />
            </div>
          </div>
          <block>
            <ComponentDeclarePicker
              label="是否存在生活奢侈浪费，在校消费情况与其家庭经济困难状况不相符的其他高消费行为或不当消费行为"
              idName="j00239"
              :labelWidth="400"
              :height="200"
              :range="codeMap.yesorno"
              placeholder="请选择"
              v-model="projectDeclareInfo.j00239"></ComponentDeclarePicker>
          </block>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>

<script>
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'
  import { USER_INFO } from '@/store/constants/index.js'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ezDeclareEducation',
    data() {
      return {
        projectDeclareInfo: {
          j00219: '', //家庭人均年收入（可支配收入）
          j00220: '', //家庭房产情况
          j00221: '', //车辆情况
          j00222: '', //经商办企业情况
          j00223: '', //债务状况
          j00224: '', //家庭户口所在区域
          j00225: '', //家庭所在城乡
          j00226: '', //家庭居住环境（家用电器使用）
          j00227: '', //重大自然灾害
          j00228: '', //重大突发意外事件
          j00229: '', //突发重大疾病状况
          j00230: '', //家庭居成员职业状况
          j00231: '', //家庭成员残疾情况
          j00232: '', //家庭成员健康状况
          j00233: '', //父母劳动能力状况
          j00234: '', //赡养60岁以上老人数
          j00235: '', //抚养未成年人数
          j00236: '', //家庭负担学生上学人数
          j00237: '', //家庭受教育程度
          j00238: '', //学生亲兄弟姐妹在高收费的非普惠性民办学校（含幼儿园）就读的
          j00239: '', //生活奢侈浪费，在校消费情况与其家庭经济困难状况不相符的其他高消费行为或不当消费行为的
          j00240: '', //家庭所在地交通情况
          j00242: '' //就读学校名称
        },
        codeMap: {}
      }
    },
    components: {
      ComponentPanel,
      ComponentDeclarePicker
    },
    computed: {
      ...mapGetters([USER_INFO])
    },
    mounted() {
      this.getCodeData()
      // this.setDefaultData()
    },
    methods: {
      setDefaultData() {
        const { idCard } = this.userInfo
        // 内江杜盼登录展示
        if (idCard == '511526199912254218' || idCard == '511325199604210056' || idCard == '510124199111053218') {
          Object.keys(this.projectDeclareInfo).forEach((key) => {
            this.$set(this.projectDeclareInfo, key, '2')
          })
          this.$set(this.projectDeclareInfo, 'j00239', '0')
          this.$set(this.projectDeclareInfo, 'j00238', '0')
        }
      },
      handlePickerChange(id, valueDesc, valueKey) {
        console.log(id, valueDesc, valueKey)
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          j00219, //家庭人均年收入（可支配收入）
          j00220, //家庭房产情况
          j00221, //车辆情况
          j00222, //经商办企业情况
          j00223, //债务状况
          j00224, //家庭户口所在区域
          j00225, //家庭所在城乡
          j00226, //家庭居住环境（家用电器使用）
          j00227, //重大自然灾害
          j00228, //重大突发意外事件
          j00229, //突发重大疾病状况
          j00230, //家庭居成员职业状况
          j00231, //家庭成员残疾情况
          j00232, //家庭成员健康状况
          j00233, //父母劳动能力状况
          j00234, //赡养60岁以上老人数
          j00235, //抚养未成年人数
          j00236, //家庭负担学生上学人数
          j00237, //家庭受教育程度
          j00238, //学生亲兄弟姐妹在高收费的非普惠性民办学校（含幼儿园）就读的
          j00239, //生活奢侈浪费，在校消费情况与其家庭经济困难状况不相符的其他高消费行为或不当消费行为的
          j00240, //家庭所在地交通情况
          j00242 //就读学校名称
        } = this.projectDeclareInfo
        console.log(this.projectDeclareInfo, 'this.this.projectDeclareInfo')

        if (!j00219) {
          showModal('请选择家庭人均年收入')
          return false
        }
        if (!j00220) {
          showModal('请选择家庭房产情况')
          return false
        }
        if (!j00221) {
          showModal('请选择车辆情况')
          return false
        }
        if (!j00222) {
          showModal('请选择经商办企业情况')
          return false
        }

        if (!j00223) {
          showModal('请选择债务状况')
          return false
        }
        if (!j00224) {
          showModal('请选择家庭户口所在区域')
          return false
        }
        if (!j00225) {
          showModal('请选择家庭所在城乡')
          return false
        }
        if (!j00240) {
          showModal('请选择家庭所在地交通情况')
          return false
        }
        if (!j00226) {
          showModal('请选择家庭居住环境（家用电器使用）')
          return false
        }
        if (!j00227) {
          showModal('请选择重大自然灾害')
          return false
        }
        if (!j00228) {
          showModal('请选择重大突发意外事件')
          return false
        }
        if (!j00229) {
          showModal('请选择突发重大疾病状况')
          return false
        }
        if (!j00230) {
          showModal('请选择家庭居成员职业状况')
          return false
        }
        if (!j00231) {
          showModal('请选择家庭成员残疾情况')
          return false
        }
        if (!j00232) {
          showModal('请选择家庭成员健康状况')
          return false
        }
        if (!j00233) {
          showModal('请选择父母劳动能力状况')
          return false
        }
        if (!j00234) {
          showModal('请选择赡养60岁以上老人数')
          return false
        }
        if (!j00235) {
          showModal('请选择抚养未成年人数')
          return false
        }
        if (!j00236) {
          showModal('请选择家庭负担学生上学人数')
          return false
        }
        if (!j00237) {
          showModal('请选择家庭受教育程度')
          return false
        }
        if (!j00238) {
          showModal('请选择是否存在学生亲兄弟姐妹在高收费的非普惠性民办学校（含幼儿园）就读')
          return false
        }
        if (j00238 === '1' && !j00242) {
          showModal('请填写就读学校名称')
          return false
        }
        if (!j00239) {
          showModal('请选择是否存在生活奢侈浪费，在校消费情况与其家庭经济困难状况不相符的其他高消费行为或不当消费行为')
          return false
        }
        return this.projectDeclareInfo
      },
      // 获取该申报项目的所需要的码表数据
      async getCodeData() {
        let J00219 = [] //家庭人均年收入（可支配收入）
        let J00220 = [] //家庭房产情况
        let J00221 = [] //车辆情况
        let J00222 = [] //经商办企业情况
        let J00223 = [] //债务状况
        let J00224 = [] //家庭户口所在区域
        let J00225 = [] //家庭所在城乡
        let J00226 = [] //家庭居住环境（家用电器使用）
        let J00227 = [] //重大自然灾害
        let J00228 = [] //重大突发意外事件
        let J00229 = [] //突发重大疾病状况
        let J00230 = [] //家庭居成员职业状况
        let J00231 = [] //家庭成员残疾情况
        let J00232 = [] //家庭成员健康状况
        let J00233 = [] //父母劳动能力状况
        let J00234 = [] //赡养60岁以上老人数
        let J00235 = [] //抚养未成年人数
        let J00236 = [] //家庭负担学生上学人数
        let J00237 = [] //家庭受教育程度

        let yesorno = [] // 是否
        let J00240 = [] //家庭所在地交通情况
        try {
          J00219 = await getCodeListByCodeName('J00219')
        } catch (err) {
          console.error('code table J00219 error', err)
        }
        try {
          J00220 = await getCodeListByCodeName('J00220')
        } catch (err) {
          console.error('code table J00220 error', err)
        }
        try {
          J00221 = await getCodeListByCodeName('J00221')
        } catch (err) {
          console.error('code table J00221 error', err)
        }
        try {
          J00222 = await getCodeListByCodeName('J00222')
        } catch (err) {
          console.error('code table J00222 error', err)
        }
        try {
          J00223 = await getCodeListByCodeName('J00223')
        } catch (err) {
          console.error('code table J00223 error', err)
        }
        try {
          J00224 = await getCodeListByCodeName('J00224')
        } catch (err) {
          console.error('code table J00224 error', err)
        }
        try {
          J00225 = await getCodeListByCodeName('J00225')
        } catch (err) {
          console.error('code table J00225 error', err)
        }
        try {
          J00226 = await getCodeListByCodeName('J00226')
        } catch (err) {
          console.error('code table J00226 error', err)
        }
        try {
          J00227 = await getCodeListByCodeName('J00227')
        } catch (err) {
          console.error('code table J00227 error', err)
        }
        try {
          J00228 = await getCodeListByCodeName('J00228')
        } catch (err) {
          console.error('code table J00228 error', err)
        }
        try {
          J00229 = await getCodeListByCodeName('J00229')
        } catch (err) {
          console.error('code table J00229 error', err)
        }
        try {
          J00230 = await getCodeListByCodeName('J00230')
        } catch (err) {
          console.error('code table J00230 error', err)
        }
        try {
          J00231 = await getCodeListByCodeName('J00231')
        } catch (err) {
          console.error('code table J00231 error', err)
        }
        try {
          J00232 = await getCodeListByCodeName('J00232')
        } catch (err) {
          console.error('code table J00232 error', err)
        }
        try {
          J00233 = await getCodeListByCodeName('J00233')
        } catch (err) {
          console.error('code table J00233 error', err)
        }
        try {
          J00234 = await getCodeListByCodeName('J00234')
        } catch (err) {
          console.error('code table J00234 error', err)
        }
        try {
          J00235 = await getCodeListByCodeName('J00235')
        } catch (err) {
          console.error('code table J00235 error', err)
        }
        try {
          J00236 = await getCodeListByCodeName('J00236')
        } catch (err) {
          console.error('code table J00236 error', err)
        }
        try {
          J00237 = await getCodeListByCodeName('J00237')
        } catch (err) {
          console.error('code table J00237 error', err)
        }
        try {
          J00240 = await getCodeListByCodeName('J00240')
        } catch (err) {
          console.error('code table J00240 error', err)
        }
        try {
          yesorno = await getCodeListByCodeName('yesorno')
        } catch (err) {
          console.error('code table yesorno error', err)
        }
        this.codeMap = {
          ...this.codeMap,
          J00219,
          J00220,
          J00221,
          J00222,
          J00223,
          J00224,
          J00225,
          J00226,
          J00227,
          J00228,
          J00229,
          J00230,
          J00231,
          J00232,
          J00233,
          J00234,
          J00235,
          J00236,
          J00237,
          J00240,
          yesorno
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .specilWrapper {
    background-color: #fff !important;
    margin: 30rpx 30rpx 0;
    padding-top: 30rpx;
    border-radius: 8rpx;
    .title {
      margin-left: 30rpx;
      font-size: 38rpx;
      font-weight: bold;
      display: flex;
      align-items: center;
      &::before {
        text-align: center;
        display: block;
        content: 'i';
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        border-radius: 50%;
        background-color: #3088f6;
        margin-right: 20rpx;
        color: #fff;
      }
    }
    .input-tip {
      background-color: #fff7e7;
      border-radius: 4rpx;
      padding: 12rpx;
      font-size: 24rpx;
      line-height: 32rpx;
      color: #e49904;
      position: relative;
      margin: 20rpx 30rpx !important;
    }
  }
</style>
