import { fetchWeworkCode, logoutApi } from '@/api/login';
import router from '@/router';
import os from '@/utils/os';

export const isDev = false; // process.env.NODE_ENV === 'development';

function callWeWorkLogin(corp: string) {
  const params = new URLSearchParams();
  switch (corp) {
    case 'xd':
      params.set('appid', 'wxe2be6e5c62e7b072');
      break;

    case 'xdg':
      // TODO: call xd global wework login
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
  if (!/\/login/.test(router.currentRoute.fullPath)) {
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
