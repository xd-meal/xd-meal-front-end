import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login';
import App from '@/views/App';
import Order from '@/views/Order';
import Pc from '@/views/Pc';

import Index from '@/components/index/Index.tsx';
import Notification from '@/components/notification/Notification.vue';
import Pay from '@/components/pay/Pay.tsx';
import Profile from '@/components/profile/Profile.tsx';

import PcLogin from '@/components/pc/PcLogin.tsx';
import PcOrder from '@/components/pc/PcOrder.tsx';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
    },
    {
      path: '/app',
      name: 'app',
      component: App,
      children: [
        { path: '', component: Index, name: 'index' },
        { path: 'notification', component: Notification, name: 'notification' },
        { path: 'pay', component: Pay, name: 'pay' },
        { path: 'profile', component: Profile, name: 'profile' },
      ],
    },
    {
      path: '/pc',
      name: '/pc',
      component: Pc,
      children: [
        { path: 'login', name: 'pcLogin', component: PcLogin },
        { path: 'order', name: 'pcOrder', component: PcOrder },
      ],
    },
    // import(/* webpackChunkName: "about" */ './views/About.vue')
  ],
});
