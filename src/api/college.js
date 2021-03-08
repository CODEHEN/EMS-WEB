import request from '@/utils/request'

export function getCollege () {
  return request({
    url: '/college',
    method: 'get'
  })
}
