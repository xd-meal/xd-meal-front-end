import { checkUserLogin } from '@/api/login';
import os from '@/utils/os';
import Vue from 'vue';
import './vendor/cube-ui';
import './vendor/qriously';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import { gotoLogin } from './utils/common';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// 在首次进入页面时检测用户登陆状态，如果尚未登陆跳转到 login
checkUserLogin().then((data) => {
  if (data.code !== 200) {
    gotoLogin();
  } else {
    // 登陆了而且目标是 admin 页面，则不动
    if (
      [
        '/admin',
        '/admin/import',
        '/admin/edit',
        '/admin/switch',
        '/admin/output',
        '/admin/login',
      ].indexOf(router.currentRoute.fullPath) >= 0
    ) {
      // TODO: 识别一下
    } else if (['/', '/login'].indexOf(router.currentRoute.fullPath) >= 0) {
      // 在首页 和 login 页的需要跳转到指定的index路由页面
      if (os.isPc) {
        router.push({
          name: 'pcOrder',
        });
      } else {
        router.push({
          name: 'index',
        });
      }
    }
  }
});
