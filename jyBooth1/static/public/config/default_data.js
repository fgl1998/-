import utils from '../utils/api.js'
const defaultCompanyInfo = {
  title: '太原人力资源服务产业园',
  aab004: '欢迎您，来到太原产业园！',
  englishTitle: 'Welcome to Guang Industrial Park!',
  aab022: '人力资源服务业',
  aab056: '1000人以上',
  aab020: '事业单位',
  aab092:
    '【公司简介】：太原产业园是特色产业园区，紧邻太原主城的东部，总规划面积约28平方公里，园区主导开发面积15平方公里。产业园秉承“产业化、专业化、资本化、人文化”发展理念，突出高端装备制造、智能电子、装配式建筑、保税物流、健康医疗、旅游服务等产业，通过产业发展与城市发展联动...【查看更多】',
  defaultImg: utils.getRealImgUrl('loginPage/default-1.png'),
  imgList: [
    { aae707: utils.getRealImgUrl('loginPage/default-2.png') },
    { aae707: utils.getRealImgUrl('loginPage/default-3.png') },
    { aae707: utils.getRealImgUrl('loginPage/default-4.png') },
    { aae707: utils.getRealImgUrl('loginPage/default-5.png') },
  ],
  headImg: utils.getRealImgUrl('loginPage/logo-1.png'),
}

export default {
  defaultCompanyInfo,
}
