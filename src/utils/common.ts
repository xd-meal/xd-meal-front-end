import { logoutApi } from '@/api/login';
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
      // TODO: call xd global wework login
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
  params.set(
    'redirect_uri',
    encodeURIComponent(window.location.origin + '/#/login'),
  );
  const url =
    'https://open.weixin.qq.com/connect/oauth2/authorize?' +
    params.toString() +
    '#wechat_redirect';
  window.location.href = url;
}

export function gotoLogin() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('wework_source')) {
    callWeWorkLogin(params.get('wework_source') || '');
  } else if (
    params.get('state')?.startsWith('wework_redirect_') &&
    params.has('code')
  ) {
    // TODO: Perform WeWork code login
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
