// 证书类型及名称
export const selectorObjZzt050 = [
	{
		value: '51',
		title: '建筑类'
	},
	{
		value: '52',
		title: '会计类'
	},
	{
		value: '53',
		title: '医生及护士类'
	},
	{
		value: '54',
		title: '法律类'
	},
	{
		value: '55',
		title: '导游类'
	},
	{
		value: '56',
		title: '计算机类'
	},
	{
		value: '57',
		title: '企业管理类'
	},
	{
		value: '58',
		title: '教师类'
	},
	{
		value: '59',
		title: '社会服务类'
	}
];

// 证书名称映射数据
export const certificateTypeData = {
	'51': [ // 建筑类
		{
			value: '01',
			title: '二级注册建造师'
		},
		{
			value: '02',
			title: '建筑施工安全生产管理人员'
		}
	],
	'52': [ // 会计类
		{
			value: '05',
			title: '税务师'
		},{
			value: '23',
			title: '注册会计师'
		},{
			value: '03',
			title: '初级会计职称'
		},{
			value: '21',
			title: '中级会计职称'
		},{
			value: '22',
			title: '高级会计职称'
		}
	],
	'53': [ // 医生及护士类
		{
			value: '28',
			title: '医师'
		},
		{
			value: '29',
			title: '乡村医师'
		},
		{
			value: '31',
			title: '执业医师'
		},{
			value: '32',
			title: '护士执业资格证'
		},{
			value: '30',
			title: '人体器官移植医师'
		}
	],
	'54': [ // 法律类
		{
			value: '04',
			title: '律师职业资格证书'
		}
	],
	'55': [ // 导游类
		{
			value: '06',
			title: '导游证'
		}
	],
	'56': [ // 计算机类
		{
			value: '24',
			title: '计算机一级'
		},{
			value: '25',
			title: '计算机二级'
		},{
			value: '26',
			title: '计算机三级'
		},{
			value: '27',
			title: '计算机四级'
		},{
			value: '07',
			title: '计算机技术与软件专业技术资格'
		}
	],
	'57': [ // 企业管理类
		{
			value: '08',
			title: '企业管理师'
		}
	],
	'58': [ // 教师类
		{
			value: '33',
			title: '教师资格证'
		},
		{
			value: '09',
			title: '幼师职业资格证'
		}
	],
	'59': [ // 社会服务类
		{
			value: '10',
			title: '社会工作者职业资格证'
		}
	]
};


// 获取证书类型数据的方法
export const getCollegeDataByCertificate = (certificateCode) => {
	return certificateTypeData[certificateCode] || [];
};

// 根据证书类型获取学校名称
export const getCertificateTypeByCode = (certificateCode) => {
	const certificate = selectorObjZzt050.find(item => item.value === certificateCode);
	return certificate ? certificate.title : '';
};

// 根据证书名称获取学院名称
export const getCollegeTypeByCode = (collegeCode, certificateCode) => {
	const colleges = certificateTypeData[certificateCode] || [];
	const college = colleges.find(item => item.value === collegeCode);
	return college ? college.title : '';
};