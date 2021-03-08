import request from '@/utils/request'

export function getClassesByCollege (collegeId) {
  return request({
    url: `/classes/${collegeId}`,
    method: 'get'
  })
}
