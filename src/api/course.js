import request from '@/utils/request'

export function getCourse (parameter, pageinfo) {
  return request({
    url: `/course/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function getElectiveCourse (parameter, pageinfo) {
  return request({
    url: `/course/elective/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
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

export function addElectiveCourse (courseInfo) {
  return request({
    url: '/course/elective',
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
export function updateElectiveCourse (courseInfo) {
  return request({
    url: '/course/elective',
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

export function getCourseName (value) {
  return request({
    url: `/course/name?value=${value}`,
    method: 'get'
  })
}

export function selectCourse (value) {
  return request({
    url: `/course/elective/student`,
    method: 'post',
    data: value
  })
}

export function getStudentElectiveCourse (parameter, value) {
  return request({
    url: `/course/elective/student/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: value
  })
}

export function delEletiveCourse (value) {
  return request({
    url: `/course/elective/student`,
    method: 'delete',
    data: value
  })
}
