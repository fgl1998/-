import createFormConfig from './formConfig'
import { mapActions, mapMutations, mapState } from 'vuex'

const CDGX_MAP = { '01': '借款人', '02': '共同借款人', '03': '共同还款人', '04': '未参贷（配偶）' }
// 参数控制（实际可从系统参数接口获取）
const ENABLE_CO_REPAYOR  = true  // 是否启用共同还款人
const ENABLE_CO_BORROWER = true  // 是否启用共同借款人删除

export default {
  data() {
    return {
      formConfig: createFormConfig(),
      loanFormData: {},      // 贷款信息（只读反显）
      formData: {},          // 新增关联人表单数据
      relatedPersonList: [], // 当前关联人列表
      deletePersonIds: [],   // 待删除的关联人 ID
      addPersonList: [],     // 本次新增关联人
      showAddForm: false,    // 是否展开新增表单
      enableCoRepayor:  ENABLE_CO_REPAYOR,
      enableCoBorrower: ENABLE_CO_BORROWER,
    }
  },
  computed: {
    ...mapState('relatedPersonMortgagorChange', ['ywdjh']),
    borrowerInfo() {
      return this.relatedPersonList.find(p => p.cdgx === '01') || {}
    },
  },
  created() {
    const loanInit = {}
    this.formConfig.loanInfoFields.forEach(f => { loanInit[f.name] = '' })
    this.loanFormData = loanInit
    this._resetNpForm()
  },
  async mounted() {
    await Promise.all([this.loadLoanInfo(), this.loadRelatedPersons()])
  },
  watch: {
    // 特别说明4：输入身份证号，触发后台查询
    'formData.np_zjhm'(val) {
      if (val && val.length >= 15) this._checkIdentity(val)
    },
  },
  methods: {
    ...mapActions('relatedPersonMortgagorChange', [
      'uriForQueryLoanInfo',
      'uriForQueryRelatedPersons',
      'uriForCheckIdentity',
      'uriForSaveRelatedPersonChange',
    ]),
    ...mapMutations('relatedPersonMortgagorChange', ['SET_RELATED_PERSON_CHANGE']),

    // ── 数据加载 ──────────────────────────────────────────
    async loadLoanInfo() {
      try {
        const info = await this.uriForQueryLoanInfo({})
        if (!info) return
        const newData = {}
        this.formConfig.loanInfoFields.forEach(f => { newData[f.name] = info[f.name] !== undefined ? info[f.name] : '' })
        this.loanFormData = newData
      } catch (e) {
        uni.showToast({ title: (e && e.message) || '获取贷款信息失败', icon: 'none' })
      }
    },
    async loadRelatedPersons() {
      try {
        const list = await this.uriForQueryRelatedPersons({})
        this.relatedPersonList = list || []
      } catch (e) {
        uni.showToast({ title: (e && e.message) || '获取关联人信息失败', icon: 'none' })
      }
    },

    // 特别说明4：身份证号查询身份，能查到则为本地缴存户，反显只读
    async _checkIdentity(zjhm) {
      try {
        const info = await this.uriForCheckIdentity({ zjhm })
        if (info && info.grzh) {
          // 反显基本+缴存信息
          this.formData = {
            ...this.formData,
            np_xingming:      info.xingming      || this.formData.np_xingming,
            np_xingbie:       info.xingbie       || this.formData.np_xingbie,
            np_csrq:          info.csrq          || this.formData.np_csrq,
            np_dkjchlx:       info.dkjchlx       || '',
            np_grzhzt:        info.grzhzt        || '',
            np_grzh:          info.grzh          || '',
            np_jczhmc:        info.jczhmc        || '',
            np_grjcjs:        info.grjcjs        || '',
            np_grjcbl:        info.grjcbl        || '',
            np_dwjcbl:        info.dwjcbl        || '',
            np_gryjce:        info.gryjce        || '',
            np_dwyjce:        info.dwyjce        || '',
            np_ysr:           info.ysr           || '',
            np_khrq:          info.khrq          || '',
            np_qsny:          info.qsny          || '',
            np_jzny:          info.jzny          || '',
            np_lxjcys:        info.lxjcys        || '',
            np_zjlxjcqsny:    info.zjlxjcqsny    || '',
            np_dwmc:          info.dwmc          || '',
            np_dwdz:          info.dwdz          || '',
          }
          // 缴存信息字段设为只读（Vue 2 响应式更新）
          const depositSection = this.formConfig.sections.find(s => s.title === '缴存信息')
          if (depositSection) {
            depositSection.fields.forEach(field => { this.$set(field, 'readonly', true) })
          }
          uni.showToast({ title: '本地缴存户，已反显缴存信息', icon: 'success' })
        }
      } catch (_) {
        // 未查到：允许手动录入，不报错
      }
    },

    // ── 关联人列表操作 ────────────────────────────────────
    getCdgxLabel(cdgx) { return CDGX_MAP[cdgx] || cdgx },

    canDelete(person) {
      if (person.cdgx === '01') return false
      if (person.cdgx === '02' && !this.enableCoBorrower) return false
      if (person.cdgx === '03' && !this.enableCoRepayor)  return false
      return true
    },

    toggleDelete(person) {
      const idx = this.deletePersonIds.indexOf(person.id)
      if (idx > -1) this.deletePersonIds.splice(idx, 1)
      else           this.deletePersonIds.push(person.id)
    },

    isDeleted(person) { return this.deletePersonIds.includes(person.id) },

    // ── 新增关联人 ────────────────────────────────────────
    async addPerson() {
      // 逐节校验
      for (let i = 0; i < this.formConfig.sections.length; i++) {
        const ref = this.$refs['npForm_' + i]
        const formRef = Array.isArray(ref) ? ref[0] : ref
        if (formRef) {
          try { await formRef.validate() } catch (e) { return }
        }
      }
      if (this.formData.np_cdgx === '03' && !this.enableCoRepayor) {
        uni.showToast({ title: '当前参数不允许新增共同还款人', icon: 'none' }); return
      }
      this.addPersonList.push({ ...this.formData })
      this._resetNpForm()
      this.showAddForm = false
    },

    removeAdded(index) { this.addPersonList.splice(index, 1) },

    _resetNpForm() {
      const init = {}
      this.formConfig.sections.forEach(section => {
        section.fields.forEach(f => { init[f.name] = '' })
        // 重置缴存字段为可编辑
        if (section.title === '缴存信息') {
          section.fields.forEach(f => { this.$set(f, 'readonly', false) })
        }
      })
      this.formData = init
    },

    // ── beforeNext（规则7/8，规则16在 two.vue 汇总校验） ──
    async beforeNext() {
      // 关联人可以不操作，允许直接进入下一步（两步都无操作时由 two.vue 统一提示）
      // 规则7：已婚需有配偶（仅提醒）
      const borrower = this.relatedPersonList.find(p => p.cdgx === '01')
      if (borrower && borrower.hyzk === '10') {
        const hasSpouse = this.relatedPersonList.some(p => p.cdgx === '04' && !this.deletePersonIds.includes(p.id))
                       || this.addPersonList.some(p => p.np_cdgx === '04')
        if (!hasSpouse) {
          const go = await new Promise(r => uni.showModal({
            title: '温馨提示', content: '借款人已婚，建议录入配偶（未参贷）信息',
            confirmText: '继续提交', cancelText: '返回修改', success: res => r(res.confirm) }))
          if (!go) return false
        }
      }
      // 规则8：未婚/离异不应保留配偶（仅提醒）
      const isNotMarried = borrower && (borrower.hyzk === '20' || borrower.hyzk === '30')
      if (isNotMarried) {
        const keepSpouse = this.relatedPersonList.some(p => p.cdgx === '04' && !this.deletePersonIds.includes(p.id))
        if (keepSpouse) {
          const go = await new Promise(r => uni.showModal({
            title: '温馨提示', content: '借款人未婚/离异，建议从列表删除配偶信息',
            confirmText: '继续提交', cancelText: '返回修改', success: res => r(res.confirm) }))
          if (!go) return false
        }
      }
      try {
        // 有变更才调保存接口，无变更直接存空数据透传到 two.vue
        if (this.deletePersonIds.length > 0 || this.addPersonList.length > 0) {
          await this.uriForSaveRelatedPersonChange({ deletePersonIds: this.deletePersonIds, addPersonList: this.addPersonList })
        }
        this.SET_RELATED_PERSON_CHANGE({ deletePersonIds: this.deletePersonIds, addPersonList: this.addPersonList })
        return true
      } catch (e) {
        uni.showToast({ title: (e && e.message) || '保存失败', icon: 'none' }); return false
      }
    },
  },
}
