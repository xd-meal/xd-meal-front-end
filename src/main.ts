import { checkUserLogin } from '@/api/login';
import { getCookie } from '@/utils/cookies';
import os from '@/utils/os';
import Vue from 'vue';
import './vendor/quasar';
import './vendor/cube-ui';
import './vendor/qriously';

import App from './App.vue';
import router, { ROUTER_NAME } from '@/router';

import store from './store';
import './registerServiceWorker';
import { gotoIndex, gotoLogin } from './utils/common';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// 先判断有没有 cookie 在判断网络连通性
if (
  [
    '/',
    '/admin',
    '/admin/import',
    '/admin/edit',
    '/admin/switch',
    '/admin/output',
    '/admin/login',
  ].indexOf(router.currentRoute.fullPath) >= 0
) {
  // TODO: 识别一下
  // 登陆了而且目标是 admin 页面，则不动
} else {
  // 在首次进入页面时检测用户登陆状态，如果尚未登陆跳转到 login
  if (getCookie('XD-MEAL-SESSION')) {
    if (['/', '/login'].indexOf(router.currentRoute.fullPath) >= 0) {
      gotoIndex();
    }
  } else {
    gotoLogin();
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    // 如果未匹配到路由
    if (os.isPc) {
      next({
        name: 'pcOrder',
      });
    } else {
      next({
        name: 'index',
      });
    }
  } else {
    // 如果匹配到正确跳转
    next();
  }
});
