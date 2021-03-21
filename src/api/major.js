import request from '@/utils/request'

export function getMajorByCollegeName (majorName) {
  return request({
    url: `/major/${majorName}`,
    method: 'get'
  })
}

export function addMajor (majorInfo) {
  return request({
    url: '/major',
    method: 'post',
    data: majorInfo
  })
}

export function updateMajor (majorInfo) {
  return request({
    url: '/major',
    method: 'put',
    data: majorInfo
  })
}
