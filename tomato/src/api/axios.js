import axios from 'axios';
import qs from 'qs';
import router from '../router';
import { Indicator, Toast } from 'mint-ui';

import Storage from '@/common/utils/storage';
import { resolve } from 'url';

axios.defaults.retry = 3;
axios.defaults.retryDelay = 20000;
let timeout = 20000
let isRefreshToken=false;

export const service = axios.create({
  baseURL: process.env.CONFIG.BASE_URL, // api的base_url
  timeout// 请求超时时间
});

/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(
  config => {
    if (!localStorage.getItem('token')) {
      router.push({ name: 'Login' });
      return;
    }
    Indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    });
  
    if(!isRefreshToken){
    //token有效性处理
     tokenHandle();
    }
    
    config.headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    };
    config.method === 'post'
      ? qs.stringify({ ...config.data })
      : (config.params = { ...config.params });

    return config;
  },
  error => {
    //请求错误处理
    Toast({
      message: error
    });
    Promise.reject(error);
  }
);


/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
  response => {
    //成功请求到数据
    Indicator.close();
    if (response.data.result === 1) {
      return response.data;
    } else if (response.data.result === 0) {
      return response.data;
    }
  },
  error => {
    //响应错误处理
    return new Promise(resolve => {
      let action = errorAction(error, service)
      action.catch(err => {

      })
    })
  }
);

// ajax無token部分
export const ajax = axios.create({
  baseURL: process.env.CONFIG.BASE_URL,
  timeout,
});

/****** request拦截器==>对请求参数做处理 ******/
ajax.interceptors.request.use(
  config => {
    Indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    });
    config.headers = {
      'Content-Type': 'application/json'
    };
    return config;
  },
  error => {
    isRefreshToken=false;
    //请求错误处理
    Toast({
      message: error
    });
    Promise.reject(error);
  }
);
/****** respone拦截器==>对响应做处理 ******/
ajax.interceptors.response.use(
  response => {
    isRefreshToken=false;
    //成功请求到数据
    Indicator.close();
    // console.log(1, response);
    return response.data
  },
  error => {
    isRefreshToken=false;
    return new Promise(resolve => {
      let action = errorAction(error, ajax)
      action.catch(err => {

      })
    })
  }
);

function errorAction(error, connect) {
  //响应错误处理
  var config = error.config;
  let err = JSON.parse(JSON.stringify(error));
  config.__retryCount = config.__retryCount || 0;

  // 有錯誤訊息
  if (err.response) {
    Indicator.close();

    if (err.response.status == 401) {
      Storage.revome('userInfo');
      Storage.revome('token');
      Toast({
        message: "身份过期，请重新登陆"
      });
      router.push({ name: 'Login' });
      return;
    }

    //500
    if (err.response.status == 500) {
      Toast({
        message: "程序内部错误"
      });
      return;
    }

    //没有消息
    if (!!!err.response.statusText) {
      Toast({
        message: '网络错误',
        duration: 20000
      });
    }
    return Promise.reject(err);
  }


  // 重新連線超過次數
  if (config.__retryCount >= config.retry) {
    Indicator.close();
    Toast({
      message: '网络错误',
      duration: 20000
    });
    return Promise.reject(err);
  }
  // Increase the retry count
  config.__retryCount += 1;
  if (err.code == 'ECONNABORTED') {
    Toast({
      message: '请求超时,准备重试',
      duration: 3000
    })
  }
  // Create new promise to handle exponential backoff
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay);
  });
  // Return the promise in which recalls axios to retry the request
  backoff.then(function () {
    connect(config);
  });

  return Promise.reject(config.__retryCount);

}

 function  tokenHandle(){

  var diedLine=new Date(localStorage.getItem("expireTime")).getTime();
  var now=new Date().getTime();
  var minSecond= diedLine- now;
  var min=Number(minSecond/1000/60);

  //10分钟内续期
  if(0<min&& min<10){
    isRefreshToken=true;
    service({
      url:'/account/refreshToken',
      method:'post'
     }).then(res=>{
      isRefreshToken=false;
      if(res.result==1){
        localStorage.setItem("expireTime",res.data.expireTime)
        localStorage.setItem("token", res.data.accessToken);
     }else{
      Toast({
        message: res.message
      });
     }
     })
  }

}
