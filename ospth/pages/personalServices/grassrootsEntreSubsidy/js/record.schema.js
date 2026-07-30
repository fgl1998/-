// record.schema.js
export const recordSchema = [
  {
    label: '就业单位名称',
    prop: 'aab004',
  },
  {
    label: '单位社会信用代码',
    prop: 'aab998',
  },
  {
    label: '转移方式',
    prop: 'type',
    dict: 'TRANSFER_TYPE',
  },
  {
    label: '工作地行政区划',
    prop: 'ycc299',
  },
  {
    label: '年度单位就业天数',
    prop: 'aac009_c',
  },
  {
    label: '单位就业开始日期',
    prop: 'start_date',
  },
  {
    label: '单位就业截止日期',
    prop: 'end_date',
  },
  // {
  //   label: '人员类别',
  //   prop: 'aac007',
  //   map: {
  //     0: '非脱贫、农牧民人口',
  //     1: '脱贫人口',
  //     2: '农牧民工',
  //   },
  // },
]
export const recordSchema2 = [
  {
    label: '审核状态',
    prop: 'yae421',
    dict: 'yae421',
  },
  {
    label: '审核信息',
    prop: 'yae422',
  },
  {
    label: '姓名',
    prop: 'aac003',
  },
  {
    label: '身份证号码',
    prop: 'yac002',
  },
  {
    label: '创办企业名称',
    prop: 'aab004',
  },
  {
    label: '企业统一社会信用代码',
    prop: 'aab998',
  },
  {
    label: '创办企业领域',
    prop: 'adc631',
    dict: 'adc631',
  },
  {
    label: '企业注册时间',
    prop: 'aab008',
  },
  {
    label: '申请年度',
    prop: 'adc632',
    dict: 'adc632',
  },
  {
    label: '本年度经营开始时间',
    prop: 'adc633',
  },
  {
    label: '本年度经营结束时间',
    prop: 'adc634',
  },
  {
    label: '开户行',
    prop: 'aae044',
  },
  {
    label: '银行账户名称',
    prop: 'aae009',
  },
  {
    label: '银行账号',
    prop: 'aae010',
  },
]
