import config from '@/config'

import { IMAGE_ANNUAL_ACCOUNT } from '@/config/constants'

const { areaCode } = config

// 各地市年度账单支撑部门名称
const sponsorText = {
  // 成都
  510100: ['成都纪委', '成都财政', '成都人社'],
  // 攀枝花
  510400: ['攀枝花纪委', '攀枝花财政', '攀枝花人社'],
  // 内江
  511000: ['内江纪委', '内江财政', '内江人社'],
  // 南充
  511300: ['南充人社'],
  // 广安
  511600: ['广安市纪委监委', '广安财政', '广安人社'],
  // 达州
  511700: ['达州纪委', '达州财政'],
  // 雅安
  511800: ['雅安纪委', '雅安财政', '雅安人社'],
  // 巴中
  511900: ['巴中市', '巴中财政'],
  // 资阳
  512000: ['资阳纪委', '资阳人社'],
  // 阿坝
  513200: ['惠民惠农资金', '阿坝纪委', '阿坝财政', '阿坝人社'],
  // 甘孜
  513300: ['甘孜财政'],
  // 凉山
  513400: ['凉山财政']
}
const defaultImg = `${IMAGE_ANNUAL_ACCOUNT}/icon-sponor.png`
/**
 * 各地市年度账单支撑部门logo名称
 */
const imageSponsor = {
  [areaCode]: []
}

if (sponsorText[areaCode]) {
  const arr = sponsorText[areaCode]
  // 地市只有文字 没有图片
  if (areaCode === '513200' || areaCode === '513400' || areaCode === '511000') {
    if (arr[0]) {
      imageSponsor[areaCode].push({
        imageSrc: defaultImg,
        text: arr[0]
      })
    }
    if (arr[1]) {
      imageSponsor[areaCode].push({
        imageSrc: defaultImg,
        text: arr[1]
      })
    }
    if (arr[2]) {
      imageSponsor[areaCode].push({
        imageSrc: defaultImg,
        text: arr[2]
      })
    }
    if (arr[3]) {
      imageSponsor[areaCode].push({
        imageSrc: defaultImg,
        text: arr[3]
      })
    }
  } else {
    if (arr[0]) {
      imageSponsor[areaCode].push({
        imageSrc: `${IMAGE_ANNUAL_ACCOUNT}/icon-sponor-${areaCode}-01.png`,
        text: arr[0]
      })
    }

    // 广安
    if (areaCode === '511600') {
      if (arr[1]) {
        imageSponsor[areaCode].push({
          imageSrc: defaultImg,
          text: arr[1]
        })
      }
    } else {
      if (arr[1]) {
        imageSponsor[areaCode].push({
          imageSrc: `${IMAGE_ANNUAL_ACCOUNT}/icon-sponor-${areaCode}-02.png`,
          text: arr[1]
        })
      }
    }

    if (arr[2]) {
      imageSponsor[areaCode].push({
        imageSrc: `${IMAGE_ANNUAL_ACCOUNT}/icon-sponor-${areaCode}-03.png`,
        text: arr[2]
      })
    }
    if (arr[3]) {
      imageSponsor[areaCode].push({
        imageSrc: `${IMAGE_ANNUAL_ACCOUNT}/icon-sponor-${areaCode}-04.png`,
        text: arr[3]
      })
    }
  }
}

// console.log(imageSponsor, 'imageSponsor=====')

export { imageSponsor }
