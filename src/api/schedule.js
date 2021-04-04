import request from '@/utils/request'

export function studentSchedule (info) {
  return request({
    url: '/schedule/student',
    method: 'post',
    data: info
  })
}
