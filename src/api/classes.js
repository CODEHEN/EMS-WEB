import request from '@/utils/request'

export function getClassesByCollege (collegeName) {
  return request({
    url: `/classes/${collegeName}`,
    method: 'get'
  })
}

export function getClassInfo (parameter, pageinfo) {
  return request({
    url: `/classes/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function updateClass (classes) {
  return request({
    url: '/classes',
    method: 'put',
    data: classes
  })
}

export function addClass (classes) {
  return request({
    url: '/classes',
    method: 'post',
    data: classes
  })
}
