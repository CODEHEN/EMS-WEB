import request from '@/utils/request'

export function getUserName (value, type) {
  return request({
    url: `/user/name?value=${value}&type=${type}`,
    method: 'get'
  })
}
