import Taro from '@tarojs/taro';
import { HTTP_STATUS } from '@/constants/status.js';

export default {
  baseOptions(params, method = 'GET') {
    let { url, data } = params
    const contentType = params.contentType || 'application/json'
    type OptionType = {
      url: string,
      data?: object | string,
      method?: any,
      header: object,
      success: any,
      error: any,
    }
    const option: OptionType = {
      url: url.indexOf('http') !== -1 ? url : 'https://strapi-production-239f.up.railway.app' + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        Authorization: "bearer " + Taro.getStorageSync('token')
      },
      success(res) {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          Taro.showToast({title: '请求资源不存在', icon: 'none'})
          return '请求资源不存在'
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY || res.statusCode === HTTP_STATUS.SERVER_ERROR) {
          Taro.showToast({ title: '服务端错误', icon: 'none' })
          return '服务端错误'
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          Taro.showToast({ title: '没有权限访问', icon: 'none' })
          return '没有权限访问'
        } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
          Taro.clearStorage()
          Taro.navigateTo({
            url: '/packages/login/pages/log/index'
          })
          Taro.showToast({ title: '请先登录', icon: 'error' })
          return '请先登录'
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error(e) {
        Taro.showToast({title: '请求出现问题'})
        return e
      }
    }
    return Taro.request(option)
  },
  get(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post(url, data?: object | string, contentType?: string) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  },
  put(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'PUT')
  },
  delete(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}
