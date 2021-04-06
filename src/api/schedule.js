import request from '@/utils/request'

export function studentSchedule (info) {
  return request({
    url: '/schedule/student',
    method: 'post',
    data: info
  })
}
export function classSchedule (info) {
  return request({
    url: '/schedule/class',
    method: 'post',
    data: info
  })
}
export function teacherSchedule (info) {
  return request({
    url: '/schedule/teacher',
    method: 'post',
    data: info
  })
}
export function classRoomSchedule (info) {
  return request({
    url: '/schedule/classroom',
    method: 'post',
    data: info
  })
}
