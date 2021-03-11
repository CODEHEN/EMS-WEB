import request from '@/utils/request'

export function getMajorByCollegeName (majorName) {
  return request({
    url: `/major/${majorName}`,
    method: 'get'
  })
}
