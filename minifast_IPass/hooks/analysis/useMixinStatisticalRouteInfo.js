import pagesJson from '@/pages.json'
import store from '@/store'
import config from '@/config'
import { M_UPDATE_USER_BEHAVIOR_DATA } from '@/store/constants'
import { requestWXInsertBatchVisitDatils } from '@/service/api'

const { isOpenUserBehaviorCollection } = config

const getTime = () => +new Date()
// 是否执行过一次 _hanldeOnHide
let _isExecute = false

/**
 * 获取页面注册的所有路由
 */
const _getAllRoutesBypages = (pagesJson) => {
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

const _allRoutes = _getAllRoutesBypages(pagesJson)
const _allRoutesLen = _allRoutes.length
const _visitRoutes = []
let _currentRoute = {
  startTime: 0,
  endTime: 0,
}

/**
 * 获取当前路由信息
 */
const _getCurrentRouteInfo = () => {
  let currentRoutes = getCurrentPages()
  let currentRoutesLen = currentRoutes.length
  let currentRoute = {}

  let currentRouteInfo = currentRoutes[currentRoutesLen - 1]

  if (currentRouteInfo && currentRouteInfo.route) {
    for (let i = 0; i < _allRoutesLen; i++) {
      const item = _allRoutes[i]
      if (item.path === currentRouteInfo.route) {
        currentRoute = item
        break
      }
    }
  }

  return currentRoute
}

/**
 * 处理页面显示逻辑
 */
const _hanldeOnShow = () => {
  _isExecute = false
  _currentRoute = {
    ..._getCurrentRouteInfo(),
    startTime: _currentRoute.endTime || getTime(),
    endTime: '',
  }
}

/**
 * 处理页面隐藏逻辑
 */
const _hanldeOnHide = () => {
  if (!isOpenUserBehaviorCollection) {
    return
  }

  if (!_isExecute) {
    _isExecute = true
    _currentRoute.endTime = getTime()
    _visitRoutes.push(_currentRoute)
    // console.log('_visitRoutes====', _visitRoutes)
    store.commit(M_UPDATE_USER_BEHAVIOR_DATA, {
      routes: [..._visitRoutes],
    })

    const { id } = store.state.userBehaviorData
    // return
    requestWXInsertBatchVisitDatils(
      {
        id,
        routes: JSON.stringify(_visitRoutes),
      },
      false,
      false
    )
  }
}

/**
 * 统计路由访问信息 全局注入
 */
const useMixinStatisticalRouteInfo = {
  onShow() {
    _hanldeOnShow()
  },
  onHide() {
    _hanldeOnHide()
  },
  // 代替监听返回按钮
  onUnload() {
    _hanldeOnHide()
  },
}

export { useMixinStatisticalRouteInfo }
