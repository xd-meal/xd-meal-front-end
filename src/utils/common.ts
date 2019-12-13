import router from '@/router';

export const isDev = false; // process.env.NODE_ENV === 'development';

export function gotoLogin() {
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
