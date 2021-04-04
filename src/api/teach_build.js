import request from '@/utils/request'

export function getTeachBuildInfo (parameter, pageinfo) {
  return request({
    url: `/teach_build/info?pageNum=${parameter.pageNum}&pageSize=${parameter.pageSize}`,
    method: 'post',
    data: pageinfo
  })
}

export function getTeachBuildInfo2 () {
  return request({
    url: `/teach_build/info`,
    method: 'get'
  })
}

export function addTeachBuild (buildInfo) {
  return request({
    url: '/teach_build',
    method: 'post',
    data: buildInfo
  })
}

export function updateTeachBuild (buildInfo) {
  return request({
    url: '/teach_build',
    method: 'put',
    data: buildInfo
  })
}
