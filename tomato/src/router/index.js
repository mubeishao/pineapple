import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Register from '@/components/Register';
import appFrame from '../pages/appFrame';
import Forgetpwd from '../pages/forgetPwd.vue';
import Main from '../pages/main.vue';
//import TransferTest from '../pages/householdTransfer.vue';
import Transfer from '../pages/transfer';
import Deposit from '../pages/deposit';
import PTAccount from '../pages/PTAccount.vue';
import GameInfo from '../pages/gameInfo.vue';
import basicDocument from '../pages/basicDocument';
import RecordConversion from '../pages/recordConversion';
import Mail from '@/pages/mail';
import Layout from '@/Layout/Layout';
import NotFound from '@/components/NotFound';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'Register',
      path: '/register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit,
      meta: { 
        keepAlive: true 
        } 
    },
    {
      name: 'Forgetpwd',
      path: '/forgetpwd/:id',
      component: Forgetpwd
    },
    {
      path: '/',
      component: Layout,
      meta: {
        requireAuth: true
      },
      children: [
        // 主頁
        {
          path: '',
          name: 'Main',
          component: Main
        },
        {
          path: '/appFrame',
          name: 'appFrame',
          component: appFrame
        },
        {
          path: 'ptaccount',
          component: Layout,
          children: [
            // 遊戲頁面
            {
              path: '',
              name: 'PTAccount',
              component: PTAccount
            },
            // 轉帳
            {
              path: 'transfer',
              name: 'Transfer',
              component: Transfer
            }
          ]
        },

        // 信息
        // {
        //   path: '/gameInfo',
        //   name: 'GameInfo',
        //   component: GameInfo
        // },
        // 基本資料
        {
          path: '/basicdocument',
          name: 'basicDocument',
          component: basicDocument
        },
        // 個人中心
        {
          path: '/myself',
          name: 'MySelf',
          component: () => import('@/pages/mySelf.vue')
        },

        // 充值
        {
          path: '/myself/recharge',
          name: 'ReCharge',
          component: () => import('@/pages/reCharge.vue')
        },
        //
        {
          path: '/myself/coupon',
          name: 'Coupon',
          component: () => import('@/pages/coupon.vue')
        },
        //
        {
          path: '/myself/bindPhone',
          name: 'BindPhone',
          component: () => import('@/pages/bindPhone.vue')
        },
        {
          path: '/myself/authentication',
          name: 'Authentication',
          component: () => import('@/pages/authentication.vue')
        },
        {
          path: '/myself/authentication/bindbankcard',
          name: 'Bindbankcard',
          component: () => import('@/pages/bindbankcard.vue')
        },
        {
          path: '/myself/authentication/changeBankCard',
          name: 'ChangeBankCard',
          component: () => import('@/pages/changeBankCard.vue')
        },
        {
          path: '/myself/gamerecord',
          name: 'GameRecord',
          component: () => import('@/pages/gameRecord.vue')
        },
        {
          path: '/myself/changesafecode',
          name: 'ChangeSafeCode',
          component: () => import('@/pages/changesafecode.vue')
        },
        {
          path: '/myself/changepassword',
          name: 'ChangePassword',
          component: () => import('@/pages/changePassword.vue')
        },
        {
          path: '/myself/accountChange',
          name: 'AccountChange',
          component: () => import('@/pages/accountChange.vue')
        },
        // 代理中心
        {
          path: '/myself/agentCenter',
          name: 'AgentCenter',
          component: () => import('@/pages/agentCneter.vue')
        },
        // 代理中心子頁
        {
          path: '/myself/agentCenter/performanceQuery',
          name: 'PerforanceQuery',
          component: () => import('@/pages/perforanceQuery.vue')
        },
        {
          path: '/myself/agentCenter/layerManagment',
          name: 'LayerManagment',
          component: () => import('@/pages/layerManagment.vue')
        },
        // 排線管理/團隊列表
        {
          path: '/myself/agentCenter/layerManagment/teamList',
          name: 'TeamList',
          component: () => import('@/pages/teamList.vue')
        },
        {
          path: '/myself/agentCenter/agentmangement',
          name: 'AgentMangement',
          component: () => import('@/pages/agentMangement.vue')
        },

        {
          path: '/myself/agentCenter/sumbordquery',
          name: 'Sumbordquery',
          component: () => import('@/pages/sumbordquery.vue')
        },
        //
        {
          path: '/myself/agentCenter/subordinate',
          name: 'Subordinate',
          component: () => import('@/pages/subordinate.vue')
        },
        //
        {
          path: '/myself/agentCenter/faq',
          name: 'faq',
          component: () => import('@/pages/faq.vue')
        },
        // 訊息
        {
          path: 'message',
          name: 'message',
          component: () => import('@/pages/message')
        },
        {
          path: '/message/mail',
          name: 'Mail',
          component: () => import('@/pages/mail')
        },
        // 活動頁面
        {
          path: 'activityCenter',
          name: 'activityCenter',
          component: () => import('@/pages/activityCenter')
        },
        //分享賺錢
        {
          path: '/shareMakingMoney',
          name: 'shareMakingMoney',
          component: () => import('@/pages/shareMakingMoney')
        },
        {
          path: '/recordConversion',
          name: 'RecordConversion',
          component: RecordConversion
        }
      ]
    },

    {
      path: '*',
      redirect: { name: 'Main' }
    }
    // {
    //   path: '*',
    //   name: 'NotFound',
    //   component: ()=>import('@/components/NotFound')
    // }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }

});

function hasQueryParams(route) {
  return !!Object.keys(route.query).length;
  }
  
  router.beforeEach((to, from, next) => {
  let query = from.query || {};
  query.timeStemp = new Date().getTime();
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next({ name: to.name, query: query });
  } else {
    next({ query });
  }
  });

  export default router