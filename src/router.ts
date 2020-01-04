import Vue from 'vue';
import Router from 'vue-router';

import Login from '@/views/Login';
import App from '@/views/App';
import Order from '@/views/Order';
import Pc from '@/views/Pc';
import Admin from '@/views/Admin';

import Index from '@/components/app/index/Index.tsx';
import Notification from '@/components/app/notification/Notification';
import Pay from '@/components/app/pay/Pay.tsx';
import Profile from '@/components/app/profile/Profile.tsx';
import Setting from '@/components/app/profile/Setting';
import ResetPassword from '@/components/app/profile/ResetPassword';

import PcOrder from '@/components/pc/PcOrder.tsx';

import AdminLogin from '@/components/admin/AdminLogin.tsx';
import AdminEdit from '@/components/admin/AdminEdit.tsx';
import AdminImport from '@/components/admin/AdminImport.tsx';
import AdminSwitch from '@/components/admin/AdminSwitch';
import AdminOutput from '@/components/admin/AdminOutput.tsx';
import AdminUser from '@/components/admin/AdminUser.tsx';
import AdminDiningList from '@/components/admin/AdminDiningList';
export const ROUTER_NAME = {
  LOGIN: 'login',
  QR_LOGIN: 'qrlogin',
  APP_ORDER: 'order',
  APP: 'app',
  APP_INDEX: 'index',
  APP_PAY: 'pay',
  APP_PROFILE: 'profile',
  APP_NOTIFICATION: 'notification',
  APP_SETTING: 'setting',
  APP_RESET_PSW: 'resetpsw',
  APP_SPECIAL_ORDER: 'appSpecialOrder',
  PC: 'pc',
  PC_ORDER: 'pcOrder',
  ADMIN: 'admin',
  ADMIN_LOGIN: 'adminLogin',
  ADMIN_IMPORT: 'adminImport',
  ADMIN_OUTPUT: 'adminOutput',
  ADMIN_EDIT: 'adminEdit',
  ADMIN_SWITCH: 'adminSwitch',
  ADMIN_USER: 'adminUser',
  ADMIN_DINING: 'adminDining',
};
Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: '/admin',
  routes: [
    {
      path: '/login',
      name: ROUTER_NAME.LOGIN,
      component: Login,
      meta: {
        stop: true,
        noAnimation: true,
      },
    },
    {
      path: '/order',
      name: ROUTER_NAME.APP_ORDER,
      component: Order,
      meta: {
        rightIn: true,
        rightOut: true,
      },
    },
    {
      path: '/special/order',
      name: ROUTER_NAME.APP_SPECIAL_ORDER,
      component: Order,
      meta: {
        isSpecial: true,
        rightIn: true,
        rightOut: true,
      },
    },
    {
      path: '/app',
      name: ROUTER_NAME.APP,
      component: App,
      children: [
        { path: '', component: Index, name: ROUTER_NAME.APP_INDEX },
        { path: 'pay', component: Pay, name: ROUTER_NAME.APP_PAY },
        { path: 'profile', component: Profile, name: ROUTER_NAME.APP_PROFILE },
      ],
    },
    {
      path: '/notification',
      component: Notification,
      name: ROUTER_NAME.APP_NOTIFICATION,
      meta: {
        rightIn: true,
        rightOut: true,
      },
    },
    {
      path: '/setting',
      component: Setting,
      name: ROUTER_NAME.APP_SETTING,
      meta: {
        rightIn: true,
        rightOut: true,
      },
    },
    {
      path: '/resetpsw',
      component: ResetPassword,
      name: ROUTER_NAME.APP_RESET_PSW,
      meta: {
        rightIn: true,
        rightOut: true,
      },
    },
    {
      path: '/pc',
      name: 'pc',
      component: Pc,
      children: [
        {
          path: 'order',
          name: ROUTER_NAME.PC_ORDER,
          component: PcOrder,
          meta: {
            stop: true,
          },
        },
      ],
    },
    // XXX: 先写这边，后面单独抽离出去
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        { path: 'login', name: ROUTER_NAME.ADMIN_LOGIN, component: AdminLogin },
        {
          path: 'import',
          name: ROUTER_NAME.ADMIN_IMPORT,
          component: AdminImport,
        },
        {
          path: 'dining',
          name: ROUTER_NAME.ADMIN_DINING,
          component: AdminDiningList,
        },
        {
          path: 'output',
          name: ROUTER_NAME.ADMIN_OUTPUT,
          component: AdminOutput,
        },
        { path: 'edit', name: ROUTER_NAME.ADMIN_EDIT, component: AdminEdit },
        {
          path: 'switch',
          name: ROUTER_NAME.ADMIN_SWITCH,
          component: AdminSwitch,
        },
        { path: 'user', name: ROUTER_NAME.ADMIN_USER, component: AdminUser },
      ],
    },
    // import(/* webpackChunkName: "about" */ './views/About.vue')
  ],
});
