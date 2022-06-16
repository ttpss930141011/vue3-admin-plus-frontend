import request from 'axios'

export function getList(params) {
  return request({
    url: 'https://api.publicapis.org/entries',
    method: 'get',
    params
  })
}
