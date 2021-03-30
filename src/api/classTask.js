import request from '@/utils/request'

export function getClassTask (parameter, pageinfo) {
  return request({
    url: `/course/classTask?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function addClassTask (info) {
  return request({
    url: '/course/classTask/add',
    method: 'post',
    data: info
  })
}
