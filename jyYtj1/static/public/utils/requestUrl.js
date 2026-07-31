const dev = 'http://192.168.3.34:8080/sxterminal' //测试minifast地址  https://172.20.21.203:8082
const yinhai = 'http://172.50.1.102:30001/sxterminal' //公司银海云地址
const test = 'https://test.gajy.org.cn/gaterminal' //测试环境地址
const prop = 'http://59.195.11.109:30001/terminal' //正式

const requestUrl = yinhai

const AllUpdateApiCode = [
  'jy204_hrm259',
  'jy202_hrm133',
  'jy202_hrm135',
  'jy202_hrm136',
  'jy202_hrm134',
  'jy202_hrm137',
  'jy001_Save',
  'jy202_hrm147',
  'jy202_hrm130',
  'jy202_hrm131',
  'jy202_hrm132',
  'jy202_hrm103',
  'jy217_flex110',
  'jy204_hrm110',
  'collect_com01',
  'collect_com02',
  'jy202_hrm100',
  'jy306_service10',
  'jy306_service11',
  'jy202_hrm109',
]
const AllNoChangeList = ['jy009_com02_interface', 'jy388_aq07_interface']

export default {
  requestUrl,
  AllUpdateApiCode,
  AllNoChangeList,
}
