import { fetchUserProfile, IProfile, IUserConfig } from '@/api/user';
import { gotoIndex } from '@/utils/common';
import moment from 'moment';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import Router from '@/router';
import store from 'store';
import { loginApi, IUserLoginData } from '@/api/login';
import { INotificationGlobal } from '@/store/notification';

export enum LOGIN_STATUS {
  FAIL = 'fail',
  IDLE = 'idle',
  SUCCESS = 'success',
}
export interface IUserLoginGlobal {
  username: string;
  payCode: string;
  loginStatus: LOGIN_STATUS;
  config: {
    advance: boolean;
    randomBtn: boolean;
    buffetBtn: boolean;
  };
  avatar: string;
}
const config = store.get('config') || {};
const state: IUserLoginGlobal = {
  username: store.get('username'),
  // QRCode FOR PAY
  payCode: '',
  loginStatus: LOGIN_STATUS.IDLE,
  config: {
    advance: Boolean(config.advance),
    randomBtn: Boolean(config.randomBtn),
    buffetBtn: Boolean(config.buffetBtn),
  },
  avatar: store.get('avatar'),
};
export const USER_NAMESPACE = 'user/';
export enum USER {
  LOGIN_ACTION = 'loginAction',
  SET_TOKEN = 'setToken',
  SET_LOGIN_STATUS = 'setLoginStatus',

  PAYCODE_GETTER = 'code',

  SET_PROFILE = 'setProfile',
  SET_CONFIG = 'setConfig',

  USER_LAST_UPDATE = 'userLastUpdate',

  USER_PROFILE = 'userProfile',

  FETCH_USER_PROFILE_ACTION = 'fetchUserProfileAction',
}

const getters: GetterTree<INotificationGlobal, any> = {
  code() {
    return '5948d29214d1';
  },
  [USER.USER_PROFILE]() {
    return {
      avatar: state.avatar,
      config: state.config,
      username: state.username,
    };
  },
};
const actions: ActionTree<IUserLoginGlobal, any> = {
  async [USER.LOGIN_ACTION]({ commit }, loginData: IUserLoginData) {
    const data = await loginApi(loginData);
    if (data.code === 200) {
      commit(USER.SET_LOGIN_STATUS, { loginStatus: LOGIN_STATUS.SUCCESS });
      const query = Router.currentRoute.query;
      if (query && query.backPath) {
        Router.push({
          path: query.backPath.toString(),
        });
      } else {
        gotoIndex();
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

  async [USER.FETCH_USER_PROFILE_ACTION]({ commit }) {
    const lastTime = moment(
      parseInt(store.get(USER.USER_LAST_UPDATE) || 0, 10) * 1000,
    );
    const deltaTime = moment().unix() - lastTime.unix();
    if (deltaTime > 3600 * 2) {
      // 大于 2 小时的才需要更新
      const res = await fetchUserProfile();
      if (res.code === 200) {
        commit(USER.SET_PROFILE, { profile: res.data });
        commit(USER.USER_LAST_UPDATE);
      }
    }
  },
};
const mutations: MutationTree<IUserLoginGlobal> = {
  [USER.SET_TOKEN](_: IUserLoginGlobal, { payCode }: { payCode: string }) {
    _.payCode = payCode;
  },
  [USER.SET_LOGIN_STATUS](
    _: IUserLoginGlobal,
    { loginStatus }: { loginStatus: LOGIN_STATUS },
  ) {
    _.loginStatus = loginStatus;
  },
  [USER.SET_CONFIG](
    _: IUserLoginGlobal,
    {
      c,
    }: {
      c: IUserConfig;
    },
  ) {
    _.config = {
      ...c,
    };
    store.set('config', c);
  },
  [USER.SET_PROFILE](
    _: IUserLoginGlobal,
    {
      profile,
    }: {
      profile: IProfile;
    },
  ) {
    _.username = profile.username;
    _.config = { ...profile.config };
    _.avatar = profile.avatar;
    store.set('config', profile.config);
    store.set('avatar', profile.avatar);
    store.set('username', profile.username);
  },
  [USER.USER_LAST_UPDATE](_: IUserLoginGlobal) {
    store.set(USER.USER_LAST_UPDATE, moment().unix());
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
