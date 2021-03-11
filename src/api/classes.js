import request from '@/utils/request'

export function getClassesByCollege (collegeName) {
  return request({
    url: `/classes/${collegeName}`,
    method: 'get'
  })
}
