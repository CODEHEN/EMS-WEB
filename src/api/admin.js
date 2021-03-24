import request from '@/utils/request'

export function getStudentInfo (parameter, pageinfo) {
  return request({
    url: `/admin/student/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function updateStudent (studentInfo) {
  return request({
    url: '/admin/student',
    method: 'put',
    data: studentInfo
  })
}

export function addStudent (studentInfo) {
  return request({
    url: '/admin/student',
    method: 'post',
    data: studentInfo
  })
}

export function getTeacherInfo (parameter, pageinfo) {
  return request({
    url: `/admin/teacher/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function updateTeacher (teacherInfo) {
  return request({
    url: '/admin/teacher',
    method: 'put',
    data: teacherInfo
  })
}

export function addTeacher (teacherInfo) {
  return request({
    url: '/admin/teacher',
    method: 'post',
    data: teacherInfo
  })
}

export function getCollegeInfo (parameter, pageinfo) {
  return request({
    url: `/admin/college/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function updateCollege (collegeInfo) {
  return request({
    url: '/college',
    method: 'put',
    data: collegeInfo
  })
}

export function addCollege (collegeInfo) {
  return request({
    url: '/college',
    method: 'post',
    data: collegeInfo
  })
}

export function getAdminInfo (parameter, pageinfo) {
  return request({
    url: `/admin/admin/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function updateAdmin (adminInfo) {
  return request({
    url: '/admin/admin',
    method: 'put',
    data: adminInfo
  })
}

export function addAdmin (adminInfo) {
  return request({
    url: '/admin/admin',
    method: 'post',
    data: adminInfo
  })
}

export function getAdmin () {
  return request({
    url: '/admin',
    method: 'get'
  })
}
