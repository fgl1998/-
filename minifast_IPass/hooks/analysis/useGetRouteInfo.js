import pagesJson from '@/pages.json'

let startTime = ''
const getTime = () => +new Date()

const getRoutesBypages = (pagesJson) => {
  const { pages, subPackages } = pagesJson
  let newList = []
  if (pages && pages.length) {
    pages.forEach((item) => {
      const { path, style } = item
      newList.push({
        path,
        name: style.navigationBarTitleText || '缺失路由名称',
      })
    })
  }

  if (subPackages && subPackages.length) {
    subPackages.forEach((item) => {
      const { root, pages: children } = item

      if (children && children.length) {
        children.forEach((e) => {
          const { path, style } = e
          newList.push({
            path: root + '/' + path,
            name: style.navigationBarTitleText || '缺失路由名称',
          })
        })
      }
    })
  }

  return newList
}

let routesAll = getRoutesBypages(pagesJson)

/**
 * 路由信息
 * @param {string} type
 */
const useGetRouteInfo = (type = 'enter') => {
  let currentRoutes = getCurrentPages()

  let currentRouteInfo = currentRoutes[currentRoutes.length - 1]

  // console.log(currentRouteInfo, routesAll, '===currentRouteInfo===')
}

export { useGetRouteInfo }
