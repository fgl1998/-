<template>
  <div class="page">
    <!-- 服务网点列表 -->
    <common-header @cityChange="cityChange"></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span
                    ><text style="color: #0c6af7 !important">服务</text> 网点<span
                      style="font-size: 18px; color: rgba(0, 0, 0, 0.6)"
                      >/选择服务网点，查看网点地址</span
                    >
                  </span>
                </div>
              </div>

              <ul class="title-btn">
                <li
                  v-for="(item, index) in btnList"
                  :key="index"
                  :class="item.id === btnNum ? 'active' : ''"
                  @click="changeType(item.id, item.type)"
                >
                  {{ item.name }}
                </li>
              </ul>
              <div class="title-rts rt-address">
                <div>
                  <image src="../../../static/images/findWork/icon_home.png" mode="aspectFit" class="icon_home"></image>
                  <span>首页&nbsp;&gt;&nbsp;服务网点</span>
                </div>
              </div>
            </div>
            <div class="wrap-list">
              <div class="list-con" id="mapAll">
                <div class="listBox" ref="listBox">
                  <div class="pointBox">
                    <div class="pointTitle">
                      总数：<span>{{ pageTotal }}</span
                      >个
                    </div>
                    <ul class="listPoint">
                      <li
                        v-for="(item, index) in servicePointList"
                        :key="index"
                        :class="pointAct == index ? 'pointAct' : ''"
                        @click="getUnitInfoAndDraw(item, index)"
                      >
                        <div>
                          <image
                            src="../../../static/images/mapService/icon_icon.png"
                            mode="aspectFill"
                            class="icon_icon"
                          ></image>
                        </div>
                        <div>
                          <div>
                            {{ item.outletsName || '暂无数据'
                            }}<span style="color: #0c6af7; float: right; font-weight: 500; font-size: 18px"
                              >去这里</span
                            >
                          </div>
                          <div v-if="item.phone">
                            电话：<span>{{ item.phone || '暂无数据' }}</span>
                          </div>
                          <div v-if="item.company">
                            企业：<span>{{ item.company || '暂无数据' }}</span>
                          </div>
                          <div v-if="item.outletsAddress">
                            地址：<span>{{ item.outletsAddress || '暂无数据' }}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="wrap-page">
            <common-pager
              :totals="pageTotal"
              :currentPage="currentPage"
              :pageSize="pageSize"
              @currentChange="currentChange"
            ></common-pager>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
  </div>
</template>
<script>
export default {
  onLoad: function () {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    this.init()
    this.loadMap()
  },
  data() {
    return {
      btnNum: 1,
      btnType: '1',
      map: null, // 地图
      tdtLoader: null, // 天地图脚本加载 Promise
      tdtKey: 'ac6453603b41dfa9a6bd22b011e9e97e', // 天地图 key
      infoWindow: null, // 信息展示框
      keyword: '',
      pointAct: -1,
      btnList: [
        {
          id: 1,
          name: '服务机构',
          type: '1',
        },
        {
          id: 3,
          name: '零工网点',
          type: '1',
        },
        {
          id: 21,
          name: '招聘职位',
          type: '2',
        },
        {
          id: 24,
          name: '招聘会',
          type: '2',
        },
        {
          id: 8,
          name: '培训机构',
          type: '1',
        },
        {
          id: 0,
          name: '孵化基地',
          type: '1',
        },
      ],
      userInfo: {},
      currentPage: 1,
      pageSize: 4,
      pageTotal: 0,
      servicePointList: [],
      cityCircles: [], // 市级圆圈覆盖物
      cityCircleQueue: [], // 地市数据待绘制队列
      adcodeCenterCache: {}, // xzqh->经纬度缓存
      adcodeNameCache: {}, // xzqh->名称缓存
    }
  },
  methods: {
    init() {
      this.currentPage = 1
      this.pageTotal = 0
      this.servicePointList = []
      this.handleGetData()
      this.getXzqhMsgList()
    },
    loadMap() {
      this.loadTDT().then(() => {
        // 创建天地图实例
        this.map = new T.Map('mapAll', {
          projection: 'EPSG:4326',
        })
        this.map.centerAndZoom(new T.LngLat(112.548879, 37.87059), 10)
        // 禁用双击缩放，减少误操作导致的视图跳动
        this.map.disableDoubleClickZoom()
        // 阻止列表滚动/触摸影响地图
        const lb = this.$refs.listBox
        if (lb) {
          const stop = (e) => e.stopPropagation()
          lb.addEventListener('wheel', stop, { passive: true })
          lb.addEventListener('touchmove', stop, { passive: true })
        }
        // 地图加载后，如果已有待绘制的城市数据，则绘制
        if (this.cityCircleQueue.length) {
          this.drawCityCircles(this.cityCircleQueue)
        }
      })
    },
    loadTDT() {
      if (this.tdtLoader) return this.tdtLoader
      this.tdtLoader = new Promise((resolve, reject) => {
        if (window.T) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = 'https://api.tianditu.gov.cn/api?v=4.0&tk=ac6453603b41dfa9a6bd22b011e9e97e'
        script.async = true
        script.onload = () => {
          if (window.T) {
            resolve()
          } else {
            reject(new Error('天地图加载失败'))
          }
        }
        script.onerror = (err) => reject(err)
        document.head.appendChild(script)
      })
      return this.tdtLoader
    },
    changeType(id, type) {
      this.pointAct = -1
      this.btnNum = id
      this.btnType = type
      this.clearMap()
      this.init()
      // 切换时回到默认中心
      if (this.map) {
        this.map.centerAndZoom(new T.LngLat(112.548879, 37.87059), 10)
      }
    },
    getUnitInfoAndDraw(d, index) {
      this.pointAct = index
      if (this.infoWindow && this.map?.closeInfoWindow) {
        this.map.closeInfoWindow()
      }
      // adz227: 经度, adz228: 纬度
      const lng = Number(d.outletsLongitude) || Number(d.longitude) || Number(d.adz227) || Number(d.lng)
      const lat = Number(d.outletsLatitude) || Number(d.latitude) || Number(d.adz228) || Number(d.lat)
      const withCoord = { ...d }
      const lngOk = Number.isFinite(lng)
      const latOk = Number.isFinite(lat)
      if (lngOk && latOk) {
        withCoord.outletsLongitude = lng
        withCoord.outletsLatitude = lat
        if (this.map && window?.T) {
          try {
            const lnglat = new T.LngLat(lng, lat)
            this.map.centerAndZoom(lnglat, 13)
          } catch (err) {
            console.warn('centerAndZoom failed', err)
          }
        }
      } else {
        this.$utils.showToast('该网点暂无有效坐标信息，无法定位地图')
      }

      this.createInfoBox(withCoord)
      // 列表点击后清除地图已有气泡，避免遮挡
      if (this.map && this.cityCircles?.length) {
        this.cityCircles.forEach((ov) => this.map.removeOverLay(ov))
        this.cityCircles = []
      }
      if (this.map && this.districtMarkers?.length) {
        this.districtMarkers.forEach((ov) => this.map.removeOverLay(ov))
        this.districtMarkers = []
      }
    },
    clearMap() {
      if (this.infoWindow && this.map?.closeInfoWindow) {
        this.map.closeInfoWindow()
      }
      if (this.cityCircles.length && this.map) {
        this.cityCircles.forEach((ov) => this.map.removeOverLay(ov))
      }
      this.cityCircles = []
      this.activeMarker = null
    },
    handleGetData() {
      if (this.btnType === '2') {
        const param = {
          method: 'jy223_hrm100',
          xzqh: '140000000000',
          nameType: this.btnNum,
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
        }
        this.$utils.request(null, param, true).then((res) => {
          this.servicePointList = res?.pageBean?.list || []
          this.servicePointList = this.formatServicePointList(this.servicePointList)
          this.pageTotal = res?.pageBean?.total || this.servicePointList.length || 0
          this.currentPage = res?.pageBean?.pageNum || this.currentPage
          if (!this.servicePointList.length) return
          this.$nextTick(() => {
            this.servicePointList.map((item) => {
              this.createInfoBox(item)
            })
          })
        })
      }
      if (this.btnType === '1') {
        const param = {
          method: 'jy223_hrm112',
          xzqh: '140000000000',
          nameType: this.btnNum,
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
        }
        this.$utils.request(null, param, true).then((res) => {
          this.servicePointList = res?.pageBean?.list || []
          this.servicePointList = this.formatServicePointList(this.servicePointList)
          this.pageTotal = res?.pageBean?.total || this.servicePointList.length || 0
          this.currentPage = res?.pageBean?.pageNum || this.currentPage
          if (!this.servicePointList.length) return
          this.$nextTick(() => {
            this.servicePointList.map((item) => {
              this.createInfoBox(item)
            })
          })
        })
      }
    },
    getAdcodeLevel(code) {
      const c = (code || '').toString()
      if (c.length < 6) return 'unknown'
      const short = c.slice(0, 6)
      if (/0000$/.test(short)) return 'province' // 如 140000
      if (/00$/.test(short)) return 'city' // 如 140100
      return 'district' // 如 140105
    },
    getXzqhMsgList(xzqhVal, skipAdcode) {
      const adcodeLevel = this.getAdcodeLevel(xzqhVal)

      const param = {
        method: 'jy223_hrm101',
        xzqh: xzqhVal || '140000000000',
        nameType: this.btnNum,
        // latitude: '120.1232232',
        // longitude: '39.443422',
      }
      return this.$utils.request(null, param, true).then(async (res) => {
        const list = res?.xzqhMsgList || []
        let markerList = res?.pageBean?.list || []
        markerList = this.formatXzqhMsgList(markerList)

        if (adcodeLevel === 'district') {
          // 区县级别：清理气泡并渲染 marker
          if (this.cityCircles.length) {
            this.cityCircles.forEach((ov) => this.map.removeOverLay(ov))
            this.cityCircles = []
          }
          const center = this.renderMarkers(markerList, (xzqhVal || '').toString().slice(0, 6))
          if (center) {
            this.map.centerAndZoom(center, 13)
          }
          return center // 这里直接 return，避免后续 drawCityCircles 清掉 marker
        }
        // if (adcodeLevel === 'city') {
        //   list.map((item) => {
        //     if (item.xzqh === '140100000000') {
        //       item.xzqh = '140101000000'
        //     }
        //   })
        // }
        const retCenter = await this.drawCityCircles(list, skipAdcode)
        return retCenter
      })
    },

    renderMarkers(list, baseAdcode) {
      // 太原市区县静态中心
      const taiyuanCenters = {
        140105: { lng: 112.565, lat: 37.738 }, // 小店区
        140106: { lng: 112.569, lat: 37.865 }, // 迎泽区
        140107: { lng: 112.566, lat: 37.908 }, // 杏花岭区
        140108: { lng: 112.47, lat: 37.965 }, // 尖草坪区
        140109: { lng: 112.515, lat: 37.862 }, // 万柏林区
        140110: { lng: 112.477, lat: 37.727 }, // 晋源区
        140121: { lng: 112.359, lat: 37.607 }, // 清徐县
        140122: { lng: 112.679, lat: 38.058 }, // 阳曲县
        140123: { lng: 111.795, lat: 38.067 }, // 娄烦县
        140181: { lng: 112.176, lat: 37.907 }, // 古交市
      }
      if (!list || !list.length || !this.map || !window.T) return null
      let first = null
      list.forEach((item, idx) => {
        const adcode6 = (item.xzqh || baseAdcode || '').toString().slice(0, 6)
        const staticPos = taiyuanCenters[adcode6]
        let lng = Number(item.longitude || item.acb475 || item.lng || (staticPos && staticPos.lng))
        let lat = Number(item.latitude || item.acb476 || item.lat || (staticPos && staticPos.lat))
        const usedFallback = !item.longitude && !item.acb475 && !item.lng

        // 若仍无坐标，随机生成太原市内坐标
        if (!lng || !lat) {
          const baseLng = 112.548879
          const baseLat = 37.87059
          const offsetLng = (Math.random() - 0.5) * 0.5 // 大约 ±0.25 度，约±20km
          const offsetLat = (Math.random() - 0.5) * 0.5
          lng = baseLng + offsetLng
          lat = baseLat + offsetLat
        }
        // 如果使用静态坐标或随机坐标，多条记录可能重叠，添加微偏移
        if (usedFallback || staticPos) {
          const angle = (137.508 * idx * Math.PI) / 180
          const dist = 0.005 * (1 + idx * 0.2) // 约几百米级别偏移
          lng += dist * Math.cos(angle)
          lat += dist * Math.sin(angle)
        }

        const lnglat = new T.LngLat(lng, lat)
        const blueIcon = new T.Icon({
          iconUrl: require('../../../static/images/mapService/icon_loaction1.png'),
          iconSize: new T.Point(24, 34),
        })
        const redIcon = new T.Icon({
          iconUrl: require('../../../static/images/mapService/icon_loaction.png'),
          iconSize: new T.Point(24, 34),
        })
        const marker = new T.Marker(lnglat, { icon: blueIcon })
        marker.addEventListener('click', () => {
          // 还原上一个高亮
          if (this.activeMarker) {
            this.activeMarker.setIcon(blueIcon)
          }
          marker.setIcon(redIcon)
          this.activeMarker = marker

          // 信息窗内容，使用统一模板
          const infoHtml = this.buildInfoContent({
            ...item,
            outletsAddress: item.outletsAddress || item.aab502 || item.aae006,
            outletsName: item.outletsName || item.acb213,
            phone: item.phone || item.aae005,
          })
          if (this.infoWindow && this.map?.closeInfoWindow) {
            this.map.closeInfoWindow()
          }
          const infoWin = new T.InfoWindow(infoHtml, { offset: new T.Point(0, -20) })
          this.map.openInfoWindow(infoWin, lnglat)
          this.infoWindow = infoWin

          this.map.centerAndZoom(lnglat, 13)
        })
        this.cityCircles.push(marker)
        this.map.addOverLay(marker)
        if (!first) first = lnglat
      })
      return first
    },
    async drawCityCircles(list, skipAdcode) {
      if (!list || !list.length) return
      if (!this.map || !window.T) return
      if (this.cityCircles.length) {
        this.cityCircles.forEach((ov) => this.map.removeOverLay(ov))
        this.cityCircles = []
      }
      const fallbackCenters = {
        // 市级中心兜底：太原
        // 140100: new T.LngLat(112.548879, 37.87059),
      }
      const centerOffsetCount = {}
      const getOffsetCenter = (center) => {
        const key = `${center.getLng().toFixed(6)},${center.getLat().toFixed(6)}`
        const count = centerOffsetCount[key] || 0
        centerOffsetCount[key] = count + 1
        if (count === 0) return center
        const angle = (137.508 * count * Math.PI) / 180 // 黄金角度分布
        const distanceDeg = 0.01 * (1 + count * 0.3) // 大约每步 1km 级别
        const lng = center.getLng() + distanceDeg * Math.cos(angle)
        const lat = center.getLat() + distanceDeg * Math.sin(angle)
        return new T.LngLat(lng, lat)
      }
      let firstCenter = null
      const drawCircle = (center, total, adcode, item, nameText) => {
        const fixedCenter = getOffsetCenter(center)
        const displayName = nameText || '未知'
        const rows = [`<div style="font-size:16px;line-height:22px;">${displayName}</div>`]
        const dwVal = Number(item?.dw_num)
        if (Number.isFinite(dwVal)) {
          rows.push(`<div style="font-size:14px;line-height:20px;font-weight:600;">单位:${dwVal}家</div>`)
        }
        const gwVal = Number(item?.gw_num)
        if (Number.isFinite(gwVal)) {
          rows.push(`<div style="font-size:14px;line-height:20px;font-weight:600;">职位:${gwVal}个</div>`)
        }
        const jgVal = Number(item?.jg_num)
        if (Number.isFinite(jgVal)) {
          rows.push(`<div style="font-size:14px;line-height:20px;font-weight:600;">机构:${jgVal}家</div>`)
        }
        const zphVal = Number(item?.zph_num)
        if (Number.isFinite(zphVal)) {
          rows.push(`<div style="font-size:14px;line-height:20px;font-weight:600;">招聘会:${zphVal}场</div>`)
        }
        // 固定像素气泡，避免随缩放变化
        const labelHtml = `<div style="
            width: 120px;
            height: 120px;
            border-radius: 60px;
            background: rgba(12,106,247,0.28);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            color: #fff;
            text-align: center;
            font-weight: 700;
            box-shadow: 0 6px 16px rgba(12,106,247,0.18);
          ">
            ${rows.join('')}
          </div>`
        const label = new T.Label({
          text: labelHtml,
          position: fixedCenter,
          offset: new T.Point(-60, -60),
          borderColor: 'transparent',
          backgroundColor: 'rgba(0,0,0,0)', // 透明以移除白色方框
        })
        const clickHandler = (evt) => {
          // 阻止事件冒泡到地图，避免地图被拖动/居中
          if (evt && evt.stopPropagation) evt.stopPropagation()
          if (evt && evt.domEvent && evt.domEvent.stopPropagation) evt.domEvent.stopPropagation()
          // 点击圈层，按当前行政区划再请求并绘制下级（区县）
          if (adcode) {
            this.getXzqhMsgList(`${adcode}000000`.slice(0, 12), adcode).then((nextCenter) => {
              const target = nextCenter || fixedCenter
              // 下钻后缩放到 12 级，保证区县整体可见
              this.map.centerAndZoom(target, 11)
            })
          }
        }
        label.addEventListener('click', clickHandler)
        // 使用透明圆形来扩大点击区域，避免标签点击不全
        const clickCircle = new T.Circle(fixedCenter, 3000, {
          color: 'rgba(0,0,0,0)',
          weight: 0,
          opacity: 0,
          fillColor: 'rgba(0,0,0,0)',
          fillOpacity: 0,
        })
        clickCircle.addEventListener('click', clickHandler)
        this.cityCircles.push(label)
        this.cityCircles.push(clickCircle)
        this.map.addOverLay(clickCircle)
        this.map.addOverLay(label)
        if (!firstCenter) firstCenter = fixedCenter
      }
      const tasks = list.map(async (item) => {
        const adcode = (item.xzqh || '').slice(0, 6)
        if (!adcode) return
        if (skipAdcode && adcode === skipAdcode) return
        // 市级统计数量，示例使用单位数+岗位数
        const total = (Number(item.dw_num) || 0) + (Number(item.gw_num) || 0)
        const fallbackCenter = fallbackCenters[adcode]
        let center = fallbackCenter
        let nameText = ''
        if (!center) {
          const centerInfo = await this.getCenterByAdcode(adcode)
          center = centerInfo?.center
          nameText = centerInfo?.name || ''
        } else {
          nameText = this.adcodeNameCache[adcode] || ''
        }
        if (!nameText) {
          nameText = item?.name || item?.xzqhName || ''
        }
        if (center) {
          drawCircle(center, total, adcode, item, nameText)
        }
      })
      await Promise.all(tasks)
      return firstCenter
    },
    buildInfoContent(d) {
      const title = d.outletsName || d.name || d.acb213 || d.aab004 || '暂无数据'
      const phone = d.phone || d.aae005
      const addr = d.outletsAddress || d.aab502 || d.aae006
      const company = d.company || d.aab004
      const blocks = []
      if (phone) {
        blocks.push(
          `<div class="relation-phone">
            <div class="icon-phone"></div>
            <div class="icon-text-info">联系电话：${phone}</div>
          </div>`
        )
      }
      if (addr) {
        blocks.push(
          `<div class="relation-address">
            <div class="icon-address"></div>
            <div class="icon-text-info" title="${addr}">联系地址：${addr}</div>
          </div>`
        )
      }
      if (company) {
        blocks.push(
          `<div class="relation-company">
            <div class="icon-address"></div>
            <div class="icon-text-info" title="${company}">企业：${company}</div>
          </div>`
        )
      }
      const infoBody = blocks.join('')
      return `<div class="map-info-box">
          <div class="recruitment-details">${title}</div>
          <div class="relation-info">
            ${infoBody || '<div class="icon-text-info">暂无信息</div>'}
          </div>
        </div>`
    },
    async getCenterByAdcode(adcode) {
      if (this.adcodeCenterCache[adcode])
        return { center: this.adcodeCenterCache[adcode], name: this.adcodeNameCache[adcode] }
      // 静态兜底（太原市及所辖区县）
      const staticCenters = {
        140100: { center: new T.LngLat(112.548879, 37.87059), name: '太原市' },
        // 140101: { center: new T.LngLat(112.548879, 37.87059), name: '市本级' },
        140105: { center: new T.LngLat(112.565, 37.738), name: '小店区' },
        140106: { center: new T.LngLat(112.569, 37.865), name: '迎泽区' },
        140107: { center: new T.LngLat(112.566, 37.908), name: '杏花岭区' },
        140108: { center: new T.LngLat(112.47, 37.965), name: '尖草坪区' },
        140109: { center: new T.LngLat(112.515, 37.862), name: '万柏林区' },
        140110: { center: new T.LngLat(112.477, 37.727), name: '晋源区' },
        140121: { center: new T.LngLat(112.359, 37.607), name: '清徐县' },
        140122: { center: new T.LngLat(112.679, 38.058), name: '阳曲县' },
        140123: { center: new T.LngLat(111.795, 38.067), name: '娄烦县' },
        140181: { center: new T.LngLat(112.176, 37.907), name: '古交市' },
      }
      if (staticCenters[adcode]) {
        this.adcodeCenterCache[adcode] = staticCenters[adcode].center
        this.adcodeNameCache[adcode] = staticCenters[adcode].name
        return staticCenters[adcode]
      }
      try {
        const postStr = encodeURIComponent(
          JSON.stringify({
            searchWord: adcode,
            searchType: 1, // 行政区划代码
            needSubInfo: false,
            needAll: false,
            needPolygon: false,
          })
        )
        const url = `https://api.tianditu.gov.cn/administrative?postStr=${postStr}&tk=${this.tdtKey}`
        const res = await fetch(url).then((r) => r.json())

        const centerStr = res?.data?.[0]?.lonlat
        if (centerStr) {
          const [lng, lat] = centerStr.split(',').map(Number)
          if (lng && lat) {
            const center = new T.LngLat(lng, lat)
            this.adcodeCenterCache[adcode] = center
            this.adcodeNameCache[adcode] = this.adcodeNameCache[adcode] || ''
            return { center, name: this.adcodeNameCache[adcode] }
          }
        }
      } catch (e) {}
      return null
    },
    formatXzqhMsgList(list) {
      if (this.btnNum == '1') {
        return list.map((item) => {
          return {
            ...item,
            name: '服务机构',
            outletsName: item.bce302,
            outletsAddress: item.aab502,
            phone: item.aae005,
            longitude: item.adz227,
            latitude: item.adz228,
          }
        })
      }
      if (this.btnNum == '3') {
        return list.map((item) => {
          return {
            ...item,
            name: '零工网点',
            outletsName: item.bce302,
            outletsAddress: item.aab502,
            phone: item.aae005,
            longitude: item.adz227,
            latitude: item.adz228,
          }
        })
      }

      if (this.btnNum == '21') {
        return list.map((item) => {
          return {
            ...item,
            name: '招聘职位',
            outletsName: item.acb213,
            outletsAddress: item.acb303,
            company: item.aab004,
            longitude: item.longitude,
            latitude: item.latitude,
          }
        })
      }
      if (this.btnNum == '24') {
        return list.map((item) => {
          return {
            ...item,
            name: '招聘会',
            outletsName: item.acb331,
            outletsAddress: item.acb303,
            // company: item.aab004,
            // phone: item.aae005,
            longitude: item.longitude,
            latitude: item.latitude,
          }
        })
      }
    },
    formatServicePointList(list) {
      if (this.btnNum == '1') {
        return list.map((item) => {
          return {
            ...item,
            name: '服务机构',
            outletsName: item.bce302,
            outletsAddress: item.aab502,
            phone: item.aae005,
            longitude: item.adz227,
            latitude: item.adz228,
          }
        })
      }
      if (this.btnNum == '3') {
        return list.map((item) => {
          return {
            ...item,
            name: '零工网点',
            outletsName: item.bce302,
            outletsAddress: item.aab502,
            phone: item.aae005,
            longitude: item.adz227,
            latitude: item.adz228,
          }
        })
      }

      if (this.btnNum == '21') {
        return list.map((item) => {
          return {
            ...item,
            name: '招聘职位',
            outletsName: item.acb213,
            outletsAddress: item.acb303,
            company: item.aab004,
            // phone: item.aae005,
            longitude: item.longitude,
            latitude: item.latitude,
          }
        })
      }
      if (this.btnNum == '24') {
        return list.map((item) => {
          return {
            ...item,
            name: '招聘会',
            outletsName: item.acb331,
            outletsAddress: item.acb303,
            // company: item.aab004,
            // phone: item.aae005,
            longitude: item.longitude,
            latitude: item.latitude,
          }
        })
      }
    },
    //分页返回页码
    currentChange(val) {
      this.pointAct = -1
      this.currentPage = val
      this.handleGetData()
    },
    createInfoBox(d, type) {
      if (!this.map || !window.T) return
      if (d.outletsLongitude || d.acb476) {
        const lng = d.outletsLongitude ? Number(d.outletsLongitude) : Number(d.acb475)
        const lat = d.outletsLatitude ? Number(d.outletsLatitude) : Number(d.acb476)
        const lnglat = new T.LngLat(lng, lat)
        if (type == 'init') {
          const icon = new T.Icon({
            iconUrl: require('../../../static/images/mapService/icon_loaction1.png'),
            iconSize: new T.Point(24, 34),
          })
          this.marker = new T.Marker(lnglat, { icon })
          this.map.addOverLay(this.marker)
        } else {
          const icon = new T.Icon({
            iconUrl: require('../../../static/images/mapService/icon_loaction.png'),
            iconSize: new T.Point(24, 34),
          })
          this.marker = new T.Marker(lnglat, { icon })
          this.map.addOverLay(this.marker)
          const infoContent = this.buildInfoContent(d)
          this.infoWindow = new T.InfoWindow(infoContent, { offset: new T.Point(0, -20) })
          this.map.openInfoWindow(this.infoWindow, lnglat)
          this.infoWindow.addEventListener('close', () => {
            if (this.marker) {
              this.map.removeOverLay(this.marker)
            }
          })
          this.map.centerAndZoom(lnglat, 13)
        }
      }
    },
    // 切换城市
    cityChange() {
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap-box {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.wrap-box .wrap-con {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.wrap-list {
  flex: 1;
  position: relative;
}
#mapAll {
  height: 580px;
  position: relative;

  /deep/ .amap-info-content {
    padding: 0;
  }

  .listBox {
    position: absolute;
    z-index: 999;
    right: 15px;
    top: 24px;

    .search {
      width: 400px;
      display: flex;
      align-items: center;

      .uni-input {
        box-sizing: border-box;
        width: 352px;
        height: 48px;
        background-color: #ffffff;
        padding-left: 15px;
      }
    }

    .search-btn {
      width: 48px;
      height: 48px;

      .Icon_search {
        width: 20px;
        height: 20px;
      }
    }

    .pointBox {
      width: 400px;
      height: 525px;
      margin-top: 10px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0px 0px 20px 0px rgba(157, 157, 157, 0.4);
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #a2a7a9;
      padding: 10px 15px 20px 15px;
      box-sizing: border-box;

      .pointTitle {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 10px;

        span {
          color: #0c6af7;
          margin-right: 5px;
        }
      }

      .listPoint {
        width: 370px;
        height: 468px;
        overflow-x: hidden;
        overflow-y: auto;
        list-style-type: none;
        padding-inline-start: 0;
        padding: 2px;

        .pointAct {
          box-shadow: 0 0 5px rgba(12, 106, 247, 0.7);
        }

        > li {
          width: 360px;
          background: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 12px;
          box-sizing: border-box;
          padding: 15px 15px;
          display: flex;
          transition: all 0.3s linear;

          > div:first-child {
            width: 32px;
            height: 32px;
            margin-right: 4px;

            .icon_icon {
              width: 100%;
              height: 100%;
            }
          }

          > div:nth-child(2) {
            width: 280px;

            > div:first-child {
              font-family: PingFang SC, PingFang SC;
              font-weight: 600;
              font-size: 20px;
              color: rgba(0, 0, 0, 0.9);
              width: 280px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            > div:nth-child(2),
            > div:nth-child(3) {
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 16px;
              color: rgba(0, 0, 0, 0.6);
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;

              span {
                color: rgba(0, 0, 0, 0.9);
              }
            }
          }
        }

        > li:last-child {
          margin-bottom: 0;
        }
      }

      .listPoint::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 5px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }

      .listPoint::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        width: 5px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
      }
    }
  }
}

.btn-blue {
  margin-left: 14px;
}

.wrap-title {
  position: relative;
  z-index: 2;
  background: #fff;
  .title-btn {
    display: flex;
    align-items: center;
    list-style-type: none;
    padding-inline-start: 0;

    > Li:first-child {
      border-radius: 4px 0px 0px 4px;
      border: 1px solid #a2a7a9;
    }

    > Li {
      width: 120px;
      height: 48px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.9);
      border: 1px solid #a2a7a9;
      text-align: center;
      line-height: 48px;
      transition: all 0.3s ease-in-out;
    }

    > li:last-child {
      border-radius: 0px 4px 4px 0px;
    }

    > li.active {
      border: 1px solid #0c6af7;
      background: #ddf0fd;
      color: #0c6af7;
    }
  }

  .title-rts {
    width: 300px;
  }
}

.status {
  display: inline-block;
  width: 84px;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  font-size: 18px;
  text-align: center;

  &.status0 {
    color: #ff5a00;
    background: #fff7f2;
    border: 2px solid rgba(255, 90, 0, 0.24);
  }

  &.status1 {
    color: #1194ff;
    background: #f3faff;
    border: 2px solid rgba(17, 148, 255, 0.24);
  }

  &.status2 {
    color: #929292;
    background: #eeeeee;
    border: 2px solid rgba(176, 176, 176, 0.36);
  }
}

.rt-address {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .icon_home {
    width: 30px;
    height: 30px;
  }

  > div {
    display: flex;
    align-items: center;

    > span {
      height: 30px;
      display: inline-block;
      line-height: 30px;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.6);
      letter-spacing: 2px;
      margin-left: 6px;
    }
  }
}

#mapAll ::v-deep .map-info-box {
  width: 300px;
  border-radius: 8px;
  overflow: hidden;

  .recruitment-details {
    font-family: SourceHanSansCN-Regular;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-indent: 12px;
    color: #fff;
    background-color: #0267f2;
  }

  .relation-phone,
  .relation-address,
  .relation-company {
    display: flex;
    align-items: center;
    min-height: 30px;
    padding: 4px 0;
  }

  .icon-phone {
    width: 13px;
    height: 13px;
    background-image: url('../../../static/images/mapService/icon_phone.png');
    background-size: 100% 100%;
    margin-right: 5px;
    margin-left: 16px;
  }

  .icon-address {
    width: 13px;
    height: 13px;
    background-image: url('../../../static/images/mapService/icon_point.png');
    background-size: 100% 100%;
    margin-right: 5px;
    margin-left: 16px;
  }

  .icon-company {
    width: 13px;
    height: 13px;
    background-image: url('../../../static/images/mapService/icon_point.png');
    background-size: 100% 100%;
    margin-right: 5px;
    margin-left: 16px;
  }

  .relation-info {
    padding: 8px 0 12px;
  }

  .icon-text-info {
    width: calc(100% - 50px);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    line-height: 22px;
  }

  .sign-company {
    height: 42px;
    display: flex;
    align-items: center;
    background-color: #f5faff;

    .icon-company {
      width: 17px;
      height: 15px;
      // background-image: url(/img/jobRecruit/employMap/icon_recruit_enterprise.png);
      background-size: 100% 100%;
      margin-left: 15px;
    }

    .company-txt {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 40px;
      margin-bottom: 0;
    }
  }
}

/* 覆盖天地图 Label 默认白底方框 */
#mapAll ::v-deep .tdt-label {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}
</style>
