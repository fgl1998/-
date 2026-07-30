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
    label: '申请年度',
    prop: 'year',
  },
  {
    label: '审核状态',
    prop: 'yae421',
    dict: 'YAE421',
  },
  {
    label: '申请补贴金额',
    prop: 'money',
  },
  {
    label: '个人姓名',
    prop: 'aac003',
  },
  {
    label: '证件类型',
    prop: 'aac058',
    dict: 'AAC058',
  },
  {
    label: '证件号码',
    prop: 'yac002',
  },
  {
    label: '个人性别',
    prop: 'aac004',
    dict: 'AAC004',
  },
  {
    label: '个人民族',
    prop: 'aac005',
    dict: 'AAC005',
  },
  {
    label: '人员类别',
    prop: 'aac007',
    map: {
      0: '非脱贫、农牧民人口',
      1: '脱贫人口',
      2: '农牧民工',
    },
  },
  {
    label: '申请时间',
    prop: 'aae036',
  },
  {
    label: '审核机构',
    prop: 'aae017',
    dict: 'AAE017',
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
