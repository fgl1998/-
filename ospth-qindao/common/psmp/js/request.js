// 适配器：将 osppm 需要的 request.sendRequest / request.post 接口适配到 ospth 的请求方式
// 此文件用于 ospth 项目，适配 uni-app 小程序的请求方式
// osppm 移动端走 request.post，PC 走 request.sendRequest；二者均经 normalizeToOspm 保证 { code, data, message } 结构

import { BASE_URL } from '@/config.js'
const base = require('@/static/public/utils/applet.base.js')
/**
 * 将 base.post 的回调结果规范为 osppm 期望的 { code, data, message? } 结构。
 * 后端可能返回：{ code: 200, data: { list } } 或 双层 { code: 200, data: { code: 200, data: { list } } }，
 * applet.base 的 request 会做 onSuccess(res.data.data)，只传最内层如 { list }，导致少一层 data。
 * 此处对「仅有 list/codeList、没有 data」统一包成 { code: 200, data }。
 */
function normalizeToOspm(res, isDictApi) {
  if (!res || typeof res !== 'object') return res

  // 兼容：若传入的是 uni.request 的 res（含 statusCode、data 等），取 res.data 作为业务体
  if (res.data != null && (res.statusCode != null || (res.header != null && typeof res.data === 'object'))) {
    res = res.data
  }

  // 0. 明确失败：保留 { code, data, message }，不改写
  if (res.code != null && Number(res.code) !== 200) return res

  // 情况2：res.data.data 包含 fileBase64（完整的结构）
  if (res.data && res.data.data && res.data.data.fileBase64 != null) {
    return {
      code: res.code ?? 200,
      data: res.data,  // 保留完整的 data 结构，包含 data.code（字符串 "200"）和 data.data（包含 fileBase64）
      message: res.message ?? res.data?.message
    }
  }

  // 1. 双层 data：res.data.data 下有 list/codeList（后端 { code, data: { code, data: { list } } }）
  if (res.data && res.data.data && (res.data.data.list != null || res.data.data.codeList != null)) {
    return {
      code: res.code ?? res.data?.code ?? 200,
      data: res.data.data,
      message: res.message ?? res.data?.message
    }
  }

  // 2. 已有 data 且 data 含 list/codeList（单层或 code 在外层），保证有 code
  if (res.data && (res.data.list != null || res.data.codeList != null)) {
    return { code: res.code ?? 200, data: res.data, message: res.message }
  }

  // 2.3 已有 data 且 data 含 resultSet：原样透传，不包装成 list（如 getBusinessType 接口）
  if (res.data && res.data.resultSet != null) {
    return { code: res.code ?? 200, data: res.data, message: res.message }
  }

  // 2.5 仅有 list/codeList 在顶层且无 data（applet.base 传了 res.data.data，把 data 层丢掉了）
  //     必须补回 { code: 200, data: res }，否则 store 的 result.data.list 会报错
  if ((res.list != null || res.codeList != null) && res.data === undefined) {
    return { code: 200, data: res, message: res.message }
  }

  // 2.6 仅有 resultSet 在顶层且无 data：补回 { code, data }
  if (res.resultSet != null && res.data === undefined) {
    return { code: res.code ?? 200, data: res, message: res.message }
  }

  // 3. 仅有 { list } 或 { codeList }（applet.base 只传了最内层）
  if (Array.isArray(res.list) || Array.isArray(res.codeList)) {
    return { code: 200, data: res, message: res.message }
  }

  // 4. 数组：包装为 { code: 200, data: { list } } 或 { code: 200, data: { codeList } }
  if (Array.isArray(res)) {
    return {
      code: 200,
      data: isDictApi ? { codeList: res } : { list: res }
    }
  }

  // 5. 已有 { code, data } 且 data 为自定义结构（perPay/resultPage/pagination 等）：原样透传，不再包一层 list
  //    如 getIndividualDepositRecord 返回 { code: 200, data: { perPay: { list, total, pages } } }
  if (res.code != null && res.data != null) {
    return res
  }

  // 6. data 为 { perPay } / { resultPage } / { pagination } 被提前解开时：补回 { code, data }
  if (res.perPay != null || res.resultPage != null || res.pagination != null) {
    return { code: res.code ?? 200, data: res, message: res.message }
  }

  // 7. 其他对象：包装为 { code: 200, data: { list: [res] } }
  return { code: 200, data: { list: [res] } }
}

function buildUrl(url) {
  if (url.indexOf('http') === -1) {
    if (url.startsWith('/api/')) url = url.substring(4)
    return url.startsWith('/') ? BASE_URL + url : BASE_URL + '/' + url
  }
  return url
}

const request = {
  /**
   * 移动端用：osppm 的 if (request?.post) 分支会调此方法
   * 签名 (url, data, onSuccess, onError)，对成功结果做 normalizeToOspm
   */
  post(url, data, onSuccess, onError) {
	  // // 兼容性判断：移动端通常封装在 request.post 中
	if (uni.$mock[url]) {
	      // 显示加载（和真实请求保持一致）
	      let loading;
		  let showToast = true
	      if (showToast) loading = setTimeout(() => uni.showLoading({ mask: true, title: '加载中' }), 100);
	      // 模拟网络延迟（更真实）
	      setTimeout(() => {
	        // 隐藏加载
	        if (showToast) { clearTimeout(loading); uni.hideLoading(); }
	        // 获取对应接口的Mock数据
	        const mockCfg = uni.$mock[url]
        const mockRes = typeof mockCfg === 'function' ? mockCfg(data) : (mockCfg || { serviceSuccess: false, message: '未配置Mock数据' });
	        // 执行成功回调（和真实接口返回格式一致）
	        if (mockRes.serviceSuccess) {
	          try {
	            // 登录接口不解密（保持原有逻辑）
	            if(url != BASE_URL.replace("api", "") + 'login') {
	              mockRes.data = cryptUtil.decryptResult ? cryptUtil.decryptResult(mockRes) : mockRes.data;
	            }
	            // 自动存储Token（保持原有逻辑）
	            mockRes.data?.token && setToken(mockRes.data.token);
	          } catch (e) {}
	            onSuccess(normalizeToOspm(mockRes));
	        } else {
	          // 失败回调
	          uni.showModal({ title: '提示', content: mockRes.message });
	        }
	      }, 500); // 模拟500ms延迟
	      return;
	} 
    url = buildUrl(url)
    const isDictApi = url.includes('/dict/getDictText')
    base.post(
      url,
      data || {},
      (res) => {
        if (typeof onSuccess === 'function') onSuccess(normalizeToOspm(res, isDictApi))
      },
      (err) => {
        if (typeof onError === 'function') {
          onError(err)
        } else {
          const msg = err?.message || err?.toString() || '网络异常，请稍后重试！'
          if (typeof uni !== 'undefined') uni.showModal({ title: '提示', content: msg, showCancel: false })
        }
      },
      true
    )
  },

  /**
   * 发送请求（适配 osppm 的 sendRequest，PC 或未实现 post 时使用）
   * @param {String} url 请求地址
   * @param {Object} parameter 请求参数
   * @param {Function} successCallback 成功回调，接收 { code, data, message? }，与 ospts 一致
   * @param {Function} failCallBack 失败回调
   * @param {Object} formObj 表单对象（可选）
   * @param {Boolean} showPageLoading 是否显示加载中（可选，默认 true）
   * @param {Object} callback 回调对象（可选）
   */
  sendRequest(url, parameter, successCallback, failCallBack, formObj, showPageLoading = true, callback = {}) {
    url = buildUrl(url)
    const isDictApi = url.includes('/dict/getDictText')

    base.post(
      url,
      parameter || {},
      (res) => {
        if (typeof successCallback !== 'function') return
        const out = normalizeToOspm(res, isDictApi)
        successCallback(out)
      },
      (err) => {
        if (typeof failCallBack === 'function') {
          failCallBack(err)
        } else {
          const message = err?.message || err?.toString() || '网络异常，请稍后重试！'
          if (typeof uni !== 'undefined') {
            uni.showModal({ title: '提示', content: message, showCancel: false })
          }
        }
      },
      showPageLoading
    )
  }
}

export default request
