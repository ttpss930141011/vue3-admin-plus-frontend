import request from '@/utils/axiosReq'
import { registerApi, loginApi, setEmailApi, getUserInfoApi, signoutApi } from './api'

export function loginReq(data) {
  console.log(data)
  return request({
    url: loginApi,
    data,
    method: 'post',
    bfLoading: true,
    isParams: false,
    isAlertErrorMsg: true
  })
}
export function setEmailReq(data) {
  return request({
    url: setEmailApi,
    method: 'post',
    data
  })
}
export function getInfoReq() {
  return request({
    url: getUserInfoApi,
    bfLoading: false,
    method: 'get',
    isAlertErrorMsg: false
  })
}

export function logoutReq() {
  return request({
    url: signoutApi,
    method: 'post'
  })
}
