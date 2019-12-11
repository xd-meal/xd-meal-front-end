import { checkUserLogin } from '@/api/login';
import os from '@/utils/os';
import Vue from 'vue';
import './vendor/cube-ui';
import './vendor/qriously';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
// 在首次进入页面时检测用户登陆状态，如果尚未登陆跳转到 login
checkUserLogin().then((data) => {
  if (data.code !== 200) {
    router.push({
      name: 'login',
    });
  } else {
    if (['/', '/login'].indexOf(router.currentRoute.fullPath) >= 0) {
      // 在首页 和 login 页的需要跳转到指定的index路由页面
      if (os.isPc) {
        router.push({
          name: 'index',
        });
      } else {
        router.push({
          name: 'pcOrder',
        });
      }
    }
  }
});

async function waitForImage(src: string) {
  const image = new Image();
  return new Promise((resolve) => {
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      });
    };
    image.src = src;
  });
}
