// 学校选择数据
export const selectorObjYau001 = [{
		value: '540000001',
		title: '西藏大学'
	},
	{
		value: '540000002',
		title: '西藏民族大学'
	},
	{
		value: '540000003',
		title: '西藏藏医药大学'
	},
	{
		value: '540000004',
		title: '西藏警官高等专科学校'
	},
	{
		value: '540000005',
		title: '拉萨师范高等专科学院'
	},
	{
		value: '540000006',
		title: '西藏职业技术学院'
	},
	{
		value: '650000040',
		title: '西藏农牧学院'
	},
	{
		value: '540000007',
		title: '西藏技师学院'
	},
	{
		value: '540000008',
		title: '西藏林芝技工学校'
	}
];


// 学校学院映射数据
export const schoolCollegeData = {
	'540000001': [ // 西藏大学
		{
			value: '54000000101',
			title: '文学院'
		},
		{
			value: '54000000102',
			title: '理学院'
		},
		{
			value: '54000000103',
			title: '工学院'
		},
		{
			value: '54000000104',
			title: '医学院'
		},
		{
			value: '54000000105',
			title: '艺术学院'
		},
		{
			value: '54000000106',
			title: '经济与管理学院'
		},
		{
			value: '54000000107',
			title: '旅游与外语学院'
		},
		{
			value: '54000000108',
			title: '政法学院'
		},
		{
			value: '54000000109',
			title: '教育学院'
		},
		{
			value: '54000000110',
			title: '财经学院'
		},
		{
			value: '54000000111',
			title: '信息科学与技术学院'
		},
		{
			value: '54000000112',
			title: '马克思主义学院'
		},
		{
			value: '54000000113',
			title: '生态环境学院'
		},
		{
			value: '54000000114',
			title: '中华民族共同体研究院'
		}
	],
	'540000002': [ // 西藏民族大学
		{
			value: '54000000201',
			title: '文学院'
		},
		{
			value: '54000000202',
			title: '财经学院'
		},
		{
			value: '54000000203',
			title: '马克思主义学院'
		},
		{
			value: '54000000204',
			title: '法学院'
		},
		{
			value: '54000000205',
			title: '管理学院'
		},
		{
			value: '54000000206',
			title: '信息工程学院'
		},
		{
			value: '54000000207',
			title: '民族研究院'
		},
		{
			value: '54000000208',
			title: '新闻传播学院'
		},
		{
			value: '54000000209',
			title: '教育学院'
		},
		{
			value: '54000000210',
			title: '外语学院'
		},
		{
			value: '54000000211',
			title: '医学部'
		},
		{
			value: '54000000212',
			title: '体育学院'
		}
	],
	'540000003': [ // 西藏藏医药大学
		{
			value: '54000000301',
			title: '藏医系'
		},
		{
			value: '54000000302',
			title: '藏药系'
		},
		{
			value: '54000000303',
			title: '继续教育部'
		}
	],
	'540000004': [ // 西藏警官高等专科学校
		{
			value: '54000000401',
			title: '无学院统一审核'
		}
	],
	'540000005': [ // 拉萨师范高等专科学院
		{
			value: '54000000501',
			title: '语文与社会科学系'
		},
		{
			value: '54000000502',
			title: '数学和自然科学系'
		},
		{
			value: '54000000503',
			title: '信息技术系'
		},
		{
			value: '54000000504',
			title: '公共教学部'
		},
		{
			value: '54000000505',
			title: '教育系'
		},
		{
			value: '54000000506',
			title: '体育艺术系'
		}
	],
	'540000006': [ // 西藏职业技术学院
		{
			value: '54000000601',
			title: '农业与科学技术学院'
		},
		{
			value: '54000000602',
			title: '动物科学技术学院'
		},
		{
			value: '54000000603',
			title: '经济管理学院'
		},
		{
			value: '54000000604',
			title: '旅游与文化学院'
		},
		{
			value: '54000000605',
			title: '信息工程学院'
		},
		{
			value: '54000000606',
			title: '建筑工程学院'
		},
		{
			value: '54000000607',
			title: '机电工程技术学院'
		}
	],
	'650000040': [ // 西藏农牧学院
		{
			value: '65000004001',
			title: '植物科学学院'
		},
		{
			value: '65000004002',
			title: '动物科学学院'
		},
		{
			value: '65000004003',
			title: '食品科学学院'
		},
		{
			value: '65000004004',
			title: '资源与环境学院'
		},
		{
			value: '65000004005',
			title: '水利土木工程学院'
		},
		{
			value: '65000004006',
			title: '电气工程学院'
		},
		{
			value: '65000004007',
			title: '公共教学部'
		},
		{
			value: '65000004008',
			title: '高原生态研究所'
		}
	],
	'540000007': [ // 西藏技师学院
		{
			value: '540000007',
			title: '无学院统一审核'
		}
	],
	'540000008': [ // 西藏林芝技工学校
		{
			value: '54000000801',
			title: '无学院由林芝市统一审核'
		}
	]
};

// 获取学院数据的方法
export const getCollegeDataBySchool = (schoolCode) => {
	return schoolCollegeData[schoolCode] || [];
};

// 根据学校代码获取学校名称
export const getSchoolNameByCode = (schoolCode) => {
	const school = selectorObjAab302.find(item => item.value === schoolCode);
	return school ? school.title : '';
};

// 根据学院代码获取学院名称
export const getCollegeNameByCode = (collegeCode, schoolCode) => {
	const colleges = schoolCollegeData[schoolCode] || [];
	const college = colleges.find(item => item.value === collegeCode);
	return college ? college.title : '';
};