import request from '@/utils/request'

export function saveGrade (grade, selectClass, selectCourse, person, semester) {
  return request({
    url: `/grade?selectClass=${selectClass}&selectCourse=${selectCourse}&person=${person}&semester=${semester}`,
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

export function ExcelExport (pageinfo) {
  return request({
    url: `/grade/export`,
    method: 'post',
    data: pageinfo,
    responseType: 'blob'
  })
}

export function RankExcelExport (pageinfo) {
  return request({
    url: `/grade/rankExport`,
    method: 'post',
    data: pageinfo,
    responseType: 'blob'
  })
}

export function ranking (pageinfo) {
  return request({
    url: `/grade/ranking`,
    method: 'post',
    data: pageinfo
  })
}
