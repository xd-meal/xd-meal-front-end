import { fetchWeworkCode, logoutApi } from '@/api/login';
import router from '@/router';
import { getCookie } from '@/utils/cookies';
import os from '@/utils/os';
import store from 'store';

export const isDev = false; // process.env.NODE_ENV === 'development';

function callWeWorkLogin(corp: string) {
  const params = new URLSearchParams();
  switch (corp) {
    case 'xd':
      params.set('appid', 'wxe2be6e5c62e7b072');
      break;

    case 'xdg':
      params.set('appid', 'ww126a15b3a0d87c23');
      break;

    case 'tap':
      params.set('appid', 'wwc2b230af5a43715b');
      break;

    // case 'xdg':
    // I forget the name of an other company
    // return;
    default:
      // Unsupported corp code
      return;
  }
  params.set('response_type', 'code');
  params.set('scope', 'snsapi_base');
  params.set('state', 'wework_redirect_' + corp);
  params.set('redirect_uri', window.location.origin + '/');
  const url =
    'https://open.weixin.qq.com/connect/oauth2/authorize?' +
    params.toString() +
    '#wechat_redirect';
  window.location.href = url;
}

export async function gotoLogin() {
  const params = new URLSearchParams(window.location.search);
  const state = String(params.get('state'));
  const code = String(params.get('code'));

  if (params.has('wework_source')) {
    callWeWorkLogin(params.get('wework_source') || '');
  } else if (state?.startsWith('wework_redirect_') && params.has('code')) {
    const res = await fetchWeworkCode({
      corp: state.replace('wework_redirect_', ''),
      code,
    });
    if (res.code === 200) {
      // 登陆成功跳转到 index 页面
      gotoIndex();
      return;
    }
  }
  let query = {};
  if (!/\/(login|resetpsw)/.test(router.currentRoute.fullPath)) {
    query = { backPath: router.currentRoute.fullPath };
  }
  // 没有登陆，先去登陆
  router.push({
    name: 'login',
    query,
  });
}

export function gotoIndex() {
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

export async function loginOut(targetDom: Vue) {
  const res = await logoutApi();
  if (res.code === 200) {
    store.clearAll();
    gotoLogin();
  } else {
    targetDom
      .$createDialog({
        type: 'alert',
        title: '系统提示',
        content: res.msg,
        icon: 'cubeic-alert',
      })
      .show();
  }
}

export function routerCheck() {
  // 先判断有没有 cookie 在判断网络连通性
  // 在首次进入页面时检测用户登陆状态，如果尚未登陆跳转到 login
  const session = getCookie('XD-MEAL-SESSION');
  if (session) {
    // 登陆了且在 login 以及首页的跳转到 index
    if (['/', '/login'].indexOf(router.currentRoute.fullPath) >= 0) {
      gotoIndex();
    }
  } else {
    // 尚未登陆的前往登陆页面
    gotoLogin();
  }
}
