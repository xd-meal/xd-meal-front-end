import os from '@/utils/os';
import Vue from 'vue';
import 'babel-polyfill';
import 'es6-promise/auto';
import './vendor/cube-ui';
import './vendor/qriously';

import App from './App.vue';
import router from '@/router';

import store from './store';
import { routerCheck } from './utils/common';
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

routerCheck();

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
