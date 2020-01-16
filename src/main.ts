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
