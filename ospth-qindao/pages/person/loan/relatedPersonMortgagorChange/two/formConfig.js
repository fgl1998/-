export default function createFormConfig() {
  return {
    // ── 变更信息字段 ───────────────────────────────────────
    fields: [
      { name: 'bgyy', label: '变更原因', type: 'select', required: true, readonly: false,
        options: [{ label: '离婚', value: '01' }, { label: '死亡', value: '02' }, { label: '其他', value: '03' }], events: {} },
      { name: 'sfbgdyxx', label: '是否变更抵押信息', type: 'select', required: true, readonly: false,
        options: [{ label: '是', value: '1' }, { label: '否', value: '0' }], events: {} },
      // 条件：变更抵押信息
      { name: 'dylb',      label: '抵押类别',         type: 'select', required: true, readonly: false,
        options: [{ label: '预抵押', value: '01' }, { label: '抵押', value: '02' }],
        if: (fd) => fd.sfbgdyxx === '1', events: {} },
      { name: 'dyfzjg',    label: '抵押发证机构',     type: 'input', required: true, readonly: false,
        if: (fd) => fd.sfbgdyxx === '1', events: {} },
      { name: 'bdcdjzmh',  label: '不动产登记证明号', type: 'input', required: true, readonly: false,
        if: (fd) => fd.sfbgdyxx === '1', events: {} },
      { name: 'dyqlsj',    label: '抵押权建立时间',   type: 'date',  required: true, readonly: false,
        if: (fd) => fd.sfbgdyxx === '1', events: {} },
      { name: 'sfbghkk',   label: '是否变更还款卡',   type: 'select', required: true, readonly: false,
        options: [{ label: '是', value: '1' }, { label: '否', value: '0' }], events: {} },
      // 条件：变更还款卡
      { name: 'xhkzh',     label: '新还款卡号',       type: 'input', required: true, readonly: false,
        if: (fd) => fd.sfbghkk === '1', events: {} },
      { name: 'xhkyh',     label: '开户银行',         type: 'input', required: true, readonly: false,
        if: (fd) => fd.sfbghkk === '1', events: {} },
    ],

    // ── 抵押人内联录入字段（新增一行时渲染） ──────────────
    mortgagorRowFields: [
      { name: 'add_zjlx',    label: '证件类型',   codeType: 'GRZJLX' },
      { name: 'add_zjhm',    label: '证件号码',   required: true },
      { name: 'add_xingming',label: '姓名',       required: true },
      { name: 'add_csrq',    label: '出生日期' },
      { name: 'add_sjhm',    label: '手机号码' },
      { name: 'add_gyfs',    label: '共有方式',
        options: [{ label: '单独所有', value: '01' }, { label: '共同共有', value: '02' }, { label: '按份共有', value: '03' }] },
      { name: 'add_gydbl',   label: '共有比例(%)' },
      { name: 'add_dywfwzl', label: '抵押物坐落',  required: true },
      { name: 'add_fwjzmj',  label: '建筑面积(㎡)' },
      { name: 'add_fwtnmj',  label: '套内面积(㎡)' },
    ],
  }
}
