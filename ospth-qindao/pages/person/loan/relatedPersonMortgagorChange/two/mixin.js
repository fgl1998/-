import createFormConfig from './formConfig'
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      formConfig: createFormConfig(),
      formData: {},           // 变更信息表单
      mortgagorList: [],      // 当前抵押人（含 _deleted 标记）
      editingMortgagors: [],  // 特别说明5：内联新增行，每行独立数据对象
    }
  },
  computed: {
    ...mapState('relatedPersonMortgagorChange', ['ywdjh', 'relatedPersonChangeData']),
  },
  created() {
    const init = {}
    this.formConfig.fields.forEach(f => { init[f.name] = '' })
    init.sfbgdyxx = '0'
    init.sfbghkk  = '0'
    this.formData = init
  },
  async mounted() {
    await this.loadMortgagors()
  },
  methods: {
    ...mapActions('relatedPersonMortgagorChange', ['uriForQueryMortgagors', 'uriForSubmitChange']),

    async loadMortgagors() {
      try {
        const list = await this.uriForQueryMortgagors({})
        this.mortgagorList = (list || []).map(m => ({ ...m, _deleted: false }))
      } catch (e) {
        uni.showToast({ title: (e && e.message) || '获取抵押人信息失败', icon: 'none' })
      }
    },

    // 特别说明5：点击操作(删除) → 删掉该行
    toggleDeleteMortgagor(item) {
      if (item.isBorrower) {
        uni.showToast({ title: '借款人必须保留在抵押人中', icon: 'none' }); return
      }
      this.$set(item, '_deleted', !item._deleted)
    },

    // 特别说明5：点击"新增" → 在列表下方追加一行空白可编辑行
    addNewMortgagorRow() {
      const row = {}
      this.formConfig.mortgagorRowFields.forEach(f => { row[f.name] = '' })
      this.editingMortgagors.push(row)
    },

    removeEditingRow(index) { this.editingMortgagors.splice(index, 1) },

    // ── beforeNext（规则16/17/18/19） ─────────────────────
    async beforeNext() {
      // 校验变更信息
      try { await this.$refs.changeForm.validate() } catch (e) {
        uni.showToast({ title: '请填写完整变更信息', icon: 'none' }); return false
      }

      const deletedIds = this.mortgagorList.filter(m => m._deleted).map(m => m.id)
      const rpc = this.relatedPersonChangeData || {}
      const hasChange = deletedIds.length > 0 || this.editingMortgagors.length > 0
                     || (rpc.deletePersonIds && rpc.deletePersonIds.length > 0)
                     || (rpc.addPersonList   && rpc.addPersonList.length > 0)

      // 规则16
      if (!hasChange) {
        uni.showToast({ title: '请至少进行一项变更操作', icon: 'none' }); return false
      }

      // 规则19：未成年不允许
      for (const m of this.editingMortgagors) {
        if (m.add_csrq) {
          const age = Math.floor((Date.now() - new Date(m.add_csrq).getTime()) / (365.25 * 24 * 3600 * 1000))
          if (age < 18) {
            uni.showToast({ title: '抵押人中不能包含未成年人', icon: 'none' }); return false
          }
        }
      }

      // 规则17/18：借款人必须保留在最终抵押人中
      const borrowerStillIn = this.mortgagorList.some(m => m.isBorrower && !m._deleted)
      if (!borrowerStillIn) {
        uni.showToast({ title: '借款人必须保留在抵押人列表中', icon: 'none' }); return false
      }

      try {
        const result = await this.uriForSubmitChange({
          changeInfo:         { ...this.formData },
          deleteMortgagorIds: deletedIds,
          addMortgagorList:   this.editingMortgagors,
          ...(rpc),
        })
        // 规则6：离婚自动删除配偶提示
        if (this.formData.bgyy === '01') {
          uni.showModal({ title: '温馨提示', content: '变更原因为离婚，系统将自动删除家庭管理中的配偶信息', showCancel: false })
        }
        // 特别说明6：返回提交结果
        const seqNo = (result && result.data && result.data.busSequenceNo) || ''
        uni.showModal({ title: '提交成功', content: '业务流水号：' + seqNo, showCancel: false })
        return true
      } catch (e) {
        uni.showToast({ title: (e && e.message) || '提交失败', icon: 'none' }); return false
      }
    },
  },
}
