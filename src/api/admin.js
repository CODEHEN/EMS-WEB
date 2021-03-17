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
