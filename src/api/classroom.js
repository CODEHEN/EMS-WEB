import request from '@/utils/request'

export function getClassRoomByTeachBuildId (buildId) {
  return request({
    url: `/classRoom/${buildId}`,
    method: 'get'
  })
}

export function addClassRoom (roomInfo) {
  return request({
    url: '/classRoom',
    method: 'post',
    data: roomInfo
  })
}

export function updateClassRoom (roomInfo) {
  return request({
    url: '/classRoom',
    method: 'put',
    data: roomInfo
  })
}
