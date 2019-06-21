import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import axios from 'axios';
import Mint from 'mint-ui';
import moment from 'moment';
import VueClipboard from 'vue-clipboard2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EXIF from "exif-js";
// import Vuelazyload from 'vue-lazyload';
import Vconsole from 'vconsole';

//var vconsole=new Vconsole();

Vue.prototype.$CONFIG = process.env.CONFIG;
Vue.prototype.$EXIF = EXIF
Vue.prototype.$axios = axios;
Vue.use(VueClipboard);
Vue.use(Mint);
// Vue.use(EXIF)
Vue.config.productionTip = false;

// Vue.use(Vuelazyload, {
//   loading: './common/images/loading.gif'
// });

// 日期轉換
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern);
});
// 銀行卡遮罩
Vue.filter('accountFormat', function(data) {
  if (!!!data) {
    return;
  }
  data = data.substring(0, 7) + '*******' + data.substring(14, 18);
  return data;
});

router.beforeEach((to, from, next) => {
  //需要权限
  if (to.matched.some(res => res.meta.requireAuth)) {
    //没有token，返回登录
    if (!localStorage.getItem('token')) {
      next({
        path: '/login',
        query: {
          redirect: to.path
        }
      });
      return;
    }
    next();
  } else{
    //不需权限
    if(to.name=="Login"&&localStorage.getItem('token')){
      //已登录，访问登录页，跳回主页
      next({
        path:"/"
      })
    }else{
      next();
    }
  }
});



new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
