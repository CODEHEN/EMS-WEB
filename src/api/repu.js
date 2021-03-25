import request from '@/utils/request'

export function delRepu (id) {
  return request({
    url: `/rap?id=${id}`,
    method: 'delete'
  })
}

export function getRepu (parameter, info) {
  return request({
    url: `/rap/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: info
  })
}

export function addRepu (info) {
  return request({
    url: '/rap',
    method: 'post',
    data: info
  })
}
