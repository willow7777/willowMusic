  const Menu_BASE_URL = "http://123.207.32.32:9001" 
 const BASE_URL = "http://localhost:3000"  

 
class HYRequest {
  constructor(baseURL){
    this.baseURL=baseURL
  }
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        data: params,
        success: function(res) {
          resolve(res.data)
        }, 
        fail: reject
      })
    })
  }

  get(url, params) {
    return this.request(url, "GET", params)
  }

  post(url, data) {
    return this.request(url, "POST", data)
  }
}

const hyRequest = new HYRequest(BASE_URL)
const hyMenuRequest = new HYRequest(Menu_BASE_URL)


export default hyRequest
export {
  hyMenuRequest
}