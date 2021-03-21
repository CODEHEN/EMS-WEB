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
