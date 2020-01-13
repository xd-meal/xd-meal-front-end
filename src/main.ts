import { getCookie } from '@/utils/cookies';
import os from '@/utils/os';
import Vue from 'vue';
import './vendor/quasar';
import './vendor/cube-ui';
import './vendor/qriously';

import App from './App.vue';
import router, { ROUTER_NAME } from '@/router';

import store from './store';
import { gotoIndex, gotoLogin } from './utils/common';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// 先判断有没有 cookie 在判断网络连通性

// 在首次进入页面时检测用户登陆状态，如果尚未登陆跳转到 login
const session = getCookie('XD-MEAL-SESSION');
if (session) {
  // 登陆了且在 login 以及首页的跳转到 index
  if (['/', '/login'].indexOf(router.currentRoute.fullPath) >= 0) {
    gotoIndex();
  } else if (
    [
      '/admin',
      '/admin/import',
      '/admin/edit',
      '/admin/switch',
      '/admin/output',
      '/admin/login',
    ].indexOf(router.currentRoute.fullPath) >= 0
  ) {
    // 登陆了而且目标是 admin 页面，则不动
  }
} else {
  // 尚未登陆的前往登陆页面
  gotoLogin();
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
