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

export function updateUserInfo (value) {
  return request({
    url: `/user/info`,
    method: 'put',
    data: value
  })
}

export function updatePwd (oldPwd, newPwd, number) {
  return request({
    url: `/user/pwd?oldPwd=${oldPwd}&newPwd=${newPwd}&number=${number}`,
    method: 'put'
  })
}
