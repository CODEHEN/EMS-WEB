import request from '@/utils/request'

export function delNotice (id) {
  return request({
    url: `/notice?id=${id}`,
    method: 'delete'
  })
}

export function getNotice (parameter, noticeInfo) {
  return request({
    url: `/notice/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: noticeInfo
  })
}

export function addNotice (noticeInfo) {
  return request({
    url: '/notice',
    method: 'post',
    data: noticeInfo
  })
}
