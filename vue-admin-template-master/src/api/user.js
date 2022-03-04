import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    // url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC_GkeqdTiDBC-ZcDs-eVmXfjODrd6kB2Q',

    method: 'post',
    // data:{
    //   email:username,
    //   password:password
    // }
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    // url:'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyC_GkeqdTiDBC-ZcDs-eVmXfjODrd6kB2Q',
    method: 'get',
    params: { token }
    // data:{
    //   idToken:"eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGUuY29tLyIsImF1ZCI6ImJhY2tlbmQtYWRtaW4tdnVlIiwiaWF0IjoxNjQ2MzkwMTMwLCJleHAiOjE2NDc1OTk3MzAsInVzZXJfaWQiOiJsVlkweENrc3kwVGtwbVhKWGdVRmlFdGxSeXUyIiwiZW1haWwiOiI1MTYwNjQ5NzVAcXEuY29tIiwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIiwidmVyaWZpZWQiOmZhbHNlfQ.VRshHHTdYo3h9wfo8pMscJUOO0e4aUrQKbFzim9Yb38VF_b9v6RP1ctAOoNRDFUzgtm4slYAmBWfRAxPxBmsY5VEyz0KHCZ_8X7CDF952qdBV2B90vR4EreruaNFPBsXOHa8La1Y_IM5MmHUdv8mkSwjB3d0Af2prVmHoKETZVX3BXIgjwRBVwL69VQF39LEpaKz-6Usft0776pekkceL70ao0c5IBrGtCHNSPBXUTeil-dT_76ob6oeYo-mJGFuYKxoXciNPr73VdTimQKUSAh6pNJ9Qz20yZVkDA3CeNsRbrsXse46EMT2GrY2RiYs1An1-tsY-CkmKb--fHP9iw"
    // }
  })
}

export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
