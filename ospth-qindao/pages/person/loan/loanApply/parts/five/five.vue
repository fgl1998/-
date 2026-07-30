<template>
  <div class="step_container">
    <!-- 选择抵押人弹窗 -->
    <van-popup
      v-model="mortPersonModal"
      position="bottom"
      :style="{ height: '70%' }"
      round
      closeable
      close-icon-position="top-right"
    >
      <div class="popup-header">选择抵押人</div>
      <van-checkbox-group v-model="selectedMortPersons">
        <div class="checkbox-card" v-for="(item, index) in loanPerList" :key="index">
          <van-checkbox :name="item">
            <div class="checkbox-row"><span class="l">姓名</span><span class="r">{{ item.xingming || '--' }}</span></div>
            <div class="checkbox-row"><span class="l">证件类型</span><span class="r">{{ item.zjlx === '01' ? '居民身份证' : item.zjlx || '--' }}</span></div>
            <div class="checkbox-row"><span class="l">证件号码</span><span class="r">{{ item.zjhm || '--' }}</span></div>
            <div class="checkbox-row"><span class="l">手机号码</span><span class="r">{{ item.sjhm || '--' }}</span></div>
          </van-checkbox>
        </div>
      </van-checkbox-group>
      <van-empty v-if="!loanPerList.length" description="暂无贷款关联人信息" />
      <div class="popup-btn-bar">
        <van-button round block @click="mortPersonModal = false">取消</van-button>
        <van-button round block type="warning" @click="confirmMortPerson">确认选择</van-button>
      </div>
    </van-popup>

    <!-- 抵押物类型选择器 -->
    <van-popup v-model="showPick" position="bottom" :close-on-click-overlay="false">
      <van-picker show-toolbar value-key="label" :columns="codeValues.DYWLXColumns"
        @confirm="onPickConfirm" @cancel="showPick = false" />
    </van-popup>

    <div class="content">
      <van-form validate-first ref="inputForm">
        <h1 class="title"><van-icon name="shield-o" /> 抵押信息</h1>

        <!-- 抵押物类型 -->
        <van-field label="抵押物类型" v-model="mortData.gddywlxDesc" input-align="right"
          readonly is-link required :rules="[{required: true}]"
          placeholder="请选择抵押物类型" @click="showPick = true" />

        <!-- 抵押人姓名：点击弹出关联人选择 -->
        <van-field label="抵押人姓名" v-model="mortData.dyrxm" input-align="right"
          readonly is-link required :rules="[{required: true, message: '请选择抵押人'}]"
          placeholder="点击选择贷款关联人" @click="openMortPersonModal" />

        <!-- 房屋信息 -->
        <van-field label="房屋套内面积(㎡)" v-model="mortData.fwtnmj" input-align="right"
          type="number" :rules="[{required: true}]" placeholder="请填写房屋套内面积" />
        <van-field label="房屋建筑面积(㎡)" v-model="mortData.fwjzmj" input-align="right"
          type="number" :rules="[{required: true}]" placeholder="请填写房屋建筑面积" />
        <van-field label="抵押物评估价值" v-model="mortData.dywpgjz" input-align="right"
          type="number" :rules="[{required: true}]" placeholder="请填写评估价值" />
        <van-field label="产权年限" v-model="mortData.cqnx" input-align="right"
          type="number" placeholder="请填写产权年限" />
        <van-field label="抵押物房屋坐落" v-model="mortData.dywfwzl" input-align="right"
          :rules="[{required: true}]" placeholder="请填写房屋坐落" />
      </van-form>

      <!-- 已选择抵押人 -->
      <div class="list-section" v-if="selectedMortPersons.length">
        <p class="moment_text">已选择抵押人（{{ selectedMortPersons.length }}人）</p>
        <div class="shadow-box" v-for="(item, index) in selectedMortPersons" :key="'mortPer' + index">
          <div class="box-cell"><div class="l">抵押人姓名</div><div class="r">{{ item.xingming || '--' }}</div></div>
          <div class="box-cell"><div class="l">证件类型</div><div class="r">{{ item.zjlx === '01' ? '居民身份证' : item.zjlx || '--' }}</div></div>
          <div class="box-cell"><div class="l">证件号码</div><div class="r">{{ item.zjhm || '--' }}</div></div>
          <div class="box-cell"><div class="l">手机号码</div><div class="r">{{ item.sjhm || '--' }}</div></div>
        </div>
      </div>

      <!-- 已保存抵押物信息 -->
      <div class="list-section" v-if="loanMortList.length">
        <p class="moment_text">已保存抵押物信息</p>
        <div class="shadow-box" v-for="(item, index) in loanMortList" :key="'mortHouse' + index">
          <div class="box-cell"><div class="l">担保合同编号</div><div class="r">{{ item.dbhtbh || '--' }}</div></div>
          <div class="box-cell"><div class="l">抵押物类型</div><div class="r">{{ item.gddywlx === '01' ? '本房抵押' : item.gddywlx === '02' ? '他房抵押' : '--' }}</div></div>
          <div class="box-cell"><div class="l">抵押人姓名</div><div class="r">{{ item.dyrxm || '--' }}</div></div>
          <div class="box-cell"><div class="l">抵押物房屋坐落</div><div class="r">{{ item.dywfwzl || '--' }}</div></div>
          <div class="box-cell"><div class="l">抵押物评估价值</div><div class="r">{{ item.dywpgjz ? item.dywpgjz + '元' : '--' }}</div></div>
          <div class="box-cell"><div class="l">产权年限</div><div class="r">{{ item.cqnx ? item.cqnx + '年' : '--' }}</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'loanApplyMortInfo',
  data() {
    return {
      showPick: false,
      mortPersonModal: false,
      selectedMortPersons: [],
      mortData: {
        gddywlx: '01',
        gddywlxDesc: '',
        dyrxm: '',
        glrywlsh: '',
        fwtnmj: '',
        fwjzmj: '',
        dywpgjz: '',
        cqnx: '',
        dywfwzl: '',
      },
    }
  },
  computed: {
    ...mapState('perloanApply', [
      'dkywh', 'loanPerList', 'shareHouseInfo', 'shareBaseInfo',
      'loanMortList', 'codeValues',
    ]),
  },
  async mounted() {
    await this.init()
  },
  methods: {
    ...mapActions('perloanApply', [
      'uriForSaveMortgageInfo', 'uriForQueryeMortInfo',
    ]),

    async init() {
      // 抵押物类型默认本房抵押
      const dywlxItem = (this.codeValues.DYWLXColumns || []).find(v => v.value === '01')
      this.mortData.gddywlx = '01'
      this.mortData.gddywlxDesc = dywlxItem ? dywlxItem.label : '本房抵押'

      // 从房屋信息自动填充（套内面积、建筑面积、评估价值、产权年限、房屋坐落）
      this.autoFillHouseFields()

      // 查询已保存的抵押信息（如有则覆盖上述默认值）
      await this.getLoanMortInfo()
    },

    onPickConfirm(item) {
      this.mortData.gddywlx = item.value
      this.mortData.gddywlxDesc = item.label
      this.showPick = false
      if (item.value === '01') {
        this.autoFillHouseFields()
      } else {
        this.mortData.fwtnmj = ''
        this.mortData.fwjzmj = ''
        this.mortData.dywpgjz = ''
        this.mortData.cqnx = ''
        this.mortData.dywfwzl = ''
      }
    },

    autoFillHouseFields() {
      const house = this.shareHouseInfo || {}
      this.mortData.fwtnmj = house.fwtnmj || ''
      this.mortData.fwjzmj = house.fwjzmj || ''
      this.mortData.dywpgjz = house.gffwzj || house.fwzj || ''
      this.mortData.cqnx = house.cqnx || ''
      this.mortData.dywfwzl = house.fwzl || ''
    },

    // 打开抵押人选择弹窗
    openMortPersonModal() {
      if (!this.loanPerList || !this.loanPerList.length) {
        this.$toast('暂无可选的贷款关联人，请先在步骤1添加')
        return
      }
      this.mortPersonModal = true
    },

    // 确认选择抵押人
    confirmMortPerson() {
      if (!this.selectedMortPersons.length) {
        this.$toast('请至少选择一位抵押人')
        return
      }
      const names = this.selectedMortPersons.map(p => p.xingming || '').filter(Boolean)
      const ids = this.selectedMortPersons.map(p => p.glrywlsh || '').filter(Boolean)
      this.mortData.dyrxm = names.join('、')
      this.mortData.glrywlsh = ids.join(',')
      this.mortPersonModal = false
    },

    // 查询已保存抵押物信息
    async getLoanMortInfo() {
      try {
        await this.uriForQueryeMortInfo({ dkywh: this.dkywh })
      } catch {
        // 查询失败不影响继续操作
      }
      // 如果有已保存的抵押记录，回填表单并预选抵押人
      if (this.loanMortList && this.loanMortList.length) {
        const saved = this.loanMortList[0]
        this.mortData.gddywlx = saved.gddywlx || '01'
        this.mortData.gddywlxDesc = saved.gddywlx === '01' ? '本房抵押' : saved.gddywlx === '02' ? '他房抵押' : ''
        this.mortData.dyrxm = saved.dyrxm || ''
        this.mortData.fwtnmj = saved.fwtnmj || ''
        this.mortData.fwjzmj = saved.fwjzmj || ''
        this.mortData.dywpgjz = saved.dywpgjz || ''
        this.mortData.cqnx = saved.cqnx || ''
        this.mortData.dywfwzl = saved.dywfwzl || ''

        // 回填已保存的抵押人选择
        if (saved.mortPer && saved.mortPer.length) {
          // 按 glrywlsh 匹配 loanPerList 中的关联人
          const idSet = new Set(saved.mortPer.map(p => p.glrywlsh).filter(Boolean))
          this.selectedMortPersons = this.loanPerList.filter(p => idSet.has(p.glrywlsh))
        }
      }
    },

    // 保存抵押信息
    async saveLoanMort() {
      try {
        await this.$refs.inputForm.validate()
      } catch {
        return
      }
      const formData = {
        ...this.mortData,
        dkywh: this.dkywh,
        dkdblx: this.shareBaseInfo?.dkdblx || '01',
        mortPerList: this.selectedMortPersons.length
          ? this.selectedMortPersons
          : (this.loanMortList[0]?.mortPer || []),
      }
      try {
        await this.uriForSaveMortgageInfo(formData)
        this.$toast.success('抵押信息保存成功')
      } catch (err) {
        this.$toast(err)
      }
    },

    async formValidate() {
      try {
        await this.$refs.inputForm.validate()
        return true
      } catch {
        return false
      }
    },

    async beforeNext() {
      try {
        await this.saveLoanMort()
        return true
      } catch (err) {
        this.$toast(err)
        return false
      }
    },
  },
}
</script>

<style scoped lang="less">
.step_container {
  padding-bottom: 20px;
}

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

/deep/ .van-cell-group--inset {
  margin: 0 16px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/deep/ .van-field__label {
  min-width: 7rem;
}

// 弹窗头部
.popup-header {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 0;
}

// 弹窗复选框卡片
.checkbox-card {
  padding: 8px 16px;
  margin: 0 12px 8px;
  background: #f7f8fa;
  border-radius: 8px;

  /deep/ .van-checkbox__label {
    flex: 1;
    margin-left: 8px;
  }
  .checkbox-row {
    display: flex;
    line-height: 26px;
    font-size: 14px;
    .l { width: 80px; flex-shrink: 0; color: #969799; }
    .r { flex: 1; text-align: right; color: #323233; }
  }
}

// 弹窗底部按钮
.popup-btn-bar {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  .van-button { flex: 1; }
}

// 列表区域
.list-section {
  margin-top: 8px;
}

.moment_text {
  font-size: 14px;
  color: #666;
  margin: 12px 16px 8px;
}

.shadow-box {
  width: calc(100% - 32px);
  margin: auto auto 12px;
  background: #fff;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  .box-cell {
    line-height: 30px;
    display: flex;
    .l { width: 8rem; color: #969799; }
    .r {
      width: calc(100% - 8rem);
      text-align: right;
      color: #323233;
      padding-left: 10px;
    }
  }
}
</style>
