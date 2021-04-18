import request from '@/utils/request'

export function saveGrade (grade, selectClass, selectCourse, person) {
  return request({
    url: `/grade?selectClass=${selectClass}&selectCourse=${selectCourse}&person=${person}`,
    method: 'post',
    data: grade
  })
}

export function getStudentGradeInfo (parameter, pageinfo) {
  return request({
    url: `/grade/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}
