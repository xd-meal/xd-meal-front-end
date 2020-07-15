import os from '@/utils/os';
import Vue from 'vue';
import 'babel-polyfill';
import 'es6-promise/auto';
import './vendor/cube-ui';
import './vendor/qriously';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import App from './App.vue';
import router, { ROUTER_NAME } from '@/router';

import store from './store';
import { gotoIndex, routerCheck } from './utils/common';
Vue.config.productionTip = false;

Sentry.init({
  dsn: 'https://b707537c5a0d40568713e374732d24df@sentry.xindong.com/3',
  integrations: [new Integrations.Vue({ Vue, attachProps: true })],
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

routerCheck();

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    // 如果未匹配到路由
    // @ts-ignore
    gotoIndex();
  } else {
    // 如果匹配到正确跳转
    next();
  }
});
