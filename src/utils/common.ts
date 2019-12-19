import router from '@/router';

export const isDev = false; // process.env.NODE_ENV === 'development';

function callWeWorkLogin(corpid: string) {
  const params = new URLSearchParams();
  params.set('appid', corpid);
  params.set('response_type', 'code');
  params.set('scope', 'snsapi_base');
  params.set('state', 'wework_redirect');
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
    switch (params.get('wework_source')) {
      case 'xd':
        callWeWorkLogin('wxe2be6e5c62e7b072');
        return;

      case 'xdg':
        // TODO: call xd global wework login
        return;

      case 'tap':
        // TODO: call xd global wework login
        return;

      // case 'xdg':
      // I forget the name of an other company
      // return;

      default:
        break;
    }
  } else if (params.get('state') === 'wework_redirect' && params.has('code')) {
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
