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
    return 'KSQOOSPALEMXLASL';
  },
};
const actions: ActionTree<IUserLoginGlobal, any> = {
  [USER.LOGIN_ACTION]({ commit }, loginData: IUserLoginData) {
    loginApi(loginData).then((data) => {
      if (data.code === 200) {
        commit(USER.SET_TOKEN, { token: '1' });
        commit(USER.SET_LOGIN_STATUS, { loginStatus: LOGIN_STATUS.SUCCESS });
        Router.push({
          name: 'index',
        });
      } else {
        commit(USER.SET_LOGIN_STATUS, { loginStatus: LOGIN_STATUS.FAIL });
      }
    });
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
