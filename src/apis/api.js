import axios from 'axios';
let URL=''
if (process.env.NODE_ENV === 'production') {
  URL = '/projects/taoyuanIrrigation-v7/';
}
// data相關的 api
const dataRequest = axios.create({
  baseURL: URL
})
// data相關的 api
// const dataRequest = axios.create({
//   baseURL: URL
// })

//取得資料
export const apiGetData = (path) => dataRequest.get(`${path}`);
// export const apiGetPoundInfoByIrrigation = (path) => dataRequest.get(`${path}`);