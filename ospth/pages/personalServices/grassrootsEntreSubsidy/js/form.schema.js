export const schema = [
  // ================= 创业者信息 =================
  {
    type: 'section',
    title: '创业者信息',
  },

  {
    prop: 'adc635',
    label: '创业者身份类型',
    type: 'mini-picker',
    codeType: 'ADC635',
    required: true,
    on: {
      change: 'adc635Change',
    },
  },
  {
    prop: 'aac003',
    label: '姓名',
    type: 'input',
    disabled: true,
    required: true,
  },
  {
    prop: 'yac002',
    label: '身份证号码',
    type: 'input',
    disabled: true,
    required: true,
  },
  {
    prop: 'aac004',
    label: '性别',
    type: 'mini-picker',
    codeType: 'AAC004',
    disabled: true,
    required: true,
  },
  {
    prop: 'aac005',
    label: '民族',
    type: 'mini-picker',
    codeType: 'AAC005',
    disabled: true,
    required: true,
  },
  {
    prop: 'yau002',
    label: '毕业院校',
    type: 'input',
    required: true,
  },
  {
    prop: 'aac183',
    label: '专业',
    type: 'mini-picker',
    codeType: 'AAC183',
    required: true,
  },
  {
    prop: 'aac181',
    label: '毕业时间',
    type: 'date',
    required: true,
  },
  {
    prop: 'aae005',
    label: '联系电话',
    type: 'input',
    required: true,
    validator(value) {
      const mobileReg = /^1[3-9]\d{9}$/
      if (value && !mobileReg.test(value)) {
        return '输入的联系电话不合法'
      }
    },
  },
  {
    prop: 'aaf200',
    label: '银行行别代码',
    type: 'mini-picker',
    codeType: 'AAF200',
    required: true,
  },
  {
    prop: 'aae044',
    label: '开户行',
    type: 'input',
    required: true,
    on: {
      focus: 'openBankPopup',
    },
  },
  {
    prop: 'aae009',
    label: '银行账户名',
    type: 'input',
    required: true,
  },
  {
    prop: 'aae010',
    label: '银行账号',
    type: 'input',
    required: true,
  },
  {
    prop: 'ady019',
    label: '(高考前)户籍所在区县',
    type: 'mini-picker',
    required: true,
    labelWidth: 180,
    // optionsKey: { label: 'name', value: 'id' },
    options: 'ady019List',
  },

  // ================= 创办企业信息 =================
  {
    type: 'section',
    title: '创办企业信息',
  },

  {
    prop: 'aab004',
    label: '创办企业名称',
    type: 'input',
    required: true,
  },
  {
    prop: 'aab998',
    label: '统一社会信用代码',
    type: 'input',
    required: true,
    on: {
      blur: 'aab998Blur',
    },
  },
  {
    prop: 'adc631',
    label: '企业领域',
    type: 'mini-picker',
    codeType: 'ADC631',
    required: true,
  },
  {
    prop: 'aab008',
    label: '企业注册时间',
    type: 'date',
    required: true,
    validator(value, form) {
      const adc633 = form?.adc633
      if (adc633 && value && new Date(value) > new Date(adc633)) {
        return '企业注册时间不能晚于开始经营时间'
      }
    },
  },
  {
    prop: 'adc636',
    label: '营业执照注册地',
    type: 'mini-picker',
    codeType: 'AAB301_LS',
    required: true,
  },

  // ================= 年度信息 =================
  {
    type: 'section',
    title: '年度信息',
  },

  {
    prop: 'adc632',
    label: '申请年度',
    type: 'mini-picker',
    codeType: 'ADC632',
    disabled: true,
    required: true,
  },
  {
    prop: 'adc633',
    label: '本年度经营开始时间',
    type: 'date',
    required: true,
    extra: '年度经营起止时间需满一年',
    validator(value, form) {
      const end = form?.adc634
      if (end && value && new Date(value) > new Date(end)) {
        return '开始时间不能晚于结束时间'
      }
    },
  },
  {
    prop: 'adc634',
    label: '本年度经营结束时间',
    type: 'date',
    required: true,
    extra: '年度经营起止时间需满一年',
    validator(value, form) {
      const start = form?.adc633
      if (start && value && new Date(value) < new Date(start)) {
        return '结束时间不能早于开始时间'
      }
    },
  },

  // ================= 吸纳人员信息 =================
  {
    prop: 'bar',
    type: 'input',
    disabled: true,
    showWhen: (form) => false,
  },
  {
    type: 'section',
    title: '吸纳人员信息(拉萨籍)',
    show: 'fileShow2',
    showWhen: (form) => form.bar === 'showLS',
  },

  {
    prop: 'x_aac003',
    label: '姓名',
    type: 'input',
    disabled: true,
    required: (form) => form.bar === 'showLS',
    showWhen: (form) => form.bar === 'showLS',
  },
  {
    prop: 'x_yac002',
    label: '身份证号码',
    type: 'input',
    required: true,
    required: (form) => form.bar === 'showLS',
    showWhen: (form) => form.bar === 'showLS',
    on: {
      blur: 'x_yac002Blur',
    },
  },
  {
    prop: 'x_aac181',
    label: '毕业时间',
    type: 'input',
    disabled: true,
    required: (form) => form.bar === 'showLS',
    showWhen: (form) => form.bar === 'showLS',
  },
  {
    prop: 'x_adc641',
    label: '入职日期',
    type: 'date',
    required: true,
    required: (form) => form.bar === 'showLS',
    showWhen: (form) => form.bar === 'showLS',
  },
  {
    prop: 'x_adc642',
    label: '此年度截止日期',
    type: 'date',
    required: true,
    required: (form) => form.bar === 'showLS',
    showWhen: (form) => form.bar === 'showLS',
  },
  {
    prop: 'x_ady019',
    label: '高考时户籍所在区县',
    type: 'input',
    disabled: true,
    required: (form) => form.bar === 'showLS',
    showWhen: (form) => form.bar === 'showLS',
  },
]
