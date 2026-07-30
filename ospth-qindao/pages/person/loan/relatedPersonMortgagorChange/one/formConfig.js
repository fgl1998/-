// 使用工厂函数，确保每个组件实例有独立的配置副本（支持运行时修改 readonly）
export default function createFormConfig() {
  return {
    // ── 贷款信息（只读反显） ──────────────────────────────
    loanInfoFields: [
      { name: 'jkhtbh',    label: '借款合同号',        type: 'input', required: false, readonly: true, events: {} },
      { name: 'zjhm',      label: '借款人证件号码',    type: 'input', required: false, readonly: true, events: {} },
      { name: 'jkrxm',     label: '借款人姓名',        type: 'input', required: false, readonly: true, events: {} },
      { name: 'dkje',      label: '贷款金额(元)',      type: 'input', required: false, readonly: true, events: {} },
      { name: 'sysdkje',   label: '商业贷款金额(元)',  type: 'input', required: false, readonly: true, events: {} },
      { name: 'fwlx',      label: '房屋类型',          type: 'input', required: false, readonly: true, events: {} },
      { name: 'fzrq',      label: '发证日期',          type: 'input', required: false, readonly: true, events: {} },
      { name: 'ybdcdjzmh', label: '原不动产登记证明号', type: 'input', required: false, readonly: true, events: {} },
      { name: 'dywdz',     label: '抵押物地址',        type: 'input', required: false, readonly: true, events: {} },
    ],

    // ── 新增关联人录入字段（分节） ─────────────────────────
    sections: [
      {
        title: '参贷信息',
        fields: [
          { name: 'np_cdgx', label: '参贷关系', type: 'select', required: true, readonly: false,
            options: [{ label: '共同还款人', value: '03' }, { label: '未参贷（配偶）', value: '04' }], events: {} },
          { name: 'np_glgx', label: '家庭关系', type: 'select', required: true, readonly: false, codeType: 'GLGX', events: {} },
        ],
      },
      {
        title: '基本信息',
        fields: [
          { name: 'np_zjlx',    label: '证件类型',   type: 'select', required: true,  readonly: false, codeType: 'GRZJLX', events: {} },
          { name: 'np_zjhm',    label: '证件号码',   type: 'input',  required: true,  readonly: false, events: {} },
          { name: 'np_xingming',label: '客户姓名',   type: 'input',  required: true,  readonly: false, events: {} },
          { name: 'np_xingbie', label: '性别',       type: 'select', required: false, readonly: false, codeType: 'XINGBIE', events: {} },
          { name: 'np_csrq',    label: '出生日期',   type: 'date',   required: false, readonly: false, events: {} },
          { name: 'np_hyzk',    label: '婚姻状况',   type: 'select', required: true,  readonly: false, codeType: 'HYZK', events: {} },
          { name: 'np_jhrq',    label: '结婚日期',   type: 'date',   required: false, readonly: false,
            if: (fd) => fd.np_hyzk === '10', events: {} },
          { name: 'np_rysf',    label: '人员身份',   type: 'select', required: false, readonly: false, codeType: 'RYSF', events: {} },
          { name: 'np_zhiye',   label: '职业',       type: 'select', required: false, readonly: false, codeType: 'ZHIYE', events: {} },
          { name: 'np_zhichen', label: '职称',       type: 'select', required: false, readonly: false, codeType: 'ZHICHEN', events: {} },
          { name: 'np_zhiwu',   label: '职务',       type: 'select', required: false, readonly: false, codeType: 'ZHIWU', events: {} },
          { name: 'np_xueli',   label: '学历',       type: 'select', required: false, readonly: false, codeType: 'XUELI', events: {} },
          { name: 'np_minzu',   label: '民族',       type: 'select', required: false, readonly: false, codeType: 'MINZU', events: {} },
          { name: 'np_guoji',   label: '国籍',       type: 'select', required: false, readonly: false, codeType: 'GUOJI', events: {} },
          { name: 'np_yzbm',    label: '邮政编码',   type: 'input',  required: false, readonly: false, events: {} },
          { name: 'np_sjhm',    label: '手机号码',   type: 'input',  required: true,  readonly: false, events: {} },
          { name: 'np_gdsh',    label: '固定电话',   type: 'input',  required: false, readonly: false, events: {} },
          { name: 'np_jtznrs',  label: '家庭子女数', type: 'input',  required: false, readonly: false, events: {} },
          { name: 'np_jtdz',    label: '家庭住址',   type: 'input',  required: false, readonly: false, events: {} },
        ],
      },
      {
        title: '缴存信息',
        fields: [
          { name: 'np_dkjchlx',    label: '缴存类型',          type: 'select', required: false, readonly: true,  codeType: 'DKJCHLX', events: {} },
          { name: 'np_grzhzt',     label: '个人账户状态',      type: 'input',  required: false, readonly: true,  events: {} },
          { name: 'np_grzh',       label: '个人账号',          type: 'input',  required: false, readonly: true,  events: {} },
          { name: 'np_jczhmc',     label: '缴存中心名称',      type: 'input',  required: false, readonly: true,  events: {} },
          // 缴存户才显示，灵活就业隐藏
          { name: 'np_grjcjs',     label: '个人缴存基数(元)',  type: 'input',  required: false, readonly: false,
            if: (fd) => fd.np_dkjchlx !== '02', events: {} },
          { name: 'np_grjcbl',     label: '个人缴存比例(%)',   type: 'input',  required: false, readonly: false,
            if: (fd) => fd.np_dkjchlx !== '02', events: {} },
          { name: 'np_dwjcbl',     label: '单位缴存比例(%)',   type: 'input',  required: false, readonly: false,
            if: (fd) => fd.np_dkjchlx !== '02', events: {} },
          { name: 'np_gryjce',     label: '个人月缴存额(元)',  type: 'input',  required: false, readonly: false,
            if: (fd) => fd.np_dkjchlx !== '02', events: {} },
          { name: 'np_dwyjce',     label: '单位月缴存额(元)',  type: 'input',  required: false, readonly: false,
            if: (fd) => fd.np_dkjchlx !== '02', events: {} },
          { name: 'np_ysr',        label: '个人月收入(元)',    type: 'input',  required: false, readonly: false,
            if: (fd) => fd.np_dkjchlx !== '02', events: {} },
          { name: 'np_khrq',       label: '开户日期',          type: 'date',   required: false, readonly: false, events: {} },
          { name: 'np_qsny',       label: '缴存起始年月',      type: 'input',  required: false, readonly: false, events: {} },
          { name: 'np_jzny',       label: '缴至年月',          type: 'input',  required: false, readonly: false, events: {} },
          { name: 'np_lxjcys',     label: '连续缴存月数',      type: 'input',  required: false, readonly: true,  events: {} },
          { name: 'np_zjlxjcqsny', label: '最近连续缴存起始年月', type: 'input', required: false, readonly: false, events: {} },
        ],
      },
      {
        title: '单位信息',
        fields: [
          { name: 'np_dwmc', label: '单位名称', type: 'input', required: false, readonly: false, events: {} },
          { name: 'np_dwdz', label: '单位地址', type: 'input', required: false, readonly: false, events: {} },
        ],
      },
    ],
  }
}
