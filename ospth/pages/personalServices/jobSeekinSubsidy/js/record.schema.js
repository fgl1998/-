export const recordSchema2 = [
  {
    label: '申请年度',
    prop: 'year',
  },
  {
    label: '个人姓名',
    prop: 'aac003',
  },
  {
    label: '证件号码',
    prop: 'yac002',
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
    label: '转移类别',
    prop: 'aab004',
    map: {
      1: '跨区县',
      2: '跨地市',
      3: '跨省',
    },
  },
  {
    label: '申请补贴金额',
    prop: 'money',
  },
  {
    label: '申请时间',
    prop: 'aae036',
  },
  {
    label: '审核状态',
    prop: 'yae421',
    dict: 'YAE421',
  },
  {
    label: '审核机构',
    prop: 'aae017',
    dict: 'AAE017',
  },
  {
    label: '审核说明',
    prop: 'yae031',
  },
]
