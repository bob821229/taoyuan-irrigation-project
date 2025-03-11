var ApiCaller = function({axios, finallyCallback = null}){
  
  this.axios = axios;
  this.defaultFinallyCallback = finallyCallback;

  console.log(this.axios, this.defaultFinallyCallback);

  let self = this;

  this.download = function({
    apiItem, 
    exceptionCallback = null, 
    finallyCallback = null
  }){
    let _axios = self.axios(
      {
        url: apiItem.uri,
        method: 'GET',
        responseType: 'blob', // Important
      }
    );
    self.doCallbacks(_axios, exceptionCallback, finallyCallback);
    return _axios;
  }

  this.call = function({
    apiItem = null, 
    data = null, 
    exceptionCallback = null, 
    finallyCallback = null, 
    headers = {'Content-Type': 'application/json'}
  }){
    if(apiItem.method == 'get'){
      return self.get(apiItem, exceptionCallback, finallyCallback);
    }else{
      return self.post(apiItem, headers, data, exceptionCallback, finallyCallback);
    }
  }
  this.post = function(api, headers, payload, exceptionCallback, finallyCallback){
    let _axios = self.axios.post(api.uri, payload, headers);
    self.doCallbacks(_axios, exceptionCallback, finallyCallback);
    return _axios;
  }
  this.get = function(api, exceptionCallback, finallyCallback){
    let _axios = self.axios.get(api.uri);
    self.doCallbacks(_axios, exceptionCallback, finallyCallback);
    return _axios;
  }

  this.callAsync = async function({
    apiItem = null, 
    data = null, 
    exceptionCallback = null, 
    finallyCallback = null, 
    headers = {'Content-Type': 'application/json'}
  }){
    if(apiItem.method == 'get'){
      return await self.getAsync(apiItem, exceptionCallback, finallyCallback);
    }else{
      return await self.postAsync(apiItem, headers, data, exceptionCallback, finallyCallback);
    }
  }
  this.postAsync = async function(api, headers, payload, exceptionCallback, finallyCallback){
    let _axios = await self.axios.post(api.uri, payload, headers);
    //self.doCallbacks(_axios, exceptionCallback, finallyCallback);
    return _axios;
  }
  this.getAsync = async function(api, exceptionCallback, finallyCallback){
    let _axios = await self.axios.get(api.uri);
    //self.doCallbacks(_axios, exceptionCallback, finallyCallback);
    return _axios;
  }
  
  this.doCallbacks = function(axios, exceptionCallback, finallyCallback){
    if(exceptionCallback == null){
      axios.catch(self.defaultExceptionCallback);
    }else{
      axios.catch(exceptionCallback);
    }
    if(finallyCallback == null && self.defaultFinallyCallback != null){
      axios.finally(self.defaultFinallyCallback);
    }
    return axios;
  }

  this.defaultExceptionCallback = function(e){
    console.log('exception', e);
    //console.log(e.response.status)
    if(e.response.status == 401){
      alert('您尚未登入或登入逾時，請重新登入系統');
      location.href='/home/login';
    }
  }
  
  
}
export {ApiCaller}