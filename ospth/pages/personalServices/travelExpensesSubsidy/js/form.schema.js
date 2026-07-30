export const schema = [
  {
    type: 'section',
    title: '个人基本信息',
  },
  {
    prop: 'year',
    label: '申报年度',
    type: 'date',
    defaultValue: '',
    placeholder: '请选择申报年度',
    picker: 'year',
    format: 'YYYY',
    required: true,
    // onChange: 'yearChange',
    // disabled: true,
    on: {
      change: 'yearChange',
      blur: 'yearBlur',
      focus: 'yearFocus',
      confirm: 'yearConfirm',
    },
  },

  // // ================= 基本信息 =================
  {
    prop: 'yac002',
    label: '证件号码',
    type: 'input',
    disabled: true,
  },
  {
    prop: 'aac003',
    label: '个人姓名',
    type: 'input',
    disabled: true,
  },

  {
    prop: 'aac058',
    label: '证件类型',
    type: 'mini-picker',
    codeType: 'AAC058',
    disabled: true,
  },
  {
    prop: 'aac004',
    label: '人员性别',
    type: 'mini-picker',
    codeType: 'AAC004',
    disabled: true,
  },
  {
    prop: 'aac005',
    label: '人员民族',
    type: 'mini-picker',
    codeType: 'AAC005',
    disabled: true,
  },

  {
    prop: 'aac006',
    label: '出生日期',
    type: 'date',
    disabled: true,
  },

  // // ================= 联系方式 =================
  {
    prop: 'aae005',
    label: '联系电话',
    type: 'input',
    required: true,
    disabled: true,
    requiredMessage: '请输入联系电话!',
    validator(value) {
      const mobileReg = /^1[3-9]\d{9}$/
      if (value && !mobileReg.test(value)) {
        return '输入的联系电话不合法'
      }
    },
  },
  {
    prop: 'aae006',
    label: '联系地址',
    type: 'input',
    required: true,
    requiredMessage: '请输入联系地址!',
    disabled: true,
  },

  // // ================= 人员类别 =================
  {
    prop: 'aac007',
    label: '人员类别',
    type: 'mini-picker',
    disabled: true,
    options: [
      { label: '脱贫人口', value: '1' },
      { label: '农牧民工', value: '2' },
    ],
  },

  // // ================= 补贴 / 银行 =================
  {
    prop: 'money',
    label: '补贴金额',
    type: 'input',
    disabled: true,
  },

  {
    prop: 'aaf200',
    label: '银行行别代码',
    type: 'mini-picker',
    codeType: 'BANKID',
    disabled: true,
  },

  {
    prop: 'aae044_desc',
    label: '开户行',
    type: 'input',
    disabled: true,
  },

  {
    prop: 'aae009',
    label: '银行账户名',
    type: 'input',
    disabled: true,
  },
  {
    prop: 'aae010',
    label: '银行账号',
    type: 'input',
    disabled: true,
  },

  // // ================= 就业信息 =================
  {
    prop: 'aac008',
    label: '年度内首次转移就业开始时间',
    type: 'date',
    labelWidth: 250,
    disabled: true,
  },
  {
    prop: 'aac009',
    label: '年度内转移就业累计天数',
    type: 'input',
    labelWidth: 250,
    disabled: true,
  },

  // // ================= 户籍地（树选择，自定义） =================
  // {
  //   prop: 'aae017',
  //   label: '户籍地',
  //   type: 'custom',
  //   slot: 'area',
  //   required: true,
  //   requiredMessage: '请选择户籍地!',
  // },
  {
    prop: 'aae017',
    label: '户籍地',
    type: 'address',
    required: true,
  },
]

export const schema2 = [
  {
    type: 'section',
    title: '转移信息录入',
  },

  {
    prop: 'aab004',
    label: '就业单位名称',
    type: 'custom',
    slot: 'miniSearchSelect',
    required: true,
  },
  {
    prop: 'aab998',
    label: '单位社会信用代码',
    type: 'input',
    disabled: true,
  },
  {
    prop: 'year',
    label: '申报年度',
    type: 'input',
    disabled: true,
  },
  {
    prop: 'aac009_c',
    label: '年度单位就业天数',
    type: 'input',
    disabled: true,
  },
  {
    prop: 'type',
    label: '转移方式',
    type: 'mini-picker',
    codeType: 'TRANSFER_TYPE',
  },
  {
    prop: 'start_date',
    label: '单位就业开始日期',
    type: 'date',
    required: true,
    on: {
      change: 'start_dateChange',
    },
  },
  {
    prop: 'end_date',
    label: '单位就业截止日期',
    type: 'date',
    required: true,
    on: {
      change: 'end_dateChange',
    },
  },
  {
    prop: 'ycc299',
    label: '工作地行政区划',
    type: 'custom',
    slot: 'miniAddress',
    required: true,
  },
  // {
  //   prop: 'aae017',
  //   label: '户籍地',
  //   type: 'custom',
  //   slot: 'area',
  //   required: true,
  //   requiredMessage: '请选择户籍地!',
  // },
]
