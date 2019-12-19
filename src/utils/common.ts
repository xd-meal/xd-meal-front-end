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
    encodeURIComponent(window.location.origin + window.location.pathname),
  );
  const url =
    'https://open.weixin.qq.com/connect/oauth2/authorize?' +
    params.toString() +
    '#wechat_redirect';
  window.location.href = url;
}

export function gotoLogin() {
  if (window.hasOwnProperty('WeixinJSBridge')) {
    // Now we are in WeWork / WeChat
    //  TODO: Check if Desktop WeWork
    //  TODO: If ture, open in default browser instead.
    const params = new URLSearchParams(window.location.search);
    if (params.get('state') === 'wework_redirect') {
      // TODO: call backend for adding user / auto login, push route to home
    } else {
      // TODO: get company by url search param, or give a selection in 4 company
      callWeWorkLogin('wxe2be6e5c62e7b072');
    }
    return;
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
