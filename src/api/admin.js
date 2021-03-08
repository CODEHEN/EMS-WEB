import request from '@/utils/request'

export function getStudentInfo (parameter, pageinfo) {
  return request({
    url: `/admin/student/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}
