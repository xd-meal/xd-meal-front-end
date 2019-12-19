import { ActionTree, GetterTree, MutationTree } from 'vuex';
import Router from '@/router';

import { loginApi, IUserLoginData } from '@/api/login';
import { INotificationGlobal } from '@/store/notification';

export enum LOGIN_STATUS {
  FAIL = 'fail',
  IDLE = 'idle',
  SUCCESS = 'success',
}
export interface IUserLoginGlobal {
  username: string;
  token: string;
  loginStatus: LOGIN_STATUS;
}
const state: IUserLoginGlobal = {
  username: '',
  token: '',
  loginStatus: LOGIN_STATUS.IDLE,
};
export const USER_NAMESPACE = 'user/';
export enum USER {
  LOGIN_ACTION = 'loginAction',
  SET_TOKEN = 'setToken',
  SET_LOGIN_STATUS = 'setLoginStatus',

  PAYCODE_GETTER = 'code',
}

const getters: GetterTree<INotificationGlobal, any> = {
  code() {
    return '5948d29214d1';
  },
};
const actions: ActionTree<IUserLoginGlobal, any> = {
  async [USER.LOGIN_ACTION]({ commit }, loginData: IUserLoginData) {
    const data = await loginApi(loginData);
    if (data.code === 200) {
      commit(USER.SET_TOKEN, { token: '1' });
      commit(USER.SET_LOGIN_STATUS, { loginStatus: LOGIN_STATUS.SUCCESS });
      const query = Router.currentRoute.query;
      if (query && query.backPath) {
        Router.push({
          path: query.backPath.toString(),
        });
      } else {
        Router.push({
          name: 'index',
        });
      }
      return {
        status: true,
        msg: '',
      };
    } else {
      commit(USER.SET_LOGIN_STATUS, { loginStatus: LOGIN_STATUS.FAIL });
      return {
        status: false,
        msg: data.msg,
      };
    }
  },
};
const mutations: MutationTree<IUserLoginGlobal> = {
  [USER.SET_TOKEN](_: IUserLoginGlobal, { token }: { token: string }) {
    _.token = token;
  },
  [USER.SET_LOGIN_STATUS](
    _: IUserLoginGlobal,
    { loginStatus }: { loginStatus: LOGIN_STATUS },
  ) {
    _.loginStatus = loginStatus;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
