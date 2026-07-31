// 仅导出获取当前行政区的方法；内部包含定位、距离计算、逆地理和代码处理
async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('当前浏览器不支持地理定位'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        resolve({ latitude, longitude, accuracy })
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    )
  })
}

function calcDistance(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function to12DigitCode(code) {
  if (code == null) return ''
  let s = String(code).trim()
  if (s.startsWith('156')) s = s.slice(3)
  if (s.length >= 12) return s.slice(0, 12)
  return s.padEnd(12, '0')
}

async function getTiandituAddress(lat, lng, tk) {
  const postStr = JSON.stringify({ lon: lng, lat: lat, ver: 1 })
  const url = `https://api.tianditu.gov.cn/geocoder?postStr=${encodeURIComponent(postStr)}&type=geocode&tk=${tk}`
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const data = await resp.json()
  if (data.status === '0' && data.result) {
    const c = data.result.addressComponent || {}
    return {
      province: c.province,
      city: c.city,
      county: c.county,
      province_code: c.province_code,
      city_code: c.city_code,
      county_code: c.county_code,
      lat,
      lng,
    }
  }
  throw new Error(data.msg || '天地图逆地理编码失败')
}

export async function getCurrentareaName(tk) {
  const cached = uni.getStorageSync('currentLocation')
  const { latitude, longitude } = await getCurrentLocation()

  if (cached && cached.latitude && cached.longitude) {
    const dist = calcDistance(cached.latitude, cached.longitude, latitude, longitude)
    if (dist <= 1000) {
      return cached
    }
  }

  const res = await getTiandituAddress(latitude, longitude, tk)
  const { province, city, county, province_code, city_code, county_code } = res
  let areaName = ''
  let areaCode = ''
  if (province && city && county) {
    areaName = `${city}/${county}`
  }
  if (province_code && city_code && county_code) {
    areaCode = to12DigitCode(county_code)
  }
  if (areaName && areaCode) {
    const next = { areaCode, areaName, latitude, longitude, updatedAt: Date.now() }
    uni.setStorageSync('currentLocation', next)
    return next
  }
  return null
}
