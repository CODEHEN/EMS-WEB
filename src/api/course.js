import request from '@/utils/request'

export function getCourse (parameter, pageinfo) {
  return request({
    url: `/course/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function addCourse (courseInfo) {
  return request({
    url: '/course',
    method: 'post',
    data: courseInfo
  })
}

export function updateCourse (courseInfo) {
  return request({
    url: '/course',
    method: 'put',
    data: courseInfo
  })
}

export function delCourse (id) {
  return request({
    url: `/course?id=${id}`,
    method: 'delete'
  })
}
