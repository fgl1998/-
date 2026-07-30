<template>
  <div class="content">
    <!-- 选择codeValue -->
    <van-popup v-model="showCodeValueFrame" position="bottom">
      <van-picker show-toolbar value-key="label" :columns="codeValueList" @confirm="codeValueConfirm"
                  @cancel="showCodeValueFrame = false"/>
    </van-popup>
    <!--    <van-popup-->
    <!--          v-model="issjhmUpload"-->
    <!--          closeable-->
    <!--          :close-on-click-overlay="false"-->
    <!--          @close="closesjhmUpload"-->
    <!--          style="width: 90%;height: 60%"-->
    <!--      >-->
    <!--        <p style="margin-top: 60px">注意：该二维码将于<span style="color:red">{{ qrFailTime }}</span>秒后失效,请用手机微信扫码授权。非本地缴存户不用授权，直接关闭此二维码即可</p>-->
    <!--        <qr-code :qr-code-text="qrCodeText" />-->
    <!--      </van-popup>-->
    <h1 class="title">
      <van-icon name="user-o"/>
      借款人信息
    </h1>
    <van-cell-group inset :key="updateMark">
     <!-- <van-notice-bar
          v-if="personData.glgx !== '71'"
          left-icon="info-o"
          background="#f0f8ff"
          color="#1989fa"
          :text="noticeText"
          :scrollable="false"
          wrapable
          style="margin-bottom: 16px;"
      /> -->
      <yhSelect :value="personData.fzxjg"
                :code-values="codeValues.LPSSQYColumns"
                v-if="this.relShips === 0"
                :required="true"
                @input="(v)=> personData.fzxjg = v"
                label="房屋所属区域"/>
      <yhSelect :value="personData.glgx"
                :code-values="codeValues.GLGXColumns.filter(obj => varyglgx.split(',').includes(obj.value))"
                :required="true"
                @input="(v)=> personData.glgx = v"
                :disabled="this.relShips === 0"
                label="关联关系"/>
      <yhSelect :value="personData.gldx"
                :disabled="true"
                :code-values="GLDXColumns"
                :required="true"
                @input="(v)=> personData.gldx = v"
                label="关联对象"/>
      <yhSelect :value="personData.cdgx"
                :code-values="codeValues.CDGXColumns.filter(obj => varycdgx.split(',').includes(obj.value))"
                :disabled="this.relShips === 0"
                :required="true"
                @input="(v)=> personData.cdgx = v"
                label="参贷关系"/>
      <van-field label="姓名" v-model="personData.xingming" input-align="right" @blur="getBorrowerAuthInfo"
                 :disabled="this.relShips === 0 || personData.deptype === '01' " required placeholder="请填写姓名"/>
      <yhSelect :value="personData.zjlx"
                :code-values="codeValues.GRZJLXColumns"
                :required="true"
                @input="(v)=> personData.zjlx = v"
                label="证件类型"/>
      <van-field label="证件号码" v-model="personData.zjhm" input-align="right" @blur="getBorrowerAuthInfo" required
                 :disabled="this.relShips === 0"
                 :rules="[{ validator:validateIDCardSimple, message: '请填写正确证件号码' }]"
                 placeholder="请填写证件号码"/>
      <van-field label="出生日期" v-model="personData.csrq" input-align="right" placeholder="请选择出生日期"
                 disabled readonly required/>
      <yhSelect :value="personData.xingbie"
                :code-values="codeValues.XINGBIEColumns.filter(obj => '1,2'.includes(obj.value))"
                :required="true"
                @input="(v)=> {personData.xingbie = v;}"
                label="性别"/>
     <!-- <yhSelect :value="personData.isHadChildren"
                :code-values="codeValues.SHIFOUColumns"
                :required="true"
                @input="(v)=> personData.isHadChildren = v"
                v-if="this.relShips === 0"
                label="多孩"/> -->
      <!-- <yhSelect :value="personData.isNewYouth"
                :code-values="codeValues.SHIFOUColumns"
                :required="personData.glgx !== '71' && personData.deptype === '01'"
                v-if="personData.glgx !== '71' && personData.deptype === '01'"
                :disabled="true"
                @input="(v)=> personData.isNewYouth = v"
                label="是否新青年"/> -->
      <yhSelect :value="personData.hyzk"
                :code-values="codeValues.HYZKColumns.filter(obj => '30,40,10,20'.includes(obj.value))"
                :required="true"
                :disabled = "personData.cdgx === '02'"
                @input="(v)=> personData.hyzk = v"
                label="婚姻状况"/>
      <van-field
        v-if="personData.hyzk === '20'"
        label="结婚日期"
        v-model="personData.hyrq"
        input-align="right"
        readonly
        :required="personData.hyzk === '20'"
        :rules="[{required: personData.hyzk === '20'}]"
        placeholder="请选择结婚日期"
        @click="showHyrqPicker = true"
      />
      <van-popup v-model="showHyrqPicker" position="bottom">
        <van-datetime-picker
          v-model="hyrqDate"
          type="date"
          title="选择结婚日期"
          :max-date="hyrqMaxDate"
          @confirm="confirmHyrq"
          @cancel="showHyrqPicker = false"
        />
      </van-popup>
      <yhSelect :value="personData.rysf"
                :code-values="codeValues.RYSFColumns.filter(obj => '01,02,06,99'.includes(obj.value))"
                :required="true"
                @input="(v)=> personData.rysf = v"
                label="人员身份"/>
      <yhSelect :value="personData.zhiye"
                :code-values="codeValues.ZHIYEColumns"
                :required="true"
                @input="(v)=> personData.zhiye = v"
                label="职业"/>
      <yhSelect :value="personData.zhichen"
                :code-values="codeValues.ZHICHENColumns"
                :required="true"
                @input="(v)=> personData.zhichen = v"
                label="职称"/>
      <yhSelect :value="personData.zhiwu"
                :code-values="codeValues.ZHIWUColumns"
                :required="true"
                @input="(v)=> personData.zhiwu = v"
                label="职务"/>
      <yhSelect :value="personData.xueli"
                :code-values="codeValues.XUELIColumns"
                :required="true"
                @input="(v)=> personData.xueli = v"
                label="学历"/>
      <yhSelect :value="personData.xuewei"
                :code-values="codeValues.XUEWEIColumns || []"
                :required="false"
                @input="(v)=> personData.xuewei = v"
                label="学位"/>
      <yhSelect :value="personData.isHadChildren"
                :code-values="codeValues.SHIFOUColumns"
                :required="false"
                @input="(v)=> personData.isHadChildren = v"
                label="是否多子女家庭"/>
      <yhSelect :value="personData.isHighTalent"
                :code-values="codeValues.SHIFOUColumns"
                :required="false"
                @input="(v)=> personData.isHighTalent = v"
                label="是否高层次人才家庭"/>
      <yhSelect :value="personData.isSupport"
                :code-values="codeValues.SHIFOUColumns"
                :required="false"
                @input="(v)=> personData.isSupport = v"
                label="是否赡养异地老人"/>
  <!--    <yhSelect :value="personData.yck"
                :code-values="codeValues.RCLXColumns"
                v-if="personData.glgx !== '71'"
                :required="personData.glgx !== '71'"
                @input="(v)=> personData.yck = v"
                label="人才类型"/> -->
      <yhSelect :value="personData.minzu"
                :code-values="codeValues.MINZUColumns"
                :required="true"
                @input="(v)=> personData.minzu = v"
                label="民族"/>
      <yhSelect :value="personData.guoji"
                :code-values="codeValues.GUOJIColumns"
                :required="true"
                @input="(v)=> personData.guoji = v"
                label="国籍"/>
      <van-field label="邮政编码" v-model="personData.yzbm" input-align="right" type="digit" placeholder="请填写邮政编码"
                 maxlength="6" :rules="[{required: true,}]" required/>
      <van-field label="联系电话" v-model="personData.sjhm" input-align="right" :rules="[{required: true,}]" required
                 placeholder="请填写联系电话"/>
      <van-field label="户籍所在地" v-model="personData.hjszd" input-align="right"
                 :rules="[{required: true,}]" required placeholder="请填写户籍所在地"/>
      <van-field label="通讯地址" v-model="personData.txdz" input-align="right" :rules="[{required: true,}]" required
                 placeholder="请填写通讯地址"/>
    </van-cell-group>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import yhSelect from '../../../parts/common/yhSelect.vue'

export default {
  name: 'borrowerInfo',
  components: {yhSelect},
  // relShips: 关联关系
  props: {
    relShips: {
      type: Number,
      default: 0
    },
    updateMark: {
      type: String
    },
	personData:{

	}
  },
  data() {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      varyglgx: '01',
      varycdgx:'01',
      qrFailTime: '',
      qrCodeText: '',
      timer: {
        querysjhmUploadTimer: null,
        qrFailTimeTimer: null,
      },
      issjhmUpload: false,
      isClickable: false,
      showCodeValueFrame: false,
      codeValueList: [],
      codeValueParam: '',
      showProvincesSelFrame: false,
      options: [],
      LPSSQYColumns: [],
      GLGXColumns: [],
      GLDXColumns: [{label: '本人', value: '01'}],
      CDGXColumns: [],
      ZJLXColumns: [],
      XINGBIEColumns: [],
      SHIFOUColumns: [],
      YCKColumns: [],
      HYZKColumns: [],
      RYSFColumns: [],
      ZHIYEColumns: [],
      ZHICHENColumns: [],
      ZHIWUColumns: [],
      XUELIColumns: [],
      RCLXColumns: [],
      MINZUColumns: [],
      GUOJIColumns: [],
      noticeText:'英才卡：经市人力资源部门认定的一至四类高层次人才所发放的身份认定',
      showHyrqPicker: false,
      hyrqDate: new Date(),
      hyrqMaxDate: new Date(),
    }
  },
  computed: {
    ...mapState('perloanApply', ['codeValues', 'loanbuscode', 'fieldsToCheck','loanPerList', 'selectedHouseInfoRows']),
  },
  watch: {
    // 当 personData 整体被替换时，确保可选字段已初始化
    personData: {
      immediate: true,
      handler(val) {
        if (val && typeof val === 'object') {
          const optionalFields = ['isHadChildren', 'isHighTalent', 'isSupport', 'xuewei']
          optionalFields.forEach(f => {
            if (!(f in val)) this.$set(val, f, '')
          })
        }
      }
    },
    // 监视证件号码，设置性别和出生日期
    'personData.zjhm': {
      handler(idCard) {
        if (this.validateIDCardSimple(idCard)) {
          const birthYear = idCard.substr(6, 4);  // 提取年份
          const birthMonth = idCard.substr(10, 2); // 提取月份
          const csrq = idCard.substr(12, 2);  // 提取日期
          this.personData.csrq = `${birthYear}-${birthMonth}-${csrq}`;
          // 提取性别（第17位，奇数为男性，偶数为女性）
          const genderCode = idCard.substr(16, 1);
          this.personData.xingbieDesc = (genderCode % 2 === 1) ? "男" : "女";
          this.personData.xingbie = (genderCode % 2 === 1) ? "1" : "2";
        }
      }
    },

    'personData.xingbie': {
      handler(xingbie) {
        if (this.personData.cdgx === '02') {
          if (this.loanPerList[0]?.xingbie === xingbie) {
            this.$toast.fail('配偶性别不能相同')
            this.$set(this.personData, 'cdgx', '')
            return
          }
        }
      }
    },

    // 'personData.glgx': {
    //   handler(glgx) {
    //     if (this.relShips !== 0) {
    //       if (glgx === '02') {
    //         this.varycdgx = '02'
    //         this.$set(this.personData, 'cdgx', '02')
    //       } else if (glgx === '03' || glgx === '71') {
    //         this.varycdgx = '03,99'
    //       }
    //     }
    //   }
    // },

    'personData.cdgx': {
      handler(cdgx) {
        if(cdgx==='02'){
          if(this.loanPerList[0]?.xingbie === this.personData.xingbie){
            this.$toast.fail('配偶性别不能相同')
            this.$set(this.personData,'cdgx','')
            return
          }
          this.$set(this.personData,'hyzk','20')
        }
      }
    },

    'personData.hyrq': {
      immediate: true,
      handler(val) {
        if (val) {
          this.hyrqDate = new Date(val.replace(/-/g, '/'))
        }
      }
    },

    relShips(val) {
      if (val === 0) {
        this.varyglgx = "01"
        this.varycdgx = "01"
      } else {
        this.varyglgx = "02,03,71"
        this.varycdgx = "01,02,03,04,05,07,99"
      }
    },

    selectedHouseInfoRows: {
      handler(val) {
        if (val?.fzxjg && this.relShips === 0) {
          this.personData.fzxjg = val.fzxjg
        }
      },
      deep: true
    }

  },
  async mounted() {
    // 主借款人且personData没值才查询
    if (Object.keys(this.loanPerList).length === 0) {
      await this.initBorrowerInfo()
    }
  },
  methods: {
    ...mapActions('perloanApply', ['uriGetPerInfo', 'setAllCodeValue', 'setCodeValTypeParams2',
      'setCodeValTypeParams', 'setDepositInfoDisable', 'provincialMunicipalLinkage']),
    codeValueConfirm(codeValues) {
      this.setCodeValTypeParams({dataObj: this.personData, fieldName: this.codeValueParam, codeValues})
      this.showCodeValueFrame = false
    },
    // 初始化借款人信息
    async initBorrowerInfo() {
      //设置关联关系
      this.personData.glgx = '01'
      //设置关联对象
      this.personData.gldx = '01'
      //设置参贷关系
      this.personData.cdgx = '01'
      // 设置证件号码
      this.personData.zjhm = this.$user?.getUser()?.idCard
      // 设置姓名
      this.personData.xingming = this.$user?.getUser()?.userName
      // 设置证件类型
      this.personData.zjlx = this.$user?.getUser()?.idType
      this.personData.zjlxDesc = '身份证'
      // 设置房屋所属区域（从房屋信息已选数据中反显）
      if (this.selectedHouseInfoRows?.fzxjg) {
        this.personData.fzxjg = this.selectedHouseInfoRows.fzxjg
      }
      // 预初始化可选字段，确保 Vue 2 响应式（模板直接赋值依赖此初始化）
      const optionalFields = ['isHadChildren', 'isHighTalent', 'isSupport', 'xuewei']
      optionalFields.forEach(f => {
        if (!(f in this.personData)) this.$set(this.personData, f, '')
      })
      await this.getBorrowerInfo()
    },
    // 调用接口获取借款人授权信息
    async getBorrowerAuthInfo() {
      try {
        const {zjlx, zjhm, xingming, cdgx, glgx,} = this.personData
        if (!this.validateIDCardSimple(zjhm)) {
          return
        }
        if (zjlx && zjhm && xingming && cdgx && glgx) {
          await this.getBorrowerInfo()
        }
      } catch (e) {
        this.personData.zjhm = ''
        this.$toast(e)
        return
      }
    },
    // 调用接口获取借款人信息
    async getBorrowerInfo() {
      const {zjlx, zjhm, xingming, cdgx, glgx, gldx} = this.personData
      if (!this.validateIDCardSimple(zjhm)) {
        return
      }
      if (zjlx && zjhm && xingming && cdgx && glgx && gldx) {
        const formData = {...this.commonBizApply}
        formData.zjhm = zjhm
        formData.zjlx = zjlx
        formData.cdgx = cdgx
        formData.glgx = glgx
        formData.gldx = gldx
        formData.xingming = xingming
        formData.dkywh = this.dkywh
        try {
          let response = await this.uriGetPerInfo(formData);
          const respData = response?.data || response;
          for (const fieldName in respData) {
            if (this.fieldsToCheck.includes(fieldName)) {
              if(respData[fieldName] != null && respData[fieldName] != '' && respData[fieldName] != undefined){
                this.$set(this.personData, fieldName, respData[fieldName]);
              }
            }
          }
          this.personData.relShips=this.relShips
          this.$set(this.personData, 'dwyjce',respData['dwyjce']);
          //个人缴存基数设置为个人月收入
          this.$set(this.personData, 'ysr',respData['ysr']);
        } catch (e) {
          this.$dialog.alert({message: e,}).then()
        }
      }
    },

    // 手机上传弹窗关闭按钮点击事件
    async closesjhmUpload() {
      this.stopQueryImg()
      this.issjhmUpload = false
      await this.getBorrowerInfo()
      //this.$router.push('/home')
    },
    async intervalQueryImg(time) {
      // 倒计时
      this.qrFailTime = Math.ceil(time / 1000)
      this.timer.qrFailTimeTimer = setInterval(() => {
        if (this.qrFailTime > 0) {
          this.qrFailTime--
        } else {
          this.qrFailTime = 0
          this.stopQueryImg()
        }
      }, 1000)
      // 定时查询
      this.timer.querysjhmUploadTimer = setInterval(async () => {
        const value = await this.selectMoreImg()
        if (value === '1') {
          this.stopQueryImg()
          this.issjhmUpload = false
          clearInterval(this.timer.querysjhmUploadTimer) // 停止定时查询
          this.$toast('授权成功')
          this.$emit('changeDeptype', '01,02,03')
          await this.getBorrowerInfo()
          //this.init()
        }
      }, 3000)
    },

    async selectMoreImg() {
      const {zjlx, zjhm, xingming,} = this.personData
      if (!this.validateIDCardSimple(zjhm)) {
        return
      }
      const formData = {...this.commonBizApply}
      formData.perzjhm = zjhm
      formData.zjlx = zjlx
      formData.xingming = xingming
      formData.binessScope = 'LOAN'
      // 查询到图片后跳转到上传图片
      const response = await isAuthInfo(formData).catch((error) => {
        this.$toast(error)
        this.timer.querysjhmUploadTimer && this.stopQueryImg()
        return false
      })
      const result = response.flag
      return result
    },

    stopQueryImg() {
      this.timer.querysjhmUploadTimer && clearInterval(this.timer.querysjhmUploadTimer)
      this.timer.qrFailTimeTimer && clearInterval(this.timer.qrFailTimeTimer)
      this.timer.querysjhmUploadTimer = null
      this.timer.qrFailTimeTimer = null
    },
    // 确认结婚日期
    confirmHyrq(val) {
      const y = val.getFullYear()
      const m = String(val.getMonth() + 1).padStart(2, '0')
      const d = String(val.getDate()).padStart(2, '0')
      this.personData.hyrq = `${y}-${m}-${d}`
      this.showHyrqPicker = false
    },
    // 身份证号校验
    validateIDCardSimple(val) {
      // 身份证号的正则表达式：18位数字，最后一位可以是数字或 X
      const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
      return regex.test(val);
    },
    // 打开省市联动框
    async openProvincesSelFrame() {
      const data = await this.provincialMunicipalLinkage({...this.commonBizApply})
      data.forEach(item => this.options.push({...item, children: []}))
      this.showProvincesSelFrame = true
    },
    onChange({value}) {
      for (const index in this.options) {
        if (value === this.options[index].value) {
          setTimeout(async () => {
            const data = await this.provincialMunicipalLinkage({...this.commonBizApply, pId: value})
            this.$set(this.options[index], 'children', data);
          }, 10);
        }
      }
    },
    onFinish({selectedOptions}) {
      this.personData.hjszd = selectedOptions.map((option) => option.text).join('');
      this.personData.province = selectedOptions[0]?.value
      this.personData.city = selectedOptions[1]?.value
      this.showProvincesSelFrame = false;
    },
  }
}
</script>
<style scoped lang="less">
.content {
  .title {
    font-size: 15px;
    font-weight: 600;
    color: #323233;
    margin: 16px 16px 12px;
    padding-left: 10px;
    border-left: 4px solid #1677ff;
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 22px;
  }
}

// 卡片式表单组
/deep/ .van-cell-group--inset {
  margin: 0 16px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>
