import request from '@/utils/request'

export function getUserName (value) {
  return request({
    url: `/user/name?value=${value}`,
    method: 'get'
  })
}

export function getTeaName (value) {
  return request({
    url: `/user/teaName?value=${value}`,
    method: 'get'
  })
}
